# تقرير التدقيق الأمني — مشروع دراسة

**التاريخ:** 2026-07-04  
**النطاق:** موقع دراسة (study-german.pages.dev) — موقع تعليم ألماني ثابت (static site) مبني بـ MkDocs  
**المنهجية:** فحص الإعدادات، مراجعة JavaScript، فحص تكاملات الطرف الثالث، مراجعة عميقة للثغرات، نموذج تهديدات STRIDE  
**التصنيف العام:** Medium Risk  
**الدرجة الإجمالية:** 52/100 (الإعدادات) — 55/100 (الثغرات) — 85/100 (جودة JavaScript)

---

## 1. الملخص التنفيذي

تم إجراء تدقيق أمني شامل لموقع "دراسة"، وهو موقع تعليمي ثابت لتعليم اللغة الألمانية. الموقع مبني على MkDocs ويُستضاف على Cloudflare Pages مع CI/CD عبر GitHub Actions.

**النتيجة العامة: الموقع آمن للاستخدام التعليمي كموقع ثابت، لكنه يفتقر إلى الحد الأدنى من رؤوس الأمن (Security Headers) مما يجعله عرضة لهجمات بسيطة.</**

**أهم 5 نتائج:**

1. **غياب تام لرؤوس الأمن HTTP (CSP, HSTS, XFO, XCTO, Referrer-Policy, Permissions-Policy):** الموقع لا يرسل أي رأس أمني. هذا يعني أن الموقع مكشوف أمام clickjacking, XSS (في حال وجوده), MIME sniffing, وهجمات اعتراض الاتصال. الدرجة: 52/100.

2. **ثغرة حقن في الخاصيات (Attribute Injection / Self-XSS) عبر دالة escapeHtml:** دالة `escapeHtml` في `level-test.js` لا تعالج علامات التنصيص (`"` و `'`)، مما يسمح للمستخدم بحقن أكواد ضارة في خاصيات HTML عبر حقول الإدخال النصية. بينما هذه ثغرة ذاتية (self-XSS)، فإنها تشير إلى فجوة في دالة التعقيم (CWE-79, CVSS 6.1).

3. **بنك الأسئلة مكشوف بالكامل عبر window.QuestionBank:** كافة الأسئلة الـ 200 مع إجاباتها الصحيحة متاحة لأي مستخدم يفتح DevTools. هذا يلغي فعالية اختبار المستوى كأداة تقييم (CWE-200, Medium).

4. **GitHub Action غير مثبت بـ SHA commit hash:** `nwtgck/actions-netlify@v3` يُستخدم بدون تثبيت بالإصدار عبر SHA، مما يعني أن أي تحديث ضار للتاغ v3 يمكن أن يخترق سلسلة التوريد. بالإضافة إلى ذلك، ملف `netlify.toml` يحتوي على wildcard redirect (301 لكل المسارات) يفتح الباب لهجمات الانتحال (open redirect).

5. **YouTube iframe بدون sandbox:** iframe الفيديو لا يحتوي على attribute `sandbox`، مما يسمح للمحتوى المضمن بصلاحيات إضافية (popups, top-level navigation) قد تُستغل في حال اختراق YouTube CDN.

---

## 2. جدول المخاطر

### 2.1 ملخص إحصائي

| الفئة | العدد | التوزيع |
|-------|-------|---------|
| Critical | 0 | 0% |
| High | 4 | 15% |
| Medium | 12 | 44% |
| Low | 7 | 26% |
| Informational | 4 | 15% |
| **المجموع** | **27** | **100%** |

### 2.2 القائمة الكاملة (Critical → Info)

| # | المعرف | العنوان | الأولوية | النوع | الملف | CVSS |
|---|--------|---------|----------|-------|-------|------|
| 1 | SEC-001 | غياب Content-Security-Policy (CSP) | High | Missing Header | netlify.toml/_headers | — |
| 2 | SEC-002 | غياب Strict-Transport-Security (HSTS) | High | Missing Header | netlify.toml/_headers | — |
| 3 | SEC-003 | غياب X-Frame-Options — الموقع قابل للـ clickjacking | High | Missing Header | netlify.toml/_headers | — |
| 4 | SEC-004 | YouTube iframe بدون sandbox — إمكانية تنفيذ كود مضمن | High | iframe Security | video-switcher.js:33 | — |
| 5 | SEC-005 | GitHub Action غير مثبت بـ SHA — ثغرة supply chain | High | Supply Chain | .github/workflows/deploy.yml:29 | 8.2 |
| 6 | SEC-006 | escapeHtml لا يعالج التنصيص — حقن في خاصيات HTML (Self-XSS) | Medium | CWE-79 | level-test.js:87-92 | 6.1 |
| 7 | SEC-007 | بنك الأسئلة كاملًا مع الإجابات مكشوف على window.QuestionBank | Medium | CWE-200 | question-bank.js:3565-3568 | 4.3 |
| 8 | SEC-008 | غياب التحقق من سلامة البيانات — الأسئلة قابلة للتعديل في زمن التشغيل | Medium | CWE-353 | level-test.js:97-128 | 5.3 |
| 9 | SEC-009 | غياب X-Content-Type-Options — هجمات MIME sniffing | Medium | Missing Header | netlify.toml/_headers | — |
| 10 | SEC-010 | غياب Referrer-Policy — تسريب معلومات الإحالة | Medium | Missing Header | netlify.toml/_headers | — |
| 11 | SEC-011 | غياب Permissions-Policy — عدم تعطيل ميزات المتصفح غير المستخدمة | Medium | Missing Header | netlify.toml/_headers | — |
| 12 | SEC-012 | إجابات الاختبار مكشوفة في الذاكرة و DOM | Medium | CWE-200 | level-test.js:94-128 | 4.3 |
| 13 | SEC-013 | غياب SRI (Subresource Integrity) لخطوط Google Fonts | Medium | Missing SRI | mkdocs.yml | — |
| 14 | SEC-014 | غياب SRI للملفات المحلية JS/CSS | Medium | Missing SRI | mkdocs.yml | — |
| 15 | SEC-015 | wildcard redirect 301 في netlify.toml — إمكانية open redirect | Medium | Open Redirect | netlify.toml:20-23 | — |
| 16 | SEC-016 | Clickjacking — لا frame-ancestors في CSP ولا X-Frame-Options | Medium | Missing Header | netlify.toml | — |
| 17 | SEC-017 | التدقيق من طرف العميل فقط — تزوير نتائج اختبار المستوى | Low | CWE-602 | level-test.js:794-843 | 5.3 |
| 18 | SEC-018 | ترتيب الخيارات قابل للتنبؤ (deterministic shift) — لا حماية من الغش | Low | CWE-330 | level-test.js:97-118 | 3.7 |
| 19 | SEC-019 | ضعف PRNG (Math.random()) في Fisher-Yates shuffle | Low | CWE-338 | question-bank.js:3548-3555 | 3.7 |
| 20 | SEC-020 | روابط fallback تستخدم youtube.com بدلاً من youtube-nocookie.com — تتبع | Low | Privacy | video-switcher.js:115,122 | — |
| 21 | SEC-021 | عدم وجود SRI لـ videos.json — بيانات فيديو من مصادر غير موثقة | Low | Data Integrity | videos.json | — |
| 22 | SEC-022 | تتبع عبر YouTube iframe حتى مع youtube-nocookie.com | Low | Privacy | video-switcher.js:33-45 | 3.1 |
| 23 | SEC-023 | اختبار المستوى بالكامل client-side — بدون إرسال للخادم | Low | CWE-602 | level-test.js | 3.5 |
| 24 | SEC-024 | دالة escapeHtml تُستخدم بشكل صحيح في كل innerHTML | Info | Good Practice | level-test.js, exercise-checker.js | — |
| 25 | SEC-025 | video-switcher.js يستخدم DOM APIs آمنة (createElement/appendChild) | Info | Good Practice | video-switcher.js | — |
| 26 | SEC-026 | لا يوجد eval() أو new Function() أو setTimeout(string) في أي ملف | Info | Good Practice | جميع ملفات JS | — |
| 27 | SEC-027 | لا يوجد مفاتيح API أو كلمات سر أو توكنات في الكود | Info | Good Practice | جميع ملفات JS | — |

---

## 3. تفاصيل الثغرات حسب الأولوية

### 3.1 High Priority — يجب المعالجة فوراً

#### SEC-001: غياب Content-Security-Policy (CSP)
- **الملف:** `netlify.toml` / `_headers` (بحاجة للإنشاء)
- **الوصف:** لا يوجد أي CSP header يحدد المصادر المسموح بتحميلها. هذا يعني أن المتصفح لا يقيّد السكريبتات والخطوط والصور التي يمكن تحميلها.
- **الأثر:** أي XSS (حتى لو كان بسيطاً) يصبح قابلاً للاستغلال لأن CSP غير موجود. يمكن تحميل سكريبتات خارجية ضارة.
- **الحل:** أضف CSP صارم في `netlify.toml` أو ملف `_headers`:
  ```
  Content-Security-Policy: default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; frame-src https://www.youtube-nocookie.com; script-src 'self' 'unsafe-inline'; img-src 'self' data: https://img.youtube.com; connect-src 'self'
  ```

#### SEC-002: غياب Strict-Transport-Security (HSTS)
- **الوصف:** لا يوجد HSTS header. الموصلات HTTPS يمكن خفضها إلى HTTP عبر هجوم SSL-stripping.
- **الأثر:** مستخدم في شبكة عامة (WiFi) يمكن اعتراض اتصاله وتحويله إلى HTTP.
- **الحل:** أضف: `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`

#### SEC-003: غياب X-Frame-Options — Clickjacking
- **الوصف:** أي موقع خارجي يمكنه وضع صفحات الموقع في iframe شفاف.
- **الأثر:** هجوم overlay — المستخدم يظن أنه ينقر على موقع المهاجم لكنه ينقر على أزرار الموقع الحقيقي.
- **الحل:** `X-Frame-Options: DENY` أو `frame-ancestors 'none'` في CSP.

#### SEC-004: YouTube iframe بدون sandbox
- **الملف:** `docs/assets/js/video-switcher.js:33`
- **الوصف:** iframe اليوتيوب يُنشأ بدون attribute `sandbox`، مما يمنح المحتوى المضمن صلاحية فتح popups والنوافذ المنبثقة.
- **الأثر:** YouTube يمكنه فتح نوافذ جديدة وتنفيذ عمليات tracking إضافية.
- **الحل:** أضف `iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-presentation allow-popups');`

#### SEC-005: GitHub Action غير مثبت بـ SHA
- **الملف:** `.github/workflows/deploy.yml:29`
- **الوصف:** `nwtgck/actions-netlify@v3` يُستخدم بدون تثبيت بـ SHA commit hash. التاغ v3 يمكن تحديثه بإصدار ضار.
- **الأثر:** سلسلة توريد كاملة معرضة للاختراق — يمكن لـ action ضار الوصول إلى `NETLIFY_AUTH_TOKEN` و `NETLIFY_SITE_ID`.
- **الحل:** غيّر إلى SHA: `nwtgck/actions-netlify@<full-commit-sha>`.

### 3.2 Medium Priority — يجب المعالجة قريباً

#### SEC-006: escapeHtml لا يعالج التنصيص — Self-XSS في خاصيات HTML
- **الملف:** `docs/assets/js/level-test.js:87-92`
- **الوصف:** دالة `escapeHtml` تستخدم `createTextNode` ثم تقرأ `.innerHTML` — هذا يعالج `<` و `>` و `&` لكن لا يعالج `"` و `'` لأن هذه الأحرف صالحة في نص HTML. لكنها غير آمنة في خاصيات HTML.
- **الاستغلال:** اكتب في أي سؤال نصي: `" autofocus onfocus="alert(document.cookie)`
- **الأثر:** تنفيذ كود JavaScript في سياق المستخدم. رغم أنها self-XSS (تؤثر فقط على المستخدم الذي أدخلها)، إلا أنها تشير إلى فجوة في دالة التعقيم.
- **الحل:** استبدل `escapeHtml` بدالة تعالج جميع الأحرف الخمسة: `& → &amp;`, `< → &lt;`, `> → &gt;`, `" → &quot;`, `' → &#x27;`.

#### SEC-007: بنك الأسئلة مكشوف بالكامل
- **الملف:** `docs/assets/js/question-bank.js:3565-3568`
- **الوصف:** `window.QuestionBank.all` يعرض جميع الأسئلة (~200) مع الإجابات الصحيحة لأي مستخدم عبر DevTools.
- **الأثر:** يمكن لأي طالب الغش في اختبار المستوى بسهولة.
- **الحل:** استخدم IIFE أو module pattern ولا تعرض `QuestionBank` على `window`.

#### SEC-008: غياب التحقق من سلامة البيانات
- **الملف:** `level-test.js:97-128`
- **الوصف:** لا `Object.freeze()` ولا `Object.seal()` على بنى البيانات. أي إضافة متصفح أو سكريبت可以被حقنه يمكنه تعديل الأسئلة والإجابات.
- **الأثر:** يمكن لأي extension أو injected script تغيير الأسئلة في زمن التشغيل.
- **الحل:** أضف `Object.freeze()` على بيانات الأسئلة بعد التهيئة، وأضف SRI integrity على وسوم `<script>`.

#### SEC-013 — SEC-014: غياب SRI
- **الوصف:** خطوط Google Fonts تُحمّل من CDN بدون integrity hash. الملفات المحلية JS/CSS أيضاً بدون integrity.
- **الأثر:** أي اختراق لـ CDN Google Fonts يمكنه تعديل مظهر الموقع أو تنفيذ هجمات CSS.
- **الحل:** استضف الخطوط محلياً، أو أضف `integrity` hashes.

#### SEC-015: Wildcard Redirect — Open Redirect
- **الملف:** `netlify.toml:20-23`
- **الوصف:** `[[redirects]] from = "/*" to = "https://study-german.pages.dev/:splat" status = 301`
- **الأثر:** يمكن استغلال هذا الـ redirect في حملات phishing (مثلاً: `evil.com/study-german.pages.dev` → يعتقد المستخدم أنه في الموقع الأصلي).
- **الحل:** استخدم قائمة محددة من المسارات أو أزل الـ redirect إذا لم يعد ضرورياً.

### 3.3 Low Priority — معالجة عند توفر الوقت

#### SEC-017: تزوير نتائج اختبار المستوى
- الموقع التعليمي يعتمد على التقييم الذاتي — تزوير النتيجة يضر الطالب نفسه فقط. لكن التوصيات (Grammar Recommendations, خطة الدراسة) تعتمد على هذه النتائج، مما قد يؤدي إلى خطة دراسة غير مناسبة.

#### SEC-020: روابط Fallback تستخدم youtube.com
- **الملف:** `video-switcher.js:115,122`
- روابط النص الاحتياطية تستخدم `youtube.com` بدلاً من `youtube-nocookie.com` — يسمح بتتبع Google.

#### SEC-022: تتبع YouTube حتى مع youtube-nocookie.com
- حتى وضع الخصوصية المحسّن من يوتيوب يمكنه تعيين cookies — لا يمكن تحييد هذا بالكامل من طرف الموقع.

### 3.4 Informational — نقاط إيجابية

- دالة `escapeHtml` تُستخدم بشكل صحيح ومستمر في كل innerHTML.
- `video-switcher.js` يستخدم DOM APIs آمنة (createElement/appendChild) بدلاً من innerHTML.
- لا يوجد `eval()`, `new Function()`, أو `setTimeout(string)` في أي ملف.
- لا يوجد مفاتيح API أو كلمات سر في الكود المصدري.

---

## 4. خريطة طريق 30/60/90 يوماً

### المرحلة 1: الأيام 1-30 — الإصلاحات العاجلة (High Priority)

| اليوم | المهمة | المعرف | الجهد |
|-------|--------|--------|-------|
| 1-2 | إضافة رؤوس الأمن: CSP, HSTS, XFO, XCTO, Referrer-Policy, Permissions-Policy | SEC-001,002,003,009,010,011 | 2 ساعات |
| 2-3 | إضافة `sandbox` إلى iframe اليوتيوب | SEC-004 | 15 دقيقة |
| 3-4 | تثبيت GitHub Action بـ SHA commit hash | SEC-005 | 30 دقيقة |
| 4-5 | إصلاح دالة `escapeHtml` لتعالج التنصيص | SEC-006 | 30 دقيقة |
| 5-7 | إخفاء بنك الأسئلة (إزالة window.QuestionBank) | SEC-007 | 2 ساعات |
| 7-10 | إضافة CSP صارم + إزالة الـ wildcard redirect | SEC-015 | 1 ساعة |
| 10-12 | إضافة Object.freeze() على بيانات الأسئلة | SEC-008 | 30 دقيقة |
| 12-14 | اختبار شامل بعد التعديلات (regression test) | — | 3 ساعات |
| 14-30 | متابعة ومراقبة عدم عودة الثغرات | — | — |

**مجموع الجهد المقدر للمرحلة 1:** ~10 ساعات عمل

### المرحلة 2: الأيام 31-60 — تحسينات أمنية متوسطة

| اليوم | المهمة | المعرف | الجهد |
|-------|--------|--------|-------|
| 31-35 | استضافة خطوط Google Fonts محلياً (self-hosting) | SEC-013 | 3 ساعات |
| 35-40 | إضافة SRI integrity hashes للملفات المحلية JS/CSS | SEC-014 | 2 ساعات |
| 40-45 | إضافة SRI لـ HTML النهائي (عبر build pipeline) | SEC-014 | 3 ساعات |
| 45-50 | تغيير روابط fallback إلى youtube-nocookie.com | SEC-020 | 30 دقيقة |
| 50-55 | تحسين عملية خلط الأسئلة (random seed لكل جلسة) | SEC-018 | 2 ساعات |
| 55-60 | إضافة console tamper detection لاختبار المستوى | SEC-017 | 2 ساعات |

**مجموع الجهد المقدر للمرحلة 2:** ~12.5 ساعة عمل

### المرحلة 3: الأيام 61-90 — تحسينات استراتيجية

| اليوم | المهمة | المعرف | الجهد |
|-------|--------|--------|-------|
| 61-70 | استبدال Math.random() بـ crypto.getRandomValues() | SEC-019 | 1 ساعة |
| 70-80 | تحقق دوري من صحة videos.json (YouTube API) | SEC-021 | 4 ساعات |
| 80-85 | استخدام module pattern (ES modules) بدلاً من global variables | SEC-007 | 6 ساعات |
| 85-90 | تدقيق أمني ثانٍ (regression audit) + تقرير المتابعة | — | 4 ساعات |

**مجموع الجهد المقدر للمرحلة 3:** ~15 ساعة عمل

---

## 5. التوصيات الفورية (يمكن تنفيذها اليوم)

### 5.1 ملف `_headers` لـ Cloudflare Pages
أنشئ ملف `docs/_headers` بالمحتوى التالي:

```
/*
  Content-Security-Policy: default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; frame-src https://www.youtube-nocookie.com; script-src 'self' 'unsafe-inline'; img-src 'self' data: https://img.youtube.com; connect-src 'self'
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### 5.2 GitHub Action — تثبيت SHA
في `.github/workflows/deploy.yml`، غيّر:
```yaml
- name: Deploy to Netlify
  uses: nwtgck/actions-netlify@SHA_HERE  # ← استبدل v3 بـ SHA hash
```

### 5.3 iframe sandbox
في `docs/assets/js/video-switcher.js:33`، أضف بعد إنشاء الـ iframe:
```javascript
iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-presentation allow-popups');
```

### 5.4 إصلاح escapeHtml
في `docs/assets/js/level-test.js:87-92`، استبدل الدالة بـ:
```javascript
function escapeHtml(text) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    var escaped = div.innerHTML;
    // also escape quotes for attribute context safety
    escaped = escaped.replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
    return escaped;
}
```

---

## 6. التوصيات الاستراتيجية

### 6.1 هندسة الأمن (Security Architecture)
- **نقل التحقق من الإجابات إلى الخادم (Server-side Grading):** إذا كان اختبار المستوى سيُستخدم لقرارات حقيقية (تحديد مستوى، شهادة)، يجب نقل `gradeTest()` إلى خادم وإرسال البيانات مجهولة المصدر فقط.
- **اعتماد Module Pattern:** استبدال المتغيرات العامة (`window.QuestionBank`, `window.Answers`, إلخ) بـ ES Modules مع تصدير محدد ومضبوط. هذا يمنع التلاعب بالبيانات من الـ Console ويحسن تنظيم الكود.
- **إضافة pipeline أمني:** إضافة فحص SRI تلقائي أثناء `mkdocs build` لتوليد integrity hashes وإضافتها إلى HTML النهائي.

### 6.2 سلسلة التوريد (Supply Chain Security)
- **Software Bill of Materials (SBOM):** إنشاء قائمة بجميع dependencies (MkDocs themes, PyPI packages, GitHub Actions) مع إصداراتها المحددة.
- **تفعيل Dependabot:** إضافة `dependabot.yml` لمراقبة تحديثات PyPI و GitHub Actions تلقائياً.
- **تثبيت جميع الـ Actions بـ SHA:** ليس فقط `actions-netlify` بل جميع Actions المستخدمة في deploy.yml.

### 6.3 الخصوصية
- **Self-hosting للخطوط:** تخزين Google Fonts محلياً يلغي طلب DNS إلى Google ويحسن خصوصية المستخدمين. هذا مهم بشكل خاص لمنصة تعليمية قد يستخدمها طلاب لا يرغبون في التتبع.
- **استبدال YouTube Embed بحل مستقل:** من الناحية المثالية، استضافة الفيديوهات التعليمية على خادم خاص أو استخدام خدمة فيديو محترمة للخصوصية (مثل PeerTube). حالياً، `youtube-nocookie.com` هو الحل الأقل ضرراً.
- **مراجعة سياسة الخصوصية:** إذا كان للموقع سياسة خصوصية، تأكد من ذكر YouTube embed و Google Fonts.

### 6.4 المراقبة والتحسين المستمر
- **إضافة فحص أمني أسبوعي:** فحص تلقائي باستخدام `mozilla observatory` أو `securityheaders.com` للتأكد من أن الرؤوس الأمنية لا تزال موجودة.
- **تسجيل الـ Console errors:** إذا كان هناك أي خطأ JS في الإنتاج، يجب تسجيله وتحليله — بعض الأخطاء قد تشير إلى هجوم أو مشكلة أمنية.
- **تدريب الفريق:** إذا كان هناك فريق تطوير، توعية حول ممارسات الترميز الآمن (خاصة حقن HTML والتعامل مع بيانات المستخدم).

### 6.5 خريطة تحسين الدرجة الأمنية

| الإجراء | الدرجة الحالية | الدرجة المتوقعة |
|---------|---------------|-----------------|
| إضافة رؤوس الأمن (CSP, HSTS, XFO, XCTO, RP, PP) | 52 | 85 |
| إضافة SRI للملفات المحلية والخارجية | 85 | 90+ |
| إصلاح self-XSS في escapeHtml | 55 | 70 |
| إخفاء بنك الأسئلة + تحسين خصوصية YouTube | 55 | 75 |
| **الهدف بعد 90 يوماً** | **52** | **90+** |

---

## 7. نموذج التهديدات (STRIDE Summary)

تم تحليل الموقع وفق نموذج STRIDE وتم تحديد 6 سيناريوهات تهديد رئيسية:

| السيناريو | النوع | الخطورة | متجه الهجوم |
|-----------|-------|---------|-------------|
| S1: XSS عبر المحتوى (Pipeline XSS) | Tampering, Escalation | Medium | Git repo / CI/CD |
| S2: Clickjacking (Framing) | Spoofing, Tampering | Medium | أي موقع خارجي |
| S3: تزوير نتائج الاختبار | Spoofing, Tampering, Repudiation | Low | DevTools (محلي) |
| S4: هجمات Supply Chain | جميع STRIDE | High | CDN / CI/CD / PyPI |
| S5: تتبع خفي (YouTube) | Information Disclosure | Low | YouTube CDN |
| S6: هجمات YouTube iframe | Tampering, Information Disclosure | Low | YouTube CDN |

**الملاحظة:** الموقع لا يحتوي على User-Generated Content، لا تخزين لبيانات المستخدمين، لا مصادقة، ولا عمليات حساسة. هذا يقلل بشكل كبير من سطح الهجوم. أكبر المخاطر تأتي من سلسلة التوريد (Supply Chain) ورؤوس الأمن المفقودة.

---

## 8. الجهات المستفيدة والتصعيد

- **فريق التطوير:** معالجة الثغرات ذات الأولوية العالية (المرحلة 1) — رؤوس الأمن، iframe sandbox, GitHub Action SHA, escapeHtml.
- **مدير المشروع:** متابعة خريطة الطريق 30/60/90 وتخصيص الوقت اللازم.
- **فريق المحتوى:** لا توجد إجراءات مطلوبة — الموقع لا يحتوي على UGC وبيانات التمارين آمنة حالياً.
- **فريق DevOps:** تثبيت SHA في GitHub Actions، إضافة ملف `_headers`، مراجعة netlify.toml.

**للتصعيد الفوري:** إذا تم اكتشاف أي اختراق فعلي لـ GitHub Actions أو PyPI dependencies أو CDN، يجب إيقاف deployment فوراً والتحقق من سلامة الملفات المبنية.

---

## 9. نقاط القوة — ما تم بشكل صحيح

من المهم الإشارة إلى أن الموقع يظهر ممارسات أمنية جيدة في جوانب معينة:

1. **لا XSS في innerHTML:** دالة `escapeHtml` تُستخدم بشكل صحيح ومستمر لكل محتوى ديناميكي يُحقن في innerHTML.
2. **لا eval ولا Function():** الكود خالٍ تماماً من أي منشئات تنفيذ كود ديناميكي.
3. **لا مفاتيح API في الكود:** لا توكنات، لا كلمات سر، لا مفاتيح خدمات خارجية.
4. **استخدام youtube-nocookie.com:** اختيار واعٍ لنطاق يوتيوب المحسّن للخصوصية.
5. **DOM APIs آمنة في video-switcher.js:** استخدام createElement/appendChild بدلاً من innerHTML.
6. **هندسة الموقع بسيطة وثابتة:** موقع ثابت بدون خادم، بدون قاعدة بيانات، بدون مصادقة — هذا يقلل سطح الهجوم بشكل كبير.

---

## 10. الملاحق

### الملحق أ: قائمة الملفات التي تحتاج تعديلاً

| الملف | نوع التعديل | الأولوية |
|-------|------------|---------|
| `docs/_headers` (جديد) | إنشاء ملف رؤوس أمنية | عاجل |
| `.github/workflows/deploy.yml` | تثبيت SHA لـ GitHub Action | عاجل |
| `docs/assets/js/video-switcher.js` | إضافة sandbox إلى iframe | عاجل |
| `docs/assets/js/level-test.js` | إصلاح escapeHtml + إخفاء الأسئلة | عاجل |
| `docs/assets/js/question-bank.js` | إزالة window.QuestionBank | عاجل |
| `netlify.toml` | إزالة/تقييد wildcard redirect | عاجل |
| `docs/assets/js/level-test.js` | إضافة Object.freeze() | متوسط |
| `mkdocs.yml` | self-hosting للخطوط + إضافة SRI | متوسط |
| `docs/assets/js/video-switcher.js` | تغيير روابط fallback | منخفض |

### الملحق ب: المصادر والمعايير

- OWASP Top 10 (2021): A01-Broken Access Control, A03-Injection, A05-Security Misconfiguration, A08-Software and Data Integrity Failures
- CWE-79: Cross-site Scripting
- CWE-200: Information Exposure
- CWE-330: Insufficiently Random Values
- CWE-338: Weak PRNG
- CWE-353: Insufficient Verification of Data Authenticity
- CWE-602: Client-Side Enforcement of Server-Side Security
- WCAG 2.2 / W3C Security Considerations
- STRIDE Threat Modeling (Microsoft)
- CVSS 3.1 Scoring
- Mozilla Observatory / securityheaders.com best practices

---

*انتهى التقرير — 2026-07-04*
*تم إعداد التقرير بواسطة مدقق أمني كبير — للمراجعة والمتابعة من قبل فريق التطوير ومدير المشروع*
