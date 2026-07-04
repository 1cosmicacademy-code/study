/**
 * Level Assessment (Einstufungstest) — محرك فحص المستوى التفاعلي
 *
 * اختبار تشخيصي من 30 سؤالاً يقسم إلى 4 أقسام:
 *   1. Wortschatz (مفردات)
 *   2. Grammatik (قواعد)
 *   3. Satzbau (تركيب جمل)
 *   4. Kommunikation (تواصل)
 *
 * يحدد المستوى (A1/A2/B1)، نقاط القوة، نقاط الضعف، والتوصيات.
 * يبني على نفس نمط exercise-checker.js الموجود.
 */
(function () {
  'use strict';

  // ── تحديد اللغة ──────────────────────────────────

  function isEnglishPage() {
    return window.location.pathname.indexOf('/en/') === 0;
  }

  /** ترجمة واجهة الاختبار */
  function l10n() {
    var en = isEnglishPage();
    return {
      testTitle:      en ? '📝 Level Assessment (Einstufungstest)' : '📝 فحص المستوى (Einstufungstest)',
      intro:          en ? 'Answer the 30 questions below. After submitting, you will get your estimated level, strengths, weaknesses, and personalised recommendations with links to lessons and grammar topics.'
                         : 'أجب عن 30 سؤالاً أدناه. بعد التقييم ستحصل على مستواك التقديري، نقاط قوتك وضعفك، وتوصيات مخصصة مع روابط للدروس والقواعد.',
      sectionWortschatz: en ? '🆕 1. Wortschatz — Vocabulary' : '🆕 1. Wortschatz — المفردات',
      sectionGrammatik:  en ? '📘 2. Grammatik — Grammar'      : '📘 2. Grammatik — القواعد',
      sectionSatzbau:    en ? '🏗️ 3. Satzbau — Sentence Structure' : '🏗️ 3. Satzbau — تركيب الجمل',
      sectionKommunikation: en ? '💬 4. Kommunikation — Communication' : '💬 4. Kommunikation — التواصل',
      qNum:           en ? '#' : '#',
      qQuestion:      en ? 'Question' : 'السؤال',
      qAnswer:        en ? 'Your Answer' : 'إجابتك',
      submit:         en ? '✅ Start Assessment' : '✅ بدء التقييم',
      retry:          en ? '🔄 Retake Test' : '🔄 إعادة الاختبار',
      dashboardTitle: en ? '🏆 Your Results' : '🏆 نتيجتك',
      overallScore:   en ? 'Overall Score' : 'النتيجة الإجمالية',
      yourLevel:      en ? 'Estimated Level' : 'المستوى التقديري',
      levelBelowA1:   en ? 'Below A1 (Beginner)' : 'أقل من A1 (مبتدئ كامل)',
      levelA1:        en ? 'A1 — Beginner' : 'A1 — مبتدئ',
      levelA2:        en ? 'A2 — Elementary' : 'A2 — متوسط',
      levelB1:        en ? 'B1 — Intermediate' : 'B1 — متوسط متقدم',
      perLevel:       en ? 'per Level' : 'حسب المستوى',
      weaknesses:     en ? '📘 Weaknesses — Topics to Review' : '📘 نقاط الضعف — تحتاج مراجعة',
      strengths:      en ? '🟢 Strengths — What You Know Well' : '🟢 نقاط القوة — ما تجيده',
      recommendation: en ? '💡 Recommendation' : '💡 التوصية',
      studyLesson:    en ? '📕 Study Lesson' : '📕 ادرس الدرس',
      reviewGrammar:  en ? '📘 Review Grammar' : '📘 راجع القاعدة',
      doExercises:    en ? '📝 Do Exercises' : '📝 حل التمارين',
      retakeTest:     en ? '🔄 Retake Test' : '🔄 إعادة الاختبار',
      noAnswer:       en ? '(no answer)' : '(لا توجد إجابة)',
      correct:        en ? '✅ Correct' : '✅ صحيح',
      wrong:          en ? '❌ Wrong' : '❌ خطأ',
      allCorrect:     en ? '🎉 All correct! Excellent work!' : '🎉 كل الإجابات صحيحة! عمل ممتاز!',
      noWeakness:     en ? '🌟 No major weaknesses found!' : '🌟 لا توجد نقاط ضعف ملحوظة!',
      recommendStart: en ? 'Start from' : 'ابدأ من',
      recommendReview: en ? 'Review these topics before moving on' : 'راجع هذه المواضيع قبل الانتقال',
      recommendGreat: en ? 'You are ready for the next level! 🎉' : 'أنت جاهز للمستوى التالي! 🎉',
      sectionLabel:   en ? 'Section' : 'القسم',
      subTotal:       en ? 'Subtotal' : 'مجموع',
    };
  }

  // ── أدوات مساعدة ─────────────────────────────────

  function escapeHtml(str) {
    var d = document.createElement('div');
    d.appendChild(document.createTextNode(str));
    return d.innerHTML;
  }

  // ── بيانات الأسئلة (30 سؤالاً) ────────────────────
  //
  // level: تصنيف السؤال للتقييم (A1/A2/B1)
  // type: 'choice' (اختيار من متعدد) أو 'text' (إدخال نصي)
  // answer: الإجابة الصحيحة — حرف (choice) أو نص (text)
  // acceptedAnswers: (اختياري) إجابات بديلة مقبولة للنصوص فقط

  var QUESTIONS = [
    // ═══════════════════════════════════════════════
    // القسم 1: Wortschatz — المفردات (8 أسئلة)
    // ═══════════════════════════════════════════════

    {
      section: 1, q: 1, type: 'choice', level: 'A1',
      stemAr: 'ما التحية المناسبة للساعة 8 صباحاً؟',
      stemEn: 'Which greeting is appropriate at 8 AM?',
      options: ['Guten Morgen', 'Guten Tag', 'Gute Nacht'],
      answer: 'A',
      grammar: null, grammarLink: null,
      lesson: 'Lektion 1', lessonLink: '../a1/kursbuch/lektion-01/',
      exerciseLink: '../a1/ubungsbuch/lektion-01/'
    },
    {
      section: 1, q: 2, type: 'choice', level: 'A1',
      stemAr: 'أكمل: Ich ___ aus Spanien.',
      stemEn: 'Complete: Ich ___ from Spain.',
      options: ['komme', 'kommt', 'kommen'],
      answer: 'A',
      grammar: 'Verbkonjugation', grammarLink: '../grammatik/verbkonjugation/',
      lesson: 'Lektion 1', lessonLink: '../a1/kursbuch/lektion-01/',
      exerciseLink: '../a1/ubungsbuch/lektion-01/'
    },
    {
      section: 1, q: 3, type: 'choice', level: 'A1',
      stemAr: 'اختر أداة التعريف الصحيحة: ___ Tisch',
      stemEn: 'Choose the correct article: ___ Tisch',
      options: ['der', 'die', 'das'],
      answer: 'A',
      grammar: 'Artikel', grammarLink: '../grammatik/artikel/',
      lesson: 'Lektion 3', lessonLink: '../a1/kursbuch/lektion-03/',
      exerciseLink: '../a1/ubungsbuch/lektion-03/'
    },
    {
      section: 1, q: 4, type: 'choice', level: 'A1',
      stemAr: '"der Vater von ihm" = ___',
      stemEn: '"the father of him" = ___',
      options: ['sein Vater', 'ihr Vater', 'euer Vater'],
      answer: 'A',
      grammar: 'Possessivartikel', grammarLink: '../grammatik/possessivartikel/',
      lesson: 'Lektion 4', lessonLink: '../a1/kursbuch/lektion-04/',
      exerciseLink: '../a1/ubungsbuch/lektion-04/'
    },
    {
      section: 1, q: 5, type: 'choice', level: 'A2',
      stemAr: 'أكمل: Ich ___ (arbeiten) bei Siemens.',
      stemEn: 'Complete: I ___ at Siemens.',
      options: ['arbeite', 'arbeitet', 'arbeiten'],
      answer: 'A',
      grammar: 'Verbkonjugation', grammarLink: '../grammatik/verbkonjugation/',
      lesson: 'A2 Lektion 2', lessonLink: '../a2/kursbuch/lektion-02/',
      exerciseLink: '../a2/ubungsbuch/lektion-02/'
    },
    {
      section: 1, q: 6, type: 'choice', level: 'A2',
      stemAr: 'كيف تقول "head" بالألمانية؟',
      stemEn: 'How do you say "head" in German?',
      options: ['der Kopf', 'die Hand', 'der Fuß'],
      answer: 'A',
      grammar: null, grammarLink: null,
      lesson: 'Lektion 13', lessonLink: '../a1/kursbuch/lektion-13/',
      exerciseLink: '../a1/ubungsbuch/lektion-13/'
    },
    {
      section: 1, q: 7, type: 'choice', level: 'A2',
      stemAr: 'أكمل: Wir fahren ___ dem Auto.',
      stemEn: 'Complete: We go ___ car.',
      options: ['mit', 'nach', 'bei'],
      answer: 'A',
      grammar: 'Präpositionen', grammarLink: '../grammatik/prapositionen/',
      lesson: 'Lektion 15', lessonLink: '../a1/kursbuch/lektion-15/',
      exerciseLink: '../a1/ubungsbuch/lektion-15/'
    },
    {
      section: 1, q: 8, type: 'choice', level: 'B1',
      stemAr: 'أكمل الترتيب الصحيح: Das ist ___. Berlin ist ___. Hamburg ist ___.',
      stemEn: 'Complete the correct order: This is ___. Berlin is ___. Hamburg is ___.',
      options: ['schön – schöner – am schönsten', 'schöner – schön – am schönsten', 'schön – am schönsten – schöner'],
      answer: 'A',
      grammar: 'Vergleiche', grammarLink: '../grammatik/vergleiche/',
      lesson: 'A2 Lektion 3', lessonLink: '../a2/kursbuch/lektion-03/',
      exerciseLink: '../a2/ubungsbuch/lektion-03/'
    },

    // ═══════════════════════════════════════════════
    // القسم 2: Grammatik — القواعد (12 سؤالاً)
    // ═══════════════════════════════════════════════

    {
      section: 2, q: 1, type: 'choice', level: 'A1',
      stemAr: 'Er ___ (heißen) Ahmed.',
      stemEn: 'He ___ Ahmed.',
      options: ['heißt', 'heiße', 'heißen'],
      answer: 'A',
      grammar: 'Verbkonjugation', grammarLink: '../grammatik/verbkonjugation/',
      lesson: 'Lektion 1', lessonLink: '../a1/kursbuch/lektion-01/',
      exerciseLink: '../a1/ubungsbuch/lektion-01/'
    },
    {
      section: 2, q: 2, type: 'choice', level: 'A1',
      stemAr: '___ ist das? Das ist ein Buch.',
      stemEn: '___ is that? That is a book.',
      options: ['Was', 'Wer', 'Wie'],
      answer: 'A',
      grammar: 'Nominativ', grammarLink: '../grammatik/nominativ/',
      lesson: 'Lektion 3', lessonLink: '../a1/kursbuch/lektion-03/',
      exerciseLink: '../a1/ubungsbuch/lektion-03/'
    },
    {
      section: 2, q: 3, type: 'choice', level: 'A1',
      stemAr: 'Ich habe ___ Apfel.',
      stemEn: 'I have ___ apple.',
      options: ['einen', 'ein', 'eine'],
      answer: 'A',
      grammar: 'Akkusativ', grammarLink: '../grammatik/akkusativ/',
      lesson: 'Lektion 7', lessonLink: '../a1/kursbuch/lektion-07/',
      exerciseLink: '../a1/ubungsbuch/lektion-07/'
    },
    {
      section: 2, q: 4, type: 'choice', level: 'A1',
      stemAr: 'Ich stehe ___ 7 Uhr auf.',
      stemEn: 'I get up ___ 7 o\'clock.',
      options: ['um', 'am', 'im'],
      answer: 'A',
      grammar: 'Trennbare Verben', grammarLink: '../grammatik/trennbare-verben/',
      lesson: 'Lektion 5', lessonLink: '../a1/kursbuch/lektion-05/',
      exerciseLink: '../a1/ubungsbuch/lektion-05/'
    },
    {
      section: 2, q: 5, type: 'choice', level: 'A2',
      stemAr: '___ ich morgen früher kommen?',
      stemEn: '___ I come earlier tomorrow?',
      options: ['Darf', 'Mag', 'Soll'],
      answer: 'A',
      grammar: 'Modalverben', grammarLink: '../grammatik/modalverben/',
      lesson: 'Lektion 6', lessonLink: '../a1/kursbuch/lektion-06/',
      exerciseLink: '../a1/ubungsbuch/lektion-06/'
    },
    {
      section: 2, q: 6, type: 'choice', level: 'A2',
      stemAr: 'Er ___ gestern Fußball gespielt.',
      stemEn: 'He ___ football yesterday.',
      options: ['hat', 'ist', 'war'],
      answer: 'A',
      grammar: 'Perfekt', grammarLink: '../grammatik/perfekt/',
      lesson: 'Lektion 8', lessonLink: '../a1/kursbuch/lektion-08/',
      exerciseLink: '../a1/ubungsbuch/lektion-08/'
    },
    {
      section: 2, q: 7, type: 'choice', level: 'A2',
      stemAr: 'Das Buch liegt ___ Tisch.',
      stemEn: 'The book is on ___ table.',
      options: ['auf dem', 'auf den', 'auf der'],
      answer: 'A',
      grammar: 'Wechselpräpositionen', grammarLink: '../grammatik/wechselprapositionen/',
      lesson: 'Lektion 10', lessonLink: '../a1/kursbuch/lektion-10/',
      exerciseLink: '../a1/ubungsbuch/lektion-10/'
    },
    {
      section: 2, q: 8, type: 'choice', level: 'A2',
      stemAr: 'Ich gebe ___ Freund ein Geschenk.',
      stemEn: 'I give a present to ___ friend.',
      options: ['dem', 'der', 'den'],
      answer: 'A',
      grammar: 'Dativ', grammarLink: '../grammatik/dativ/',
      lesson: 'Lektion 10', lessonLink: '../a1/kursbuch/lektion-10/',
      exerciseLink: '../a1/ubungsbuch/lektion-10/'
    },
    {
      section: 2, q: 9, type: 'choice', level: 'A2',
      stemAr: 'Ich weiß, ___ er morgen kommt.',
      stemEn: 'I know ___ he comes tomorrow.',
      options: ['dass', 'weil', 'wenn'],
      answer: 'A',
      grammar: 'Nebensätze', grammarLink: '../grammatik/nebensatze/',
      lesson: 'A2 Lektion 1', lessonLink: '../a2/kursbuch/lektion-01/',
      exerciseLink: '../a2/ubungsbuch/lektion-01/'
    },
    {
      section: 2, q: 10, type: 'choice', level: 'A2',
      stemAr: 'Deutsch ist ___ Englisch.',
      stemEn: 'German is ___ English.',
      options: ['schwerer als', 'schwer als', 'am schwersten'],
      answer: 'A',
      grammar: 'Vergleiche', grammarLink: '../grammatik/vergleiche/',
      lesson: 'A2 Lektion 3', lessonLink: '../a2/kursbuch/lektion-03/',
      exerciseLink: '../a2/ubungsbuch/lektion-03/'
    },
    {
      section: 2, q: 11, type: 'choice', level: 'B1',
      stemAr: '___ ich mehr Zeit hätte!',
      stemEn: '___ I had more time!',
      options: ['Wenn', 'Weil', 'Dass'],
      answer: 'A',
      grammar: 'Konjunktiv 2', grammarLink: '../grammatik/konjunktiv-2/',
      lesson: 'A2 Lektion 3', lessonLink: '../a2/kursbuch/lektion-03/',
      exerciseLink: '../a2/ubungsbuch/lektion-03/'
    },
    {
      section: 2, q: 12, type: 'choice', level: 'B1',
      stemAr: 'Das Haus ___ gebaut.',
      stemEn: 'The house ___ built.',
      options: ['wird', 'ist', 'war'],
      answer: 'A',
      grammar: 'Passiv', grammarLink: '../grammatik/passiv/',
      lesson: 'A2 Lektion 3', lessonLink: '../a2/kursbuch/lektion-03/',
      exerciseLink: '../a2/ubungsbuch/lektion-03/'
    },

    // ═══════════════════════════════════════════════
    // القسم 3: Satzbau — تركيب الجمل (5 أسئلة)
    // ═══════════════════════════════════════════════

    {
      section: 3, q: 1, type: 'choice', level: 'A1',
      stemAr: 'أي جملة صحيحة؟',
      stemEn: 'Which sentence is correct?',
      options: ['Ich heiße Ahmed.', 'Ich Ahmed heiße.', 'Heiße ich Ahmed.'],
      answer: 'A',
      grammar: 'Satzbau', grammarLink: '../grammatik/satzbau/',
      lesson: 'Lektion 1', lessonLink: '../a1/kursbuch/lektion-01/',
      exerciseLink: '../a1/ubungsbuch/lektion-01/'
    },
    {
      section: 3, q: 2, type: 'choice', level: 'A1',
      stemAr: 'أي جملة صحيحة — الفعل في الموضع الثاني؟',
      stemEn: 'Which sentence is correct — verb in position 2?',
      options: ['Heute gehe ich.', 'Heute ich gehe.', 'Heute gehen ich.'],
      answer: 'A',
      grammar: 'Satzbau', grammarLink: '../grammatik/satzbau/',
      lesson: 'Lektion 5', lessonLink: '../a1/kursbuch/lektion-05/',
      exerciseLink: '../a1/ubungsbuch/lektion-05/'
    },
    {
      section: 3, q: 3, type: 'choice', level: 'A2',
      stemAr: 'Ich lerne Deutsch, ___ ich in Deutschland arbeiten möchte.',
      stemEn: 'I learn German ___ I want to work in Germany.',
      options: ['weil', 'weil ich', 'denn'],
      answer: 'A',
      grammar: 'Nebensätze', grammarLink: '../grammatik/nebensatze/',
      lesson: 'A2 Lektion 1', lessonLink: '../a2/kursbuch/lektion-01/',
      exerciseLink: '../a2/ubungsbuch/lektion-01/'
    },
    {
      section: 3, q: 4, type: 'choice', level: 'A2',
      stemAr: 'أكمل: Er sagt, dass er morgen ___.',
      stemEn: 'Complete: He says that he ___ tomorrow.',
      options: ['kommt', 'kommt er', 'er kommt'],
      answer: 'A',
      grammar: 'Nebensätze', grammarLink: '../grammatik/nebensatze/',
      lesson: 'A2 Lektion 1', lessonLink: '../a2/kursbuch/lektion-01/',
      exerciseLink: '../a2/ubungsbuch/lektion-01/'
    },
    {
      section: 3, q: 5, type: 'choice', level: 'A2',
      stemAr: 'اختر الجملة الصحيحة: (Ich / morgen / will / nach Berlin / fahren)',
      stemEn: 'Choose the correct order: (I / tomorrow / want / to Berlin / go)',
      options: ['Ich will morgen nach Berlin fahren.', 'Ich morgen will nach Berlin fahren.', 'Ich will fahren morgen nach Berlin.'],
      answer: 'A',
      grammar: 'Wortstellung', grammarLink: '../grammatik/wortstellung-erweitert/',
      lesson: 'A2 Lektion 11', lessonLink: '../a2/kursbuch/lektion-11/',
      exerciseLink: '../a2/ubungsbuch/lektion-11/'
    },

    // ═══════════════════════════════════════════════
    // القسم 4: Kommunikation — التواصل (5 أسئلة)
    // ═══════════════════════════════════════════════

    {
      section: 4, q: 1, type: 'text', level: 'A1',
      stemAr: 'أكمل: Wie geht es dir? — Mir ___',
      stemEn: 'Complete: How are you? — I\'m ___',
      answer: "geht's gut",
      acceptedAnswers: ["geht's gut", "geht es gut"],
      grammar: null, grammarLink: null,
      lesson: 'Lektion 1', lessonLink: '../a1/kursbuch/lektion-01/',
      exerciseLink: '../a1/ubungsbuch/lektion-01/'
    },
    {
      section: 4, q: 2, type: 'choice', level: 'A1',
      stemAr: 'Wie viel ___ das?',
      stemEn: 'How much ___ that?',
      options: ['kostet', 'kosten', 'kostest'],
      answer: 'A',
      grammar: 'Verbkonjugation', grammarLink: '../grammatik/verbkonjugation/',
      lesson: 'Lektion 16', lessonLink: '../a1/kursbuch/lektion-16/',
      exerciseLink: '../a1/ubungsbuch/lektion-16/'
    },
    {
      section: 4, q: 3, type: 'choice', level: 'A2',
      stemAr: 'Ich ___ Schmerzen.',
      stemEn: 'I ___ pain.',
      options: ['habe', 'hat', 'bin'],
      answer: 'A',
      grammar: 'Modalverben', grammarLink: '../grammatik/modalverben/',
      lesson: 'Lektion 13', lessonLink: '../a1/kursbuch/lektion-13/',
      exerciseLink: '../a1/ubungsbuch/lektion-13/'
    },
    {
      section: 4, q: 4, type: 'choice', level: 'A2',
      stemAr: 'Wo ___ die U-Bahn?',
      stemEn: 'Where ___ the subway?',
      options: ['ist', 'liegt', 'gibt'],
      answer: 'A',
      grammar: 'Wechselpräpositionen', grammarLink: '../grammatik/wechselprapositionen/',
      lesson: 'Lektion 15', lessonLink: '../a1/kursbuch/lektion-15/',
      exerciseLink: '../a1/ubungsbuch/lektion-15/'
    },
    {
      section: 4, q: 5, type: 'choice', level: 'A2',
      stemAr: 'Ich finde, ___ Deutsch lernen wichtig ist.',
      stemEn: 'I think ___ learning German is important.',
      options: ['dass', 'weil', 'wenn'],
      answer: 'A',
      grammar: 'Nebensätze', grammarLink: '../grammatik/nebensatze/',
      lesson: 'A2 Lektion 3', lessonLink: '../a2/kursbuch/lektion-03/',
      exerciseLink: '../a2/ubungsbuch/lektion-03/'
    }
  ];

  // ── بيانات الأقسام ───────────────────────────────

  var SECTIONS = [
    { id: 1, slug: 'wortschatz', icon: '🆕', titleAr: 'المفردات', titleEn: 'Vocabulary' },
    { id: 2, slug: 'grammatik', icon: '📘', titleAr: 'القواعد', titleEn: 'Grammar' },
    { id: 3, slug: 'satzbau', icon: '🏗️', titleAr: 'تركيب الجمل', titleEn: 'Sentence Structure' },
    { id: 4, slug: 'kommunikation', icon: '💬', titleAr: 'التواصل', titleEn: 'Communication' }
  ];

  var OPTION_LABELS = ['A', 'B', 'C'];

  // ── بناء الاختبار ────────────────────────────────

  function buildTest(container) {
    var en = isEnglishPage();
    var txt = l10n();
    var html = '';

    // Intro
    html += '<div class="level-intro"><p>' + escapeHtml(txt.intro) + '</p></div>';

    // Sections
    for (var s = 1; s <= 4; s++) {
      var sectionInfo = SECTIONS[s - 1];
      var sectionQuestions = QUESTIONS.filter(function (q) { return q.section === s; });
      var sectionTitle = en ? sectionInfo.icon + ' ' + s + '. ' + sectionInfo.titleEn
                            : sectionInfo.icon + ' ' + s + '. ' + sectionInfo.titleAr;

      html += '<div class="level-section" data-section="' + s + '">';
      html += '<h3 class="level-section-title">' + escapeHtml(sectionTitle) +
              ' <span class="level-q-count">(' + sectionQuestions.length + ' ' +
              (en ? 'questions' : 'أسئلة') + ')</span></h3>';

      html += '<table class="level-table">';
      html += '<thead><tr>';
      html += '<th class="level-col-num">' + escapeHtml(txt.qNum) + '</th>';
      html += '<th class="level-col-question">' + escapeHtml(txt.qQuestion) + '</th>';
      html += '<th class="level-col-answer">' + escapeHtml(txt.qAnswer) + '</th>';
      html += '</tr></thead><tbody>';

      for (var i = 0; i < sectionQuestions.length; i++) {
        var qd = sectionQuestions[i];
        var qIndex = QUESTIONS.indexOf(qd);
        var stem = en ? qd.stemEn : qd.stemAr;

        html += '<tr class="level-question-row" data-q="' + qIndex + '">';
        html += '<td class="level-col-num">' + qd.q + '</td>';
        html += '<td class="level-col-question">' + escapeHtml(stem) + '</td>';
        html += '<td class="level-col-answer">';

        if (qd.type === 'choice') {
          html += '<div class="level-choice-group">';
          for (var o = 0; o < qd.options.length; o++) {
            var val = OPTION_LABELS[o];
            html += '<label class="level-radio-label">';
            html += '<input type="radio" name="q-' + qIndex + '" value="' + val + '" class="level-radio">';
            html += ' <span class="level-opt-text"><strong>' + val + '.</strong> ' + escapeHtml(qd.options[o]) + '</span>';
            html += '</label>';
          }
          html += '</div>';
        } else {
          // text
          html += '<input type="text" class="level-text-input" name="q-' + qIndex + '" dir="ltr" autocomplete="off">';
        }

        html += '</td></tr>';
      }

      html += '</tbody></table></div>';
    }

    // Submit button
    html += '<button class="level-submit-btn">' + escapeHtml(txt.submit) + '</button>';

    // Dashboard container (hidden)
    html += '<div class="level-dashboard" style="display:none"></div>';

    container.innerHTML = html;
  }

  // ── التصحيح ──────────────────────────────────────

  function gradeTest(container) {
    var txt = l10n();
    var results = [];

    for (var i = 0; i < QUESTIONS.length; i++) {
      var qd = QUESTIONS[i];
      var userAnswer = getUserAnswer(i, qd.type);
      var isCorrect = checkAnswer(userAnswer, qd);
      results.push({
        index: i,
        question: qd,
        userAnswer: userAnswer,
        correct: isCorrect
      });
    }

    // الإحصاءات
    var total = results.length;
    var correctCount = results.filter(function (r) { return r.correct; }).length;
    var wrongAnswers = results.filter(function (r) { return !r.correct; });
    var correctAnswers = results.filter(function (r) { return r.correct; });

    // حسب المستوى
    var scoresByLevel = {};
    var levels = ['A1', 'A2', 'B1'];
    for (var li = 0; li < levels.length; li++) {
      var lvl = levels[li];
      var lvlResults = results.filter(function (r) { return r.question.level === lvl; });
      var lvlTotal = lvlResults.length;
      var lvlCorrect = lvlResults.filter(function (r) { return r.correct; }).length;
      scoresByLevel[lvl] = {
        correct: lvlCorrect,
        total: lvlTotal,
        pct: lvlTotal > 0 ? Math.round((lvlCorrect / lvlTotal) * 100) : 0
      };
    }

    // تحديد المستوى
    var levelResult = determineLevel(scoresByLevel);

    // التوصيات
    var recommendations = generateRecommendations(wrongAnswers, results);

    // عرض Dashboard
    showDashboard(container, results, scoresByLevel, levelResult, recommendations, correctCount, total);

    // تعطيل المدخلات
    disableAllInputs(container);

    // تبديل الزر
    var btn = container.querySelector('.level-submit-btn');
    btn.textContent = txt.retry;
    btn.classList.add('reset-mode');
  }

  /** الحصول على إجابة المستخدم */
  function getUserAnswer(qIndex, type) {
    if (type === 'choice') {
      var radios = document.querySelectorAll('input[name="q-' + qIndex + '"]');
      for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) return radios[i].value;
      }
      return '';
    } else {
      var input = document.querySelector('input[name="q-' + qIndex + '"]');
      return input ? input.value.trim() : '';
    }
  }

  /** التحقق من صحة الإجابة */
  function checkAnswer(userAnswer, qd) {
    if (!userAnswer) return false;
    if (qd.type === 'choice') {
      return userAnswer === qd.answer;
    } else {
      // text — مقارنة غير حساسة لحالة الأحرف
      var norm = userAnswer.toLowerCase().trim();
      if (norm === qd.answer.toLowerCase()) return true;
      if (qd.acceptedAnswers) {
        for (var i = 0; i < qd.acceptedAnswers.length; i++) {
          if (norm === qd.acceptedAnswers[i].toLowerCase()) return true;
        }
      }
      return false;
    }
  }

  /** تعطيل جميع المدخلات بعد التصحيح */
  function disableAllInputs(container) {
    container.querySelectorAll('.level-radio, .level-text-input').forEach(function (el) {
      el.disabled = true;
    });
  }

  // ── تحديد المستوى ────────────────────────────────

  function determineLevel(scoresByLevel) {
    var a1pct = scoresByLevel.A1.pct;
    var a2pct = scoresByLevel.A2.pct;
    var b1pct = scoresByLevel.B1.pct;

    var levelKey, levelAr, levelEn;

    if (a1pct < 60) {
      levelKey = 'belowA1';
      levelAr = 'أقل من A1';
      levelEn = 'Below A1';
    } else if (a2pct < 60) {
      levelKey = 'A1';
      levelAr = 'A1';
      levelEn = 'A1';
    } else if (b1pct < 60) {
      levelKey = 'A2';
      levelAr = 'A2';
      levelEn = 'A2';
    } else {
      levelKey = 'B1';
      levelAr = 'B1';
      levelEn = 'B1';
    }

    return {
      key: levelKey,
      ar: levelAr,
      en: levelEn,
      scoresByLevel: scoresByLevel
    };
  }

  // ── توليد التوصيات ───────────────────────────────

  function generateRecommendations(wrongAnswers, allResults) {
    if (wrongAnswers.length === 0) {
      return { grammarTopics: [], lessonTopics: [], isEmpty: true };
    }

    // تجميع الأخطاء حسب القاعدة النحوية
    var grammarMap = {};
    var lessonMap = {};

    for (var i = 0; i < wrongAnswers.length; i++) {
      var r = wrongAnswers[i];
      var qd = r.question;

      if (qd.grammar) {
        var key = qd.grammar + '||' + qd.grammarLink;
        if (!grammarMap[key]) {
          grammarMap[key] = { grammar: qd.grammar, link: qd.grammarLink, count: 0, total: 0, lessons: {} };
        }
        grammarMap[key].count++;

        if (!grammarMap[key].lessons[qd.lesson]) {
          grammarMap[key].lessons[qd.lesson] = { lesson: qd.lesson, lessonLink: qd.lessonLink, exerciseLink: qd.exerciseLink };
        }
      }

      // تجميع حسب الدرس (للقواعد null)
      if (!qd.grammar) {
        var lKey = qd.lesson + '||' + qd.lessonLink;
        if (!lessonMap[lKey]) {
          lessonMap[lKey] = { lesson: qd.lesson, lessonLink: qd.lessonLink, exerciseLink: qd.exerciseLink, count: 0 };
        }
        lessonMap[lKey].count++;
      }
    }

    // حساب العدد الإجمالي لكل قاعدة (من كل النتائج)
    for (var g in grammarMap) {
      var grammarName = grammarMap[g].grammar;
      grammarMap[g].total = allResults.filter(function (r) {
        return r.question.grammar === grammarName;
      }).length;
    }

    // ترتيب
    var grammarTopics = Object.keys(grammarMap).map(function (k) { return grammarMap[k]; });
    grammarTopics.sort(function (a, b) { return b.count - a.count; });

    var lessonTopics = Object.keys(lessonMap).map(function (k) { return lessonMap[k]; });
    lessonTopics.sort(function (a, b) { return b.count - a.count; });

    return {
      grammarTopics: grammarTopics,
      lessonTopics: lessonTopics,
      isEmpty: false
    };
  }

  // ── عرض Dashboard ────────────────────────────────

  function showDashboard(container, results, scoresByLevel, levelResult, recommendations, correctCount, total) {
    var en = isEnglishPage();
    var txt = l10n();
    var pct = Math.round((correctCount / total) * 100);

    var dashboard = container.querySelector('.level-dashboard');
    var html = '';

    // ── 1. الشارة والنتيجة الإجمالية ──
    html += '<div class="dashboard-header">';

    var levelLabel = en ? levelResult.en : levelResult.ar;
    var emojiMap = { belowA1: '🔰', A1: '🌱', A2: '🌿', B1: '🌳' };
    var levelEmoji = emojiMap[levelResult.key] || '🎯';

    html += '<div class="level-badge">' + levelEmoji + ' <span class="level-badge-text">' + escapeHtml(levelLabel) + '</span></div>';

    var scoreClass = 'level-score level-score-great';
    var scoreLabel = txt.allCorrect;
    if (pct >= 80) { scoreClass = 'level-score level-score-great'; scoreLabel = en ? 'Excellent! 🎉' : 'ممتاز! 🎉'; }
    else if (pct >= 50) { scoreClass = 'level-score level-score-good'; scoreLabel = en ? 'Good effort! 💪' : 'جيد! استمر 💪'; }
    else { scoreClass = 'level-score level-score-needs-work'; scoreLabel = en ? 'Keep practicing! 📖' : 'حاول مرة أخرى 📖'; }

    html += '<div class="' + scoreClass + '">';
    html += '<span class="level-score-summary">' + correctCount + '/' + total + ' (' + pct + '%)</span>';
    html += '<span class="level-score-label">' + escapeHtml(scoreLabel) + '</span>';
    html += '</div></div>';

    // ── 2. أشرطة التقدم حسب المستوى ──
    html += '<div class="level-bars-section">';
    html += '<h4>' + escapeHtml(txt.perLevel) + '</h4>';
    html += '<div class="level-progress-bars">';

    var levels = ['A1', 'A2', 'B1'];
    var levelPcts = { A1: 80, A2: 60, B1: 60 }; // thresholds
    for (var li = 0; li < levels.length; li++) {
      var l = levels[li];
      var sc = scoresByLevel[l];
      var fillClass = 'level-fill';
      if (sc.pct >= 80) fillClass += ' level-fill-great';
      else if (sc.pct >= 50) fillClass += ' level-fill-good';
      else fillClass += ' level-fill-needs-work';

      html += '<div class="level-bar-row">';
      html += '<span class="level-bar-label">' + l + '</span>';
      html += '<div class="level-bar-track"><div class="' + fillClass + '" style="width:' + sc.pct + '%"></div></div>';
      html += '<span class="level-bar-pct">' + sc.correct + '/' + sc.total + ' (' + sc.pct + '%)</span>';
      html += '</div>';
    }

    html += '</div></div>';

    // ── 3. نقاط الضعف ──
    html += '<div class="level-weaknesses">';
    html += '<h4>📘 ' + escapeHtml(txt.weaknesses) + '</h4>';

    var hasWeakness = false;

    if (recommendations.grammarTopics.length > 0) {
      hasWeakness = true;
      html += '<div class="level-weakness-list">';
      for (var gi = 0; gi < recommendations.grammarTopics.length; gi++) {
        var gt = recommendations.grammarTopics[gi];
        var wrongPct = gt.total > 0 ? Math.round((gt.count / gt.total) * 100) : 0;
        html += '<div class="level-weakness-item">';
        html += '<div class="level-weakness-header">';
        html += '❌ <strong>' + escapeHtml(gt.grammar) + '</strong> — ' + gt.count + '/' + gt.total + ' (' + wrongPct + '%)';
        html += '</div>';
        html += '<div class="level-weakness-links">';
        if (gt.link) {
          html += '<a href="' + gt.link + '" class="level-link level-grammar-link">📘 ' + escapeHtml(txt.reviewGrammar) + '</a>';
        }
        var seenLessons = {};
        for (var lk in gt.lessons) {
          var lessonInfo = gt.lessons[lk];
          if (!seenLessons[lessonInfo.lesson]) {
            seenLessons[lessonInfo.lesson] = true;
            html += '<a href="' + lessonInfo.lessonLink + '" class="level-link level-lesson-link">📕 ' + escapeHtml(txt.studyLesson) + ': ' + escapeHtml(lessonInfo.lesson) + '</a>';
            html += '<a href="' + lessonInfo.exerciseLink + '" class="level-link level-exercise-link">📝 ' + escapeHtml(txt.doExercises) + '</a>';
          }
        }
        html += '</div></div>';
      }
      html += '</div>';
    }

    if (recommendations.lessonTopics.length > 0) {
      hasWeakness = true;
      html += '<div class="level-weakness-list">';
      for (var li2 = 0; li2 < recommendations.lessonTopics.length; li2++) {
        var lt = recommendations.lessonTopics[li2];
        html += '<div class="level-weakness-item">';
        html += '<div class="level-weakness-header">❌ <strong>' + escapeHtml(lt.lesson) + '</strong> (' + lt.count + ' ' + (en ? 'errors' : 'أخطاء') + ')</div>';
        html += '<div class="level-weakness-links">';
        html += '<a href="' + lt.lessonLink + '" class="level-link level-lesson-link">📕 ' + escapeHtml(txt.studyLesson) + '</a>';
        html += '<a href="' + lt.exerciseLink + '" class="level-link level-exercise-link">📝 ' + escapeHtml(txt.doExercises) + '</a>';
        html += '</div></div>';
      }
      html += '</div>';
    }

    if (!hasWeakness) {
      html += '<p class="level-no-items">' + escapeHtml(txt.noWeakness) + '</p>';
    }
    html += '</div>';

    // ── 4. نقاط القوة ──
    var strengths = getStrengths(results);
    html += '<div class="level-strengths">';
    html += '<h4>🟢 ' + escapeHtml(txt.strengths) + '</h4>';

    if (strengths.length > 0) {
      html += '<div class="level-strength-list">';
      for (var si = 0; si < strengths.length; si++) {
        var st = strengths[si];
        html += '<div class="level-strength-item">✅ <strong>' + escapeHtml(st.label) + '</strong> — ' + st.correct + '/' + st.total + ' (' + st.pct + '%)</div>';
      }
      html += '</div>';
    } else {
      html += '<p class="level-no-items">' + (en ? 'Keep practicing!' : 'استمر في التدريب!') + '</p>';
    }
    html += '</div>';

    // ── 5. التوصية ──
    html += '<div class="level-recommendation">';
    html += '<h4>💡 ' + escapeHtml(txt.recommendation) + '</h4>';
    html += '<div class="level-recommendation-body">';

    var levelKey = levelResult.key;
    if (levelKey === 'belowA1') {
      html += '<p>' + (en ? 'Start from the very beginning — A1 Level, Lesson 1.' : 'ابدأ من البداية تماماً — المستوى A1، الدرس 1.') + '</p>';
      html += '<a href="../a1/kursbuch/lektion-01/" class="level-recommendation-btn">📕 ' + escapeHtml(txt.recommendStart) + ' Lektion 1</a>';
    } else if (levelKey === 'A1') {
      html += '<p>' + (en ? 'You have basic A1 knowledge. Start from A1 and review the weak areas above.' : 'لديك معرفة أساسية بمستوى A1. ابدأ من A1 وراجع نقاط الضعف أعلاه.') + '</p>';
      html += '<a href="../a1/kursbuch/lektion-01/" class="level-recommendation-btn">📕 ' + escapeHtml(txt.recommendStart) + ' A1 Lektion 1</a>';
    } else if (levelKey === 'A2') {
      html += '<p>' + (en ? 'You have solid A1 and are ready for A2. Review the grammar topics listed above that you missed.' : 'مستوى A1 لديك جيد وأنت جاهز لـ A2. راجع القواعد التي أخطأت فيها أعلاه.') + '</p>';
      html += '<a href="../a2/kursbuch/lektion-01/" class="level-recommendation-btn">📕 ' + escapeHtml(txt.recommendStart) + ' A2 Lektion 1</a>';
      if (recommendations.grammarTopics.length > 0) {
        html += '<p class="level-recommendation-note">' + escapeHtml(txt.recommendReview) + '</p>';
      }
    } else {
      html += '<p>' + escapeHtml(txt.recommendGreat) + '</p>';
      html += '<a href="../a2/kursbuch/lektion-01/" class="level-recommendation-btn">📕 ' + (en ? 'Continue with A2+' : 'استمر مع A2+') + '</a>';
    }

    html += '</div></div>';

    // ── 6. مراجعة الإجابات الخاطئة (كمرجع) ──
    var wrongResults = results.filter(function (r) { return !r.correct; });
    if (wrongResults.length > 0) {
      html += '<div class="level-review-section">';
      html += '<h4>📋 ' + (en ? 'Review Incorrect Answers' : 'مراجعة الإجابات الخاطئة') + '</h4>';
      html += '<div class="level-review-list">';
      for (var wi = 0; wi < wrongResults.length; wi++) {
        var wr = wrongResults[wi];
        var stem = en ? wr.question.stemEn : wr.question.stemAr;
        var displayAnswer = wr.question.type === 'choice'
          ? wr.question.answer + '. ' + wr.question.options[OPTION_LABELS.indexOf(wr.question.answer)]
          : wr.question.answer;
        html += '<div class="level-review-item">';
        html += '<span class="level-review-wrong">❌</span> ';
        html += '<span class="level-review-question">' + escapeHtml(stem) + '</span><br>';
        html += '<span class="level-review-correct">' + escapeHtml(txt.correct) + ': <strong>' + escapeHtml(displayAnswer) + '</strong></span>';
        if (wr.question.grammar) {
          html += ' <a href="' + wr.question.grammarLink + '" class="level-link level-grammar-link">📘 ' + escapeHtml(wr.question.grammar) + '</a>';
        }
        html += '</div>';
      }
      html += '</div></div>';
    }

    // ── 7. أزرار إجراء ──
    html += '<div class="level-dashboard-actions">';
    html += '<button class="level-retry-btn">' + escapeHtml(txt.retakeTest) + '</button>';
    html += '</div>';

    dashboard.innerHTML = html;
    dashboard.style.display = 'block';

    // ربط زر إعادة الاختبار
    var retryBtn = dashboard.querySelector('.level-retry-btn');
    if (retryBtn) {
      retryBtn.addEventListener('click', function () {
        resetTest(container);
      });
    }

    // التمرير إلى Dashboard
    dashboard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /** استخراج نقاط القوة (تصنيف حسب القاعدة/الدرس) */
  function getStrengths(results) {
    var correctByGrammar = {};
    var totalByGrammar = {};

    for (var i = 0; i < results.length; i++) {
      var r = results[i];
      var label = r.question.grammar || r.question.lesson;
      if (!totalByGrammar[label]) {
        totalByGrammar[label] = 0;
        correctByGrammar[label] = 0;
      }
      totalByGrammar[label]++;
      if (r.correct) correctByGrammar[label]++;
    }

    var strengths = [];
    for (var key in totalByGrammar) {
      var pct = Math.round((correctByGrammar[key] / totalByGrammar[key]) * 100);
      if (pct >= 80) {
        strengths.push({
          label: key,
          correct: correctByGrammar[key],
          total: totalByGrammar[key],
          pct: pct
        });
      }
    }

    strengths.sort(function (a, b) { return b.pct - a.pct; });
    return strengths;
  }

  // ── إعادة الاختبار ───────────────────────────────

  function resetTest(container) {
    // إظهار الاختبار وإخفاء النتائج
    var dashboard = container.querySelector('.level-dashboard');
    if (dashboard) {
      dashboard.style.display = 'none';
      dashboard.innerHTML = '';
    }

    // إعادة تمكين ومسح جميع المدخلات
    container.querySelectorAll('.level-radio').forEach(function (r) {
      r.disabled = false;
      r.checked = false;
    });
    container.querySelectorAll('.level-text-input').forEach(function (inp) {
      inp.disabled = false;
      inp.value = '';
    });

    // إعادة الزر
    var btn = container.querySelector('.level-submit-btn');
    var txt = l10n();
    btn.textContent = txt.submit;
    btn.classList.remove('reset-mode');

    // تمرير لأعلى
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ── الإقلاع ──────────────────────────────────────

  function init() {
    var container = document.querySelector('.level-assessment');
    if (!container) return;

    buildTest(container);

    var btn = container.querySelector('.level-submit-btn');
    if (btn) {
      btn.addEventListener('click', function () {
        if (btn.classList.contains('reset-mode')) {
          resetTest(container);
          return;
        }
        gradeTest(container);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
