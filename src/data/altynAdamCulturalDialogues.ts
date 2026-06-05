import type {
  AltynAdamCulturalDialogueDefinition,
  AltynAdamLanguage,
  DialogueChoiceType,
  DialogueNode,
  KnowledgeCheck,
  LocalizedText,
  StandardTestType,
} from "../types/altynAdam";

interface BranchSeed {
  id: string;
  type: DialogueChoiceType;
  label: LocalizedText;
  firstText: LocalizedText;
  secondText: LocalizedText;
  knowledgeCheck: KnowledgeCheck;
}

interface DialogueSeed {
  id: string;
  testType: StandardTestType;
  resultKey: string;
  introText: LocalizedText;
  branches: readonly [BranchSeed, BranchSeed];
}

const CHECK_LEAD_IN = {
  en: "Let us see which cultural detail stayed with you.",
  ru: "Давай проверим, какая деталь у тебя осталась в памяти.",
  kk: "Енді қай деталь есіңде қалғанын тексеріп көрейік.",
} satisfies LocalizedText;

const CONTINUE_LABEL = {
  en: "Go on",
  ru: "Дальше",
  kk: "Жалғастырайық",
} satisfies LocalizedText;

const CHECK_LABEL = {
  en: "Check myself",
  ru: "Проверить себя",
  kk: "Өзімді тексеру",
} satisfies LocalizedText;

const text = (en: string, ru: string, kk: string): LocalizedText => ({
  en,
  ru,
  kk,
});

function buildDialogue(seed: DialogueSeed): AltynAdamCulturalDialogueDefinition {
  const nodes: Record<string, DialogueNode> = {};

  nodes.intro = {
    id: "intro",
    pose: "welcome",
    text: seed.introText,
    choices: seed.branches.map((branch) => ({
      id: `${branch.id}-choice`,
      label: branch.label,
      nextNodeId: `${branch.id}-1`,
      type: branch.type,
    })),
  };

  seed.branches.forEach((branch) => {
    nodes[`${branch.id}-1`] = {
      id: `${branch.id}-1`,
      pose: branch.type === "story" ? "guide" : "explaining",
      text: branch.firstText,
      choices: [
        {
          id: `${branch.id}-1-continue`,
          label: CONTINUE_LABEL,
          nextNodeId: `${branch.id}-2`,
        },
      ],
    };

    nodes[`${branch.id}-2`] = {
      id: `${branch.id}-2`,
      pose: "explaining",
      text: branch.secondText,
      choices: [
        {
          id: `${branch.id}-2-check`,
          label: CHECK_LABEL,
          nextNodeId: `${branch.id}-check`,
        },
      ],
    };

    nodes[`${branch.id}-check`] = {
      id: `${branch.id}-check`,
      pose: "thinking",
      text: CHECK_LEAD_IN,
      knowledgeCheck: branch.knowledgeCheck,
    };
  });

  return {
    id: seed.id,
    testType: seed.testType,
    resultKey: seed.resultKey,
    openingNodeId: "intro",
    nodes,
  };
}

