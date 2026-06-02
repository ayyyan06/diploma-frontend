"""
Запусти один раз: python -m src.seeder
Заполняет БД тестами и вопросами из исходных данных.
"""

from src.database import SessionLocal, engine
from src import models

models.Base.metadata.create_all(bind=engine)

# ── Общие scale_options ───────────────────────────────────────────────────────

LIKERT_4 = [
    {"id": "strongly-disagree", "label": "Strongly disagree", "score": 1},
    {"id": "somewhat-disagree", "label": "Somewhat disagree", "score": 2},
    {"id": "somewhat-agree",    "label": "Somewhat agree",    "score": 3},
    {"id": "strongly-agree",    "label": "Strongly agree",    "score": 4},
]

# ── Personality data ──────────────────────────────────────────────────────────

PERSONALITY_SCORING_CONFIG = {
    "scale_options": LIKERT_4,
    "traits": [
        {"key": "openness",          "label": "Openness",          "shortLabel": "O", "description": "curiosity, imagination, symbolic thinking"},
        {"key": "conscientiousness", "label": "Conscientiousness", "shortLabel": "C", "description": "discipline, reliability, structure"},
        {"key": "extraversion",      "label": "Extraversion",      "shortLabel": "E", "description": "assertiveness, social energy, visible action"},
        {"key": "agreeableness",     "label": "Agreeableness",     "shortLabel": "A", "description": "care, cooperation, warmth"},
        {"key": "neuroticism",       "label": "Neuroticism",       "shortLabel": "N", "description": "stress sensitivity, emotional reactivity"},
    ],
    "trait_weights": {
        "openness": 1, "conscientiousness": 1.05,
        "extraversion": 1, "agreeableness": 1, "neuroticism": 0.95,
    },
    "archetype_profiles": {
        "batyr": {
            "key": "batyr", "title": "Batyr - The Hero",
            "subtitle": "Jungian analogue: Hero",
            "imageSrc": "/images/batyr.svg", "imageAlt": "Batyr archetype result",
            "tagline": "Action, courage, and duty under pressure.",
            "description": "The Batyr profile reflects a person who meets difficulty by acting, protecting, and carrying responsibility. In Jungian terms this is the Hero pattern, expressed through Kazakh cultural memory as the defender who steps forward when the group needs strength.",
            "strengths": ["steps into responsibility instead of freezing", "can turn pressure into decisive movement", "protects others when stakes become real"],
            "growthAreas": ["may over-identify with being strong all the time", "can move too quickly before listening deeply", "may hide vulnerability behind competence"],
            "targets": {"openness": 56, "conscientiousness": 82, "extraversion": 78, "agreeableness": 58, "neuroticism": 24},
        },
        "zhyrau": {
            "key": "zhyrau", "title": "Zhyrau - The Sage",
            "subtitle": "Jungian analogue: Sage",
            "imageSrc": "/images/zhyrau.svg", "imageAlt": "Zhyrau archetype result",
            "tagline": "Meaning, reflection, and long-range insight.",
            "description": "The Zhyrau profile reflects the Sage: the one who observes, interprets, and gives language to what others feel but cannot yet explain.",
            "strengths": ["sees patterns and meanings others miss", "thinks before speaking or acting", "can guide through insight rather than force"],
            "growthAreas": ["may stay in reflection longer than action requires", "can become too distant from immediate realities", "may overcomplicate simple emotional needs"],
            "targets": {"openness": 88, "conscientiousness": 60, "extraversion": 38, "agreeableness": 66, "neuroticism": 40},
        },
        "shanyraq": {
            "key": "shanyraq", "title": "Shanyraq Keeper - The Mother",
            "subtitle": "Jungian analogue: Mother",
            "imageSrc": "/images/shanyraqkeeper.svg", "imageAlt": "Shanyraq Keeper archetype result",
            "tagline": "Care, protection, and emotional holding.",
            "description": "The Shanyraq Keeper profile reflects the Mother archetype: the person who creates continuity, warmth, and relational safety.",
            "strengths": ["builds trust and belonging naturally", "senses emotional atmosphere quickly", "supports people with steadiness and care"],
            "growthAreas": ["may over-function for everyone else", "can postpone conflict to preserve harmony", "may carry more emotional labor than is fair"],
            "targets": {"openness": 52, "conscientiousness": 74, "extraversion": 50, "agreeableness": 90, "neuroticism": 46},
        },
        "aldarKose": {
            "key": "aldarKose", "title": "Aldar Kose - The Trickster",
            "subtitle": "Jungian analogue: Trickster",
            "imageSrc": "/images/aldarkose.svg", "imageAlt": "Aldar Kose archetype result",
            "tagline": "Cleverness, adaptability, and rule-bending insight.",
            "description": "The Aldar Kose profile reflects the Trickster: psychologically flexible, observant, and hard to trap inside rigid expectations.",
            "strengths": ["adapts quickly when systems stop making sense", "spots hypocrisy, weak logic, and hidden openings", "uses humor and intelligence to disarm pressure"],
            "growthAreas": ["may resist structure even when it would help", "can treat seriousness as something to evade", "may protect autonomy so strongly that trust becomes harder"],
            "targets": {"openness": 84, "conscientiousness": 34, "extraversion": 68, "agreeableness": 36, "neuroticism": 42},
        },
    },
    "narratives": {
        "openness":          {"high": "You are psychologically open to ambiguity, symbolism, and unusual perspectives.", "moderate": "You balance imagination with practicality and can move between novelty and familiarity.", "low": "You tend to trust proven paths, direct realities, and what already feels grounded."},
        "conscientiousness": {"high": "You rely on structure, self-control, and follow-through to create stability.", "moderate": "You can organize when needed, but you do not want structure to control everything.", "low": "You prefer flexibility over routine and may resist systems that feel too constraining."},
        "extraversion":      {"high": "You move outward under pressure and often meet life through visible action or expression.", "moderate": "You can be socially engaged or private depending on context, energy, and trust.", "low": "You process more inwardly and may prefer depth, privacy, and observation before action."},
        "agreeableness":     {"high": "You orient strongly toward care, cooperation, and the emotional needs of others.", "moderate": "You value both warmth and honesty, and you can balance care with self-protection.", "low": "You prioritize autonomy, candor, and skepticism over immediate harmony or accommodation."},
        "neuroticism":       {"high": "You feel emotional pressure strongly, which can deepen empathy but also increase strain.", "moderate": "You experience stress clearly, but it does not dominate your whole psychological style.", "low": "You tend to stay internally steady under stress and are less easily pulled into emotional turbulence."},
    },
}

