"""
Алгоритмы подсчёта результатов.
Каждая функция принимает:
  - questions: список объектов вопросов из БД (уже сериализованных в dict)
  - answers:   {str(question_id): option_id}
  - config:    scoring_config теста из БД

Все функции возвращают единую структуру:
{
    resultKey:        str           — идентификатор результата
    title:            str
    subtitle:         str | None
    imageSrc:         str
    imageAlt:         str
    tagline:          str
    description:      str
    strengths:        list | None
    growthAreas:      list | None
    developmentFocus: str | None
    whyThisResult:    str | None
    details:          dict          — тип-специфичные данные
}
"""

from typing import Any, Dict, List


# ── Helpers ───────────────────────────────────────────────────────────────────

def _scale_score(option_id: str, scale_options: List[Dict]) -> int:
    for opt in scale_options:
        if opt["id"] == option_id:
            return opt["score"]
    return 1


def _normalized(avg: float) -> int:
    return round(((avg - 1) / 3) * 100)


def _trait_level(score: int) -> str:
    if score >= 67:
        return "high"
    if score <= 33:
        return "low"
    return "moderate"


def _narrative(key: str, score: int, narratives: Dict) -> str:
    return narratives.get(key, {}).get(_trait_level(score), "")


# ── Personality (Big Five → Kazakh archetype) ─────────────────────────────────

def _compute_personality(questions, answers, config) -> Dict:
    traits = config["traits"]
    scale_options = config["scale_options"]
    archetype_profiles = config["archetype_profiles"]
    trait_weights = config.get("trait_weights", {})
    narratives = config["narratives"]

    totals = {t["key"]: 0.0 for t in traits}
    counts = {t["key"]: 0 for t in traits}

    for q in questions:
        answer_id = answers.get(str(q["id"]))
        if not answer_id:
            continue
        raw = _scale_score(answer_id, scale_options)
        score = 5 - raw if q["meta"].get("reverse") else raw
        trait = q["meta"]["trait"]
        totals[trait] += score
        counts[trait] += 1

    big_five: Dict[str, int] = {}
    for t in traits:
        avg = totals[t["key"]] / counts[t["key"]] if counts[t["key"]] else 1.0
        big_five[t["key"]] = _normalized(avg)

    entries = []
    for key, arch in archetype_profiles.items():
        dist = sum(
            abs(big_five[t["key"]] - arch["targets"][t["key"]])
            * trait_weights.get(t["key"], 1.0)
            for t in traits
        )
        entries.append({**arch, "key": key, "_dist": dist})

    entries.sort(key=lambda x: x["_dist"])
    leading = entries[0]
    shadow = entries[1]

    sorted_traits = sorted(traits, key=lambda t: big_five[t["key"]], reverse=True)
    top_keys = [t["key"] for t in sorted_traits]

    first, second = sorted_traits[0], sorted_traits[1]
    lowest_label = next(t["label"] for t in traits if t["key"] == top_keys[-1])

    why = (
        f"{leading['title']} fits best because your profile leans most strongly toward "
        f"{first['label'].lower()} and {second['label'].lower()}. "
        f"{_narrative(first['key'], big_five[first['key']], narratives)}"
    )

    return {
        "resultKey": leading["key"],
        "title": leading["title"],
        "subtitle": leading.get("subtitle"),
        "imageSrc": leading["imageSrc"],
        "imageAlt": leading["imageAlt"],
        "tagline": leading["tagline"],
        "description": leading["description"],
        "strengths": leading["strengths"],
        "growthAreas": leading["growthAreas"],
        "developmentFocus": lowest_label,
        "whyThisResult": why,
        "details": {
            "shadowArchetype": shadow["title"],
            "topTraits": [first["label"], second["label"]],
            "bigFive": [
                {
                    **t,
                    "score": big_five[t["key"]],
                    "narrative": _narrative(t["key"], big_five[t["key"]], narratives),
                }
                for t in traits
            ],
        },
    }


# ── Animal (Eysenck 2-axis → Kazakh animal) ───────────────────────────────────

