type AdaptiveFigureLanguage = "en" | "ru" | "kk";
type QuestionTranslation = {
  text: string;
  matchLabel: string;
  inverseMatchLabel: string;
};

type FigureTranslation = {
  name: string;
  gender: string;
  category: string;
  description: string;
};

type QuestionLike = {
  id: string;
  text: string;
};

type FigureLike = {
  id: string;
  name: string;
  gender: string;
  category: string;
  description: string;
};

type ResultLike = {
  figure: FigureLike;
  matchedTraits: string[];
};

const QUESTION_TRANSLATIONS: Record<
  string,
  Record<AdaptiveFigureLanguage, QuestionTranslation>
> = {
  "gender-female": {
    en: {
      text: "Are you a woman?",
      matchLabel: "You are a woman",
      inverseMatchLabel: "You are a man",
    },
    ru: {
      text: "Вы женщина?",
      matchLabel: "Вы женщина",
      inverseMatchLabel: "Вы мужчина",
    },
    kk: {
      text: "Сіз әйелсіз бе?",
      matchLabel: "Сіз әйелсіз",
      inverseMatchLabel: "Сіз ер адамсыз",
    },
  },
  "music-expression": {
    en: {
      text: "Does music feel closer to your self-expression than writing or research?",
      matchLabel: "Music is central to how you express yourself",
      inverseMatchLabel: "Words or reflection feel closer than music",
    },
    ru: {
      text: "Музыка для вас ближе как способ самовыражения, чем письмо или исследование?",
      matchLabel: "Музыка занимает центральное место в вашем самовыражении",
      inverseMatchLabel: "Вам ближе слова и рефлексия, чем музыка",
    },
    kk: {
      text: "Өзіңізді білдіруде музыка сізге жазу не зерттеуден гөрі жақынырақ па?",
      matchLabel: "Музыка сіздің өзіңізді білдіру жолыңыздың өзегінде тұр",
      inverseMatchLabel: "Сізге музыкадан гөрі сөз бен ой толғау жақынырақ",
    },
  },
  "writing-expression": {
    en: {
      text: "Do words, poetry, or text feel closer to you than public performance?",
      matchLabel: "You express yourself through words or poetry",
      inverseMatchLabel: "You are not mainly text-centered",
    },
    ru: {
      text: "Слова, поэзия или текст вам ближе, чем публичное выступление?",
      matchLabel: "Вы выражаете себя через слова и поэзию",
      inverseMatchLabel: "Вы не в первую очередь человек текста",
    },
    kk: {
      text: "Сөз, поэзия немесе мәтін сізге көпшілік алдында өнер көрсетуден гөрі жақынырақ па?",
      matchLabel: "Сіз өзіңізді сөз бен поэзия арқылы білдіресіз",
      inverseMatchLabel: "Сізді ең алдымен мәтін әлемі анықтамайды",
    },
  },
  "vocal-expression": {
    en: {
      text: "Does your voice matter more than an instrument in how you express yourself?",
      matchLabel: "Your voice is your main expressive tool",
      inverseMatchLabel: "Your expression is not mainly voice-led",
    },
    ru: {
      text: "В самовыражении для вас голос важнее, чем инструмент?",
      matchLabel: "Ваш голос — главный инструмент самовыражения",
      inverseMatchLabel: "Ваше самовыражение не строится прежде всего на голосе",
    },
    kk: {
      text: "Өзіңізді білдіруде аспаптан гөрі дауыс маңыздырақ па?",
      matchLabel: "Сіздің басты білдіру құралыңыз — дауыс",
      inverseMatchLabel: "Өзіңізді білдіруіңіз ең алдымен дауысқа сүйенбейді",
    },
  },
  "instrumental-expression": {
    en: {
      text: "Do your hands, instrument, or craft express you better than speech does?",
      matchLabel: "Hands-on or instrumental expression fits you",
      inverseMatchLabel: "Your expression is not mainly instrumental",
    },
    ru: {
      text: "Жест, инструмент или ремесло выражают вас лучше, чем речь?",
      matchLabel: "Вам подходит инструментальное или ремесленное самовыражение",
      inverseMatchLabel: "Ваше самовыражение не в первую очередь инструментальное",
    },
    kk: {
      text: "Сізді сөзден гөрі қол еңбегі, аспап не шеберлік жақсырақ аша ма?",
      matchLabel: "Аспаптық не қолмен жасалатын өрнек сізге сай келеді",
      inverseMatchLabel: "Өзіңізді білдіруіңіз ең алдымен аспаптық емес",
    },
  },
  "research-mindset": {
    en: {
      text: "Do people often know you as someone who studies deeply, researches, or explains the world?",
      matchLabel: "A research-minded identity fits you",
      inverseMatchLabel: "You are not mainly driven by research or study",
    },
    ru: {
      text: "Люди часто видят в вас человека, который глубоко изучает, исследует или объясняет мир?",
      matchLabel: "Вам близка исследовательская идентичность",
      inverseMatchLabel: "Вас не в первую очередь ведут исследование и учеба",
    },
    kk: {
      text: "Адамдар сізді әлемді терең зерттейтін, түсіндіретін адам ретінде жиі қабылдай ма?",
      matchLabel: "Зерттеушілік болмыс сізге тән",
      inverseMatchLabel: "Сізді ең алдымен зерттеу мен оқу айқындамайды",
    },
  },
  "public-presence": {
    en: {
      text: "Are you comfortable taking public space and being clearly seen?",
      matchLabel: "Public presence feels natural to you",
      inverseMatchLabel: "You are more private than publicly visible",
    },
    ru: {
      text: "Вам комфортно занимать публичное пространство и быть на виду?",
      matchLabel: "Публичность ощущается для вас естественно",
      inverseMatchLabel: "Вы скорее приватный человек, чем публичный",
    },
    kk: {
      text: "Көпшілік алдында көзге түсіп, ашық көрінген сізге жайлы ма?",
      matchLabel: "Көпшілік алдында болу сізге табиғи",
      inverseMatchLabel: "Сіз көпшілікке қарағанда жекелеу адамсыз",
    },
  },
  improvisational: {
    en: {
      text: "Does improvising in the moment feel natural to you?",
      matchLabel: "You trust improvisation and quick expression",
      inverseMatchLabel: "You prefer prepared expression over improvisation",
    },
    ru: {
      text: "Импровизировать по ходу дела для вас естественно?",
      matchLabel: "Вам близки импровизация и быстрая выразительность",
      inverseMatchLabel: "Вам ближе подготовленное выражение, чем импровизация",
    },
    kk: {
      text: "Сол сәтте импровизация жасау сізге табиғи ма?",
      matchLabel: "Сізге импровизация мен жедел өрнек жақын",
      inverseMatchLabel: "Сізге импровизациядан гөрі дайындалған өрнек жақын",
    },
  },
  philosophical: {
    en: {
      text: "Are reflection, wisdom, and meaning central to how you see yourself?",
      matchLabel: "You are strongly reflective and meaning-oriented",
      inverseMatchLabel: "You are less driven by abstract reflection",
    },
    ru: {
      text: "Размышление, мудрость и поиск смысла занимают важное место в вашем самоощущении?",
      matchLabel: "Вы глубоко рефлексивный и смыслоориентированный человек",
      inverseMatchLabel: "Вами меньше движет абстрактная рефлексия",
    },
    kk: {
      text: "Ой толғау, даналық және мағына іздеу сіздің болмысыңыздың өзегіне жата ма?",
      matchLabel: "Сіз терең ойланатын, мағынаға мән беретін адамсыз",
      inverseMatchLabel: "Сізді абстрактілі ой толғау азырақ айқындайды",
    },
  },
  "mentor-energy": {
    en: {
      text: "Do others often experience you as a guide, mentor, or calm teacher?",
      matchLabel: "A guide or mentor role fits you",
      inverseMatchLabel: "You are less defined by a mentor role",
    },
    ru: {
      text: "Другие часто воспринимают вас как наставника, проводника или спокойного учителя?",
      matchLabel: "Роль проводника или наставника вам подходит",
      inverseMatchLabel: "Вас меньше определяет роль наставника",
    },
    kk: {
      text: "Басқалар сізді жиі бағыт беруші, тәлімгер не сабырлы ұстаз ретінде қабылдай ма?",
      matchLabel: "Бағыт беруші не тәлімгер рөлі сізге сай",
      inverseMatchLabel: "Сізді тәлімгер рөлі азырақ айқындайды",
    },
  },
  lyrical: {
    en: {
      text: "Are you more lyrical and emotionally expressive than blunt or forceful?",
      matchLabel: "Lyrical emotional expression suits you",
      inverseMatchLabel: "You are more direct than lyrical",
    },
    ru: {
      text: "Вам ближе лиричность и эмоциональная выразительность, чем прямолинейность и напор?",
      matchLabel: "Вам подходит лиричная эмоциональная выразительность",
      inverseMatchLabel: "Вы скорее прямолинейны, чем лиричны",
    },
    kk: {
      text: "Сізге тік мінез бен қысымнан гөрі лирикалық әрі эмоциялық өрнек жақынырақ па?",
      matchLabel: "Сізге лирикалық эмоциялық өрнек тән",
      inverseMatchLabel: "Сіз лирикалы болудан гөрі тіке сөйлейтін адамсыз",
    },
  },
  explorer: {
    en: {
      text: "Do curiosity, travel, or discovery strongly shape your identity?",
      matchLabel: "Curiosity and discovery are central to you",
      inverseMatchLabel: "Discovery is not your strongest identity theme",
    },
    ru: {
      text: "Любопытство, путешествия или открытия сильно формируют вашу личность?",
      matchLabel: "Любопытство и открытия занимают центральное место в вашей жизни",
      inverseMatchLabel: "Тема открытий не является вашей главной осью",
    },
    kk: {
      text: "Қызығушылық, сапар мен жаңалық ашу сіздің болмысыңызды қатты айқындай ма?",
      matchLabel: "Қызығушылық пен жаңалық ашу сіздің болмысыңыздың өзегінде тұр",
      inverseMatchLabel: "Жаңалық ашу сіздің ең басты болмыс өзегіңіз емес",
    },
  },
  "tradition-rooted": {
    en: {
      text: "Do you feel closely connected to tradition, spoken culture, or inherited forms?",
      matchLabel: "You feel rooted in living tradition",
      inverseMatchLabel: "You feel less tied to inherited forms",
    },
    ru: {
      text: "Вы чувствуете тесную связь с традицией, устной культурой или унаследованными формами?",
      matchLabel: "Вы укоренены в живой традиции",
      inverseMatchLabel: "Вы меньше связаны с унаследованными формами",
    },
    kk: {
      text: "Сіз дәстүрмен, ауызша мәдениетпен немесе мирас болған формалармен тығыз байланыс сезінесіз бе?",
      matchLabel: "Сіз тірі дәстүрмен тамырлассыз",
      inverseMatchLabel: "Сіз мирас болған формалармен азырақ байланыстасыз",
    },
  },
  "disciplined-craft": {
    en: {
      text: "Do precision, discipline, and polished craft matter a lot to you?",
      matchLabel: "Disciplined craft is important to you",
      inverseMatchLabel: "You are less defined by polished precision",
    },
    ru: {
      text: "Для вас очень важны точность, дисциплина и отточенное мастерство?",
      matchLabel: "Для вас важно дисциплинированное мастерство",
      inverseMatchLabel: "Вас меньше определяет отточенная точность",
    },
    kk: {
      text: "Сіз үшін дәлдік, тәртіп және шыңдалған шеберлік өте маңызды ма?",
      matchLabel: "Сіз үшін тәртіпке құрылған шеберлік маңызды",
      inverseMatchLabel: "Сізді мінсіз дәлдік азырақ айқындайды",
    },
  },
};