PERSONALITY_QUESTIONS = [
    {"order": 1,  "title": "When uncertainty rises, I usually step forward instead of waiting.",        "prompt": "Answer as you are most of the time, not as you wish to be.", "meta": {"trait": "extraversion"}},
    {"order": 2,  "title": "I am drawn to symbols, stories, and meanings beneath the surface.",                                                                                "meta": {"trait": "openness"}},
    {"order": 3,  "title": "If I promise something, I usually follow through even when it is difficult.",                                                                       "meta": {"trait": "conscientiousness"}},
    {"order": 4,  "title": "I notice quickly when someone nearby feels left out, hurt, or unsafe.",                                                                             "meta": {"trait": "agreeableness"}},
    {"order": 5,  "title": "Stress can stay in my thoughts or body longer than I want.",                                                                                        "meta": {"trait": "neuroticism"}},
    {"order": 6,  "title": "In groups, I often hold back instead of taking visible space.",                                                                                     "meta": {"trait": "extraversion",      "reverse": True}},
    {"order": 7,  "title": "I prefer familiar methods over experimenting with a new angle.",                                                                                    "meta": {"trait": "openness",          "reverse": True}},
    {"order": 8,  "title": "I often act first and trust myself to organize the details later.",                                                                                 "meta": {"trait": "conscientiousness", "reverse": True}},
    {"order": 9,  "title": "In conflict, proving my point matters more to me than preserving warmth.",                                                                          "meta": {"trait": "agreeableness",     "reverse": True}},
    {"order": 10, "title": "When plans collapse, I usually stay emotionally steady.",                                                                                           "meta": {"trait": "neuroticism",       "reverse": True}},
    {"order": 11, "title": "I feel more alive after active exchange and action than after long isolation.",                                                                      "meta": {"trait": "extraversion"}},
    {"order": 12, "title": "I enjoy rethinking rules, patterns, and accepted ideas from unusual angles.",                                                                       "meta": {"trait": "openness"}},
    {"order": 13, "title": "I work best when I can turn values into structure, habit, and follow-through.",                                                                     "meta": {"trait": "conscientiousness"}},
    {"order": 14, "title": "People often trust me to keep a group connected, safe, or emotionally warm.",                                                                       "meta": {"trait": "agreeableness"}},
    {"order": 15, "title": "Betrayal, uncertainty, or emotional tension affects me strongly.",                                                                                  "meta": {"trait": "neuroticism"}},
]

# ── Animal data ───────────────────────────────────────────────────────────────

