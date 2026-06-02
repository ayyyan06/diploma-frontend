from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Security
from sqlalchemy.orm import Session

from src import models, schemas, auth
from src.database import SessionLocal, engine
from src.scoring import compute_result

from src.chat import router as chat_router
from src.ai_recommendations import generate_recommendations


models.Base.metadata.create_all(bind=engine)
load_dotenv()

# ── Coin economy ──────────────────────────────────────────────────────────────

TEST_COST = 100          # монет за прохождение одного теста

# Максимум монет за игру (защита от читов): score / SCORE_PER_COIN монет
GAME_CONFIGS = {
    "platformer_run": {"score_per_coin": 100, "max_coins": 200},
    "platformer_jump": {"score_per_coin": 80,  "max_coins": 150},
    # Баурсак: 1 очко = 20 монет; используем coins_per_score вместо score_per_coin
    "baursak_jump":   {"coins_per_score": 20, "max_coins": 300},
    # Тулпар: 100 очков = 50 монет → 1 очко = 0.5 монет (score_per_coin=2)
    "tulpar_run":     {"score_per_coin": 2,   "max_coins": 500},
}
DEFAULT_GAME_CONFIG = {"score_per_coin": 100, "max_coins": 200}

app = FastAPI()
security = HTTPBearer()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "https://diploma-frontend-b6t2.vercel.app/",
        "https://diploma-back-a49a574c3cdb.herokuapp.com",
        "https://diploma-frontend-lime.vercel.app",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://localhost:5174",
        "https://diploma-admin-frontend.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Dependencies ──────────────────────────────────────────────────────────────

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(security),
    db: Session = Depends(get_db),
):
    token = credentials.credentials
    payload = auth.decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    user = db.query(models.User).filter(models.User.id == int(user_id)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

def require_admin(user: models.User = Depends(get_current_user)):
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return user


# ── Helpers ───────────────────────────────────────────────────────────────────

def _question_options(test: models.Test, q: models.TestQuestion):
    """
    Для personality и animal опции общие и хранятся в scoring_config.scale_options,
    встраиваем их в каждый вопрос.
    Для weapon опции индивидуальны и уже лежат в q.options.
    Для color вопросов нет — возвращаем None.
    """
    if test.type in ("personality", "animal"):
        return test.scoring_config.get("scale_options", [])
    return q.options


# ── Публичные роуты (без токена) ──────────────────────────────────────────────

@app.post("/api/v1/register")
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(
        (models.User.username == user.username) | (models.User.email == user.email)
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")
    new_user = models.User(
        username=user.username, nickname=user.nickname,
        email=user.email, password=auth.hash_password(user.password),
    )
    db.add(new_user)
    db.commit()
    return {"message": "User created successfully"}


@app.post("/api/v1/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not auth.verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = auth.create_token({"sub": str(db_user.id), "email": db_user.email, "username": db_user.username})
    return {"access_token": token, "token_type": "bearer"}


# ── Защищённый роутер (токен обязателен для ВСЕХ роутов внутри) ───────────────

protected = APIRouter(dependencies=[Depends(get_current_user)])


# ── Me ────────────────────────────────────────────────────────────────────────

@protected.get("/api/v1/me")
def get_me(user: models.User = Depends(get_current_user)):
    return {
        "id": user.id,
        "username": user.username,
        "nickname": user.nickname,
        "email": user.email,
        "coins": user.coins,
        "is_admin": user.is_admin,
    }


@protected.put("/api/v1/me")
def update_me(
    payload: schemas.UserUpdate,
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if payload.email and payload.email != user.email:
        if db.query(models.User).filter(models.User.email == payload.email, models.User.id != user.id).first():
            raise HTTPException(status_code=400, detail="Email already in use")
    if payload.username and payload.username != user.username:
        if db.query(models.User).filter(models.User.username == payload.username, models.User.id != user.id).first():
            raise HTTPException(status_code=400, detail="Username already in use")
    if payload.nickname is not None: user.nickname = payload.nickname.strip()
    if payload.email    is not None: user.email    = payload.email.strip().lower()
    if payload.username is not None: user.username = payload.username.strip()
    db.commit()
    db.refresh(user)
    return {"message": "Profile updated successfully", "user": {"id": user.id, "username": user.username, "nickname": user.nickname, "email": user.email, "coins": user.coins}}


# ── Tests ─────────────────────────────────────────────────────────────────────

@protected.get("/api/v1/tests")
def list_tests(db: Session = Depends(get_db)):
    tests = db.query(models.Test).filter(models.Test.is_active == True).all()
    return {
        "tests": [
            {
                "id": t.id,
                "type": t.type,
                "title": t.title,
                "description": t.description,
                "image_src": t.image_src,
                "image_alt": t.image_alt,
                "info_boxes": t.info_boxes,
                "question_count": len(t.questions),
            }
            for t in tests
        ]
    }


@protected.get("/api/v1/tests/{test_id}")
def get_test(test_id: int, db: Session = Depends(get_db)):
    test = db.query(models.Test).filter(models.Test.id == test_id, models.Test.is_active == True).first()
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    return {
        "id": test.id,
        "type": test.type,
        "title": test.title,
        "description": test.description,
        "image_src": test.image_src,
        "image_alt": test.image_alt,
        "info_boxes": test.info_boxes,
        # Опции ответов теперь встроены в каждый вопрос — scale_options здесь не нужны
        "questions": [
            {
                "id": q.id,
                "order": q.order,
                "title": q.title,
                "prompt": q.prompt,
                "options": _question_options(test, q),
            }
            for q in test.questions
        ],
    }


# ── Submit (upsert — перезаписывает если уже проходил) ────────────────────────

@protected.post("/api/v1/tests/{test_id}/submit")
def submit_test(
    test_id: int,
    payload: schemas.SubmitAnswers,
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    from datetime import datetime

    test = db.query(models.Test).filter(
        models.Test.id == test_id, models.Test.is_active == True
    ).first()
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")

    # ── Списываем монеты при каждом прохождении (включая повторное) ──────────
    if user.coins < TEST_COST:
        raise HTTPException(
            status_code=402,
            detail=f"Not enough coins. Test costs {TEST_COST} coins, you have {user.coins}.",
        )
    user.coins -= TEST_COST
    db.add(models.CoinTransaction(
        user_id=user.id,
        amount=-TEST_COST,
        reason="test_unlock",
        meta={"test_id": test_id, "test_title": test.title},
    ))

    existing = db.query(models.TestSubmission).filter(
        models.TestSubmission.user_id == user.id,
        models.TestSubmission.test_id == test_id,
    ).first()

    try:
        result = compute_result(
            test_type=test.type,
            questions=test.questions,
            answers=payload.answers,
            config=test.scoring_config,
        )
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Scoring error: {e}")

    if existing:
        existing.answers = payload.answers
        existing.result = result
        existing.updated_at = datetime.utcnow()
        submission = existing
    else:
        submission = models.TestSubmission(
            user_id=user.id,
            test_id=test.id,
            answers=payload.answers,
            result=result,
        )
        db.add(submission)

    db.commit()
    db.refresh(submission)

    return {"result": submission.result, "coins_remaining": user.coins}


# ── Получить результат по test_id ─────────────────────────────────────────────

@protected.get("/api/v1/tests/{test_id}/result")
def get_test_result(
    test_id: int,
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    row = (
        db.query(models.TestSubmission, models.Test)
        .join(models.Test, models.TestSubmission.test_id == models.Test.id)
        .filter(
            models.TestSubmission.test_id == test_id,
            models.TestSubmission.user_id == user.id,
        )
        .first()
    )
    if not row:
        raise HTTPException(status_code=404, detail="No result yet for this test")

    sub, test = row
    return {
        "test_id": test.id,
        "test_type": test.type,
        "test_title": test.title,
        "result": sub.result,
        "updated_at": sub.updated_at.isoformat(),
    }


# ── История всех результатов юзера ────────────────────────────────────────────

@protected.get("/api/v1/submissions")
def list_submissions(
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    rows = (
        db.query(models.TestSubmission, models.Test)
        .join(models.Test, models.TestSubmission.test_id == models.Test.id)
        .filter(models.TestSubmission.user_id == user.id)
        .order_by(models.TestSubmission.updated_at.desc())
        .all()
    )
    return {
        "submissions": [
            {
                "test_id": test.id,
                "test_type": test.type,
                "test_title": test.title,
                "test_image_src": test.image_src,
                "result": sub.result,
                "updated_at": sub.updated_at.isoformat(),
            }
            for sub, test in rows
        ]
    }


# ── Coins ─────────────────────────────────────────────────────────────────────

@protected.get("/api/v1/coins")
def get_coins(user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Текущий баланс + история транзакций."""
    history = (
        db.query(models.CoinTransaction)
        .filter(models.CoinTransaction.user_id == user.id)
        .order_by(models.CoinTransaction.created_at.desc())
        .limit(50)
        .all()
    )
    return {
        "coins": user.coins,
        "test_cost": TEST_COST,
        "can_afford_test": user.coins >= TEST_COST,
        "history": [
            {
                "amount": t.amount,
                "reason": t.reason,
                "meta": t.meta,
                "created_at": t.created_at.isoformat(),
            }
            for t in history
        ],
    }


@protected.post("/api/v1/coins/claim-game-reward")
def claim_game_reward(
    payload: schemas.GameRewardClaim,
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Фронтенд отправляет результат игры. Сервер пересчитывает допустимые
    монеты и начисляет их пользователю.
    """
    cfg = GAME_CONFIGS.get(payload.game, DEFAULT_GAME_CONFIG)
    if "coins_per_score" in cfg:
        # e.g. baursak_jump: 1 очко = 20 монет
        raw_coins = payload.score * cfg["coins_per_score"]
    else:
        # e.g. tulpar_run: каждые N очков = 1 монета
        raw_coins = payload.score // cfg["score_per_coin"]
    server_coins = min(raw_coins, cfg["max_coins"])

    if server_coins <= 0:
        return {"coins_earned": 0, "coins_total": user.coins, "message": "No coins earned yet — keep playing!"}

    user.coins += server_coins
    db.add(models.CoinTransaction(
        user_id=user.id,
        amount=server_coins,
        reason="game_reward",
        meta={"game": payload.game, "score": payload.score},
    ))
    db.commit()
    db.refresh(user)

    return {
        "coins_earned": server_coins,
        "coins_total": user.coins,
        "can_afford_test": user.coins >= TEST_COST,
        "message": f"You earned {server_coins} coins!",
    }


# ── Admin ─────────────────────────────────────────────────────────────────────

@protected.post("/api/v1/admin/tests")
def create_test(
    payload: schemas.TestCreate,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin),
):
    test_data = payload.model_dump(exclude={"questions"})
    test = models.Test(**test_data)
    db.add(test)
    db.flush()

    for q_data in payload.questions or []:
        question = models.TestQuestion(test_id=test.id, **q_data.model_dump())
        db.add(question)

    db.commit()
    db.refresh(test)
    return {"id": test.id, "type": test.type, "title": test.title}


@protected.put("/api/v1/admin/tests/{test_id}")
def update_test(
    test_id: int,
    payload: schemas.TestUpdate,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin),
):
    test = db.query(models.Test).filter(models.Test.id == test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(test, field, value)
    db.commit()
    db.refresh(test)
    return {"id": test.id, "title": test.title}


@protected.post("/api/v1/admin/tests/{test_id}/questions")
def add_question(
    test_id: int,
    payload: schemas.QuestionCreate,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin),
):
    test = db.query(models.Test).filter(models.Test.id == test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    q = models.TestQuestion(test_id=test_id, **payload.model_dump())
    db.add(q)
    db.commit()
    db.refresh(q)
    return {"id": q.id, "order": q.order, "title": q.title}

@protected.get("/api/v1/admin/tests")
def admin_list_tests(
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin),
):
    tests = db.query(models.Test).order_by(models.Test.id.desc()).all()
    return {
        "tests": [
            {
                "id": t.id,
                "type": t.type,
                "title": t.title,
                "description": t.description,
                "image_src": t.image_src,
                "image_alt": t.image_alt,
                "info_boxes": t.info_boxes,
                "question_count": len(t.questions),
                "is_active": t.is_active,
            }
            for t in tests
        ]
    }


@protected.get("/api/v1/admin/analytics/personality")
def admin_personality_analytics(
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin),
):
    personality_tests = db.query(models.Test).filter(models.Test.type == "personality").all()
    test_ids = [test.id for test in personality_tests]

    profile_catalog = {}
    for test in personality_tests:
        profiles = (test.scoring_config or {}).get("archetype_profiles", {})
        for key, profile in profiles.items():
            profile_catalog.setdefault(
                key,
                {
                    "key": key,
                    "title": profile.get("title", key),
                    "image_src": profile.get("imageSrc"),
                    "image_alt": profile.get("imageAlt"),
                },
            )

    if not test_ids:
        return {"submission_count": 0, "profiles": []}

    submissions = (
        db.query(models.TestSubmission)
        .filter(models.TestSubmission.test_id.in_(test_ids))
        .all()
    )

    counts = {key: 0 for key in profile_catalog.keys()}
    titles = {key: profile["title"] for key, profile in profile_catalog.items()}

    for submission in submissions:
        result = submission.result or {}
        result_key = result.get("resultKey")
        if not result_key:
            continue

        counts[result_key] = counts.get(result_key, 0) + 1
        titles[result_key] = result.get("title", titles.get(result_key, result_key))

        if result_key not in profile_catalog:
            profile_catalog[result_key] = {
                "key": result_key,
                "title": titles[result_key],
                "image_src": result.get("imageSrc"),
                "image_alt": result.get("imageAlt"),
            }

    submission_count = sum(counts.values())
    profiles = []

    for key, profile in profile_catalog.items():
        count = counts.get(key, 0)
        share = round((count / submission_count) * 100, 1) if submission_count else 0.0
        profiles.append(
            {
                "key": key,
                "title": titles.get(key, profile["title"]),
                "count": count,
                "share": share,
                "image_src": profile.get("image_src"),
                "image_alt": profile.get("image_alt"),
            }
        )

    profiles.sort(key=lambda item: (-item["count"], item["title"]))
    return {"submission_count": submission_count, "profiles": profiles}


@protected.get("/api/v1/admin/analytics/tests")
def admin_test_analytics(
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin),
):
    tests = db.query(models.Test).order_by(models.Test.id.asc()).all()
    analytics = []

    for test in tests:
        profile_catalog = {}

        for key, value in (test.scoring_config or {}).items():
            if not key.endswith("_profiles") or not isinstance(value, dict):
                continue

            for profile_key, profile in value.items():
                profile_catalog.setdefault(
                    profile_key,
                    {
                        "key": profile_key,
                        "title": profile.get("title", profile_key),
                        "image_src": profile.get("imageSrc"),
                        "image_alt": profile.get("imageAlt"),
                    },
                )

        submissions = db.query(models.TestSubmission).filter(models.TestSubmission.test_id == test.id).all()
        counts = {key: 0 for key in profile_catalog.keys()}
        titles = {key: profile["title"] for key, profile in profile_catalog.items()}

        for submission in submissions:
            result = submission.result or {}
            result_key = result.get("resultKey")
            if not result_key:
                continue

            counts[result_key] = counts.get(result_key, 0) + 1
            titles[result_key] = result.get("title", titles.get(result_key, result_key))

            if result_key not in profile_catalog:
                profile_catalog[result_key] = {
                    "key": result_key,
                    "title": titles[result_key],
                    "image_src": result.get("imageSrc"),
                    "image_alt": result.get("imageAlt"),
                }

        submission_count = sum(counts.values())
        profiles = []

        for key, profile in profile_catalog.items():
            count = counts.get(key, 0)
            share = round((count / submission_count) * 100, 1) if submission_count else 0.0
            profiles.append(
                {
                    "key": key,
                    "title": titles.get(key, profile["title"]),
                    "count": count,
                    "share": share,
                    "image_src": profile.get("image_src"),
                    "image_alt": profile.get("image_alt"),
                }
            )

        profiles.sort(key=lambda item: (-item["count"], item["title"]))

        analytics.append(
            {
                "test_id": test.id,
                "type": test.type,
                "title": test.title,
                "description": test.description,
                "image_src": test.image_src,
                "image_alt": test.image_alt,
                "is_active": test.is_active,
                "submission_count": submission_count,
                "profiles": profiles,
            }
        )

    return {"tests": analytics}


@protected.get("/api/v1/admin/tests/{test_id}")
def admin_get_test(
    test_id: int,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin),
):
    test = db.query(models.Test).filter(models.Test.id == test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")

    return {
        "id": test.id,
        "type": test.type,
        "title": test.title,
        "description": test.description,
        "image_src": test.image_src,
        "image_alt": test.image_alt,
        "info_boxes": test.info_boxes,
        "scoring_config": test.scoring_config,
        "is_active": test.is_active,
        "questions": [
            {
                "id": q.id,
                "order": q.order,
                "title": q.title,
                "prompt": q.prompt,
                "options": q.options,
                "meta": q.meta,
            }
            for q in test.questions
        ],
    }


@protected.put("/api/v1/admin/questions/{question_id}")
def update_question(
    question_id: int,
    payload: schemas.QuestionUpdate,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin),
):
    question = db.query(models.TestQuestion).filter(models.TestQuestion.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(question, field, value)

    db.commit()
    db.refresh(question)

    return {
        "id": question.id,
        "order": question.order,
        "title": question.title,
        "prompt": question.prompt,
        "options": question.options,
        "meta": question.meta,
    }


@protected.delete("/api/v1/admin/questions/{question_id}")
def delete_question(
    question_id: int,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin),
):
    question = db.query(models.TestQuestion).filter(models.TestQuestion.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    db.delete(question)
    db.commit()
    return {"message": "Question deleted successfully"}


@protected.delete("/api/v1/admin/tests/{test_id}")
def delete_test(
    test_id: int,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin),
):
    test = db.query(models.Test).filter(models.Test.id == test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")

    test.is_active = False
    db.commit()
    db.refresh(test)

    return {"id": test.id, "title": test.title, "is_active": test.is_active}

# ── Community: список пользователей ──────────────────────────────────────────

@protected.get("/api/v1/community/users")
def list_users(
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Все пользователи кроме себя.
    Для каждого возвращает статус дружбы:
      none | pending_sent | pending_received | friends
    """
    all_users = db.query(models.User).filter(models.User.id != user.id).all()

    friendships = db.query(models.Friendship).filter(
        (models.Friendship.requester_id == user.id) |
        (models.Friendship.addressee_id == user.id)
    ).all()

    friend_map = {}
    for f in friendships:
        other = f.addressee_id if f.requester_id == user.id else f.requester_id
        friend_map[other] = f

    result = []
    for u in all_users:
        f = friend_map.get(u.id)
        if not f:
            friendship_status = "none"
        elif f.status == "accepted":
            friendship_status = "friends"
        elif f.status == "pending":
            friendship_status = "pending_sent" if f.requester_id == user.id else "pending_received"
        else:
            friendship_status = "none"  # declined — показываем как none

        result.append({
            "id": u.id,
            "username": u.username,
            "nickname": u.nickname,
            "friendship_status": friendship_status,
            "friendship_id": f.id if f and f.status != "declined" else None,
        })

    return {"users": result}


# ── Community: профиль конкретного пользователя ───────────────────────────────

@protected.get("/api/v1/community/users/{user_id}/profile")
def get_user_profile(
    user_id: int,
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    target = db.query(models.User).filter(models.User.id == user_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="User not found")

    f = db.query(models.Friendship).filter(
        ((models.Friendship.requester_id == user.id) & (models.Friendship.addressee_id == user_id)) |
        ((models.Friendship.requester_id == user_id) & (models.Friendship.addressee_id == user.id))
    ).first()

    if not f:
        friendship_status = "none"
    elif f.status == "accepted":
        friendship_status = "friends"
    elif f.status == "pending":
        friendship_status = "pending_sent" if f.requester_id == user.id else "pending_received"
    else:
        friendship_status = "none"

    return {
        "id": target.id,
        "username": target.username,
        "nickname": target.nickname,
        "friendship_status": friendship_status,
        "friendship_id": f.id if f and f.status != "declined" else None,
    }


# ── Community: публичные результаты тестов пользователя ───────────────────────

@protected.get("/api/v1/community/users/{user_id}/results")
def get_user_results(
    user_id: int,
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Публичные результаты тестов — видны всем авторизованным пользователям.
    Возвращает только основную информацию: тест, картинка, название, описание, subtitle.
    """
    target = db.query(models.User).filter(models.User.id == user_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="User not found")

    rows = (
        db.query(models.TestSubmission, models.Test)
        .join(models.Test, models.TestSubmission.test_id == models.Test.id)
        .filter(models.TestSubmission.user_id == user_id)
        .order_by(models.TestSubmission.updated_at.desc())
        .all()
    )

    return {
        "user": {"id": target.id, "username": target.username, "nickname": target.nickname},
        "results": [
            {
                "test_id": test.id,
                "test_type": test.type,
                "test_title": test.title,
                "result_key": sub.result.get("resultKey"),
                "title": sub.result.get("title"),
                "subtitle": sub.result.get("subtitle"),
                "description": sub.result.get("description"),
                "image_src": sub.result.get("imageSrc"),
                "image_alt": sub.result.get("imageAlt"),
                "updated_at": sub.updated_at.isoformat(),
            }
            for sub, test in rows
        ],
    }


# ── Community: отправить запрос в друзья ─────────────────────────────────────

@protected.post("/api/v1/community/users/{user_id}/friend-request")
def send_friend_request(
    user_id: int,
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if user_id == user.id:
        raise HTTPException(status_code=400, detail="Cannot send a friend request to yourself")

    target = db.query(models.User).filter(models.User.id == user_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="User not found")

    existing = db.query(models.Friendship).filter(
        ((models.Friendship.requester_id == user.id) & (models.Friendship.addressee_id == user_id)) |
        ((models.Friendship.requester_id == user_id) & (models.Friendship.addressee_id == user.id))
    ).first()

    if existing:
        if existing.status == "accepted":
            raise HTTPException(status_code=400, detail="Already friends")
        if existing.status == "pending":
            raise HTTPException(status_code=400, detail="Friend request already pending")
        # declined — разрешаем отправить заново
        existing.requester_id = user.id
        existing.addressee_id = user_id
        existing.status = "pending"
        db.commit()
        db.refresh(existing)
        return {"message": "Friend request sent", "friendship_id": existing.id}

    friendship = models.Friendship(requester_id=user.id, addressee_id=user_id)
    db.add(friendship)
    db.commit()
    db.refresh(friendship)
    return {"message": "Friend request sent", "friendship_id": friendship.id}


# ── Community: ответить на запрос (принять / отклонить) ──────────────────────

@protected.patch("/api/v1/community/friend-requests/{friendship_id}")
def respond_to_friend_request(
    friendship_id: int,
    payload: schemas.FriendRequestAction,
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if payload.action not in ("accepted", "declined"):
        raise HTTPException(status_code=400, detail="action must be 'accepted' or 'declined'")

    f = db.query(models.Friendship).filter(models.Friendship.id == friendship_id).first()
    if not f:
        raise HTTPException(status_code=404, detail="Friend request not found")

    if f.addressee_id != user.id:
        raise HTTPException(status_code=403, detail="Not your friend request")

    if f.status != "pending":
        raise HTTPException(status_code=400, detail=f"Request is already {f.status}")

    f.status = payload.action
    db.commit()
    db.refresh(f)
    return {"message": f"Friend request {payload.action}", "friendship_id": f.id, "status": f.status}


# ── Community: удалить из друзей / отозвать запрос ───────────────────────────

@protected.delete("/api/v1/community/friend-requests/{friendship_id}")
def remove_friend(
    friendship_id: int,
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    f = db.query(models.Friendship).filter(models.Friendship.id == friendship_id).first()
    if not f:
        raise HTTPException(status_code=404, detail="Not found")

    if f.requester_id != user.id and f.addressee_id != user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    db.delete(f)
    db.commit()
    return {"message": "Removed successfully"}


# ── Community: входящие запросы в друзья ─────────────────────────────────────

@protected.get("/api/v1/community/friend-requests/incoming")
def incoming_friend_requests(
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    requests = db.query(models.Friendship).filter(
        models.Friendship.addressee_id == user.id,
        models.Friendship.status == "pending",
    ).all()

    result = []
    for f in requests:
        requester = db.query(models.User).filter(models.User.id == f.requester_id).first()
        result.append({
            "friendship_id": f.id,
            "from_user": {
                "id": requester.id,
                "username": requester.username,
                "nickname": requester.nickname,
            },
            "created_at": f.created_at.isoformat(),
        })

    return {"incoming_requests": result, "count": len(result)}


# ── Community: список друзей ─────────────────────────────────────────────────

@protected.get("/api/v1/community/friends")
def list_friends(
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    friendships = db.query(models.Friendship).filter(
        (models.Friendship.requester_id == user.id) | (models.Friendship.addressee_id == user.id),
        models.Friendship.status == "accepted",
    ).all()

    friends = []
    for f in friendships:
        other_id = f.addressee_id if f.requester_id == user.id else f.requester_id
        other = db.query(models.User).filter(models.User.id == other_id).first()
        friends.append({
            "friendship_id": f.id,
            "user": {"id": other.id, "username": other.username, "nickname": other.nickname},
            "since": f.updated_at.isoformat(),
        })

    return {"friends": friends, "count": len(friends)}


# ── AI-рекомендации ───────────────────────────────────────────────────────────

MIN_TESTS_FOR_RECOMMENDATIONS = 2


@protected.get("/api/v1/me/recommendations")
def get_recommendations(
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Возвращает 3 персонализированных AI-совета на основе пройденных тестов.
    Требует не менее 2 завершённых тестов.
    """
    rows = (
        db.query(models.TestSubmission, models.Test)
        .join(models.Test, models.TestSubmission.test_id == models.Test.id)
        .filter(models.TestSubmission.user_id == user.id)
        .order_by(models.TestSubmission.updated_at.desc())
        .all()
    )

    if len(rows) < MIN_TESTS_FOR_RECOMMENDATIONS:
        return {
            "available": False,
            "reason": "complete_more_tests",
            "submissions_count": len(rows),
            "required_count": MIN_TESTS_FOR_RECOMMENDATIONS,
        }

    submissions = [
        {
            "test_title": test.title,
            "test_type": test.type,
            "result": sub.result or {},
        }
        for sub, test in rows
    ]

    try:
        recommendations = generate_recommendations(submissions)
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception:
        raise HTTPException(status_code=502, detail="Failed to generate recommendations")

    return {
        "available": True,
        "submissions_count": len(rows),
        "recommendations": recommendations,
    }


# ── Подключаем защищённый роутер ──────────────────────────────────────────────

app.include_router(protected)
app.include_router(chat_router)
