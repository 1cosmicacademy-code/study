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
    var escaped = d.innerHTML;
    // Also escape quotes for attribute context safety (CWE-79 fix)
    escaped = escaped.replace(/\x22/g, '&quot;').replace(/\x27/g, '&#x27;');
    return escaped;
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

  // ── استيراد الأسئلة من بنك الأسئلة الذكي ──
  //
  // كل اختبار يستخرج 42 سؤالاً عشوائياً من ~200 سؤال
  // التوزيع: 3 A1 + 2 A2 + 2 B1 لكل قسم (7 × 6 = 42)
  // البنك في question-bank.js (يُحمّل قبل هذا الملف)

  var QUESTIONS = (window.QuestionBank && window.QuestionBank.selectQuestions)
    ? window.QuestionBank.selectQuestions(42)
    : (console.error('QuestionBank not loaded! Make sure question-bank.js is loaded before level-test.js'), []);

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
    var questionHtml = '<h3 dir="auto" class="level-question-stem">' + escapedStem + '</h3>';

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
          '<span dir="ltr" class="level-opt-text">' + escapeHtml(qd.options[i]) + '</span>' +
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

  // دالة مساعدة: تصفية الكلمات المتاحة مع مراعاة الكلمات المكررة
  function getAvailableWords(allWords, selected) {
    var remaining = selected.slice();
    return allWords.filter(function (w) {
      var idx = remaining.indexOf(w);
      if (idx >= 0) {
        remaining.splice(idx, 1);
        return false;
      }
      return true;
    });
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
          '<div dir="ltr" class="level-order-selected">';

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
      html += '<div dir="ltr" class="level-order-pool">';
      var available = getAvailableWords(allWords, selected);
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
        '<div dir="ltr" class="level-order-selected">';

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
        var available = getAvailableWords(allWords, selected);
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
        '<div dir="auto" class="level-feedback-explain">' + escapeHtml(feedbackText) + '</div>' +
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
      html += '<p>' + (en ? 'You have basic A1 knowledge. Start from A1 and review the weak areas below.' : 'لديك معرفة أساسية بمستوى A1. ابدأ من A1 وراجع نقاط الضعف أدناه.') + '</p>';
      html += '<a href="../a1/kursbuch/lektion-01/" class="level-recommendation-btn">📕 ' + escapeHtml(txt.recommendStart) + ' A1 Lektion 1</a>';
    } else if (levelKey === 'A2') {
      html += '<p>' + (en ? 'You have solid A1 and are ready for A2. Review the grammar topics below that you missed.' : 'مستوى A1 لديك جيد وأنت جاهز لـ A2. راجع القواعد التي أخطأت فيها أدناه.') + '</p>';
      html += '<a href="../a2/kursbuch/lektion-01/" class="level-recommendation-btn">📕 ' + escapeHtml(txt.recommendStart) + ' A2 Lektion 1</a>';
    } else {
      html += '<p>' + escapeHtml(txt.recommendGreat) + '</p>';
      html += '<a href="../a2/kursbuch/lektion-01/" class="level-recommendation-btn">📕 ' + (en ? 'Continue with A2+' : 'استمر مع A2+') + '</a>';
    }

    // عرض نقاط الضعف ضمن التوصية (مع روابط)
    if (data.recommendations.grammarTopics.length > 0) {
      html += '<div class="level-d2-weak-in-recommend">';
      html += '<p class="level-recommendation-note">' + escapeHtml(txt.recommendReview) + '</p>';
      html += '<div class="level-d2-card-list">';
      for (var recGi = 0; recGi < data.recommendations.grammarTopics.length; recGi++) {
        var recGt = data.recommendations.grammarTopics[recGi];
        var recWrongPct = recGt.total > 0 ? Math.round((recGt.count / recGt.total) * 100) : 0;
        html += '<div class="level-d2-card">';
        html += '<div class="level-d2-card-header">';
        html += '❌ <strong>' + escapeHtml(recGt.grammar) + '</strong>';
        html += ' <span class="level-d2-card-stat">' + recGt.count + '/' + recGt.total + ' (' + recWrongPct + '%)</span>';
        html += '</div><div class="level-d2-card-links">';
        if (recGt.link) {
          html += '<a href="' + recGt.link + '" class="level-link level-grammar-link">📘 ' + escapeHtml(txt.reviewGrammar) + '</a>';
        }
        var recSeen = {};
        for (var recLk in recGt.lessons) {
          var recLessonInfo = recGt.lessons[recLk];
          if (!recSeen[recLessonInfo.lesson]) {
            recSeen[recLessonInfo.lesson] = true;
            html += '<a href="' + recLessonInfo.lessonLink + '" class="level-link level-lesson-link">📕 ' + escapeHtml(txt.studyLesson) + ': ' + escapeHtml(recLessonInfo.lesson) + '</a>';
            html += '<a href="' + recLessonInfo.exerciseLink + '" class="level-link level-exercise-link">📝 ' + escapeHtml(txt.doExercises) + '</a>';
          }
        }
        html += '</div></div>';
      }
      html += '</div></div>';
    } else if (data.recommendations.lessonTopics.length > 0) {
      html += '<div class="level-d2-weak-in-recommend">';
      html += '<p class="level-recommendation-note">' + escapeHtml(txt.recommendReview) + '</p>';
      html += '<div class="level-d2-card-list">';
      for (var recLi = 0; recLi < data.recommendations.lessonTopics.length; recLi++) {
        var recLt = data.recommendations.lessonTopics[recLi];
        html += '<div class="level-d2-card">';
        html += '<div class="level-d2-card-header">❌ <strong>' + escapeHtml(recLt.lesson) + '</strong> <span class="level-d2-card-stat">(' + recLt.count + (en ? ' errors' : ' أخطاء') + ')</span></div>';
        html += '<div class="level-d2-card-links">';
        html += '<a href="' + recLt.lessonLink + '" class="level-link level-lesson-link">📕 ' + escapeHtml(txt.studyLesson) + '</a>';
        html += '<a href="' + recLt.exerciseLink + '" class="level-link level-exercise-link">📝 ' + escapeHtml(txt.doExercises) + '</a>';
        html += '</div></div>';
      }
      html += '</div></div>';
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

    // Freeze AFTER shuffling so shuffleOptions() can modify question objects
    // (Object.freeze in strict mode throws on assignment, which would silently
    // break the test UI — CWE-200 mitigation must come after answer distribution)
    if (QUESTIONS.length > 0) {
      QUESTIONS.forEach(function(q) { Object.freeze(q); });
      Object.freeze(QUESTIONS);
    }

    showIntro();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