ANIMAL_SCORING_CONFIG = {
    "scale_options": LIKERT_4,
    "axes": [
        {"key": "extraversion", "label": "Extraversion",       "lowPole": "Introversion", "highPole": "Extraversion"},
        {"key": "stability",    "label": "Emotional Stability", "lowPole": "Instability",  "highPole": "Stability"},
    ],
    "animal_profiles": {
        "snowLeopard": {
            "key": "snowLeopard", "title": "Snow Leopard - The Phlegmatic",
            "subtitle": "Eysenck temperament: Phlegmatic", "temperament": "Phlegmatic", "quadrant": "Introvert + Stable",
            "imageSrc": "/images/snowleo.svg", "imageAlt": "Snow Leopard result",
            "tagline": "Quiet steadiness, contained depth, and calm endurance.",
            "coreTraits": ["reserve", "stability", "patience"],
            "description": "In this test, the snow leopard represents the phlegmatic quadrant of Eysenck's model: introverted but emotionally steady.",
            "strengths": ["stays composed in difficult situations", "observes deeply before acting", "does not waste energy on unnecessary drama"],
            "growthAreas": ["may stay too private for others to read easily", "can delay expression until the moment passes", "may appear distant when actually just self-contained"],
        },
        "wolf": {
            "key": "wolf", "title": "Wolf - The Choleric",
            "subtitle": "Eysenck temperament: Choleric", "temperament": "Choleric", "quadrant": "Extravert + Unstable",
            "imageSrc": "/images/wolf.svg", "imageAlt": "Wolf result",
            "tagline": "Intensity, outward drive, and emotionally charged action.",
            "coreTraits": ["intensity", "drive", "reactivity"],
            "description": "In this reading, the wolf stands for the choleric pattern in Eysenck's model: outward-moving, forceful, and more emotionally reactive under strain.",
            "strengths": ["acts quickly when the situation becomes urgent", "brings passion and visible energy to people or causes", "protects the group with force and immediacy"],
            "growthAreas": ["may react before enough reflection", "can intensify tension without meaning to", "may find it hard to slow down once emotionally activated"],
        },
        "horse": {
            "key": "horse", "title": "Horse - The Sanguine",
            "subtitle": "Eysenck temperament: Sanguine", "temperament": "Sanguine", "quadrant": "Extravert + Stable",
            "imageSrc": "/images/horse.svg", "imageAlt": "Horse result",
            "tagline": "Warm momentum, sociability, and steady outward energy.",
            "coreTraits": ["sociability", "optimism", "steadiness"],
            "description": "In Eysenck's framework, the horse reflects the sanguine quadrant: extraverted and emotionally stable.",
            "strengths": ["brings steady energy into groups and shared activity", "recovers well after stress or disruption", "connects with people without losing overall balance"],
            "growthAreas": ["may underestimate quieter or slower emotional processes", "can keep moving instead of pausing for depth", "may rely on momentum when stillness is needed"],
        },
        "eagle": {
            "key": "eagle", "title": "Eagle - The Melancholic",
            "subtitle": "Eysenck temperament: Melancholic", "temperament": "Melancholic", "quadrant": "Introvert + Unstable",
            "imageSrc": "/images/eagle.svg", "imageAlt": "Eagle result",
            "tagline": "Inner depth, sensitivity, and watchful intensity.",
            "coreTraits": ["sensitivity", "depth", "reflection"],
            "description": "Here the eagle represents the melancholic quadrant in Eysenck's model: introverted, reflective, and more emotionally sensitive to pressure.",
            "strengths": ["notices subtle signals and hidden meaning quickly", "thinks with depth rather than surface reaction", "cares intensely about what feels true or important"],
            "growthAreas": ["may carry stress inward for too long", "can become overwhelmed by uncertainty or criticism", "may withdraw when support would actually help"],
        },
    },
    "narratives": {
        "extraversion": {"high": "You move outward for energy, expression, and visible involvement.", "moderate": "You can be socially active or private depending on context and trust.", "low": "You process more inwardly and often prefer depth, privacy, and observation."},
        "stability":    {"high": "You tend to stay emotionally steady and recover your balance relatively fast.", "moderate": "You feel pressure clearly, but it does not control your whole style.", "low": "You are more emotionally reactive under stress and may carry tension for longer."},
    },
}

ANIMAL_QUESTIONS = [
    {"order": 1,  "title": "I gain energy from active contact, visible movement, and being part of what is happening.", "prompt": "Answer as you are most of the time, not as you wish to be.", "meta": {"axis": "extraversion"}},
    {"order": 2,  "title": "Before responding outwardly, I usually need private space to process things inwardly.",                                                                               "meta": {"axis": "extraversion", "reverse": True}},
    {"order": 3,  "title": "In a group, I naturally take social space instead of staying in the background.",                                                                                   "meta": {"axis": "extraversion"}},
    {"order": 4,  "title": "Too much social stimulation drains me faster than it energizes me.",                                                                                                "meta": {"axis": "extraversion", "reverse": True}},
    {"order": 5,  "title": "When plans collapse or pressure rises, I usually remain calmer than people expect.",                                                                                "meta": {"axis": "stability"}},
    {"order": 6,  "title": "Stress can change my mood quickly and strongly.",                                                                                                                   "meta": {"axis": "stability",    "reverse": True}},
    {"order": 7,  "title": "I recover my emotional balance fairly fast after tension or conflict.",                                                                                              "meta": {"axis": "stability"}},
    {"order": 8,  "title": "Uncertainty can stay in my thoughts or body for a long time.",                                                                                                      "meta": {"axis": "stability",    "reverse": True}},
    {"order": 9,  "title": "I usually prefer outward momentum and interaction over long periods of quiet observation.",                                                                          "meta": {"axis": "extraversion"}},
    {"order": 10, "title": "I would rather observe carefully than react immediately in public.",                                                                                                 "meta": {"axis": "extraversion", "reverse": True}},
    {"order": 11, "title": "Even under emotional pressure, I tend to stay internally steady.",                                                                                                   "meta": {"axis": "stability"}},
    {"order": 12, "title": "I am easily unsettled by emotional intensity around me.",                                                                                                            "meta": {"axis": "stability",    "reverse": True}},
]

