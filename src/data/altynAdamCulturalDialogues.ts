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
  en: "Let us see which detail stayed with you.",
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
      "Aldar Kose is usually reduced to 'the trickster'. But in Kazakh stories trickery often exposes vanity, greed, or lazy power.",
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
          "The trickster moves where direct force cannot. He survives by reading motives, shifting frames, and making hidden absurdity visible.",
          "Трикстер действует там, где прямая сила бессильна. Он выживает за счёт чтения мотивов, смены рамки и умения сделать скрытую нелепость видимой.",
          "Трикстер тура күш жетпейтін жерде жұмыс істейді. Ол ниетті сезіп, жағдайдың қалыбын өзгертіп, жасырын қисынсыздықты көрінетін етеді.",
        ),
        secondText: text(
          "That is why Aldar Kose is not only 'clever'. His wit is social: it protects the weak by making arrogance stumble over itself.",
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
          "Stories about Aldar Kose often reverse hierarchy without open war. A rich fool, a greedy host, or a proud official loses face not because someone crushes him, but because his own excess becomes obvious.",
          "Истории об Алдаре Косе часто переворачивают иерархию без открытой войны. Богатый глупец, жадный хозяин или гордый чиновник теряет лицо не потому, что его ломают силой, а потому что его собственный избыток становится очевидным.",
          "Алдар Көсе туралы әңгімелер иерархияны ашық соғыссыз-ақ төңкере алады. Бай ақымақ, сараң қожа не тәкаппар би күшпен емес, өз шектен шығуының ашылып қалуы арқылы ұтылады.",
        ),
        secondText: text(
          "That reversal matters culturally: laughter becomes a tool for moral balance. It reminds listeners that rank without measure is unstable.",
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
      "The wolf is often flattened into aggression. But in Turkic and steppe imagination it also carries alertness, direction, and fierce loyalty to a line of movement.",
      "Волка часто упрощают до агрессии. Но в тюркском и степном воображении в нём есть ещё настороженность, направление и жёсткая верность своей линии движения.",
      "Қасқырды көбіне тек агрессияға теңеп жібереді. Бірақ түркі және дала қиялында ол сергектікпен, бағытпен және өз жолына қатаң адалдықпен де байланысты.",
    ),
    branches: [
      {
        id: "basic",
        type: "basic",
        label: text(
          "What stands behind the wolf image?",
          "Что стоит за образом волка?",
          "Қасқыр бейнесінің астарында не тұр?",
        ),
        firstText: text(
          "The wolf reacts fast, but not randomly. Its image suggests a temperament that senses threat early and moves decisively once the line is clear.",
          "Волк реагирует быстро, но не хаотично. Этот образ намекает на темперамент, который рано чувствует угрозу и действует решительно, когда линия уже ясна.",
          "Қасқыр тез қимылдайды, бірақ ретсіз емес. Бұл бейне қауіпті ерте сезіп, шекара айқындалған сәтте нық әрекет ететін мінезді меңзейді.",
        ),
        secondText: text(
          "So intensity here is tied to orientation. The point is not raw anger, but the refusal to drift when something important must be protected.",
          "Поэтому интенсивность здесь связана с ориентиром. Смысл не в голом гневе, а в отказе плыть по течению, когда нужно что-то важное защитить.",
          "Сондықтан мұндағы қарқын бағытпен байланысты. Мәселе жалаң ашуда емес, маңызды нәрсені қорғау керек кезде ағынмен кете салмауда.",
        ),
        knowledgeCheck: {
          question: text(
            "What did the branch say intensity was tied to?",
            "С чем здесь связывалась интенсивность?",
            "Бұл тармақта қарқын немен байланыстырылды?",
          ),
          options: [
            text("With orientation", "С ориентиром", "Бағдармен"),
            text("With vanity", "С тщеславием", "Менмендікпен"),
            text("With boredom", "Со скукой", "Зерігумен"),
          ].map((label, index) => ({
            id: `wolf-basic-${index + 1}`,
            label,
          })),
          correctOptionId: "wolf-basic-1",
          correctResponse: text(
            "Right. The wolf's force was explained as directional rather than chaotic.",
            "Верно. Сила волка здесь объяснялась как направленная, а не хаотичная.",
            "Дұрыс. Бұл жерде қасқырдың күші ретсіз емес, бағытталған күш ретінде түсіндірілді.",
          ),
          wrongResponse: text(
            "Not exactly. The key idea was that the wolf's intensity had direction.",
            "Не совсем. Ключевая мысль была в том, что интенсивность волка имеет направление.",
            "Толық емес. Негізгі ой — қасқыр қарқынының бағыты бар.",
          ),
        },
      },
      {
        id: "story",
        type: "story",
        label: text(
          "Tell me the mythic layer",
          "Расскажи мифический слой",
          "Мифтік қырын айт",
        ),
        firstText: text(
          "In Turkic memory, the wolf can appear not only as predator, but as guide and ancestral sign. That changes the tone of the image completely: fierceness starts to carry direction and origin.",
          "В тюркской памяти волк может быть не только хищником, но и проводником, и знаком происхождения. Из-за этого оттенок образа меняется: свирепость начинает нести в себе направление и исток.",
          "Түркі жадында қасқыр тек жыртқыш емес, жол көрсетуші әрі тектің нышаны ретінде де көрінеді. Сол себепті бейненің реңкі өзгереді: қатыгез көрінген күштің өзінде бағыт пен бастау пайда болады.",
        ),
        secondText: text(
          "That is why the wolf archetype often feels lonely and collective at once. It can stand apart, yet still move in the name of a larger belonging.",
          "Поэтому волчий архетип часто одновременно одинокий и коллективный. Он может стоять отдельно, но всё равно двигаться ради большего целого.",
          "Сондықтан қасқыр архетипі бір мезетте жалғыз да, ұжымдық та сезіледі. Ол бөлек тұрса да, үлкен бір тұтастық үшін қозғала алады.",
        ),
        knowledgeCheck: {
          question: text(
            "What additional role did the wolf gain in this branch besides predator?",
            "Какую дополнительную роль волк получал здесь помимо хищника?",
            "Бұл тармақта қасқыр жыртқыштан бөлек қандай рөл алды?",
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
            "Exactly. The deeper layer made the wolf a guiding and ancestral image, not merely a danger sign.",
            "Именно. Более глубокий слой делал волка образом проводника и происхождения, а не просто знаком опасности.",
            "Дәл солай. Терең қабат қасқырды жай қауіп белгісі емес, жол мен тектің бейнесіне айналдырды.",
          ),
          wrongResponse: text(
            "Not quite. Here the wolf gained the meaning of guide and origin.",
            "Не совсем. Здесь волк получал значение проводника и истока.",
            "Сәл қате. Бұл жерде қасқыр жол көрсетуші және бастау мағынасын алды.",
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
      "The horse in Kazakh culture is never just transport. It carries rhythm, companionship, mobility, and the feeling of open horizon.",
      "Лошадь в казахской культуре никогда не была просто транспортом. В ней есть ритм, товарищество, подвижность и чувство открытого горизонта.",
      "Жылқы қазақ мәдениетінде ешқашан жай көлік қана болмаған. Оның ішінде ырғақ, серіктестік, қозғалыс және ашық көкжиек сезімі бар.",
    ),
    branches: [
      {
        id: "basic",
        type: "basic",
        label: text(
          "Why does the horse feel so social?",
          "Почему образ лошади такой социальный?",
          "Жылқы бейнесі неге сонша әлеуметтік сезіледі?",
        ),
        firstText: text(
          "A horse links movement with trust. To ride well means rhythm between beings, not just control of one over another.",
          "Лошадь связывает движение с доверием. Хорошая езда — это ритм между существами, а не просто контроль одного над другим.",
          "Жылқы қозғалысты сеніммен байланыстырады. Жақсы міну — біреудің екіншісін жай билеуі емес, екі тіршілік иесінің ырғақ табуы.",
        ),
        secondText: text(
          "That is why this archetype often feels warm and outgoing. Contact is not a burden here; it is the natural road along which energy moves.",
          "Поэтому этот архетип часто кажется тёплым и открытым. Контакт здесь не обуза, а естественная дорога, по которой идёт энергия.",
          "Сондықтан бұл архетип жылы әрі ашық сезіледі. Мұнда байланыс салмақ емес, энергия жүретін табиғи жол.",
        ),
        knowledgeCheck: {
          question: text(
            "What was good riding compared to in this branch?",
            "С чем сравнивалась хорошая езда в этой ветке?",
            "Бұл тармақта жақсы шабыс немен салыстырылды?",
          ),
          options: [
            text(
              "With rhythm between beings",
              "С ритмом между существами",
              "Екі тіршіліктің ырғағымен",
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
            "Yes. The branch connected the horse with coordination and trust, not with domination alone.",
            "Да. Эта ветка связывала лошадь с координацией и доверием, а не только с подчинением.",
            "Иә. Бұл тармақ жылқыны тек бағындырумен емес, үйлесім мен сеніммен байланыстырды.",
          ),
          wrongResponse: text(
            "Not exactly. The key idea was shared rhythm and trust.",
            "Не совсем. Ключевая мысль была в совместном ритме и доверии.",
            "Толық емес. Негізгі ой — ортақ ырғақ пен сенім.",
          ),
        },
      },
      {
        id: "story",
        type: "story",
        label: text(
          "Show me the deeper cultural layer",
          "Покажи более глубокий культурный слой",
          "Терең мәдени қабатын көрсет",
        ),
        firstText: text(
          "The horse shapes steppe scale itself: speed, distance, status, hospitality, and even the tempo of news. It is part of how space becomes lived, not just measured.",
          "Лошадь формирует сам масштаб степи: скорость, расстояние, статус, гостеприимство и даже темп новостей. Она участвует в том, как пространство становится прожитым, а не просто измеренным.",
          "Жылқы даланың ауқымын өзі қалыптастырады: жылдамдық, қашықтық, мәртебе, қонақжайлық, тіпті хабардың жету ырғағы. Ол кеңістікті тек өлшенетін емес, өмір сүрілетін етеді.",
        ),
        secondText: text(
          "So when horse becomes a temperament symbol, it points to people who feel alive in movement and connection. They do not simply cross distance; they animate it.",
          "Поэтому, когда лошадь становится символом темперамента, она указывает на людей, которые оживают в движении и связи. Они не просто проходят расстояние — они наполняют его жизнью.",
          "Сондықтан жылқы темперамент символына айналғанда, ол қозғалыс пен байланыста жанданатын адамдарды меңзейді. Олар қашықтықты жай ғана өтпейді, оны тірілтеді.",
        ),
        knowledgeCheck: {
          question: text(
            "What did the horse help shape besides speed in this branch?",
            "Что, кроме скорости, лошадь помогала формировать в этой ветке?",
            "Бұл тармақта жылқы жылдамдықтан бөлек нені қалыптастыруға көмектесті?",
          ),
          options: [
            text(
              "The lived scale of steppe space",
              "Проживаемый масштаб степного пространства",
              "Дала кеңістігінің өмір сүрілетін ауқымын",
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
            "Exactly. The branch showed the horse as part of how the steppe was actually lived and connected.",
            "Именно. Эта ветка показывала лошадь как часть того, как степь реально проживалась и связывалась.",
            "Дәл солай. Бұл тармақ жылқыны даланы шын мәнінде өмір сүріп, байланыстырып тұрған күштің бір бөлігі ретінде көрсетті.",
          ),
          wrongResponse: text(
            "Not quite. The key detail was the horse's role in making steppe space lived and connected.",
            "Не совсем. Важной деталью была роль лошади в том, что степное пространство становилось прожитым и связанным.",
            "Сәл қате. Маңызды деталь — жылқы даланы өмір сүрілетін әрі байланысқан кеңістікке айналдыруға қатысқаны.",
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
      "The bow is not passive just because it keeps distance. In steppe warfare distance could be the sharpest form of control.",
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
          "The bow favors timing over collision. It acts after reading distance, angle, and the cost of stepping in too early.",
          "Лук предпочитает момент столкновению. Он действует после того, как считывает дистанцию, угол и цену слишком раннего входа.",
          "Садақ соқтығысудан гөрі мезетті таңдайды. Ол қашықтықты, бұрышты және ерте кірісудің құнын байқап барып әрекет етеді.",
        ),
        secondText: text(
          "That is why bow-like people often preserve leverage by waiting. Their restraint is strategic, not hesitant.",
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
          "The composite bow mattered on the steppe because it worked with motion, not against it. Power came from distance, rhythm, and the ability to strike without getting trapped in one line.",
          "Составной лук был важен в степи потому, что работал вместе с движением, а не против него. Сила рождалась из дистанции, ритма и способности действовать, не застревая в одной линии.",
          "Құрама садақ далада маңызды болды, өйткені ол қозғалысқа қарсы емес, сонымен бірге жұмыс істеді. Күш қашықтықтан, ырғақтан және бір сызыққа байланып қалмай әрекет етуден туған.",
        ),
        secondText: text(
          "So as a conflict symbol, the bow represents intelligence of position. It asks not 'can I push now?', but 'from where will my action matter most?'",
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
      "The spear is direct, but directness is not the same thing as recklessness. A spear makes a line visible.",
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
          "The spear clarifies where you stand. Instead of letting tension thicken in silence, it names the line and forces reality into the open.",
          "Копьё проясняет, где ты стоишь. Вместо того чтобы давать напряжению густеть в молчании, оно называет линию и выводит реальность наружу.",
          "Найза сенің қай жерде тұрғаныңды айқындайды. Үнсіздік ішінде шиеленісті қоюландыра бермей, ол шекараны атап, шындықты ашыққа шығарады.",
        ),
        secondText: text(
          "That is why this style often feels honest even when it is uncomfortable. The discomfort comes from contact, but the value comes from clarity.",
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
          "A spear reaches outward in a single visible direction. Symbolically that makes it a weapon of declared intent rather than hidden maneuver.",
          "Копьё тянется наружу в одном видимом направлении. Символически это делает его оружием заявленного намерения, а не скрытого манёвра.",
          "Найза көзге көрінетін бір бағытпен алға шығады. Сол себепті ол символдық тұрғыдан жасырын айланың емес, жарияланған ниеттің қаруы болып көрінеді.",
        ),
        secondText: text(
          "That matters in culture too: some people preserve dignity by not disguising the point. Even before impact, the line itself says where the boundary is.",
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
      "A saber is curved for a reason. Its image suggests movement that adapts while staying effective.",
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
          "The saber does not insist on one rigid angle. It cuts by moving with the curve of the moment, which makes it a strong symbol for flexible response.",
          "Сабля не настаивает на одном жёстком угле. Она работает через движение по изгибу момента, поэтому становится сильным символом гибкого ответа.",
          "Қылыш бір ғана қатаң бұрышқа байланып қалмайды. Ол сәттің иінімен бірге қозғалып әсер етеді, сондықтан икемді жауаптың күшті белгісіне айналады.",
        ),
        secondText: text(
          "In conflict terms, that means preserving motion. Instead of getting trapped in pride, you look for a path both sides can still move through.",
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
          "A curved blade suggests redirection rather than blunt impact. Symbolically it teaches that strength can travel through angle, not only through force.",
          "Изогнутый клинок намекает на перенаправление, а не только на лобовой удар. Символически это учит, что сила может идти через угол, а не только через нажим.",
          "Иілген жүз тек тік соққыны емес, бағытты бұруды да меңзейді. Символдық тұрғыдан ол күштің тек қысыммен емес, бұрыш арқылы да жұмыс істейтінін көрсетеді.",
        ),
        secondText: text(
          "That is why the saber becomes a good image for mediation. It does not deny tension; it changes how tension travels through the exchange.",
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
      "A shield can look defensive from the outside. But defense is often what gives a group time to stay human under pressure.",
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
          "A shield absorbs enough force for the situation not to shatter. It does not remove conflict, but it keeps the blow from becoming total.",
          "Щит принимает на себя достаточно удара, чтобы ситуация не рассыпалась. Он не убирает конфликт, но не даёт удару стать тотальным.",
          "Қалқан жағдай быт-шыт болып кетпеуі үшін соққының бір бөлігін өзіне алады. Ол қақтығысты жоймайды, бірақ соққының толық күйретуіне жол бермейді.",
        ),
        secondText: text(
          "That is why shield-like people are often the ones who preserve trust in hard moments. They hold the field long enough for repair to stay possible.",
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
          "A shield is relational: it turns toward impact so something behind it can remain standing. Its meaning is collective even when one person carries it.",
          "Щит по природе своей реляционный: он поворачивается к удару так, чтобы что-то за ним могло устоять. Его смысл коллективен, даже если несёт его один человек.",
          "Қалқанның табиғаты байланыстық: ол соққыға өзі бұрылып, артындағы нәрсенің аман тұруына мүмкіндік береді. Бір адам ұстаса да, оның мағынасы ұжымдық.",
        ),
        secondText: text(
          "That makes shield a strong symbol for caretaking under strain. It is not retreat from the world, but the willingness to bear pressure so others are not broken by it.",
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
      "Mystan is not frightening only because it is strange. It becomes frightening when uncertainty starts behaving like a hidden intention.",
      "Мыстан пугает не только своей странностью. Она становится особенно страшной тогда, когда неопределённость начинает ощущаться как чья-то скрытая воля.",
      "Мыстан тек жаттығымен қорқытпайды. Ол белгісіздік біреудің жасырын ниеті сияқты сезіле бастағанда ерекше үрейлі болады.",
    ),
    branches: [
      {
        id: "basic",
        type: "basic",
        label: text(
          "What does Mystan symbolize psychologically?",
          "Что Мыстан символизирует психологически?",
          "Мыстан психологиялық тұрғыдан нені білдіреді?",
        ),
        firstText: text(
          "In this result, Mystan stands for the pain of unstable trust. The threat is not open attack, but the feeling that you no longer know what is happening behind the surface.",
          "В этом результате Мыстан символизирует боль нестабильного доверия. Угроза тут не в открытом ударе, а в ощущении, что ты больше не понимаешь, что происходит за поверхностью.",
          "Бұл нәтижеде Мыстан сенімнің шайқалуынан туған ауырлықты білдіреді. Қауіп ашық соққыда емес, бетінің ар жағында не болып жатқанын түсінбей қалуда.",
        ),
        secondText: text(
          "That is why this enemy grows on ambiguity. The less transparent the situation feels, the easier it is to mistake suspicion for evidence.",
          "Поэтому этот враг питается неоднозначностью. Чем менее прозрачной кажется ситуация, тем легче перепутать подозрение с доказательством.",
          "Сондықтан бұл жау екіұштылықтан күшейеді. Жағдай неғұрлым бұлыңғыр болса, күдікті дәлелмен шатастыру соғұрлым оңай.",
        ),
        knowledgeCheck: {
          question: text(
            "What dangerous confusion did the branch describe?",
            "Какую опасную путаницу описывала эта ветка?",
            "Бұл тармақ қандай қауіпті шатасуды сипаттады?",
          ),
          options: [
            text(
              "Mistaking suspicion for evidence",
              "Подмену доказательства подозрением",
              "Күдікті дәлелмен шатастыруды",
            ),
            text(
              "Mistaking calm for loyalty",
              "Подмену спокойствия лояльностью",
              "Тыныштықты адалдықпен шатастыруды",
            ),
            text(
              "Mistaking speed for wisdom",
              "Подмену скорости мудростью",
              "Жылдамдықты даналықпен шатастыруды",
            ),
          ].map((label, index) => ({
            id: `mystan-basic-${index + 1}`,
            label,
          })),
          correctOptionId: "mystan-basic-1",
          correctResponse: text(
            "Exactly. The branch warned that ambiguity can turn suspicion into false certainty.",
            "Именно. Эта ветка предупреждала, что неоднозначность может превратить подозрение в ложную уверенность.",
            "Дәл солай. Бұл тармақ екіұштылықтың күдікті жалған сенімділікке айналдыра алатынын айтты.",
          ),
          wrongResponse: text(
            "Not quite. The main warning was about taking suspicion for proof.",
            "Не совсем. Главное предупреждение касалось того, что подозрение легко принять за доказательство.",
            "Сәл қате. Негізгі ескерту — күдікті дәлелдің орнына қойып жіберу туралы болды.",
          ),
        },
      },
      {
        id: "story",
        type: "story",
        label: text(
          "Give me the mythic reading",
          "Дай мифическое прочтение",
          "Мифтік мағынасын айт",
        ),
        firstText: text(
          "Figures like Mystan work in stories because they disturb the border between seen and unseen. Fear grows not from a clear blow, but from the sense that the world is no longer readable.",
          "Такие фигуры, как Мыстан, работают в историях потому, что тревожат границу между видимым и невидимым. Страх растёт не из ясного удара, а из чувства, что мир перестал читаться.",
          "Мыстан сияқты бейнелер әңгімеде көрінетін мен көрінбейтіннің шекарасын бұзатындықтан әсер етеді. Қорқыныш анық соққыдан емес, дүниенің оқылмай қалуынан туады.",
        ),
        secondText: text(
          "That is why the image endures. It gives a face to the moment when interpretation itself becomes unstable.",
          "Поэтому этот образ и удерживается в памяти. Он даёт лицо тому моменту, когда само понимание происходящего становится нестабильным.",
          "Сондықтан бұл образ сақталады. Ол түсіндірудің өзі тұрақсыз болып кеткен сәтке бет береді.",
        ),
        knowledgeCheck: {
          question: text(
            "Why did Mystan endure as an image in this branch?",
            "Почему образ Мыстан удерживался в памяти в этой ветке?",
            "Бұл тармақта Мыстан образы неге есте сақталды?",
          ),
          options: [
            text(
              "Because it gave a face to unreadable uncertainty",
              "Потому что давал лицо нечитаемой неопределённости",
              "Өйткені ол оқылмай қалған белгісіздікке бет берді",
            ),
            text(
              "Because it always ruled openly",
              "Потому что всегда правила открыто",
              "Өйткені ол әрдайым ашық биледі",
            ),
            text(
              "Because it erased every emotion",
              "Потому что стирал любые эмоции",
              "Өйткені ол барлық эмоцияны өшірді",
            ),
          ].map((label, index) => ({
            id: `mystan-story-${index + 1}`,
            label,
          })),
          correctOptionId: "mystan-story-1",
          correctResponse: text(
            "Right. The mythic layer made Mystan a face for unreadable uncertainty.",
            "Верно. Мифический слой делал Мыстан лицом нечитаемой неопределённости.",
            "Дұрыс. Мифтік қабат Мыстанды оқылмай қалған белгісіздіктің бетіне айналдырды.",
          ),
          wrongResponse: text(
            "Not exactly. The key detail was that Mystan personified unreadable uncertainty.",
            "Не совсем. Ключевая деталь была в том, что Мыстан олицетворяла нечитаемую неопределённость.",
            "Толық емес. Негізгі деталь — Мыстан оқылмай қалған белгісіздікті тұлғаландырды.",
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
      "Zheztyrnak wounds by more than fear. It is the figure of violated dignity, when a person is made smaller in the eyes of others.",
      "Жезтырнак ранит не только страхом. Это фигура задетого достоинства — момента, когда человека делают меньше в глазах других.",
      "Жезтырнақ тек қорқынышпен емес, қадірге тию арқылы жаралайды. Бұл — адамды өзгенің көз алдында кішірейтіп жіберетін сәттің бейнесі.",
    ),
    branches: [
      {
        id: "basic",
        type: "basic",
        label: text(
          "What hurts most in this enemy?",
          "Что в этом враге ранит сильнее всего?",
          "Бұл жауда ең қатты не ауырады?",
        ),
        firstText: text(
          "This result is sensitive to humiliation and loss of face. The sharpest pain comes when the problem is no longer only practical, but social and visible.",
          "Этот результат чувствителен к унижению и потере лица. Самая острая боль возникает тогда, когда проблема становится не только практической, но и социальной, видимой для других.",
          "Бұл нәтиже қорлануға және беттен айырылуға сезімтал. Ең өткір ауырлық мәселе тек практикалық емес, әлеуметтік әрі көзге көрінетін сипат алған кезде туады.",
        ),
        secondText: text(
          "That is why this enemy grows when public reaction starts to feel like a verdict on your worth. The event hurts, but the meaning attached to it hurts even more.",
          "Поэтому этот враг усиливается, когда публичная реакция начинает ощущаться как приговор твоей ценности. Само событие больно, но ещё больнее смысл, который к нему прилипает.",
          "Сондықтан бұл жау көптің реакциясы сенің құныңа үкім сияқты сезіле бастағанда күшейеді. Оқиғаның өзі ауыр, бірақ оған жабысып қалған мағына одан да ауыр.",
        ),
        knowledgeCheck: {
          question: text(
            "What made the pain sharper in this branch?",
            "Что делало боль острее в этой ветке?",
            "Бұл тармақта ауырлықты не күшейтті?",
          ),
          options: [
            text(
              "The public meaning attached to the event",
              "Публичный смысл, прилипший к событию",
              "Оқиғаға жабысып қалған көпшілік мағына",
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
            "Exactly. The branch stressed that public meaning could wound as much as the event itself.",
            "Именно. Здесь подчёркивалось, что публичный смысл может ранить не меньше самого события.",
            "Дәл солай. Бұл тармақта көпшілік мағына оқиғаның өзіндей жаралай алатыны айтылды.",
          ),
          wrongResponse: text(
            "Not quite. The key idea was that social meaning intensified the pain.",
            "Не совсем. Ключевая мысль была в том, что социальный смысл усиливал боль.",
            "Толық емес. Негізгі ой — әлеуметтік мағына ауырлықты күшейтті.",
          ),
        },
      },
      {
        id: "story",
        type: "story",
        label: text(
          "Show me the deeper image",
          "Покажи более глубокий образ",
          "Терең образын көрсет",
        ),
        firstText: text(
          "Zheztyrnak is memorable because polished beauty and danger are fused together. What looks attractive on the surface can still carry humiliation underneath.",
          "Жезтырнак так запоминается потому, что в ней соединяются внешняя привлекательность и опасность. То, что снаружи выглядит красиво, внутри может нести унижение.",
          "Жезтырнақтың есте қалуының себебі — сыртқы әсемдік пен қауіптің қатар жүруі. Сырттай тартымды көрінген нәрсенің ішінде қорлау жатуы мүмкін.",
        ),
        secondText: text(
          "That symbolic pairing teaches caution about surface approval. Not every graceful gesture protects dignity; some only mask the cut more elegantly.",
          "Это сочетание учит осторожности по отношению к красивому одобрению. Не каждый изящный жест сохраняет достоинство — некоторые лишь маскируют рану красивее.",
          "Бұл жұптасу сыртқы мақұлдауға сақ қарауды үйретеді. Әр әсем қимыл қадірді қорғамайды — кейбірі жараны тек әдемірек жасырады.",
        ),
        knowledgeCheck: {
          question: text(
            "What caution did the deeper image teach?",
            "Какой осторожности учил более глубокий образ?",
            "Терең образ қандай сақтыққа үйретті?",
          ),
          options: [
            text(
              "To be cautious with surface approval",
              "Быть осторожнее с внешним одобрением",
              "Сыртқы мақұлдауға сақ болуға",
            ),
            text(
              "To avoid all beauty",
              "Избегать любой красоты",
              "Кез келген сұлулықтан қашуға",
            ),
            text(
              "To trust every polite gesture",
              "Доверять каждому вежливому жесту",
              "Әр сыпайы қимылға сене беруге",
            ),
          ].map((label, index) => ({
            id: `zhez-story-${index + 1}`,
            label,
          })),
          correctOptionId: "zhez-story-1",
          correctResponse: text(
            "Right. The branch warned that polished approval can still hide a cut to dignity.",
            "Верно. Эта ветка предупреждала, что отшлифованное одобрение всё равно может скрывать удар по достоинству.",
            "Дұрыс. Бұл тармақ сыртқы әсем мақұлдаудың ішінде қадірге тиетін нәрсе жасырынуы мүмкін екенін ескертті.",
          ),
          wrongResponse: text(
            "Not exactly. The point was not to reject beauty, but to read whether approval protects dignity or masks harm.",
            "Не совсем. Смысл был не в отказе от красоты, а в умении понять, защищает ли одобрение достоинство или маскирует вред.",
            "Толық емес. Мәселе сұлулықтан қашуда емес, мақұлдау қадірді қорғай ма, әлде зиянды бүркей ме — соны ажыратуда болды.",
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
      "Aydahar is not only about force. It is the terror of growing chaos, when a situation starts escaping structure faster than you can restore it.",
      "Айдахар — это не только про силу. Это ужас растущего хаоса, когда ситуация начинает уходить из структуры быстрее, чем ты успеваешь её собрать обратно.",
      "Айдаһар тек күш туралы емес. Бұл — өсіп бара жатқан бытыраудың үрейі, жағдайды қайта жинаудан бұрын оның құрылымнан тезірек шығып кетуі.",
    ),
    branches: [
      {
        id: "basic",
        type: "basic",
        label: text(
          "What does Aydahar mean psychologically?",
          "Что Айдахар означает психологически?",
          "Айдаһар психологиялық тұрғыдан нені білдіреді?",
        ),
        firstText: text(
          "In this result, Aydahar symbolizes the loss of clarity and control. The danger is not merely pressure, but the feeling that pressure is multiplying faster than order can return.",
          "В этом результате Айдахар символизирует потерю ясности и контроля. Опасность не просто в давлении, а в ощущении, что оно растёт быстрее, чем может вернуться порядок.",
          "Бұл нәтижеде Айдаһар айқындық пен бақылаудың жоғалуын білдіреді. Қауіп қысымның өзінде емес, оның тәртіп қайта орнағаннан жылдамырақ көбейіп бара жатқанында.",
        ),
        secondText: text(
          "That is why this enemy pushes toward urgency. If nothing is named and ordered soon, the mind starts treating the whole field as unstable.",
          "Поэтому этот враг толкает к срочности. Если ничего вовремя не назвать и не собрать, сознание начинает воспринимать нестабильным уже всё поле целиком.",
          "Сондықтан бұл жау асығыстыққа итереді. Егер жағдай дер кезінде аталып, реттелмесе, сана бүкіл кеңістікті тұрақсыз деп қабылдай бастайды.",
        ),
        knowledgeCheck: {
          question: text(
            "What did this enemy make unstable if order did not return soon?",
            "Что этот враг делал нестабильным, если порядок быстро не возвращался?",
            "Тәртіп тез оралмаса, бұл жау нені тұрақсыз қылып көрсететін?",
          ),
          options: [
            text(
              "The whole field of the situation",
              "Всё поле ситуации целиком",
              "Жағдайдың бүкіл өрісін",
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
            "Exactly. The branch showed how chaos can spread from one problem into the whole field of perception.",
            "Именно. Здесь показывалось, как хаос из одной проблемы разливается на всё поле восприятия.",
            "Дәл солай. Бұл тармақ бытыраудың бір мәселеден бүкіл қабылдау өрісіне жайылатынын көрсетті.",
          ),
          wrongResponse: text(
            "Not quite. The key detail was expansion: instability started to feel everywhere.",
            "Не совсем. Важной была деталь расширения: нестабильность начинала ощущаться повсюду.",
            "Толық емес. Маңызды деталь — жайылу: тұрақсыздық барлық жерден сезіле бастайды.",
          ),
        },
      },
      {
        id: "story",
        type: "story",
        label: text(
          "Give me the mythic layer",
          "Дай мифический слой",
          "Мифтік қабатын айт",
        ),
        firstText: text(
          "Dragon-like figures often grow larger the longer they are left unnamed. Culturally, that makes them a strong image of danger strengthened by delay.",
          "Драконоподобные фигуры часто разрастаются тем больше, чем дольше их не называют по имени. Культурно это делает их сильным образом опасности, которую усиливает промедление.",
          "Айдаһарға ұқсас бейнелер аты аталмай ұзақ қалса, соғұрлым үлкейе береді. Мәдени тұрғыдан бұл оларды кідіріс күшейтетін қауіптің қуатты символына айналдырады.",
        ),
        secondText: text(
          "So Aydahar is frightening not only because it is huge, but because it embodies escalation. The longer you postpone form, the more the formless begins to rule.",
          "Поэтому Айдахар страшен не только размером, но и самой логикой эскалации. Чем дольше откладываешь форму, тем сильнее бесформенное начинает править.",
          "Сондықтан Айдаһар тек алып болғаны үшін емес, шиеленістің өсу логикасын бойына жинағаны үшін қорқынышты. Тәртіпті неғұрлым кешіктірсең, пішінсіздік соғұрлым күшейеді.",
        ),
        knowledgeCheck: {
          question: text(
            "What strengthened the danger in the mythic reading of Aydahar?",
            "Что усиливало опасность в мифическом прочтении Айдахара?",
            "Айдаһардың мифтік мағынасында қауіпті не күшейтті?",
          ),
          options: [
            text("Delay", "Промедление", "Кідіріс"),
            text("Too much gratitude", "Излишняя благодарность", "Артық алғыс"),
            text("Too much celebration", "Слишком много праздника", "Тым көп мереке"),
          ].map((label, index) => ({
            id: `aydahar-story-${index + 1}`,
            label,
          })),
          correctOptionId: "aydahar-story-1",
          correctResponse: text(
            "Right. In this branch, delay fed the danger and made it grow.",
            "Верно. В этой ветке именно промедление подпитывало опасность и давало ей разрастись.",
            "Дұрыс. Бұл тармақта қауіпті күшейткен — кідіріс, ол қауіптің өсуіне жол берді.",
          ),
          wrongResponse: text(
            "Not exactly. The central detail was delay: unformed danger grows when it is postponed.",
            "Не совсем. Центральная деталь была в промедлении: неоформленная опасность растёт, когда её откладывают.",
            "Толық емес. Негізгі деталь — кідіріс: аты аталмаған қауіп кейінге қалдырылған сайын өседі.",
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
      "Zhalgyz Kozdi Dau is frightening not only because it is strong. It is frightening because its strength comes with one eye: one point of view made absolute.",
      "Жалгыз Козди Дау страшен не только силой. Он страшен тем, что его сила соединена с одним глазом: одной точкой зрения, превращённой в абсолют.",
      "Жалғыз Көзді Дау тек күшімен қорқытпайды. Оның үрейі күштің бір көзбен — бір ғана көзқарастың абсолютке айналуымен — қатар жүруінде.",
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
          "This result is hurt most by crushing hierarchy and unarguable force. The fear appears when there is no room left for nuance, explanation, or human scale.",
          "Этот результат сильнее всего ранит подавляющая иерархия и сила, с которой невозможно спорить. Страх появляется там, где уже не остаётся места для нюанса, объяснения и человеческого масштаба.",
          "Бұл нәтижені ең қатты жаншитын нәрсе — басып тастайтын иерархия мен даусыз күш. Қорқыныш реңкке, түсіндіруге және адамдық өлшемге орын қалмаған жерде туады.",
        ),
        secondText: text(
          "That is why this enemy can make the whole world feel reduced to command and submission. Once only one eye remains, many meanings are no longer allowed to exist.",
          "Поэтому этот враг может заставить весь мир ощущаться сведённым к приказу и подчинению. Когда остаётся только один глаз, множественные смыслы как будто перестают иметь право на существование.",
          "Сондықтан бұл жау бүкіл әлемді бұйрық пен бағынуға дейін кішірейтіп жібере алады. Бір ғана көз қалған кезде, көп мағынаға орын қалмайды.",
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
            "Exactly. The branch treated one-eyed power as the collapse of nuance.",
            "Именно. Эта ветка трактовала одноглазую силу как схлопывание нюанса.",
            "Дәл солай. Бұл тармақта біркөз күш реңктің жойылуы ретінде түсіндірілді.",
          ),
          wrongResponse: text(
            "Not quite. The key idea was that one-eyed power erases many meanings.",
            "Не совсем. Ключевая мысль была в том, что одноглазая сила стирает множественность смыслов.",
            "Толық емес. Негізгі ой — біркөз күш көп мағынаны өшіреді.",
          ),
        },
      },
      {
        id: "story",
        type: "story",
        label: text(
          "Tell me the deeper symbol",
          "Расскажи более глубокий символ",
          "Терең символын айт",
        ),
        firstText: text(
          "The one eye matters. It turns the giant into more than raw strength; it makes him a figure of narrowed perception, where a single reading dominates the whole field.",
          "Важен именно один глаз. Он делает великана не просто грубой силой, а фигурой суженного восприятия, где одно прочтение захватывает всё поле.",
          "Мұнда бір көздің өзі маңызды. Ол алыпты жай күштен гөрі тарылған қабылдаудың бейнесіне айналдырады: бір ғана түсінік бүкіл кеңістікті басып алады.",
        ),
        secondText: text(
          "So culturally the giant can symbolize authority without listening. He is huge, but his greatness is flawed because it cannot admit another angle of truth.",
          "Поэтому культурно этот великан может символизировать власть без слушания. Он велик, но его величие изломано тем, что оно не допускает другого угла правды.",
          "Сондықтан мәдени тұрғыдан бұл алып тыңдамайтын билікті де бейнелей алады. Ол алып, бірақ оның 'ұлылығы' ақиқаттың басқа бұрышын қабылдамайтынымен кем.",
        ),
        knowledgeCheck: {
          question: text(
            "What flaw did the giant's greatness carry in this branch?",
            "Какой изъян несло величие великана в этой ветке?",
            "Бұл тармақта алыптың 'ұлылығында' қандай кемшілік болды?",
          ),
          options: [
            text(
              "It could not admit another angle of truth",
              "Оно не допускало другого угла правды",
              "Ол ақиқаттың басқа бұрышын қабылдай алмады",
            ),
            text(
              "It was too curious about others",
              "Оно было слишком любопытным к другим",
              "Ол өзгеге тым қызығатын",
            ),
            text(
              "It refused to make any decision",
              "Оно отказывалось принимать решения",
              "Ол ешқандай шешім қабылдамайтын",
            ),
          ].map((label, index) => ({
            id: `dau-story-${index + 1}`,
            label,
          })),
          correctOptionId: "dau-story-1",
          correctResponse: text(
            "Right. The deeper symbol was not size alone, but power that leaves no room for another truth.",
            "Верно. Глубокий символ здесь был не только в размере, а во власти, не оставляющей места другой правде.",
            "Дұрыс. Бұл жерде терең символ тек алыптықта емес, басқа ақиқатқа орын қалдырмайтын билікте болды.",
          ),
          wrongResponse: text(
            "Not quite. The branch emphasized that the giant's flaw was one-sided truth.",
            "Не совсем. Эта ветка подчёркивала, что изъян великана — в односторонней правде.",
            "Толық емес. Бұл тармақта алыптың кемшілігі біржақты ақиқатта екені айтылды.",
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