const DIALOGUE_SEEDS: readonly DialogueSeed[] = [
  {
    id: "personality-batyr",
    testType: "personality",
    resultKey: "batyr",
    introText: text(
      "Batyr sounds like pure force at first. But in Kazakh culture that word is heavier than simple bravery.",
      "Батыр сначала звучит как просто сила. Но в казахской культуре за этим словом стоит куда больше, чем храбрость в бою.",
      "Батыр деген сөз алғашында жай күш сияқты естіледі. Бірақ қазақ мәдениетінде ол тек шайқастағы ерлікпен шектелмейді.",
    ),
    branches: [
      {
        id: "basic",
        type: "basic",
        label: text(
          "Who was called a batyr?",
          "Кого вообще называли батыром?",
          "Батыр деп кімді атаған?",
        ),
        firstText: text(
          "A batyr was not simply the strongest fighter. He was a person who accepted danger for the sake of the community when others stepped back.",
          "Батыром называли не просто самого сильного воина. Это был человек, который принимал риск ради рода и общины тогда, когда остальные отступали.",
          "Батыр деп тек ең күшті жауынгерді айтпаған. Бұл — өзгелер шегінген сәтте ел үшін тәуекелді өз мойнына алған адам.",
        ),
        secondText: text(
          "That is why courage and responsibility went together. If a person sought glory but did not protect people, he could be feared, but not remembered as a true batyr.",
          "Поэтому смелость у батыров шла вместе с ответственностью. Если человек искал только славу, но не защищал людей, его могли бояться, но не помнить как настоящего батыра.",
          "Сондықтан батырлықта ерлік пен жауапкершілік қатар жүрген. Даңқ қана іздеп, елді қорғамаған адамнан қорқуы мүмкін, бірақ оны шын батыр деп еске алмайды.",
        ),
        knowledgeCheck: {
          question: text(
            "Which trait made bravery culturally meaningful in the dialogue?",
            "Что делало храбрость культурно значимой в этом объяснении?",
            "Осы түсіндіруде ерлікті мәдени тұрғыдан мәнді еткен не еді?",
          ),
          options: [
            text("Love of fame", "Любовь к славе", "Даңққа құмарлық"),
            text(
              "Readiness to take risk for the community",
              "Готовность брать риск ради общины",
              "Ел үшін тәуекелді өз мойнына алу",
            ),
            text(
              "Victory in every duel",
              "Победа в каждом поединке",
              "Әр жекпе-жекте жеңу",
            ),
          ].map((label, index) => ({
            id: `batyr-basic-${index + 1}`,
            label,
          })),
          correctOptionId: "batyr-basic-2",
          correctResponse: text(
            "Exactly. In the dialogue, batyr was tied to accepted responsibility, not to spectacle.",
            "Верно. В разговоре батыр был связан прежде всего с принятой ответственностью, а не с эффектной славой.",
            "Дұрыс. Әңгімеде батырлықтың өзегі — жарқыл емес, жауапкершілікті мойынға алу еді.",
          ),
          wrongResponse: text(
            "Not quite. The key idea was responsibility before the community: bravery mattered because it protected others.",
            "Не совсем. Ключевая мысль была в ответственности перед общиной: храбрость имела значение потому, что защищала других.",
            "Толық емес. Негізгі ой — қауым алдындағы жауапкершілік: ерлік басқаларды қорғағандықтан құнды болды.",
          ),
        },
      },
      {
        id: "story",
        type: "story",
        label: text(
          "Tell me a historical angle",
          "Расскажи исторический ракурс",
          "Тарихи қырын айтшы",
        ),
        firstText: text(
          "When people remember famous batyrs, they often remember not only battles, but the moment someone became a point of gathering for others. A batyr could become a figure around whom scattered fear turned into shared resolve.",
          "Когда вспоминают известных батыров, часто помнят не только битвы, но и момент, когда человек становился точкой сборки для других. Батыр мог превратить рассыпанный страх в общую решимость.",
          "Белгілі батырларды еске алғанда, көбіне шайқастың өзін ғана емес, адамның жұртты бір жерге жинай алған сәтін де айтады. Батыр бытыраған қорқынышты ортақ бекемдікке айналдыра алған.",
        ),
        secondText: text(
          "That is why memory about batyrs survived in songs and oral stories. They were remembered as those who gave the community a spine in a dangerous hour.",
          "Поэтому память о батырах жила в песнях и устных рассказах. Их помнили как людей, которые в опасный час возвращали общине внутренний стержень.",
          "Сондықтан батыр туралы жад жыр мен ауызша әңгімеде сақталды. Оларды қауіпті сәтте елге тірек болған адам ретінде есте ұстады.",
        ),
        knowledgeCheck: {
          question: text(
            "In this branch, why did oral memory keep batyrs alive?",
            "Почему в этой ветке память о батырах удерживалась в устной традиции?",
            "Бұл тармақта батырлар неге ауызша жадта сақталды?",
          ),
          options: [
            text(
              "Because they owned the most land",
              "Потому что владели самой большой землёй",
              "Өйткені ең көп жерге ие болды",
            ),
            text(
              "Because they turned fear into shared resolve",
              "Потому что превращали страх в общую решимость",
              "Өйткені қорқынышты ортақ бекемдікке айналдыра алды",
            ),
            text(
              "Because they avoided all danger",
              "Потому что избегали любой опасности",
              "Өйткені кез келген қауіпті айналып өтті",
            ),
          ].map((label, index) => ({
            id: `batyr-story-${index + 1}`,
            label,
          })),
          correctOptionId: "batyr-story-2",
          correctResponse: text(
            "Yes. The dialogue stressed the social effect of the batyr: he steadied people around him.",
            "Да. Здесь акцент был на социальном эффекте батыра: он собирал и выпрямлял людей вокруг себя.",
            "Иә. Бұл тармақта батырдың әлеуметтік әсері маңызды болды: ол айналасындағы жұртты бекітті.",
          ),
          wrongResponse: text(
            "Almost, but the key detail was different: batyrs stayed in memory because they gave people collective steadiness in danger.",
            "Почти, но важная деталь была другой: батыров помнили потому, что они возвращали людям коллективную устойчивость в опасности.",
            "Сәл қате. Маңызды деталь басқа еді: батырлар қауіп кезінде елге ортақ беріктік бергені үшін есте қалды.",
          ),
        },
      },
    ],
  },
  {
    id: "personality-zhyrau",
    testType: "personality",
    resultKey: "zhyrau",
    introText: text(
      "Zhyrau is easy to mistake for 'just a poet'. But in the steppe that role sat much closer to memory, counsel, and moral pressure.",
      "Жырау легко принять за 'просто поэта'. Но в степной культуре эта роль стояла гораздо ближе к памяти, совету и нравственному давлению.",
      "Жырауды 'жай ақын' деп түсіну оңай. Бірақ дала мәдениетінде бұл рөл жадқа, кеңеске және моральдық салмаққа әлдеқайда жақын болған.",
    ),
    branches: [
      {
        id: "basic",
        type: "basic",
        label: text(
          "What did a zhyrau actually do?",
          "Чем жырау вообще занимался?",
          "Жырау нақты не істеген?",
        ),
        firstText: text(
          "A zhyrau did not only compose beautiful lines. He kept collective memory in motion: genealogy, values, warnings, and the emotional shape of events.",
          "Жырау не просто складывал красивые строки. Он удерживал в движении коллективную память: родословную, ценности, предупреждения и эмоциональный смысл событий.",
          "Жырау тек әсем жолдар шығармаған. Ол ұжымдық жадты — шежірені, құндылықтарды, ескертулерді және оқиғалардың эмоциялық мағынасын — тірі ұстап отырған.",
        ),
        secondText: text(
          "Because of this, words mattered as action. To speak in the right moment was not decoration; it was a way to orient the community.",
          "Поэтому слово у жырау было действием. Сказать вовремя означало не украшать речь, а направлять общину.",
          "Сондықтан жырау үшін сөздің өзі әрекет болған. Дәл уақытында сөйлеу — жай әсемдік емес, қауымды бағыттау тәсілі еді.",
        ),
        knowledgeCheck: {
          question: text(
            "What made the zhyrau's speech more than ornament in this dialogue?",
            "Что делало речь жырау чем-то большим, чем украшение?",
            "Бұл диалогта жыраудың сөзін жай әшекейден артық еткен не?",
          ),
          options: [
            text(
              "It oriented the community at the right moment",
              "Она направляла общину в нужный момент",
              "Ол қауымды дәл сәтте бағыттап отырды",
            ),
            text(
              "It was always sung with instruments",
              "Её всегда исполняли под инструменты",
              "Ол әрдайым аспаппен айтылды",
            ),
            text(
              "It replaced every political decision",
              "Она заменяла любое политическое решение",
              "Ол барлық саяси шешімді ауыстырды",
            ),
          ].map((label, index) => ({
            id: `zhyrau-basic-${index + 1}`,
            label,
          })),
          correctOptionId: "zhyrau-basic-1",
          correctResponse: text(
            "Right. The key idea was timing and orientation: the zhyrau's word helped people understand how to stand in a situation.",
            "Верно. Ключевая мысль была во времени и ориентировании: слово жырау помогало людям понять, как им стоять в ситуации.",
            "Дұрыс. Негізгі ой — уақыт пен бағдар: жыраудың сөзі адамдарға жағдайда қалай тұру керегін ұқтырды.",
          ),
          wrongResponse: text(
            "Not exactly. The dialogue stressed that the zhyrau's word mattered because it oriented people, not because it was merely artistic.",
            "Не совсем. Важна была мысль о том, что слово жырау направляло людей, а не только звучало художественно.",
            "Толық емес. Бұл жерде жыраудың сөзі көркемдігі үшін емес, адамдарды бағыттай алғаны үшін маңызды болды.",
          ),
        },
      },
      {
        id: "story",
        type: "story",
        label: text(
          "Give me the deeper historical layer",
          "Дай более глубокий исторический слой",
          "Тереңірек тарихи қырын айт",
        ),
        firstText: text(
          "In many steppe courts, a zhyrau could praise, warn, or even restrain power through speech. Advice was remembered publicly, so words could become a form of accountability.",
          "Во многих степных ставках жырау мог словом и возвысить, и предостеречь, и даже сдержать власть. Совет звучал публично, а значит слово становилось формой ответственности.",
          "Көптеген дала ордаларында жырау сөз арқылы билікті мадақтап та, ескертіп те, тіпті тежеп те отырған. Кеңес көпшілік алдында айтылғандықтан, сөздің өзі жауапкершілікке айналған.",
        ),
        secondText: text(
          "That is why the figure of the zhyrau sits between art and governance. He was not a silent observer of history, but one of the voices shaping its moral frame.",
          "Вот почему фигура жырау стоит между искусством и управлением. Он был не молчаливым наблюдателем истории, а одним из голосов, которые задавали ей нравственную рамку.",
          "Сондықтан жырау бейнесі өнер мен басқарудың арасында тұрады. Ол тарихты үнсіз бақылайтын адам емес, оның моральдық шеңберін қалыптастырған дауыстардың бірі болған.",
        ),
        knowledgeCheck: {
          question: text(
            "What made the zhyrau's advice a form of accountability here?",
            "Почему совет жырау здесь становился формой ответственности?",
            "Бұл жерде жыраудың кеңесін жауапкершілікке айналдырған не?",
          ),
          options: [
            text(
              "It was voiced publicly and remembered",
              "Он звучал публично и запоминался",
              "Ол көпшілік алдында айтылып, есте сақталды",
            ),
            text(
              "It was written into law immediately",
              "Его сразу записывали в закон",
              "Ол бірден заңға жазылды",
            ),
            text(
              "Only rulers could hear it",
              "Его слышали только правители",
              "Оны тек билеушілер ғана еститін",
            ),
          ].map((label, index) => ({
            id: `zhyrau-story-${index + 1}`,
            label,
          })),
          correctOptionId: "zhyrau-story-1",
          correctResponse: text(
            "Exactly. Public memory made speech weighty: once words were heard, they could not be treated as nothing.",
            "Именно. Публичная память придавала слову вес: раз оно было сказано и услышано, его уже нельзя было сделать ничем.",
            "Дәл солай. Көпшілік жад сөзге салмақ берді: айтылып, естілген нәрсені жоққа шығару оңай емес еді.",
          ),
          wrongResponse: text(
            "Not quite. The dialogue emphasized that public memory gave the zhyrau's words their force.",
            "Не совсем. В этой ветке подчёркивалось, что силу слову жырау давала именно публичная память.",
            "Сәл қате. Бұл тармақта жырау сөзінің күшін оған көпшілік жад бергені айтылды.",
          ),
        },
      },
    ],
  },
  {
    id: "personality-shanyraq",
    testType: "personality",
    resultKey: "shanyraq",
    introText: text(
      "Shanyraq Keeper is often misunderstood as a narrow domestic role. But the shanyraq itself means continuity, shelter, and the shape of belonging.",
      "Хранителя Шанырака часто слишком быстро сводят к узкой домашней роли. Но сам шанырак означает преемственность, укрытие и форму принадлежности.",
      "Шаңырақ сақтаушысын кейде тым тар тұрмыстық рөлге айналдырып жібереді. Ал шаңырақтың өзі сабақтастықты, пананы және тиесілілік сезімін білдіреді.",
    ),
    branches: [
      {
        id: "basic",
        type: "basic",
        label: text(
          "Why is shanyraq more than a household symbol?",
          "Почему шанырак — это не просто дом?",
          "Шаңырақ неге жай үй белгісі емес?",
        ),
        firstText: text(
          "The shanyraq marks the place where generations connect. It is not just a roof detail; it is a sign that memory, care, and obligation stay tied together.",
          "Шанырак отмечает место, где соединяются поколения. Это не просто часть крыши, а знак того, что память, забота и обязательства держатся вместе.",
          "Шаңырақ — ұрпақтар жалғанатын нүкте. Ол жай ғана киіз үйдің бөлшегі емес, жад, қамқорлық және міндеттің бірге ұсталып тұрғанының белгісі.",
        ),
        secondText: text(
          "Because of that, a keeper of shanyraq protects atmosphere as much as structure: who is welcomed, how ties are preserved, and whether people still feel they belong.",
          "Поэтому хранитель шанырака бережёт не только устройство, но и атмосферу: кого принимают, как сохраняют связи и чувствуют ли люди, что они по-прежнему принадлежат этому дому.",
          "Сондықтан шаңырақ сақтаушысы тек құрылымды емес, ортаны да қорғайды: кім қабылданады, байланыс қалай сақталады және адамдар өзін осы үйге тиесілі сезіне ме.",
        ),
        knowledgeCheck: {
          question: text(
            "What was the keeper protecting in addition to structure?",
            "Что хранитель защищал помимо устройства дома?",
            "Сақтаушы үй құрылымынан бөлек нені қорғайды?",
          ),
          options: [
            text(
              "Only family property",
              "Только семейное имущество",
              "Тек отбасылық мүлікті",
            ),
            text(
              "Atmosphere, ties, and belonging",
              "Атмосферу, связи и чувство принадлежности",
              "Ортаны, байланысты және тиесілілік сезімін",
            ),
            text(
              "The right to avoid guests",
              "Право избегать гостей",
              "Қонақтан қашу құқығын",
            ),
          ].map((label, index) => ({
            id: `shanyraq-basic-${index + 1}`,
            label,
          })),
          correctOptionId: "shanyraq-basic-2",
          correctResponse: text(
            "Yes. The dialogue treated shanyraq as a living bond, not as furniture.",
            "Да. В этой ветке шанырак понимался как живая связь, а не как предмет быта.",
            "Иә. Бұл тармақта шаңырақ зат емес, тірі байланыс ретінде түсіндірілді.",
          ),
          wrongResponse: text(
            "Not exactly. The key point was that the keeper protects belonging and ties, not just the physical space.",
            "Не совсем. Главная мысль была в том, что хранитель защищает принадлежность и связи, а не только физическое пространство.",
            "Толық емес. Негізгі ой — сақтаушы тек кеңістікті емес, тиесілілік пен байланысты да қорғайды.",
          ),
        },
      },
      {
        id: "story",
        type: "story",
        label: text(
          "Show me the cultural depth",
          "Покажи культурную глубину",
          "Мәдени тереңдігін көрсетші",
        ),
        firstText: text(
          "In steppe life, continuity was held not only by blood, but by practice: hospitality, remembrance of elders, and the ability to keep the circle from breaking under strain.",
          "В степной жизни преемственность держалась не только кровью, но и практикой: гостеприимством, памятью о старших и способностью не дать кругу распасться под давлением.",
          "Дала өмірінде сабақтастық тек қанмен емес, амалмен де ұсталды: қонақжайлықпен, үлкенді еске алумен және қысым түскенде шеңберді ыдыратпау қабілетімен.",
        ),
        secondText: text(
          "So the image of the shanyraq keeper carries quiet authority. This person does not dominate the center by volume, but keeps the center from collapsing.",
          "Поэтому образ хранителя шанырака несёт тихую власть. Он не захватывает центр громкостью, а не даёт самому центру развалиться.",
          "Сондықтан шаңырақ сақтаушысының бейнесінде тыныш бедел бар. Ол ортаны айқаймен билемейді, бірақ сол ортаның ыдырап кетпеуін қамтамасыз етеді.",
        ),
        knowledgeCheck: {
          question: text(
            "How was continuity preserved in this branch?",
            "Через что здесь удерживалась преемственность?",
            "Бұл тармақта сабақтастық не арқылы сақталды?",
          ),
          options: [
            text(
              "Through wealth alone",
              "Только через богатство",
              "Тек байлық арқылы",
            ),
            text(
              "Through practice such as hospitality and remembrance",
              "Через практику вроде гостеприимства и памяти о старших",
              "Қонақжайлық пен үлкенді еске алу сияқты амалдар арқылы",
            ),
            text(
              "Through strict silence in the home",
              "Через строгую тишину в доме",
              "Үйдегі қатаң үнсіздік арқылы",
            ),
          ].map((label, index) => ({
            id: `shanyraq-story-${index + 1}`,
            label,
          })),
          correctOptionId: "shanyraq-story-2",
          correctResponse: text(
            "Exactly. Continuity lived in repeated practices, not only in formal ties.",
            "Именно. Преемственность жила в повторяющихся практиках, а не только в формальных связях.",
            "Дәл солай. Сабақтастық формальды байланыста ғана емес, қайталанатын амалдарда өмір сүрді.",
          ),
          wrongResponse: text(
            "Not quite. The branch stressed living practice: hospitality, remembrance, and keeping the circle intact.",
            "Не совсем. Ветвь подчёркивала живую практику: гостеприимство, память и удержание круга целым.",
            "Сәл қате. Бұл тармақта тірі амал маңызды болды: қонақжайлық, естелік және шеңберді бүтін сақтау.",
          ),
        },
      },
    ],
  },
  {
    id: "personality-aldarKose",
    testType: "personality",
    resultKey: "aldarKose",
    introText: text(
      "Aldar Kose is often flattened into 'the trickster'. In Kazakh oral tradition, though, his cunning exposes greedy bai, vain officials, and people who misuse status.",
      "Алдара Косе часто сводят к 'хитрецу'. Но в казахских историях хитрость нередко работает как способ вывести наружу чужую жадность, тщеславие или ленивую власть.",
      "Алдар Көсені көбіне 'айлакер' деп қана түсіндіреді. Бірақ қазақ әңгімелерінде айла көп жағдайда өзгенің ашкөздігін, менмендігін не жалқау билігін әшкерелейді.",
    ),
    branches: [
      {
        id: "basic",
        type: "basic",
        label: text(
          "Why is the trickster culturally useful?",
          "Зачем вообще нужен такой трикстер?",
          "Мұндай трикстер не үшін керек?",
        ),
        firstText: text(
          "Aldar Kose matters where power cannot be challenged head-on. He reads motives, flips the social scene, and lets the greedy embarrass themselves in front of the community.",
          "Трикстер действует там, где прямая сила бессильна. Он выживает за счёт чтения мотивов, смены рамки и умения сделать скрытую нелепость видимой.",
          "Трикстер тура күш жетпейтін жерде жұмыс істейді. Ол ниетті сезіп, жағдайдың қалыбын өзгертіп, жасырын қисынсыздықты көрінетін етеді.",
        ),
        secondText: text(
          "So his wit is not random cleverness. In Kazakh tales it works like a folk correction: laughter protects the weaker side by stripping false importance from the stronger one.",
          "Поэтому Алдар Косе — это не просто 'умный'. Его остроумие социально: оно защищает слабого, заставляя самоуверенность споткнуться о саму себя.",
          "Сондықтан Алдар Көсе жай ғана 'ақылды' емес. Оның тапқырлығы әлеуметтік мәнге ие: ол әлсізді күшпен емес, менмендіктің өзіне сүріндіру арқылы қорғайды.",
        ),
        knowledgeCheck: {
          question: text(
            "What was the social function of Aldar Kose's wit here?",
            "Какую социальную функцию выполняла смекалка Алдара Косе?",
            "Бұл жерде Алдар Көсенің тапқырлығы қандай әлеуметтік қызмет атқарды?",
          ),
          options: [
            text(
              "It protected the weak by exposing arrogance",
              "Она защищала слабого, разоблачая самоуверенность",
              "Ол менмендікті әшкерелеу арқылы әлсізді қорғады",
            ),
            text(
              "It made him rich in every story",
              "Она делала его богатым в каждой истории",
              "Ол оны әр әңгімеде бай қылды",
            ),
            text(
              "It replaced all communal rules",
              "Она заменяла все общинные правила",
              "Ол барлық қауымдық ережені алмастырды",
            ),
          ].map((label, index) => ({
            id: `aldar-basic-${index + 1}`,
            label,
          })),
          correctOptionId: "aldar-basic-1",
          correctResponse: text(
            "Right. In this branch, wit mattered because it corrected an imbalance, not because it produced spectacle.",
            "Верно. В этой ветке важна была смекалка как способ исправить перекос, а не создать красивый эффект.",
            "Дұрыс. Бұл тармақта тапқырлықтың құны — теңсіздікті түзетуінде, жай әсер қалдыруында емес.",
          ),
          wrongResponse: text(
            "Not exactly. The key point was that wit exposed arrogance and protected the weaker side.",
            "Не совсем. Главная мысль была в том, что остроумие разоблачало самоуверенность и защищало более слабую сторону.",
            "Толық емес. Негізгі ой — тапқырлық менмендікті әшкерелеп, әлсіз жақты қорғады.",
          ),
        },
      },
      {
        id: "story",
        type: "story",
        label: text(
          "Tell me the deeper story logic",
          "Расскажи более глубокую логику историй",
          "Әңгімелердің терең логикасын айт",
        ),
        firstText: text(
          "In many stories, Aldar Kose defeats a rich bai or boastful host without open battle. He wins by making excess visible, so the audience sees how pride and greed collapse under their own weight.",
          "Истории об Алдаре Косе часто переворачивают иерархию без открытой войны. Богатый глупец, жадный хозяин или гордый чиновник теряет лицо не потому, что его ломают силой, а потому что его собственный избыток становится очевидным.",
          "Алдар Көсе туралы әңгімелер иерархияны ашық соғыссыз-ақ төңкере алады. Бай ақымақ, сараң қожа не тәкаппар би күшпен емес, өз шектен шығуының ашылып қалуы арқылы ұтылады.",
        ),
        secondText: text(
          "That is why the figure teaches more than survival. He represents a specifically oral, communal justice: when rank forgets measure, wit and public laughter restore balance.",
          "Этот переворот важен культурно: смех становится инструментом нравственного равновесия. Он напоминает, что статус без меры неустойчив.",
          "Бұл төңкерістің мәдени мәні бар: күлкі моральдық тепе-теңдіктің құралына айналады. Ол өлшемсіз мәртебенің тұрақсыз екенін еске салады.",
        ),
        knowledgeCheck: {
          question: text(
            "In this branch, what did laughter do?",
            "Что в этой ветке делал смех?",
            "Бұл тармақта күлкі қандай қызмет атқарды?",
          ),
          options: [
            text(
              "It created moral balance",
              "Он восстанавливал нравственное равновесие",
              "Ол моральдық тепе-теңдікті қалпына келтірді",
            ),
            text(
              "It erased social memory",
              "Он стирал социальную память",
              "Ол әлеуметтік жадты өшірді",
            ),
            text(
              "It turned every conflict into celebration",
              "Он превращал любой конфликт в праздник",
              "Ол әр қақтығысты мерекеге айналдырды",
            ),
          ].map((label, index) => ({
            id: `aldar-story-${index + 1}`,
            label,
          })),
          correctOptionId: "aldar-story-1",
          correctResponse: text(
            "Exactly. Laughter worked here as a correction of excess, not as empty entertainment.",
            "Именно. Смех здесь работал как исправление перекоса, а не как пустое развлечение.",
            "Дәл солай. Бұл жерде күлкі бос ермек емес, шектен шығуды түзететін құрал болды.",
          ),
          wrongResponse: text(
            "Not quite. The branch framed laughter as a way to restore balance when status grows arrogant.",
            "Не совсем. Здесь смех показывался как способ вернуть равновесие, когда статус становится самодовольным.",
            "Сәл қате. Бұл тармақта күлкі мәртебе менменденгенде тепе-теңдікті қайтаратын құрал ретінде берілді.",
          ),
        },
      },
    ],
  },
  {
    id: "animal-snowLeopard",
    testType: "animal",
    resultKey: "snowLeopard",
    introText: text(
      "The snow leopard can look distant at first glance. But distance in steppe symbolism often hides calm control rather than coldness.",
      "Снежный барс на первый взгляд может показаться отстранённым. Но дистанция в степной символике нередко означает спокойный контроль, а не холодность.",
      "Қар барысы алғашында алыс көрінуі мүмкін. Бірақ дала символикасында қашықтық көбіне суықтықты емес, байсалды бақылауды білдіреді.",
    ),
    branches: [
      {
        id: "basic",
        type: "basic",
        label: text(
          "Why is the snow leopard linked with calm strength?",
          "Почему барс связан со спокойной силой?",
          "Қар барысы неге байсалды күшпен байланысады?",
        ),
        firstText: text(
          "The snow leopard does not waste motion. Its image suggests strength that does not need noise to prove itself.",
          "Снежный барс не тратит движение зря. Его образ намекает на силу, которой не нужен шум, чтобы доказать себя.",
          "Қар барысы қимылды босқа жұмсамайды. Оның бейнесі өзін дәлелдеу үшін шу шығармайтын күшті меңзейді.",
        ),
        secondText: text(
          "That is why this archetype often feels measured. Restraint here is not weakness; it is the ability to keep power gathered instead of scattering it.",
          "Поэтому этот архетип часто ощущается как собранный и размеренный. Сдержанность здесь — не слабость, а умение не расплескать силу.",
          "Сондықтан бұл архетип жинақы әрі өлшемді сезіледі. Мұндағы ұстамдылық әлсіздік емес, күшті шашыратпай ұстай алу қабілеті.",
        ),
        knowledgeCheck: {
          question: text(
            "How was restraint interpreted in this branch?",
            "Как здесь интерпретировалась сдержанность?",
            "Бұл тармақта ұстамдылық қалай түсіндірілді?",
          ),
          options: [
            text(
              "As fear of action",
              "Как страх действовать",
              "Әрекеттен қорқу ретінде",
            ),
            text(
              "As the ability to keep power gathered",
              "Как умение удерживать силу собранной",
              "Күшті шашыратпай ұстай алу ретінде",
            ),
            text(
              "As refusal to care about others",
              "Как отказ заботиться о других",
              "Өзгеге мән бермеу ретінде",
            ),
          ].map((label, index) => ({
            id: `snow-basic-${index + 1}`,
            label,
          })),
          correctOptionId: "snow-basic-2",
          correctResponse: text(
            "Yes. The dialogue framed restraint as concentrated power, not as passivity.",
            "Да. Здесь сдержанность понималась как собранная сила, а не как пассивность.",
            "Иә. Бұл тармақта ұстамдылық енжарлық емес, жиналған күш ретінде берілді.",
          ),
          wrongResponse: text(
            "Not exactly. The key detail was that restraint kept strength from scattering.",
            "Не совсем. Важной была мысль о том, что сдержанность не даёт силе расплескаться.",
            "Толық емес. Негізгі деталь — ұстамдылық күштің шашырап кетпеуін қамтамасыз етеді.",
          ),
        },
      },
      {
        id: "story",
        type: "story",
        label: text(
          "Give me the symbolic depth",
          "Дай символическую глубину",
          "Символдық тереңдігін айт",
        ),
        firstText: text(
          "The snow leopard appears in broader Central Asian visual language as a sign of nobility, height, and contained authority. It is powerful, but its power is dignified rather than theatrical.",
          "Снежный барс в более широком центральноазиатском визуальном языке связан с благородством, высотой и собранной властью. Он силён, но эта сила достойна, а не театральна.",
          "Қар барысы Орталық Азияның кеңірек бейнелік тілінде тектілікпен, биіктікпен және жинақы беделмен байланысады. Оның күші бар, бірақ ол даңғаза емес, салмақты күш.",
        ),
        secondText: text(
          "So when this symbol is used for temperament, it points to reserve with inner altitude. The person may seem quiet, yet still shape the whole atmosphere of a group.",
          "Поэтому, когда этот символ используют для темперамента, он указывает на внутреннюю высоту в сочетании со сдержанностью. Человек может быть тихим, но всё равно менять атмосферу группы.",
          "Сондықтан бұл белгі темпераментке қолданылғанда, ол ішкі биіктікпен қатар жүретін ұстамдылықты меңзейді. Адам үнсіз көрінсе де, топтың бүкіл ахуалын өзгерте алады.",
        ),
        knowledgeCheck: {
          question: text(
            "What did the symbolic depth of the snow leopard emphasize?",
            "Что подчёркивала символическая глубина снежного барса?",
            "Қар барысының символдық тереңдігі нені баса көрсетті?",
          ),
          options: [
            text(
              "Dignified, contained authority",
              "Достойную, собранную власть",
              "Салмақты, жинақы беделді",
            ),
            text(
              "Permanent emotional volatility",
              "Постоянную эмоциональную нестабильность",
              "Үнемі эмоциялық тұрақсыздықты",
            ),
            text(
              "Habit of following crowds",
              "Привычку следовать за толпой",
              "Көпке еріп кету әдетін",
            ),
          ].map((label, index) => ({
            id: `snow-story-${index + 1}`,
            label,
          })),
          correctOptionId: "snow-story-1",
          correctResponse: text(
            "Exactly. The image pointed to noble, contained authority rather than display.",
            "Именно. Образ указывал на благородную собранную власть, а не на демонстративность.",
            "Дәл солай. Бұл бейне сыртқы шоу емес, текті де жинақы беделді меңзеді.",
          ),
          wrongResponse: text(
            "Not quite. The branch was about dignified authority held in reserve.",
            "Не совсем. Эта ветка говорила о достойной власти, удержанной в сдержанной форме.",
            "Сәл қате. Бұл тармақта ұстамды түрде ұсталған салмақты бедел туралы айтылды.",
          ),
        },
      },
    ],
  },
  {
    id: "animal-wolf",
    testType: "animal",
    resultKey: "wolf",
    introText: text(
      "In Kazakh and Turkic memory, this image is closer to Kok Bori than to a generic wolf. It carries ancestry, vigilance, route, and the refusal to abandon one's people.",
      "В казахской и тюркской памяти этот образ ближе к Көк бөрі, чем к просто 'волку'. В нём соединяются родовая память, настороженность, верность пути и отказ бросить своих.",
      "Қазақ және түркі жадында бұл бейне жай 'қасқырдан' гөрі Көк бөріге жақын. Оның ішінде тек, сергектік, жолға адалдық және өз жұртын тастамау бар.",
    ),
    branches: [
      {
        id: "basic",
        type: "basic",
        label: text(
          "What stands behind the Kok Bori image?",
          "Что стоит за образом Көк бөрі?",
          "Көк бөрі бейнесінің астарында не тұр?",
        ),
        firstText: text(
          "Kok Bori reacts quickly, but not blindly. In steppe imagination it protects direction: it knows where the line of loyalty runs and answers danger from that place.",
          "Көк бөрі қимылды тез жасайды, бірақ соқыр ашумен емес. Дала қиялында ол бағытты қорғайды: адалдық сызығы қайда жатқанын біліп, қауіпті сол жерден қарсы алады.",
          "Көк бөрі тез қимылдайды, бірақ соқыр ашумен емес. Дала қиялында ол бағытты қорғайды: адалдықтың сызығы қайда екенін біліп, қауіпті сол жерден қарсы алады.",
        ),
        secondText: text(
          "So its intensity is not random rage. It is alert force tied to belonging, to route, and to the duty not to scatter when something valuable must be guarded.",
          "Поэтому его интенсивность — не случайная ярость. Это собранная сила, связанная с принадлежностью, путём и обязанностью не рассыпаться, когда нужно что-то сберечь.",
          "Сондықтан оның қарқыны кездейсоқ ашу емес. Бұл — тиесілілікке, жолға және қымбат нәрсені қорғау керек кезде бытырамауға байланған сергек күш.",
        ),
        knowledgeCheck: {
          question: text(
            "What was Kok Bori's force tied to here?",
            "С чем здесь связывалась сила Көк бөрі?",
            "Бұл жерде Көк бөрінің күші немен байланыстырылды?",
          ),
          options: [
            text(
              "With direction and belonging",
              "С направлением и принадлежностью",
              "Бағыт пен тиесілілікпен",
            ),
            text("With vanity", "С тщеславием", "Менмендікпен"),
            text("With boredom", "Со скукой", "Зерігумен"),
          ].map((label, index) => ({
            id: `wolf-basic-${index + 1}`,
            label,
          })),
          correctOptionId: "wolf-basic-1",
          correctResponse: text(
            "Right. Kok Bori's power here was explained through direction, loyalty, and belonging rather than chaos.",
            "Верно. Сила Көк бөрі здесь объяснялась через направление, верность и принадлежность, а не через хаос.",
            "Дұрыс. Бұл жерде Көк бөрінің күші хаоспен емес, бағытпен, адалдықпен және тиесілілікпен түсіндірілді.",
          ),
          wrongResponse: text(
            "Not exactly. The key idea was that Kok Bori's intensity had direction and loyalty behind it.",
            "Не совсем. Ключевая мысль была в том, что за интенсивностью Көк бөрі стоят направление и верность.",
            "Толық емес. Негізгі ой — Көк бөрі қарқынының артында бағыт пен адалдық тұр.",
          ),
        },
      },
      {
        id: "story",
        type: "story",
        label: text(
          "Tell me the mythic layer of Kok Bori",
          "Расскажи мифический слой Көк бөрі",
          "Көк бөрінің мифтік қырын айт",
        ),
        firstText: text(
          "In Turkic memory, Kok Bori can appear not only as a predator, but as a guide, battle sign, and ancestral marker. The image does not merely frighten; it reminds people where they came from and how they endure.",
          "В тюркской памяти Көк бөрі может быть не только хищником, но и проводником, боевым знаком и знаком происхождения. Этот образ не просто пугает — он напоминает, откуда люди вышли и как они выстаивают.",
          "Түркі жадында Көк бөрі тек жыртқыш емес, жол көрсетуші, жауынгерлік белгі және тектің нышаны ретінде де көрінеді. Бұл бейне жай қорқытпайды, ол адамдарға қайдан шыққанын және қалай төтеп беретінін еске салады.",
        ),
        secondText: text(
          "That is why this archetype can feel solitary and collective at once. Kok Bori may stand apart, yet it moves in the name of lineage, people, and a road larger than one life.",
          "Поэтому этот архетип может одновременно ощущаться одиноким и коллективным. Көк бөрі стоит отдельно, но движется во имя рода, людей и пути, который больше одной жизни.",
          "Сондықтан бұл архетип бір мезетте жалғыз да, ұжымдық та сезіледі. Көк бөрі бөлек тұрса да, ру, ел және бір ғұмырдан да үлкен жол үшін қозғалады.",
        ),
        knowledgeCheck: {
          question: text(
            "What additional role did Kok Bori gain here besides predator?",
            "Какую дополнительную роль Көк бөрі получал здесь помимо хищника?",
            "Бұл тармақта Көк бөрі жыртқыштан бөлек қандай рөл алды?",
          ),
          options: [
            text(
              "Guide and ancestral sign",
              "Проводник и знак происхождения",
              "Жол көрсетуші және тектің нышаны",
            ),
            text(
              "Merchant and peacemaker",
              "Купец и миротворец",
              "Саудагер және бітімгер",
            ),
            text(
              "Symbol of indifference",
              "Символ безразличия",
              "Бейжайлықтың белгісі",
            ),
          ].map((label, index) => ({
            id: `wolf-story-${index + 1}`,
            label,
          })),
          correctOptionId: "wolf-story-1",
          correctResponse: text(
            "Exactly. The deeper layer made Kok Bori a guiding and ancestral image, not merely a danger sign.",
            "Именно. Более глубокий слой делал Көк бөрі образом проводника и происхождения, а не просто знаком опасности.",
            "Дәл солай. Терең қабат Көк бөріні жай қауіп белгісі емес, жол мен тектің бейнесіне айналдырды.",
          ),
          wrongResponse: text(
            "Not quite. Here Kok Bori gained the meaning of guide and origin.",
            "Не совсем. Здесь Көк бөрі получал значение проводника и истока.",
            "Сәл қате. Бұл жерде Көк бөрі жол көрсетуші және бастау мағынасын алды.",
          ),
        },
      },
    ],
  },
  {
    id: "animal-horse",
    testType: "animal",
    resultKey: "horse",
    introText: text(
      "In Kazakh imagination, this image is closer to Tulpar than to an ordinary horse. Tulpar joins speed with honor, companionship, and the wide breathing of the steppe.",
      "В казахском воображении этот образ ближе к образу Тұлпара, чем к просто лошади. Тұлпар соединяет скорость с честью, товариществом и широким дыханием степи.",
      "Қазақ қиялында бұл бейне жай жылқыдан гөрі Тұлпарға жақын. Тұлпар жылдамдықты намыспен, серіктестікпен және даланың кең тынысымен байланыстырады.",
    ),
    branches: [
      {
        id: "basic",
        type: "basic",
        label: text(
          "Why does Tulpar feel so social?",
          "Почему образ Тұлпара такой социальный?",
          "Тұлпар бейнесі неге сонша әлеуметтік сезіледі?",
        ),
        firstText: text(
          "Tulpar links movement with trust. A worthy ride is not simple control and obedience; it is one shared rhythm between rider and companion on the road.",
          "Тұлпар связывает движение с доверием. Достойная езда — это не просто контроль и подчинение, а общий ритм всадника и его спутника в пути.",
          "Тұлпар қозғалысты сеніммен байланыстырады. Дұрыс шабыс — жай билеу мен бағыну емес, шабандоз бен серігінің жол үстіндегі ортақ ырғағы.",
        ),
        secondText: text(
          "That is why this archetype feels warm and outward-moving. Contact here is not a burden, but a shared pace that carries people farther together.",
          "Поэтому этот архетип ощущается тёплым и направленным вовне. Контакт здесь не обуза, а общий темп, который уносит людей дальше вместе.",
          "Сондықтан бұл архетип жылы әрі сыртқа ұмтылатын болып сезіледі. Мұнда байланыс салмақ емес, адамдарды бірге алға апаратын ортақ қарқын.",
        ),
        knowledgeCheck: {
          question: text(
            "What was good riding compared to in this branch?",
            "С чем сравнивалась хорошая езда в этой ветке?",
            "Бұл тармақта дұрыс шабыс немен салыстырылды?",
          ),
          options: [
            text(
              "With a shared rhythm between rider and horse",
              "С общим ритмом всадника и лошади",
              "Шабандоз бен тұлпардың ортақ ырғағымен",
            ),
            text(
              "With strict domination",
              "Со строгим доминированием",
              "Қатаң үстемдікпен",
            ),
            text(
              "With public performance only",
              "Только с публичным выступлением",
              "Тек көпшілікке көрсетумен",
            ),
          ].map((label, index) => ({
            id: `horse-basic-${index + 1}`,
            label,
          })),
          correctOptionId: "horse-basic-1",
          correctResponse: text(
            "Yes. The branch connected Tulpar with shared rhythm and trust, not with domination alone.",
            "Да. Эта ветка связывала Тұлпара с общим ритмом и доверием, а не только с подчинением.",
            "Иә. Бұл тармақ Тұлпарды тек бағындырумен емес, ортақ ырғақ пен сеніммен байланыстырды.",
          ),
          wrongResponse: text(
            "Not exactly. The key idea was shared rhythm and trust on the road.",
            "Не совсем. Ключевая мысль была в общем ритме и доверии на пути.",
            "Толық емес. Негізгі ой — жол үстіндегі ортақ ырғақ пен сенім.",
          ),
        },
      },
      {
        id: "story",
        type: "story",
        label: text(
          "Show me the deeper cultural layer of Tulpar",
          "Покажи более глубокий культурный слой Тұлпара",
          "Тұлпардың терең мәдени қабатын көрсет",
        ),
        firstText: text(
          "In epic imagination, Tulpar is more than transport: it carries news, hospitality, rescue, and reputation across great distance. Through the horse, the steppe becomes connected life rather than empty space.",
          "В эпическом воображении Тұлпар — больше, чем транспорт. Он несёт вести, гостеприимство, спасение и славу через большие расстояния. Через него степь становится не пустотой, а связанной жизнью.",
          "Эпостық қиялда Тұлпар жай көлік емес. Ол алысқа хабарды, қонақжайлықты, құтқаруды және даңқты жеткізеді. Сол арқылы дала бос кеңістік емес, байланысқан өмірге айналады.",
        ),
        secondText: text(
          "So when Tulpar becomes a temperament symbol, it points to people who animate distance with energy, friendship, and readiness for the road. They do not simply cross space; they connect it.",
          "Поэтому, когда Тұлпар становится символом темперамента, он указывает на людей, которые оживляют расстояние энергией, дружелюбием и готовностью к дороге. Они не просто проходят пространство — они связывают его.",
          "Сондықтан Тұлпар темперамент белгісіне айналғанда, ол қашықтықты қуатпен, достықпен және жолға даярлықпен жандыратын адамдарды меңзейді. Олар кеңістікті жай өтпейді, оны байланыстырады.",
        ),
        knowledgeCheck: {
          question: text(
            "What did Tulpar help turn the steppe into in this branch?",
            "Во что Тұлпар помогал превращать степь в этой ветке?",
            "Бұл тармақта Тұлпар даланы неге айналдыруға көмектесті?",
          ),
          options: [
            text(
              "A lived and connected space",
              "В проживаемое и связанное пространство",
              "Өмір сүрілетін әрі байланысқан кеңістікке",
            ),
            text(
              "Only military rank",
              "Только военный ранг",
              "Тек әскери шенді",
            ),
            text(
              "Only weather predictions",
              "Только прогнозы погоды",
              "Тек ауа райы болжамын",
            ),
          ].map((label, index) => ({
            id: `horse-story-${index + 1}`,
            label,
          })),
          correctOptionId: "horse-story-1",
          correctResponse: text(
            "Exactly. The branch showed Tulpar as part of what made the steppe a lived, connected world.",
            "Именно. Эта ветка показывала Тұлпара как часть того, что делало степь проживаемым и связанным миром.",
            "Дәл солай. Бұл тармақ Тұлпарды даланы өмір сүрілетін әрі байланысқан әлемге айналдыратын күштің бірі ретінде көрсетті.",
          ),
          wrongResponse: text(
            "Not quite. The key detail was Tulpar's role in making the steppe lived and connected.",
            "Не совсем. Важной деталью была роль Тұлпара в том, что степь становилась проживаемой и связанной.",
            "Сәл қате. Маңызды деталь — Тұлпардың даланы өмір сүрілетін әрі байланысқан етуге қатысуы.",
          ),
        },
      },
    ],
  },
  {
    id: "animal-eagle",
    testType: "animal",
    resultKey: "eagle",
    introText: text(
      "The eagle is not only about height. In Kazakh imagination it is also about disciplined seeing: distance, patience, and exact descent at the needed moment.",
      "Беркут — это не только про высоту. В казахском воображении это ещё и про дисциплину взгляда: дистанцию, терпение и точный спуск в нужный момент.",
      "Бүркіт тек биіктік туралы емес. Қазақ қиялында ол көздің тәртібімен де байланысты: қашықтық, төзім және дәл сәттегі нық қону.",
    ),
    branches: [
      {
        id: "basic",
        type: "basic",
        label: text(
          "What does the eagle temperament emphasize?",
          "Что подчёркивает орлиный темперамент?",
          "Бүркіт темпераменті нені баса көрсетеді?",
        ),
        firstText: text(
          "The eagle does not rush into every movement below. Its image suggests selective attention: seeing more by reacting less often.",
          "Беркут не бросается на каждое движение внизу. Этот образ намекает на избирательное внимание: видеть больше именно потому, что реагируешь не на всё подряд.",
          "Бүркіт төмендегі әр қимылға бірдей ұмтылмайды. Бұл бейне таңдамалы назарды меңзейді: бәріне бірдей жауап бермей, көбірек көру.",
        ),
        secondText: text(
          "That is why this archetype often feels reflective. It protects depth by refusing to waste inner energy on every signal.",
          "Поэтому этот архетип часто ощущается как рефлексивный. Он бережёт глубину, не расходуя внутреннюю энергию на каждый сигнал.",
          "Сондықтан бұл архетип ойлы болып сезіледі. Ол ішкі күшті әр белгіге шашпай, тереңдікті қорғайды.",
        ),
        knowledgeCheck: {
          question: text(
            "How did the branch describe selective attention?",
            "Как здесь описывалось избирательное внимание?",
            "Бұл тармақта таңдамалы назар қалай сипатталды?",
          ),
          options: [
            text(
              "Seeing more by reacting less often",
              "Умением видеть больше, реагируя реже",
              "Сирек реакция беріп, көбірек көру",
            ),
            text(
              "Ignoring everything equally",
              "Равнодушием ко всему одинаково",
              "Бәріне бірдей немқұрайлы болу",
            ),
            text(
              "Answering every signal immediately",
              "Мгновенным ответом на любой сигнал",
              "Әр белгіге бірден жауап беру",
            ),
          ].map((label, index) => ({
            id: `eagle-basic-${index + 1}`,
            label,
          })),
          correctOptionId: "eagle-basic-1",
          correctResponse: text(
            "Right. The idea was not withdrawal for its own sake, but disciplined attention.",
            "Верно. Смысл был не в уходе от мира ради ухода, а в дисциплинированном внимании.",
            "Дұрыс. Мәселе жай шегінуде емес, тәртіпті назарда еді.",
          ),
          wrongResponse: text(
            "Not exactly. The branch emphasized disciplined attention: reacting less, seeing more.",
            "Не совсем. Эта ветка подчёркивала дисциплину внимания: меньше лишних реакций, больше видения.",
            "Толық емес. Бұл тармақ назар тәртібін айтты: артық реакция аз, көру көбірек.",
          ),
        },
      },
      {
        id: "story",
        type: "story",
        label: text(
          "Tell me the cultural craft behind it",
          "Расскажи культурное ремесло за этим образом",
          "Осы образдың артындағы мәдени шеберлікті айт",
        ),
        firstText: text(
          "In the tradition of berkutchi hunting, the bond between person and bird depends on patience, training, and mutual adjustment. Power without relation would fail.",
          "В традиции беркутчи связь между человеком и птицей держится на терпении, выучке и взаимной настройке. Сила без отношения здесь не сработала бы.",
          "Бүркітшілік дәстүрінде адам мен құс байланысы төзімге, машыққа және өзара икемге сүйенеді. Қатынассыз күш мұнда жұмыс істемес еді.",
        ),
        secondText: text(
          "So the eagle's image is not solitary grandeur alone. It also contains craftsmanship: the long work of making precision possible.",
          "Поэтому образ беркута — это не только одинокое величие. В нём есть ещё и ремесло: долгая работа, которая делает точность возможной.",
          "Сондықтан бүркіт бейнесі тек жалғыз айбын емес. Оның ішінде дәлдікті мүмкін ететін ұзақ еңбек, яғни шеберлік те бар.",
        ),
        knowledgeCheck: {
          question: text(
            "What made the eagle's precision possible in this branch?",
            "Что делало орлиную точность возможной в этой ветке?",
            "Бұл тармақта бүркіттің дәлдігін не мүмкін етті?",
          ),
          options: [
            text(
              "Patience, training, and mutual adjustment",
              "Терпение, выучка и взаимная настройка",
              "Төзім, машық және өзара икем",
            ),
            text(
              "Fear alone",
              "Один только страх",
              "Жалғыз қорқыныш",
            ),
            text(
              "Total isolation from people",
              "Полная изоляция от людей",
              "Адамнан толық оқшаулану",
            ),
          ].map((label, index) => ({
            id: `eagle-story-${index + 1}`,
            label,
          })),
          correctOptionId: "eagle-story-1",
          correctResponse: text(
            "Exactly. The branch tied precision to long relationship and craft.",
            "Именно. Здесь точность связывалась с долгой связью и ремеслом.",
            "Дәл солай. Бұл тармақ дәлдікті ұзақ байланыс пен шеберлікпен байланыстырды.",
          ),
          wrongResponse: text(
            "Not quite. The key detail was patient craft and mutual adjustment.",
            "Не совсем. Важной деталью были терпеливое ремесло и взаимная настройка.",
            "Сәл қате. Маңызды деталь — төзімді шеберлік пен өзара икем.",
          ),
        },
      },
    ],
  },
  {
    id: "weapon-bow",
    testType: "weapon",
    resultKey: "bow",
    introText: text(
      "The bow was central to steppe warfare not because it stayed far away, but because mounted archers turned distance into control.",
      "Лук не становится пассивным только потому, что держит дистанцию. В степной войне дистанция могла быть самой острой формой контроля.",
      "Садақ қашықтық ұстайды деп пассивті болмайды. Дала соғысында дәл сол қашықтық бақылаудың ең өткір түрі бола алатын.",
    ),
    branches: [
      {
        id: "basic",
        type: "basic",
        label: text(
          "Why is the bow a conflict style?",
          "Почему лук — это стиль конфликта?",
          "Садақ неге қақтығыс стилі болып тұр?",
        ),
        firstText: text(
          "A bow fights through timing, angle, and range. In a nomadic context, the archer reads movement first and releases only when position, rhythm, and exposure align.",
          "Лук предпочитает момент столкновению. Он действует после того, как считывает дистанцию, угол и цену слишком раннего входа.",
          "Садақ соқтығысудан гөрі мезетті таңдайды. Ол қашықтықты, бұрышты және ерте кірісудің құнын байқап барып әрекет етеді.",
        ),
        secondText: text(
          "That is why the bow symbolizes disciplined patience, not passivity. The strength lies in holding the right distance until the moment becomes yours.",
          "Поэтому 'луковые' люди часто сохраняют преимущество именно ожиданием. Их сдержанность стратегическая, а не нерешительная.",
          "Сондықтан 'садақ' адамдар артықшылықты көбіне күту арқылы сақтайды. Олардың ұстамдылығы шешімсіздік емес, стратегия.",
        ),
        knowledgeCheck: {
          question: text(
            "What did the bow prioritize over collision?",
            "Что лук ставил выше прямого столкновения?",
            "Садақ тікелей соқтығысудан жоғары нені қойды?",
          ),
          options: [
            text("Timing", "Момент", "Мезет"),
            text("Volume", "Громкость", "Дауыс қаттылығын"),
            text("Public approval", "Публичное одобрение", "Көптің мақұлдауын"),
          ].map((label, index) => ({
            id: `bow-basic-${index + 1}`,
            label,
          })),
          correctOptionId: "bow-basic-1",
          correctResponse: text(
            "Yes. The bow's logic in the dialogue was about timing and leverage.",
            "Да. Логика лука в этой ветке была про момент и преимущество.",
            "Иә. Бұл тармақта садақтың логикасы мезет пен артықшылық туралы болды.",
          ),
          wrongResponse: text(
            "Not exactly. The branch emphasized timing: acting after the situation is read.",
            "Не совсем. Эта ветка подчёркивала момент: действие после прочтения ситуации.",
            "Толық емес. Бұл тармақ мезетті айтты: жағдайды оқып барып әрекет ету.",
          ),
        },
      },
      {
        id: "story",
        type: "story",
        label: text(
          "Give me the deeper weapon logic",
          "Дай более глубокую логику оружия",
          "Қарудың терең логикасын айт",
        ),
        firstText: text(
          "The composite bow fit steppe life because it worked from horseback and in motion. Its logic was mobility: strike, wheel away, return from another angle, and never let the field trap you in one line.",
          "Составной лук был важен в степи потому, что работал вместе с движением, а не против него. Сила рождалась из дистанции, ритма и способности действовать, не застревая в одной линии.",
          "Құрама садақ далада маңызды болды, өйткені ол қозғалысқа қарсы емес, сонымен бірге жұмыс істеді. Күш қашықтықтан, ырғақтан және бір сызыққа байланып қалмай әрекет етуден туған.",
        ),
        secondText: text(
          "Culturally, that makes the bow an image of positional intelligence. It teaches that in Kazakh martial tradition, mastery is not only force, but knowing where and when force should enter.",
          "Поэтому как символ конфликта лук означает интеллект позиции. Он спрашивает не 'могу ли я сейчас продавить?', а 'из какой точки моё действие будет самым значимым?'",
          "Сондықтан қақтығыс символы ретінде садақ позицияның ақылын білдіреді. Ол 'қазір итере аламын ба?' деп емес, 'қай жерден әрекетім ең әсерлі болады?' деп сұрайды.",
        ),
        knowledgeCheck: {
          question: text(
            "What kind of intelligence did the bow symbolize in this branch?",
            "Какой тип ума символизировал лук в этой ветке?",
            "Бұл тармақта садақ қандай ақылды білдірді?",
          ),
          options: [
            text(
              "Intelligence of position",
              "Интеллект позиции",
              "Позицияның ақылын",
            ),
            text(
              "Love of noise",
              "Любовь к шуму",
              "Шуды ұнатуды",
            ),
            text(
              "Refusal to plan",
              "Отказ планировать",
              "Жоспарлаудан бас тартуды",
            ),
          ].map((label, index) => ({
            id: `bow-story-${index + 1}`,
            label,
          })),
          correctOptionId: "bow-story-1",
          correctResponse: text(
            "Exactly. The bow was framed as a symbol of choosing the most effective position before acting.",
            "Именно. Лук здесь описывался как символ выбора самой действенной позиции перед действием.",
            "Дәл солай. Бұл тармақта садақ әрекетке дейін ең тиімді орынды таңдайтын ақылдың белгісі болды.",
          ),
          wrongResponse: text(
            "Not quite. The deeper point was positional intelligence, not simple delay.",
            "Не совсем. Глубинная мысль была в позиционном уме, а не в простой отсрочке.",
            "Сәл қате. Терең ой жай кешіктіруде емес, позициялық ақылда болды.",
          ),
        },
      },
    ],
  },
  {
    id: "weapon-spear",
    testType: "weapon",
    resultKey: "spear",
    introText: text(
      "The nayza is direct, but in Kazakh martial symbolism directness is tied to honor, declared intent, and a visible line.",
      "Копьё прямолинейно, но прямота не равна безрассудству. Копьё делает линию видимой.",
      "Найза тура, бірақ туралық бейберекеттік емес. Найза шекараны көрінетін етеді.",
    ),
    branches: [
      {
        id: "basic",
        type: "basic",
        label: text(
          "What is strong about spear-like conflict?",
          "В чём сила копейного стиля?",
          "Найза стилінің күші неде?",
        ),
        firstText: text(
          "A spear makes a boundary plain. Instead of letting tension rot in hints and silence, it sets the line in the open so everyone can see where you stand.",
          "Копьё проясняет, где ты стоишь. Вместо того чтобы давать напряжению густеть в молчании, оно называет линию и выводит реальность наружу.",
          "Найза сенің қай жерде тұрғаныңды айқындайды. Үнсіздік ішінде шиеленісті қоюландыра бермей, ол шекараны атап, шындықты ашыққа шығарады.",
        ),
        secondText: text(
          "That openness is why spear-like conflict can feel harsh yet clean. The discomfort comes from contact, but the value comes from refusing to hide the issue behind maneuver.",
          "Поэтому этот стиль часто ощущается честным даже тогда, когда он неудобен. Дискомфорт приносит столкновение, но ценность приносит ясность.",
          "Сондықтан бұл стиль жайсыз болса да адал сезіледі. Қолайсыздық қақтығыстан туады, бірақ құндылығы айқындықтан келеді.",
        ),
        knowledgeCheck: {
          question: text(
            "What gave the spear style its value in the dialogue?",
            "Что давало копейному стилю ценность в этом объяснении?",
            "Бұл түсіндіруде найза стиліне құн берген не?",
          ),
          options: [
            text("Clarity", "Ясность", "Айқындық"),
            text("Secrecy", "Секретность", "Жасырындық"),
            text("Delay", "Задержка", "Кешіктіру"),
          ].map((label, index) => ({
            id: `spear-basic-${index + 1}`,
            label,
          })),
          correctOptionId: "spear-basic-1",
          correctResponse: text(
            "Right. The dialogue treated directness as valuable because it clarified reality.",
            "Верно. Здесь прямота ценилась потому, что проясняла реальность.",
            "Дұрыс. Бұл тармақта туралық шындықты айқындағаны үшін бағаланды.",
          ),
          wrongResponse: text(
            "Not exactly. The central idea was clarity: the spear names the line instead of hiding it.",
            "Не совсем. Центральная мысль была в ясности: копьё называет линию вместо того, чтобы её прятать.",
            "Толық емес. Негізгі ой айқындықта болды: найза шекараны жасырудың орнына атайды.",
          ),
        },
      },
      {
        id: "story",
        type: "story",
        label: text(
          "What is the deeper symbolic layer?",
          "Какой здесь более глубокий символический слой?",
          "Мұндағы терең символдық қабат қандай?",
        ),
        firstText: text(
          "The nayza points in one clear direction, and in steppe memory that matters. It resembles the public line of challenge, banner, and vow more than a hidden strike from cover.",
          "Копьё тянется наружу в одном видимом направлении. Символически это делает его оружием заявленного намерения, а не скрытого манёвра.",
          "Найза көзге көрінетін бір бағытпен алға шығады. Сол себепті ол символдық тұрғыдан жасырын айланың емес, жарияланған ниеттің қаруы болып көрінеді.",
        ),
        secondText: text(
          "So the spear becomes a cultural sign of declared intent. It teaches that dignity can come from naming the boundary openly before the clash begins.",
          "Это важно и культурно: некоторые люди сохраняют достоинство именно тем, что не маскируют суть. Ещё до удара сама линия уже говорит, где проходит граница.",
          "Мұның мәдени мәні де бар: кей адамдар қадірін дәл мағынаны жасырмау арқылы сақтайды. Соққыдан бұрын-ақ сызықтың өзі шекараның қайда екенін көрсетеді.",
        ),
        knowledgeCheck: {
          question: text(
            "What did the spear symbolize in this deeper branch?",
            "Что символизировало копьё в этой более глубокой ветке?",
            "Бұл терең тармақта найза нені білдірді?",
          ),
          options: [
            text(
              "Declared intent",
              "Заявленное намерение",
              "Жарияланған ниетті",
            ),
            text(
              "Hidden maneuver",
              "Скрытый манёвр",
              "Жасырын айланы",
            ),
            text(
              "Absence of boundaries",
              "Отсутствие границ",
              "Шекараның жоқтығын",
            ),
          ].map((label, index) => ({
            id: `spear-story-${index + 1}`,
            label,
          })),
          correctOptionId: "spear-story-1",
          correctResponse: text(
            "Exactly. The spear's meaning here was open intent and visible boundary.",
            "Именно. Значение копья здесь было в открытом намерении и видимой границе.",
            "Дәл солай. Бұл жерде найзаның мағынасы — ашық ниет пен көрінетін шекара.",
          ),
          wrongResponse: text(
            "Not quite. The deeper layer was about declared intent, not concealment.",
            "Не совсем. Глубокий слой здесь был про заявленное намерение, а не про скрытность.",
            "Сәл қате. Терең қабат жасырындық туралы емес, жарияланған ниет туралы болды.",
          ),
        },
      },
    ],
  },
  {
    id: "weapon-saber",
    testType: "weapon",
    resultKey: "saber",
    introText: text(
      "The qylysh is curved for a reason. In steppe cavalry culture, that curve belongs to movement, redirection, and effective action from the saddle.",
      "Сабля изогнута не случайно. Её образ намекает на движение, которое умеет подстраиваться и при этом не теряет силу.",
      "Қылыштың иіні бекер емес. Оның бейнесі икемделе отырып та әсерін жоғалтпайтын қозғалысты меңзейді.",
    ),
    branches: [
      {
        id: "basic",
        type: "basic",
        label: text(
          "Why does the saber fit negotiation?",
          "Почему сабля связана с переговорами?",
          "Қылыш неге келісіммен байланысады?",
        ),
        firstText: text(
          "A saber does not demand one rigid line. It works with motion, turning the rider's path and angle into force, which is why it fits flexible response better than blunt collision.",
          "Сабля не настаивает на одном жёстком угле. Она работает через движение по изгибу момента, поэтому становится сильным символом гибкого ответа.",
          "Қылыш бір ғана қатаң бұрышқа байланып қалмайды. Ол сәттің иінімен бірге қозғалып әсер етеді, сондықтан икемді жауаптың күшті белгісіне айналады.",
        ),
        secondText: text(
          "In conflict terms, that means keeping the exchange alive. Instead of hardening into pride, you look for the angle where movement, dignity, and effectiveness can still coexist.",
          "В языке конфликта это означает сохранять движение. Вместо того чтобы застрять в гордости, ты ищешь путь, по которому обе стороны ещё могут идти дальше.",
          "Қақтығыс тілінде бұл қозғалысты сақтауды білдіреді. Менмендікке байланып қалмай, екі жақ та әлі жүре алатын жол ізделеді.",
        ),
        knowledgeCheck: {
          question: text(
            "What did the saber style try to preserve?",
            "Что стремился сохранить сабельный стиль?",
            "Қылыш стилі нені сақтауға тырысты?",
          ),
          options: [
            text("Motion", "Движение", "Қозғалысты"),
            text("Silence", "Молчание", "Үнсіздікті"),
            text("Distance from everyone", "Дистанцию от всех", "Барлығынан қашықтықты"),
          ].map((label, index) => ({
            id: `saber-basic-${index + 1}`,
            label,
          })),
          correctOptionId: "saber-basic-1",
          correctResponse: text(
            "Yes. The saber branch valued keeping the process moving instead of hardening into pride.",
            "Да. Эта ветка ценила сохранение движения процесса, а не застывание в гордости.",
            "Иә. Бұл тармақ үдерісті қозғалыста ұстауды, менмендікке қатып қалмауды бағалады.",
          ),
          wrongResponse: text(
            "Not exactly. The key idea was preserving movement between the sides.",
            "Не совсем. Ключевая мысль была в том, чтобы сохранить движение между сторонами.",
            "Толық емес. Негізгі ой — екі жақ арасындағы қозғалысты сақтау.",
          ),
        },
      },
      {
        id: "story",
        type: "story",
        label: text(
          "Show me the deeper symbol",
          "Покажи более глубокий символ",
          "Тереңірек символын көрсет",
        ),
        firstText: text(
          "The curved qylysh teaches that force need not arrive head-on. In mounted combat its shape favors passing cuts and redirection, so power travels through angle as much as through impact.",
          "Изогнутый клинок намекает на перенаправление, а не только на лобовой удар. Символически это учит, что сила может идти через угол, а не только через нажим.",
          "Иілген жүз тек тік соққыны емес, бағытты бұруды да меңзейді. Символдық тұрғыдан ол күштің тек қысыммен емес, бұрыш арқылы да жұмыс істейтінін көрсетеді.",
        ),
        secondText: text(
          "That is why the saber becomes a strong image for mediation and tactical intelligence. It does not erase tension; it guides tension into a form that does less blind damage.",
          "Поэтому сабля становится удачным образом для посредничества. Она не отрицает напряжение, а меняет то, как напряжение проходит через обмен.",
          "Сондықтан қылыш бітім іздеудің жақсы бейнесіне айналады. Ол шиеленісті жоққа шығармайды, тек оның әңгіме ішіндегі жүру жолын өзгертеді.",
        ),
        knowledgeCheck: {
          question: text(
            "What did the curved blade symbolize here?",
            "Что символизировал изогнутый клинок?",
            "Бұл жерде иілген жүз нені білдірді?",
          ),
          options: [
            text(
              "Redirection of force through angle",
              "Перенаправление силы через угол",
              "Күшті бұрыш арқылы қайта бағыттау",
            ),
            text(
              "Fear of conflict",
              "Страх конфликта",
              "Қақтығыстан қорқуды",
            ),
            text(
              "Need to avoid decisions",
              "Необходимость избегать решений",
              "Шешімнен қашу қажеттігін",
            ),
          ].map((label, index) => ({
            id: `saber-story-${index + 1}`,
            label,
          })),
          correctOptionId: "saber-story-1",
          correctResponse: text(
            "Exactly. The deeper branch was about redirecting tension, not denying it.",
            "Именно. Глубокая ветка говорила о перенаправлении напряжения, а не о его отрицании.",
            "Дәл солай. Терең тармақ шиеленісті жоққа шығару емес, оны қайта бағыттау туралы болды.",
          ),
          wrongResponse: text(
            "Not quite. The main point was that force can be redirected through angle.",
            "Не совсем. Главная мысль была в том, что силу можно перенаправлять через угол.",
            "Сәл қате. Негізгі ой — күшті бұрыш арқылы қайта бағыттауға болады.",
          ),
        },
      },
    ],
  },
  {
    id: "weapon-shield",
    testType: "weapon",
    resultKey: "shield",
    introText: text(
      "A qalqan can look purely defensive, yet in camp, raid, or battle it protects the people, animals, and space behind it.",
      "Щит может выглядеть оборонительным со стороны. Но именно защита часто даёт группе время остаться людьми под давлением.",
      "Қалқан сырт көзге қорғаныс қана сияқты көрінуі мүмкін. Бірақ қысым кезінде топтың адам қалпын сақтауына көбіне дәл сол қорғаныс уақыт береді.",
    ),
    branches: [
      {
        id: "basic",
        type: "basic",
        label: text(
          "Why is protection an active style?",
          "Почему защита — это активный стиль?",
          "Қорғау неге белсенді стиль?",
        ),
        firstText: text(
          "A shield takes enough force that the line does not collapse. It cannot erase danger, but it prevents one blow from breaking the whole group.",
          "Щит принимает на себя достаточно удара, чтобы ситуация не рассыпалась. Он не убирает конфликт, но не даёт удару стать тотальным.",
          "Қалқан жағдай быт-шыт болып кетпеуі үшін соққының бір бөлігін өзіне алады. Ол қақтығысты жоймайды, бірақ соққының толық күйретуіне жол бермейді.",
        ),
        secondText: text(
          "That is why shield-like figures often preserve trust in hard moments. Their strength is not spectacle; it is holding the field long enough for kin, camp, or relationship to recover.",
          "Поэтому 'щитовые' люди часто сохраняют доверие в трудные моменты. Они удерживают поле достаточно долго, чтобы восстановление вообще оставалось возможным.",
          "Сондықтан 'қалқан' адамдар қиын сәтте сенімді сақтап қалатындар болады. Олар қалпына келу мүмкін болуы үшін жағдайды біраз уақыт ұстап тұрады.",
        ),
        knowledgeCheck: {
          question: text(
            "What did the shield keep possible in this branch?",
            "Что щит сохранял возможным в этой ветке?",
            "Бұл тармақта қалқан ненің мүмкін болып қалуын сақтады?",
          ),
          options: [
            text("Repair", "Восстановление", "Қалпына келуді"),
            text("Isolation", "Изоляцию", "Оқшаулануды"),
            text("Silence forever", "Вечное молчание", "Мәңгі үнсіздікті"),
          ].map((label, index) => ({
            id: `shield-basic-${index + 1}`,
            label,
          })),
          correctOptionId: "shield-basic-1",
          correctResponse: text(
            "Right. The shield's value here was buying enough safety for repair.",
            "Верно. Ценность щита здесь была в том, что он создавал достаточно безопасности для восстановления.",
            "Дұрыс. Бұл жерде қалқанның құны — қалпына келуге жететін қауіпсіз уақыт әперуінде.",
          ),
          wrongResponse: text(
            "Not exactly. The main idea was that protection kept repair possible.",
            "Не совсем. Главная мысль была в том, что защита сохраняла возможность восстановления.",
            "Толық емес. Негізгі ой — қорғау қалпына келу мүмкіндігін сақтап қалды.",
          ),
        },
      },
      {
        id: "story",
        type: "story",
        label: text(
          "Give me the deeper symbolism",
          "Дай более глубокую символику",
          "Терең символикасын айт",
        ),
        firstText: text(
          "A shield is relational by design: it turns toward impact so something behind it can remain standing. In steppe life that could mean a comrade, a family space, or the fragile order of the camp.",
          "Щит по природе своей реляционный: он поворачивается к удару так, чтобы что-то за ним могло устоять. Его смысл коллективен, даже если несёт его один человек.",
          "Қалқанның табиғаты байланыстық: ол соққыға өзі бұрылып, артындағы нәрсенің аман тұруына мүмкіндік береді. Бір адам ұстаса да, оның мағынасы ұжымдық.",
        ),
        secondText: text(
          "So culturally the qalqan symbolizes caretaking under strain. It teaches that protection is not withdrawal from the world, but choosing to carry pressure so others are not shattered by it.",
          "Из-за этого щит становится сильным символом заботы под давлением. Это не уход от мира, а готовность принять часть давления на себя, чтобы оно не сломало других.",
          "Сондықтан қалқан қысым кезіндегі қамқорлықтың күшті белгісі болады. Бұл әлемнен қашу емес, өзгелер сынбасын деп қысымның бір бөлігін өз мойнына алу.",
        ),
        knowledgeCheck: {
          question: text(
            "Why was the shield called relational in this branch?",
            "Почему щит здесь назывался реляционным?",
            "Бұл тармақта қалқан неге байланыстық деп аталды?",
          ),
          options: [
            text(
              "Because it faced impact so something behind it could stand",
              "Потому что он принимал удар, чтобы за ним могло устоять другое",
              "Өйткені ол соққыны өзіне алып, артындағы нәрсенің аман қалуына жағдай жасады",
            ),
            text(
              "Because it was always decorative",
              "Потому что он был только украшением",
              "Өйткені ол тек әшекей болған",
            ),
            text(
              "Because it avoided all burden",
              "Потому что избегал любой тяжести",
              "Өйткені ол кез келген салмақтан қашқан",
            ),
          ].map((label, index) => ({
            id: `shield-story-${index + 1}`,
            label,
          })),
          correctOptionId: "shield-story-1",
          correctResponse: text(
            "Exactly. The shield mattered because it carried impact for the sake of what stood behind it.",
            "Именно. Щит был важен потому, что принимал удар ради того, что стояло за ним.",
            "Дәл солай. Қалқанның мәні — артындағыны сақтау үшін соққыны өзіне алуында.",
          ),
          wrongResponse: text(
            "Not quite. The branch defined the shield through what it protected behind itself.",
            "Не совсем. Эта ветка определяла щит через то, что он защищал за собой.",
            "Сәл қате. Бұл тармақ қалқанды оның артында нені сақтай алғаны арқылы түсіндірді.",
          ),
        },
      },
    ],
  },
  {
    id: "enemy-mystan",
    testType: "enemy",
    resultKey: "mystan",
    introText: text(
      "Mystan Kempir frightens not only because she is magical, but because Kazakh folklore makes her a corrupted elder at the threshold of home and wilderness.",
      "Мыстан кемпір страшна не только магией, но и искажением знакомой роли. Та, кто по возрасту должна направлять и оберегать, превращается в фигуру, которая уводит в сторону и отравляет доверие.",
      "Мыстан кемпір тек сиқырымен емес, таныс рөлді бұрмалауымен қорқынышты. Жасы үлкен болғандықтан жол көрсетуі тиіс адам адастырып, сенімді улайтын бейнеге айналады.",
    ),
    branches: [
      {
        id: "basic",
        type: "basic",
        label: text(
          "Why does Mystan disturb so deeply?",
          "Почему Мыстан так глубоко тревожит?",
          "Мыстан неге сонша терең мазалайды?",
        ),
        firstText: text(
          "Her danger lies in broken trust. Mystan speaks with the face of counsel, age, and household familiarity, yet beneath that familiar role she misleads, withholds, and manipulates.",
          "Её опасность — в сломанном доверии. Мыстан может носить лицо совета, возраста и заботы, а под ним прятать манипуляцию.",
          "Оның қаупі — бұзылған сенімде. Мыстан кеңес, жас үлкендік не қамқорлық кейпіне еніп, астына айланы жасыра алады.",
        ),
        secondText: text(
          "That is why this enemy awakens when kindness feels unsafe. The wound is not only fear of attack, but fear that guidance itself has turned unreliable.",
          "Поэтому этот враг просыпается, когда тёплое начинает казаться двусмысленным. Человек начинает слышать скрытый мотив в каждом добром слове.",
          "Сондықтан бұл жау жылылықтың өзі екіұшты сезілгенде оянады. Адам әр жақсы сөздің ішінен жасырын себеп іздей бастайды.",
        ),
        knowledgeCheck: {
          question: text(
            "What role was twisted in Mystan's image here?",
            "Какая роль искажалась в образе Мыстан в этой ветке?",
            "Бұл тармақта Мыстан бейнесінде қандай рөл бұрмаланды?",
          ),
          options: [
            text(
              "The role of a guiding elder",
              "Роль старшей наставницы",
              "Жол көрсететін үлкен адамның рөлі",
            ),
            text(
              "The role of a market trader",
              "Роль базарной торговки",
              "Базардағы саудагердің рөлі",
            ),
            text(
              "The role of a victorious warrior",
              "Роль победоносной воительницы",
              "Жеңімпаз жауынгердің рөлі",
            ),
          ].map((label, index) => ({
            id: `mystan-basic-${index + 1}`,
            label,
          })),
          correctOptionId: "mystan-basic-1",
          correctResponse: text(
            "Exactly. The branch showed that Mystan becomes frightening when guidance itself can no longer be trusted.",
            "Именно. Эта ветка показывала, что Мыстан страшна там, где самому направлению уже нельзя доверять.",
            "Дәл солай. Бұл тармақ Мыстанның қорқынышының өзі бағытқа сенуге болмай қалған сәтте күшейетінін көрсетті.",
          ),
          wrongResponse: text(
            "Not quite. The key idea was the corruption of a guiding, elder role.",
            "Не совсем. Ключевая мысль была в порче направляющей, старшей роли.",
            "Сәл қате. Негізгі ой — жол көрсететін үлкен адамның рөлінің бұзылуында болды.",
          ),
        },
      },
      {
        id: "story",
        type: "story",
        label: text(
          "Give me the folklore layer",
          "Дай фольклорный слой",
          "Фольклорлық қабатын айт",
        ),
        firstText: text(
          "In tales, Mystan often waits near the border of yurt-space and wild space, luring the hero off the safe path. She embodies the fear that danger can enter not as a monster from nowhere, but through something almost familiar.",
          "В сказаниях Мыстан часто стоит на границе дома и дикой стороны мира, уводя героя с безопасной дороги. Она придаёт форму страху, что опасность может прийти через что-то знакомое.",
          "Ертегілерде Мыстан көбіне үй мен түздің шекарасында тұрып, батырды қауіпсіз жолдан тайдыруға тырысады. Ол қауіптің таныс нәрсенің ішінен келуі мүмкін деген қорқынышқа бейне береді.",
        ),
        secondText: text(
          "So culturally she is more than a witch. She is the image of corrupted guidance: age without protection, knowledge without mercy, and nearness without safety.",
          "Поэтому культурно Мыстан — не просто ведьма. Это образ испорченного наставления: возраст без защиты, близость без безопасности и знание без милости.",
          "Сондықтан мәдени тұрғыдан Мыстан жай мыстан емес. Ол — қорғансыз үлкендік, қауіпсіздіксіз жақындық және мейірімсіз білім бейнесі.",
        ),
        knowledgeCheck: {
          question: text(
            "What fear did Mystan give shape to in this branch?",
            "Какому страху придавала форму Мыстан в этой ветке?",
            "Бұл тармақта Мыстан қандай қорқынышқа бейне берді?",
          ),
          options: [
            text(
              "That danger can enter through the familiar",
              "Что опасность может прийти через знакомое",
              "Қауіп таныс нәрсенің ішінен келуі мүмкін деген қорқынышқа",
            ),
            text(
              "That every elder is dangerous",
              "Что любой старший опасен",
              "Әр үлкен адам қауіпті деген ойға",
            ),
            text(
              "That heroes should avoid every home",
              "Что героям надо избегать любого дома",
              "Батырлар кез келген үйден қашуы керек деген ойға",
            ),
          ].map((label, index) => ({
            id: `mystan-story-${index + 1}`,
            label,
          })),
          correctOptionId: "mystan-story-1",
          correctResponse: text(
            "Right. In this branch Mystan gave a face to the fear that the familiar itself may become unsafe.",
            "Верно. В этой ветке Мыстан давала лицо страху, что само знакомое может перестать быть безопасным.",
            "Дұрыс. Бұл тармақта Мыстан таныс дүниенің өзі қауіпті болып кетуі мүмкін деген қорқынышқа бейне берді.",
          ),
          wrongResponse: text(
            "Not exactly. The key detail was danger arriving through something familiar and trusted.",
            "Не совсем. Ключевая деталь была в том, что опасность приходила через знакомое и привычное.",
            "Толық емес. Негізгі деталь — қауіптің таныс әрі сенімді болып көрінген нәрсе арқылы келуі.",
          ),
        },
      },
    ],
  },
  {
    id: "enemy-zheztyrnak",
    testType: "enemy",
    resultKey: "zheztyrnak",
    introText: text(
      "Zheztyrnak terrifies because Kazakh folklore lets beauty and predation wear the same face. From afar she is graceful; up close, the iron claws appear.",
      "Жезтырнақ страшна тем, что красота и вред приходят вместе. В фольклоре она кажется изящной издалека, но её металлические когти выдают насилие, спрятанное под привлекательностью.",
      "Жезтырнақтың үрейі — сұлулық пен зиянның қатар келуінде. Фольклорда ол алыстан әсем көрінеді, бірақ темір тырнағы тартымдылықтың астындағы қатігездікті ашып береді.",
    ),
    branches: [
      {
        id: "basic",
        type: "basic",
        label: text(
          "What hurts most in this enemy?",
          "Что в этом враге ранит сильнее всего?",
          "Бұл жауда ең қатты не жаралайды?",
        ),
        firstText: text(
          "This result is sensitive to harm wrapped in admiration. The deepest cut comes when refinement, sweetness, or desirability is only a polished cover for cruelty.",
          "Этот результат особенно чувствителен к вреду, завернутому в восхищение. Самый глубокий порез приходит тогда, когда мягкость, изящество или привлекательность оказываются лишь оболочкой жестокости.",
          "Бұл нәтиже сүйсінуге оралған зиянға сезімтал. Ең терең жара жұмсақтық, әсемдік не тартымдылық қатыгездіктің қабығы болып шыққанда туады.",
        ),
        secondText: text(
          "That is why Zheztyrnak grows wherever charm stops feeling safe. A person starts scanning every elegant gesture for the hidden claw beneath it.",
          "Поэтому Жезтырнақ усиливается, когда отполированное одобрение перестаёт ощущаться безопасным. Человек начинает гадать, что скрывается за каждым изящным жестом.",
          "Сондықтан Жезтырнақ сыртқы әсем мақұлдау қауіпсіз сезілмей қалған кезде күшейеді. Адам әр әсем қимылдың артында не жасырынғанын ойлай бастайды.",
        ),
        knowledgeCheck: {
          question: text(
            "What made the wound sharper in this branch?",
            "Что делало рану острее в этой ветке?",
            "Бұл тармақта жараны не тереңдете түсті?",
          ),
          options: [
            text(
              "Cruelty hidden beneath charm",
              "Жестокость, скрытая под привлекательностью",
              "Тартымдылықтың астына жасырылған қатыгездік",
            ),
            text(
              "The weather around the scene",
              "Погода вокруг сцены",
              "Жағдай кезіндегі ауа райы",
            ),
            text(
              "The lack of movement",
              "Отсутствие движения",
              "Қозғалыстың жоқтығы",
            ),
          ].map((label, index) => ({
            id: `zhez-basic-${index + 1}`,
            label,
          })),
          correctOptionId: "zhez-basic-1",
          correctResponse: text(
            "Exactly. The branch stressed that the danger came from cruelty hiding behind beauty.",
            "Именно. Эта ветка подчёркивала, что опасность рождается там, где жестокость прячется за красотой.",
            "Дәл солай. Бұл тармақ қауіптің сұлулықтың астына жасырылған қатыгездіктен туатынын айтты.",
          ),
          wrongResponse: text(
            "Not quite. The key idea was harm disguised as grace and attraction.",
            "Не совсем. Ключевая мысль была во вреде, замаскированном под изящество и привлекательность.",
            "Толық емес. Негізгі ой — әсемдік пен тартымдылық кейпіне енген зиянда.",
          ),
        },
      },
      {
        id: "story",
        type: "story",
        label: text(
          "Show me the deeper folklore image",
          "Покажи более глубокий фольклорный образ",
          "Тереңірек фольклорлық бейнесін көрсет",
        ),
        firstText: text(
          "The iron claws are the key folklore detail. They rip away the false surface, revealing that what looked noble or alluring was predatory all along.",
          "Здесь важны именно железные когти. Они срывают ложную поверхность: то, что казалось утончённым, внезапно показывает свою хищную суть.",
          "Мұнда темір тырнақтың өзі маңызды. Ол жалған бетті жұлып тастайды: әсем көрінген нәрсе кенеттен жыртқыш табиғатын көрсетеді.",
        ),
        secondText: text(
          "That makes Zheztyrnak a warning about appearances without mercy. In cultural terms, she teaches that beauty without ethical depth can become one more weapon.",
          "Это учит осторожности к красоте, оторванной от милосердия. Не каждое прекрасное лицо или изящная манера защищают достоинство — некоторые лишь мягче скрывают удар.",
          "Бұл мейірімнен ажыраған әсемдікке сақ болуды үйретеді. Әр сұлу жүз бен әдемі қимыл қадірді қорғамайды — кейбірі жараны тек жұмсартып жасырады.",
        ),
        knowledgeCheck: {
          question: text(
            "What revealed the hidden danger in Zheztyrnak's image?",
            "Что раскрывало скрытую опасность в образе Жезтырнақ?",
            "Жезтырнақ бейнесіндегі жасырын қауіпті не ашып берді?",
          ),
          options: [
            text(
              "Her iron claws",
              "Её железные когти",
              "Оның темір тырнағы",
            ),
            text(
              "Her golden jewelry",
              "Её золотые украшения",
              "Оның алтын әшекейі",
            ),
            text(
              "Her loud laughter",
              "Её громкий смех",
              "Оның қатты күлкісі",
            ),
          ].map((label, index) => ({
            id: `zhez-story-${index + 1}`,
            label,
          })),
          correctOptionId: "zhez-story-1",
          correctResponse: text(
            "Right. The iron claws exposed the violence hidden behind the polished surface.",
            "Верно. Железные когти вскрывали насилие, спрятанное за отполированной внешностью.",
            "Дұрыс. Темір тырнақ жылтыратылған сыртқы беттің астындағы зорлықты ашып берді.",
          ),
          wrongResponse: text(
            "Not exactly. The key symbol was the iron claws that revealed beauty without mercy.",
            "Не совсем. Ключевым символом были железные когти, разоблачавшие красоту без милости.",
            "Толық емес. Негізгі символ — мейірімсіз сұлулықты әшкерелейтін темір тырнақ болды.",
          ),
        },
      },
    ],
  },
  {
    id: "enemy-aydahar",
    testType: "enemy",
    resultKey: "aydahar",
    introText: text(
      "Aydahar is frightening not just because it is huge. In Kazakh and steppe tales it devours the shared world by seizing roads, water, or peace until everything bends around its hunger.",
      "Айдаһар страшен не только размером. В степных сказаниях он действует как пожирающая сила, захватывающая дорогу, воду или покой, пока всё вокруг не начинает жить по его логике.",
      "Айдаһар тек алыптығымен қорқытпайды. Дала әңгімелерінде ол жолды, суды не тыныштықты басып алатын жалмауыш күш болып көрінеді де, айналаның бәрін өз ырғағына көндіреді.",
    ),
    branches: [
      {
        id: "basic",
        type: "basic",
        label: text(
          "What does Aydahar mean psychologically?",
          "Что Айдаһар означает психологически?",
          "Айдаһар психологиялық тұрғыдан нені білдіреді?",
        ),
        firstText: text(
          "Here Aydahar symbolizes one danger swelling until it occupies the whole horizon. Fear rises when disorder grows so large that the mind no longer sees proportion.",
          "В этом результате Айдаһар символизирует одну угрозу, разрастающуюся до размеров всего поля. Страх начинается там, где давление растёт быстрее, чем успевает вернуться порядок.",
          "Бұл нәтижеде Айдаһар бір қауіпті бүкіл өрісті басып алатындай үлкейтіп жібереді. Қорқыныш қысым тәртіп қайта орнағаннан жылдамырақ өскен кезде туады.",
        ),
        secondText: text(
          "That is why this enemy pushes toward urgency. If the threat is not named and bounded, every corner starts to feel as though it already belongs to the dragon.",
          "Поэтому этот враг толкает к срочности. Если угрозу вовремя не назвать и не очертить, сознание начинает воспринимать всё так, будто поле уже осаждено.",
          "Сондықтан бұл жау асығыстыққа итереді. Егер қатер дер кезінде аталып, шектелмесе, сана бәрін әлдеқашан қоршауда тұрғандай қабылдай бастайды.",
        ),
        knowledgeCheck: {
          question: text(
            "How did Aydahar make the whole field feel here?",
            "Каким Айдаһар заставлял ощущаться всё поле здесь?",
            "Бұл жерде Айдаһар бүкіл өрісті қандай күйде сездірді?",
          ),
          options: [
            text(
              "As if it were under siege",
              "Как будто оно уже в осаде",
              "Әлдеқашан қоршауда тұрғандай",
            ),
            text(
              "Only one minor detail",
              "Только одну мелкую деталь",
              "Тек бір ұсақ детальді",
            ),
            text(
              "Only other people",
              "Только других людей",
              "Тек өзге адамдарды",
            ),
          ].map((label, index) => ({
            id: `aydahar-basic-${index + 1}`,
            label,
          })),
          correctOptionId: "aydahar-basic-1",
          correctResponse: text(
            "Exactly. The branch showed how one threat can expand until everything feels besieged.",
            "Именно. Эта ветка показывала, как одна угроза может разрастись так, что осаждённым начинает ощущаться уже всё.",
            "Дәл солай. Бұл тармақ бір қатердің өсіп, ақыры бүкіл дүниені қоршауда тұрғандай сездіре алатынын көрсетті.",
          ),
          wrongResponse: text(
            "Not quite. The key detail was expansion until the whole field felt under siege.",
            "Не совсем. Ключевая деталь была в разрастании угрозы до ощущения полной осады.",
            "Толық емес. Негізгі деталь — қатердің бүкіл өрісті қоршаудай сездіргенше ұлғаюы.",
          ),
        },
      },
      {
        id: "story",
        type: "story",
        label: text(
          "Give me the folklore layer",
          "Дай фольклорный слой",
          "Фольклорлық қабатын айт",
        ),
        firstText: text(
          "In folklore, Aydahar rarely harms only one person. It blocks passage, claims what should flow, and forces heroes to face the devouring force everyone else has been circling around.",
          "В народном воображении Айдаһар редко вредит только в одном месте. Он перекрывает путь, присваивает то, что должно течь и идти дальше, и заставляет героя столкнуться с тем, что уже нельзя игнорировать.",
          "Халық қиялында Айдаһар бір ғана бұрышқа зиян келтірмейді. Ол жолды бөгейді, ағуы тиіс нәрсені иемденеді және батырды елемеуге болмайтындай болып үлкейген қатермен беттестіреді.",
        ),
        secondText: text(
          "Culturally, then, Aydahar is an image of escalation. Delay feeds it, and courage begins by restoring order where fear had started to spread like occupation.",
          "Поэтому культурно Айдаһар становится образом эскалации. Его подпитывает промедление, а храбрость начинается там, где человек возвращает форму расползающемуся страху.",
          "Сондықтан мәдени тұрғыдан Айдаһар — ұлғайып бара жатқан қатердің бейнесі. Оны кідіріс қоректендіреді, ал ерлік қорқыныш жайыла бастаған жерде қайтадан тәртіп орнатудан басталады.",
        ),
        knowledgeCheck: {
          question: text(
            "What did Aydahar often block or seize in this folklore layer?",
            "Что Айдаһар часто перекрывал или захватывал в этом фольклорном слое?",
            "Бұл фольклорлық қабатта Айдаһар нені жиі бөгеп не иемденіп алатын?",
          ),
          options: [
            text(
              "Passage, flow, or peace",
              "Путь, течение или покой",
              "Жолды, ағысты не тыныштықты",
            ),
            text("Too much gratitude", "Излишняя благодарность", "Артық алғыс"),
            text("Too much celebration", "Слишком много праздника", "Тым көп мереке"),
          ].map((label, index) => ({
            id: `aydahar-story-${index + 1}`,
            label,
          })),
          correctOptionId: "aydahar-story-1",
          correctResponse: text(
            "Right. In this branch Aydahar was the force that blocks movement, flow, and peace until everything bends around it.",
            "Верно. В этой ветке Айдаһар был силой, которая перекрывает движение, течение и покой, пока всё вокруг не подчинится ей.",
            "Дұрыс. Бұл тармақта Айдаһар қозғалысты, ағысты және тыныштықты бөгеп, айналаның бәрін өзіне бағындыратын күш ретінде берілді.",
          ),
          wrongResponse: text(
            "Not quite. The key detail was Aydahar's habit of blocking what should move and flow freely.",
            "Не совсем. Ключевая деталь была в том, что Айдаһар перекрывает то, что должно свободно идти и течь.",
            "Толық емес. Негізгі деталь — Айдаһардың еркін жүруі не ағуы тиіс нәрсені бөгеп тастауында.",
          ),
        },
      },
    ],
  },
  {
    id: "enemy-zhalgyzKozdiDau",
    testType: "enemy",
    resultKey: "zhalgyzKozdiDau",
    introText: text(
      "Zhalgyz Kozdi Dau is frightening not only because it is strong, but because its single eye stands for one-sided seeing. In folklore, that narrowed vision turns force into a false total truth.",
      "Жалғыз Көзді Дау страшен не только силой, но и тем, что видит одним глазом. В фольклоре этот единственный глаз превращает силу в одностороннюю 'правду'.",
      "Жалғыз Көзді Дау тек күшімен емес, бір көзбен ғана көретінімен қорқынышты. Фольклорда сол жалғыз көз күшті біржақты 'ақиқатқа' айналдырады.",
    ),
    branches: [
      {
        id: "basic",
        type: "basic",
        label: text(
          "What does this enemy do psychologically?",
          "Что этот враг делает психологически?",
          "Бұл жау психологиялық тұрғыдан не істейді?",
        ),
        firstText: text(
          "This result is wounded most by crushing hierarchy and unquestionable force. Fear appears when one viewpoint grows so dominant that nuance, reply, and human scale have no room left.",
          "Этот результат сильнее всего ранят подавляющая иерархия и сила, с которой нельзя спорить. Страх появляется там, где уже не остаётся места для нюанса, ответа и человеческого масштаба.",
          "Бұл нәтижені ең қатты жаншитын нәрсе — басып тастайтын иерархия мен даусыз күш. Қорқыныш реңкке, жауапқа және адамдық өлшемге орын қалмаған жерде туады.",
        ),
        secondText: text(
          "That is why this enemy makes the world feel reduced to command and submission. Once only one eye is allowed to see, many meanings are pushed out of existence.",
          "Поэтому этот враг может заставить весь мир ощущаться сведённым к приказу и подчинению. Когда правит только один глаз, множественным смыслам будто больше не разрешено существовать.",
          "Сондықтан бұл жау бүкіл әлемді бұйрық пен бағынуға дейін тарылтып жібере алады. Бір ғана көз билеген кезде, көп мағынаға орын қалмайды.",
        ),
        knowledgeCheck: {
          question: text(
            "What disappeared when only one eye remained in this branch?",
            "Что исчезало, когда в этой ветке оставался только один глаз?",
            "Бұл тармақта бір көз ғана қалған кезде не жоғала бастады?",
          ),
          options: [
            text(
              "Room for many meanings",
              "Пространство для множественных смыслов",
              "Көп мағынаға арналған орын",
            ),
            text(
              "The need for food",
              "Потребность в пище",
              "Тамаққа деген қажеттілік",
            ),
            text(
              "The idea of movement",
              "Идея движения",
              "Қозғалыс ұғымы",
            ),
          ].map((label, index) => ({
            id: `dau-basic-${index + 1}`,
            label,
          })),
          correctOptionId: "dau-basic-1",
          correctResponse: text(
            "Exactly. The branch treated one-eyed power as the collapse of nuance and reply.",
            "Именно. Эта ветка трактовала одноглазую силу как схлопывание нюанса и права на ответ.",
            "Дәл солай. Бұл тармақта біркөз күш реңк пен жауап беру мүмкіндігінің жойылуы ретінде түсіндірілді.",
          ),
          wrongResponse: text(
            "Not quite. The key idea was that one-eyed power erases nuance and many meanings.",
            "Не совсем. Ключевая мысль была в том, что одноглазая сила стирает нюанс и множественность смыслов.",
            "Толық емес. Негізгі ой — біркөз күш реңк пен көп мағынаны өшіреді.",
          ),
        },
      },
      {
        id: "story",
        type: "story",
        label: text(
          "Tell me the deeper folklore symbol",
          "Расскажи более глубокий фольклорный символ",
          "Тереңірек фольклорлық символын айт",
        ),
        firstText: text(
          "The one eye is the crucial symbol. It makes the giant more than physically powerful: he becomes the figure of narrowed perception, where one reading swallows the whole field.",
          "Важен именно один глаз. Он делает великана не просто грубой силой, а фигурой суженного восприятия, где одно прочтение захватывает всё поле.",
          "Мұнда бір көздің өзі маңызды. Ол алыпты жай күштен гөрі тарылған қабылдаудың бейнесіне айналдырады: бір ғана түсінік бүкіл кеңістікті басып алады.",
        ),
        secondText: text(
          "In tales, heroes do not overcome such a giant by becoming blunter than he is. They survive by wit, timing, and finding the blind side of one-sided certainty.",
          "В сказаниях герои редко спасаются от такого великана тем, что становятся сильнее него. Их спасают смекалка, чувство момента и умение найти слепую сторону грубой уверенности.",
          "Ертегілерде батырлар мұндай алыптан одан да күшті болып құтылмайды. Оларды құтқаратын — тапқырлық, мезетті сезу және дөрекі сенімнің соқыр тұсын табу.",
        ),
        knowledgeCheck: {
          question: text(
            "How were heroes more likely to survive this giant in the folklore reading?",
            "Как герои скорее всего выживали рядом с таким великаном в фольклорном прочтении?",
            "Фольклорлық оқылымда батырлар мұндай алыптан қалай аман қалуға бейім болды?",
          ),
          options: [
            text(
              "By wit and finding its blind side",
              "Смекалкой и поиском его слепой стороны",
              "Тапқырлықпен және оның соқыр тұсын табу арқылы",
            ),
            text(
              "By serving him obediently forever",
              "Послушным служением ему навсегда",
              "Оған мәңгі мойынсұну арқылы",
            ),
            text(
              "By avoiding all movement",
              "Полным отказом от движения",
              "Қозғалыстан толық бас тарту арқылы",
            ),
          ].map((label, index) => ({
            id: `dau-story-${index + 1}`,
            label,
          })),
          correctOptionId: "dau-story-1",
          correctResponse: text(
            "Right. The folklore layer stressed that brute force is not all-seeing; wit survives by finding what one-sided power cannot notice.",
            "Верно. Фольклорный слой подчёркивал, что грубая сила видит не всё; смекалка выживает, находя то, чего односторонняя власть не замечает.",
            "Дұрыс. Фольклорлық қабат дөрекі күштің бәрін көрмейтінін көрсетті; тапқырлық біржақты билік байқамайтын тұсты табу арқылы аман қалады.",
          ),
          wrongResponse: text(
            "Not quite. The point was that heroes survive one-sided force through wit and timing, not by becoming even more blunt.",
            "Не совсем. Смысл был в том, что от односторонней силы спасают смекалка и чувство момента, а не ещё большая грубость.",
            "Толық емес. Негізгі ой — біржақты күштен одан да зор күшпен емес, тапқырлық пен мезетті сезу арқылы аман қалу.",
          ),
        },
      },
    ],
  },
] as const;