# ── Weapon data ───────────────────────────────────────────────────────────────

WEAPON_SCORING_CONFIG = {
    "result_order": ["bow", "spear", "saber", "shield"],
    "weapon_profiles": {
        "bow": {
            "key": "bow", "title": "Bow - The Strategist",
            "subtitle": "Thomas-Kilmann style: Avoiding / Accommodating",
            "imageSrc": "/images/bow.svg", "imageAlt": "Bow result",
            "tagline": "Strategic restraint, patient observation, and timed response.",
            "description": "The Bow represents the person who reads the terrain before acting. You do not avoid conflict out of fear — you wait for the right moment, minimize unnecessary damage, and strike only when the angle is clear.",
            "strengths": ["avoids unnecessary escalation", "reads the room before acting", "creates space for better timing"],
            "growthAreas": ["may wait too long and lose the moment", "can appear passive when clarity is needed", "may let tension fester through avoidance"],
        },
        "spear": {
            "key": "spear", "title": "Spear - The Asserter",
            "subtitle": "Thomas-Kilmann style: Competing",
            "imageSrc": "/images/spear.svg", "imageAlt": "Spear result",
            "tagline": "Direct confrontation, clear position, and honest force.",
            "description": "The Spear represents the person who names the conflict directly and pushes it into the open. You believe clarity is respect, and that leaving things unspoken does more damage than honest confrontation.",
            "strengths": ["speaks directly and without deflection", "defends position under pressure", "cuts through ambiguity quickly"],
            "growthAreas": ["may push too hard without listening", "can escalate when de-escalation would work better", "may prioritize being right over being effective"],
        },
        "saber": {
            "key": "saber", "title": "Saber - The Negotiator",
            "subtitle": "Thomas-Kilmann style: Compromising",
            "imageSrc": "/images/saber.svg", "imageAlt": "Saber result",
            "tagline": "Flexible movement, mutual concession, and workable outcomes.",
            "description": "The Saber represents the person who finds the middle path. You move fluidly, trade concessions, and look for outcomes both sides can live with rather than holding firm on one position.",
            "strengths": ["finds workable ground quickly", "keeps things moving when others freeze", "reads what both sides need and bridges the gap"],
            "growthAreas": ["may compromise too early before exploring better options", "can lose their own position in the process", "may avoid the deeper issue to reach a surface solution"],
        },
        "shield": {
            "key": "shield", "title": "Shield - The Protector",
            "subtitle": "Thomas-Kilmann style: Collaborating / Accommodating",
            "imageSrc": "/images/shield.svg", "imageAlt": "Shield result",
            "tagline": "Relational safety, emotional care, and trust preservation.",
            "description": "The Shield represents the person who protects the connection first. You read emotional temperature quickly, lower the heat, and make sure people feel safe enough to resolve things without breaking what matters.",
            "strengths": ["keeps relationships intact under pressure", "lowers emotional temperature quickly", "makes others feel heard and respected"],
            "growthAreas": ["may avoid necessary conflict to protect the relationship", "can carry more emotional labor than is fair", "may prioritize harmony over honest resolution"],
        },
    },
}