def _compute_animal(questions, answers, config) -> Dict:
    axes = config["axes"]
    scale_options = config["scale_options"]
    profiles = config["animal_profiles"]
    narratives = config["narratives"]

    totals = {a["key"]: 0.0 for a in axes}
    counts = {a["key"]: 0 for a in axes}

    for q in questions:
        answer_id = answers.get(str(q["id"]))
        if not answer_id:
            continue
        raw = _scale_score(answer_id, scale_options)
        score = 5 - raw if q["meta"].get("reverse") else raw
        axis = q["meta"]["axis"]
        totals[axis] += score
        counts[axis] += 1

    scores: Dict[str, int] = {}
    for a in axes:
        avg = totals[a["key"]] / counts[a["key"]] if counts[a["key"]] else 1.0
        scores[a["key"]] = _normalized(avg)

    is_extraverted = scores["extraversion"] >= 50
    is_stable = scores["stability"] >= 50

    if is_extraverted and is_stable:
        animal_key = "horse"
    elif is_extraverted and not is_stable:
        animal_key = "wolf"
    elif not is_extraverted and is_stable:
        animal_key = "snowLeopard"
    else:
        animal_key = "eagle"

    profile = profiles[animal_key]

    distances = [
        {
            "label": "Outward expression",
            "distance": abs(scores["extraversion"] - 50),
            "preferred": scores["extraversion"] < 50,
        },
        {
            "label": "Emotional regulation",
            "distance": abs(scores["stability"] - 50),
            "preferred": scores["stability"] < 50,
        },
    ]
    distances.sort(key=lambda x: x["distance"])
    dev_focus = next(
        (d["label"] for d in distances if d["preferred"]),
        distances[0]["label"],
    )

    ext_label = "extraversion" if is_extraverted else "introversion"
    stab_label = "emotional stability" if is_stable else "emotional instability"
    why = (
        f"Your answers leaned toward {ext_label} and {stab_label}. "
        f"In Eysenck's two-axis model, that combination corresponds to the "
        f"{profile['temperament'].lower()} temperament. "
        f"In this Kazakh animal retelling, that pattern is expressed through "
        f"the {profile['title'].lower()}. "
        f"{_narrative('extraversion', scores['extraversion'], narratives)} "
        f"{_narrative('stability', scores['stability'], narratives)}"
    )

    return {
        "resultKey": profile["key"],
        "title": profile["title"],
        "subtitle": profile.get("subtitle"),
        "imageSrc": profile["imageSrc"],
        "imageAlt": profile["imageAlt"],
        "tagline": profile["tagline"],
        "description": profile["description"],
        "strengths": profile["strengths"],
        "growthAreas": profile["growthAreas"],
        "developmentFocus": dev_focus,
        "whyThisResult": why,
        "details": {
            "temperament": profile["temperament"],
            "quadrant": profile["quadrant"],
            "coreTraits": profile["coreTraits"],
            "axes": [
                {
                    **a,
                    "score": scores[a["key"]],
                    "narrative": _narrative(a["key"], scores[a["key"]], narratives),
                    "leaningLabel": a["highPole"] if scores[a["key"]] >= 50 else a["lowPole"],
                }
                for a in axes
            ],
        },
    }


# ── Weapon (Thomas-Kilmann → Kazakh weapon) ───────────────────────────────────

def _compute_weapon(questions, answers, config) -> Dict:
    profiles = config["weapon_profiles"]
    result_order = config.get("result_order", list(profiles.keys()))

    tally: Dict[str, int] = {k: 0 for k in result_order}

    for q in questions:
        answer_id = answers.get(str(q["id"]))
        if not answer_id:
            continue
        for opt in (q.get("options") or []):
            if opt["id"] == answer_id:
                tally[opt["resultKey"]] += 1
                break

    winner = max(result_order, key=lambda k: tally[k])
    profile = profiles[winner]

    return {
        "resultKey": winner,
        "title": profile["title"],
        "subtitle": profile.get("subtitle"),
        "imageSrc": profile["imageSrc"],
        "imageAlt": profile["imageAlt"],
        "tagline": profile["tagline"],
        "description": profile["description"],
        "strengths": profile["strengths"],
        "growthAreas": profile["growthAreas"],
        "developmentFocus": None,
        "whyThisResult": None,
        "details": {
            "scores": tally,
        },
    }


# ── Color (Luscher-inspired) ───────────────────────────────────────────────────

def _compute_color(questions, answers, config) -> Dict:
    """
    answers = {"round1": ["red","blue",...], "round2": ["blue","red",...]}
    Первый цвет в round1 — самый желанный сейчас.
    Последний цвет в round2 — самый отвергаемый.
    """
    profiles = config["color_profiles"]
    narratives = config.get("narratives", {})

    round1: List[str] = answers.get("round1", [])
    round2: List[str] = answers.get("round2", [])

    primary_color = round1[0] if round1 else None
    rejected_color = round2[-1] if round2 else None

    primary_profile = profiles.get(primary_color, {})
    rejected_profile = profiles.get(rejected_color, {})

    return {
        "resultKey": primary_color,
        "title": primary_profile.get("title", ""),
        "subtitle": None,
        "imageSrc": primary_profile.get("imageSrc", ""),
        "imageAlt": primary_profile.get("imageAlt", ""),
        "tagline": primary_profile.get("tagline", ""),
        "description": primary_profile.get("description", ""),
        "strengths": None,
        "growthAreas": None,
        "developmentFocus": None,
        "whyThisResult": None,
        "details": {
            "rejectedColor": rejected_color,
            "currentNeed": primary_profile.get("currentNeed", ""),
            "avoidance": rejected_profile.get("meaning", ""),
            "round1Order": round1,
            "round2Order": round2,
        },
    }


# ── Router ────────────────────────────────────────────────────────────────────

def compute_result(test_type: str, questions: List, answers: Dict, config: Dict) -> Dict:
    # Сериализуем вопросы в dict если это ORM-объекты
    qs = [
        {
            "id": q.id,
            "order": q.order,
            "title": q.title,
            "prompt": q.prompt,
            "options": q.options,
            "meta": q.meta,
        }
        if not isinstance(q, dict)
        else q
        for q in questions
    ]

    if test_type == "personality":
        return _compute_personality(qs, answers, config)
    elif test_type == "animal":
        return _compute_animal(qs, answers, config)
    elif test_type == "weapon":
        return _compute_weapon(qs, answers, config)
    elif test_type == "color":
        return _compute_color(qs, answers, config)
    else:
        raise ValueError(f"Unknown test type: {test_type}")