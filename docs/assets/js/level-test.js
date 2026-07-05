/**
 * Level Assessment (Einstufungstest) — v2.0
 * =========================================
 *
 * نظام فحص المستوى التفاعلي المستوحى من DW:
 *   - سؤال واحد في كل خطوة (بدل 30 سؤالاً في صفحة)
 *   - تصحيح فوري بعد كل إجابة
 *   - قصص سياقية مع إيموجيات لكل سؤال
 *   - شريط تقدم + عداد الأسئلة
 *   - 4 أنواع: اختيار، نص، ترتيب كلمات، مطابقة
 *   - Dashboard شامل بنقاط القوة والضعف والتوصيات
 */

(function () {
  'use strict';

  // Early exit — self-guard: only run on the level assessment page
  // يتحقق من وجود عنصر level-assessment لمنع تشغيل مستوى.js
  // في صفحات الدروس، القواعد، Übungsbuch، والصفحات الأخرى غير المطلوبة.
  if (!document.querySelector('.level-assessment')) return;

  // ── الوضعيات ──
  var STATE_INTRO  = -1;
  var STATE_QUIZ   = 0;
  var STATE_DONE   = 99;

  var currentStep = STATE_INTRO;
  var userAnswers = [];
  var answeredCurrent = false;
  var container = null;

  // ── تحديد اللغة ──

  function isEnglishPage() {
    return window.location.pathname.indexOf('/en/') === 0;
  }

  function l10n() {
    var en = isEnglishPage();
    return {
      introTitle:    en ? '📝 Level Assessment (Einstufungstest)' : '📝 فحص المستوى (Einstufungstest)',
      introDesc:     en ? 'Answer <strong>42 questions</strong> to discover your German level. After completing the test, you will receive a detailed report with your estimated level, strengths, weaknesses, and personalised recommendations linked to lessons and grammar topics.'
                        : 'أجب عن <strong>42 سؤالاً</strong> لتعرف مستواك في اللغة الألمانية. بعد إكمال الاختبار، ستحصل على تقرير مفصل بمستواك التقديري، نقاط قوتك وضعفك، وتوصيات مخصصة مع روابط للدروس والقواعد.',
      introDuration: en ? '⏱ Duration: about 15 minutes' : '⏱ المدة: حوالي 15 دقيقة',
      introQCount:   en ? '📊 42 questions · 6 sections' : '📊 42 سؤالاً · 6 أقسام',
      startBtn:      en ? '▶️ Start Assessment' : '▶️ بدء الاختبار',
      nextBtn:       en ? '▶️ Next' : '▶️ التالي',
      finishBtn:     en ? '🏁 Finish & See Results' : '🏁 إنهاء وعرض النتائج',
      checkBtn:      en ? '✓ Check' : '✓ تحقق',
      resetBtn:      en ? '↺ Reset' : '↺ إعادة',
      removeBtn:     en ? '✕' : '✕',
      correctFeedback: en ? '✅ Correct!' : '✅ صحيح!',
      wrongFeedback:   en ? '❌ Incorrect' : '❌ خطأ',
      correctIs:       en ? 'The correct answer is:' : 'الإجابة الصحيحة هي:',
      yourAnswer:      en ? 'Your answer:' : 'إجابتك:',
      explanation:     en ? 'Explanation:' : 'الشرح:',
      retake:          en ? '🔄 Retake Test' : '🔄 إعادة الاختبار',

      // Dashboard translations (same as v1)
      dashboardTitle:  en ? '🏆 Your Results' : '🏆 نتيجتك',
      overallScore:    en ? 'Overall Score' : 'النتيجة الإجمالية',
      yourLevel:       en ? 'Estimated Level' : 'المستوى التقديري',
      levelBelowA1:    en ? 'Below A1 (Beginner)' : 'أقل من A1 (مبتدئ كامل)',
      levelA1:         en ? 'A1 — Beginner' : 'A1 — مبتدئ',
      levelA2:         en ? 'A2 — Elementary' : 'A2 — متوسط',
      levelB1:         en ? 'B1 — Intermediate' : 'B1 — متوسط متقدم',
      perLevel:        en ? 'Performance by Level' : 'الأداء حسب المستوى',
      weaknesses:      en ? '📘 Weaknesses — Topics to Review' : '📘 نقاط الضعف — تحتاج مراجعة',
      strengths:       en ? '🟢 Strengths — What You Know Well' : '🟢 نقاط القوة — ما تجيده',
      recommendation:  en ? '💡 Recommendation' : '💡 التوصية',
      studyLesson:     en ? '📕 Study Lesson' : '📕 ادرس الدرس',
      reviewGrammar:   en ? '📘 Review Grammar' : '📘 راجع القاعدة',
      doExercises:     en ? '📝 Do Exercises' : '📝 حل التمارين',
      noWeakness:      en ? '🌟 No major weaknesses found!' : '🌟 لا توجد نقاط ضعف ملحوظة!',
      recommendStart:  en ? 'Start from' : 'ابدأ من',
      recommendReview: en ? 'Review these topics before moving on' : 'راجع هذه المواضيع قبل الانتقال',
      recommendGreat:  en ? 'You are ready for the next level! 🎉' : 'أنت جاهز للمستوى التالي! 🎉',
      allCorrect:      en ? '🎉 All correct! Excellent work!' : '🎉 كل الإجابات صحيحة! عمل ممتاز!',
      correctLabel:    en ? '✅ Correct' : '✅ صحيح',
      wrongLabel:      en ? '❌ Wrong' : '❌ خطأ',
      totalScore:      en ? 'Total Score' : 'النتيجة الإجمالية'
    };
  }

  // ── أدوات مساعدة ──

  function escapeHtml(str) {
    if (str == null) return '';
    var d = document.createElement('div');
    d.appendChild(document.createTextNode(String(str)));
    return d.innerHTML;
  }

  var OPTION_LABELS = ['A', 'B', 'C', 'D'];

  // خلط الخيارات لتوزيع الإجابات الصحيحة على A/B/C/D
  function shuffleOptions() {
    for (var i = 0; i < QUESTIONS.length; i++) {
      var qd = QUESTIONS[i];
      if (qd.type !== 'choice') continue;
      var n = qd.options.length;
      if (n < 2) continue;
      // نستخدم index السؤال كـ seed لخلط موحد (نفس الترتيب كل مرة)
      var shift = (i + 1) % n;
      if (shift === 0) continue;
      // تدوير الخيارات يساراً
      var rotated = [];
      for (var j = 0; j < n; j++) {
        rotated[j] = qd.options[(j + shift) % n];
      }
      qd.options = rotated;
      // حفظ موقع الإجابة الصحيحة الأصلي قبل الخلط (بدلاً من افتراض index 0)
      var originalIdx = OPTION_LABELS.indexOf(qd.answer);
      // بعد التدوير، نحسب الموقع الجديد للإجابة الصحيحة
      var newIdx = (originalIdx - shift + n) % n;
      qd.answer = OPTION_LABELS[newIdx];
    }
  }

  // ── بيانات الأسئلة (42 سؤالاً) ──
  //
  // كل سؤال له:
  //   sceneEmoji 🎬 — إيموجي يمثل السياق
  //   sceneAr/sceneEn — قصة سياقية قصيرة
  //   type: 'choice' | 'text' | 'order'
  //   metadata: level, grammar, lesson, links (للتوصيات)

  var QUESTIONS = [
    // ═══════════════════════════════════════════════
    // القسم 1: Wortschatz — المفردات (8 أسئلة)
    // ═══════════════════════════════════════════════

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
    {
      section: 1, q: 5, type: 'choice', level: 'A2',
      sceneEmoji: '🏢',
      sceneAr: 'في مقابلة عمل في شركة Siemens.',
      sceneEn: 'At a job interview at Siemens.',
      stemAr: 'أكمل: Ich ___ (arbeiten) bei Siemens.',
      stemEn: 'Complete: I ___ at Siemens.',
      options: ['arbeite', 'arbeitet', 'arbeiten'],
      answer: 'A',
      feedbackAr: 'Ich → arbeite (تصريف الفعل للمفرد المتكلم). Eich arbeitet ≠ ich arbeite.',
      feedbackEn: 'Ich → arbeite (first person singular conjugation). Remember: ich arbeite, er arbeitet.',
      grammar: 'Verbkonjugation', grammarLink: '../grammatik/verbkonjugation/',
      lesson: 'A2 Lektion 2', lessonLink: '../a2/kursbuch/lektion-02/',
      exerciseLink: '../a2/ubungsbuch/lektion-02/'
    },
    {
      section: 1, q: 6, type: 'choice', level: 'A2',
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
    {
      section: 1, q: 7, type: 'choice', level: 'A2',
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
    {
      section: 1, q: 8, type: 'choice', level: 'B1',
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

    // ═══════════════════════════════════════════════
    // القسم 2: Grammatik — القواعد (12 سؤالاً)
    // ═══════════════════════════════════════════════

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
      feedbackAr: 'er/sie/es → heiẞt. التصريف الصحيح للغائب المفرد.',
      feedbackEn: 'er/sie/es → heißt. Correct third-person singular conjugation.',
      grammar: 'Verbkonjugation', grammarLink: '../grammatik/verbkonjugation/',
      lesson: 'Lektion 1', lessonLink: '../a1/kursbuch/lektion-01/',
      exerciseLink: '../a1/ubungsbuch/lektion-01/'
    },
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
    {
      section: 2, q: 5, type: 'choice', level: 'A2',
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
    {
      section: 2, q: 6, type: 'choice', level: 'A2',
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
    {
      section: 2, q: 7, type: 'choice', level: 'A2',
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
    {
      section: 2, q: 8, type: 'choice', level: 'A2',
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
    {
      section: 2, q: 9, type: 'choice', level: 'A2',
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
    {
      section: 2, q: 10, type: 'choice', level: 'A2',
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
    {
      section: 2, q: 11, type: 'choice', level: 'B1',
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
    {
      section: 2, q: 12, type: 'choice', level: 'B1',
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

    // ═══════════════════════════════════════════════
    // القسم 3: Satzbau — تركيب الجمل (5 أسئلة)
    // ═══════════════════════════════════════════════

    {
      section: 3, q: 1, type: 'order', level: 'A1',
      sceneEmoji: '🧩',
      sceneAr: 'تتعلم ترتيب الكلمات في الجملة الألمانية.',
      sceneEn: 'Learning German word order.',
      stemAr: 'رتب الكلمات لتكوين جملة صحيحة:',
      stemEn: 'Arrange the words to form a correct sentence:',
      orderWords: ['Ich', 'heiße', 'Ahmed'],
      answer: ['Ich', 'heiße', 'Ahmed'],
      feedbackAr: 'في الألمانية، الفعل هو العنصر الثاني في الجملة الخبرية: Ich heiße Ahmed.',
      feedbackEn: 'In German, the verb is the second element in a declarative sentence: Ich heiße Ahmed.',
      grammar: 'Satzbau', grammarLink: '../grammatik/satzbau/',
      lesson: 'Lektion 1', lessonLink: '../a1/kursbuch/lektion-01/',
      exerciseLink: '../a1/ubungsbuch/lektion-01/'
    },
    {
      section: 3, q: 2, type: 'order', level: 'A1',
      sceneEmoji: '🧩',
      sceneAr: 'تتعلم قاعدة الفعل في الموضع الثاني.',
      sceneEn: 'Learning the verb-second position rule.',
      stemAr: 'رتب الكلمات لتكوين جملة تبدأ بـ "اليوم":',
      stemEn: 'Arrange the words to form a sentence starting with "today":',
      orderWords: ['Heute', 'gehe', 'ich'],
      answer: ['Heute', 'gehe', 'ich'],
      feedbackAr: 'عند بدء الجملة بـ "heute"، يبقى الفعل في الموضع الثاني: Heute gehe ich.',
      feedbackEn: 'When starting with "heute", the verb stays in position 2: Heute gehe ich.',
      grammar: 'Satzbau', grammarLink: '../grammatik/satzbau/',
      lesson: 'Lektion 5', lessonLink: '../a1/kursbuch/lektion-05/',
      exerciseLink: '../a1/ubungsbuch/lektion-05/'
    },
    {
      section: 3, q: 3, type: 'choice', level: 'A2',
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
    {
      section: 3, q: 4, type: 'choice', level: 'A2',
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
    {
      section: 3, q: 5, type: 'order', level: 'A2',
      sceneEmoji: '🚄',
      sceneAr: 'تتحدث عن خطط السفر إلى برلين.',
      sceneEn: 'Talking about travel plans to Berlin.',
      stemAr: 'رتب الكلمات لتكوين جملة صحيحة:',
      stemEn: 'Arrange the words to form a correct sentence:',
      orderWords: ['Ich', 'will', 'morgen', 'nach Berlin', 'fahren'],
      answer: ['Ich', 'will', 'morgen', 'nach Berlin', 'fahren'],
      feedbackAr: 'فعل المودال (will) في الموضع الثاني، والفعل الرئيسي (fahren) في آخر الجملة.',
      feedbackEn: 'Modal verb (will) in position 2, main verb (fahren) at the end.',
      grammar: 'Wortstellung', grammarLink: '../grammatik/wortstellung-erweitert/',
      lesson: 'A2 Lektion 11', lessonLink: '../a2/kursbuch/lektion-11/',
      exerciseLink: '../a2/ubungsbuch/lektion-11/'
    },

    // ═══════════════════════════════════════════════
    // القسم 4: Kommunikation — التواصل (5 أسئلة)
    // ═══════════════════════════════════════════════

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
    {
      section: 4, q: 3, type: 'choice', level: 'A2',
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
    {
      section: 4, q: 4, type: 'choice', level: 'A2',
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
    {
      section: 4, q: 5, type: 'choice', level: 'A2',
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
    // ═══════════════════════════════════════════════
    // القسم 5: Hörverstehen — الفهم السمعي (6 أسئلة)
    // ═══════════════════════════════════════════════

    {
    section: 5, q: 1, type: 'choice', level: 'A2',
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
  {
    section: 5, q: 2, type: 'choice', level: 'A2',
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
  {
    section: 5, q: 3, type: 'choice', level: 'A2',
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
  {
    section: 5, q: 4, type: 'choice', level: 'A2',
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
  {
    section: 5, q: 5, type: 'choice', level: 'A2',
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
  {
    section: 5, q: 6, type: 'choice', level: 'A2',
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

  // ═══════════════════════════════════════════════
  // القسم 6: Leseverstehen — الفهم القرائي (6 أسئلة)
  // ═══════════════════════════════════════════════

  {
    section: 6, q: 1, type: 'choice', level: 'A2',
    sceneEmoji: '👩‍🎓',
    sceneAr: 'تقرأ تعريفاً عن شخص ألماني.',
    sceneEn: 'Reading a self-introduction by a German person.',
    passageTitle: 'Lena aus Berlin',
    passageText: 'Hallo! Ich heiße Lena und wohne in Berlin. Ich bin 25 Jahre alt und studiere Medizin an der Freien Universität. Ich wohne mit zwei Freundinnen in einer WG in Kreuzberg. Meine Hobbys sind Schwimmen, Lesen und Kochen. Am Wochenende fahre ich oft mit dem Fahrrad in den Park.',
    stemAr: 'اقرأ النص ثم أجب: كم عمر Lena؟',
    stemEn: 'Read the text and answer: How old is Lena?',
    options: ['22', '23', '25'],
    answer: 'C',
    feedbackAr: 'في النص: "Ich bin 25 Jahre alt" — عمر Lena هو 25 سنة.',
    feedbackEn: 'In the text: "Ich bin 25 Jahre alt" — Lena is 25 years old.',
    grammar: null, grammarLink: null,
    lesson: 'A1 Lektion 1', lessonLink: '../a1/kursbuch/lektion-01/',
    exerciseLink: '../a1/ubungsbuch/lektion-01/'
  },
  {
    section: 6, q: 2, type: 'choice', level: 'A2',
    sceneEmoji: '👩‍🎓',
    sceneAr: 'تقرأ المزيد عن Lena.',
    sceneEn: 'Reading more about Lena.',
    passageTitle: 'Lena aus Berlin',
    passageText: 'Hallo! Ich heiße Lena und wohne in Berlin. Ich bin 25 Jahre alt und studiere Medizin an der Freien Universität. Ich wohne mit zwei Freundinnen in einer WG in Kreuzberg. Meine Hobbys sind Schwimmen, Lesen und Kochen. Am Wochenende fahre ich oft mit dem Fahrrad in den Park.',
    stemAr: 'اقرأ النص ثم أجب: مع من تسكن Lena؟',
    stemEn: 'Read the text and answer: Who does Lena live with?',
    options: ['Allein', 'Mit Freundinnen', 'Mit der Familie'],
    answer: 'B',
    feedbackAr: 'في النص: "Ich wohne mit zwei Freundinnen in einer WG" — تسكن مع صديقاتها.',
    feedbackEn: 'In the text: "Ich wohne mit zwei Freundinnen in einer WG" — she lives with friends.',
    grammar: null, grammarLink: null,
    lesson: 'A1 Lektion 1', lessonLink: '../a1/kursbuch/lektion-01/',
    exerciseLink: '../a1/ubungsbuch/lektion-01/'
  },
  {
    section: 6, q: 3, type: 'choice', level: 'A2',
    sceneEmoji: '👩‍🎓',
    sceneAr: 'تقرأ عن هوايات Lena.',
    sceneEn: 'Reading about Lena\'s hobbies.',
    passageTitle: 'Lena aus Berlin',
    passageText: 'Hallo! Ich heiße Lena und wohne in Berlin. Ich bin 25 Jahre alt und studiere Medizin an der Freien Universität. Ich wohne mit zwei Freundinnen in einer WG in Kreuzberg. Meine Hobbys sind Schwimmen, Lesen und Kochen. Am Wochenende fahre ich oft mit dem Fahrrad in den Park.',
    stemAr: 'اقرأ النص ثم أجب: ماذا تفعل Lena في عطلة نهاية الأسبوع؟',
    stemEn: 'Read the text and answer: What does Lena do on weekends?',
    options: ['Ins Kino gehen', 'Mit dem Fahrrad in den Park fahren', 'Zu Hause lernen'],
    answer: 'B',
    feedbackAr: 'في النص: "Am Wochenende fahre ich oft mit dem Fahrrad in den Park" — تذهب بالدراجة إلى الحديقة.',
    feedbackEn: 'In the text: "Am Wochenende fahre ich oft mit dem Fahrrad in den Park" — she rides her bike to the park.',
    grammar: null, grammarLink: null,
    lesson: 'A1 Lektion 5', lessonLink: '../a1/kursbuch/lektion-05/',
    exerciseLink: '../a1/ubungsbuch/lektion-05/'
  },
  {
    section: 6, q: 4, type: 'choice', level: 'A2',
    sceneEmoji: '🏛️',
    sceneAr: 'تقرأ عن مدينة ميونخ.',
    sceneEn: 'Reading about the city of Munich.',
    passageTitle: 'Ein Tag in München',
    passageText: 'München ist eine schöne Stadt in Süddeutschland. Der Marienplatz ist der zentrale Platz. Hier steht das Neue Rathaus mit dem berühmten Glockenspiel. Jeden Tag um 12 und um 17 Uhr spielt das Glockenspiel und viele Touristen schauen zu. Vom Marienplatz aus kannst du in die umliegenden Geschäfte und Cafés gehen.',
    stemAr: 'اقرأ النص ثم أجب: أين يقع مبنى البلدية الجديد (Neue Rathaus)؟',
    stemEn: 'Read the text and answer: Where is the Neue Rathaus located?',
    options: ['Am Flughafen', 'Am Marienplatz', 'Am Hauptbahnhof'],
    answer: 'B',
    feedbackAr: 'في النص: "Der Marienplatz ist der zentrale Platz. Hier steht das Neue Rathaus" — في Marienplatz.',
    feedbackEn: 'In the text: "Der Marienplatz ist der zentrale Platz. Hier steht das Neue Rathaus" — at Marienplatz.',
    grammar: null, grammarLink: null,
    lesson: 'A2 Lektion 10', lessonLink: '../a2/kursbuch/lektion-10/',
    exerciseLink: '../a2/ubungsbuch/lektion-10/'
  },
  {
    section: 6, q: 5, type: 'choice', level: 'A2',
    sceneEmoji: '🏛️',
    sceneAr: 'تقرأ عن Glockenspiel في ميونخ.',
    sceneEn: 'Reading about the Glockenspiel in Munich.',
    passageTitle: 'Ein Tag in München',
    passageText: 'München ist eine schöne Stadt in Süddeutschland. Der Marienplatz ist der zentrale Platz. Hier steht das Neue Rathaus mit dem berühmten Glockenspiel. Jeden Tag um 12 und um 17 Uhr spielt das Glockenspiel und viele Touristen schauen zu. Vom Marienplatz aus kannst du in die umliegenden Geschäfte und Cafés gehen.',
    stemAr: 'اقرأ النص ثم أجب: في أي وقت يعزف Glockenspiel؟',
    stemEn: 'Read the text and answer: At what times does the Glockenspiel play?',
    options: ['Um 10 und 15 Uhr', 'Um 12 und 17 Uhr', 'Um 9 und 18 Uhr'],
    answer: 'B',
    feedbackAr: 'في النص: "Jeden Tag um 12 und um 17 Uhr spielt das Glockenspiel" — الساعة 12 و 17.',
    feedbackEn: 'In the text: "Jeden Tag um 12 und um 17 Uhr spielt das Glockenspiel" — at 12 and 17 o\'clock.',
    grammar: null, grammarLink: null,
    lesson: 'A2 Lektion 10', lessonLink: '../a2/kursbuch/lektion-10/',
    exerciseLink: '../a2/ubungsbuch/lektion-10/'
  },
  {
    section: 6, q: 6, type: 'choice', level: 'A2',
    sceneEmoji: '🏛️',
    sceneAr: 'تقرأ عن محلات ومقاهي Marienplatz.',
    sceneEn: 'Reading about shops and cafés around Marienplatz.',
    passageTitle: 'Ein Tag in München',
    passageText: 'München ist eine schöne Stadt in Süddeutschland. Der Marienplatz ist der zentrale Platz. Hier steht das Neue Rathaus mit dem berühmten Glockenspiel. Jeden Tag um 12 und um 17 Uhr spielt das Glockenspiel und viele Touristen schauen zu. Vom Marienplatz aus kannst du in die umliegenden Geschäfte und Cafés gehen.',
    stemAr: 'اقرأ النص ثم أجب: ماذا يوجد حول Marienplatz؟',
    stemEn: 'Read the text and answer: What is around Marienplatz?',
    options: ['Geschäfte und Cafés', 'Einen großen Park', 'Ein Schwimmbad'],
    answer: 'A',
    feedbackAr: 'في النص: "Vom Marienplatz aus kannst du in die umliegenden Geschäfte und Cafés gehen" — محلات ومقاهي.',
    feedbackEn: 'In the text: "Vom Marienplatz aus kannst du in die umliegenden Geschäfte und Cafés gehen" — shops and cafés.',
    grammar: null, grammarLink: null,
    lesson: 'A2 Lektion 10', lessonLink: '../a2/kursbuch/lektion-10/',
    exerciseLink: '../a2/ubungsbuch/lektion-10/'
  }
  ];

  // ── بيانات الأقسام ──

  var SECTIONS = [
    { id: 1, slug: 'wortschatz', icon: '🆕', titleAr: 'المفردات', titleEn: 'Vocabulary' },
    { id: 2, slug: 'grammatik', icon: '📘', titleAr: 'القواعد', titleEn: 'Grammar' },
    { id: 3, slug: 'satzbau', icon: '🏗️', titleAr: 'تركيب الجمل', titleEn: 'Sentence Structure' },
    { id: 4, slug: 'kommunikation', icon: '💬', titleAr: 'التواصل', titleEn: 'Communication' },
    { id: 5, slug: 'horverstehen', icon: '🗣️', titleAr: 'الفهم السمعي', titleEn: 'Listening' },
    { id: 6, slug: 'leseverstehen', icon: '📖', titleAr: 'الفهم القرائي', titleEn: 'Reading' }
  ];

  // ── دوال العرض الأساسية ──

  function showIntro() {
    var en = isEnglishPage();
    var txt = l10n();

    container.innerHTML = '';

    var introDiv = document.createElement('div');
    introDiv.className = 'level-intro-screen';

    introDiv.innerHTML =
      '<div class="level-intro-card">' +
        '<div class="level-intro-icon">📋</div>' +
        '<h2 class="level-intro-title">' + escapeHtml(txt.introTitle) + '</h2>' +
        '<p class="level-intro-desc">' + txt.introDesc + '</p>' +
        '<div class="level-intro-meta">' +
          '<span class="level-intro-badge">' + escapeHtml(txt.introQCount) + '</span>' +
          '<span class="level-intro-badge">' + escapeHtml(txt.introDuration) + '</span>' +
        '</div>' +
        '<div class="level-intro-sections">' +
          renderIntroSections(en) +
        '</div>' +
        '<button class="level-start-btn">' + escapeHtml(txt.startBtn) + '</button>' +
      '</div>';

    container.appendChild(introDiv);

    introDiv.querySelector('.level-start-btn').addEventListener('click', function () {
      startTest();
    });

    currentStep = STATE_INTRO;
  }

  function renderIntroSections(en) {
    var html = '';
    for (var i = 0; i < SECTIONS.length; i++) {
      var s = SECTIONS[i];
      var count = QUESTIONS.filter(function (q) { return q.section === s.id; }).length;
      var title = en ? s.titleEn : s.titleAr;
      html += '<div class="level-intro-section-badge">' +
        '<span class="level-intro-sec-icon">' + s.icon + '</span> ' +
        escapeHtml(title) + ' <span class="level-intro-q-count">(' + count + ')</span>' +
      '</div>';
    }
    return html;
  }

  function startTest() {
    currentStep = 0;
    userAnswers = new Array(QUESTIONS.length);
    answeredCurrent = false;
    renderQuestion();
  }

  // ── عرض السؤال ──

  function renderQuestion() {
    if (currentStep >= QUESTIONS.length) {
      showDashboard();
      return;
    }

    var qd = QUESTIONS[currentStep];
    var en = isEnglishPage();
    var txt = l10n();

    container.innerHTML = '';

    // ── شريط التقدم ──
    var progressPct = Math.round((currentStep / QUESTIONS.length) * 100);
    var sectionInfo = SECTIONS[qd.section - 1];
    var sectionTitle = en ? sectionInfo.titleEn : sectionInfo.titleAr;

    var progressHtml =
      '<div class="level-progress-wrapper">' +
        '<div class="level-progress-header">' +
          '<span class="level-progress-section">' + sectionInfo.icon + ' ' + escapeHtml(sectionTitle) + '</span>' +
          '<span class="level-progress-count">' + (currentStep + 1) + ' / ' + QUESTIONS.length + '</span>' +
        '</div>' +
        '<div class="level-progress-track">' +
          '<div class="level-progress-fill" style="width:' + progressPct + '%"></div>' +
        '</div>' +
      '</div>';

    container.insertAdjacentHTML('beforeend', progressHtml);

    // ── بطاقة السياق ──
    var sceneText = en ? qd.sceneEn : qd.sceneAr;
    var contextHtml =
      '<div class="level-scene-card">' +
        '<div class="level-scene-emoji">' + qd.sceneEmoji + '</div>' +
        '<p class="level-scene-text">' + escapeHtml(sceneText) + '</p>' +
      '</div>';

    container.insertAdjacentHTML('beforeend', contextHtml);

    // ── بطاقة النص القرائي (passage) للأسئلة القرائية ──
    if (qd.passageText) {
      var passageTitle = qd.passageTitle || '';
      var passageSource = qd.passageSource ? '<p class="level-passage-source">' + escapeHtml(qd.passageSource) + '</p>' : '';
      var passageHtml =
        '<div class="level-passage-card">' +
          (passageTitle ? '<h4 class="level-passage-title">' + escapeHtml(passageTitle) + '</h4>' : '') +
          '<div class="level-passage-text" dir="ltr">' + escapeHtml(qd.passageText) + '</div>' +
          passageSource +
        '</div>';
      container.insertAdjacentHTML('beforeend', passageHtml);
    }

    // ── بطاقة السؤال ──
    var questionCard = document.createElement('div');
    questionCard.className = 'level-question-card';

    var stem = en ? qd.stemEn : qd.stemAr;
    var escapedStem = escapeHtml(stem);
    // ── معالجة الاتجاه (Bidirectional / Bidi) ──
    // في الصفحة العربية (RTL)، تتعرض ___ والنصوص اللاتينية/الألمانية
    // لإعادة ترتيب بواسطة Unicode Bidirectional Algorithm.
    // الحل: نعزل النص اللاتيني عن سياق RTL باستخدام <bdi dir="ltr">
    //
    // حالتان:
    // 1. النص خالص لاتيني (بدون حروف عربية) → نلفّ كامل النص في <bdi dir="ltr">
    // 2. النص مختلط (عربي + لاتيني) → نلفّ المقطع اللاتيني المتصل الذي يحتوي على ___
    var stemHasArabic = /[؀-ۿ]/.test(stem);
    if (stemHasArabic && stem.indexOf('___') >= 0) {
      // مختلط (عربي + لاتيني): عزل المقطع اللاتيني المتصل الذي يحتوي على ___
      // (النص اللاتيني قبل وبعد ___، مثال: "Ich ___ aus Spanien." كلها في bdi واحد)
      escapedStem = escapedStem.replace(/[\w\s().,;:\/'\"!?À-ÿ-]*___[\w\s().,;:\/'\"!?À-ÿ-]*/g, '<bdi dir="ltr">$&</bdi>');
    } else if (!stemHasArabic && stem.indexOf('___') >= 0) {
      // خالص لاتيني: لفّ كامل الجملة لمنع bidi من عكس ترتيبها في سياق RTL
      escapedStem = '<bdi dir="ltr">' + escapedStem + '</bdi>';
    }
    var questionHtml = '<h3 class="level-question-stem">' + escapedStem + '</h3>';

    // زر الصوت للأسئلة الصوتية
    if (qd.audio) {
      questionHtml +=
        '<div class="level-audio-wrapper">' +
          '<button class="level-audio-btn" data-audio-text="' + escapeHtml(qd.audioText) + '">' +
            '<span class="level-audio-icon">🔊</span> ' +
            '<span class="level-audio-label">' + escapeHtml(en ? 'Listen' : 'استمع') + '</span>' +
          '</button>' +
        '</div>';
    }

    questionCard.innerHTML = questionHtml;
    container.appendChild(questionCard);

    // ربط حدث زر الصوت
    var audioBtn = questionCard.querySelector('.level-audio-btn');
    if (audioBtn) {
      audioBtn.addEventListener('click', function () {
        playAudio(this);
      });
    }

    // ── منطقة الإجابة ──
    var answerArea = document.createElement('div');
    answerArea.className = 'level-answer-area';

    if (qd.type === 'choice') {
      renderChoiceOptions(qd, answerArea);
    } else if (qd.type === 'order') {
      renderOrderOptions(qd, answerArea);
    } else {
      renderTextInput(qd, answerArea);
    }

    container.appendChild(answerArea);

    // ── منطقة التغذية الراجعة (تظهر بعد الإجابة) ──
    var feedbackArea = document.createElement('div');
    feedbackArea.className = 'level-feedback-area';
    feedbackArea.style.display = 'none';
    container.appendChild(feedbackArea);

    // ── زر التالي (يظهر بعد الإجابة) ──
    var navArea = document.createElement('div');
    navArea.className = 'level-nav-area';
    navArea.style.display = 'none';
    container.appendChild(navArea);

    // إذا كان السؤال قد أُجيب مسبقاً (نعرض التغذية الراجعة فقط إذا ضغط زر التأكيد)
    if (userAnswers[currentStep] != null && userAnswers[currentStep].checked) {
      answeredCurrent = true;
      var prev = userAnswers[currentStep];
      showFeedback(qd, prev.answer, prev.correct, feedbackArea, navArea);
    } else {
      answeredCurrent = false;
    }

    // تمرير للسؤال
    container.querySelector('.level-scene-card').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // ── أنواع الأسئلة ──

  function renderChoiceOptions(qd, area) {
    var en = isEnglishPage();
    var txt = l10n();
    var optionsHtml = '<div class="level-options">';

    for (var i = 0; i < qd.options.length; i++) {
      var val = OPTION_LABELS[i];
      var disabled = answeredCurrent ? ' disabled' : '';
      var extraClass = '';

      if (answeredCurrent && userAnswers[currentStep]) {
        var ua = userAnswers[currentStep];
        if (val === qd.answer) extraClass += ' level-option-correct';
        if (val === ua.answer && !ua.correct) extraClass += ' level-option-wrong';
      }

      optionsHtml +=
        '<button class="level-option-btn' + extraClass + '" data-value="' + val + '"' + disabled + '>' +
          '<span class="level-opt-label">' + val + '.</span> ' +
          '<span class="level-opt-text">' + escapeHtml(qd.options[i]) + '</span>' +
        '</button>';
    }

    optionsHtml += '</div>';
    area.innerHTML = optionsHtml;

    if (!answeredCurrent) {
      var buttons = area.querySelectorAll('.level-option-btn');
      for (var b = 0; b < buttons.length; b++) {
        buttons[b].addEventListener('click', function () {
          handleChoiceAnswer(qd, this.getAttribute('data-value'));
        });
      }
    }
  }

  function renderTextInput(qd, area) {
    var txt = l10n();
    var disabled = answeredCurrent ? ' disabled' : '';
    var value = '';
    if (answeredCurrent && userAnswers[currentStep]) {
      value = userAnswers[currentStep].answer;
    }

    area.innerHTML =
      '<div class="level-text-area">' +
        '<input type="text" class="level-text-field" value="' + escapeHtml(value) + '"' + disabled +
          ' dir="ltr" autocomplete="off" placeholder="' + (isEnglishPage() ? 'Type your answer...' : 'اكتب إجابتك...') + '">' +
        '<button class="level-check-btn"' + (answeredCurrent ? ' disabled' : '') + '>' + escapeHtml(txt.checkBtn) + '</button>' +
      '</div>';

    if (!answeredCurrent) {
      var checkBtn = area.querySelector('.level-check-btn');
      var input = area.querySelector('.level-text-field');

      function checkText() {
        var val = input.value.trim();
        if (!val) return;
        handleTextAnswer(qd, val);
      }

      checkBtn.addEventListener('click', checkText);
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') checkText();
      });
    }
  }

  function renderOrderOptions(qd, area) {
    var en = isEnglishPage();
    var txt = l10n();

    // حالة الجلسة لترتيب الكلمات
    var orderState = null;
    if (answeredCurrent && userAnswers[currentStep]) {
      orderState = userAnswers[currentStep].orderState || [];
    } else if (!userAnswers[currentStep]) {
      userAnswers[currentStep] = { answer: [], orderState: [], checked: false };
      orderState = [];
    } else {
      orderState = userAnswers[currentStep].orderState || [];
    }

    var allWords = qd.orderWords.slice();
    var selected = orderState.slice();

    var html =
      '<div class="level-order-area" data-q="' + currentStep + '">' +
        // الكلمات المختارة
        '<div class="level-order-dropzone">' +
          '<div class="level-order-label">' + (en ? 'Your sentence:' : 'جملتك:') + '</div>' +
          '<div class="level-order-selected">';

    if (selected.length === 0) {
      html += '<span class="level-order-placeholder">' + (en ? 'Click words below in order' : 'اضغط الكلمات أدناه بالترتيب') + '</span>';
    } else {
      for (var si = 0; si < selected.length; si++) {
        var wordItem = selected[si];
        if (!answeredCurrent) {
          html += '<button class="level-order-token level-order-token-selected" data-idx="' + si + '">' +
            escapeHtml(wordItem) + ' <span class="level-order-token-remove">' + txt.removeBtn + '</span></button>';
        } else {
          html += '<span class="level-order-token level-order-token-selected">' + escapeHtml(wordItem) + '</span>';
        }
      }
    }

    html += '</div></div>';

    // الكلمات المتاحة
    if (!answeredCurrent) {
      html += '<div class="level-order-pool">';
      var available = allWords.filter(function (w) { return selected.indexOf(w) === -1; });
      for (var ai = 0; ai < available.length; ai++) {
        html += '<button class="level-order-token level-order-token-available" data-word="' + escapeHtml(available[ai]) + '">' +
          escapeHtml(available[ai]) + '</button>';
      }
      html += '</div>';

      // أزرار
      html += '<div class="level-order-actions">';
      html += '<button class="level-order-reset-btn">' + escapeHtml(txt.resetBtn) + '</button>';
      html += '<button class="level-order-check-btn">' + escapeHtml(txt.checkBtn) + '</button>';
      html += '</div>';
    }

    html += '</div>';
    area.innerHTML = html;

    if (!answeredCurrent) {
      attachOrderListeners(qd, area);
    }
  }

  function attachOrderListeners(qd, area) {
    var en = isEnglishPage();
    var txt = l10n();

    // إضافة كلمة من المتاح
    area.querySelectorAll('.level-order-token-available').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var word = this.getAttribute('data-word');
        if (!userAnswers[currentStep]) {
          userAnswers[currentStep] = { answer: [], orderState: [], checked: false };
        }
        var state = userAnswers[currentStep].orderState || [];
        state.push(word);
        userAnswers[currentStep].orderState = state;
        // إعادة عرض منطقة الترتيب فقط
        renderOrderArea(qd, area);
      });
    });

    // إزالة كلمة من المختارة (بالضغط على زر الإزالة)
    area.addEventListener('click', function (e) {
      var removeBtn = e.target.closest('.level-order-token-remove');
      if (removeBtn) {
        var token = removeBtn.closest('.level-order-token-selected');
        if (token && token.hasAttribute('data-idx')) {
          var idx = parseInt(token.getAttribute('data-idx'));
          var state = userAnswers[currentStep].orderState || [];
          state.splice(idx, 1);
          userAnswers[currentStep].orderState = state;
          renderOrderArea(qd, area);
        }
      }
    });

    // زر إعادة
    var resetBtn = area.querySelector('.level-order-reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        userAnswers[currentStep] = { answer: [], orderState: [], checked: false };
        renderOrderArea(qd, area);
      });
    }

    // زر تحقق
    var checkBtn = area.querySelector('.level-order-check-btn');
    if (checkBtn) {
      checkBtn.addEventListener('click', function () {
        var state = userAnswers[currentStep].orderState || [];
        if (state.length !== qd.orderWords.length) return;

        userAnswers[currentStep].answer = state.slice();
        userAnswers[currentStep].checked = true;

        var correct = arraysEqual(state, qd.answer);
        userAnswers[currentStep].correct = correct;
        answeredCurrent = true;

        // إعادة عرض كامل السؤال مع التغذية الراجعة
        var feedbackArea = container.querySelector('.level-feedback-area');
        var navArea = container.querySelector('.level-nav-area');
        showFeedback(qd, state, correct, feedbackArea, navArea);

        // إعادة عرض منطقة الترتيب مع تعطيل
        renderOrderArea(qd, area, true);
      });
    }
  }

  function renderOrderArea(qd, area, disabled) {
    var en = isEnglishPage();
    var txt = l10n();
    disabled = disabled || answeredCurrent;

    var state = userAnswers[currentStep] ? (userAnswers[currentStep].orderState || []) : [];
    var allWords = qd.orderWords.slice();
    var selected = state.slice();

    // منطقة الكلمات المختارة
    var dropzone = area.querySelector('.level-order-dropzone');
    if (dropzone) {
      var selectedHtml = '<div class="level-order-label">' + (en ? 'Your sentence:' : 'جملتك:') + '</div>' +
        '<div class="level-order-selected">';

      if (selected.length === 0) {
        selectedHtml += '<span class="level-order-placeholder">' + (en ? 'Click words below in order' : 'اضغط الكلمات أدناه بالترتيب') + '</span>';
      } else {
        for (var si = 0; si < selected.length; si++) {
          if (!disabled) {
            selectedHtml += '<button class="level-order-token level-order-token-selected" data-idx="' + si + '">' +
              escapeHtml(selected[si]) + ' <span class="level-order-token-remove">' + txt.removeBtn + '</span></button>';
          } else {
            selectedHtml += '<span class="level-order-token level-order-token-selected">' + escapeHtml(selected[si]) + '</span>';
          }
        }
      }

      selectedHtml += '</div>';
      dropzone.innerHTML = selectedHtml;
    }

    // منطقة الكلمات المتاحة
    var pool = area.querySelector('.level-order-pool');
    if (pool) {
      if (disabled) {
        pool.innerHTML = '';
      } else {
        var available = allWords.filter(function (w) { return selected.indexOf(w) === -1; });
        var poolHtml = '';
        for (var ai = 0; ai < available.length; ai++) {
          poolHtml += '<button class="level-order-token level-order-token-available" data-word="' + escapeHtml(available[ai]) + '">' +
            escapeHtml(available[ai]) + '</button>';
        }
        pool.innerHTML = poolHtml;

        // إعادة ربط الأحداث
        pool.querySelectorAll('.level-order-token-available').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var word = this.getAttribute('data-word');
            var st = userAnswers[currentStep].orderState || [];
            st.push(word);
            userAnswers[currentStep].orderState = st;
            renderOrderArea(qd, area);
          });
        });
      }
    }

    // تحديث حالة أزرار التحكم
    var checkBtn = area.querySelector('.level-order-check-btn');
    var resetBtn = area.querySelector('.level-order-reset-btn');
    if (disabled) {
      if (checkBtn) checkBtn.disabled = true;
      if (resetBtn) resetBtn.disabled = true;
    } else {
      if (checkBtn) {
        checkBtn.disabled = (selected.length !== allWords.length);
      }
    }
  }

  // ── معالجة الإجابات ──

  function handleChoiceAnswer(qd, value) {
    if (answeredCurrent) return;
    var correct = (value === qd.answer);

    userAnswers[currentStep] = { answer: value, correct: correct, checked: true };
    answeredCurrent = true;

    // إعادة عرض الخيارات مع التمييز
    var area = container.querySelector('.level-answer-area');
    renderChoiceOptions(qd, area);

    // عرض التغذية الراجعة
    var feedbackArea = container.querySelector('.level-feedback-area');
    var navArea = container.querySelector('.level-nav-area');
    showFeedback(qd, value, correct, feedbackArea, navArea);
  }

  function handleTextAnswer(qd, value) {
    if (answeredCurrent) return;
    var correct = checkAnswer(value, qd);

    userAnswers[currentStep] = { answer: value, correct: correct, checked: true };
    answeredCurrent = true;

    // إعادة عرض حقل النص
    var area = container.querySelector('.level-answer-area');
    renderTextInput(qd, area);

    // عرض التغذية الراجعة
    var feedbackArea = container.querySelector('.level-feedback-area');
    var navArea = container.querySelector('.level-nav-area');
    showFeedback(qd, value, correct, feedbackArea, navArea);
  }

  // ── التغذية الراجعة ──

  function showFeedback(qd, userAnswer, correct, feedbackArea, navArea) {
    var en = isEnglishPage();
    var txt = l10n();

    // التغذية الراجعة
    var feedbackText = en ? qd.feedbackEn : qd.feedbackAr;
    var correctDisplay = '';

    if (qd.type === 'order') {
      if (!correct) {
        var correctWords = qd.answer.join(' ');
        correctDisplay = '<span class="level-feedback-answer">' + escapeHtml(txt.correctIs) + ' <strong>"' + escapeHtml(correctWords) + '"</strong></span>';
      }
    } else if (qd.type === 'choice' && !correct) {
      correctDisplay = '<span class="level-feedback-answer">' + escapeHtml(txt.correctIs) + ' <strong>"' + escapeHtml(qd.options[OPTION_LABELS.indexOf(qd.answer)]) + '"</strong></span>';
    } else if (qd.type === 'text' && !correct) {
      correctDisplay = '<span class="level-feedback-answer">' + escapeHtml(txt.correctIs) + ' <strong>"' + escapeHtml(qd.answer) + '"</strong></span>';
    }

    var userDisplay = '';
    if (typeof userAnswer === 'string') {
      userDisplay = escapeHtml(txt.yourAnswer) + ' "' + escapeHtml(userAnswer) + '"';
    } else if (Array.isArray(userAnswer)) {
      userDisplay = escapeHtml(txt.yourAnswer) + ' "' + escapeHtml(userAnswer.join(' ')) + '"';
    }

    feedbackArea.style.display = 'block';
    feedbackArea.className = 'level-feedback-area level-feedback-' + (correct ? 'correct' : 'wrong');
    feedbackArea.innerHTML =
      '<div class="level-feedback-icon">' + (correct ? '✅' : '❌') + '</div>' +
      '<div class="level-feedback-body">' +
        '<div class="level-feedback-verdict">' +
          (correct ? escapeHtml(txt.correctFeedback) : escapeHtml(txt.wrongFeedback)) +
        '</div>' +
        (userDisplay ? '<div class="level-feedback-user">' + userDisplay + '</div>' : '') +
        (correctDisplay ? '<div class="level-feedback-answer">' + correctDisplay + '</div>' : '') +
        '<div class="level-feedback-explain">' + escapeHtml(feedbackText) + '</div>' +
      '</div>';

    // زر التالي
    navArea.style.display = 'block';
    var isLast = (currentStep >= QUESTIONS.length - 1);
    navArea.innerHTML =
      '<button class="level-next-btn">' +
        escapeHtml(isLast ? txt.finishBtn : txt.nextBtn) +
      '</button>';

    navArea.querySelector('.level-next-btn').addEventListener('click', function () {
      nextStep();
    });

    feedbackArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function nextStep() {
    currentStep++;
    answeredCurrent = false;
    if (currentStep >= QUESTIONS.length) {
      showDashboard();
    } else {
      renderQuestion();
    }
  }

  // ── التحقق من النص ──

  function checkAnswer(userAnswer, qd) {
    if (!userAnswer) return false;
    if (qd.type === 'choice') {
      return userAnswer === qd.answer;
    }
    // text
    var norm = userAnswer.toLowerCase().trim();
    if (norm === qd.answer.toLowerCase()) return true;
    if (qd.acceptedAnswers) {
      for (var i = 0; i < qd.acceptedAnswers.length; i++) {
        if (norm === qd.acceptedAnswers[i].toLowerCase()) return true;
      }
    }
    return false;
  }

  function arraysEqual(a, b) {
    if (!a || !b) return false;
    if (a.length !== b.length) return false;
    for (var i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  // ── تشغيل الصوت ──

  function playAudio(btn) {
    if (!window.speechSynthesis) return;
    var text = btn.getAttribute('data-audio-text');
    if (!text) return;

    // إيقاف أي تشغيل سابق
    window.speechSynthesis.cancel();

    var u = new SpeechSynthesisUtterance(text);
    u.lang = 'de-DE';
    u.rate = 0.82;
    u.pitch = 1.05;

    // محاولة استخدام صوت ألماني
    var voices = window.speechSynthesis.getVoices();
    for (var vi = 0; vi < voices.length; vi++) {
      if (voices[vi].lang.startsWith('de')) {
        u.voice = voices[vi];
        break;
      }
    }

    // مؤشر التشغيل
    btn.disabled = true;
    btn.querySelector('.level-audio-label').textContent = isEnglishPage() ? 'Playing…' : 'جارٍ التشغيل…';

    u.onend = u.onerror = function () {
      btn.disabled = false;
      btn.querySelector('.level-audio-label').textContent = isEnglishPage() ? 'Listen' : 'استمع';
    };

    window.speechSynthesis.speak(u);
  }

  // ── احتساب النتائج ──

  function gradeTest() {
    var results = [];

    for (var i = 0; i < QUESTIONS.length; i++) {
      var qd = QUESTIONS[i];
      var ua = userAnswers[i];
      var isCorrect = (ua && ua.correct) || false;
      var userVal = ua ? ua.answer : '';

      results.push({
        index: i,
        question: qd,
        userAnswer: userVal,
        correct: isCorrect
      });
    }

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

    var levelResult = determineLevel(scoresByLevel);
    var recommendations = generateRecommendations(wrongAnswers, results);

    return {
      results: results,
      scoresByLevel: scoresByLevel,
      levelResult: levelResult,
      recommendations: recommendations,
      correctCount: correctCount,
      total: total,
      pct: Math.round((correctCount / total) * 100)
    };
  }

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

  function generateRecommendations(wrongAnswers, allResults) {
    if (wrongAnswers.length === 0) {
      return { grammarTopics: [], lessonTopics: [], isEmpty: true };
    }

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

      if (!qd.grammar) {
        var lKey = qd.lesson + '||' + qd.lessonLink;
        if (!lessonMap[lKey]) {
          lessonMap[lKey] = { lesson: qd.lesson, lessonLink: qd.lessonLink, exerciseLink: qd.exerciseLink, count: 0 };
        }
        lessonMap[lKey].count++;
      }
    }

    for (var g in grammarMap) {
      var grammarName = grammarMap[g].grammar;
      grammarMap[g].total = allResults.filter(function (r) {
        return r.question.grammar === grammarName;
      }).length;
    }

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

  // ── Dashboard ──

  function showDashboard() {
    var en = isEnglishPage();
    var txt = l10n();
    var data = gradeTest();

    container.innerHTML = '';

    // ثيم حسب النتيجة
    var themeClass = 'level-theme-great';
    if (data.pct < 50) themeClass = 'level-theme-needs-work';
    else if (data.pct < 80) themeClass = 'level-theme-good';

    container.className = 'level-assessment level-dashboard-view ' + themeClass;

    // ── 1. الشارة والنتيجة ──
    var levelLabel = en ? data.levelResult.en : data.levelResult.ar;
    var emojiMap = { belowA1: '🔰', A1: '🌱', A2: '🌿', B1: '🌳' };
    var levelEmoji = emojiMap[data.levelResult.key] || '🎯';

    var scoreLabel = txt.allCorrect;
    if (data.pct >= 80) scoreLabel = en ? 'Excellent! 🎉' : 'ممتاز! 🎉';
    else if (data.pct >= 50) scoreLabel = en ? 'Good effort! 💪' : 'جيد! استمر 💪';
    else scoreLabel = en ? 'Keep practicing! 📖' : 'حاول مرة أخرى 📖';

    var html =
      '<div class="level-d2-header">' +
        '<div class="level-d2-level-badge">' +
          '<span class="level-d2-emoji">' + levelEmoji + '</span>' +
          '<span class="level-d2-level-text">' + escapeHtml(levelLabel) + '</span>' +
        '</div>' +
        '<div class="level-d2-score">' +
          '<div class="level-d2-score-num">' + data.correctCount + '/' + data.total + '</div>' +
          '<div class="level-d2-score-pct">(' + data.pct + '%)</div>' +
          '<div class="level-d2-score-label">' + escapeHtml(scoreLabel) + '</div>' +
        '</div>' +
      '</div>';

    // ── 2. أشرطة المستويات ──
    html += '<div class="level-d2-section">';
    html += '<h4 class="level-d2-section-title">📊 ' + escapeHtml(txt.perLevel) + '</h4>';
    html += '<div class="level-d2-bars">';

    var levels = ['A1', 'A2', 'B1'];
    for (var li = 0; li < levels.length; li++) {
      var l = levels[li];
      var sc = data.scoresByLevel[l];
      var fillClass = 'level-d2-bar-fill';
      if (sc.pct >= 80) fillClass += ' level-d2-bar-great';
      else if (sc.pct >= 50) fillClass += ' level-d2-bar-good';
      else fillClass += ' level-d2-bar-needs-work';

      html += '<div class="level-d2-bar-row">';
      html += '<span class="level-d2-bar-label">' + l + '</span>';
      html += '<div class="level-d2-bar-track"><div class="' + fillClass + '" style="width:' + sc.pct + '%"></div></div>';
      html += '<span class="level-d2-bar-pct">' + sc.correct + '/' + sc.total + ' (' + sc.pct + '%)</span>';
      html += '</div>';
    }

    html += '</div></div>';

    // ── 3. نقاط الضعف ──
    html += '<div class="level-d2-section">';
    html += '<h4 class="level-d2-section-title">📘 ' + escapeHtml(txt.weaknesses) + '</h4>';

    var hasWeakness = false;
    if (data.recommendations.grammarTopics.length > 0) {
      hasWeakness = true;
      html += '<div class="level-d2-card-list">';
      for (var gi = 0; gi < data.recommendations.grammarTopics.length; gi++) {
        var gt = data.recommendations.grammarTopics[gi];
        var wrongPct = gt.total > 0 ? Math.round((gt.count / gt.total) * 100) : 0;
        html += '<div class="level-d2-card">';
        html += '<div class="level-d2-card-header">';
        html += '❌ <strong>' + escapeHtml(gt.grammar) + '</strong>';
        html += ' <span class="level-d2-card-stat">' + gt.count + '/' + gt.total + ' (' + wrongPct + '%)</span>';
        html += '</div><div class="level-d2-card-links">';
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

    if (data.recommendations.lessonTopics.length > 0) {
      hasWeakness = true;
      html += '<div class="level-d2-card-list">';
      for (var li2 = 0; li2 < data.recommendations.lessonTopics.length; li2++) {
        var lt = data.recommendations.lessonTopics[li2];
        html += '<div class="level-d2-card">';
        html += '<div class="level-d2-card-header">❌ <strong>' + escapeHtml(lt.lesson) + '</strong> <span class="level-d2-card-stat">(' + lt.count + (en ? ' errors' : ' أخطاء') + ')</span></div>';
        html += '<div class="level-d2-card-links">';
        html += '<a href="' + lt.lessonLink + '" class="level-link level-lesson-link">📕 ' + escapeHtml(txt.studyLesson) + '</a>';
        html += '<a href="' + lt.exerciseLink + '" class="level-link level-exercise-link">📝 ' + escapeHtml(txt.doExercises) + '</a>';
        html += '</div></div>';
      }
      html += '</div>';
    }

    if (!hasWeakness) {
      html += '<p class="level-d2-empty">' + escapeHtml(txt.noWeakness) + '</p>';
    }
    html += '</div>';

    // ── 4. نقاط القوة ──
    var strengths = getStrengths(data.results);
    html += '<div class="level-d2-section">';
    html += '<h4 class="level-d2-section-title">🟢 ' + escapeHtml(txt.strengths) + '</h4>';

    if (strengths.length > 0) {
      html += '<div class="level-d2-strength-list">';
      for (var si = 0; si < strengths.length; si++) {
        var st = strengths[si];
        html += '<div class="level-d2-strength-item">✅ <strong>' + escapeHtml(st.label) + '</strong> — ' + st.correct + '/' + st.total + ' (' + st.pct + '%)</div>';
      }
      html += '</div>';
    } else {
      html += '<p class="level-d2-empty">' + (en ? 'Keep practicing!' : 'استمر في التدريب!') + '</p>';
    }
    html += '</div>';

    // ── 5. التوصية ──
    html += '<div class="level-d2-section">';
    html += '<h4 class="level-d2-section-title">💡 ' + escapeHtml(txt.recommendation) + '</h4>';
    html += '<div class="level-d2-recommend">';

    var levelKey = data.levelResult.key;
    if (levelKey === 'belowA1') {
      html += '<p>' + (en ? 'Start from the very beginning — A1 Level, Lesson 1.' : 'ابدأ من البداية تماماً — المستوى A1، الدرس 1.') + '</p>';
      html += '<a href="../a1/kursbuch/lektion-01/" class="level-recommendation-btn">📕 ' + escapeHtml(txt.recommendStart) + ' Lektion 1</a>';
    } else if (levelKey === 'A1') {
      html += '<p>' + (en ? 'You have basic A1 knowledge. Start from A1 and review the weak areas above.' : 'لديك معرفة أساسية بمستوى A1. ابدأ من A1 وراجع نقاط الضعف أعلاه.') + '</p>';
      html += '<a href="../a1/kursbuch/lektion-01/" class="level-recommendation-btn">📕 ' + escapeHtml(txt.recommendStart) + ' A1 Lektion 1</a>';
    } else if (levelKey === 'A2') {
      html += '<p>' + (en ? 'You have solid A1 and are ready for A2. Review the grammar topics listed above that you missed.' : 'مستوى A1 لديك جيد وأنت جاهز لـ A2. راجع القواعد التي أخطأت فيها أعلاه.') + '</p>';
      html += '<a href="../a2/kursbuch/lektion-01/" class="level-recommendation-btn">📕 ' + escapeHtml(txt.recommendStart) + ' A2 Lektion 1</a>';
      if (data.recommendations.grammarTopics.length > 0) {
        html += '<p class="level-recommendation-note">' + escapeHtml(txt.recommendReview) + '</p>';
      }
    } else {
      html += '<p>' + escapeHtml(txt.recommendGreat) + '</p>';
      html += '<a href="../a2/kursbuch/lektion-01/" class="level-recommendation-btn">📕 ' + (en ? 'Continue with A2+' : 'استمر مع A2+') + '</a>';
    }

    html += '</div></div>';

    // ── 6. أزرار ──
    html += '<div class="level-d2-actions">';
    html += '<button class="level-retry-btn">' + escapeHtml(txt.retake) + '</button>';
    html += '</div>';

    container.innerHTML = html;

    var retryBtn = container.querySelector('.level-retry-btn');
    if (retryBtn) {
      retryBtn.addEventListener('click', function () {
        resetTest();
      });
    }

    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ── إعادة الاختبار ──

  function resetTest() {
    userAnswers = [];
    currentStep = STATE_INTRO;
    answeredCurrent = false;
    container.className = 'level-assessment';
    showIntro();
  }

  // ── الإقلاع ──

  function init() {
    container = document.querySelector('.level-assessment');
    if (!container) return;
    container.className = 'level-assessment';
    shuffleOptions(); // توزيع الإجابات الصحيحة على A/B/C/D
    showIntro();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