WEAPON_QUESTIONS = [
    {
        "order": 1, "title": "When a disagreement begins,  what is your first instinct?",
        "prompt": "Choose the response that feels most natural in real conflict.",
        "options": [
            {"id": "w1-bow",   "label": "Step back, observe, and wait for the right moment to respond", "resultKey": "bow"},
            {"id": "w1-spear", "label": "State my position directly and push the issue into the open",   "resultKey": "spear"},
            {"id": "w1-saber", "label": "Look for a workable middle ground before things harden",        "resultKey": "saber"},
            {"id": "w1-shield","label": "Calm the tension and protect the relationship first",            "resultKey": "shield"},
        ],
        "meta": {},
    },
    {
        "order": 2, "title": "In a tense team discussion, you usually…",
        "options": [
            {"id": "w2-bow",   "label": "Watch quietly until there is a strategic opening",   "resultKey": "bow"},
            {"id": "w2-spear", "label": "Push clearly for the solution I believe is right",   "resultKey": "spear"},
            {"id": "w2-saber", "label": "Trade concessions so everyone can keep moving",       "resultKey": "saber"},
            {"id": "w2-shield","label": "Make sure each person feels heard and respected",     "resultKey": "shield"},
        ],
        "meta": {},
    },
    {
        "order": 3, "title": "If someone crosses your boundary, what feels most natural?",
        "options": [
            {"id": "w3-bow",   "label": "Create distance and decide later whether to engage", "resultKey": "bow"},
            {"id": "w3-spear", "label": "Confront it immediately and firmly",                  "resultKey": "spear"},
            {"id": "w3-saber", "label": "Negotiate new terms that both sides can live with",   "resultKey": "saber"},
            {"id": "w3-shield","label": "Name the impact gently while keeping trust intact",   "resultKey": "shield"},
        ],
        "meta": {},
    },
    {
        "order": 4, "title": "What matters most to you inside a conflict?",
        "options": [
            {"id": "w4-bow",   "label": "Avoiding unnecessary escalation", "resultKey": "bow"},
            {"id": "w4-spear", "label": "Defending my position clearly",    "resultKey": "spear"},
            {"id": "w4-saber", "label": "Reaching a practical solution fast","resultKey": "saber"},
            {"id": "w4-shield","label": "Preserving trust and safety",      "resultKey": "shield"},
        ],
        "meta": {},
    },
    {
        "order": 5, "title": "A long argument drains you most when…",
        "options": [
            {"id": "w5-bow",   "label": "It forces confrontation before I am ready",          "resultKey": "bow"},
            {"id": "w5-spear", "label": "People avoid saying what they really mean",           "resultKey": "spear"},
            {"id": "w5-saber", "label": "Neither side is willing to give a little",            "resultKey": "saber"},
            {"id": "w5-shield","label": "The relationship starts feeling emotionally unsafe",   "resultKey": "shield"},
        ],
        "meta": {},
    },
    {
        "order": 6, "title": "When two people around you clash, you tend to…",
        "options": [
            {"id": "w6-bow",   "label": "Stay back and read the dynamics before stepping in", "resultKey": "bow"},
            {"id": "w6-spear", "label": "Cut through the tension with a decisive stance",     "resultKey": "spear"},
            {"id": "w6-saber", "label": "Broker a middle path both people can accept",         "resultKey": "saber"},
            {"id": "w6-shield","label": "Lower the emotional heat and protect the bond",       "resultKey": "shield"},
        ],
        "meta": {},
    },
    {
        "order": 7, "title": "Which conflict strength sounds most like you?",
        "options": [
            {"id": "w7-bow",   "label": "Strategic restraint",       "resultKey": "bow"},
            {"id": "w7-spear", "label": "Assertive clarity",          "resultKey": "spear"},
            {"id": "w7-saber", "label": "Flexible negotiation",       "resultKey": "saber"},
            {"id": "w7-shield","label": "Protective cooperation",     "resultKey": "shield"},
        ],
        "meta": {},
    },
    {
        "order": 8, "title": "A conflict feels well resolved to you when…",
        "options": [
            {"id": "w8-bow",   "label": "Damage was minimised and space was created",         "resultKey": "bow"},
            {"id": "w8-spear", "label": "My position was defended honestly and clearly",       "resultKey": "spear"},
            {"id": "w8-saber", "label": "Both sides gave a little and gained a little",        "resultKey": "saber"},
            {"id": "w8-shield","label": "People leave feeling respected and connected",        "resultKey": "shield"},
        ],
        "meta": {},
    },
]


# ── Seed function ─────────────────────────────────────────────────────────────

"""
Demo users credentials
──────────────────────────────────────────────
 #  nickname        email                    password
 1  Aisha Bekova    aisha@demo.com           demo1234
 2  Nurlan Seitkali nurlan@demo.com          demo1234
 3  Zarina Akhmet   zarina@demo.com          demo1234
 4  Damir Orazov    damir@demo.com           demo1234
 5  Kamila Dzhaksyb kamila@demo.com          demo1234
──────────────────────────────────────────────
"""

# Pre-computed results for demo users
# Each tuple: (test_type, answers_dict, result_dict)
# result_dict is the output of compute_result() — we store it directly
# so the seeder does not depend on scoring logic at runtime.