const FIGURE_TRANSLATIONS: Record<
  string,
  Record<AdaptiveFigureLanguage, FigureTranslation>
> = {
  abai: {
    en: {
      name: "Abai Kunanbayuly",
      gender: "male",
      category: "literature",
      description:
        "A poet, thinker, and reformer whose reflective voice, moral depth, and educational vision shaped Kazakh intellectual culture.",
    },
    ru: {
      name: "Абай Кунанбайулы",
      gender: "мужчина",
      category: "литература",
      description:
        "Поэт, мыслитель и реформатор, чья рефлексивная интонация, нравственная глубина и просветительское видение сформировали казахскую интеллектуальную культуру.",
    },
    kk: {
      name: "Абай Құнанбайұлы",
      gender: "ер адам",
      category: "әдебиет",
      description:
        "Қазақтың интеллектуалдық мәдениетіне терең ықпал еткен ақын, ойшыл және реформатор; оның ойлы үні, моральдық тереңдігі мен ағартушылық көзқарасы айрықша.",
    },
  },
  kurmangazy: {
    en: {
      name: "Kurmangazy Sagyrbayuly",
      gender: "male",
      category: "music",
      description:
        "A legendary kui composer and dombra master associated with powerful instrumental expression and steppe intensity.",
    },
    ru: {
      name: "Курмангазы Сагырбайулы",
      gender: "мужчина",
      category: "музыка",
      description:
        "Легендарный кюйши и домбрист, связанный с мощной инструментальной выразительностью и степной энергией.",
    },
    kk: {
      name: "Құрманғазы Сағырбайұлы",
      gender: "ер адам",
      category: "музыка",
      description:
        "Күшті аспаптық өрнегі мен дала қуатымен танылған аңызға айналған күйші, домбыра шебері.",
    },
  },
  dina: {
    en: {
      name: "Dina Nurpeisova",
      gender: "female",
      category: "music",
      description:
        "A celebrated dombra virtuoso and composer who carried the kui tradition forward with strength, mastery, and mentoring presence.",
    },
    ru: {
      name: "Дина Нурпеисова",
      gender: "женщина",
      category: "музыка",
      description:
        "Выдающаяся домбристка и композитор, продолжившая традицию кюя с силой, мастерством и наставническим присутствием.",
    },
    kk: {
      name: "Дина Нұрпейісова",
      gender: "әйел",
      category: "музыка",
      description:
        "Күй дәстүрін күшпен, шеберлікпен және ұстаздық болмысымен жалғаған әйгілі домбырашы әрі композитор.",
    },
  },
  roza: {
    en: {
      name: "Roza Baglanova",
      gender: "female",
      category: "music",
      description:
        "A beloved singer remembered for her public warmth, emotional voice, and strong connection with a broad audience.",
    },
    ru: {
      name: "Роза Багланова",
      gender: "женщина",
      category: "музыка",
      description:
        "Любимая певица, которую помнят за теплоту, эмоциональный голос и сильную связь с широкой аудиторией.",
    },
    kk: {
      name: "Роза Бағланова",
      gender: "әйел",
      category: "музыка",
      description:
        "Жылы болмысымен, эмоцияға толы дауысымен және қалың жұртпен берік байланысымен есте қалған сүйікті әнші.",
    },
  },
  bibigul: {
    en: {
      name: "Bibigul Tulegenova",
      gender: "female",
      category: "music",
      description:
        "A renowned opera and concert singer whose polished craft, discipline, and lyrical expressiveness became a classical standard.",
    },
    ru: {
      name: "Бибигуль Тулегенова",
      gender: "женщина",
      category: "музыка",
      description:
        "Знаменитая оперная и концертная певица, чьи отточенное мастерство, дисциплина и лирическая выразительность стали классическим эталоном.",
    },
    kk: {
      name: "Бибігүл Төлегенова",
      gender: "әйел",
      category: "музыка",
      description:
        "Шыңдалған шеберлігі, тәртібі және лирикалық өрнегімен классикалық үлгіге айналған әйгілі опера және концерт әншісі.",
    },
  },
  zhambyl: {
    en: {
      name: "Zhambyl Zhabayev",
      gender: "male",
      category: "literature",
      description:
        "An iconic akyn whose public voice, improvisation, and oral-tradition energy turned poetry into a living performance.",
    },
    ru: {
      name: "Жамбыл Жабаев",
      gender: "мужчина",
      category: "литература",
      description:
        "Культовый акын, чьи публичный голос, импровизация и энергия устной традиции превратили поэзию в живое выступление.",
    },
    kk: {
      name: "Жамбыл Жабаев",
      gender: "ер адам",
      category: "әдебиет",
      description:
        "Қоғамдық үні, суырыпсалмалығы және ауызша дәстүр қуаты арқылы поэзияны тірі орындауға айналдырған айрықша ақын.",
    },
  },
  suyinbay: {
    en: {
      name: "Suyinbay Aronuly",
      gender: "male",
      category: "literature",
      description:
        "A powerful akyn whose improvisation, public presence, and guiding voice made him a major figure in the oral poetic tradition.",
    },
    ru: {
      name: "Суюнбай Аронулы",
      gender: "мужчина",
      category: "литература",
      description:
        "Мощный акын, чьи импровизация, публичное присутствие и направляющий голос сделали его крупной фигурой устной поэтической традиции.",
    },
    kk: {
      name: "Сүйінбай Аронұлы",
      gender: "ер адам",
      category: "әдебиет",
      description:
        "Суырыпсалмалығы, көпшілік алдындағы қуаты және бағыт беруші үні арқылы ауызша поэзия дәстүрінің ірі тұлғасына айналған қуатты ақын.",
    },
  },
  shokan: {
    en: {
      name: "Shokan Ualikhanov",
      gender: "male",
      category: "scholarship",
      description:
        "A scholar, traveler, and ethnographer whose curiosity, observation, and intellectual range connected the steppe with a wider world.",
    },
    ru: {
      name: "Чокан Валиханов",
      gender: "мужчина",
      category: "просвещение",
      description:
        "Ученый, путешественник и этнограф, чьи любознательность, наблюдательность и интеллектуальный размах связали степь с большим миром.",
    },
    kk: {
      name: "Шоқан Уәлиханов",
      gender: "ер адам",
      category: "ағартушылық",
      description:
        "Қызығушылығы, байқағыштығы және ой өрісі арқылы даланы кең әлеммен жалғаған ғалым, саяхатшы және этнограф.",
    },
  },
  ybyrai: {
    en: {
      name: "Ybyrai Altynsarin",
      gender: "male",
      category: "literature",
      description:
        "An educator and writer whose calm discipline, mentoring spirit, and commitment to learning shaped modern Kazakh education.",
    },
    ru: {
      name: "Ибрай Алтынсарин",
      gender: "мужчина",
      category: "литература",
      description:
        "Педагог и писатель, чьи спокойная дисциплина, наставнический дух и преданность знанию сформировали современное казахское образование.",
    },
    kk: {
      name: "Ыбырай Алтынсарин",
      gender: "ер адам",
      category: "әдебиет",
      description:
        "Сабырлы тәртібі, ұстаздық рухы және білімге адалдығы арқылы заманауи қазақ ағартуын қалыптастырған ұстаз әрі жазушы.",
    },
  },
  akhmet: {
    en: {
      name: "Akhmet Baitursynuly",
      gender: "male",
      category: "scholarship",
      description:
        "A public intellectual, linguist, and reformer associated with language, thought, structure, and cultural awakening.",
    },
    ru: {
      name: "Ахмет Байтурсынов",
      gender: "мужчина",
      category: "просвещение",
      description:
        "Общественный интеллектуал, лингвист и реформатор, ассоциирующийся с языком, мыслью, структурой и культурным пробуждением.",
    },
    kk: {
      name: "Ахмет Байтұрсынұлы",
      gender: "ер адам",
      category: "ағартушылық",
      description:
        "Тіл, ой, құрылым және мәдени серпіліспен байланыстырылатын қоғам қайраткері, тілтанушы әрі реформатор.",
    },
  },
  mukagali: {
    en: {
      name: "Mukagali Makatayev",
      gender: "male",
      category: "literature",
      description:
        "A lyrical poet whose intimate emotional language and inward honesty made him one of the most beloved voices in modern Kazakh literature.",
    },
    ru: {
      name: "Мукагали Макатаев",
      gender: "мужчина",
      category: "литература",
      description:
        "Лирический поэт, чьи интимная эмоциональная речь и внутренняя искренность сделали его одним из самых любимых голосов современной казахской литературы.",
    },
    kk: {
      name: "Мұқағали Мақатаев",
      gender: "ер адам",
      category: "әдебиет",
      description:
        "Ішкі шынайылығы мен нәзік эмоциялық тілі арқылы қазіргі қазақ әдебиетінің ең сүйікті үндерінің біріне айналған лирик ақын.",
    },
  },
  fariza: {
    en: {
      name: "Fariza Ongarsynova",
      gender: "female",
      category: "literature",
      description:
        "A poet known for emotional honesty, strong voice, and a lyrical yet public presence in modern Kazakh literature.",
    },
    ru: {
      name: "Фариза Онгарсынова",
      gender: "женщина",
      category: "литература",
      description:
        "Поэтесса, известная эмоциональной честностью, сильным голосом и лирическим, но при этом публичным присутствием в современной казахской литературе.",
    },
    kk: {
      name: "Фариза Оңғарсынова",
      gender: "әйел",
      category: "әдебиет",
      description:
        "Эмоциялық шындығымен, қуатты үнімен және лирикалық, бірақ қоғамдық салмағы бар болмысымен танылған ақын.",
    },
  },
  sara: {
    en: {
      name: "Sara Tastanbekkyzy",
      gender: "female",
      category: "literature",
      description:
        "An improvisational akyn whose quick public wit, spoken-poetry energy, and oral-tradition confidence made her a distinctive cultural voice.",
    },
    ru: {
      name: "Сара Тастанбеккызы",
      gender: "женщина",
      category: "литература",
      description:
        "Суырыпсалма акын, чьи быстрая публичная находчивость, живая устная поэтическая энергия и уверенность в устной традиции сделали ее самобытным культурным голосом.",
    },
    kk: {
      name: "Сара Тастанбекқызы",
      gender: "әйел",
      category: "әдебиет",
      description:
        "Көпшілік алдындағы шапшаң тапқырлығы, ауызша поэзия қуаты және дәстүрлі сөзге сенімділігімен дараланған суырыпсалма ақын.",
    },
  },
  aqan: {
    en: {
      name: "Aqan Seri Koramuly",
      gender: "male",
      category: "music",
      description:
        "A singer, poet, and composer remembered for lyrical feeling, public charisma, and expressive performance rooted in tradition.",
    },
    ru: {
      name: "Акан Сери",
      gender: "мужчина",
      category: "музыка",
      description:
        "Певец, поэт и композитор, запомнившийся лирической чувствительностью, публичной харизмой и выразительным исполнением, укорененным в традиции.",
    },
    kk: {
      name: "Ақан сері Қорамсаұлы",
      gender: "ер адам",
      category: "музыка",
      description:
        "Лирикалық сезімі, көпшілік алдындағы харизмасы және дәстүрге сүйенген әсерлі орындауымен есте қалған әнші, ақын және композитор.",
    },
  },
  ykylas: {
    en: {
      name: "Ykylas Dukenuly",
      gender: "male",
      category: "music",
      description:
        "A kobyz master and composer associated with inward depth, tradition, and instrumental expression that feels emotionally resonant.",
    },
    ru: {
      name: "Ыкылас Дукенулы",
      gender: "мужчина",
      category: "музыка",
      description:
        "Мастер кобыза и композитор, связанный с внутренней глубиной, традицией и инструментальной выразительностью с сильным эмоциональным резонансом.",
    },
    kk: {
      name: "Ықылас Дүкенұлы",
      gender: "ер адам",
      category: "музыка",
      description:
        "Ішкі тереңдігімен, дәстүрге жақындығымен және эмоциялық реңкі мол аспаптық өрнегімен танылған қобызшы және композитор.",
    },
  },
  nurgisa: {
    en: {
      name: "Nurgisa Tlendiyev",
      gender: "male",
      category: "music",
      description:
        "A composer and conductor whose disciplined musical craft, mentoring energy, and strong public artistry left a major cultural mark.",
    },
    ru: {
      name: "Нургиса Тлендиев",
      gender: "мужчина",
      category: "музыка",
      description:
        "Композитор и дирижер, чьи дисциплинированное музыкальное мастерство, наставническая энергия и яркая публичная артистичность оставили большой культурный след.",
    },
    kk: {
      name: "Нұрғиса Тілендиев",
      gender: "ер адам",
      category: "музыка",
      description:
        "Тәртіпке құрылған музыкалық шеберлігі, тәлімгерлік қуаты және жарқын сахналық болмысы арқылы үлкен мәдени із қалдырған композитор әрі дирижер.",
    },
  },
};

