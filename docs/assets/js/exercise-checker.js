/**
 * Exercise Checker — interactive exercise system for Übungsbuch.
 *
 * Detects <div class="exercise"> containers placed around markdown tables and
 * transforms them into interactive forms:
 *   - text   (default): empty table cells → <input type="text">
 *   - choice : أ/ب/ج columns  → radio buttons
 *   - match  : letter columns  → <select> dropdown
 *
 * Requirements:
 *   - md_in_html extension enabled in mkdocs.yml
 *   - Each .exercise div has a data-answers JSON attribute
 *   - data-type="choice|match" for non-text exercises (text is default)
 */
(function () {
  'use strict';

  // Early exit — self-guard: only run on pages that contain interactive exercises
  // يتحقق من وجود عنصر exercise أو عنصر يحمل data-answers (للمنصات غير المغلفة بـ .exercise)
  // هذا يمنع تشغيل exercise-checker.js في الصفحات الخالية من التمارين التفاعلية.
  if (!document.querySelector('.exercise') && !document.querySelector('[data-answers]')) return;

  function init() {
    var containers = document.querySelectorAll('.exercise');
    if (!containers.length) return;

    for (var i = 0; i < containers.length; i++) {
      setupExercise(containers[i]);
    }
  }

  /**
   * Escape HTML special chars for safe display inside innerHTML.
   */
  function escapeHtml(str) {
    var d = document.createElement('div');
    d.appendChild(document.createTextNode(str));
    return d.innerHTML;
  }

  /**
   * Parse data-answers, return array or null on failure.
   */
  function parseAnswers(el) {
    var raw = el.getAttribute('data-answers');
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (_) { return null; }
  }

  /**
   * Guess the page language from the URL path.
   */
  function isEnglishPage() {
    return window.location.pathname.indexOf('/en/') === 0;
  }

  /**
   * Localised strings.
   */
  function l10n() {
    var en = isEnglishPage();
    return {
      check:       en ? '✅ Check Answers' : '✅ تحقق من الإجابات',
      retry:       en ? '🔄 Try Again'     : '🔄 إعادة المحاولة',
      correct:     en ? 'Correct!'          : '✅ صحيح!',
      wrong:       en ? 'Your answer:'      : '❌ إجابتك:',
      expected:    en ? 'Correct answer:'   : 'الصحيح:',
      score:       en ? 'Score'             : 'النتيجة',
      great:       en ? 'Excellent! 🎉'     : 'ممتاز! 🎉',
      good:        en ? 'Good effort! 💪'   : 'جيد! استمر 💪',
      needsWork:   en ? 'Keep practicing! 📖' : 'حاول مرة أخرى 📖',
      noAnswer:    en ? '(no answer)'       : '(لا توجد إجابة)',
      yourAnswer:  en ? 'Your answer'       : 'إجابتك'
    };
  }

  // ──────────────────────────────────────────────
  //  Exercise setup per type
  // ──────────────────────────────────────────────

  function setupExercise(el) {
    var t = el.getAttribute('data-type') || 'text';
    var answers = parseAnswers(el);
    if (!answers) return;      // no answer data → leave static

    var table = el.querySelector('table');
    if (!table) return;

    var rows = table.querySelectorAll('tbody tr');
    if (!rows.length) return;

    var tbody = table.querySelector('tbody');
    var txt = l10n();

    // 1. Transform based on type
    if (t === 'choice') {
      setupChoice(el, rows, tbody);
    } else if (t === 'match') {
      setupMatch(el, rows, tbody);
    } else {
      setupText(el, rows, tbody);
    }

    // 2. Inject check button
    var btn = document.createElement('button');
    btn.className = 'exercise-check-btn';
    btn.textContent = txt.check;
    el.appendChild(btn);

    // 3. Results area
    var results = document.createElement('div');
    results.className = 'exercise-results';
    el.appendChild(results);

    // 4. Wire click
    btn.addEventListener('click', function () {
      if (btn.classList.contains('reset-mode')) {
        resetExercise(el, t, answers);
        return;
      }
      checkExercise(el, t, answers, results, btn);
    });
  }

  // ── Text (fill-in-blank) ──────────────────────

  function setupText(el, rows) {
    for (var i = 0; i < rows.length; i++) {
      var cells = rows[i].querySelectorAll('td');
      if (!cells.length) continue;
      var last = cells[cells.length - 1];
      var input = document.createElement('input');
      input.type = 'text';
      input.className = 'exercise-input';
      input.setAttribute('dir', 'ltr');          // German is LTR
      input.setAttribute('aria-label', 'Answer ' + (i + 1));
      last.innerHTML = '';
      last.appendChild(input);
    }
  }

  // ── Choice (multiple-choice) ──────────────────

  function setupChoice(el, rows) {
    for (var i = 0; i < rows.length; i++) {
      var cells = rows[i].querySelectorAll('td');
      if (cells.length < 2) continue;

      // Cells after the first two (index 0 = #, 1 = question text) are options أ/ب/ج
      var groupName = 'ec-' + Math.random().toString(36).substr(2, 8) + '-' + i;

      for (var j = 2; j < cells.length; j++) {
        var cell = cells[j];
        var optText = cell.textContent.trim();

        var label = document.createElement('label');
        label.className = 'exercise-radio-label';

        var radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = groupName;
        radio.value = String.fromCharCode(65 + j - 2); // A, B, C, …
        radio.setAttribute('aria-label', optText + ' ' + radio.value);

        label.appendChild(radio);
        label.appendChild(document.createTextNode(' ' + optText));
        cell.innerHTML = '';
        cell.appendChild(label);
      }
    }
  }

  // ── Match (dropdown) ──────────────────────────

  function setupMatch(el, rows) {
    // Use custom data-options if provided, otherwise auto-generate A, B, C…
    var rawOptions = el.getAttribute('data-options');
    var letters;
    if (rawOptions) {
      try { letters = JSON.parse(rawOptions); } catch (_) { letters = null; }
    }
    if (!letters) {
      letters = [];
      for (var k = 0; k < rows.length; k++) {
        letters.push(String.fromCharCode(65 + k)); // A, B, C, …
      }
    }

    for (var i = 0; i < rows.length; i++) {
      var c = rows[i].querySelectorAll('td');
      // Use the last column for the dropdown
      var targetCell = c[c.length - 1];
      if (!targetCell) continue;

      var select = document.createElement('select');
      select.className = 'exercise-select';
      select.setAttribute('aria-label', 'Match ' + (i + 1));

      var blankOpt = document.createElement('option');
      blankOpt.value = '';
      blankOpt.textContent = '—';
      select.appendChild(blankOpt);

      for (var l = 0; l < letters.length; l++) {
        var opt = document.createElement('option');
        opt.value = letters[l];
        opt.textContent = letters[l];
        select.appendChild(opt);
      }

      targetCell.innerHTML = '';
      targetCell.appendChild(select);
    }
  }

  // ── Checking ─────────────────────────────────

  function checkExercise(el, type, answers, results, btn) {
    var score = 0;
    var total = answers.length;
    var txt = l10n();

    // Record user answers for comparison display
    var userAnswers = [];

    if (type === 'text') {
      var inputs = el.querySelectorAll('.exercise-input');
      userAnswers = checkText(inputs, answers, txt);
      score = userAnswers.filter(function (u) { return u.correct; }).length;
    } else if (type === 'choice') {
      userAnswers = checkChoice(el, answers, txt);
      score = userAnswers.filter(function (u) { return u.correct; }).length;
    } else if (type === 'match') {
      userAnswers = checkMatch(el, answers, txt);
      score = userAnswers.filter(function (u) { return u.correct; }).length;
    }

    var pct = total > 0 ? Math.round((score / total) * 100) : 0;

    // Score display
    var sClass = 'score-needs-work';
    var sLabel = txt.needsWork;
    if (pct >= 80) { sClass = 'score-great'; sLabel = txt.great; }
    else if (pct >= 50) { sClass = 'score-good'; sLabel = txt.good; }

    results.innerHTML =
      '<div class="score-display ' + sClass + '">' +
        escapeHtml(txt.score) + ': <strong>' + score + '/' + total + '</strong> (' + pct + '%)<br>' +
        '<span class="score-label">' + escapeHtml(sLabel) + '</span>' +
      '</div>' +
      '<div class="exercise-review-list"></div>';

    // Per-question comparison for wrong answers
    var reviewList = results.querySelector('.exercise-review-list');
    var anyWrong = false;
    for (var i = 0; i < userAnswers.length; i++) {
      var ua = userAnswers[i];
      if (!ua.correct) {
        anyWrong = true;
        var reviewItem = document.createElement('div');
        reviewItem.className = 'review-item';
        reviewItem.innerHTML =
          '<span class="review-wrong-mark">❌</span> ' +
          txt.wrong + ' <span class="review-user-answer">' + escapeHtml(ua.given || txt.noAnswer) + '</span> &rarr; ' +
          txt.expected + ' <span class="review-correct-answer">' + escapeHtml(ua.expected) + '</span>';
        reviewList.appendChild(reviewItem);
      }
    }

    if (!anyWrong && userAnswers.length > 0) {
      reviewList.innerHTML = '<div class="review-all-correct">🎉 ' + escapeHtml(txt.correct) + '</div>';
    }

    // Disable all inputs
    el.querySelectorAll('.exercise-input, .exercise-select, input[type="radio"]').forEach(function (inp) {
      inp.disabled = true;
    });

    // Switch button to retry
    btn.textContent = txt.retry;
    btn.classList.add('reset-mode');

    // Scroll results into view
    results.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // ── Per-type checkers ─────────────────────────

  function checkText(inputs, answers, txt) {
    var results = [];
    for (var i = 0; i < inputs.length; i++) {
      var given = inputs[i].value.trim();
      var expected = answers[i] != null ? String(answers[i]) : '';
      // تدعم الفاصل | للإجابات البديلة (مثلاً "Ägypten|Syrien" تقبل أي منهما)
      var accepted = expected.split('|').map(function (s) { return s.trim().toLowerCase(); });
      var correct = accepted.indexOf(given.toLowerCase()) !== -1;
      inputs[i].className = 'exercise-input' + (correct ? ' correct' : ' wrong');
      if (!correct && given) {
        // Show comparison below input
        var parent = inputs[i].parentNode;
        var existingCmp = parent.querySelector('.answer-comparison');
        if (existingCmp) existingCmp.remove();
        var cmp = document.createElement('div');
        cmp.className = 'answer-comparison';
        cmp.innerHTML = txt.expected + ' <strong>' + escapeHtml(expected) + '</strong>';
        parent.appendChild(cmp);
      }
      results.push({ correct: correct, given: given || '', expected: expected });
    }
    return results;
  }

  function checkChoice(el, answers, txt) {
    var results = [];
    var radioInputs = el.querySelectorAll('input[type="radio"]');
    // Group by name
    var groups = {};
    radioInputs.forEach(function (r) {
      if (!groups[r.name]) groups[r.name] = [];
      groups[r.name].push(r);
    });

    var groupKeys = Object.keys(groups);
    for (var i = 0; i < groupKeys.length; i++) {
      var group = groups[groupKeys[i]];
      var selected = null;
      var selectedValue = '';
      for (var j = 0; j < group.length; j++) {
        if (group[j].checked) { selected = group[j]; selectedValue = group[j].value; }
      }
      var expected = answers[i] != null ? String(answers[i]) : '';
      var correct = selectedValue === expected;

      // Highlight labels
      for (var k = 0; k < group.length; k++) {
        var label = group[k].closest('label');
        if (!label) continue;
        if (group[k].value === expected) {
          label.className = 'exercise-radio-label correct-highlight';
        } else if (group[k].checked && group[k].value !== expected) {
          label.className = 'exercise-radio-label wrong-highlight';
        }
      }

      results.push({
        correct: correct,
        given: selected ? selectedValue : '',
        expected: expected
      });
    }
    return results;
  }

  function checkMatch(el, answers, txt) {
    var results = [];
    var selects = el.querySelectorAll('.exercise-select');

    // answers can be array (index-based) or object (key-based)
    var isArray = Array.isArray(answers);

    for (var i = 0; i < selects.length; i++) {
      var given = selects[i].value;
      var expected;
      if (isArray) {
        expected = answers[i] != null ? String(answers[i]) : '';
      } else {
        var key = String(i + 1);
        expected = answers[key] != null ? String(answers[key]) : '';
      }
      var correct = given === expected;
      selects[i].className = 'exercise-select' + (correct ? ' correct' : ' wrong');
      if (!correct && given) {
        var parent = selects[i].parentNode;
        var existingCmp = parent.querySelector('.answer-comparison');
        if (existingCmp) existingCmp.remove();
        var cmp = document.createElement('div');
        cmp.className = 'answer-comparison';
        cmp.innerHTML = txt.expected + ' <strong>' + escapeHtml(expected) + '</strong>';
        parent.appendChild(cmp);
      }
      results.push({ correct: correct, given: given || '', expected: expected });
    }
    return results;
  }

  // ── Reset ─────────────────────────────────────

  function resetExercise(el, type, answers) {
    var txt = l10n();

    // Clear results
    var resultsDiv = el.querySelector('.exercise-results');
    if (resultsDiv) resultsDiv.innerHTML = '';

    // Remove comparison messages
    el.querySelectorAll('.answer-comparison').forEach(function (c) { c.remove(); });

    // Enable & clear inputs
    el.querySelectorAll('.exercise-input').forEach(function (inp) {
      inp.disabled = false;
      inp.value = '';
      inp.className = 'exercise-input';
    });

    // Enable & reset selects
    el.querySelectorAll('.exercise-select').forEach(function (sel) {
      sel.disabled = false;
      sel.value = '';
      sel.className = 'exercise-select';
    });

    // Enable radios & clear labels
    el.querySelectorAll('input[type="radio"]').forEach(function (r) {
      r.disabled = false;
      r.checked = false;
      var label = r.closest('label');
      if (label) label.className = 'exercise-radio-label';
    });

    // Reset button
    var btn = el.querySelector('.exercise-check-btn');
    if (btn) {
      btn.textContent = txt.check;
      btn.classList.remove('reset-mode');
      btn.onclick = null; // Will be re-attached via event listener
    }
  }

  // ── Boot ──────────────────────────────────────

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