DEMO_USERS = [
    {
        "username": "aisha_b",
        "nickname": "Aisha Bekova",
        "email": "aisha@demo.com",
        "password": "demo1234",
        "coins": 500,
        "submissions": [
            {
                "test_type": "personality",
                "result": {
                    "resultKey": "shanyraq",
                    "title": "Shanyraq Keeper - The Mother",
                    "subtitle": "Jungian analogue: Mother",
                    "imageSrc": "/images/shanyraqkeeper.svg",
                    "imageAlt": "Shanyraq Keeper archetype result",
                    "tagline": "Care, protection, and emotional holding.",
                    "description": "The Shanyraq Keeper profile reflects the Mother archetype: the person who creates continuity, warmth, and relational safety.",
                    "strengths": ["builds trust and belonging naturally", "senses emotional atmosphere quickly", "supports people with steadiness and care"],
                    "growthAreas": ["may over-function for everyone else", "can postpone conflict to preserve harmony", "may carry more emotional labor than is fair"],
                    "developmentFocus": "Neuroticism",
                    "whyThisResult": "Shanyraq Keeper fits best because your profile leans most strongly toward agreeableness and conscientiousness.",
                    "details": {
                        "shadowArchetype": "Batyr - The Hero",
                        "topTraits": ["Agreeableness", "Conscientiousness"],
                        "bigFive": [],
                    },
                },
            },
            {
                "test_type": "animal",
                "result": {
                    "resultKey": "horse",
                    "title": "Horse - The Sanguine",
                    "subtitle": "Eysenck temperament: Sanguine",
                    "imageSrc": "/images/horse.svg",
                    "imageAlt": "Horse result",
                    "tagline": "Warm momentum, sociability, and steady outward energy.",
                    "description": "In Eysenck's framework, the horse reflects the sanguine quadrant: extraverted and emotionally stable.",
                    "strengths": ["brings steady energy into groups and shared activity", "recovers well after stress or disruption", "connects with people without losing overall balance"],
                    "growthAreas": ["may underestimate quieter or slower emotional processes", "can keep moving instead of pausing for depth", "may rely on momentum when stillness is needed"],
                    "developmentFocus": "Outward expression",
                    "whyThisResult": "Your answers leaned toward extraversion and emotional stability.",
                    "details": {"temperament": "Sanguine", "quadrant": "Extravert + Stable", "coreTraits": ["sociability", "optimism", "steadiness"], "axes": []},
                },
            },
        ],
    },
    {
        "username": "nurlan_s",
        "nickname": "Nurlan Seitkali",
        "email": "nurlan@demo.com",
        "password": "demo1234",
        "coins": 300,
        "submissions": [
            {
                "test_type": "personality",
                "result": {
                    "resultKey": "batyr",
                    "title": "Batyr - The Hero",
                    "subtitle": "Jungian analogue: Hero",
                    "imageSrc": "/images/batyr.svg",
                    "imageAlt": "Batyr archetype result",
                    "tagline": "Action, courage, and duty under pressure.",
                    "description": "The Batyr profile reflects a person who meets difficulty by acting, protecting, and carrying responsibility.",
                    "strengths": ["steps into responsibility instead of freezing", "can turn pressure into decisive movement", "protects others when stakes become real"],
                    "growthAreas": ["may over-identify with being strong all the time", "can move too quickly before listening deeply", "may hide vulnerability behind competence"],
                    "developmentFocus": "Openness",
                    "whyThisResult": "Batyr fits best because your profile leans most strongly toward conscientiousness and extraversion.",
                    "details": {
                        "shadowArchetype": "Aldar Kose - The Trickster",
                        "topTraits": ["Conscientiousness", "Extraversion"],
                        "bigFive": [],
                    },
                },
            },
            {
                "test_type": "weapon",
                "result": {
                    "resultKey": "spear",
                    "title": "Spear - The Asserter",
                    "subtitle": "Thomas-Kilmann style: Competing",
                    "imageSrc": "/images/spear.svg",
                    "imageAlt": "Spear result",
                    "tagline": "Direct confrontation, clear position, and honest force.",
                    "description": "The Spear represents the person who names the conflict directly and pushes it into the open.",
                    "strengths": ["speaks directly and without deflection", "defends position under pressure", "cuts through ambiguity quickly"],
                    "growthAreas": ["may push too hard without listening", "can escalate when de-escalation would work better", "may prioritize being right over being effective"],
                    "developmentFocus": None,
                    "whyThisResult": None,
                    "details": {"scores": {"bow": 1, "spear": 5, "saber": 1, "shield": 1}},
                },
            },
        ],
    },
    {
        "username": "zarina_a",
        "nickname": "Zarina Akhmet",
        "email": "zarina@demo.com",
        "password": "demo1234",
        "coins": 650,
        "submissions": [
            {
                "test_type": "personality",
                "result": {
                    "resultKey": "zhyrau",
                    "title": "Zhyrau - The Sage",
                    "subtitle": "Jungian analogue: Sage",
                    "imageSrc": "/images/zhyrau.svg",
                    "imageAlt": "Zhyrau archetype result",
                    "tagline": "Meaning, reflection, and long-range insight.",
                    "description": "The Zhyrau profile reflects the Sage: the one who observes, interprets, and gives language to what others feel but cannot yet explain.",
                    "strengths": ["sees patterns and meanings others miss", "thinks before speaking or acting", "can guide through insight rather than force"],
                    "growthAreas": ["may stay in reflection longer than action requires", "can become too distant from immediate realities", "may overcomplicate simple emotional needs"],
                    "developmentFocus": "Extraversion",
                    "whyThisResult": "Zhyrau fits best because your profile leans most strongly toward openness and agreeableness.",
                    "details": {
                        "shadowArchetype": "Shanyraq Keeper - The Mother",
                        "topTraits": ["Openness", "Agreeableness"],
                        "bigFive": [],
                    },
                },
            },
            {
                "test_type": "animal",
                "result": {
                    "resultKey": "eagle",
                    "title": "Eagle - The Melancholic",
                    "subtitle": "Eysenck temperament: Melancholic",
                    "imageSrc": "/images/eagle.svg",
                    "imageAlt": "Eagle result",
                    "tagline": "Inner depth, sensitivity, and watchful intensity.",
                    "description": "Here the eagle represents the melancholic quadrant in Eysenck's model: introverted, reflective, and more emotionally sensitive to pressure.",
                    "strengths": ["notices subtle signals and hidden meaning quickly", "thinks with depth rather than surface reaction", "cares intensely about what feels true or important"],
                    "growthAreas": ["may carry stress inward for too long", "can become overwhelmed by uncertainty or criticism", "may withdraw when support would actually help"],
                    "developmentFocus": "Emotional regulation",
                    "whyThisResult": "Your answers leaned toward introversion and emotional instability.",
                    "details": {"temperament": "Melancholic", "quadrant": "Introvert + Unstable", "coreTraits": ["sensitivity", "depth", "reflection"], "axes": []},
                },
            },
            {
                "test_type": "weapon",
                "result": {
                    "resultKey": "bow",
                    "title": "Bow - The Strategist",
                    "subtitle": "Thomas-Kilmann style: Avoiding / Accommodating",
                    "imageSrc": "/images/bow.svg",
                    "imageAlt": "Bow result",
                    "tagline": "Strategic restraint, patient observation, and timed response.",
                    "description": "The Bow represents the person who reads the terrain before acting.",
                    "strengths": ["avoids unnecessary escalation", "reads the room before acting", "creates space for better timing"],
                    "growthAreas": ["may wait too long and lose the moment", "can appear passive when clarity is needed", "may let tension fester through avoidance"],
                    "developmentFocus": None,
                    "whyThisResult": None,
                    "details": {"scores": {"bow": 5, "spear": 1, "saber": 1, "shield": 1}},
                },
            },
        ],
    },
    {
        "username": "damir_o",
        "nickname": "Damir Orazov",
        "email": "damir@demo.com",
        "password": "demo1234",
        "coins": 200,
        "submissions": [
            {
                "test_type": "animal",
                "result": {
                    "resultKey": "wolf",
                    "title": "Wolf - The Choleric",
                    "subtitle": "Eysenck temperament: Choleric",
                    "imageSrc": "/images/wolf.svg",
                    "imageAlt": "Wolf result",
                    "tagline": "Intensity, outward drive, and emotionally charged action.",
                    "description": "In this reading, the wolf stands for the choleric pattern in Eysenck's model: outward-moving, forceful, and more emotionally reactive under strain.",
                    "strengths": ["acts quickly when the situation becomes urgent", "brings passion and visible energy to people or causes", "protects the group with force and immediacy"],
                    "growthAreas": ["may react before enough reflection", "can intensify tension without meaning to", "may find it hard to slow down once emotionally activated"],
                    "developmentFocus": "Emotional regulation",
                    "whyThisResult": "Your answers leaned toward extraversion and emotional instability.",
                    "details": {"temperament": "Choleric", "quadrant": "Extravert + Unstable", "coreTraits": ["intensity", "drive", "reactivity"], "axes": []},
                },
            },
            {
                "test_type": "weapon",
                "result": {
                    "resultKey": "saber",
                    "title": "Saber - The Negotiator",
                    "subtitle": "Thomas-Kilmann style: Compromising",
                    "imageSrc": "/images/saber.svg",
                    "imageAlt": "Saber result",
                    "tagline": "Flexible movement, mutual concession, and workable outcomes.",
                    "description": "The Saber represents the person who finds the middle path.",
                    "strengths": ["finds workable ground quickly", "keeps things moving when others freeze", "reads what both sides need and bridges the gap"],
                    "growthAreas": ["may compromise too early before exploring better options", "can lose their own position in the process", "may avoid the deeper issue to reach a surface solution"],
                    "developmentFocus": None,
                    "whyThisResult": None,
                    "details": {"scores": {"bow": 1, "spear": 2, "saber": 4, "shield": 1}},
                },
            },
        ],
    },
    {
        "username": "kamila_d",
        "nickname": "Kamila Dzhaksybekova",
        "email": "kamila@demo.com",
        "password": "demo1234",
        "coins": 800,
        "submissions": [
            {
                "test_type": "personality",
                "result": {
                    "resultKey": "aldarKose",
                    "title": "Aldar Kose - The Trickster",
                    "subtitle": "Jungian analogue: Trickster",
                    "imageSrc": "/images/aldarkose.svg",
                    "imageAlt": "Aldar Kose archetype result",
                    "tagline": "Cleverness, adaptability, and rule-bending insight.",
                    "description": "The Aldar Kose profile reflects the Trickster: psychologically flexible, observant, and hard to trap inside rigid expectations.",
                    "strengths": ["adapts quickly when systems stop making sense", "spots hypocrisy, weak logic, and hidden openings", "uses humor and intelligence to disarm pressure"],
                    "growthAreas": ["may resist structure even when it would help", "can treat seriousness as something to evade", "may protect autonomy so strongly that trust becomes harder"],
                    "developmentFocus": "Conscientiousness",
                    "whyThisResult": "Aldar Kose fits best because your profile leans most strongly toward openness and extraversion.",
                    "details": {
                        "shadowArchetype": "Zhyrau - The Sage",
                        "topTraits": ["Openness", "Extraversion"],
                        "bigFive": [],
                    },
                },
            },
            {
                "test_type": "animal",
                "result": {
                    "resultKey": "snowLeopard",
                    "title": "Snow Leopard - The Phlegmatic",
                    "subtitle": "Eysenck temperament: Phlegmatic",
                    "imageSrc": "/images/snowleo.svg",
                    "imageAlt": "Snow Leopard result",
                    "tagline": "Quiet steadiness, contained depth, and calm endurance.",
                    "description": "In this test, the snow leopard represents the phlegmatic quadrant of Eysenck's model: introverted but emotionally steady.",
                    "strengths": ["stays composed in difficult situations", "observes deeply before acting", "does not waste energy on unnecessary drama"],
                    "growthAreas": ["may stay too private for others to read easily", "can delay expression until the moment passes", "may appear distant when actually just self-contained"],
                    "developmentFocus": "Outward expression",
                    "whyThisResult": "Your answers leaned toward introversion and emotional stability.",
                    "details": {"temperament": "Phlegmatic", "quadrant": "Introvert + Stable", "coreTraits": ["reserve", "stability", "patience"], "axes": []},
                },
            },
            {
                "test_type": "weapon",
                "result": {
                    "resultKey": "shield",
                    "title": "Shield - The Protector",
                    "subtitle": "Thomas-Kilmann style: Collaborating / Accommodating",
                    "imageSrc": "/images/shield.svg",
                    "imageAlt": "Shield result",
                    "tagline": "Relational safety, emotional care, and trust preservation.",
                    "description": "The Shield represents the person who protects the connection first.",
                    "strengths": ["keeps relationships intact under pressure", "lowers emotional temperature quickly", "makes others feel heard and respected"],
                    "growthAreas": ["may avoid necessary conflict to protect the relationship", "can carry more emotional labor than is fair", "may prioritize harmony over honest resolution"],
                    "developmentFocus": None,
                    "whyThisResult": None,
                    "details": {"scores": {"bow": 1, "spear": 1, "saber": 2, "shield": 4}},
                },
            },
        ],
    },
]