export const CULTURAL_DIALOGUE_DEFINITIONS = DIALOGUE_SEEDS.map(buildDialogue);

export const CULTURAL_DIALOGUES_BY_KEY = Object.fromEntries(
  CULTURAL_DIALOGUE_DEFINITIONS.map((dialogue) => [dialogue.id, dialogue]),
) as Record<string, AltynAdamCulturalDialogueDefinition>;

export const CULTURAL_DIALOGUES_BY_RESULT = Object.fromEntries(
  CULTURAL_DIALOGUE_DEFINITIONS.map((dialogue) => [
    `${dialogue.testType}:${dialogue.resultKey}`,
    dialogue,
  ]),
) as Record<string, AltynAdamCulturalDialogueDefinition>;

export const TOTAL_CULTURAL_DIALOGUES = CULTURAL_DIALOGUE_DEFINITIONS.length;

export const CULTURAL_DIALOGUE_RESULT_KEYS_BY_TEST = {
  personality: ["batyr", "zhyrau", "shanyraq", "aldarKose"],
  animal: ["snowLeopard", "wolf", "horse", "eagle"],
  weapon: ["bow", "spear", "saber", "shield"],
  enemy: ["mystan", "zheztyrnak", "aydahar", "zhalgyzKozdiDau"],
} satisfies Record<StandardTestType, string[]>;

export function normalizeAltynAdamLanguage(
  language: string,
): AltynAdamLanguage {
  if (language.startsWith("ru")) {
    return "ru";
  }

  if (language.startsWith("kk")) {
    return "kk";
  }

  return "en";
}

export function resolveLocalizedText(
  value: LocalizedText,
  language: AltynAdamLanguage,
) {
  return value[language];
}

export function getCulturalDialogueDefinition(
  testType: StandardTestType,
  resultKey: string,
) {
  return CULTURAL_DIALOGUES_BY_RESULT[`${testType}:${resultKey}`] ?? null;
}
