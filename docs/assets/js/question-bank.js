/**
 * Question Bank for Einstufungstest (Level Assessment) — v1.0
 * ==========================================================
 *
 * بنك أسئلة ديناميكي يحتوي على ~200 سؤال موزعة على 6 أقسام و 3 مستويات.
 * في كل مرة يُعاد فيها الاختبار، تُستخرج 42 سؤالاً عشوائياً من البنك
 * مع ضمان توزيع متوازن حسب (القسم + المستوى).
 *
 * Usage:
 *   var selected = QuestionBank.selectQuestions(42);
 *   // selected is an array of 42 questions
 */

(function () {
  'use strict';

  // ═══════════════════════════════════════════════════════════════
  // بنك الأسئلة — Question Bank
  // ═══════════════════════════════════════════════════════════════

  var QUESTIONS_BANK = [

    // ───────────────────────────────────────────────────────────
    // SECTION 1: Wortschatz — المفردات (34 سؤالاً)
    // ───────────────────────────────────────────────────────────

    // ── A1 Level (14) ──

    // Q1 (existing)
    {
      section: 1, q: 1, type: 'choice', level: 'A1',
      sceneEmoji: '🛎️',
      sceneAr: 'أنت في فندق في برلين. تصل الساعة 8 صباحاً.',
      sceneEn: 'You are at a hotel in Berlin. You arrive at 8 AM.',
      audio: true,
      audioText: 'Guten Morgen',
      stemAr: 'استمع واختر التحية المناسبة للساعة 8 صباحاً:',
      stemEn: 'Listen and choose the appropriate greeting for 8 AM:',
      options: ['Guten Morgen', 'Guten Tag', 'Gute Nacht'],
      answer: 'A',
      feedbackAr: '"Guten Morgen" تُقال من الصباح حتى الظهر (حتى الساعة 12). مناسبة تماماً للساعة 8 صباحاً.',
      feedbackEn: '"Guten Morgen" is said from morning until noon (until 12 PM). Perfectly appropriate for 8 AM.',
      grammar: null, grammarLink: null,
      lesson: 'Lektion 1', lessonLink: '../a1/kursbuch/lektion-01/',
      exerciseLink: '../a1/ubungsbuch/lektion-01/'
    },
    // Q2 (existing)
    {
      section: 1, q: 2, type: 'choice', level: 'A1',
      sceneEmoji: '🌍',
      sceneAr: 'تتحدث مع موظف الفندق. يسألك من أين أنت.',
      sceneEn: 'You are talking to the hotel staff. They ask where you are from.',
      stemAr: 'أكمل: Ich ___ aus Spanien.',
      stemEn: 'Complete: Ich ___ from Spain.',
      options: ['komme', 'kommt', 'kommen'],
      answer: 'A',
      feedbackAr: 'مع "ich" نستخدم التصريف "komme". Ich komme = أنا آتي/قادم.',
      feedbackEn: 'With "ich" we use the conjugation "komme". Ich komme = I come.',
      grammar: 'Verbkonjugation', grammarLink: '../grammatik/verbkonjugation/',
      lesson: 'Lektion 1', lessonLink: '../a1/kursbuch/lektion-01/',
      exerciseLink: '../a1/ubungsbuch/lektion-01/'
    },
    // Q3 (existing)
    {
      section: 1, q: 3, type: 'choice', level: 'A1',
      sceneEmoji: '📦',
      sceneAr: 'تنظر إلى الأثاث في غرفتك بالفندق.',
      sceneEn: 'You are looking at the furniture in your hotel room.',
      stemAr: 'اختر أداة التعريف الصحيحة: ___ Tisch',
      stemEn: 'Choose the correct article: ___ Tisch',
      options: ['der', 'die', 'das'],
      answer: 'A',
      feedbackAr: '"Tisch" مذكر (maskulin) → der Tisch. الحفظ مع الأداة مهم جداً.',
      feedbackEn: '"Tisch" is masculine → der Tisch. Always learn nouns with their article!',
      grammar: 'Artikel', grammarLink: '../grammatik/artikel/',
      lesson: 'Lektion 3', lessonLink: '../a1/kursbuch/lektion-03/',
      exerciseLink: '../a1/ubungsbuch/lektion-03/'
    },
    // Q4 (existing)
    {
      section: 1, q: 4, type: 'choice', level: 'A1',
      sceneEmoji: '👨‍👩‍👧‍👦',
      sceneAr: 'تتحدث عن عائلتك مع صديق جديد.',
      sceneEn: 'You are talking about your family with a new friend.',
      stemAr: '"der Vater von ihm" = ___',
      stemEn: '"the father of him" = ___',
      options: ['sein Vater', 'ihr Vater', 'euer Vater'],
      answer: 'A',
      feedbackAr: 'عند الحديث عن ملكية شخص ثالث مذكر (er = هو)، نستخدم "sein": sein Vater = والده.',
      feedbackEn: 'When talking about a third person masculine (er), we use "sein": sein Vater = his father.',
      grammar: 'Possessivartikel', grammarLink: '../grammatik/possessivartikel/',
      lesson: 'Lektion 4', lessonLink: '../a1/kursbuch/lektion-04/',
      exerciseLink: '../a1/ubungsbuch/lektion-04/'
    },
    // Q5 (new A1) — Numbers
    {
      section: 1, q: 5, type: 'choice', level: 'A1',
      sceneEmoji: '🔢',
      sceneAr: 'تتعلم الأرقام في صف الألمانية.',
      sceneEn: 'Learning numbers in German class.',
      stemAr: 'اختر الرقم الصحيح: drei + vier = ___',
      stemEn: 'Choose the correct number: drei + vier = ___',
      options: ['sechs', 'sieben', 'acht'],
      answer: 'B',
      feedbackAr: 'drei (3) + vier (4) = sieben (7). الأرقام الألمانية سهلة — تعلّمها غيباً!',
      feedbackEn: 'drei (3) + vier (4) = sieben (7). German numbers are straightforward — memorise them!',
      grammar: 'Zahlen', grammarLink: '../grammatik/zahlen/',
      lesson: 'Lektion 2', lessonLink: '../a1/kursbuch/lektion-02/',
      exerciseLink: '../a1/ubungsbuch/lektion-02/'
    },
    // Q6 (new A1) — Colors
    {
      section: 1, q: 6, type: 'choice', level: 'A1',
      sceneEmoji: '🎨',
      sceneAr: 'تصف ألوان الأشياء من حولك.',
      sceneEn: 'Describing colors of things around you.',
      stemAr: 'Die Banane ist ___.',
      stemEn: 'The banana is ___.',
      options: ['rot', 'gelb', 'blau'],
      answer: 'B',
      feedbackAr: 'الموز (Banane) أصفر (gelb). Die Banane ist gelb.',
      feedbackEn: 'The banana is yellow. Banane (feminine) → die Banane.',
      grammar: 'Farben', grammarLink: null,
      lesson: 'Lektion 2', lessonLink: '../a1/kursbuch/lektion-02/',
      exerciseLink: '../a1/ubungsbuch/lektion-02/'
    },
    // Q7 (new A1) — Days of week
    {
      section: 1, q: 7, type: 'choice', level: 'A1',
      sceneEmoji: '📅',
      sceneAr: 'تتحدث عن أيام الأسبوع.',
      sceneEn: 'Talking about days of the week.',
      stemAr: 'اليوم الأول في الأسبوع في ألمانيا هو:',
      stemEn: 'The first day of the week in Germany is:',
      options: ['Montag', 'Sonntag', 'Samstag'],
      answer: 'A',
      feedbackAr: 'في ألمانيا، الأسبوع يبدأ يوم الإثنين (Montag). Montag → Dienstag → Mittwoch...',
      feedbackEn: 'In Germany, the week starts on Monday (Montag).',
      grammar: 'Temporalangaben', grammarLink: null,
      lesson: 'Lektion 3', lessonLink: '../a1/kursbuch/lektion-03/',
      exerciseLink: '../a1/ubungsbuch/lektion-03/'
    },
    // Q8 (new A1) — Food/drink
    {
      section: 1, q: 8, type: 'choice', level: 'A1',
      sceneEmoji: '🍺',
      sceneAr: 'في مطعم ألماني، تطلب مشروباً.',
      sceneEn: 'At a German restaurant, ordering a drink.',
      stemAr: 'Ich möchte ein ___ Wasser.',
      stemEn: 'I would like ___ water.',
      options: ['Mineral', 'Mineralen', 'Minerales'],
      answer: 'A',
      feedbackAr: '"Mineralwasser" = ماء معدني. في المطعم: "Ein Mineralwasser, bitte."',
      feedbackEn: '"Mineralwasser" = mineral water. At the restaurant: "Ein Mineralwasser, bitte."',
      grammar: null, grammarLink: null,
      lesson: 'Lektion 16', lessonLink: '../a1/kursbuch/lektion-16/',
      exerciseLink: '../a1/ubungsbuch/lektion-16/'
    },
    // Q9 (new A1) — Family
    {
      section: 1, q: 9, type: 'choice', level: 'A1',
      sceneEmoji: '👪',
      sceneAr: 'تتحدث عن عائلتك.',
      sceneEn: 'Talking about your family.',
      stemAr: 'والد أمي هو ___ .',
      stemEn: 'My mother\'s father is my ___.',
      options: ['der Opa', 'der Onkel', 'der Bruder'],
      answer: 'A',
      feedbackAr: 'Opa = الجد. Onkel = العم/الخال. Bruder = الأخ.',
      feedbackEn: 'Opa = grandfather. Onkel = uncle. Bruder = brother.',
      grammar: null, grammarLink: null,
      lesson: 'Lektion 4', lessonLink: '../a1/kursbuch/lektion-04/',
      exerciseLink: '../a1/ubungsbuch/lektion-04/'
    },
    // Q10 (new A1) — Body parts
    {
      section: 1, q: 10, type: 'choice', level: 'A1',
      sceneEmoji: '🦶',
      sceneAr: 'في عيادة الطبيب، تشير إلى ألم في قدمك.',
      sceneEn: 'At the doctor\'s, pointing to pain in your foot.',
      stemAr: 'Mein ___ tut weh.',
      stemEn: 'My ___ hurts.',
      options: ['Fuß', 'Finger', 'Knie'],
      answer: 'A',
      feedbackAr: 'der Fuß = القدم. Mein Fuß tut weh = قدمي تؤلمني.',
      feedbackEn: 'der Fuß = foot. Mein Fuß tut weh = My foot hurts.',
      grammar: 'Körperteile', grammarLink: null,
      lesson: 'Lektion 13', lessonLink: '../a1/kursbuch/lektion-13/',
      exerciseLink: '../a1/ubungsbuch/lektion-13/'
    },
    // Q11 (new A1) — Hobbies
    {
      section: 1, q: 11, type: 'choice', level: 'A1',
      sceneEmoji: '⚽',
      sceneAr: 'تتحدث عن هواياتك مع صديق جديد.',
      sceneEn: 'Talking about hobbies with a new friend.',
      stemAr: 'Ich spiele gern ___ .',
      stemEn: 'I like to play ___ .',
      options: ['Fußball', 'Fußbälle', 'Fußbal'],
      answer: 'A',
      feedbackAr: 'Fußball = كرة القدم. "Fußball spielen" = يلعب كرة القدم.',
      feedbackEn: 'Fußball = football/soccer. "Fußball spielen" = to play football.',
      grammar: null, grammarLink: null,
      lesson: 'Lektion 5', lessonLink: '../a1/kursbuch/lektion-05/',
      exerciseLink: '../a1/ubungsbuch/lektion-05/'
    },
    // Q12 (new A1) — Animals
    {
      section: 1, q: 12, type: 'choice', level: 'A1',
      sceneEmoji: '🐱',
      sceneAr: 'تتحدث عن حيوانك الأليف.',
      sceneEn: 'Talking about your pet.',
      stemAr: 'Ich habe eine ___ .',
      stemEn: 'I have a ___ .',
      options: ['Katze', 'Hund', 'Vogel'],
      answer: 'A',
      feedbackAr: 'eine Katze = قطة. eine →feminin. der Hund (كلب) → einen Hund. der Vogel (عصفور) → einen Vogel.',
      feedbackEn: 'eine Katze = a cat. Katze is feminine → eine.',
      grammar: 'Akkusativ', grammarLink: '../grammatik/akkusativ/',
      lesson: 'Lektion 7', lessonLink: '../a1/kursbuch/lektion-07/',
      exerciseLink: '../a1/ubungsbuch/lektion-07/'
    },
    // Q13 (new A1) — Months
    {
      section: 1, q: 13, type: 'choice', level: 'A1',
      sceneEmoji: '🗓️',
      sceneAr: 'تتحدث عن موعد ميلادك.',
      sceneEn: 'Talking about your birthday.',
      stemAr: 'Ich habe im ___ Geburtstag. (Dezember)',
      stemEn: 'My birthday is in ___ . (December)',
      options: ['Dezember', 'November', 'Oktober'],
      answer: 'A',
      feedbackAr: 'Dezember = ديسمبر/كانون الأول. Im Dezember = في ديسمبر.',
      feedbackEn: 'Dezember = December. "Im" + month = "in" + month.',
      grammar: 'Temporalangaben', grammarLink: null,
      lesson: 'Lektion 6', lessonLink: '../a1/kursbuch/lektion-06/',
      exerciseLink: '../a1/ubungsbuch/lektion-06/'
    },
    // Q14 (new A1) — Clothes
    {
      section: 1, q: 14, type: 'choice', level: 'A1',
      sceneEmoji: '👕',
      sceneAr: 'في متجر ملابس، تصف ما تريد.',
      sceneEn: 'At a clothing store, describing what you want.',
      stemAr: 'Ich möchte ein ___ .',
      stemEn: 'I would like a ___ .',
      options: ['T-Shirt', 'T-Shirts', 'T-Shirte'],
      answer: 'A',
      feedbackAr: 'das T-Shirt (محايد) → ein T-Shirt. das Hemd = القميص. die Hose = البنطال.',
      feedbackEn: 'das T-Shirt (neuter) → ein T-Shirt. das Hemd = shirt. die Hose = trousers.',
      grammar: 'Artikel', grammarLink: '../grammatik/artikel/',
      lesson: 'Lektion 16', lessonLink: '../a1/kursbuch/lektion-16/',
      exerciseLink: '../a1/ubungsbuch/lektion-16/'
    },

    // ── A2 Level (12) ──

    // Q15 (existing A2)
    {
      section: 1, q: 15, type: 'choice', level: 'A2',
      sceneEmoji: '🏢',
      sceneAr: 'في مقابلة عمل في شركة Siemens.',
      sceneEn: 'At a job interview at Siemens.',
      stemAr: 'أكمل: Ich ___ (arbeiten) bei Siemens.',
      stemEn: 'Complete: I ___ at Siemens.',
      options: ['arbeite', 'arbeitet', 'arbeiten'],
      answer: 'A',
      feedbackAr: 'Ich → arbeite (تصريف الفعل للمفرد المتكلم). Er arbeitet ≠ ich arbeite.',
      feedbackEn: 'Ich → arbeite (first person singular conjugation). Remember: ich arbeite, er arbeitet.',
      grammar: 'Verbkonjugation', grammarLink: '../grammatik/verbkonjugation/',
      lesson: 'A2 Lektion 2', lessonLink: '../a2/kursbuch/lektion-02/',
      exerciseLink: '../a2/ubungsbuch/lektion-02/'
    },
    // Q16 (existing A2)
    {
      section: 1, q: 16, type: 'choice', level: 'A2',
      sceneEmoji: '🧍',
      sceneAr: 'في عيادة الطبيب. يشرح لك أجزاء الجسم.',
      sceneEn: 'At the doctor\'s office. They explain body parts to you.',
      audio: true,
      audioText: 'der Kopf',
      stemAr: 'استمع واختر الكلمة التي سمعتها:',
      stemEn: 'Listen and choose the word you heard:',
      options: ['der Kopf', 'die Hand', 'der Fuß'],
      answer: 'A',
      feedbackAr: 'der Kopf = الرأس. die Hand = اليد. der Fuß = القدم.',
      feedbackEn: 'der Kopf = head. die Hand = hand. der Fuß = foot.',
      grammar: null, grammarLink: null,
      lesson: 'Lektion 13', lessonLink: '../a1/kursbuch/lektion-13/',
      exerciseLink: '../a1/ubungsbuch/lektion-13/'
    },
    // Q17 (existing A2)
    {
      section: 1, q: 17, type: 'choice', level: 'A2',
      sceneEmoji: '🚗',
      sceneAr: 'تتحدث مع زميلك عن وسائل النقل.',
      sceneEn: 'Talking with a colleague about transportation.',
      stemAr: 'أكمل: Wir fahren ___ dem Auto.',
      stemEn: 'Complete: We go ___ car.',
      options: ['mit', 'nach', 'bei'],
      answer: 'A',
      feedbackAr: '"mit" + Dativ تعني "بواسطة". Wir fahren mit dem Auto = نحن نذهب بالسيارة.',
      feedbackEn: '"mit" + Dative means "by means of". Wir fahren mit dem Auto = We go by car.',
      grammar: 'Präpositionen', grammarLink: '../grammatik/prapositionen/',
      lesson: 'Lektion 15', lessonLink: '../a1/kursbuch/lektion-15/',
      exerciseLink: '../a1/ubungsbuch/lektion-15/'
    },
    // Q18 (new A2) — Professions
    {
      section: 1, q: 18, type: 'choice', level: 'A2',
      sceneEmoji: '👩‍⚕️',
      sceneAr: 'تتحدث عن مهنة شخص ما.',
      sceneEn: 'Talking about someone\'s profession.',
      stemAr: 'Meine Schwester ist ___. Sie arbeitet im Krankenhaus.',
      stemEn: 'My sister is a ___. She works at the hospital.',
      options: ['Ärztin', 'Ärzt', 'Arztin'],
      answer: 'A',
      feedbackAr: 'Ärztin = طبيبة (مؤنث). Arzt = طبيب (مذكر). الصيغة المؤنثة تنتهي بـ -in.',
      feedbackEn: 'Ärztin = female doctor. Arzt = male doctor. The feminine form ends with -in.',
      grammar: 'Nomen', grammarLink: null,
      lesson: 'A2 Lektion 2', lessonLink: '../a2/kursbuch/lektion-02/',
      exerciseLink: '../a2/ubungsbuch/lektion-02/'
    },
    // Q19 (new A2) — Weather
    {
      section: 1, q: 19, type: 'choice', level: 'A2',
      sceneEmoji: '🌧️',
      sceneAr: 'تتحدث عن الطقس مع زميل.',
      sceneEn: 'Talking about the weather with a colleague.',
      stemAr: 'Heute ___ es stark.',
      stemEn: 'It is ___ heavily today.',
      options: ['regnet', 'regnen', 'regne'],
      answer: 'A',
      feedbackAr: 'es regnet = إنها تمطر. الفعل متصرف مع "es" (غائب مفرد) → regnet.',
      feedbackEn: 'es regnet = it is raining. The verb is conjugated for "es" (3rd person singular) → regnet.',
      grammar: 'Verbkonjugation', grammarLink: '../grammatik/verbkonjugation/',
      lesson: 'A1 Lektion 2', lessonLink: '../a1/kursbuch/lektion-02/',
      exerciseLink: '../a1/ubungsbuch/lektion-02/'
    },
    // Q20 (new A2) — Directions
    {
      section: 1, q: 20, type: 'choice', level: 'A2',
      sceneEmoji: '📍',
      sceneAr: 'تسأل عن الطريق في مدينة ألمانية.',
      sceneEn: 'Asking for directions in a German city.',
      stemAr: 'Gehen Sie ___ geradeaus und dann links.',
      stemEn: 'Go straight ahead and then left.',
      options: ['immer', 'oft', 'manchmal'],
      answer: 'A',
      feedbackAr: 'immer geradeaus = باستمرار على طول. immer = دائماً/باستمرار، oft = كثيراً، manchmal = أحياناً.',
      feedbackEn: 'immer geradeaus = straight ahead. immer = always, oft = often, manchmal = sometimes.',
      grammar: 'Wegbeschreibung', grammarLink: null,
      lesson: 'Lektion 15', lessonLink: '../a1/kursbuch/lektion-15/',
      exerciseLink: '../a1/ubungsbuch/lektion-15/'
    },
    // Q21 (new A2) — Restaurant
    {
      section: 1, q: 21, type: 'choice', level: 'A2',
      sceneEmoji: '🍽️',
      sceneAr: 'في مطعم، تطلب الفاتورة.',
      sceneEn: 'At a restaurant, asking for the bill.',
      stemAr: 'Die ___ bitte!',
      stemEn: 'The ___ please!',
      options: ['Rechnung', 'Rechnug', 'Rechnungen'],
      answer: 'A',
      feedbackAr: 'die Rechnung = الفاتورة. "Die Rechnung, bitte!" = الفاتورة من فضلك!',
      feedbackEn: 'die Rechnung = the bill/check. "Die Rechnung, bitte!" = The bill, please!',
      grammar: null, grammarLink: null,
      lesson: 'Lektion 16', lessonLink: '../a1/kursbuch/lektion-16/',
      exerciseLink: '../a1/ubungsbuch/lektion-16/'
    },
    // Q22 (new A2) — Health
    {
      section: 1, q: 22, type: 'choice', level: 'A2',
      sceneEmoji: '🤒',
      sceneAr: 'في الصيدلية، تصف حالتك.',
      sceneEn: 'At the pharmacy, describing your condition.',
      stemAr: 'Ich ___ Fieber.',
      stemEn: 'I have a fever.',
      options: ['habe', 'bin', 'mache'],
      answer: 'A',
      feedbackAr: 'Fieber haben = لديه حمى. Ich habe Fieber = أنا مصاب بالحمى.',
      feedbackEn: 'Fieber haben = to have a fever. Ich habe Fieber = I have a fever.',
      grammar: 'Verbkonjugation', grammarLink: '../grammatik/verbkonjugation/',
      lesson: 'Lektion 13', lessonLink: '../a1/kursbuch/lektion-13/',
      exerciseLink: '../a1/ubungsbuch/lektion-13/'
    },
    // Q23 (new A2) — House/Furniture
    {
      section: 1, q: 23, type: 'choice', level: 'A2',
      sceneEmoji: '🏠',
      sceneAr: 'تصف شقتك الجديدة.',
      sceneEn: 'Describing your new apartment.',
      stemAr: 'Wir haben eine ___ mit drei Zimmern.',
      stemEn: 'We have an ___ with three rooms.',
      options: ['Wohnung', 'Wohnungen', 'Wohnunger'],
      answer: 'A',
      feedbackAr: 'die Wohnung = الشقة. eine Wohnung = شقة. Wohnung مؤنث → eine.',
      feedbackEn: 'die Wohnung = apartment/flat. eine Wohnung = an apartment. Wohnung is feminine → eine.',
      grammar: null, grammarLink: null,
      lesson: 'Lektion 9', lessonLink: '../a1/kursbuch/lektion-09/',
      exerciseLink: '../a1/ubungsbuch/lektion-09/'
    },
    // Q24 (new A2) — Travel
    {
      section: 1, q: 24, type: 'choice', level: 'A2',
      sceneEmoji: '🚆',
      sceneAr: 'في محطة القطار، تشتري تذكرة.',
      sceneEn: 'At the train station, buying a ticket.',
      stemAr: 'Eine ___ nach Berlin, bitte.',
      stemEn: 'A ___ to Berlin, please.',
      options: ['Fahrkarte', 'Fahrkart', 'Fahrkarten'],
      answer: 'A',
      feedbackAr: 'die Fahrkarte = تذكرة سفر. Eine Fahrkarte nach Berlin, bitte = تذكرة إلى برلين من فضلك.',
      feedbackEn: 'die Fahrkarte = ticket. Eine Fahrkarte nach Berlin, bitte = A ticket to Berlin, please.',
      grammar: null, grammarLink: null,
      lesson: 'A2 Lektion 11', lessonLink: '../a2/kursbuch/lektion-11/',
      exerciseLink: '../a2/ubungsbuch/lektion-11/'
    },
    // Q25 (new A2) — Technology
    {
      section: 1, q: 25, type: 'choice', level: 'A2',
      sceneEmoji: '💻',
      sceneAr: 'تتحدث عن استخدام الكمبيوتر في العمل.',
      sceneEn: 'Talking about using the computer at work.',
      stemAr: 'Ich ___ am Computer.',
      stemEn: 'I ___ on the computer.',
      options: ['arbeite', 'arbeit', 'arbeitet'],
      answer: 'A',
      feedbackAr: 'Ich arbeite am Computer = أعمل على الكمبيوتر. am = an + dem.',
      feedbackEn: 'Ich arbeite am Computer = I work on the computer. am = an + dem.',
      grammar: 'Verbkonjugation', grammarLink: '../grammatik/verbkonjugation/',
      lesson: 'A2 Lektion 2', lessonLink: '../a2/kursbuch/lektion-02/',
      exerciseLink: '../a2/ubungsbuch/lektion-02/'
    },
    // Q26 (new A2) — Shopping
    {
      section: 1, q: 26, type: 'choice', level: 'A2',
      sceneEmoji: '🛍️',
      sceneAr: 'في السوق، تسأل عن السعر.',
      sceneEn: 'At the market, asking about the price.',
      stemAr: 'Was ___ das?',
      stemEn: 'What does that ___ ?',
      options: ['kostet', 'kost', 'kosten'],
      answer: 'A',
      feedbackAr: 'Was kostet das? = كم يكلف هذا؟ das (مفرد غائب) → kostet.',
      feedbackEn: 'Was kostet das? = How much does that cost? das (3rd singular) → kostet.',
      grammar: 'Verbkonjugation', grammarLink: '../grammatik/verbkonjugation/',
      lesson: 'Lektion 16', lessonLink: '../a1/kursbuch/lektion-16/',
      exerciseLink: '../a1/ubungsbuch/lektion-16/'
    },

    // ── B1 Level (8) ──

    // Q27 (existing B1)
    {
      section: 1, q: 27, type: 'choice', level: 'B1',
      sceneEmoji: '🏙️',
      sceneAr: 'تقارن بين مدن ألمانية مع صديق.',
      sceneEn: 'Comparing German cities with a friend.',
      stemAr: 'أكمل الترتيب الصحيح: Berlin ist ___. Hamburg ist ___. München ist ___.',
      stemEn: 'Complete: Berlin is ___. Hamburg is ___. Munich is ___.',
      options: ['schön – schöner – am schönsten', 'schöner – schön – am schönsten', 'schön – am schönsten – schöner'],
      answer: 'A',
      feedbackAr: 'الصفة الأساسية (schön) ← المقارن (schöner) ← التفضيل (am schönsten).',
      feedbackEn: 'Base adjective (schön) → comparative (schöner) → superlative (am schönsten).',
      grammar: 'Vergleiche', grammarLink: '../grammatik/vergleiche/',
      lesson: 'A2 Lektion 3', lessonLink: '../a2/kursbuch/lektion-03/',
      exerciseLink: '../a2/ubungsbuch/lektion-03/'
    },
    // Q28 (new B1) — Emotions
    {
      section: 1, q: 28, type: 'choice', level: 'B1',
      sceneEmoji: '😊',
      sceneAr: 'تصف مشاعرك بعد خبر سار.',
      sceneEn: 'Describing your feelings after good news.',
      stemAr: 'Ich ___ mich sehr über das Geschenk.',
      stemEn: 'I am very ___ about the gift.',
      options: ['freue', 'freut', 'freuen'],
      answer: 'A',
      feedbackAr: 'sich freuen über + Akk = يفرح بـ. Ich freue mich = أنا سعيد/فرحان.',
      feedbackEn: 'sich freuen über + Acc = to be happy about. Ich freue mich = I am happy.',
      grammar: 'Reflexive Verben', grammarLink: '../grammatik/reflexive-verben/',
      lesson: 'A2 Lektion 5', lessonLink: '../a2/kursbuch/lektion-05/',
      exerciseLink: '../a2/ubungsbuch/lektion-05/'
    },
    // Q29 (new B1) — Business
    {
      section: 1, q: 29, type: 'choice', level: 'B1',
      sceneEmoji: '📊',
      sceneAr: 'في اجتماع عمل، تناقش الأرقام.',
      sceneEn: 'In a business meeting, discussing figures.',
      stemAr: 'Der ___ ist dieses Jahr gestiegen.',
      stemEn: 'The ___ has increased this year.',
      options: ['Umsatz', 'Umsätze', 'Umsatzen'],
      answer: 'A',
      feedbackAr: 'der Umsatz = الإيرادات/المبيعات. gestiegen = ارتفع (Partizip II من steigen).',
      feedbackEn: 'der Umsatz = revenue/sales. gestiegen = increased (past participle of steigen).',
      grammar: 'Perfekt', grammarLink: '../grammatik/perfekt/',
      lesson: 'B1 Lektion 3', lessonLink: '../b1/kursbuch/lektion-03/',
      exerciseLink: '../b1/ubungsbuch/lektion-03/'
    },
    // Q30 (new B1) — Environment
    {
      section: 1, q: 30, type: 'choice', level: 'B1',
      sceneEmoji: '🌳',
      sceneAr: 'تتحدث عن حماية البيئة.',
      sceneEn: 'Talking about environmental protection.',
      stemAr: 'Wir müssen die ___ schützen.',
      stemEn: 'We must protect the ___ .',
      options: ['Umwelt', 'Umwelte', 'Umwelten'],
      answer: 'A',
      feedbackAr: 'die Umwelt = البيئة. schützen = يحمي. "Die Umwelt schützen" = حماية البيئة.',
      feedbackEn: 'die Umwelt = the environment. schützen = to protect. "Die Umwelt schützen" = to protect the environment.',
      grammar: null, grammarLink: null,
      lesson: 'B1 Lektion 6', lessonLink: '../b1/kursbuch/lektion-06/',
      exerciseLink: '../b1/ubungsbuch/lektion-06/'
    },
    // Q31 (new B1) — Media
    {
      section: 1, q: 31, type: 'choice', level: 'B1',
      sceneEmoji: '📱',
      sceneAr: 'تتحدث عن استخدام وسائل التواصل.',
      sceneEn: 'Talking about social media use.',
      stemAr: 'Ich ___ die Nachrichten jeden Morgen.',
      stemEn: 'I ___ the news every morning.',
      options: ['lese', 'lest', 'liest'],
      answer: 'A',
      feedbackAr: 'lesen = يقرأ (فعل قوي). ich lese, du liest, er liest, wir lesen. "Ich lese die Nachrichten".',
      feedbackEn: 'lesen = to read (strong verb). ich lese, du liest, er liest, wir lesen.',
      grammar: 'Verbkonjugation', grammarLink: '../grammatik/verbkonjugation/',
      lesson: 'B1 Lektion 1', lessonLink: '../b1/kursbuch/lektion-01/',
      exerciseLink: '../b1/ubungsbuch/lektion-01/'
    },
    // Q32 (new B1) — Education
    {
      section: 1, q: 32, type: 'choice', level: 'B1',
      sceneEmoji: '🎓',
      sceneAr: 'تتحدث عن خططك الدراسية.',
      sceneEn: 'Talking about your study plans.',
      stemAr: 'Ich möchte ___ studieren.',
      stemEn: 'I want to study ___ .',
      options: ['Medizin', 'Medizine', 'Medizinen'],
      answer: 'A',
      feedbackAr: 'Medizin studieren = دراسة الطب. Medizin هنا اسم المادة الدراسية (مفرد مؤنث).',
      feedbackEn: 'Medizin studieren = to study medicine. Medizin here is the subject name (feminine singular).',
      grammar: null, grammarLink: null,
      lesson: 'B1 Lektion 2', lessonLink: '../b1/kursbuch/lektion-02/',
      exerciseLink: '../b1/ubungsbuch/lektion-02/'
    },
    // Q33 (new B1) — Idiomatic expression
    {
      section: 1, q: 33, type: 'choice', level: 'B1',
      sceneEmoji: '🗣️',
      sceneAr: 'تتعلم تعابير اصطلاحية ألمانية.',
      sceneEn: 'Learning German idiomatic expressions.',
      stemAr: '"Das ist nicht mein Bier" bedeutet:',
      stemEn: '"Das ist nicht mein Bier" means:',
      options: ['Das ist nicht mein Problem', 'Das schmeckt mir nicht', 'Das ist zu teuer'],
      answer: 'A',
      feedbackAr: '"Das ist nicht mein Bier" = هذا ليس من شأني/مشكلتي (تعبير اصطلاحي شائع).',
      feedbackEn: '"Das ist nicht mein Bier" = That\'s not my problem (a common German idiom).',
      grammar: null, grammarLink: null,
      lesson: 'B1 Lektion 8', lessonLink: '../b1/kursbuch/lektion-08/',
      exerciseLink: '../b1/ubungsbuch/lektion-08/'
    },
    // Q34 (new B1) — Abstract concept
    {
      section: 1, q: 34, type: 'choice', level: 'B1',
      sceneEmoji: '💭',
      sceneAr: 'تناقش مفهوم الحرية مع صديق.',
      sceneEn: 'Discussing the concept of freedom with a friend.',
      stemAr: 'Für mich ist ___ sehr wichtig.',
      stemEn: 'For me, ___ is very important.',
      options: ['die Freiheit', 'der Freiheit', 'das Freiheit'],
      answer: 'A',
      feedbackAr: 'die Freiheit = الحرية. جميع الأسماء المنتهية بـ -heit مؤنثة (feminin).',
      feedbackEn: 'die Freiheit = freedom. All nouns ending with -heit are feminine.',
      grammar: 'Nomen', grammarLink: null,
      lesson: 'B1 Lektion 5', lessonLink: '../b1/kursbuch/lektion-05/',
      exerciseLink: '../b1/ubungsbuch/lektion-05/'
    },

    // ───────────────────────────────────────────────────────────
    // SECTION 2: Grammatik — القواعد (44 سؤالاً)
    // ───────────────────────────────────────────────────────────

    // ── A1 Level (16) ──

    // Q35 (existing A1)
    {
      section: 2, q: 1, type: 'choice', level: 'A1',
      sceneEmoji: '🧑‍🏫',
      sceneAr: 'في صف اللغة الألمانية، تتعلم تصريف الأفعال.',
      sceneEn: 'In German class, learning verb conjugation.',
      audio: true,
      audioText: 'Er heißt Ahmed',
      stemAr: 'استمع واختر التصريف الصحيح:',
      stemEn: 'Listen and choose the correct conjugation:',
      options: ['heißt', 'heiße', 'heißen'],
      answer: 'A',
      feedbackAr: 'er/sie/es → heißt. التصريف الصحيح للغائب المفرد.',
      feedbackEn: 'er/sie/es → heißt. Correct third-person singular conjugation.',
      grammar: 'Verbkonjugation', grammarLink: '../grammatik/verbkonjugation/',
      lesson: 'Lektion 1', lessonLink: '../a1/kursbuch/lektion-01/',
      exerciseLink: '../a1/ubungsbuch/lektion-01/'
    },
    // Q36 (existing A1)
    {
      section: 2, q: 2, type: 'choice', level: 'A1',
      sceneEmoji: '❓',
      sceneAr: 'تسأل عن أشياء في الغرفة.',
      sceneEn: 'Asking about things in the room.',
      stemAr: 'اختر أداة الاستفهام: "___ ist das?"',
      stemEn: 'Choose the question word: "___ ist das?"',
      options: ['Was', 'Wer', 'Wie'],
      answer: 'A',
      feedbackAr: '"Was" للأشياء (what). "Wer" للأشخاص (who). "Wie" للكيفية (how).',
      feedbackEn: '"Was" for things (what). "Wer" for people (who). "Wie" for manner (how).',
      grammar: 'Nominativ', grammarLink: '../grammatik/nominativ/',
      lesson: 'Lektion 3', lessonLink: '../a1/kursbuch/lektion-03/',
      exerciseLink: '../a1/ubungsbuch/lektion-03/'
    },
    // Q37 (existing A1)
    {
      section: 2, q: 3, type: 'choice', level: 'A1',
      sceneEmoji: '🍎',
      sceneAr: 'في متجر البقالة، تشتري فاكهة.',
      sceneEn: 'At the grocery store, buying fruit.',
      stemAr: 'Ich habe ___ Apfel.',
      stemEn: 'I have ___ apple.',
      options: ['einen', 'ein', 'eine'],
      answer: 'A',
      feedbackAr: 'der Apfel → Akkusativ → einen Apfel. المذكر يأخذ "einen" في حالة النصب.',
      feedbackEn: 'der Apfel → Accusative → einen Apfel. Masculine takes "einen" in accusative.',
      grammar: 'Akkusativ', grammarLink: '../grammatik/akkusativ/',
      lesson: 'Lektion 7', lessonLink: '../a1/kursbuch/lektion-07/',
      exerciseLink: '../a1/ubungsbuch/lektion-07/'
    },
    // Q38 (existing A1)
    {
      section: 2, q: 4, type: 'choice', level: 'A1',
      sceneEmoji: '⏰',
      sceneAr: 'تتحدث عن روتينك الصباحي.',
      sceneEn: 'Talking about your morning routine.',
      stemAr: 'Ich stehe ___ 7 Uhr auf.',
      stemEn: 'I get up ___ 7 o\'clock.',
      options: ['um', 'am', 'im'],
      answer: 'A',
      feedbackAr: 'للساعة نستخدم "um": um 7 Uhr = الساعة 7. "am" للأيام، "im" للشهور.',
      feedbackEn: 'For clock time use "um": um 7 Uhr = at 7 o\'clock. "am" for days, "im" for months.',
      grammar: 'Trennbare Verben', grammarLink: '../grammatik/trennbare-verben/',
      lesson: 'Lektion 5', lessonLink: '../a1/kursbuch/lektion-05/',
      exerciseLink: '../a1/ubungsbuch/lektion-05/'
    },
    // Q39 (new A1) — Negation
    {
      section: 2, q: 5, type: 'choice', level: 'A1',
      sceneEmoji: '🚫',
      sceneAr: 'تنفي وجود شيء ما.',
      sceneEn: 'Denying the existence of something.',
      stemAr: 'Ich habe ___ Auto.',
      stemEn: 'I have ___ car.',
      options: ['kein', 'nicht', 'keine'],
      answer: 'A',
      feedbackAr: 'نفي الاسم المنكّر: kein + اسم. Auto (محايد) → kein Auto. "nicht" لنفي الفعل.',
      feedbackEn: 'Negating an indefinite noun: kein + noun. Auto (neuter) → kein Auto. "nicht" negates verbs.',
      grammar: 'Negation', grammarLink: '../grammatik/negation/',
      lesson: 'Lektion 7', lessonLink: '../a1/kursbuch/lektion-07/',
      exerciseLink: '../a1/ubungsbuch/lektion-07/'
    },
    // Q40 (new A1) — Possessive mein/dein
    {
      section: 2, q: 6, type: 'choice', level: 'A1',
      sceneEmoji: '📝',
      sceneAr: 'تتحدث عن أشيائك وأشياء صديقك.',
      sceneEn: 'Talking about your and your friend\'s things.',
      stemAr: 'Das ist ___ Buch. (أنت مفرد)',
      stemEn: 'That is ___ book. (informal you)',
      options: ['dein', 'mein', 'sein'],
      answer: 'A',
      feedbackAr: 'dein = ملكك (للمخاطب المفرد). mein = ملكي. sein = ملكه. Buch محايد → dein Buch.',
      feedbackEn: 'dein = your (informal singular). mein = my. sein = his. Buch is neuter → dein Buch.',
      grammar: 'Possessivartikel', grammarLink: '../grammatik/possessivartikel/',
      lesson: 'Lektion 4', lessonLink: '../a1/kursbuch/lektion-04/',
      exerciseLink: '../a1/ubungsbuch/lektion-04/'
    },
    // Q41 (new A1) — sein/haben
    {
      section: 2, q: 7, type: 'choice', level: 'A1',
      sceneEmoji: '🧑',
      sceneAr: 'تقدم نفسك وتصف حالتك.',
      sceneEn: 'Introducing yourself and describing your state.',
      stemAr: 'Ich ___ Ahmed und ich ___ 25 Jahre alt.',
      stemEn: 'I ___ Ahmed and I ___ 25 years old.',
      options: ['bin – bin', 'heiße – habe', 'bin – habe'],
      answer: 'C',
      feedbackAr: '"Ich bin Ahmed" (sein = يكون) و "ich habe 25 Jahre" أو "ich bin 25 Jahre alt".',
      feedbackEn: '"Ich bin Ahmed" (sein = to be) and "ich habe 25 Jahre" or "ich bin 25 Jahre alt".',
      grammar: 'Verbkonjugation', grammarLink: '../grammatik/verbkonjugation/',
      lesson: 'Lektion 1', lessonLink: '../a1/kursbuch/lektion-01/',
      exerciseLink: '../a1/ubungsbuch/lektion-01/'
    },
    // Q42 (new A1) — Plural
    {
      section: 2, q: 8, type: 'choice', level: 'A1',
      sceneEmoji: '🔤',
      sceneAr: 'تتعلم جمع الأسماء.',
      sceneEn: 'Learning plural forms of nouns.',
      stemAr: 'الجمع الصحيح لكلمة "Buch" هو:',
      stemEn: 'The correct plural of "Buch" is:',
      options: ['Bücher', 'Bücher', 'Buchs'],
      answer: 'A',
      feedbackAr: 'das Buch → die Bücher. بعض الأسماء المحايدة تأخذ Umlaut + -er في الجمع.',
      feedbackEn: 'das Buch → die Bücher. Some neuter nouns form the plural with Umlaut + -er.',
      grammar: 'Plural', grammarLink: '../grammatik/plural/',
      lesson: 'Lektion 9', lessonLink: '../a1/kursbuch/lektion-09/',
      exerciseLink: '../a1/ubungsbuch/lektion-09/'
    },
    // Q43 (new A1) — Imperative
    {
      section: 2, q: 9, type: 'choice', level: 'A1',
      sceneEmoji: '📢',
      sceneAr: 'المعلم يعطي تعليمات للطلاب.',
      sceneEn: 'The teacher gives instructions to students.',
      stemAr: 'اختر صيغة الأمر: "___ bitte das Buch!"',
      stemEn: 'Choose the imperative: "Please ___ the book!"',
      options: ['Öffnen Sie', 'Öffnest du', 'Öffnet ihr'],
      answer: 'A',
      feedbackAr: 'صيغة الأمر الرسمية (Sie): Öffnen Sie das Buch! = افتح الكتاب من فضلك! الفعل + Sie.',
      feedbackEn: 'Formal imperative (Sie): Öffnen Sie das Buch! Verb + Sie.',
      grammar: 'Imperativ', grammarLink: '../grammatik/imperativ/',
      lesson: 'Lektion 5', lessonLink: '../a1/kursbuch/lektion-05/',
      exerciseLink: '../a1/ubungsbuch/lektion-05/'
    },
    // Q44 (new A1) — Personal pronouns
    {
      section: 2, q: 10, type: 'choice', level: 'A1',
      sceneEmoji: '👥',
      sceneAr: 'تستخدم ضمائر المتكلم.',
      sceneEn: 'Using personal pronouns.',
      stemAr: 'أكمل: Das ist Maria. ___ kommt aus Spanien.',
      stemEn: 'Complete: This is Maria. ___ comes from Spain.',
      options: ['Sie', 'Er', 'Es'],
      answer: 'A',
      feedbackAr: 'Maria مؤنث → "Sie" (هي). Sie kommt aus Spanien = هي من إسبانيا.',
      feedbackEn: 'Maria is feminine → "Sie" (she). Sie kommt aus Spanien = She is from Spain.',
      grammar: 'Personalpronomen', grammarLink: '../grammatik/personalpronomen/',
      lesson: 'Lektion 1', lessonLink: '../a1/kursbuch/lektion-01/',
      exerciseLink: '../a1/ubungsbuch/lektion-01/'
    },
    // Q45 (new A1) — Prepositions in/aus
    {
      section: 2, q: 11, type: 'choice', level: 'A1',
      sceneEmoji: '🏘️',
      sceneAr: 'تتحدث عن مكان سكنك.',
      sceneEn: 'Talking about where you live.',
      stemAr: 'Ich wohne ___ Berlin.',
      stemEn: 'I live ___ Berlin.',
      options: ['in', 'nach', 'aus'],
      answer: 'A',
      feedbackAr: '"in" للمدن: in Berlin. "nach" للاتجاه (nach Berlin fahren). "aus" للمنشأ (aus Berlin kommen).',
      feedbackEn: '"in" for cities: in Berlin. "nach" for direction (nach Berlin fahren). "aus" for origin (aus Berlin kommen).',
      grammar: 'Präpositionen', grammarLink: '../grammatik/prapositionen/',
      lesson: 'Lektion 1', lessonLink: '../a1/kursbuch/lektion-01/',
      exerciseLink: '../a1/ubungsbuch/lektion-01/'
    },
    // Q46 (new A1) — Fragewörter
    {
      section: 2, q: 12, type: 'choice', level: 'A1',
      sceneEmoji: '🤔',
      sceneAr: 'تسأل عن معلومات شخصية.',
      sceneEn: 'Asking for personal information.',
      stemAr: '"___ alt bist du?" — "Ich bin 20."',
      stemEn: '"___ old are you?" — "I am 20."',
      options: ['Wie', 'Was', 'Wer'],
      answer: 'A',
      feedbackAr: '"Wie" + صفة = كيف/كم. Wie alt = كم عمر. Wie alt bist du? = كم عمرك؟',
      feedbackEn: '"Wie" + adjective = how. Wie alt = how old. Wie alt bist du? = How old are you?',
      grammar: 'Fragewörter', grammarLink: '../grammatik/frageworter/',
      lesson: 'Lektion 2', lessonLink: '../a1/kursbuch/lektion-02/',
      exerciseLink: '../a1/ubungsbuch/lektion-02/'
    },
    // Q47 (new A1) — gern/mögen
    {
      section: 2, q: 13, type: 'choice', level: 'A1',
      sceneEmoji: '❤️',
      sceneAr: 'تعبر عما تحب.',
      sceneEn: 'Expressing what you like.',
      stemAr: 'Ich ___ Schokolade.',
      stemEn: 'I ___ chocolate.',
      options: ['mag', 'mögen', 'magst'],
      answer: 'A',
      feedbackAr: 'mögen (must like): ich mag, du magst, er mag, wir mögen. Ich mag Schokolade = أحب الشوكولاتة.',
      feedbackEn: 'mögen (to like): ich mag, du magst, er mag, wir mögen. Ich mag Schokolade = I like chocolate.',
      grammar: 'Modalverben', grammarLink: '../grammatik/modalverben/',
      lesson: 'Lektion 5', lessonLink: '../a1/kursbuch/lektion-05/',
      exerciseLink: '../a1/ubungsbuch/lektion-05/'
    },
    // Q48 (new A1) — Time expressions
    {
      section: 2, q: 14, type: 'choice', level: 'A1',
      sceneEmoji: '⏳',
      sceneAr: 'تتحدث عن الوقت.',
      sceneEn: 'Talking about time.',
      stemAr: 'Wie spät ist es? — Es ist ___ . (10:30)',
      stemEn: 'What time is it? — It is ___ . (10:30)',
      options: ['halb elf', 'halb zehn', 'zehn Uhr'],
      answer: 'A',
      feedbackAr: 'halb elf = 10:30 (نصف 11). الألمان يقولون "halb" + الساعة القادمة. 10:30 = halb elf.',
      feedbackEn: 'halb elf = 10:30 (half of 11). Germans say "halb" + the coming hour. 10:30 = halb elf.',
      grammar: 'Uhrzeit', grammarLink: '../grammatik/uhrzeit/',
      lesson: 'Lektion 6', lessonLink: '../a1/kursbuch/lektion-06/',
      exerciseLink: '../a1/ubungsbuch/lektion-06/'
    },
    // Q49 (new A1) — Nominative
    {
      section: 2, q: 15, type: 'choice', level: 'A1',
      sceneEmoji: '👤',
      sceneAr: 'تصف شخصاً ما في جملة اسمية.',
      sceneEn: 'Describing someone in a nominal sentence.',
      stemAr: 'Das ___ ein Student.',
      stemEn: 'This ___ a student.',
      options: ['ist', 'sind', 'bist'],
      answer: 'A',
      feedbackAr: '"Das" (مفرد) + ist. Das ist ein Student. Student في Nominativ (der → ein).',
      feedbackEn: '"Das" (singular) + ist. Das ist ein Student. Student is in Nominative (der → ein).',
      grammar: 'Nominativ', grammarLink: '../grammatik/nominativ/',
      lesson: 'Lektion 1', lessonLink: '../a1/kursbuch/lektion-01/',
      exerciseLink: '../a1/ubungsbuch/lektion-01/'
    },
    // Q50 (new A1) — Word order basic
    {
      section: 2, q: 16, type: 'choice', level: 'A1',
      sceneEmoji: '🧱',
      sceneAr: 'تتعلم ترتيب الكلمات الأساسي.',
      sceneEn: 'Learning basic word order.',
      stemAr: 'اختر الجملة الصحيحة:',
      stemEn: 'Choose the correct sentence:',
      options: ['Ich heiße Ahmed.', 'Ich Ahmed heiße.', 'Heiße ich Ahmed.'],
      answer: 'A',
      feedbackAr: 'في الجملة الخبرية: الفاعل + الفعل + المفعول به. Ich heiße Ahmed = أنا اسمي أحمد.',
      feedbackEn: 'In a declarative sentence: Subject + Verb + Object. Ich heiße Ahmed = My name is Ahmed.',
      grammar: 'Satzbau', grammarLink: '../grammatik/satzbau/',
      lesson: 'Lektion 1', lessonLink: '../a1/kursbuch/lektion-01/',
      exerciseLink: '../a1/ubungsbuch/lektion-01/'
    },

    // ── A2 Level (16) ──

    // Q51 (existing A2)
    {
      section: 2, q: 17, type: 'choice', level: 'A2',
      sceneEmoji: '🗣️',
      sceneAr: 'تسأل مديرك إذا كان يمكنك القدوم مبكراً.',
      sceneEn: 'Asking your boss if you may come earlier.',
      stemAr: 'اختر الفعل المساعد: "___ ich morgen früher kommen?"',
      stemEn: '___ I come earlier tomorrow?',
      options: ['Darf', 'Mag', 'Soll'],
      answer: 'A',
      feedbackAr: '"dürfen" = يُسمح/يمكن. Darf ich...? = هل يمكنني...؟ (طلب إذن).',
      feedbackEn: '"dürfen" = may/be allowed. Darf ich...? = May I...? (asking permission).',
      grammar: 'Modalverben', grammarLink: '../grammatik/modalverben/',
      lesson: 'Lektion 6', lessonLink: '../a1/kursbuch/lektion-06/',
      exerciseLink: '../a1/ubungsbuch/lektion-06/'
    },
    // Q52 (existing A2)
    {
      section: 2, q: 18, type: 'choice', level: 'A2',
      sceneEmoji: '⚽',
      sceneAr: 'تتحدث عن مباراة أمس مع صديق.',
      sceneEn: 'Talking about yesterday\'s match with a friend.',
      stemAr: 'Er ___ gestern Fußball gespielt.',
      stemEn: 'He played football yesterday.',
      options: ['hat', 'ist', 'war'],
      answer: 'A',
      feedbackAr: 'فعل "spielen" في Perfekt يحتاج "haben": er hat gespielt. "ist" für Bewegungsverben.',
      feedbackEn: '"spielen" in Perfekt uses "haben": er hat gespielt. "ist" for movement verbs.',
      grammar: 'Perfekt', grammarLink: '../grammatik/perfekt/',
      lesson: 'Lektion 8', lessonLink: '../a1/kursbuch/lektion-08/',
      exerciseLink: '../a1/ubungsbuch/lektion-08/'
    },
    // Q53 (existing A2)
    {
      section: 2, q: 19, type: 'choice', level: 'A2',
      sceneEmoji: '📖',
      sceneAr: 'تصف مكان كتاب على الطاولة.',
      sceneEn: 'Describing where a book is on the table.',
      stemAr: 'Das Buch liegt ___ Tisch.',
      stemEn: 'The book is on the table.',
      options: ['auf dem', 'auf den', 'auf der'],
      answer: 'A',
      feedbackAr: 'der Tisch → Dativ (liegen = ثبات) → auf dem Tisch. "auf den" للحركة.',
      feedbackEn: 'der Tisch → Dative (liegen = position/rest) → auf dem Tisch. "auf den" for movement.',
      grammar: 'Wechselpräpositionen', grammarLink: '../grammatik/wechselprapositionen/',
      lesson: 'Lektion 10', lessonLink: '../a1/kursbuch/lektion-10/',
      exerciseLink: '../a1/ubungsbuch/lektion-10/'
    },
    // Q54 (existing A2)
    {
      section: 2, q: 20, type: 'choice', level: 'A2',
      sceneEmoji: '🎁',
      sceneAr: 'تشتري هدية لصديق.',
      sceneEn: 'Buying a present for a friend.',
      stemAr: 'Ich gebe ___ Freund ein Geschenk.',
      stemEn: 'I give a present to the friend.',
      options: ['dem', 'der', 'den'],
      answer: 'A',
      feedbackAr: 'der Freund → Dativ (geben + مفعول به غير مباشر) → dem Freund.',
      feedbackEn: 'der Freund → Dative (geben + indirect object) → dem Freund.',
      grammar: 'Dativ', grammarLink: '../grammatik/dativ/',
      lesson: 'Lektion 10', lessonLink: '../a1/kursbuch/lektion-10/',
      exerciseLink: '../a1/ubungsbuch/lektion-10/'
    },
    // Q55 (existing A2)
    {
      section: 2, q: 21, type: 'choice', level: 'A2',
      sceneEmoji: '💭',
      sceneAr: 'تخبر صديقك أنك تعرف أن أحمد سيأتي غداً.',
      sceneEn: 'Telling your friend you know that Ahmed will come tomorrow.',
      stemAr: 'Ich weiß, ___ er morgen kommt.',
      stemEn: 'I know ___ he comes tomorrow.',
      options: ['dass', 'weil', 'wenn'],
      answer: 'A',
      feedbackAr: '"dass" = أن (حرف ربط للجملة الثانوية). "weil" = لأن. "wenn" = إذا/عندما.',
      feedbackEn: '"dass" = that (subordinating conjunction). "weil" = because. "wenn" = if/when.',
      grammar: 'Nebensätze', grammarLink: '../grammatik/nebensatze/',
      lesson: 'A2 Lektion 1', lessonLink: '../a2/kursbuch/lektion-01/',
      exerciseLink: '../a2/ubungsbuch/lektion-01/'
    },
    // Q56 (existing A2)
    {
      section: 2, q: 22, type: 'choice', level: 'A2',
      sceneEmoji: '📊',
      sceneAr: 'تقارن بين لغتين مع صديق.',
      sceneEn: 'Comparing two languages with a friend.',
      stemAr: 'Deutsch ist ___ Englisch.',
      stemEn: 'German is ___ English.',
      options: ['schwerer als', 'schwer als', 'am schwersten'],
      answer: 'A',
      feedbackAr: 'المقارن = صفة + er + als. schwer → schwerer als = أصعب من.',
      feedbackEn: 'Comparative = adjective + er + als. schwer → schwerer als = harder than.',
      grammar: 'Vergleiche', grammarLink: '../grammatik/vergleiche/',
      lesson: 'A2 Lektion 3', lessonLink: '../a2/kursbuch/lektion-03/',
      exerciseLink: '../a2/ubungsbuch/lektion-03/'
    },
    // Q57 (new A2) — Reflexive verbs
    {
      section: 2, q: 23, type: 'choice', level: 'A2',
      sceneEmoji: '🛁',
      sceneAr: 'تتحدث عن روتينك اليومي.',
      sceneEn: 'Talking about your daily routine.',
      stemAr: 'Ich ___ mich jeden Morgen.',
      stemEn: 'I ___ myself every morning.',
      options: ['wasche', 'wascht', 'waschen'],
      answer: 'A',
      feedbackAr: 'sich waschen = يغتسل/يغسل نفسه. Ich wasche mich = أنا أغسل نفسي/أغتسل.',
      feedbackEn: 'sich waschen = to wash oneself. Ich wasche mich = I wash myself.',
      grammar: 'Reflexive Verben', grammarLink: '../grammatik/reflexive-verben/',
      lesson: 'A2 Lektion 4', lessonLink: '../a2/kursbuch/lektion-04/',
      exerciseLink: '../a2/ubungsbuch/lektion-04/'
    },
    // Q58 (new A2) — "als" vs "wenn"
    {
      section: 2, q: 24, type: 'choice', level: 'A2',
      sceneEmoji: '🕰️',
      sceneAr: 'تتحدث عن حدث في الماضي.',
      sceneEn: 'Talking about a past event.',
      stemAr: '___ ich klein war, habe ich in Ägypten gewohnt.',
      stemEn: '___ I was little, I lived in Egypt.',
      options: ['Als', 'Wenn', 'Wann'],
      answer: 'A',
      feedbackAr: '"als" = عندما (للماضي لمرة واحدة). "wenn" = عندما/إذا (للحاضر/المستقبل أو المتكرر).',
      feedbackEn: '"als" = when (a single event in the past). "wenn" = when/if (present/future or repeated events).',
      grammar: 'Temporalangaben', grammarLink: null,
      lesson: 'A2 Lektion 6', lessonLink: '../a2/kursbuch/lektion-06/',
      exerciseLink: '../a2/ubungsbuch/lektion-06/'
    },
    // Q59 (new A2) — Präteritum war/hatte
    {
      section: 2, q: 25, type: 'choice', level: 'A2',
      sceneEmoji: '📚',
      sceneAr: 'تحكي قصة من الماضي.',
      sceneEn: 'Telling a story from the past.',
      stemAr: 'Gestern ___ ich keine Zeit.',
      stemEn: 'Yesterday I ___ no time.',
      options: ['hatte', 'habe', 'hätte'],
      answer: 'A',
      feedbackAr: 'Präteritum من "haben": ich hatte. Gestern hatte ich keine Zeit = أمس لم يكن لدي وقت.',
      feedbackEn: 'Präteritum of "haben": ich hatte. Gestern hatte ich keine Zeit = Yesterday I had no time.',
      grammar: 'Präteritum', grammarLink: '../grammatik/prateritum/',
      lesson: 'A2 Lektion 6', lessonLink: '../a2/kursbuch/lektion-06/',
      exerciseLink: '../a2/ubungsbuch/lektion-06/'
    },
    // Q60 (new A2) — Trennbare Verben
    {
      section: 2, q: 26, type: 'choice', level: 'A2',
      sceneEmoji: '📞',
      sceneAr: 'تتحدث عن الاتصال بشخص ما.',
      sceneEn: 'Talking about calling someone.',
      stemAr: 'Ich ___ dich morgen ___.',
      stemEn: 'I will ___ you tomorrow.',
      options: ['rufe … an', 'anrufe', 'angerufen'],
      answer: 'A',
      feedbackAr: 'anrufen = يتصل (فعل منفصل). في المضارع: ich rufe … an. البادئة تذهب لآخر الجملة.',
      feedbackEn: 'anrufen = to call (separable verb). In present: ich rufe … an. The prefix goes to the end.',
      grammar: 'Trennbare Verben', grammarLink: '../grammatik/trennbare-verben/',
      lesson: 'Lektion 5', lessonLink: '../a1/kursbuch/lektion-05/',
      exerciseLink: '../a1/ubungsbuch/lektion-05/'
    },
    // Q61 (new A2) — "es gibt"
    {
      section: 2, q: 27, type: 'choice', level: 'A2',
      sceneEmoji: '🏪',
      sceneAr: 'تسأل عما يوجد في المدينة.',
      sceneEn: 'Asking about what\'s in the city.',
      stemAr: '___ es einen Supermarkt hier?',
      stemEn: '___ there a supermarket here?',
      options: ['Gibt', 'Haben', 'Ist'],
      answer: 'A',
      feedbackAr: '"es gibt" + Akkusativ = يوجد/هناك. Gibt es...? = هل يوجد...؟ "es gibt" دائماً مع Akkusativ.',
      feedbackEn: '"es gibt" + Accusative = there is/are. Gibt es...? = Is there...? "es gibt" always takes Accusative.',
      grammar: 'Akkusativ', grammarLink: '../grammatik/akkusativ/',
      lesson: 'Lektion 9', lessonLink: '../a1/kursbuch/lektion-09/',
      exerciseLink: '../a1/ubungsbuch/lektion-09/'
    },
    // Q62 (new A2) — Relative clause
    {
      section: 2, q: 28, type: 'choice', level: 'A2',
      sceneEmoji: '🔗',
      sceneAr: 'تصف شخصاً بجملة وصفية.',
      sceneEn: 'Describing someone with a relative clause.',
      stemAr: 'Der Mann, ___ dort steht, ist mein Lehrer.',
      stemEn: 'The man ___ is standing there is my teacher.',
      options: ['der', 'den', 'dem'],
      answer: 'A',
      feedbackAr: 'der Mann ... der dort steht = الرجل الذي يقف هناك. "der" في Nominativ لأنه الفاعل في الجملة الثانوية.',
      feedbackEn: 'der Mann ... der dort steht = the man who is standing there. "der" in Nominative as the subject of the relative clause.',
      grammar: 'Relativsätze', grammarLink: '../grammatik/relativsatze/',
      lesson: 'A2 Lektion 8', lessonLink: '../a2/kursbuch/lektion-08/',
      exerciseLink: '../a2/ubungsbuch/lektion-08/'
    },
    // Q63 (new A2) — Werden (future)
    {
      section: 2, q: 29, type: 'choice', level: 'A2',
      sceneEmoji: '🔮',
      sceneAr: 'تتحدث عن المستقبل.',
      sceneEn: 'Talking about the future.',
      stemAr: 'Ich ___ morgen nach Berlin fahren.',
      stemEn: 'I ___ to Berlin tomorrow.',
      options: ['werde', 'wirst', 'wird'],
      answer: 'A',
      feedbackAr: 'Futur: werden + Infinitiv. ich → werde. Ich werde morgen fahren = سأسافر غداً إلى برلين.',
      feedbackEn: 'Future tense: werden + Infinitive. ich → werde. Ich werde morgen fahren = I will travel to Berlin tomorrow.',
      grammar: 'Futur', grammarLink: '../grammatik/futur/',
      lesson: 'A2 Lektion 9', lessonLink: '../a2/kursbuch/lektion-09/',
      exerciseLink: '../a2/ubungsbuch/lektion-09/'
    },
    // Q64 (new A2) — Ordinal numbers
    {
      section: 2, q: 30, type: 'choice', level: 'A2',
      sceneEmoji: '🏅',
      sceneAr: 'تتحدث عن الترتيب.',
      sceneEn: 'Talking about ranking.',
      stemAr: 'Heute ist der ___ Mai.',
      stemEn: 'Today is the ___ of May.',
      options: ['erste', 'erst', 'erster'],
      answer: 'A',
      feedbackAr: 'der erste Mai = الأول من مايو. الأعداد الترتيبية: erste (1.), zweite (2.), dritte (3.), vierte (4.).',
      feedbackEn: 'der erste Mai = the 1st of May. Ordinal numbers: erste (1st), zweite (2nd), dritte (3rd), vierte (4th).',
      grammar: 'Zahlen', grammarLink: '../grammatik/zahlen/',
      lesson: 'Lektion 6', lessonLink: '../a1/kursbuch/lektion-06/',
      exerciseLink: '../a1/ubungsbuch/lektion-06/'
    },
    // Q65 (new A2) — Genitive
    {
      section: 2, q: 31, type: 'choice', level: 'A2',
      sceneEmoji: '🏠',
      sceneAr: 'تتحدث عن ملكية شيء ما.',
      sceneEn: 'Talking about possession.',
      stemAr: 'Das ist das Haus ___ Mannes.',
      stemEn: 'That is the house of the man.',
      options: ['des', 'dem', 'den'],
      answer: 'A',
      feedbackAr: 'Genitiv: der Mann → des Mannes. das Haus des Mannes = بيت الرجل. der → des, die → der, das → des.',
      feedbackEn: 'Genitive: der Mann → des Mannes. das Haus des Mannes = the man\'s house.',
      grammar: 'Genitiv', grammarLink: '../grammatik/genitiv/',
      lesson: 'A2 Lektion 7', lessonLink: '../a2/kursbuch/lektion-07/',
      exerciseLink: '../a2/ubungsbuch/lektion-07/'
    },
    // Q66 (new A2) — Infinitive with "zu"
    {
      section: 2, q: 32, type: 'choice', level: 'A2',
      sceneEmoji: '📋',
      sceneAr: 'تتحدث عن خططك.',
      sceneEn: 'Talking about your plans.',
      stemAr: 'Ich hoffe, dich bald ___ .',
      stemEn: 'I hope ___ you soon.',
      options: ['zu sehen', 'sehen', 'sehe'],
      answer: 'A',
      feedbackAr: 'بعد بعض الأفعال (hoffen, versprechen, beginnen) يأتي "zu" + Infinitiv. zu sehen = أن أرى.',
      feedbackEn: 'After certain verbs (hoffen, versprechen, beginnen) use "zu" + Infinitive. zu sehen = to see.',
      grammar: 'Infinitiv mit zu', grammarLink: '../grammatik/infinitiv-mit-zu/',
      lesson: 'A2 Lektion 9', lessonLink: '../a2/kursbuch/lektion-09/',
      exerciseLink: '../a2/ubungsbuch/lektion-09/'
    },

    // ── B1 Level (12) ──

    // Q67 (existing B1)
    {
      section: 2, q: 33, type: 'choice', level: 'B1',
      sceneEmoji: '💭',
      sceneAr: 'تعبر عن أمنية — تتمنى لو كان لديك وقت أكثر.',
      sceneEn: 'Expressing a wish — if only you had more time.',
      stemAr: 'اختر أداة الشرط: "___ ich mehr Zeit hätte!"',
      stemEn: '___ I had more time!',
      options: ['Wenn', 'Weil', 'Dass'],
      answer: 'A',
      feedbackAr: '"wenn" + Konjunktiv 2 = جملة أمنية (if only). Wenn ich mehr Zeit hätte!',
      feedbackEn: '"wenn" + Konjunktiv 2 = wish clause. Wenn ich mehr Zeit hätte! = If only I had more time!',
      grammar: 'Konjunktiv 2', grammarLink: '../grammatik/konjunktiv-2/',
      lesson: 'A2 Lektion 3', lessonLink: '../a2/kursbuch/lektion-03/',
      exerciseLink: '../a2/ubungsbuch/lektion-03/'
    },
    // Q68 (existing B1)
    {
      section: 2, q: 34, type: 'choice', level: 'B1',
      sceneEmoji: '🏗️',
      sceneAr: 'تصف بناء منزل — أسلوب المبني للمجهول.',
      sceneEn: 'Describing a house being built — passive voice.',
      stemAr: 'Das Haus ___ gebaut.',
      stemEn: 'The house ___ built.',
      options: ['wird', 'ist', 'war'],
      answer: 'A',
      feedbackAr: 'المبني للمجهول (Passiv) في المضارع: werden + Partizip II. Das Haus wird gebaut.',
      feedbackEn: 'Passive voice in present: werden + Past Participle. Das Haus wird gebaut.',
      grammar: 'Passiv', grammarLink: '../grammatik/passiv/',
      lesson: 'A2 Lektion 3', lessonLink: '../a2/kursbuch/lektion-03/',
      exerciseLink: '../a2/ubungsbuch/lektion-03/'
    },
    // Q69 (new B1) — Passive with modal
    {
      section: 2, q: 35, type: 'choice', level: 'B1',
      sceneEmoji: '📜',
      sceneAr: 'تتحدث عن قوانين يجب اتباعها.',
      sceneEn: 'Talking about rules that must be followed.',
      stemAr: 'Hier ___ nicht geraucht werden.',
      stemEn: 'Smoking is not allowed here.',
      options: ['darf', 'kann', 'muss'],
      answer: 'A',
      feedbackAr: 'Modalverb + Passiv: "darf nicht geraucht werden" = لا يُسمح بالتدخين. Modalverb في الموضع 2 + Partizip + werden.',
      feedbackEn: 'Modal + Passive: "darf nicht geraucht werden" = smoking is not allowed. Modal in position 2 + Partizip + werden.',
      grammar: 'Passiv', grammarLink: '../grammatik/passiv/',
      lesson: 'B1 Lektion 4', lessonLink: '../b1/kursbuch/lektion-04/',
      exerciseLink: '../b1/ubungsbuch/lektion-04/'
    },
    // Q70 (new B1) — Konjunktiv 2 würde
    {
      section: 2, q: 36, type: 'choice', level: 'B1',
      sceneEmoji: '🌍',
      sceneAr: 'تتخيل لو كنت غنياً.',
      sceneEn: 'Imagining if you were rich.',
      stemAr: 'Ich ___ um die Welt reisen, wenn ich Geld hätte.',
      stemEn: 'I ___ travel the world if I had money.',
      options: ['würde', 'werde', 'will'],
      answer: 'A',
      feedbackAr: 'Konjunktiv 2: "würde" + Infinitiv. Ich würde reisen = كنت سأسافر. يستخدم للتعبير عن التخيل.',
      feedbackEn: 'Konjunktiv 2: "würde" + Infinitive. Ich würde reisen = I would travel. Used for hypothetical situations.',
      grammar: 'Konjunktiv 2', grammarLink: '../grammatik/konjunktiv-2/',
      lesson: 'B1 Lektion 1', lessonLink: '../b1/kursbuch/lektion-01/',
      exerciseLink: '../b1/ubungsbuch/lektion-01/'
    },
    // Q71 (new B1) — Plusquamperfekt
    {
      section: 2, q: 37, type: 'choice', level: 'B1',
      sceneEmoji: '⏮️',
      sceneAr: 'تحكي حدثاً وقع قبل حدث آخر في الماضي.',
      sceneEn: 'Telling about an event before another past event.',
      stemAr: 'Nachdem ich gegessen ___, ging ich spazieren.',
      stemEn: 'After I had eaten, I went for a walk.',
      options: ['hatte', 'habe', 'hätte'],
      answer: 'A',
      feedbackAr: 'Plusquamperfekt: nachdem + haben/sein (Präteritum) + Partizip II. Nachdem ich gegessen hatte = بعد أن أكلت.',
      feedbackEn: 'Plusquamperfekt: nachdem + haben/sein (Präteritum) + Partizip II. Nachdem ich gegessen hatte = After I had eaten.',
      grammar: 'Plusquamperfekt', grammarLink: '../grammatik/plusquamperfekt/',
      lesson: 'B1 Lektion 2', lessonLink: '../b1/kursbuch/lektion-02/',
      exerciseLink: '../b1/ubungsbuch/lektion-02/'
    },
    // Q72 (new B1) — Relative clause Genitive
    {
      section: 2, q: 38, type: 'choice', level: 'B1',
      sceneEmoji: '🏛️',
      sceneAr: 'تقرأ عن أصول أشياء.',
      sceneEn: 'Reading about origins of things.',
      stemAr: 'Der Künstler, ___ Bilder weltberühmt sind, lebt in Berlin.',
      stemEn: 'The artist ___ paintings are world-famous lives in Berlin.',
      options: ['dessen', 'deren', 'dem'],
      answer: 'A',
      feedbackAr: 'Relativpronomen في Genitiv: "dessen" = الذي/التي (لمفرد مذكر/محايد). der Künstler, dessen Bilder = الفنان الذي لوحاته...',
      feedbackEn: 'Relative pronoun in Genitive: "dessen" = whose (for masculine/neuter singular). der Künstler, dessen Bilder = the artist whose paintings...',
      grammar: 'Relativsätze', grammarLink: '../grammatik/relativsatze/',
      lesson: 'B1 Lektion 3', lessonLink: '../b1/kursbuch/lektion-03/',
      exerciseLink: '../b1/ubungsbuch/lektion-03/'
    },
    // Q73 (new B1) — indirekte Frage
    {
      section: 2, q: 39, type: 'choice', level: 'B1',
      sceneEmoji: '🤷',
      sceneAr: 'تعبر عن عدم معرفتك.',
      sceneEn: 'Expressing not knowing something.',
      stemAr: 'Ich weiß nicht, ___ er kommt.',
      stemEn: 'I don\'t know ___ he is coming.',
      options: ['ob', 'wenn', 'dass'],
      answer: 'A',
      feedbackAr: '"ob" = هل/إن (للسؤال غير المباشر). Ich weiß nicht, ob er kommt = لا أعرف إن كان سيأتي.',
      feedbackEn: '"ob" = whether/if (for indirect questions). Ich weiß nicht, ob er kommt = I don\'t know whether he is coming.',
      grammar: 'Nebensätze', grammarLink: '../grammatik/nebensatze/',
      lesson: 'B1 Lektion 2', lessonLink: '../b1/kursbuch/lektion-02/',
      exerciseLink: '../b1/ubungsbuch/lektion-02/'
    },
    // Q74 (new B1) — bevor/nachdem/während
    {
      section: 2, q: 40, type: 'choice', level: 'B1',
      sceneEmoji: '⏳',
      sceneAr: 'تتحدث عن ترتيب الأحداث.',
      sceneEn: 'Talking about the sequence of events.',
      stemAr: '___ ich schlafe, putze ich mir die Zähne.',
      stemEn: '___ I sleep, I brush my teeth.',
      options: ['Bevor', 'Nachdem', 'Während'],
      answer: 'A',
      feedbackAr: '"bevor" = قبل أن. Bevor ich schlafe = قبل أن أنام. "bevor" ترسل الفعل لآخر الجملة.',
      feedbackEn: '"bevor" = before. Bevor ich schlafe = before I sleep. "bevor" sends the verb to the end.',
      grammar: 'Temporalsätze', grammarLink: null,
      lesson: 'B1 Lektion 5', lessonLink: '../b1/kursbuch/lektion-05/',
      exerciseLink: '../b1/ubungsbuch/lektion-05/'
    },
    // Q75 (new B1) — Indefinite pronouns
    {
      section: 2, q: 41, type: 'choice', level: 'B1',
      sceneEmoji: '🔍',
      sceneAr: 'تتحدث عن أشخاص غير محددين.',
      sceneEn: 'Talking about unspecified people.',
      stemAr: '___ kann Deutsch lernen, wenn er will.',
      stemEn: '___ can learn German if they want to.',
      options: ['Jeder', 'Alle', 'Man'],
      answer: 'A',
      feedbackAr: '"Jeder" = كل شخص/الجميع (مفرد). Jeder kann Deutsch lernen = كل شخص يستطيع تعلم الألمانية.',
      feedbackEn: '"Jeder" = everyone/everybody (singular). Jeder kann Deutsch lernen = Everyone can learn German.',
      grammar: 'Pronomen', grammarLink: null,
      lesson: 'B1 Lektion 6', lessonLink: '../b1/kursbuch/lektion-06/',
      exerciseLink: '../b1/ubungsbuch/lektion-06/'
    },
    // Q76 (new B1) — Partizip als Adjektiv
    {
      section: 2, q: 42, type: 'choice', level: 'B1',
      sceneEmoji: '📰',
      sceneAr: 'تصف حالة شيء ما.',
      sceneEn: 'Describing the state of something.',
      stemAr: 'Das ___ Essen schmeckt gut.',
      stemEn: 'The ___ food tastes good.',
      options: ['gekochte', 'kochende', 'gekocht'],
      answer: 'A',
      feedbackAr: 'Partizip II كصفة: das gekochte Essen = الطعام المطبوخ. التصريف كصفة عادية مع إضافة النهاية -e (بعد der/das/die).',
      feedbackEn: 'Partizip II as adjective: das gekochte Essen = the cooked food. Decline like a regular adjective.',
      grammar: 'Partizipien', grammarLink: null,
      lesson: 'B1 Lektion 7', lessonLink: '../b1/kursbuch/lektion-07/',
      exerciseLink: '../b1/ubungsbuch/lektion-07/'
    },
    // Q77 (new B1) — Doppelinfinitiv
    {
      section: 2, q: 43, type: 'choice', level: 'B1',
      sceneEmoji: '🎯',
      sceneAr: 'تتحدث عن شيء كان يجب فعله.',
      sceneEn: 'Talking about something that should have been done.',
      stemAr: 'Er hat mich gestern anrufen ___.',
      stemEn: 'He should have called me yesterday.',
      options: ['sollen', 'gesollt', 'sollet'],
      answer: 'A',
      feedbackAr: 'Doppelinfinitiv: بعد Modalverb في Perfekt يأتي مصدرين (Doppelinfinitiv). Er hat ... anrufen sollen.',
      feedbackEn: 'Double infinitive: after modal verbs in Perfekt, use two infinitives. Er hat ... anrufen sollen.',
      grammar: 'Modalverben', grammarLink: '../grammatik/modalverben/',
      lesson: 'B1 Lektion 4', lessonLink: '../b1/kursbuch/lektion-04/',
      exerciseLink: '../b1/ubungsbuch/lektion-04/'
    },
    // Q78 (new B1) — Adjektivdeklination
    {
      section: 2, q: 44, type: 'choice', level: 'B1',
      sceneEmoji: '👗',
      sceneAr: 'تصف ملابس في متجر.',
      sceneEn: 'Describing clothes in a store.',
      stemAr: 'Ich suche ___ Rock.',
      stemEn: 'I am looking for a red skirt.',
      options: ['einen roten', 'ein rotes', 'eine rote'],
      answer: 'A',
      feedbackAr: 'der Rock (مذكر) → Akkusativ → einen roten Rock. تصريف الصفة بعد "einen": -en (مذكر Akkusativ).',
      feedbackEn: 'der Rock (masculine) → Accusative → einen roten Rock. Adjective ending after "einen": -en.',
      grammar: 'Adjektivdeklination', grammarLink: '../grammatik/adjektivdeklination/',
      lesson: 'B1 Lektion 3', lessonLink: '../b1/kursbuch/lektion-03/',
      exerciseLink: '../b1/ubungsbuch/lektion-03/'
    },

    // ───────────────────────────────────────────────────────────
    // SECTION 3: Satzbau — تركيب الجمل (28 سؤالاً)
    // ───────────────────────────────────────────────────────────

    // ── A1 Level (12) ──

    // Q79 (existing order)
    {
      section: 3, q: 1, type: 'order', level: 'A1',
      sceneEmoji: '🧩',
      sceneAr: 'تتعلم ترتيب الكلمات في الجملة الألمانية.',
      sceneEn: 'Learning German word order.',
      stemAr: 'رتب الكلمات لتكوين جملة صحيحة:',
      stemEn: 'Arrange the words to form a correct sentence:',
      orderWords: ['Ahmed', 'heiße', 'Ich'],
      answer: ['Ich', 'heiße', 'Ahmed'],
      feedbackAr: 'في الألمانية، الفعل هو العنصر الثاني في الجملة الخبرية: Ich heiße Ahmed.',
      feedbackEn: 'In German, the verb is the second element in a declarative sentence: Ich heiße Ahmed.',
      grammar: 'Satzbau', grammarLink: '../grammatik/satzbau/',
      lesson: 'Lektion 1', lessonLink: '../a1/kursbuch/lektion-01/',
      exerciseLink: '../a1/ubungsbuch/lektion-01/'
    },
    // Q80 (existing order)
    {
      section: 3, q: 2, type: 'order', level: 'A1',
      sceneEmoji: '🧩',
      sceneAr: 'تتعلم قاعدة الفعل في الموضع الثاني.',
      sceneEn: 'Learning the verb-second position rule.',
      stemAr: 'رتب الكلمات لتكوين جملة تبدأ بـ "اليوم":',
      stemEn: 'Arrange the words to form a sentence starting with "today":',
      orderWords: ['ich', 'gehe', 'Heute'],
      answer: ['Heute', 'gehe', 'ich'],
      feedbackAr: 'عند بدء الجملة بـ "heute"، يبقى الفعل في الموضع الثاني: Heute gehe ich.',
      feedbackEn: 'When starting with "heute", the verb stays in position 2: Heute gehe ich.',
      grammar: 'Satzbau', grammarLink: '../grammatik/satzbau/',
      lesson: 'Lektion 5', lessonLink: '../a1/kursbuch/lektion-05/',
      exerciseLink: '../a1/ubungsbuch/lektion-05/'
    },
    // Q81 (new A1)
    {
      section: 3, q: 3, type: 'order', level: 'A1',
      sceneEmoji: '🧩',
      sceneAr: 'تكوّن جملة بسيطة عن السكن.',
      sceneEn: 'Forming a simple sentence about living.',
      stemAr: 'رتب الكلمات:',
      stemEn: 'Order the words:',
      orderWords: ['in Berlin', 'wohne', 'Ich'],
      answer: ['Ich', 'wohne', 'in Berlin'],
      feedbackAr: 'Ich wohne in Berlin. الفاعل (Ich) + الفعل (wohne) + المكان.',
      feedbackEn: 'I live in Berlin. Subject (Ich) + Verb (wohne) + place.',
      grammar: 'Satzbau', grammarLink: '../grammatik/satzbau/',
      lesson: 'Lektion 1', lessonLink: '../a1/kursbuch/lektion-01/',
      exerciseLink: '../a1/ubungsbuch/lektion-01/'
    },
    // Q82 (new A1)
    {
      section: 3, q: 4, type: 'order', level: 'A1',
      sceneEmoji: '🧩',
      sceneAr: 'تكوّن جملة عن العمر.',
      sceneEn: 'Forming a sentence about age.',
      stemAr: 'رتب الكلمات:',
      stemEn: 'Order the words:',
      orderWords: ['zwanzig', 'Jahre', 'alt', 'Ich', 'bin'],
      answer: ['Ich', 'bin', 'zwanzig', 'Jahre', 'alt'],
      feedbackAr: 'Ich bin zwanzig Jahre alt. الفعل "bin" في الموضع الثاني.',
      feedbackEn: 'I am 20 years old. The verb "bin" is in position 2.',
      grammar: 'Satzbau', grammarLink: '../grammatik/satzbau/',
      lesson: 'Lektion 2', lessonLink: '../a1/kursbuch/lektion-02/',
      exerciseLink: '../a1/ubungsbuch/lektion-02/'
    },
    // Q83 (new A1 choice)
    {
      section: 3, q: 5, type: 'choice', level: 'A1',
      sceneEmoji: '📝',
      sceneAr: 'تتعلم ترتيب الكلمات مع مناداة.',
      sceneEn: 'Learning word order with salutation.',
      stemAr: 'اختر الجملة الصحيحة:',
      stemEn: 'Choose the correct sentence:',
      options: ['Guten Morgen, Herr Müller', 'Guten Morgen Herr Müller', 'Herr Müller, Guten Morgen'],
      answer: 'A',
      feedbackAr: 'التحية أولاً ثم الاسم: Guten Morgen, Herr Müller. الفاصلة تفصل بينهما.',
      feedbackEn: 'Greeting first, then name: Guten Morgen, Herr Müller. The comma separates them.',
      grammar: 'Satzbau', grammarLink: '../grammatik/satzbau/',
      lesson: 'Lektion 1', lessonLink: '../a1/kursbuch/lektion-01/',
      exerciseLink: '../a1/ubungsbuch/lektion-01/'
    },
    // Q84 (new A1 choice)
    {
      section: 3, q: 6, type: 'choice', level: 'A1',
      sceneEmoji: '❓',
      sceneAr: 'تتعلم كيف تسأل سؤالاً.',
      sceneEn: 'Learning how to ask a question.',
      stemAr: 'اختر الجملة الصحيحة للسؤال:',
      stemEn: 'Choose the correct question:',
      options: ['Kommst du aus Spanien?', 'Du kommst aus Spanien?', 'Aus Spanien du kommst?'],
      answer: 'A',
      feedbackAr: 'في الأسئلة بنعم/لا: الفعل أولاً ثم الفاعل. Kommst du aus Spanien? = هل أنت من إسبانيا؟',
      feedbackEn: 'In yes/no questions: verb first, then subject. Kommst du aus Spanien? = Are you from Spain?',
      grammar: 'Satzbau', grammarLink: '../grammatik/satzbau/',
      lesson: 'Lektion 2', lessonLink: '../a1/kursbuch/lektion-02/',
      exerciseLink: '../a1/ubungsbuch/lektion-02/'
    },
    // Q85 (new A1 order)
    {
      section: 3, q: 7, type: 'order', level: 'A1',
      sceneEmoji: '🧩',
      sceneAr: 'تكوّن سؤالاً بسيطاً.',
      sceneEn: 'Forming a simple question.',
      stemAr: 'رتب الكلمات لتكوين سؤال:',
      stemEn: 'Order the words to form a question:',
      orderWords: ['du', 'kommst', 'Woher'],
      answer: ['Woher', 'kommst', 'du'],
      feedbackAr: 'Woher kommst du? = من أين أنت؟ أداة الاستفهام (Woher) + الفعل (kommst) + الفاعل (du).',
      feedbackEn: 'Woher kommst du? = Where are you from? Question word + verb + subject.',
      grammar: 'Satzbau', grammarLink: '../grammatik/satzbau/',
      lesson: 'Lektion 2', lessonLink: '../a1/kursbuch/lektion-02/',
      exerciseLink: '../a1/ubungsbuch/lektion-02/'
    },
    // Q86 (new A1 order)
    {
      section: 3, q: 8, type: 'order', level: 'A1',
      sceneEmoji: '🧩',
      sceneAr: 'تكوّن جملة عن المهنة.',
      sceneEn: 'Forming a sentence about profession.',
      stemAr: 'رتب الكلمات:',
      stemEn: 'Order the words:',
      orderWords: ['Lehrer', 'ist', 'Er'],
      answer: ['Er', 'ist', 'Lehrer'],
      feedbackAr: 'Er ist Lehrer = هو مدرس. "ist" في الموضع الثاني.',
      feedbackEn: 'He is a teacher. "ist" in position 2.',
      grammar: 'Satzbau', grammarLink: '../grammatik/satzbau/',
      lesson: 'Lektion 3', lessonLink: '../a1/kursbuch/lektion-03/',
      exerciseLink: '../a1/ubungsbuch/lektion-03/'
    },
    // Q87 (new A1 order)
    {
      section: 3, q: 9, type: 'order', level: 'A1',
      sceneEmoji: '🧩',
      sceneAr: 'تكوّن جملة عن الطعام.',
      sceneEn: 'Forming a sentence about food.',
      stemAr: 'رتب الكلمات:',
      stemEn: 'Order the words:',
      orderWords: ['Pizza', 'mag', 'Ich'],
      answer: ['Ich', 'mag', 'Pizza'],
      feedbackAr: 'Ich mag Pizza = أنا أحب البيتزا. الفعل المساعد "mag" في الموضع الثاني.',
      feedbackEn: 'I like pizza. The modal verb "mag" in position 2.',
      grammar: 'Satzbau', grammarLink: '../grammatik/satzbau/',
      lesson: 'Lektion 5', lessonLink: '../a1/kursbuch/lektion-05/',
      exerciseLink: '../a1/ubungsbuch/lektion-05/'
    },
    // Q88 (new A1 order)
    {
      section: 3, q: 10, type: 'order', level: 'A1',
      sceneEmoji: '🧩',
      sceneAr: 'تكوّن جملة عن السفر.',
      sceneEn: 'Forming a sentence about travel.',
      stemAr: 'رتب الكلمات:',
      stemEn: 'Order the words:',
      orderWords: ['nach', 'München', 'fahren', 'Wir'],
      answer: ['Wir', 'fahren', 'nach', 'München'],
      feedbackAr: 'Wir fahren nach München = نحن نذهب إلى ميونخ. "fahren" في الموضع الثاني.',
      feedbackEn: 'We go to Munich. "fahren" in position 2.',
      grammar: 'Satzbau', grammarLink: '../grammatik/satzbau/',
      lesson: 'Lektion 15', lessonLink: '../a1/kursbuch/lektion-15/',
      exerciseLink: '../a1/ubungsbuch/lektion-15/'
    },
    // Q89 (new A1 choice)
    {
      section: 3, q: 11, type: 'choice', level: 'A1',
      sceneEmoji: '📐',
      sceneAr: 'تتعلّم ترتيب الظرف في الجملة.',
      sceneEn: 'Learning adverb placement.',
      stemAr: 'أكمل الجملة الصحيحة:',
      stemEn: 'Complete the correct sentence:',
      options: ['Ich gehe morgen ins Kino.', 'Ich morgen gehe ins Kino.', 'Morgen ich gehe ins Kino.'],
      answer: 'A',
      feedbackAr: 'الظرف (morgen) يأتي بعد الفعل مباشرة أو في أول الجملة: Ich gehe morgen ins Kino.',
      feedbackEn: 'The adverb (morgen) comes right after the verb or at the start: Ich gehe morgen ins Kino.',
      grammar: 'Satzbau', grammarLink: '../grammatik/satzbau/',
      lesson: 'Lektion 5', lessonLink: '../a1/kursbuch/lektion-05/',
      exerciseLink: '../a1/ubungsbuch/lektion-05/'
    },
    // Q90 (new A1 order)
    {
      section: 3, q: 12, type: 'order', level: 'A1',
      sceneEmoji: '🧩',
      sceneAr: 'تكوّن جملة عن الهوايات.',
      sceneEn: 'Forming a sentence about hobbies.',
      stemAr: 'رتب الكلمات:',
      stemEn: 'Order the words:',
      orderWords: ['gern', 'Tennis', 'spielt', 'Sie'],
      answer: ['Sie', 'spielt', 'gern', 'Tennis'],
      feedbackAr: 'Sie spielt gern Tennis = هي تلعب التنس بسرور. "gern" بعد الفعل.',
      feedbackEn: 'She likes to play tennis. "gern" after the verb.',
      grammar: 'Satzbau', grammarLink: '../grammatik/satzbau/',
      lesson: 'Lektion 5', lessonLink: '../a1/kursbuch/lektion-05/',
      exerciseLink: '../a1/ubungsbuch/lektion-05/'
    },

    // ── A2 Level (8) ──

    // Q91 (existing A2 choice)
    {
      section: 3, q: 13, type: 'choice', level: 'A2',
      sceneEmoji: '💼',
      sceneAr: 'تشرح سبب تعلمك الألمانية.',
      sceneEn: 'Explaining why you learn German.',
      stemAr: 'Ich lerne Deutsch, ___ ich in Deutschland arbeiten möchte.',
      stemEn: 'I learn German ___ I want to work in Germany.',
      options: ['weil', 'weil ich', 'denn'],
      answer: 'A',
      feedbackAr: '"weil" + الفعل في آخر الجملة. weil ich in Deutschland arbeiten möchte.',
      feedbackEn: '"weil" sends the verb to the end. weil ich in Deutschland arbeiten möchte.',
      grammar: 'Nebensätze', grammarLink: '../grammatik/nebensatze/',
      lesson: 'A2 Lektion 1', lessonLink: '../a2/kursbuch/lektion-01/',
      exerciseLink: '../a2/ubungsbuch/lektion-01/'
    },
    // Q92 (existing A2 choice)
    {
      section: 3, q: 14, type: 'choice', level: 'A2',
      sceneEmoji: '💬',
      sceneAr: 'تنقل كلام شخص آخر.',
      sceneEn: 'Reporting what someone else said.',
      stemAr: 'أكمل: Er sagt, dass er morgen ___.',
      stemEn: 'Complete: He says that he ___ tomorrow.',
      options: ['kommt', 'kommt er', 'er kommt'],
      answer: 'A',
      feedbackAr: 'في جملة "dass": الفعل يذهب إلى آخر الجملة. dass er morgen kommt.',
      feedbackEn: 'In a "dass" clause: the verb goes to the end. dass er morgen kommt.',
      grammar: 'Nebensätze', grammarLink: '../grammatik/nebensatze/',
      lesson: 'A2 Lektion 1', lessonLink: '../a2/kursbuch/lektion-01/',
      exerciseLink: '../a2/ubungsbuch/lektion-01/'
    },
    // Q93 (existing A2 order)
    {
      section: 3, q: 15, type: 'order', level: 'A2',
      sceneEmoji: '🚄',
      sceneAr: 'تتحدث عن خطط السفر إلى برلين.',
      sceneEn: 'Talking about travel plans to Berlin.',
      stemAr: 'رتب الكلمات لتكوين جملة صحيحة:',
      stemEn: 'Arrange the words to form a correct sentence:',
      orderWords: ['morgen', 'nach Berlin', 'fahren', 'will', 'Ich'],
      answer: ['Ich', 'will', 'morgen', 'nach Berlin', 'fahren'],
      feedbackAr: 'فعل المودال (will) في الموضع الثاني، والفعل الرئيسي (fahren) في آخر الجملة.',
      feedbackEn: 'Modal verb (will) in position 2, main verb (fahren) at the end.',
      grammar: 'Wortstellung', grammarLink: '../grammatik/wortstellung-erweitert/',
      lesson: 'A2 Lektion 11', lessonLink: '../a2/kursbuch/lektion-11/',
      exerciseLink: '../a2/ubungsbuch/lektion-11/'
    },
    // Q94 (new A2 order)
    {
      section: 3, q: 16, type: 'order', level: 'A2',
      sceneEmoji: '🧩',
      sceneAr: 'تكوّن جملة مع weil.',
      sceneEn: 'Forming a sentence with "weil".',
      stemAr: 'رتب الكلمات:',
      stemEn: 'Order the words:',
      orderWords: ['lernt', 'Deutsch', 'er', 'weil'],
      answer: ['weil', 'er', 'Deutsch', 'lernt'],
      feedbackAr: '"weil" يرسل الفعل لآخر الجملة: weil er Deutsch lernt = لأنه يتعلم الألمانية.',
      feedbackEn: '"weil" sends the verb to the end: weil er Deutsch lernt = because he learns German.',
      grammar: 'Nebensätze', grammarLink: '../grammatik/nebensatze/',
      lesson: 'A2 Lektion 1', lessonLink: '../a2/kursbuch/lektion-01/',
      exerciseLink: '../a2/ubungsbuch/lektion-01/'
    },
    // Q95 (new A2 order)
    {
      section: 3, q: 17, type: 'order', level: 'A2',
      sceneEmoji: '🧩',
      sceneAr: 'تكوّن جملة مع können.',
      sceneEn: 'Forming a sentence with "können".',
      stemAr: 'رتب الكلمات:',
      stemEn: 'Order the words:',
      orderWords: ['gut', 'Deutsch', 'sprechen', 'kann', 'Er'],
      answer: ['Er', 'kann', 'gut', 'Deutsch', 'sprechen'],
      feedbackAr: 'Er kann gut Deutsch sprechen. Modalverb (kann) في الموضع 2، المصدر (sprechen) في آخر الجملة.',
      feedbackEn: 'He can speak German well. Modal verb in position 2, infinitive at the end.',
      grammar: 'Modalverben', grammarLink: '../grammatik/modalverben/',
      lesson: 'Lektion 6', lessonLink: '../a1/kursbuch/lektion-06/',
      exerciseLink: '../a1/ubungsbuch/lektion-06/'
    },
    // Q96 (new A2 choice)
    {
      section: 3, q: 18, type: 'choice', level: 'A2',
      sceneEmoji: '🔄',
      sceneAr: 'تتحدث عن ترتيب الكلمات مع الظرف.',
      sceneEn: 'Talking about word order with time adverbs.',
      stemAr: 'اختر الجملة الصحيحة:',
      stemEn: 'Choose the correct sentence:',
      options: ['Ich habe gestern einen Film gesehen.', 'Ich habe einen Film gestern gesehen.', 'Gestern einen Film ich habe gesehen.'],
      answer: 'A',
      feedbackAr: 'ترتيب الزمن (gestern) قبل المفعول (einen Film): Ich habe gestern einen Film gesehen.',
      feedbackEn: 'Time (gestern) before object (einen Film): Ich habe gestern einen Film gesehen.',
      grammar: 'Perfekt', grammarLink: '../grammatik/perfekt/',
      lesson: 'Lektion 8', lessonLink: '../a1/kursbuch/lektion-08/',
      exerciseLink: '../a1/ubungsbuch/lektion-08/'
    },
    // Q97 (new A2 order)
    {
      section: 3, q: 19, type: 'order', level: 'A2',
      sceneEmoji: '🧩',
      sceneAr: 'تكوّن جملة مع trennbares Verb.',
      sceneEn: 'Forming a sentence with a separable verb.',
      stemAr: 'رتب الكلمات:',
      stemEn: 'Order the words:',
      orderWords: ['dich', 'morgen', 'an', 'rufe', 'Ich'],
      answer: ['Ich', 'rufe', 'dich', 'morgen', 'an'],
      feedbackAr: 'anrufen: البادئة (an) تذهب لآخر الجملة: ich rufe dich morgen an.',
      feedbackEn: 'anrufen: the prefix (an) goes to the end: ich rufe dich morgen an.',
      grammar: 'Trennbare Verben', grammarLink: '../grammatik/trennbare-verben/',
      lesson: 'Lektion 5', lessonLink: '../a1/kursbuch/lektion-05/',
      exerciseLink: '../a1/ubungsbuch/lektion-05/'
    },
    // Q98 (new A2 order)
    {
      section: 3, q: 20, type: 'order', level: 'A2',
      sceneEmoji: '🧩',
      sceneAr: 'تكوّن جملة مع es gibt.',
      sceneEn: 'Forming a sentence with "es gibt".',
      stemAr: 'رتب الكلمات:',
      stemEn: 'Order the words:',
      orderWords: ['einen', 'Supermarkt', 'es', 'gibt', 'Hier'],
      answer: ['Hier', 'gibt', 'es', 'einen', 'Supermarkt'],
      feedbackAr: '"es gibt" دائماً مع Akkusativ. Hier gibt es einen Supermarkt.',
      feedbackEn: '"es gibt" always with Accusative. There is a supermarket here.',
      grammar: 'Akkusativ', grammarLink: '../grammatik/akkusativ/',
      lesson: 'Lektion 9', lessonLink: '../a1/kursbuch/lektion-09/',
      exerciseLink: '../a1/ubungsbuch/lektion-09/'
    },

    // ── B1 Level (8) ──

    // Q99 (new B1 order)
    {
      section: 3, q: 21, type: 'order', level: 'B1',
      sceneEmoji: '🧩',
      sceneAr: 'تكوّن جملة مركبة مع obwohl.',
      sceneEn: 'Forming a complex sentence with "obwohl".',
      stemAr: 'رتب الكلمات:',
      stemEn: 'Order the words:',
      orderWords: ['spazieren', 'gehe', 'ich', 'regnet', 'es', 'Obwohl'],
      answer: ['Obwohl', 'es', 'regnet', 'gehe', 'ich', 'spazieren'],
      feedbackAr: 'Obwohl ترسل فعلها للنهاية (regnet). الجملة الرئيسية تبدأ بالفعل (V1): gehe ich spazieren.',
      feedbackEn: 'Obwohl sends its verb to the end. The main clause starts with the verb: gehe ich spazieren.',
      grammar: 'Nebensätze', grammarLink: '../grammatik/nebensatze/',
      lesson: 'B1 Lektion 1', lessonLink: '../b1/kursbuch/lektion-01/',
      exerciseLink: '../b1/ubungsbuch/lektion-01/'
    },
    // Q100 (new B1 order)
    {
      section: 3, q: 22, type: 'order', level: 'B1',
      sceneEmoji: '🧩',
      sceneAr: 'تكوّن جملة مع Konjunktiv 2.',
      sceneEn: 'Forming a sentence with Konjunktiv 2.',
      stemAr: 'رتب الكلمات:',
      stemEn: 'Order the words:',
      orderWords: ['gern', 'nach', 'Japan', 'reisen', 'würde', 'Ich'],
      answer: ['Ich', 'würde', 'gern', 'nach', 'Japan', 'reisen'],
      feedbackAr: 'Ich würde gern nach Japan reisen. "würde" في الموضع 2، المصدر (reisen) في آخر الجملة.',
      feedbackEn: 'I would like to travel to Japan. "würde" in position 2, infinitive (reisen) at the end.',
      grammar: 'Konjunktiv 2', grammarLink: '../grammatik/konjunktiv-2/',
      lesson: 'B1 Lektion 1', lessonLink: '../b1/kursbuch/lektion-01/',
      exerciseLink: '../b1/ubungsbuch/lektion-01/'
    },
    // Q101 (new B1 choice)
    {
      section: 3, q: 23, type: 'choice', level: 'B1',
      sceneEmoji: '📐',
      sceneAr: 'تتعلّم ترتيب الكلمات مع الجمل الثانوية.',
      sceneEn: 'Learning word order with subordinate clauses.',
      stemAr: 'اختر الجملة الصحيحة:',
      stemEn: 'Choose the correct sentence:',
      options: ['Ich weiß nicht, ob er kommt.', 'Ich weiß nicht, ob er kommt?', 'Ich weiß nicht, er kommt ob.'],
      answer: 'A',
      feedbackAr: 'الجملة الثانوية مع "ob": الفعل في النهاية. Ich weiß nicht, ob er kommt.',
      feedbackEn: 'Subordinate clause with "ob": verb at the end. I don\'t know if he is coming.',
      grammar: 'Nebensätze', grammarLink: '../grammatik/nebensatze/',
      lesson: 'B1 Lektion 2', lessonLink: '../b1/kursbuch/lektion-02/',
      exerciseLink: '../b1/ubungsbuch/lektion-02/'
    },
    // Q102 (new B1 order)
    {
      section: 3, q: 24, type: 'order', level: 'B1',
      sceneEmoji: '🧩',
      sceneAr: 'تكوّن جملة مع Passiv.',
      sceneEn: 'Forming a passive sentence.',
      stemAr: 'رتب الكلمات:',
      stemEn: 'Order the words:',
      orderWords: ['geschrieben', 'wird', 'Brief', 'Der'],
      answer: ['Der', 'Brief', 'wird', 'geschrieben'],
      feedbackAr: 'Passiv: werden + Partizip II. Der Brief wird geschrieben = الرسالة تُكتب.',
      feedbackEn: 'Passive: werden + Partizip II. Der Brief wird geschrieben = The letter is being written.',
      grammar: 'Passiv', grammarLink: '../grammatik/passiv/',
      lesson: 'B1 Lektion 4', lessonLink: '../b1/kursbuch/lektion-04/',
      exerciseLink: '../b1/ubungsbuch/lektion-04/'
    },
    // Q103 (new B1 choice)
    {
      section: 3, q: 25, type: 'choice', level: 'B1',
      sceneEmoji: '🔀',
      sceneAr: 'تتعلّم موضع "nicht" في الجملة.',
      sceneEn: 'Learning the position of "nicht".',
      stemAr: 'اختر الجملة الصحيحة:',
      stemEn: 'Choose the correct sentence:',
      options: ['Er kommt heute nicht.', 'Er kommt nicht heute.', 'Er nicht kommt heute.'],
      answer: 'A',
      feedbackAr: '"nicht" في نهاية الجملة عادةً: Er kommt heute nicht. أو قبل الجزء المنفي: Er kommt nicht morgen, sondern heute.',
      feedbackEn: '"nicht" usually at the end: Er kommt heute nicht. Or before the negated part.',
      grammar: 'Negation', grammarLink: '../grammatik/negation/',
      lesson: 'A2 Lektion 2', lessonLink: '../a2/kursbuch/lektion-02/',
      exerciseLink: '../a2/ubungsbuch/lektion-02/'
    },
    // Q104 (new B1 order)
    {
      section: 3, q: 26, type: 'order', level: 'B1',
      sceneEmoji: '🧩',
      sceneAr: 'تكوّن جملة مع Relativsatz.',
      sceneEn: 'Forming a relative clause sentence.',
      stemAr: 'رتب الكلمات:',
      stemEn: 'Order the words:',
      orderWords: ['Arzt', 'ist', 'hier', 'wohnt', 'der', 'Mann', 'Der'],
      answer: ['Der', 'Mann', 'der', 'hier', 'wohnt', 'ist', 'Arzt'],
      feedbackAr: 'Relativsatz: الفعل (wohnt) في آخر الجملة الثانوية. Der Mann, der hier wohnt, ist Arzt.',
      feedbackEn: 'Relative clause: the verb (wohnt) goes to the end of the subordinate clause.',
      grammar: 'Relativsätze', grammarLink: '../grammatik/relativsatze/',
      lesson: 'A2 Lektion 8', lessonLink: '../a2/kursbuch/lektion-08/',
      exerciseLink: '../a2/ubungsbuch/lektion-08/'
    },
    // Q105 (new B1 order)
    {
      section: 3, q: 27, type: 'order', level: 'B1',
      sceneEmoji: '🧩',
      sceneAr: 'تكوّن جملة مع bevor.',
      sceneEn: 'Forming a sentence with "bevor".',
      stemAr: 'رتب الكلمات:',
      stemEn: 'Order the words:',
      orderWords: ['ich', 'mir', 'die', 'Zähne', 'putze', 'Bevor', 'ich', 'schlafe'],
      answer: ['Bevor', 'ich', 'schlafe', 'putze', 'ich', 'mir', 'die', 'Zähne'],
      feedbackAr: 'Bevor ich schlafe, putze ich mir die Zähne. قبل أن أنام، أنظف أسناني.',
      feedbackEn: 'Before I sleep, I brush my teeth. "bevor" sends its verb to the end.',
      grammar: 'Temporalsätze', grammarLink: null,
      lesson: 'B1 Lektion 5', lessonLink: '../b1/kursbuch/lektion-05/',
      exerciseLink: '../b1/ubungsbuch/lektion-05/'
    },
    // Q106 (new B1 choice)
    {
      section: 3, q: 28, type: 'choice', level: 'B1',
      sceneEmoji: '📐',
      sceneAr: 'تتعلّم ترتيب الكلمات مع الجمل الشرطية.',
      sceneEn: 'Learning word order with conditional clauses.',
      stemAr: 'اختر الجملة الصحيحة:',
      stemEn: 'Choose the correct sentence:',
      options: ['Wenn ich Zeit hätte, würde ich verreisen.', 'Wenn ich hätte Zeit, ich würde verreisen.', 'Ich würde verreisen, ich wenn Zeit hätte.'],
      answer: 'A',
      feedbackAr: 'الجملة الشرطية: Wenn + الفعل في النهاية. الجملة الرئيسية: würde في البداية.',
      feedbackEn: 'Conditional clause: Wenn + verb at the end. Main clause: würde at the start.',
      grammar: 'Konjunktiv 2', grammarLink: '../grammatik/konjunktiv-2/',
      lesson: 'B1 Lektion 1', lessonLink: '../b1/kursbuch/lektion-01/',
      exerciseLink: '../b1/ubungsbuch/lektion-01/'
    },

    // ───────────────────────────────────────────────────────────
    // SECTION 4: Kommunikation — التواصل (28 سؤالاً)
    // ───────────────────────────────────────────────────────────

    // ── A1 Level (12) ──

    // Q107 (existing A1)
    {
      section: 4, q: 1, type: 'text', level: 'A1',
      sceneEmoji: '👋',
      sceneAr: 'تلتقي بصديق جديد في الشارع.',
      sceneEn: 'Meeting a new friend on the street.',
      stemAr: 'أكمل: Wie geht es dir? — Mir ___',
      stemEn: 'Complete: How are you? — I\'m ___',
      answer: "geht's gut",
      acceptedAnswers: ["geht's gut", "geht es gut"],
      feedbackAr: 'الرد النموذجي: "Mir geht\'s gut." أو "Mir geht es gut." = أنا بخير.',
      feedbackEn: 'Typical reply: "Mir geht\'s gut." or "Mir geht es gut." = I\'m fine.',
      grammar: null, grammarLink: null,
      lesson: 'Lektion 1', lessonLink: '../a1/kursbuch/lektion-01/',
      exerciseLink: '../a1/ubungsbuch/lektion-01/'
    },
    // Q108 (existing A1)
    {
      section: 4, q: 2, type: 'choice', level: 'A1',
      sceneEmoji: '🛒',
      sceneAr: 'في السوبرماركت تسأل عن السعر.',
      sceneEn: 'At the supermarket asking about the price.',
      stemAr: 'Wie viel ___ das?',
      stemEn: 'How much ___ that?',
      options: ['kostet', 'kosten', 'kostest'],
      answer: 'A',
      feedbackAr: '"das" = مفرد غائب → kostet. Wie viel kostet das? = كم ثمن هذا؟',
      feedbackEn: '"das" = third person singular → kostet. Wie viel kostet das? = How much is that?',
      grammar: 'Verbkonjugation', grammarLink: '../grammatik/verbkonjugation/',
      lesson: 'Lektion 16', lessonLink: '../a1/kursbuch/lektion-16/',
      exerciseLink: '../a1/ubungsbuch/lektion-16/'
    },
    // Q109 (new A1)
    {
      section: 4, q: 3, type: 'choice', level: 'A1',
      sceneEmoji: '🤝',
      sceneAr: 'تتعرف على شخص جديد.',
      sceneEn: 'Meeting a new person.',
      stemAr: '"___ heißt du?" — "Ich heiße Omar."',
      stemEn: '"___ are you called?" — "My name is Omar."',
      options: ['Wie', 'Was', 'Wer'],
      answer: 'A',
      feedbackAr: 'Wie heißt du? = ما اسمك؟ (حرفياً: كيف تُدعى؟). Wie + فعل للسؤال عن الاسم.',
      feedbackEn: 'Wie heißt du? = What is your name? (literally: How are you called?).',
      grammar: null, grammarLink: null,
      lesson: 'Lektion 1', lessonLink: '../a1/kursbuch/lektion-01/',
      exerciseLink: '../a1/ubungsbuch/lektion-01/'
    },
    // Q110 (new A1)
    {
      section: 4, q: 4, type: 'choice', level: 'A1',
      sceneEmoji: '🙏',
      sceneAr: 'تطلب شيئاً بأدب.',
      sceneEn: 'Politely asking for something.',
      stemAr: '___ Kaffee, bitte.',
      stemEn: '___ coffee, please.',
      options: ['Einen', 'Ein', 'Eine'],
      answer: 'A',
      feedbackAr: 'der Kaffee (مذكر) → Akkusativ → Einen Kaffee, bitte. هذا هو الطلب الصحيح في المقهى.',
      feedbackEn: 'der Kaffee (masculine) → Accusative → Einen Kaffee, bitte. This is the correct way to order.',
      grammar: 'Akkusativ', grammarLink: '../grammatik/akkusativ/',
      lesson: 'Lektion 16', lessonLink: '../a1/kursbuch/lektion-16/',
      exerciseLink: '../a1/ubungsbuch/lektion-16/'
    },
    // Q111 (new A1)
    {
      section: 4, q: 5, type: 'choice', level: 'A1',
      sceneEmoji: '📱',
      sceneAr: 'ترد على الهاتف.',
      sceneEn: 'Answering the phone.',
      stemAr: 'عند الرد على الهاتف تقول:',
      stemEn: 'When answering the phone you say:',
      options: ['Hallo, hier ist Ahmed', 'Ich bin Ahmed', 'Das ist Ahmed'],
      answer: 'A',
      feedbackAr: '"Hallo, hier ist ..." = ألو، هذا ... (الرد المهذب على الهاتف).',
      feedbackEn: '"Hallo, hier ist ..." = Hello, this is ... (polite phone answering).',
      grammar: null, grammarLink: null,
      lesson: 'Lektion 5', lessonLink: '../a1/kursbuch/lektion-05/',
      exerciseLink: '../a1/ubungsbuch/lektion-05/'
    },
    // Q112 (new A1)
    {
      section: 4, q: 6, type: 'choice', level: 'A1',
      sceneEmoji: '🕐',
      sceneAr: 'تسأل عن الوقت.',
      sceneEn: 'Asking about the time.',
      stemAr: 'للسؤال عن الوقت تقول:',
      stemEn: 'To ask about the time you say:',
      options: ['Wie spät ist es?', 'Wie viel Uhr?', 'Was ist die Uhr?'],
      answer: 'A',
      feedbackAr: '"Wie spät ist es?" = كم الساعة؟ هذا هو السؤال الصحيح عن الوقت.',
      feedbackEn: '"Wie spät ist es?" = What time is it? This is the correct way to ask for the time.',
      grammar: null, grammarLink: null,
      lesson: 'Lektion 6', lessonLink: '../a1/kursbuch/lektion-06/',
      exerciseLink: '../a1/ubungsbuch/lektion-06/'
    },
    // Q113 (new A1 text)
    {
      section: 4, q: 7, type: 'text', level: 'A1',
      sceneEmoji: '👋',
      sceneAr: 'تودع صديقاً.',
      sceneEn: 'Saying goodbye to a friend.',
      stemAr: 'أكمل: Tschüss! ___ dich!',
      stemEn: 'Complete: Bye! See you!',
      answer: 'Auf Wiedersehen',
      acceptedAnswers: ['Auf Wiedersehen', 'Wiedersehen', 'Auf Wiederhören'],
      feedbackAr: '"Auf Wiedersehen" = إلى اللقاء. "Tschüss" غير رسمي، "Auf Wiedersehen" رسمي.',
      feedbackEn: '"Auf Wiedersehen" = Goodbye. "Tschüss" is informal, "Auf Wiedersehen" is formal.',
      grammar: null, grammarLink: null,
      lesson: 'Lektion 1', lessonLink: '../a1/kursbuch/lektion-01/',
      exerciseLink: '../a1/ubungsbuch/lektion-01/'
    },
    // Q114 (new A1)
    {
      section: 4, q: 8, type: 'choice', level: 'A1',
      sceneEmoji: '🎂',
      sceneAr: 'تهنئ صديقاً بعيد ميلاده.',
      sceneEn: 'Congratulating a friend on their birthday.',
      stemAr: '"___ Geburtstag!"',
      stemEn: '"Happy Birthday!"',
      options: ['Alles Gute zum', 'Herzlichen Glückwunsch', 'Frohe'],
      answer: 'A',
      feedbackAr: '"Alles Gute zum Geburtstag!" = كل عام وأنت بخير! التهنئة الأكثر شيوعاً.',
      feedbackEn: '"Alles Gute zum Geburtstag!" = Happy Birthday! The most common greeting.',
      grammar: null, grammarLink: null,
      lesson: 'Lektion 6', lessonLink: '../a1/kursbuch/lektion-06/',
      exerciseLink: '../a1/ubungsbuch/lektion-06/'
    },
    // Q115 (new A1)
    {
      section: 4, q: 9, type: 'choice', level: 'A1',
      sceneEmoji: '🚻',
      sceneAr: 'تحتاج لاستخدام الحمام.',
      sceneEn: 'You need to use the restroom.',
      stemAr: 'لطلب الإذن بالذهاب إلى الحمام:',
      stemEn: 'To ask permission to go to the restroom:',
      options: ['Darf ich auf die Toilette?', 'Wo ist die Toilette?', 'Ich will Toilette.'],
      answer: 'A',
      feedbackAr: '"Darf ich auf die Toilette?" = هل يمكنني الذهاب إلى الحمام؟ (طلب مؤدب).',
      feedbackEn: '"Darf ich auf die Toilette?" = May I go to the restroom? (polite request).',
      grammar: 'Modalverben', grammarLink: '../grammatik/modalverben/',
      lesson: 'Lektion 5', lessonLink: '../a1/kursbuch/lektion-05/',
      exerciseLink: '../a1/ubungsbuch/lektion-05/'
    },
    // Q116 (new A1)
    {
      section: 4, q: 10, type: 'choice', level: 'A1',
      sceneEmoji: '👍',
      sceneAr: 'تعبر عن الموافقة.',
      sceneEn: 'Expressing agreement.',
      stemAr: '"Ich mag Deutsch." — "Ich ___. "',
      stemEn: '"I like German." — "Me ___."',
      options: ['auch', 'nicht', 'sehr'],
      answer: 'A',
      feedbackAr: '"Ich auch" = أنا أيضاً. "ich nicht" = أنا لا. "Ich mag Deutsch." — "Ich auch."',
      feedbackEn: '"Ich auch" = Me too. "Ich mag Deutsch." — "Ich auch."',
      grammar: null, grammarLink: null,
      lesson: 'Lektion 5', lessonLink: '../a1/kursbuch/lektion-05/',
      exerciseLink: '../a1/ubungsbuch/lektion-05/'
    },
    // Q117 (new A1)
    {
      section: 4, q: 11, type: 'choice', level: 'A1',
      sceneEmoji: '❌',
      sceneAr: 'تعتذر لشخص.',
      sceneEn: 'Apologizing to someone.',
      stemAr: 'عندما تدوس على قدم شخص تقول:',
      stemEn: 'When you step on someone\'s foot you say:',
      options: ['Entschuldigung', 'Bitte schön', 'Kein Problem'],
      answer: 'A',
      feedbackAr: '"Entschuldigung" = آسف/عذراً. "Bitte schön" = عفواً. "Kein Problem" = لا مشكلة.',
      feedbackEn: '"Entschuldigung" = Sorry/Excuse me. "Bitte schön" = You\'re welcome. "Kein Problem" = No problem.',
      grammar: null, grammarLink: null,
      lesson: 'Lektion 1', lessonLink: '../a1/kursbuch/lektion-01/',
      exerciseLink: '../a1/ubungsbuch/lektion-01/'
    },
    // Q118 (new A1)
    {
      section: 4, q: 12, type: 'choice', level: 'A1',
      sceneEmoji: '💵',
      sceneAr: 'تطلب الدفع في مطعم.',
      sceneEn: 'Asking to pay at a restaurant.',
      stemAr: 'لطلب الفاتورة في المطعم تقول:',
      stemEn: 'To ask for the bill at the restaurant you say:',
      options: ['Zahlen, bitte', 'Essen, bitte', 'Gehen, bitte'],
      answer: 'A',
      feedbackAr: '"Zahlen, bitte!" = الدفع من فضلك! أو "Die Rechnung, bitte!" = الفاتورة من فضلك!',
      feedbackEn: '"Zahlen, bitte!" = Pay, please! Or "Die Rechnung, bitte!" = The bill, please!',
      grammar: null, grammarLink: null,
      lesson: 'Lektion 16', lessonLink: '../a1/kursbuch/lektion-16/',
      exerciseLink: '../a1/ubungsbuch/lektion-16/'
    },

    // ── A2 Level (8) ──

    // Q119 (existing A2)
    {
      section: 4, q: 13, type: 'choice', level: 'A2',
      sceneEmoji: '🏥',
      sceneAr: 'في عيادة الطبيب تصف ألمك.',
      sceneEn: 'At the doctor\'s office describing your pain.',
      stemAr: 'Ich ___ Schmerzen.',
      stemEn: 'I ___ pain.',
      options: ['habe', 'hat', 'bin'],
      answer: 'A',
      feedbackAr: 'Schmerzen haben = أعاني من آلام. Ich habe Schmerzen = أنا أتألم.',
      feedbackEn: 'Schmerzen haben = to have pain. Ich habe Schmerzen = I am in pain.',
      grammar: 'Modalverben', grammarLink: '../grammatik/modalverben/',
      lesson: 'Lektion 13', lessonLink: '../a1/kursbuch/lektion-13/',
      exerciseLink: '../a1/ubungsbuch/lektion-13/'
    },
    // Q120 (existing A2)
    {
      section: 4, q: 14, type: 'choice', level: 'A2',
      sceneEmoji: '🚇',
      sceneAr: 'تسأل عن اتجاه محطة المترو.',
      sceneEn: 'Asking for directions to the subway station.',
      stemAr: 'Wo ___ die U-Bahn?',
      stemEn: 'Where ___ the subway?',
      options: ['ist', 'liegt', 'gibt'],
      answer: 'A',
      feedbackAr: '"Wo ist...?" = أين...؟ (السؤال عن مكان). Wo ist die U-Bahn? = أين المترو؟',
      feedbackEn: '"Wo ist...?" = Where is...? Wo ist die U-Bahn? = Where is the subway?',
      grammar: 'Wechselpräpositionen', grammarLink: '../grammatik/wechselprapositionen/',
      lesson: 'Lektion 15', lessonLink: '../a1/kursbuch/lektion-15/',
      exerciseLink: '../a1/ubungsbuch/lektion-15/'
    },
    // Q121 (existing A2)
    {
      section: 4, q: 15, type: 'choice', level: 'A2',
      sceneEmoji: '💡',
      sceneAr: 'تعبر عن رأيك في تعلّم الألمانية.',
      sceneEn: 'Expressing your opinion about learning German.',
      stemAr: 'Ich finde, ___ Deutsch lernen wichtig ist.',
      stemEn: 'I think ___ learning German is important.',
      options: ['dass', 'weil', 'wenn'],
      answer: 'A',
      feedbackAr: 'بعد "Ich finde" تأتي "dass" لتربط الجملة الثانوية. Ich finde, dass... = أعتقد أن...',
      feedbackEn: 'After "Ich finde", use "dass" to introduce the subordinate clause. Ich finde, dass... = I think that...',
      grammar: 'Nebensätze', grammarLink: '../grammatik/nebensatze/',
      lesson: 'A2 Lektion 3', lessonLink: '../a2/kursbuch/lektion-03/',
      exerciseLink: '../a2/ubungsbuch/lektion-03/'
    },
    // Q122 (new A2)
    {
      section: 4, q: 16, type: 'choice', level: 'A2',
      sceneEmoji: '🏨',
      sceneAr: 'في الفندق تسأل عن السعر.',
      sceneEn: 'At the hotel asking about the price.',
      stemAr: 'Was ___ ein Zimmer pro Nacht?',
      stemEn: 'How ___ is a room per night?',
      options: ['kostet', 'kosten', 'kost'],
      answer: 'A',
      feedbackAr: 'Was kostet ein Zimmer? = كم يكلف غرفة؟ ein Zimmer (مفرد محايد) → kostet.',
      feedbackEn: 'What does a room cost? ein Zimmer (neuter singular) → kostet.',
      grammar: 'Verbkonjugation', grammarLink: '../grammatik/verbkonjugation/',
      lesson: 'Lektion 16', lessonLink: '../a1/kursbuch/lektion-16/',
      exerciseLink: '../a1/ubungsbuch/lektion-16/'
    },
    // Q123 (new A2)
    {
      section: 4, q: 17, type: 'choice', level: 'A2',
      sceneEmoji: '📅',
      sceneAr: 'تحجز موعداً.',
      sceneEn: 'Making an appointment.',
      stemAr: 'Ich möchte einen ___ machen.',
      stemEn: 'I would like to make an ___ .',
      options: ['Termin', 'Termine', 'Termins'],
      answer: 'A',
      feedbackAr: 'einen Termin machen = حجز موعد. der Termin (مذكر) → Akkusativ: einen Termin.',
      feedbackEn: 'einen Termin machen = to make an appointment. der Termin (masculine) → Accusative: einen Termin.',
      grammar: 'Akkusativ', grammarLink: '../grammatik/akkusativ/',
      lesson: 'A2 Lektion 4', lessonLink: '../a2/kursbuch/lektion-04/',
      exerciseLink: '../a2/ubungsbuch/lektion-04/'
    },
    // Q124 (new A2)
    {
      section: 4, q: 18, type: 'choice', level: 'A2',
      sceneEmoji: '🏪',
      sceneAr: 'في السوبرماركت تبحث عن شيء.',
      sceneEn: 'At the supermarket looking for something.',
      stemAr: '___ gibt es die Milch?',
      stemEn: 'Where ___ the milk? (Where is the milk located?)',
      options: ['Wo', 'Was', 'Wie'],
      answer: 'A',
      feedbackAr: '"Wo gibt es...?" = أين يوجد...؟ Wo gibt es die Milch? = أين يوجد الحليب؟',
      feedbackEn: '"Wo gibt es...?" = Where is there...? Wo gibt es die Milch? = Where is the milk?',
      grammar: null, grammarLink: null,
      lesson: 'Lektion 16', lessonLink: '../a1/kursbuch/lektion-16/',
      exerciseLink: '../a1/ubungsbuch/lektion-16/'
    },
    // Q125 (new A2 text)
    {
      section: 4, q: 19, type: 'text', level: 'A2',
      sceneEmoji: '📞',
      sceneAr: 'تتصل بطبيب.',
      sceneEn: 'Calling a doctor.',
      stemAr: 'أكمل: Kann ich einen ___ machen?',
      stemEn: 'Complete: Can I make an ___ ?',
      answer: 'Termin',
      acceptedAnswers: ['Termin', 'Arzttermin', 'Termin beim Arzt'],
      feedbackAr: 'einen Termin machen = حجز موعد. يمكنك أيضاً "einen Arzttermin" = موعد طبيب.',
      feedbackEn: 'einen Termin machen = to make an appointment. Also "einen Arzttermin" = a doctor\'s appointment.',
      grammar: null, grammarLink: null,
      lesson: 'A2 Lektion 4', lessonLink: '../a2/kursbuch/lektion-04/',
      exerciseLink: '../a2/ubungsbuch/lektion-04/'
    },
    // Q126 (new A2)
    {
      section: 4, q: 20, type: 'choice', level: 'A2',
      sceneEmoji: '💊',
      sceneAr: 'في الصيدلية تطلب دواء.',
      sceneEn: 'At the pharmacy asking for medicine.',
      stemAr: 'Ich brauche ___ gegen Kopfschmerzen.',
      stemEn: 'I need something for headaches.',
      options: ['etwas', 'einen', 'eine'],
      answer: 'A',
      feedbackAr: '"etwas" = شيء/شيئاً. Ich brauche etwas gegen Kopfschmerzen = أحتاج شيئاً للصداع.',
      feedbackEn: '"etwas" = something. I need something for headaches.',
      grammar: null, grammarLink: null,
      lesson: 'Lektion 13', lessonLink: '../a1/kursbuch/lektion-13/',
      exerciseLink: '../a1/ubungsbuch/lektion-13/'
    },

    // ── B1 Level (8) ──

    // Q127 (new B1)
    {
      section: 4, q: 21, type: 'choice', level: 'B1',
      sceneEmoji: '💼',
      sceneAr: 'في مقابلة عمل.',
      sceneEn: 'At a job interview.',
      stemAr: 'Ich habe ___ in Betriebswirtschaft.',
      stemEn: 'I have a degree in business administration.',
      options: ['einen Abschluss', 'eine Abschluss', 'ein Abschluss'],
      answer: 'A',
      feedbackAr: 'der Abschluss (مذكر) → Akkusativ → einen Abschluss. einen Abschluss haben = حاصل على شهادة.',
      feedbackEn: 'der Abschluss (masculine) → Accusative → einen Abschluss. einen Abschluss haben = to have a degree.',
      grammar: 'Akkusativ', grammarLink: '../grammatik/akkusativ/',
      lesson: 'B1 Lektion 2', lessonLink: '../b1/kursbuch/lektion-02/',
      exerciseLink: '../b1/ubungsbuch/lektion-02/'
    },
    // Q128 (new B1)
    {
      section: 4, q: 22, type: 'choice', level: 'B1',
      sceneEmoji: '💬',
      sceneAr: 'تعبر عن رأيك بطريقة مهذبة.',
      sceneEn: 'Expressing your opinion politely.',
      stemAr: 'Ich bin der ___, dass wir mehr üben sollten.',
      stemEn: 'I am of the ___ that we should practise more.',
      options: ['Meinung', 'Meinungen', 'Meinunger'],
      answer: 'A',
      feedbackAr: 'Ich bin der Meinung, dass... = أنا برأي أن... der Meinung sein = يعتقد.',
      feedbackEn: 'Ich bin der Meinung, dass... = I am of the opinion that... der Meinung sein = to believe.',
      grammar: 'Nebensätze', grammarLink: '../grammatik/nebensatze/',
      lesson: 'B1 Lektion 1', lessonLink: '../b1/kursbuch/lektion-01/',
      exerciseLink: '../b1/ubungsbuch/lektion-01/'
    },
    // Q129 (new B1)
    {
      section: 4, q: 23, type: 'choice', level: 'B1',
      sceneEmoji: '📧',
      sceneAr: 'تكتب بريداً رسمياً.',
      sceneEn: 'Writing a formal email.',
      stemAr: '___ Sie sich bitte bis morgen.',
      stemEn: 'Please respond by tomorrow.',
      options: ['Melden', 'Melde', 'Gemeldet'],
      answer: 'A',
      feedbackAr: 'صيغة الأمر الرسمي: Melden Sie sich = راسلونا/أبلغونا. "sich melden" = يتصل/يراسل.',
      feedbackEn: 'Formal imperative: Melden Sie sich = Contact us/Respond. "sich melden" = to get in touch.',
      grammar: 'Imperativ', grammarLink: '../grammatik/imperativ/',
      lesson: 'B1 Lektion 3', lessonLink: '../b1/kursbuch/lektion-03/',
      exerciseLink: '../b1/ubungsbuch/lektion-03/'
    },
    // Q130 (new B1)
    {
      section: 4, q: 24, type: 'choice', level: 'B1',
      sceneEmoji: '🤝',
      sceneAr: 'تتفاوض على شيء.',
      sceneEn: 'Negotiating something.',
      stemAr: 'Ich ___ Ihnen einen Rabatt von 10% an.',
      stemEn: 'I offer you a 10% discount.',
      options: ['biete', 'biet', 'bieten'],
      answer: 'A',
      feedbackAr: 'anbieten = يعرض (فعل منفصل). Ich biete Ihnen ... an = أقدم لكم...',
      feedbackEn: 'anbieten = to offer (separable verb). Ich biete Ihnen ... an = I offer you...',
      grammar: 'Trennbare Verben', grammarLink: '../grammatik/trennbare-verben/',
      lesson: 'B1 Lektion 3', lessonLink: '../b1/kursbuch/lektion-03/',
      exerciseLink: '../b1/ubungsbuch/lektion-03/'
    },
    // Q131 (new B1)
    {
      section: 4, q: 25, type: 'choice', level: 'B1',
      sceneEmoji: '🗣️',
      sceneAr: 'تعبر عن موافقتك بشيء.',
      sceneEn: 'Expressing your agreement.',
      stemAr: 'Ich ___ dir völlig zu.',
      stemEn: 'I completely agree with you.',
      options: ['stimme', 'stimmt', 'stimm'],
      answer: 'A',
      feedbackAr: 'zustimmen = يوافق (فعل منفصل). Ich stimme dir zu = أوافقك الرأي.',
      feedbackEn: 'zustimmen = to agree (separable verb). Ich stimme dir zu = I agree with you.',
      grammar: 'Trennbare Verben', grammarLink: '../grammatik/trennbare-verben/',
      lesson: 'B1 Lektion 5', lessonLink: '../b1/kursbuch/lektion-05/',
      exerciseLink: '../b1/ubungsbuch/lektion-05/'
    },
    // Q132 (new B1 text)
    {
      section: 4, q: 26, type: 'text', level: 'B1',
      sceneEmoji: '📄',
      sceneAr: 'تطلب معلومات إضافية.',
      sceneEn: 'Requesting additional information.',
      stemAr: 'أكمل: Ich wäre ___ , wenn Sie mir mehr Informationen schicken könnten.',
      stemEn: 'Complete: I would be ___ if you could send me more information.',
      answer: 'dankbar',
      acceptedAnswers: ['dankbar', 'sehr dankbar'],
      feedbackAr: 'Ich wäre dankbar = أكون ممتناً/شاكراً. صيغة مهذبة لطلب شيء.',
      feedbackEn: 'Ich wäre dankbar = I would be grateful. A polite way to request something.',
      grammar: 'Konjunktiv 2', grammarLink: '../grammatik/konjunktiv-2/',
      lesson: 'B1 Lektion 2', lessonLink: '../b1/kursbuch/lektion-02/',
      exerciseLink: '../b1/ubungsbuch/lektion-02/'
    },
    // Q133 (new B1)
    {
      section: 4, q: 27, type: 'choice', level: 'B1',
      sceneEmoji: '📝',
      sceneAr: 'تعبر عن رغبتك في شيء.',
      sceneEn: 'Expressing your desire for something.',
      stemAr: 'Ich würde ___ , wenn ich Zeit hätte.',
      stemEn: 'I would ___ if I had time.',
      options: ['mitmachen', 'machte mit', 'mache mit'],
      answer: 'A',
      feedbackAr: 'Konjunktiv 2: würde + Infinitiv. Ich würde mitmachen = كنت سأشارك.',
      feedbackEn: 'Konjunktiv 2: würde + Infinitive. Ich würde mitmachen = I would participate.',
      grammar: 'Konjunktiv 2', grammarLink: '../grammatik/konjunktiv-2/',
      lesson: 'B1 Lektion 1', lessonLink: '../b1/kursbuch/lektion-01/',
      exerciseLink: '../b1/ubungsbuch/lektion-01/'
    },
    // Q134 (new B1)
    {
      section: 4, q: 28, type: 'choice', level: 'B1',
      sceneEmoji: '✈️',
      sceneAr: 'تتحدث عن تجارب سفر.',
      sceneEn: 'Talking about travel experiences.',
      stemAr: 'Ich ___ schon viele Länder besucht.',
      stemEn: 'I have visited many countries.',
      options: ['bin', 'habe', 'werde'],
      answer: 'B',
      feedbackAr: 'besuchen (يزور) في Perfekt: haben + besucht. Ich habe besucht = زرت.',
      feedbackEn: 'besuchen (to visit) in Perfekt: haben + besucht. Ich habe besucht = I have visited.',
      grammar: 'Perfekt', grammarLink: '../grammatik/perfekt/',
      lesson: 'A2 Lektion 5', lessonLink: '../a2/kursbuch/lektion-05/',
      exerciseLink: '../a2/ubungsbuch/lektion-05/'
    },

    // ───────────────────────────────────────────────────────────
    // SECTION 5: Hörverstehen — الفهم السمعي (36 سؤالاً)
    // ───────────────────────────────────────────────────────────

    // ── A1 Level (12) ──

    // Q135 (new A1)
    {
      section: 5, q: 1, type: 'choice', level: 'A1',
      sceneEmoji: '🛎️',
      sceneAr: 'تسمع صوت الجرس في الفندق.',
      sceneEn: 'You hear the bell at the hotel.',
      audio: true,
      audioText: 'Guten Abend',
      stemAr: 'استمع واختر التحية المناسبة للمساء:',
      stemEn: 'Listen and choose the appropriate evening greeting:',
      options: ['Guten Abend', 'Gute Nacht', 'Guten Morgen'],
      answer: 'A',
      feedbackAr: '"Guten Abend" = مساء الخير (تُقال من حوالي 18:00). "Gute Nacht" لوقت النوم.',
      feedbackEn: '"Guten Abend" = Good evening (said from around 6 PM). "Gute Nacht" = Good night.',
      grammar: null, grammarLink: null,
      lesson: 'Lektion 1', lessonLink: '../a1/kursbuch/lektion-01/',
      exerciseLink: '../a1/ubungsbuch/lektion-01/'
    },
    // Q136 (new A1)
    {
      section: 5, q: 2, type: 'choice', level: 'A1',
      sceneEmoji: '🔢',
      sceneAr: 'تسمع شخصاً يقول أرقام هاتفه.',
      sceneEn: 'You hear someone saying their phone number.',
      audio: true,
      audioText: 'Meine Telefonnummer ist null, vier, sieben, zwei, drei, acht, eins, fünf',
      stemAr: 'استمع واختر الرقم الذي سمعته:',
      stemEn: 'Listen and choose the number you heard:',
      options: ['0472 3815', '0472 3814', '0462 3815'],
      answer: 'A',
      feedbackAr: 'الرقم هو 0472 3815. تدرب على الأرقام الألمانية — النطق مختلف عن الإنجليزية.',
      feedbackEn: 'The number is 0472 3815. Practise German numbers — pronunciation differs from English.',
      grammar: null, grammarLink: null,
      lesson: 'Lektion 2', lessonLink: '../a1/kursbuch/lektion-02/',
      exerciseLink: '../a1/ubungsbuch/lektion-02/'
    },
    // Q137 (new A1)
    {
      section: 5, q: 3, type: 'choice', level: 'A1',
      sceneEmoji: '🔤',
      sceneAr: 'تسمع شخصاً يتهجى اسمه.',
      sceneEn: 'You hear someone spelling their name.',
      audio: true,
      audioText: 'Ich heiße Müller. M – Ü – L – L – E – R',
      stemAr: 'استمع واختر الاسم الصحيح:',
      stemEn: 'Listen and choose the correct name:',
      options: ['Müller', 'Miller', 'Möller'],
      answer: 'A',
      feedbackAr: 'الاسم هو Müller (مولر). تعلم Buchstabieren (تهجئة الحروف) مهم جداً.',
      feedbackEn: 'The name is Müller. Learning to spell (Buchstabieren) is very important.',
      grammar: null, grammarLink: null,
      lesson: 'Lektion 1', lessonLink: '../a1/kursbuch/lektion-01/',
      exerciseLink: '../a1/ubungsbuch/lektion-01/'
    },
    // Q138 (new A1)
    {
      section: 5, q: 4, type: 'choice', level: 'A1',
      sceneEmoji: '🏪',
      sceneAr: 'في المتجر، تسمع البائعة تقول السعر.',
      sceneEn: 'At the store, you hear the salesperson say the price.',
      audio: true,
      audioText: 'Das kostet fünf Euro neunundneunzig.',
      stemAr: 'استمع واختر السعر الصحيح:',
      stemEn: 'Listen and choose the correct price:',
      options: ['5,99 €', '5,49 €', '6,99 €'],
      answer: 'A',
      feedbackAr: 'fünf Euro neunundneunzig = 5,99 يورو. fünf = 5, neunundneunzig = 99.',
      feedbackEn: 'fünf Euro neunundneunzig = 5.99 euros. fünf = 5, neunundneunzig = 99.',
      grammar: null, grammarLink: null,
      lesson: 'Lektion 16', lessonLink: '../a1/kursbuch/lektion-16/',
      exerciseLink: '../a1/ubungsbuch/lektion-16/'
    },
    // Q139 (new A1)
    {
      section: 5, q: 5, type: 'choice', level: 'A1',
      sceneEmoji: '🧑‍🏫',
      sceneAr: 'المعلم يقول أمراً بسيطاً في الصف.',
      sceneEn: 'The teacher gives a simple command in class.',
      audio: true,
      audioText: 'Hören Sie bitte zu.',
      stemAr: 'استمع واختر ما قاله المعلم:',
      stemEn: 'Listen and choose what the teacher said:',
      options: ['Hören Sie bitte zu', 'Lesen Sie bitte', 'Schreiben Sie bitte'],
      answer: 'A',
      feedbackAr: '"Hören Sie bitte zu" = استمعوا من فضلكم. zuhören = يستمع (فعل منفصل).',
      feedbackEn: '"Hören Sie bitte zu" = Please listen. zuhören = to listen.',
      grammar: null, grammarLink: null,
      lesson: 'Lektion 1', lessonLink: '../a1/kursbuch/lektion-01/',
      exerciseLink: '../a1/ubungsbuch/lektion-01/'
    },
    // Q140 (new A1)
    {
      section: 5, q: 6, type: 'choice', level: 'A1',
      sceneEmoji: '🎨',
      sceneAr: 'تسمع وصفاً للألوان.',
      sceneEn: 'You hear a description of colours.',
      audio: true,
      audioText: 'Der Himmel ist blau.',
      stemAr: 'استمع واختر اللون الصحيح:',
      stemEn: 'Listen and choose the correct colour:',
      options: ['blau', 'grün', 'grau'],
      answer: 'A',
      feedbackAr: 'der Himmel ist blau = السماء زرقاء. اللون هو blau (أزرق).',
      feedbackEn: 'der Himmel ist blau = the sky is blue. The colour is blue.',
      grammar: null, grammarLink: null,
      lesson: 'Lektion 2', lessonLink: '../a1/kursbuch/lektion-02/',
      exerciseLink: '../a1/ubungsbuch/lektion-02/'
    },
    // Q141 (new A1)
    {
      section: 5, q: 7, type: 'choice', level: 'A1',
      sceneEmoji: '👋',
      sceneAr: 'تسمع شخصاً يقول مرحباً.',
      sceneEn: 'You hear someone saying hello.',
      audio: true,
      audioText: 'Hallo, wie geht es dir?',
      stemAr: 'استمع واختر الرد المناسب:',
      stemEn: 'Listen and choose the appropriate response:',
      options: ['Mir geht es gut, danke', 'Tschüss', 'Auf Wiederhören'],
      answer: 'A',
      feedbackAr: 'الرد على "Wie geht es dir?" هو "Mir geht es gut, danke" أو "Gut, danke".',
      feedbackEn: 'The reply to "Wie geht es dir?" is "Mir geht es gut, danke" or "Gut, danke".',
      grammar: null, grammarLink: null,
      lesson: 'Lektion 1', lessonLink: '../a1/kursbuch/lektion-01/',
      exerciseLink: '../a1/ubungsbuch/lektion-01/'
    },
    // Q142 (new A1)
    {
      section: 5, q: 8, type: 'choice', level: 'A1',
      sceneEmoji: '🚶',
      sceneAr: 'تسمع تعليمات بسيطة في الشارع.',
      sceneEn: 'You hear simple street directions.',
      audio: true,
      audioText: 'Gehen Sie geradeaus und dann rechts.',
      stemAr: 'استمع واختر الاتجاه الصحيح:',
      stemEn: 'Listen and choose the correct direction:',
      options: ['geradeaus und rechts', 'geradeaus und links', 'zurück und rechts'],
      answer: 'A',
      feedbackAr: 'gehen Sie geradeaus = اذهبوا باستقامة. dann rechts = ثم يميناً.',
      feedbackEn: 'go straight ahead = gehen Sie geradeaus. then right = dann rechts.',
      grammar: null, grammarLink: null,
      lesson: 'Lektion 15', lessonLink: '../a1/kursbuch/lektion-15/',
      exerciseLink: '../a1/ubungsbuch/lektion-15/'
    },
    // Q143 (new A1)
    {
      section: 5, q: 9, type: 'choice', level: 'A1',
      sceneEmoji: '🧍',
      sceneAr: 'تسمع وصفاً لشخص.',
      sceneEn: 'You hear a description of a person.',
      audio: true,
      audioText: 'Er ist groß und hat braune Haare.',
      stemAr: 'استمع واختر الوصف الصحيح:',
      stemEn: 'Listen and choose the correct description:',
      options: ['groß und braune Haare', 'klein und blonde Haare', 'groß und schwarze Haare'],
      answer: 'A',
      feedbackAr: 'er ist groß = هو طويل. braune Haare = شعر بني. groß ≠ klein (قصير).',
      feedbackEn: 'he is tall = er ist groß. brown hair = braune Haare. groß ≠ klein (short).',
      grammar: null, grammarLink: null,
      lesson: 'Lektion 11', lessonLink: '../a1/kursbuch/lektion-11/',
      exerciseLink: '../a1/ubungsbuch/lektion-11/'
    },
    // Q144 (new A1)
    {
      section: 5, q: 10, type: 'choice', level: 'A1',
      sceneEmoji: '☀️',
      sceneAr: 'تسمع نشرة الطقس.',
      sceneEn: 'You hear a weather report.',
      audio: true,
      audioText: 'Heute scheint die Sonne.',
      stemAr: 'استمع واختر الجملة الصحيحة:',
      stemEn: 'Listen and choose the correct statement:',
      options: ['Heute scheint die Sonne', 'Heute regnet es', 'Heute schneit es'],
      answer: 'A',
      feedbackAr: 'die Sonne scheint = الشمس مشرقة. scheinen = يشرق/يسطع.',
      feedbackEn: 'the sun is shining = die Sonne scheint. scheinen = to shine.',
      grammar: null, grammarLink: null,
      lesson: 'A1 Lektion 2', lessonLink: '../a1/kursbuch/lektion-02/',
      exerciseLink: '../a1/ubungsbuch/lektion-02/'
    },
    // Q145 (new A1)
    {
      section: 5, q: 11, type: 'choice', level: 'A1',
      sceneEmoji: '🐕',
      sceneAr: 'تسمع جملة عن حيوان.',
      sceneEn: 'You hear a sentence about an animal.',
      audio: true,
      audioText: 'Ich habe einen Hund. Er ist klein und weiß.',
      stemAr: 'استمع واختر الحيوان الذي يتحدث عنه:',
      stemEn: 'Listen and choose which animal is being talked about:',
      options: ['Hund', 'Katze', 'Vogel'],
      answer: 'A',
      feedbackAr: 'der Hund = الكلب. klein und weiß = صغير وأبيض.',
      feedbackEn: 'der Hund = the dog. klein und weiß = small and white.',
      grammar: null, grammarLink: null,
      lesson: 'Lektion 7', lessonLink: '../a1/kursbuch/lektion-07/',
      exerciseLink: '../a1/ubungsbuch/lektion-07/'
    },
    // Q146 (new A1)
    {
      section: 5, q: 12, type: 'choice', level: 'A1',
      sceneEmoji: '⏰',
      sceneAr: 'تسمع شخصاً يقول الوقت.',
      sceneEn: 'You hear someone telling the time.',
      audio: true,
      audioText: 'Es ist drei Uhr.',
      stemAr: 'استمع واختر الوقت الصحيح:',
      stemEn: 'Listen and choose the correct time:',
      options: ['3:00', '13:00', '15:00'],
      answer: 'A',
      feedbackAr: 'Es ist drei Uhr = الساعة الثالثة. 3:00 = drei Uhr. 15:00 = fünfzehn Uhr.',
      feedbackEn: 'It is three o\'clock. 3:00 = drei Uhr. 15:00 = fünfzehn Uhr.',
      grammar: null, grammarLink: null,
      lesson: 'Lektion 6', lessonLink: '../a1/kursbuch/lektion-06/',
      exerciseLink: '../a1/ubungsbuch/lektion-06/'
    },

    // ── A2 Level (12) ──

    // Q147 (existing A2)
    {
      section: 5, q: 13, type: 'choice', level: 'A2',
      sceneEmoji: '🚄',
      sceneAr: 'في محطة القطار الرئيسية في برلين. تسمع إعلاناً عن تغيير رصيف القطار.',
      sceneEn: 'At Berlin\'s main train station. You hear an announcement about a platform change.',
      audio: true,
      audioText: 'Achtung, der Zug nach München fährt heute ab Gleis 7 statt Gleis 3.',
      stemAr: 'استمع ثم أجب: من أي رصيف يغادر القطار المتجه إلى ميونخ؟',
      stemEn: 'Listen and answer: From which platform does the train to Munich depart?',
      options: ['Gleis 3', 'Gleis 5', 'Gleis 7'],
      answer: 'C',
      feedbackAr: 'الإعلان قال "ab Gleis 7 statt Gleis 3" — القطار يغادر من الرصيف 7 بدلاً من 3.',
      feedbackEn: 'The announcement said "ab Gleis 7 statt Gleis 3" — the train departs from platform 7 instead of 3.',
      grammar: null, grammarLink: null,
      lesson: 'A2 Lektion 11', lessonLink: '../a2/kursbuch/lektion-11/',
      exerciseLink: '../a2/ubungsbuch/lektion-11/'
    },
    // Q148 (existing A2)
    {
      section: 5, q: 14, type: 'choice', level: 'A2',
      sceneEmoji: '✈️',
      sceneAr: 'في مطار فرانكفورت. تسمع إعلاناً عن تأخر رحلة.',
      sceneEn: 'At Frankfurt airport. You hear an announcement about a flight delay.',
      audio: true,
      audioText: 'Flug LH 432 nach Frankfurt hat 45 Minuten Verspätung. Neue Abflugzeit ist 15:30.',
      stemAr: 'استمع ثم أجب: متى موعد الإقلاع الجديد؟',
      stemEn: 'Listen and answer: What is the new departure time?',
      options: ['14:45', '15:30', '16:15'],
      answer: 'B',
      feedbackAr: 'الإعلان قال "Neue Abflugzeit ist 15:30" — موعد الإقلاع الجديد هو 15:30.',
      feedbackEn: 'The announcement said "Neue Abflugzeit ist 15:30" — the new departure time is 15:30.',
      grammar: null, grammarLink: null,
      lesson: 'A2 Lektion 5', lessonLink: '../a2/kursbuch/lektion-05/',
      exerciseLink: '../a2/ubungsbuch/lektion-05/'
    },
    // Q149 (existing A2)
    {
      section: 5, q: 15, type: 'choice', level: 'A2',
      sceneEmoji: '🌤️',
      sceneAr: 'تستمع إلى نشرة الطقس على الراديو.',
      sceneEn: 'Listening to the weather forecast on the radio.',
      audio: true,
      audioText: 'Morgen wird es in Berlin bis zu 25 Grad warm. Es bleibt meist sonnig.',
      stemAr: 'استمع ثم أجب: كيف سيكون الطقس غداً في برلين؟',
      stemEn: 'Listen and answer: What will the weather be like tomorrow in Berlin?',
      options: ['Regen und kühl', 'Sonnig und 25°C', 'Bewölkt und 10°C'],
      answer: 'B',
      feedbackAr: 'النشرة قالت "bis zu 25 Grad warm" و "meist sonnig" — مشمس وحتى 25 درجة.',
      feedbackEn: 'The forecast said "bis zu 25 Grad warm" and "meist sonnig" — sunny and up to 25°C.',
      grammar: null, grammarLink: null,
      lesson: 'A1 Lektion 2', lessonLink: '../a1/kursbuch/lektion-02/',
      exerciseLink: '../a1/ubungsbuch/lektion-02/'
    },
    // Q150 (existing A2)
    {
      section: 5, q: 16, type: 'choice', level: 'A2',
      sceneEmoji: '🛍️',
      sceneAr: 'في متجر للملابس. تسمع البائعة تخبرك بالأسعار.',
      sceneEn: 'At a clothing store. You hear the salesperson telling you the prices.',
      audio: true,
      audioText: 'Das T-Shirt kostet 19,99 Euro. Die Jeans kostet 49,90 Euro.',
      stemAr: 'استمع ثم أجب: كم سعر التيشيرت؟',
      stemEn: 'Listen and answer: How much does the T-shirt cost?',
      options: ['19,99 €', '49,90 €', '39,99 €'],
      answer: 'A',
      feedbackAr: 'الجملة قالت "Das T-Shirt kostet 19,99 Euro" — التيشيرت ثمنه 19,99 يورو.',
      feedbackEn: 'The sentence said "Das T-Shirt kostet 19,99 Euro" — the T-shirt costs 19,99 €.',
      grammar: null, grammarLink: null,
      lesson: 'A1 Lektion 16', lessonLink: '../a1/kursbuch/lektion-16/',
      exerciseLink: '../a1/ubungsbuch/lektion-16/'
    },
    // Q151 (existing A2)
    {
      section: 5, q: 17, type: 'choice', level: 'A2',
      sceneEmoji: '🏫',
      sceneAr: 'في صف اللغة الألمانية. المدرس يعطي تعليمات.',
      sceneEn: 'In German class. The teacher gives instructions.',
      audio: true,
      audioText: 'Öffnen Sie das Buch auf Seite 45. Lesen Sie den Text und beantworten Sie die Fragen.',
      stemAr: 'استمع ثم أجب: ماذا يطلب المدرس أولاً؟',
      stemEn: 'Listen and answer: What does the teacher ask first?',
      options: ['Das Buch schließen', 'Das Buch auf Seite 45 öffnen', 'Nach Hause gehen'],
      answer: 'B',
      feedbackAr: 'المدرس قال "Öffnen Sie das Buch auf Seite 45" — افتحوا الكتاب على الصفحة 45.',
      feedbackEn: 'The teacher said "Öffnen Sie das Buch auf Seite 45" — open the book to page 45.',
      grammar: null, grammarLink: null,
      lesson: 'A1 Lektion 1', lessonLink: '../a1/kursbuch/lektion-01/',
      exerciseLink: '../a1/ubungsbuch/lektion-01/'
    },
    // Q152 (existing A2)
    {
      section: 5, q: 18, type: 'choice', level: 'A2',
      sceneEmoji: '🏛️',
      sceneAr: 'تتصل بالمتحف لتعرف أوقات العمل.',
      sceneEn: 'Calling the museum to find out opening hours.',
      audio: true,
      audioText: 'Das Museum ist von Dienstag bis Sonntag von 10 bis 18 Uhr geöffnet. Montag ist Ruhetag.',
      stemAr: 'استمع ثم أجب: في أي يوم يكون المتحف مغلقاً؟',
      stemEn: 'Listen and answer: On which day is the museum closed?',
      options: ['Dienstag', 'Montag', 'Sonntag'],
      answer: 'B',
      feedbackAr: 'المتحف مغلق يوم الاثنين — "Montag ist Ruhetag". Dienstag=الثلاثاء، Sonntag=الأحد.',
      feedbackEn: 'The museum is closed on Monday — "Montag ist Ruhetag".',
      grammar: null, grammarLink: null,
      lesson: 'A2 Lektion 5', lessonLink: '../a2/kursbuch/lektion-05/',
      exerciseLink: '../a2/ubungsbuch/lektion-05/'
    },
    // Q153 (new A2)
    {
      section: 5, q: 19, type: 'choice', level: 'A2',
      sceneEmoji: '🏥',
      sceneAr: 'تسمع رسالة من عيادة طبيب.',
      sceneEn: 'You hear a message from a doctor\'s office.',
      audio: true,
      audioText: 'Die Praxis ist von 8 bis 12 Uhr und von 14 bis 17 Uhr geöffnet.',
      stemAr: 'استمع: متى تغلق العيادة في فترة الظهر؟',
      stemEn: 'Listen: When does the practice close for lunch?',
      options: ['Um 12 Uhr', 'Um 14 Uhr', 'Um 17 Uhr'],
      answer: 'A',
      feedbackAr: '"von 8 bis 12 Uhr" = من 8 إلى 12. تغلق الساعة 12 وتفتح الساعة 2.',
      feedbackEn: '"from 8 to 12" = von 8 bis 12 Uhr. It closes at 12 and reopens at 2.',
      grammar: null, grammarLink: null,
      lesson: 'A2 Lektion 4', lessonLink: '../a2/kursbuch/lektion-04/',
      exerciseLink: '../a2/ubungsbuch/lektion-04/'
    },
    // Q154 (new A2)
    {
      section: 5, q: 20, type: 'choice', level: 'A2',
      sceneEmoji: '🎭',
      sceneAr: 'تسمع إعلاناً عن حدث ثقافي.',
      sceneEn: 'You hear an announcement about a cultural event.',
      audio: true,
      audioText: 'Das Konzert beginnt um 20 Uhr im Stadtpark. Der Eintritt ist frei.',
      stemAr: 'استمع: كم سعر تذكرة الدخول؟',
      stemEn: 'Listen: How much is the entrance fee?',
      options: ['Frei (kostenlos)', '10 Euro', '20 Euro'],
      answer: 'A',
      feedbackAr: '"Der Eintritt ist frei" = الدخول مجاني. frei = حر/مجاني.',
      feedbackEn: '"Der Eintritt ist frei" = entry/admission is free.',
      grammar: null, grammarLink: null,
      lesson: 'A2 Lektion 10', lessonLink: '../a2/kursbuch/lektion-10/',
      exerciseLink: '../a2/ubungsbuch/lektion-10/'
    },
    // Q155 (new A2)
    {
      section: 5, q: 21, type: 'choice', level: 'A2',
      sceneEmoji: '🏨',
      sceneAr: 'تتصل بفندق لحجز غرفة.',
      sceneEn: 'You call a hotel to book a room.',
      audio: true,
      audioText: 'Ein Einzelzimmer kostet 75 Euro pro Nacht mit Frühstück.',
      stemAr: 'استمع: كم سعر الغرفة المفردة مع الفطور؟',
      stemEn: 'Listen: How much is a single room with breakfast?',
      options: ['75 €', '65 €', '85 €'],
      answer: 'A',
      feedbackAr: '"Ein Einzelzimmer kostet 75 Euro pro Nacht mit Frühstück" = 75 يورو.',
      feedbackEn: '"A single room costs 75 euros per night with breakfast."',
      grammar: null, grammarLink: null,
      lesson: 'A2 Lektion 11', lessonLink: '../a2/kursbuch/lektion-11/',
      exerciseLink: '../a2/ubungsbuch/lektion-11/'
    },
    // Q156 (new A2)
    {
      section: 5, q: 22, type: 'choice', level: 'A2',
      sceneEmoji: '📢',
      sceneAr: 'تسمع إعلاناً في متجر كبير.',
      sceneEn: 'You hear an announcement in a department store.',
      audio: true,
      audioText: 'Liebe Kunden, unser Geschäft schließt in 30 Minuten um 20 Uhr.',
      stemAr: 'استمع: متى يغلق المتجر؟',
      stemEn: 'Listen: When does the store close?',
      options: ['Um 20 Uhr', 'Um 19:30', 'Um 20:30'],
      answer: 'A',
      feedbackAr: '"unser Geschäft schließt ... um 20 Uhr" = متجرنا يغلق الساعة 8 مساءً.',
      feedbackEn: '"our store closes ... at 8 PM" = unser Geschäft schließt ... um 20 Uhr.',
      grammar: null, grammarLink: null,
      lesson: 'Lektion 16', lessonLink: '../a1/kursbuch/lektion-16/',
      exerciseLink: '../a1/ubungsbuch/lektion-16/'
    },
    // Q157 (new A2)
    {
      section: 5, q: 23, type: 'choice', level: 'A2',
      sceneEmoji: '🍽️',
      sceneAr: 'تسمع محادثة في مطعم.',
      sceneEn: 'You hear a conversation at a restaurant.',
      audio: true,
      audioText: 'Ich hätte gern die Tomatensuppe als Vorspeise und dann das Schnitzel.',
      stemAr: 'استمع: ماذا يطلب الشخص كطبق رئيسي؟',
      stemEn: 'Listen: What does the person order as a main course?',
      options: ['Schnitzel', 'Tomatensuppe', 'Salat'],
      answer: 'A',
      feedbackAr: '"als Vorspeise" = كمقبلات (Tomatensuppe). الطبق الرئيسي هو Schnitzel.',
      feedbackEn: '"als Vorspeise" = as a starter (tomato soup). The main course is Schnitzel.',
      grammar: null, grammarLink: null,
      lesson: 'Lektion 16', lessonLink: '../a1/kursbuch/lektion-16/',
      exerciseLink: '../a1/ubungsbuch/lektion-16/'
    },
    // Q158 (new A2)
    {
      section: 5, q: 24, type: 'choice', level: 'A2',
      sceneEmoji: '🚌',
      sceneAr: 'تسمع إعلاناً في محطة الباص.',
      sceneEn: 'You hear an announcement at a bus stop.',
      audio: true,
      audioText: 'Der Bus Linie 42 nach Hauptbahnhof kommt in 5 Minuten.',
      stemAr: 'استمع: أي باص سيصل وأين يذهب؟',
      stemEn: 'Listen: Which bus arrives and where does it go?',
      options: ['Linie 42 zum Hauptbahnhof', 'Linie 24 zum Hauptbahnhof', 'Linie 42 zum Flughafen'],
      answer: 'A',
      feedbackAr: 'Der Bus Linie 42 nach Hauptbahnhof = الباص رقم 42 إلى المحطة الرئيسية.',
      feedbackEn: 'Bus line 42 to the main station = Der Bus Linie 42 nach Hauptbahnhof.',
      grammar: null, grammarLink: null,
      lesson: 'A2 Lektion 11', lessonLink: '../a2/kursbuch/lektion-11/',
      exerciseLink: '../a2/ubungsbuch/lektion-11/'
    },

    // ── B1 Level (12) ──

    // Q159 (new B1)
    {
      section: 5, q: 25, type: 'choice', level: 'B1',
      sceneEmoji: '🎙️',
      sceneAr: 'تستمع لمقابلة إذاعية مع كاتب.',
      sceneEn: 'Listening to a radio interview with a writer.',
      audio: true,
      audioText: 'Mein neuer Roman handelt von der Suche nach Identität in der modernen Gesellschaft.',
      stemAr: 'استمع: عن ماذا يتحدث الكتاب الجديد؟',
      stemEn: 'Listen: What is the new book about?',
      options: ['Die Suche nach Identität', 'Die Geschichte Berlins', 'Eine Liebesgeschichte'],
      answer: 'A',
      feedbackAr: '"... handelt von der Suche nach Identität" = يتحدث عن البحث عن الهوية.',
      feedbackEn: '"... is about the search for identity" = ... handelt von der Suche nach Identität.',
      grammar: null, grammarLink: null,
      lesson: 'B1 Lektion 5', lessonLink: '../b1/kursbuch/lektion-05/',
      exerciseLink: '../b1/ubungsbuch/lektion-05/'
    },
    // Q160 (new B1)
    {
      section: 5, q: 26, type: 'choice', level: 'B1',
      sceneEmoji: '📰',
      sceneAr: 'تستمع لنشرة أخبار.',
      sceneEn: 'Listening to news broadcast.',
      audio: true,
      audioText: 'Die Arbeitslosigkeit ist im letzten Quartal um 2 Prozent gesunken.',
      stemAr: 'استمع: ماذا حدث لنسبة البطالة؟',
      stemEn: 'Listen: What happened to the unemployment rate?',
      options: ['Sie ist gesunken', 'Sie ist gestiegen', 'Sie ist gleich geblieben'],
      answer: 'A',
      feedbackAr: '"die Arbeitslosigkeit ist ... gesunken" = البطالة انخفضت. sinken = ينخفض، steigen = يرتفع.',
      feedbackEn: '"unemployment has dropped" = die Arbeitslosigkeit ist gesunken. sinken = to drop, steigen = to rise.',
      grammar: null, grammarLink: null,
      lesson: 'B1 Lektion 3', lessonLink: '../b1/kursbuch/lektion-03/',
      exerciseLink: '../b1/ubungsbuch/lektion-03/'
    },
    // Q161 (new B1)
    {
      section: 5, q: 27, type: 'choice', level: 'B1',
      sceneEmoji: '📞',
      sceneAr: 'تسمع رسالة على البريد الصوتي من مدير البنك.',
      sceneEn: 'You hear a voicemail from a bank manager.',
      audio: true,
      audioText: 'Wir möchten Sie über die Änderung unserer Allgemeinen Geschäftsbedingungen informieren.',
      stemAr: 'استمع: لماذا يتصل مدير البنك؟',
      stemEn: 'Listen: Why does the bank manager call?',
      options: ['Über eine Änderung der AGB', 'Über eine neue Kreditkarte', 'Über einen Termin'],
      answer: 'A',
      feedbackAr: '"über die Änderung unserer AGB informieren" = لإبلاغكم بتغيير الشروط العامة.',
      feedbackEn: '"to inform you about a change in our general terms" = über die Änderung der AGB informieren.',
      grammar: null, grammarLink: null,
      lesson: 'B1 Lektion 4', lessonLink: '../b1/kursbuch/lektion-04/',
      exerciseLink: '../b1/ubungsbuch/lektion-04/'
    },
    // Q162 (new B1)
    {
      section: 5, q: 28, type: 'choice', level: 'B1',
      sceneEmoji: '🏫',
      sceneAr: 'تستمع لإعلان عن دورة لغة.',
      sceneEn: 'Listening to an announcement about a language course.',
      audio: true,
      audioText: 'Unser Intensivkurs Deutsch B1 findet jeden Montag und Mittwoch von 18 bis 20 Uhr statt.',
      stemAr: 'استمع: متى يعقد كورس الألماني؟',
      stemEn: 'Listen: When does the German course take place?',
      options: ['Montag und Mittwoch, 18-20 Uhr', 'Dienstag und Donnerstag, 18-20 Uhr', 'Nur am Samstag'],
      answer: 'A',
      feedbackAr: '"jeden Montag und Mittwoch von 18 bis 20 Uhr" = كل إثنين وأربعاء 6-8 مساءً.',
      feedbackEn: '"every Monday and Wednesday from 6 to 8 PM" = jeden Montag und Mittwoch von 18 bis 20 Uhr.',
      grammar: null, grammarLink: null,
      lesson: 'B1 Lektion 1', lessonLink: '../b1/kursbuch/lektion-01/',
      exerciseLink: '../b1/ubungsbuch/lektion-01/'
    },
    // Q163 (new B1)
    {
      section: 5, q: 29, type: 'choice', level: 'B1',
      sceneEmoji: '🌍',
      sceneAr: 'تستمع لحديث عن تغير المناخ.',
      sceneEn: 'Listening to a talk about climate change.',
      audio: true,
      audioText: 'Die Durchschnittstemperatur ist in den letzten 50 Jahren um 1,5 Grad Celsius gestiegen.',
      stemAr: 'استمع: كم ارتفعت درجة الحرارة المتوسطة؟',
      stemEn: 'Listen: How much has the average temperature risen?',
      options: ['1,5 Grad', '2 Grad', '1 Grad'],
      answer: 'A',
      feedbackAr: '"um 1,5 Grad Celsius gestiegen" = ارتفعت بمقدار 1.5 درجة مئوية.',
      feedbackEn: '"risen by 1.5 degrees Celsius" = um 1,5 Grad Celsius gestiegen.',
      grammar: null, grammarLink: null,
      lesson: 'B1 Lektion 6', lessonLink: '../b1/kursbuch/lektion-06/',
      exerciseLink: '../b1/ubungsbuch/lektion-06/'
    },
    // Q164 (new B1)
    {
      section: 5, q: 30, type: 'choice', level: 'B1',
      sceneEmoji: '🏢',
      sceneAr: 'تستمع لمقابلة عمل.',
      sceneEn: 'Listening to a job interview.',
      audio: true,
      audioText: 'Ich habe fünf Jahre Berufserfahrung im Bereich Marketing und bin sehr teamfähig.',
      stemAr: 'استمع: كم سنة خبرة لدى المتحدث؟',
      stemEn: 'Listen: How many years of experience does the speaker have?',
      options: ['5 Jahre', '3 Jahre', '10 Jahre'],
      answer: 'A',
      feedbackAr: '"fünf Jahre Berufserfahrung" = 5 سنوات خبرة مهنية. teamfähig = يحب العمل الجماعي.',
      feedbackEn: '"five years of professional experience" = fünf Jahre Berufserfahrung. teamfähig = team-oriented.',
      grammar: null, grammarLink: null,
      lesson: 'B1 Lektion 2', lessonLink: '../b1/kursbuch/lektion-02/',
      exerciseLink: '../b1/ubungsbuch/lektion-02/'
    },
    // Q165 (new B1)
    {
      section: 5, q: 31, type: 'choice', level: 'B1',
      sceneEmoji: '🎧',
      sceneAr: 'تستمع لقصة قصيرة.',
      sceneEn: 'Listening to a short story.',
      audio: true,
      audioText: 'Als Anna gestern aufwachte, schien die Sonne. Sie beschloss, einen Ausflug zu machen.',
      stemAr: 'استمع: ماذا قررت آنا أن تفعل؟',
      stemEn: 'Listen: What did Anna decide to do?',
      options: ['Einen Ausflug machen', 'Zu Hause bleiben', 'Ihre Freundin besuchen'],
      answer: 'A',
      feedbackAr: '"Sie beschloss, einen Ausflug zu machen" = قررت القيام برحلة. Ausflug = رحلة/نزهة.',
      feedbackEn: '"She decided to go on a trip" = Sie beschloss, einen Ausflug zu machen.',
      grammar: null, grammarLink: null,
      lesson: 'A2 Lektion 5', lessonLink: '../a2/kursbuch/lektion-05/',
      exerciseLink: '../a2/ubungsbuch/lektion-05/'
    },
    // Q166 (new B1)
    {
      section: 5, q: 32, type: 'choice', level: 'B1',
      sceneEmoji: '💬',
      sceneAr: 'تستمع لمحادثة بين صديقين عن فيلم.',
      sceneEn: 'Listening to a conversation between two friends about a film.',
      audio: true,
      audioText: 'Der Film war wirklich spannend, aber das Ende habe ich nicht verstanden.',
      stemAr: 'استمع: ماذا قال المتحدث عن الفيلم؟',
      stemEn: 'Listen: What did the speaker say about the film?',
      options: ['Spannend, aber Ende nicht verstanden', 'Langweilig', 'Sehr lustig'],
      answer: 'A',
      feedbackAr: 'spannend = مثير/مشوق. das Ende habe ich nicht verstanden = لم أفهم النهاية.',
      feedbackEn: 'spannend = exciting/thrilling. I didn\'t understand the ending.',
      grammar: null, grammarLink: null,
      lesson: 'B1 Lektion 5', lessonLink: '../b1/kursbuch/lektion-05/',
      exerciseLink: '../b1/ubungsbuch/lektion-05/'
    },
    // Q167 (new B1)
    {
      section: 5, q: 33, type: 'choice', level: 'B1',
      sceneEmoji: '🏪',
      sceneAr: 'تستمع لإعلان في مركز تجاري.',
      sceneEn: 'Listening to an announcement in a shopping centre.',
      audio: true,
      audioText: 'Aufgrund einer Sicherheitsübung bitten wir alle Kunden, das Gebäude zu verlassen.',
      stemAr: 'استمع: لماذا يطلب من الزبائن مغادرة المبنى؟',
      stemEn: 'Listen: Why are customers asked to leave the building?',
      options: ['Wegen einer Sicherheitsübung', 'Wegen Renovierung', 'Wegen Stromausfall'],
      answer: 'A',
      feedbackAr: '"Aufgrund einer Sicherheitsübung" = بسبب تدريب أمني. das Gebäude verlassen = مغادرة المبنى.',
      feedbackEn: '"Due to a safety drill" = Aufgrund einer Sicherheitsübung. leave the building = das Gebäude verlassen.',
      grammar: null, grammarLink: null,
      lesson: 'B1 Lektion 4', lessonLink: '../b1/kursbuch/lektion-04/',
      exerciseLink: '../b1/ubungsbuch/lektion-04/'
    },
    // Q168 (new B1)
    {
      section: 5, q: 34, type: 'choice', level: 'B1',
      sceneEmoji: '🌐',
      sceneAr: 'تستمع لرأي خبير عن العمل عن بُعد.',
      sceneEn: 'Listening to an expert opinion about remote work.',
      audio: true,
      audioText: 'Die Zukunft der Arbeit wird zunehmend flexibel sein. Homeoffice wird zur Norm.',
      stemAr: 'استمع: ماذا يتوقع الخبير؟',
      stemEn: 'Listen: What does the expert predict?',
      options: ['Homeoffice wird zur Norm', 'Alle werden ins Büro zurückkehren', 'Arbeit wird seltener'],
      answer: 'A',
      feedbackAr: '"Homeoffice wird zur Norm" = العمل من المنزل سيصبح القاعدة. zunehmend = بشكل متزايد.',
      feedbackEn: '"Home office will become the norm" = Homeoffice wird zur Norm. zunehmend = increasingly.',
      grammar: null, grammarLink: null,
      lesson: 'B1 Lektion 7', lessonLink: '../b1/kursbuch/lektion-07/',
      exerciseLink: '../b1/ubungsbuch/lektion-07/'
    },
    // Q169 (new B1 — the missing question)
    {
      section: 5, q: 36, type: 'choice', level: 'B1',
      sceneEmoji: '🎓',
      sceneAr: 'تستمع لخطاب تخرج في جامعة.',
      sceneEn: 'Listening to a graduation speech at a university.',
      audio: true,
      audioText: 'Herzlichen Glückwunsch an alle Absolventen. Sie haben Großes erreicht.',
      stemAr: 'استمع: لمن يُوجه الخطاب؟',
      stemEn: 'Listen: Who is the speech addressed to?',
      options: ['An alle Absolventen', 'An alle Professoren', 'An alle Eltern'],
      answer: 'A',
      feedbackAr: '"Herzlichen Glückwunsch an alle Absolventen" = تهانينا لجميع الخريجين.',
      feedbackEn: '"Congratulations to all graduates" = Herzlichen Glückwunsch an alle Absolventen.',
      grammar: null, grammarLink: null,
      lesson: 'B1 Lektion 10', lessonLink: '../b1/kursbuch/lektion-10/',
      exerciseLink: '../b1/ubungsbuch/lektion-10/'
    },
    // Q170 (new B1)
    {
      section: 5, q: 37, type: 'choice', level: 'B1',
      sceneEmoji: '🏥',
      sceneAr: 'تسمع رسالة من شركة التأمين الصحي.',
      sceneEn: 'You hear a message from a health insurance company.',
      audio: true,
      audioText: 'Ihre Krankenversicherungskarte ist abgelaufen. Bitte senden Sie uns neue Unterlagen.',
      stemAr: 'استمع: ماذا حدث لبطاقة التأمين الصحي؟',
      stemEn: 'Listen: What happened to the health insurance card?',
      options: ['Sie ist abgelaufen', 'Sie ist verloren', 'Sie wurde gestohlen'],
      answer: 'A',
      feedbackAr: '"Ihre Krankenversicherungskarte ist abgelaufen" = بطاقة التأمين الصحي الخاصة بك انتهت صلاحيتها.',
      feedbackEn: '"Your health insurance card has expired" = Ihre Krankenversicherungskarte ist abgelaufen.',
      grammar: null, grammarLink: null,
      lesson: 'B1 Lektion 8', lessonLink: '../b1/kursbuch/lektion-08/',
      exerciseLink: '../b1/ubungsbuch/lektion-08/'
    },

    // ───────────────────────────────────────────────────────────
    // SECTION 6: Leseverstehen — الفهم القرائي (30 سؤالاً)
    // ───────────────────────────────────────────────────────────

    // ── A1 Level (11) ──

    // Q171 (new A1)
    {
      section: 6, q: 1, type: 'choice', level: 'A1',
      sceneEmoji: '🏪',
      sceneAr: 'تقرأ لافتة على باب متجر.',
      sceneEn: 'Reading a sign on a shop door.',
      passageTitle: 'Ladenschild',
      passageText: 'Öffnungszeiten: Mo–Fr 9:00–18:00, Sa 9:00–14:00',
      stemAr: 'في أي يوم المتجر مغلق؟',
      stemEn: 'On which day is the shop closed?',
      options: ['Sonntag', 'Samstag', 'Montag'],
      answer: 'A',
      feedbackAr: 'اللافتة تذكر Mo–Fr (الإثنين-الجمعة) و Sa (السبت). الأحد (Sonntag) غير مذكور = مغلق.',
      feedbackEn: 'The sign lists Mo–Fr (Mon-Fri) and Sa (Sat). Sunday is not listed = closed.',
      grammar: null, grammarLink: null,
      lesson: 'Lektion 16', lessonLink: '../a1/kursbuch/lektion-16/',
      exerciseLink: '../a1/ubungsbuch/lektion-16/'
    },
    // Q172 (new A1)
    {
      section: 6, q: 2, type: 'choice', level: 'A1',
      sceneEmoji: '👤',
      sceneAr: 'تقرأ بروفايل شخصي قصير.',
      sceneEn: 'Reading a short personal profile.',
      passageTitle: 'Profil',
      passageText: 'Name: Lisa Müller. Alter: 25. Wohnort: Hamburg. Beruf: Ärztin.',
      stemAr: 'أين تعيش ليزا؟',
      stemEn: 'Where does Lisa live?',
      options: ['Hamburg', 'München', 'Berlin'],
      answer: 'A',
      feedbackAr: '"Wohnort: Hamburg" = مكان السكن: هامبورغ. Wohnort = مكان الإقامة.',
      feedbackEn: '"Wohnort: Hamburg" = Residence: Hamburg. Wohnort = place of residence.',
      grammar: null, grammarLink: null,
      lesson: 'Lektion 3', lessonLink: '../a1/kursbuch/lektion-03/',
      exerciseLink: '../a1/ubungsbuch/lektion-03/'
    },
    // Q173 (new A1)
    {
      section: 6, q: 3, type: 'choice', level: 'A1',
      sceneEmoji: '🍽️',
      sceneAr: 'تقرأ قائمة طعام.',
      sceneEn: 'Reading a menu.',
      passageTitle: 'Speisekarte',
      passageText: 'Pizza Margherita 8,50 € | Spaghetti Carbonara 10,00 € | Salat 6,50 €',
      stemAr: 'كم سعر البيتزا مارغريتا؟',
      stemEn: 'How much is the Pizza Margherita?',
      options: ['8,50 €', '10,00 €', '6,50 €'],
      answer: 'A',
      feedbackAr: 'Pizza Margherita = 8,50 €. billig = رخيص, teuer = غالٍ.',
      feedbackEn: 'Pizza Margherita = 8.50 €. billig = cheap, teuer = expensive.',
      grammar: null, grammarLink: null,
      lesson: 'Lektion 16', lessonLink: '../a1/kursbuch/lektion-16/',
      exerciseLink: '../a1/ubungsbuch/lektion-16/'
    },
    // Q174 (new A1)
    {
      section: 6, q: 4, type: 'choice', level: 'A1',
      sceneEmoji: '📧',
      sceneAr: 'تقرأ بطاقة بريدية قصيرة.',
      sceneEn: 'Reading a short postcard.',
      passageTitle: 'Postkarte',
      passageText: 'Liebe Oma, der Urlaub ist toll! Das Wetter ist schön. Liebe Grüße, deine Anna.',
      stemAr: 'من كتب البطاقة البريدية؟',
      stemEn: 'Who wrote the postcard?',
      options: ['Anna', 'Oma', 'Liebe'],
      answer: 'A',
      feedbackAr: '"Liebe Grüße, deine Anna" = مع خالص التحيات، جدتك آنا. Anna هي الكاتبة.',
      feedbackEn: '"Best regards, your Anna" = Liebe Grüße, deine Anna. Anna is the writer.',
      grammar: null, grammarLink: null,
      lesson: 'Lektion 5', lessonLink: '../a1/kursbuch/lektion-05/',
      exerciseLink: '../a1/ubungsbuch/lektion-05/'
    },
    // Q175 (new A1)
    {
      section: 6, q: 5, type: 'choice', level: 'A1',
      sceneEmoji: '🏠',
      sceneAr: 'تقرأ إعلاناً عن شقة.',
      sceneEn: 'Reading a flat advertisement.',
      passageTitle: 'Wohnungsanzeige',
      passageText: '2-Zimmer-Wohnung in München, 55 m², 750 € warm, ab 1. April frei.',
      stemAr: 'كم تكلفة الشّقة شاملة التدفئة؟',
      stemEn: 'How much is the flat including heating?',
      options: ['750 €', '55 €', '1. April'],
      answer: 'A',
      feedbackAr: '"750 € warm" = 750 يورو شاملة تكاليف التدفئة. "warm" = شامل، "kalt" = بدون تكاليف إضافية.',
      feedbackEn: '"750 € warm" = 750 euros including heating costs. "warm" = inclusive, "kalt" = without extras.',
      grammar: null, grammarLink: null,
      lesson: 'Lektion 9', lessonLink: '../a1/kursbuch/lektion-09/',
      exerciseLink: '../a1/ubungsbuch/lektion-09/'
    },
    // Q176 (new A1)
    {
      section: 6, q: 6, type: 'choice', level: 'A1',
      sceneEmoji: '⚠️',
      sceneAr: 'تقرأ لافتة تحذيرية.',
      sceneEn: 'Reading a warning sign.',
      passageTitle: 'Warnschild',
      passageText: 'Vorsicht! Fußboden nass.',
      stemAr: 'ماذا تحذر اللافتة منه؟',
      stemEn: 'What does the sign warn about?',
      options: ['Der Fußboden ist nass', 'Die Tür ist geschlossen', 'Das Fenster ist offen'],
      answer: 'A',
      feedbackAr: '"Vorsicht! Fußboden nass" = تحذير! الأرضية مبللة. Vorsicht = انتباه/تحذير.',
      feedbackEn: '"Caution! Wet floor" = Vorsicht! Fußboden nass.',
      grammar: null, grammarLink: null,
      lesson: 'Lektion 1', lessonLink: '../a1/kursbuch/lektion-01/',
      exerciseLink: '../a1/ubungsbuch/lektion-01/'
    },
    // Q177 (new A1)
    {
      section: 6, q: 7, type: 'choice', level: 'A1',
      sceneEmoji: '🅿️',
      sceneAr: 'تقرأ لافتة موقف سيارات.',
      sceneEn: 'Reading a parking sign.',
      passageTitle: 'Parkplatzschild',
      passageText: 'Parken nur mit Parkschein. Gebühren: 1 € pro Stunde.',
      stemAr: 'ماذا تحتاج للوقوف هنا؟',
      stemEn: 'What do you need to park here?',
      options: ['Einen Parkschein', 'Einen Ausweis', 'Einen Schlüssel'],
      answer: 'A',
      feedbackAr: '"Parken nur mit Parkschein" = الوقوف فقط بتذكرة وقوف. Parkschein = تذكرة وقوف.',
      feedbackEn: '"Parking only with a parking ticket" = Parken nur mit Parkschein.',
      grammar: null, grammarLink: null,
      lesson: 'Lektion 15', lessonLink: '../a1/kursbuch/lektion-15/',
      exerciseLink: '../a1/ubungsbuch/lektion-15/'
    },
    // Q178 (new A1)
    {
      section: 6, q: 8, type: 'choice', level: 'A1',
      sceneEmoji: '📋',
      sceneAr: 'تقرأ برنامج رحلة مدرسية.',
      sceneEn: 'Reading a school trip itinerary.',
      passageTitle: 'Tagesprogramm',
      passageText: 'Abfahrt: 8:00 Uhr. Ankunft in Berlin: 11:30 Uhr. Mittagessen im Restaurant.',
      stemAr: 'متى موعد الوصول إلى برلين؟',
      stemEn: 'What is the arrival time in Berlin?',
      options: ['11:30 Uhr', '8:00 Uhr', '12:00 Uhr'],
      answer: 'A',
      feedbackAr: '"Ankunft in Berlin: 11:30 Uhr" = الوصول إلى برلين: 11:30. Abfahrt = الانطلاق.',
      feedbackEn: '"Arrival in Berlin: 11:30" = Ankunft in Berlin: 11:30 Uhr. Abfahrt = departure.',
      grammar: null, grammarLink: null,
      lesson: 'Lektion 15', lessonLink: '../a1/kursbuch/lektion-15/',
      exerciseLink: '../a1/ubungsbuch/lektion-15/'
    },
    // Q179 (new A1)
    {
      section: 6, q: 9, type: 'choice', level: 'A1',
      sceneEmoji: '👕',
      sceneAr: 'تقرأ بطاقة سعر على ملابس.',
      sceneEn: 'Reading a price tag on clothing.',
      passageTitle: 'Preisschild',
      passageText: 'T-Shirt: 14,99 €. Jetzt reduziert: 9,99 €.',
      stemAr: 'كم سعر التيشيرت بعد التخفيض؟',
      stemEn: 'How much is the T-shirt after the discount?',
      options: ['9,99 €', '14,99 €', '19,99 €'],
      answer: 'A',
      feedbackAr: '"Jetzt reduziert: 9,99 €" = الآن مخفض: 9.99 يورو. reduziert = مخفض.',
      feedbackEn: '"Now reduced: 9.99 €" = Jetzt reduziert: 9,99 €.',
      grammar: null, grammarLink: null,
      lesson: 'Lektion 16', lessonLink: '../a1/kursbuch/lektion-16/',
      exerciseLink: '../a1/ubungsbuch/lektion-16/'
    },
    // Q180 (new A1)
    {
      section: 6, q: 10, type: 'choice', level: 'A1',
      sceneEmoji: '🏫',
      sceneAr: 'تقرأ إعلاناً عن دورة لغة صيفية.',
      sceneEn: 'Reading a summer language course ad.',
      passageTitle: 'Sprachkurs-Anzeige',
      passageText: 'Deutschkurs A1 im Sommer: 4 Wochen, 200 €. Beginn: 1. Juli.',
      stemAr: 'كم تكلفة الدورة؟',
      stemEn: 'How much does the course cost?',
      options: ['200 €', '4 €', '1 €'],
      answer: 'A',
      feedbackAr: '"200 €" = 200 يورو für 4 Wochen (4 أسابيع).',
      feedbackEn: '"200 €" = 200 euros for 4 weeks.',
      grammar: null, grammarLink: null,
      lesson: 'Lektion 1', lessonLink: '../a1/kursbuch/lektion-01/',
      exerciseLink: '../a1/ubungsbuch/lektion-01/'
    },
    // Q181 (new A1)
    {
      section: 6, q: 11, type: 'choice', level: 'A1',
      sceneEmoji: '🛒',
      sceneAr: 'تقرأ إعلان تخفيضات في متجر.',
      sceneEn: 'Reading a supermarket sale ad.',
      passageTitle: 'Supermarkt-Werbung',
      passageText: 'Äpfel: 1,99 €/kg. Milch: 0,99 €. Brot: 2,49 €.',
      stemAr: 'كم سعر كيلو التفاح؟',
      stemEn: 'How much is a kilo of apples?',
      options: ['1,99 €', '0,99 €', '2,49 €'],
      answer: 'A',
      feedbackAr: '"Äpfel: 1,99 €/kg" = التفاح: 1.99 يورو/كغم. kg = كيلوغرام.',
      feedbackEn: '"Apples: 1.99 €/kg" = Äpfel: 1,99 €/kg.',
      grammar: null, grammarLink: null,
      lesson: 'Lektion 16', lessonLink: '../a1/kursbuch/lektion-16/',
      exerciseLink: '../a1/ubungsbuch/lektion-16/'
    },

    // ── A2 Level (10) ──

    // Q182 (new A2)
    {
      section: 6, q: 12, type: 'choice', level: 'A2',
      sceneEmoji: '📧',
      sceneAr: 'تقرأ بريداً إلكترونياً قصيراً من زميل عمل.',
      sceneEn: 'Reading a short email from a colleague.',
      passageTitle: 'E-Mail',
      passageText: 'Hallo Ahmed, die Besprechung ist heute um 14:00 Uhr im Raum 3. Bitte bring die Unterlagen mit. Viele Grüße, Sabine.',
      stemAr: 'ماذا يجب أن يحضر أحمد إلى الاجتماع؟',
      stemEn: 'What should Ahmed bring to the meeting?',
      options: ['Die Unterlagen', 'Das Essen', 'Den Laptop'],
      answer: 'A',
      feedbackAr: '"Bitte bring die Unterlagen mit" = من فضلك أحضر المستندات. die Unterlagen = المستندات.',
      feedbackEn: '"Please bring the documents" = Bitte bring die Unterlagen mit.',
      grammar: null, grammarLink: null,
      lesson: 'A2 Lektion 3', lessonLink: '../a2/kursbuch/lektion-03/',
      exerciseLink: '../a2/ubungsbuch/lektion-03/'
    },
    // Q183 (new A2)
    {
      section: 6, q: 13, type: 'choice', level: 'A2',
      sceneEmoji: '📰',
      sceneAr: 'تقرأ خبراً قصيراً من جريدة.',
      sceneEn: 'Reading a short news article.',
      passageTitle: 'Zeitungsartikel',
      passageText: 'Der neue Park in der Innenstadt wird am Samstag eröffnet. Der Eintritt ist kostenlos.',
      stemAr: 'متى يُفتتح الحديقة الجديدة؟',
      stemEn: 'When does the new park open?',
      options: ['Am Samstag', 'Am Montag', 'Am Sonntag'],
      answer: 'A',
      feedbackAr: '"wird am Samstag eröffnet" = سيتم افتتاحها يوم السبت. eröffnet = مفتوح/مُفتَتَح.',
      feedbackEn: '"will be opened on Saturday" = wird am Samstag eröffnet.',
      grammar: null, grammarLink: null,
      lesson: 'A2 Lektion 3', lessonLink: '../a2/kursbuch/lektion-03/',
      exerciseLink: '../a2/ubungsbuch/lektion-03/'
    },
    // Q184 (new A2)
    {
      section: 6, q: 14, type: 'choice', level: 'A2',
      sceneEmoji: '📋',
      sceneAr: 'تقرأ تعليمات دواء.',
      sceneEn: 'Reading medication instructions.',
      passageTitle: 'Medikamentenbeilage',
      passageText: 'Nehmen Sie täglich eine Tablette nach dem Essen mit viel Wasser.',
      stemAr: 'متى يجب تناول الدواء؟',
      stemEn: 'When should you take the medication?',
      options: ['Nach dem Essen', 'Vor dem Essen', 'Während des Essens'],
      answer: 'A',
      feedbackAr: '"nach dem Essen" = بعد الأكل. mit viel Wasser = مع الكثير من الماء.',
      feedbackEn: '"after the meal" = nach dem Essen. with plenty of water = mit viel Wasser.',
      grammar: null, grammarLink: null,
      lesson: 'A2 Lektion 4', lessonLink: '../a2/kursbuch/lektion-04/',
      exerciseLink: '../a2/ubungsbuch/lektion-04/'
    },
    // Q185 (new A2)
    {
      section: 6, q: 15, type: 'choice', level: 'A2',
      sceneEmoji: '🏪',
      sceneAr: 'تقرأ سياسة الإرجاع في متجر.',
      sceneEn: 'Reading a store\'s return policy.',
      passageTitle: 'Rückgaberecht',
      passageText: 'Sie können Artikel innerhalb von 14 Tagen gegen Vorlage des Kassenbons zurückgeben.',
      stemAr: 'ماذا تحتاج لإرجاع المنتج؟',
      stemEn: 'What do you need to return an item?',
      options: ['Den Kassenbon', 'Den Ausweis', 'Die Verpackung'],
      answer: 'A',
      feedbackAr: '"gegen Vorlage des Kassenbons" = عند إبراز إيصال الشراء. der Kassenbon = إيصال الدفع.',
      feedbackEn: '"upon presentation of the receipt" = gegen Vorlage des Kassenbons.',
      grammar: null, grammarLink: null,
      lesson: 'A2 Lektion 3', lessonLink: '../a2/kursbuch/lektion-03/',
      exerciseLink: '../a2/ubungsbuch/lektion-03/'
    },
    // Q186 (new A2)
    {
      section: 6, q: 16, type: 'choice', level: 'A2',
      sceneEmoji: '🚄',
      sceneAr: 'تقرأ جدول مواعيد القطارات.',
      sceneEn: 'Reading a train schedule.',
      passageTitle: 'Fahrplan',
      passageText: 'ICE 723 nach München: Abfahrt 9:15 Uhr, Gleis 5. Nächster Halt: Nürnberg.',
      stemAr: 'من أي رصيف يغادر القطار؟',
      stemEn: 'From which platform does the train depart?',
      options: ['Gleis 5', 'Gleis 3', 'Gleis 7'],
      answer: 'A',
      feedbackAr: '"Gleis 5" = الرصيف 5. ICE 723 nach München = القطار فائق السرعة 723 إلى ميونخ.',
      feedbackEn: '"Platform 5" = Gleis 5. ICE 723 to Munich = ICE 723 nach München.',
      grammar: null, grammarLink: null,
      lesson: 'A2 Lektion 11', lessonLink: '../a2/kursbuch/lektion-11/',
      exerciseLink: '../a2/ubungsbuch/lektion-11/'
    },
    // Q187 (new A2)
    {
      section: 6, q: 17, type: 'choice', level: 'A2',
      sceneEmoji: '🏨',
      sceneAr: 'تقرأ وصف فندق على الإنترنت.',
      sceneEn: 'Reading a hotel description online.',
      passageTitle: 'Hotelbeschreibung',
      passageText: 'Das Hotel Central liegt im Stadtzentrum, 5 Minuten vom Bahnhof entfernt. Kostenloses WLAN.',
      stemAr: 'أين يقع الفندق؟',
      stemEn: 'Where is the hotel located?',
      options: ['Im Stadtzentrum', 'Am Flughafen', 'Am Stadtrand'],
      answer: 'A',
      feedbackAr: '"im Stadtzentrum" = في وسط المدينة. 5 Minuten vom Bahnhof entfernt = 5 دقائق من المحطة.',
      feedbackEn: '"in the city centre" = im Stadtzentrum. 5 minutes from the station = 5 Minuten vom Bahnhof entfernt.',
      grammar: null, grammarLink: null,
      lesson: 'A2 Lektion 11', lessonLink: '../a2/kursbuch/lektion-11/',
      exerciseLink: '../a2/ubungsbuch/lektion-11/'
    },
    // Q188 (new A2)
    {
      section: 6, q: 18, type: 'choice', level: 'A2',
      sceneEmoji: '🎬',
      sceneAr: 'تقرأ وصف فيلم.',
      sceneEn: 'Reading a film description.',
      passageTitle: 'Filmbeschreibung',
      passageText: '„Der große Ausbruch" — Spannender Actionfilm ab 16 Jahren. Länge: 125 Minuten.',
      stemAr: 'كم تبلغ مدّة الفيلم؟',
      stemEn: 'How long is the film?',
      options: ['125 Minuten', '16 Minuten', '90 Minuten'],
      answer: 'A',
      feedbackAr: '"Länge: 125 Minuten" = المدة: 125 دقيقة. spannend = مثير، Actionfilm = فيلم أكشن.',
      feedbackEn: '"Length: 125 minutes" = Länge: 125 Minuten. spannend = thrilling.',
      grammar: null, grammarLink: null,
      lesson: 'A2 Lektion 10', lessonLink: '../a2/kursbuch/lektion-10/',
      exerciseLink: '../a2/ubungsbuch/lektion-10/'
    },
    // Q189 (new A2)
    {
      section: 6, q: 19, type: 'choice', level: 'A2',
      sceneEmoji: '🌿',
      sceneAr: 'تقرأ قواعد استخدام الحديقة العامة.',
      sceneEn: 'Reading public park rules.',
      passageTitle: 'Parkregeln',
      passageText: 'Hunde an der Leine führen. Keine Musik mit Lautsprechern. Park schließt um 22 Uhr.',
      stemAr: 'ماذا يجب فعله مع الكلاب في الحديقة؟',
      stemEn: 'What must be done with dogs in the park?',
      options: ['An der Leine führen', 'Zu Hause lassen', 'Frei laufen lassen'],
      answer: 'A',
      feedbackAr: '"Hunde an der Leine führen" = قُد الكلاب بالمقود. die Leine = المقود/الحبل.',
      feedbackEn: '"Walk dogs on a leash" = Hunde an der Leine führen.',
      grammar: null, grammarLink: null,
      lesson: 'A2 Lektion 2', lessonLink: '../a2/kursbuch/lektion-02/',
      exerciseLink: '../a2/ubungsbuch/lektion-02/'
    },
    // Q190 (new A2)
    {
      section: 6, q: 20, type: 'choice', level: 'A2',
      sceneEmoji: '💼',
      sceneAr: 'تقرأ إعلان وظيفة.',
      sceneEn: 'Reading a job advertisement.',
      passageTitle: 'Stellenanzeige',
      passageText: 'Wir suchen eine Verkäuferin (m/w/d) für unseren Modehandel ab 1. Mai.',
      stemAr: 'من تبحث الشركة عنه؟',
      stemEn: 'Who is the company looking for?',
      options: ['Eine Verkäuferin', 'Einen Manager', 'Eine Ärztin'],
      answer: 'A',
      feedbackAr: '"Wir suchen eine Verkäuferin (m/w/d)" = نبحث عن بائعة (ذكر/أنثى/تنوع).',
      feedbackEn: '"We are looking for a salesperson (m/f/d)" = Wir suchen eine Verkäuferin (m/w/d).',
      grammar: null, grammarLink: null,
      lesson: 'A2 Lektion 3', lessonLink: '../a2/kursbuch/lektion-03/',
      exerciseLink: '../a2/ubungsbuch/lektion-03/'
    },
    // Q191 (new A2)
    {
      section: 6, q: 21, type: 'choice', level: 'A2',
      sceneEmoji: '🍎',
      sceneAr: 'تقرأ وصفة طبخ.',
      sceneEn: 'Reading a cooking recipe.',
      passageTitle: 'Rezept',
      passageText: 'Zutaten: 500 g Mehl, 3 Eier, 250 ml Milch, 100 g Zucker. Den Teig 30 Minuten ruhen lassen.',
      stemAr: 'كم دقيقة يجب أن يبقى العجين؟',
      stemEn: 'How many minutes should the dough rest?',
      options: ['30 Minuten', '45 Minuten', '15 Minuten'],
      answer: 'A',
      feedbackAr: '"Den Teig 30 Minuten ruhen lassen" = اترك العجين يرتاح 30 دقيقة. ruhen lassen = يترك ليرتاح.',
      feedbackEn: '"Let the dough rest for 30 minutes" = Den Teig 30 Minuten ruhen lassen.',
      grammar: null, grammarLink: null,
      lesson: 'A2 Lektion 7', lessonLink: '../a2/kursbuch/lektion-07/',
      exerciseLink: '../a2/ubungsbuch/lektion-07/'
    },

    // ── B1 Level (9) ──

    // Q192 (new B1)
    {
      section: 6, q: 22, type: 'choice', level: 'B1',
      sceneEmoji: '📰',
      sceneAr: 'تقرأ مقالاً من جريدة عن البيئة.',
      sceneEn: 'Reading a newspaper article about the environment.',
      passageTitle: 'Zeitungsartikel — Umweltschutz',
      passageText: 'Die Mülltrennung in Deutschland ist vorbildlich. Die Bürger trennen ihren Abfall in Papier, Plastik, Glas und Biomüll. Dadurch können über 60% der Abfälle recycelt werden.',
      stemAr: 'كم نسبة القمامة التي يمكن إعادة تدويرها؟',
      stemEn: 'What percentage of waste can be recycled?',
      options: ['Über 60%', 'Über 30%', 'Über 80%'],
      answer: 'A',
      feedbackAr: '"über 60% der Abfälle können recycelt werden" = أكثر من 60% من النفايات يمكن إعادة تدويرها.',
      feedbackEn: '"over 60% of waste can be recycled" = über 60% der Abfälle können recycelt werden.',
      grammar: null, grammarLink: null,
      lesson: 'B1 Lektion 6', lessonLink: '../b1/kursbuch/lektion-06/',
      exerciseLink: '../b1/ubungsbuch/lektion-06/'
    },
    // Q193 (new B1)
    {
      section: 6, q: 23, type: 'choice', level: 'B1',
      sceneEmoji: '📧',
      sceneAr: 'تقرأ رسالة رسمية من شركة.',
      sceneEn: 'Reading a formal letter from a company.',
      passageTitle: 'Geschäftsbrief',
      passageText: 'Sehr geehrte Damen und Herren, hiermit bestätigen wir den Eingang Ihrer Bewerbung. Wir werden uns in Kürze bei Ihnen melden. Mit freundlichen Grüßen, Personalabteilung.',
      stemAr: 'ماذا تؤكد الشركة في هذه الرسالة؟',
      stemEn: 'What does the company confirm in this letter?',
      options: ['Den Eingang der Bewerbung', 'Die Einstellung des Bewerbers', 'Das Vorstellungsgespräch'],
      answer: 'A',
      feedbackAr: '"hiermit bestätigen wir den Eingang Ihrer Bewerbung" = نؤكد استلام طلب توظيفكم.',
      feedbackEn: '"hereby we confirm receipt of your application" = hiermit bestätigen wir den Eingang Ihrer Bewerbung.',
      grammar: null, grammarLink: null,
      lesson: 'B1 Lektion 4', lessonLink: '../b1/kursbuch/lektion-04/',
      exerciseLink: '../b1/ubungsbuch/lektion-04/'
    },
    // Q194 (new B1)
    {
      section: 6, q: 24, type: 'choice', level: 'B1',
      sceneEmoji: '🗣️',
      sceneAr: 'تقرأ آراء عملاء في منتدى.',
      sceneEn: 'Reading customer opinions on a forum.',
      passageTitle: 'Forum — Meinungen',
      passageText: 'Ich finde die neue App wirklich praktisch! Die Navigation ist einfach und die Funktionen sind hilfreich. Leider stürzt die App manchmal ab.',
      stemAr: 'ما هي المشكلة الوحيدة التي يذكرها المستخدم؟',
      stemEn: 'What is the only problem the user mentions?',
      options: ['Die App stürzt ab', 'Die Navigation ist schwer', 'Die Funktionen sind teuer'],
      answer: 'A',
      feedbackAr: '"Leider stürzt die App manchmal ab" = للأسف التطبيق ينهار أحياناً. abstürzen = ينهار/يتعطل.',
      feedbackEn: '"Unfortunately the app crashes sometimes" = Leider stürzt die App manchmal ab.',
      grammar: null, grammarLink: null,
      lesson: 'B1 Lektion 7', lessonLink: '../b1/kursbuch/lektion-07/',
      exerciseLink: '../b1/ubungsbuch/lektion-07/'
    },
    // Q195 (new B1)
    {
      section: 6, q: 25, type: 'choice', level: 'B1',
      sceneEmoji: '🏢',
      sceneAr: 'تقرأ تقريراً سنوياً لشركة.',
      sceneEn: 'Reading a company annual report.',
      passageTitle: 'Jahresbericht',
      passageText: 'Die Firma konnte ihren Umsatz im letzten Jahr um 15% steigern. Besonders erfolgreich war der Bereich Online-Handel.',
      stemAr: 'كم ارتفعت مبيعات الشركة؟',
      stemEn: 'How much did the company\'s sales increase?',
      options: ['Um 15%', 'Um 5%', 'Um 25%'],
      answer: 'A',
      feedbackAr: '"Umsatz um 15% steigern" = زيادة المبيعات بنسبة 15%. der Umsatz = حجم المبيعات/الإيرادات.',
      feedbackEn: '"increase sales by 15%" = Umsatz um 15% steigern.',
      grammar: null, grammarLink: null,
      lesson: 'B1 Lektion 3', lessonLink: '../b1/kursbuch/lektion-03/',
      exerciseLink: '../b1/ubungsbuch/lektion-03/'
    },
    // Q196 (new B1)
    {
      section: 6, q: 26, type: 'choice', level: 'B1',
      sceneEmoji: '📝',
      sceneAr: 'تقرأ مقالاً عن التعليم في ألمانيا.',
      sceneEn: 'Reading an article about education in Germany.',
      passageTitle: 'Artikel — Bildungssystem',
      passageText: 'Das deutsche Bildungssystem bietet verschiedene Wege: nach der Grundschule können die Schüler auf Hauptschule, Realschule oder Gymnasium gehen.',
      stemAr: 'كم خياراً متاحاً بعد المدرسة الأساسية؟',
      stemEn: 'How many options are available after primary school?',
      options: ['Drei', 'Zwei', 'Vier'],
      answer: 'A',
      feedbackAr: 'Hauptschule, Realschule oder Gymnasium = ثلاثة خيارات. das Gymnasium = المدرسة الثانوية.',
      feedbackEn: 'Hauptschule, Realschule or Gymnasium = three options.',
      grammar: null, grammarLink: null,
      lesson: 'B1 Lektion 10', lessonLink: '../b1/kursbuch/lektion-10/',
      exerciseLink: '../b1/ubungsbuch/lektion-10/'
    },
    // Q197 (new B1)
    {
      section: 6, q: 27, type: 'choice', level: 'B1',
      sceneEmoji: '🏪',
      sceneAr: 'تقرأ تقييمات مطعم على الإنترنت.',
      sceneEn: 'Reading online restaurant reviews.',
      passageTitle: 'Restaurantbewertung',
      passageText: 'Das Essen war ausgezeichnet und der Service freundlich. Die Preise sind angemessen. Leider war es sehr laut, weil das Restaurant voll war.',
      stemAr: 'ما هو الجانب السلبي الوحيد؟',
      stemEn: 'What is the only negative aspect?',
      options: ['Es war sehr laut', 'Das Essen war schlecht', 'Der Service war unfreundlich'],
      answer: 'A',
      feedbackAr: '"Leider war es sehr laut" = للأسف كان مزعجاً جداً. ausgezeichnet = ممتاز. angemessen = مناسب.',
      feedbackEn: '"Unfortunately it was very loud" = Leider war es sehr laut. ausgezeichnet = excellent.',
      grammar: null, grammarLink: null,
      lesson: 'B1 Lektion 5', lessonLink: '../b1/kursbuch/lektion-05/',
      exerciseLink: '../b1/ubungsbuch/lektion-05/'
    },
    // Q198 (new B1)
    {
      section: 6, q: 28, type: 'choice', level: 'B1',
      sceneEmoji: '🏛️',
      sceneAr: 'تقرأ عن متحف تاريخي.',
      sceneEn: 'Reading about a historical museum.',
      passageTitle: 'Museumsbeschreibung',
      passageText: 'Das Deutsche Museum in München ist eines der größten Technikmuseen der Welt. Es zeigt über 28.000 Objekte zur Geschichte der Naturwissenschaft und Technik.',
      stemAr: 'كم عدد القطع المعروضة في المتحف؟',
      stemEn: 'How many objects are displayed in the museum?',
      options: ['Über 28.000', 'Über 10.000', 'Über 50.000'],
      answer: 'A',
      feedbackAr: '"über 28.000 Objekte" = أكثر من 28,000 قطعة. das Technikmuseum = متحف التكنولوجيا.',
      feedbackEn: '"over 28,000 objects" = über 28.000 Objekte.',
      grammar: null, grammarLink: null,
      lesson: 'B1 Lektion 5', lessonLink: '../b1/kursbuch/lektion-05/',
      exerciseLink: '../b1/ubungsbuch/lektion-05/'
    },
    // Q199 (new B1)
    {
      section: 6, q: 29, type: 'choice', level: 'B1',
      sceneEmoji: '💻',
      sceneAr: 'تقرأ تعليمات استخدام موقع إلكتروني جديد.',
      sceneEn: 'Reading instructions for using a new website.',
      passageTitle: 'Bedienungsanleitung',
      passageText: 'Klicken Sie auf "Registrieren" und geben Sie Ihre E-Mail-Adresse ein. Anschließend erhalten Sie einen Bestätigungslink. Nach der Bestätigung können Sie sich einloggen.',
      stemAr: 'ماذا تفعل أولاً؟',
      stemEn: 'What do you do first?',
      options: ['Auf "Registrieren" klicken', 'Sich einloggen', 'E-Mail bestätigen'],
      answer: 'A',
      feedbackAr: 'الخطوة الأولى: "Klicken Sie auf Registrieren" = انقر على تسجيل. anschließend = بعد ذلك.',
      feedbackEn: 'First step: "Click on Register" = Klicken Sie auf Registrieren. anschließend = afterwards.',
      grammar: null, grammarLink: null,
      lesson: 'B1 Lektion 7', lessonLink: '../b1/kursbuch/lektion-07/',
      exerciseLink: '../b1/ubungsbuch/lektion-07/'
    },
    // Q200 (new B1)
    {
      section: 6, q: 30, type: 'choice', level: 'B1',
      sceneEmoji: '🏙️',
      sceneAr: 'تقرأ مقالاً عن التنقل في المدن الكبرى.',
      sceneEn: 'Reading an article about mobility in big cities.',
      passageTitle: 'Artikel — Stadtverkehr',
      passageText: 'Immer mehr Menschen in deutschen Großstädten nutzen das Fahrrad für den täglichen Weg zur Arbeit. Die Städte bauen dafür neue Fahrradwege. Das ist gut für die Umwelt.',
      stemAr: 'لماذا يختار الناس الدراجة للذهاب إلى العمل؟',
      stemEn: 'Why do people choose bicycles for commuting?',
      options: ['Weil Städte neue Radwege bauen', 'Weil es billiger ist', 'Weil es schneller ist'],
      answer: 'A',
      feedbackAr: '"Die Städte bauen dafür neue Fahrradwege" = المدن تبني ممرات دراجات جديدة لهذا السبب.',
      feedbackEn: '"Cities are building new bike lanes for this" = Die Städte bauen dafür neue Fahrradwege.',
      grammar: null, grammarLink: null,
      lesson: 'B1 Lektion 6', lessonLink: '../b1/kursbuch/lektion-06/',
      exerciseLink: '../b1/ubungsbuch/lektion-06/'
    }
  ];

  // ═══════════════════════════════════════════════════════════════
  // selectQuestions — اختيار عشوائي متوازن
  // ═══════════════════════════════════════════════════════════════

  /**
   * يختار عدداً محدداً من الأسئلة من بنك الأسئلة بشكل عشوائي
   * مع ضمان توزيع متوازن حسب (القسم + المستوى).
   *
   * @param {number} count - عدد الأسئلة المطلوب (افتراضي 42)
   * @returns {Array} مصفوفة الأسئلة المختارة مع إعادة ترقيم q
   */
  function selectQuestions(count) {
    if (count == null) count = 42;
    if (count <= 0) return [];
    if (count >= QUESTIONS_BANK.length) {
      // إذا طلب أكثر من حجم البنك، نعيد كل الأسئلة مع ترقيم
      return QUESTIONS_BANK.map(function (q, i) {
        var clone = copyQuestion(q);
        clone.q = i + 1;
        return clone;
      });
    }

    // ── 1. بناء خريطة الأسئلة حسب (section_level) ──
    var pool = {};
    for (var i = 0; i < QUESTIONS_BANK.length; i++) {
      var q = QUESTIONS_BANK[i];
      var key = q.section + '_' + q.level;
      if (!pool[key]) pool[key] = [];
      pool[key].push(q);
    }

    // ── 2. تحديد التوزيع المستهدف ──
    // نوزع 42 سؤالاً على 18 خلية (6 أقسام × 3 مستويات)
    // بشكل متوازن: 3+2+2 لكل قسم = 7 × 6 = 42
    var targets = {};
    var sections = [1, 2, 3, 4, 5, 6];
    var levels = ['A1', 'A2', 'B1'];

    // التوزيع الأساسي: 3 A1, 2 A2, 2 B1 لكل قسم
    var baseA1 = Math.floor(3);
    var baseA2 = Math.floor(2);
    var baseB1 = Math.floor(2);

    for (var si = 0; si < sections.length; si++) {
      var s = sections[si];
      targets[s + '_A1'] = baseA1;
      targets[s + '_A2'] = baseA2;
      targets[s + '_B1'] = baseB1;
    }

    // ── 3. التوزيع الفعلي حسب الأسئلة المتوفرة ──
    var selected = [];
    var totalNeeded = count;

    // المرحلة الأولى: أخذ العدد المستهدف من كل خلية
    for (var si2 = 0; si2 < sections.length; si2++) {
      var s2 = sections[si2];
      for (var li = 0; li < levels.length; li++) {
        var lv = levels[li];
        var key2 = s2 + '_' + lv;
        var needed = targets[key2];
        var available = pool[key2] ? pool[key2].slice() : [];
        shuffleArray(available);
        var take = Math.min(needed, available.length);
        for (var j = 0; j < take; j++) {
          selected.push(available[j]);
          // إزالة السؤال المأخوذ من الـ pool
          var idx = pool[key2].indexOf(available[j]);
          pool[key2].splice(idx, 1);
        }
        totalNeeded -= take;
      }
    }

    // المرحلة الثانية: ملء الباقي من أي خلية متاحة
    if (totalNeeded > 0) {
      // نجمع كل الأسئلة المتبقية
      var remaining = [];
      for (var key3 in pool) {
        if (pool.hasOwnProperty(key3)) {
          for (var k = 0; k < pool[key3].length; k++) {
            remaining.push(pool[key3][k]);
          }
        }
      }
      shuffleArray(remaining);
      var take2 = Math.min(totalNeeded, remaining.length);
      for (var m = 0; m < take2; m++) {
        selected.push(remaining[m]);
      }
    }

    // ── 4. خلط الأسئلة النهائية وإعادة الترقيم ──
    shuffleArray(selected);

    var result = [];
    for (var n = 0; n < selected.length; n++) {
      var clone = copyQuestion(selected[n]);
      clone.q = n + 1;
      result.push(clone);
    }

    return result;
  }

  // ── أدوات مساعدة ──

  function shuffleArray(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
  }

  function copyQuestion(q) {
    return JSON.parse(JSON.stringify(q));
  }

  // ═══════════════════════════════════════════════════════════════
  // تصدير إلى window.QuestionBank
  // ═══════════════════════════════════════════════════════════════

  window.QuestionBank = {
    all: QUESTIONS_BANK,
    selectQuestions: selectQuestions
  };

})();