def seed():
    db = SessionLocal()
    try:
        if db.query(models.Test).count() > 0:
            print("DB already seeded, skipping.")
            return

        tests_data = [
            {
                "type": "personality",
                "title": "What's your personality?",
                "description": "This psychological test measures Big Five traits and then maps the profile to Jungian archetypes retold through Kazakh figures: Batyr, Zhyrau, Shanyraq Keeper, and Aldar Kose.",
                "image_src": "/images/card1.svg",
                "image_alt": "Personality test illustration",
                "info_boxes": [
                    {"tone": "duration", "value": "5-7 min",  "label": "Average duration"},
                    {"tone": "format",   "value": "15 items", "label": "Statements + 4-point scale"},
                    {"tone": "result",   "value": "1 profile","label": "Kazakh archetype + Big Five"},
                ],
                "scoring_config": PERSONALITY_SCORING_CONFIG,
                "questions": PERSONALITY_QUESTIONS,
            },
            {
                "type": "animal",
                "title": "What's your animal?",
                "description": "This psychological test measures two Eysenck axes first: extraversion/introversion and emotional stability/instability. The final temperament quadrant is then retold through four Kazakh animals.",
                "image_src": "/images/card2.svg",
                "image_alt": "Animal test illustration",
                "info_boxes": [
                    {"tone": "duration", "value": "4-5 min",  "label": "Average duration"},
                    {"tone": "format",   "value": "12 items", "label": "Statements + 4-point scale"},
                    {"tone": "result",   "value": "1 profile","label": "Temperament + Kazakh animal"},
                ],
                "scoring_config": ANIMAL_SCORING_CONFIG,
                "questions": ANIMAL_QUESTIONS,
            },
            {
                "type": "weapon",
                "title": "What's your weapon?",
                "description": "This psychological test reads your conflict style through Kazakh weapons. It is based on the Thomas-Kilmann model and asks how you tend to respond when tension, disagreement, or boundaries appear.",
                "image_src": "/images/card3.svg",
                "image_alt": "Weapon test illustration",
                "info_boxes": [
                    {"tone": "duration", "value": "3-5 min",    "label": "Average duration"},
                    {"tone": "format",   "value": "8 questions", "label": "Conflict situations + instinctive choices"},
                    {"tone": "result",   "value": "1 style",     "label": "Your weapon-based conflict pattern"},
                ],
                "scoring_config": WEAPON_SCORING_CONFIG,
                "questions": WEAPON_QUESTIONS,
            },
        ]

        for td in tests_data:
            questions_raw = td.pop("questions")
            test = models.Test(**td)
            db.add(test)
            db.flush()

            for q in questions_raw:
                question = models.TestQuestion(test_id=test.id, **q)
                db.add(question)

        db.commit()

        # ── Сидируем демо-пользователей ───────────────────────────────────────
        from src.auth import hash_password
        from datetime import datetime

        # Строим словарь test_type -> test_id
        test_map = {t.type: t.id for t in db.query(models.Test).all()}

        for ud in DEMO_USERS:
            submissions = ud.pop("submissions")
            user = models.User(
                username=ud["username"],
                nickname=ud["nickname"],
                email=ud["email"],
                password=hash_password(ud["password"]),
                coins=ud["coins"],
            )
            db.add(user)
            db.flush()  # получаем user.id

            for sub in submissions:
                test_id = test_map.get(sub["test_type"])
                if not test_id:
                    continue
                submission = models.TestSubmission(
                    user_id=user.id,
                    test_id=test_id,
                    answers={},
                    result=sub["result"],
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow(),
                )
                db.add(submission)
                db.add(models.CoinTransaction(
                    user_id=user.id,
                    amount=-100,
                    reason="test_unlock",
                    meta={"test_id": test_id},
                ))

        db.commit()
        print("Seeded successfully.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()