function normalizeLanguage(language: string): AdaptiveFigureLanguage {
  if (language.startsWith("ru")) return "ru";
  if (language.startsWith("kk")) return "kk";
  return "en";
}

const MATCHED_TRAIT_LOOKUP = Object.entries(QUESTION_TRANSLATIONS).reduce<
  Record<string, { questionId: string; variant: "matchLabel" | "inverseMatchLabel" }>
>((lookup, [questionId, translations]) => {
  for (const translation of Object.values(translations)) {
    lookup[translation.matchLabel] = {
      questionId,
      variant: "matchLabel",
    };
    lookup[translation.inverseMatchLabel] = {
      questionId,
      variant: "inverseMatchLabel",
    };
  }

  return lookup;
}, {});

export function localizeAdaptiveQuestion<T extends QuestionLike>(
  question: T | null | undefined,
  language: string,
) {
  if (!question) {
    return question;
  }

  const translations = QUESTION_TRANSLATIONS[question.id];
  const translation = translations?.[normalizeLanguage(language)];
  const defaultEnglishText = translations?.en?.text;

  if (!translation) {
    return question;
  }

  if (defaultEnglishText && question.text !== defaultEnglishText) {
    return question;
  }

  return { ...question, text: translation.text };
}

export function localizeAdaptiveFigure<T extends FigureLike>(
  figure: T,
  language: string,
): T {
  const translation = FIGURE_TRANSLATIONS[figure.id]?.[normalizeLanguage(language)];

  return translation ? { ...figure, ...translation } : figure;
}

export function localizeAdaptiveMatchedTraits(
  matchedTraits: string[],
  language: string,
) {
  const normalized = normalizeLanguage(language);

  return matchedTraits.map((trait) => {
    const resolved = MATCHED_TRAIT_LOOKUP[trait];

    if (!resolved) {
      return trait;
    }

    const translation =
      QUESTION_TRANSLATIONS[resolved.questionId]?.[normalized]?.[resolved.variant];

    return translation ?? trait;
  });
}

export function localizeAdaptiveResult<T extends ResultLike>(
  result: T | null | undefined,
  language: string,
) {
  if (!result) {
    return result;
  }

  return {
    ...result,
    figure: localizeAdaptiveFigure(result.figure, language),
    matchedTraits: localizeAdaptiveMatchedTraits(result.matchedTraits, language),
  };
}
