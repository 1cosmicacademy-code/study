# Fix Workflow — سير عمل إصلاح الموقع

## نظرة عامة
هذا الـ Workflow ينسق بين 3 Agents متخصصين لإصلاح 12 مشكلة معروفة في موقع تعلم اللغة الألمانية (MkDocs + Material Theme). الأولوية القصوى هي إصلاح الخطأ الحرج في `level-test.js` الذي يمنع اختبار المستوى من العمل بشكل صحيح.

## المشاكل المستهدفة (12 مشكلة)

| # | الأولوية | المشكلة | المسؤول |
|---|----------|---------|---------|
| 1 | 🔴 حرج | `shuffleOptions()` في `level-test.js` — خطأ في حساب الإجابة الصحيحة | JavaScript Developer |
| 2 | 🟠 عالي | `video-switcher.js` — فيديوهات يوتيوب لا تظهر | JavaScript Developer |
| 3 | 🟠 عالي | `mkdocs.yml` — `dir="rtl"` في الصفحات الإنجليزية | Content Fixer |
| 4 | 🟠 عالي | `/grammatik/index/` — رابط 404 | Content Fixer |
| 5 | 🟡 متوسط | تحميل JS غير مشروط (يُحمّل في كل الصفحات) | Content Fixer |
| 6 | 🟡 متوسط | خلط لغات في التمارين الإنجليزية | Content Fixer |
| 7 | 🔵 منخفض | `favicon.ico` مفقود | Content Fixer |
| 8 | 🔵 منخفض | `robots.txt` مفقود | Content Fixer |
| 9 | 🔴 حرج | التحقق من إصلاح `level-test.js` | Integration Tester |
| 10 | 🟠 عالي | التحقق من إصلاح `video-switcher.js` | Integration Tester |
| 11 | 🟡 متوسط | التحقق من جميع التمارين بعد الإصلاحات | Integration Tester |
| 12 | 🔵 منخفض | فحص جميع الصفحات (HTTP 200) + بناء الموقع | Integration Tester |

## هيكل الفريق

```
                                ┌──────────────────────────────┐
                                │       Fix Workflow           │
                                │  (هذا الملف — التنسيق)       │
                                │  - تسلسل الإصلاحات           │
                                │  - متابعة الجودة             │
                                └─────────────┬────────────────┘
                                              │
              ┌───────────────────────────────┼───────────────────────────────┐
              │                               │                               │
              ▼                               ▼                               ▼
    ┌─────────────────────┐       ┌─────────────────────┐       ┌─────────────────────┐
    │  JavaScript Dev     │       │   Content Fixer     │       │  Integration Tester │
    │  .claude/agents/    │       │  .claude/agents/    │       │  .claude/agents/    │
    │  js-developer.md    │       │  content-fixer.md   │       │  integration-       │
    │                     │       │                     │       │  tester.md          │
    │  ▼ level-test.js    │       │  ▼ dir="rtl" fix    │       │                     │
    │  ▼ video-switcher   │       │  ▼ 404 fix          │       │  ▼ level-test verify│
    │                     │       │  ▼ JS loading fix   │       │  ▼ exercise test    │
    │                     │       │  ▼ language mix fix │       │  ▼ page check       │
    │                     │       │  ▼ favicon/robots   │       │  ▼ build check      │
    └─────────────────────┘       └─────────────────────┘       └─────────────────────┘
```

## Model Policy (مهم — إجباري)

**كل Agent يجب أن يُشغل بـ Opus.**

- ✅ **Opus:** Agent الأساسي — دقيق، يعالج الأكواد المعقدة والمنطق
- ❌ **Sonnet:** فشل سابقاً مع مزود الخدمة للمشروع — لا يُستخدم
- ❌ **Haiku:** فشل سابقاً مع مزود الخدمة للمشروع — لا يُستخدم

الـ 3 Agents يشتغلون بـ Opus فقط. لا Fallback.

---

## تسلسل التشغيل

### المرحلة 0: الإعداد — تشغيل السيرفر وقراءة الهيكل

**التنفيذ:** الشخص المنسق (Claude الرئيسي)

**الخطوات:**
1. شغّل `mkdocs serve` على السيرفر المحلي
2. تأكد من أن الموقع يعمل على `http://localhost:8000`
3. اقرأ `mkdocs.yml` لفهم هيكل الموقع
4. اقرأ ملفات JS المطلوب إصلاحها (level-test.js, video-switcher.js)
5. جهز قائمة الملفات التي ستحتاج تعديلاً

**المخرجات:** سيرفر يعمل + فهم كامل للمشاكل

---

### المرحلة 1: إصلاح المشكلة الحرجة — level-test.js (JS Developer)

**التسلسل:** أولوية قصوى — قبل أي شيء آخر

**التعليمة:**
```bash
use subagent js-developer in fix-level-test mode to "إصلاح وظيفة shuffleOptions في level-test.js"
```

**المهمة:**
1. دمج الإصلاح في `docs/assets/js/level-test.js`
2. تأكيد أن الإصلاح يعالج السبب الجذري (افتراض answer index 0)
3. إضافة تعليق يشرح التغيير
4. عدم تعديل أي شيء آخر

**معايير القبول:**
- الدالة تحسب الإجابة الجديدة بناءً على الإجابة الأصلية الحقيقية (A, B, C) وليس index 0
- أسئلة answer: 'B' و 'C' أصبحت تُصحح بشكل صحيح بعد الخلط
- جميع الحالات الحدية مغطاة (n<2, shift===0, type text)

**مدة التنفيذ المتوقعة:** < 15 دقيقة

---

### المرحلة 2: إصلاح المشاكل العالية (JS Dev + Content Fixer — بالتوازي)

**التسلسل:** بعد إكمال المرحلة 1

#### Agent A: JavaScript Developer — إصلاح video-switcher.js

**التعليمة:**
```bash
use subagent js-developer in fix-video-switcher mode to "إصلاح ظهور فيديوهات يوتيوب في video-switcher.js"
```

**المهمة:**
1. تشخيص سبب عدم ظهور فيديوهات يوتيوب
2. إصلاح الكود (أو أي ملف مرتبط)
3. التحقق المنطقي من الإصلاح

**مدة التنفيذ المتوقعة:** < 20 دقيقة

#### Agent B: Content Fixer — إصلاح مشاكل المحتوى

**التعليمة الأولى:**
```bash
use subagent content-fixer in fix-rtl-english mode to "إصلاح dir rtl في الصفحات الإنجليزية"
```

**التعليمة الثانية:**
```bash
use subagent content-fixer in fix-404-grammatik mode to "إصلاح رابط 404 grammatik/index"
```

**المهام:**
1. إصلاح `dir="rtl"` للصفحات الإنجليزية في `mkdocs.yml`
2. إصلاح رابط `/grammatik/index/` (إنشاء صفحة فهرس أو تعديل المسار)

**مدة التنفيذ المتوقعة:** < 30 دقيقة (لكليهما)

---

### المرحلة 3: إصلاح المشاكل المتوسطة والمنخفضة (Content Fixer — متسلسل)

**التسلسل:** بعد إكمال المرحلة 2

#### Agent: Content Fixer

**التعليمة الأولى:**
```bash
use subagent content-fixer in fix-js-loading mode to "إصلاح تحميل JavaScript المشروط حسب نوع الصفحة"
```

**التعليمة الثانية:**
```bash
use subagent content-fixer in fix-language-mix mode to "إصلاح خلط اللغات في التمارين الإنجليزية"
```

**التعليمة الثالثة:**
```bash
use subagent content-fixer in fix-site-essentials mode to "إنشاء favicon.ico و robots.txt"
```

**المهام:**
1. ضبط تحميل JS ليكون مشروطاً (exercise-checker → Übungsbuch فقط، level-test → صفحة المستوى فقط)
2. إصلاح خلط اللغات في تمارين الإنجليزية
3. إنشاء `favicon.ico` و `robots.txt`

**مدة التنفيذ المتوقعة:** < 45 دقيقة (للثلاثة)

---

### المرحلة 4: التحقق والتكامل (Integration Tester)

**التسلسل:** بعد إكمال جميع الإصلاحات في المراحل 1-3

#### Agent: Integration Tester

**التعليمة الأولى (اختبار مستوى):**
```bash
use subagent integration-tester in test-level-test mode to "التحقق من إصلاح تصحيح اختبار المستوى الـ42 سؤالاً"
```

**التعليمة الثانية (اختبار تمارين):**
```bash
use subagent integration-tester in test-exercises mode to "اختبار جميع أنواع التمارين choice/text/match"
```

**التعليمة الثالثة (فحص صفحات):**
```bash
use subagent integration-tester in test-pages mode to "فحص جميع الصفحات وضمان HTTP 200"
```

**التعليمة الرابعة (فحص بناء):**
```bash
use subagent integration-tester in test-build mode to "تشغيل mkdocs build --verbose والتأكد من خلوه من الأخطاء"
```

**المهام:**
1. التحقق من أن `shuffleOptions()` تُصحح بشكل صحيح لكل أنواع الإجابات
2. اختبار التمارين (choice, text, match) للتأكد من أنها تعمل
3. فحص جميع الصفحات في `mkdocs.yml` للتأكد من HTTP 200
4. تشغيل `mkdocs build --verbose` والتأكد من عدم وجود ERROR
5. إذا فشل أي اختبار، تقديم تقرير مفصل مع خطوات إعادة الإنتاج

**مدة التنفيذ المتوقعة:** < 30 دقيقة

---

### المرحلة 5: إعداد التقارير النهائية (Integration Tester)

**التسلسل:** بعد إكمال المرحلة 4

**التعليمة:**
```bash
use subagent integration-tester in print-report mode to "إنشاء تقرير الانحدار النهائي بعد الإصلاحات"
```

**المخرجات:**
- `/docs/qa/regression-YYYY-MM-DD.md` — تقرير الانحدار النهائي

**محتويات التقرير:**
1. ملخص تنفيذي: هل تم إصلاح جميع المشاكل؟
2. حالة كل مشكلة من الـ 12:
   - ✅ أصلحت واجتازت الاختبار
   - ❌ لم تُصلح بعد (مع التفاصيل)
   - 🔄 أصلحت لكن فشلت في الاختبار
3. تفاصيل أي فشل مع خطوات إعادة الإنتاج
4. توصيات للمرحلة القادمة (إن وجدت)

---

## مخطط التوقيت

```
المرحلة 0: الإعداد                    [5 دقائق]
المرحلة 1: level-test.js (urgent)    [15 دقيقة]  ← حرج، خط واحد
المرحلة 2A: video-switcher.js        [20 دقيقة]  ← بالتوازي مع 2B
المرحلة 2B: rtl + 404 fix            [30 دقيقة]  ← بالتوازي مع 2A
المرحلة 3A: js-loading fix           [15 دقيقة]
المرحلة 3B: language-mix fix         [20 دقيقة]
المرحلة 3C: favicon/robots           [10 دقائق]
المرحلة 4A: level-test verify        [10 دقائق]
المرحلة 4B: exercises verify         [15 دقيقة]
المرحلة 4C: pages verify             [10 دقائق]
المرحلة 4D: build verify             [5 دقائق]
المرحلة 5: report                    [10 دقائق]
──────────────────────────────────────────────
المجموع التقديري:                    [~2.5 ساعة]
```

## سيناريوهات الطوارئ

### 1. فشل إصلاح level-test.js
- **العرض:** بعد إصلاح `shuffleOptions()`، لا تزال الإجابات تُصحح بشكل خاطئ
- **الإجراء:** تتبع منطق الحساب خطوة بخطوة مع سؤال حقيقي (answer: 'B'، 4 options، shift=3 مثلاً)
- **الرجوع للخلف:** إذا استمر الفشل بعد محاولتين، أبلغ المنسق واطلب مراجعة الكود

### 2. mkdocs build يفشل بعد تعديل mkdocs.yml
- **العرض:** بعد إصلاح dir rtl، `mkdocs build` يظهر ERROR
- **الإجراء:** اقرأ أول 3 أسطر من ERROR، حدد موقع الخطأ في YAML
- **الإصلاح السريع:** الغ التعديل الأخير وحاول حلاً بديلاً

### 3. إصلاح video-switcher.js يكسر التمارين
- **العرض:** بعد تعديل video-switcher، التمارين التفاعلية لا تعمل
- **الإجراء:** تحقق من أن exercise-checker.js لا يزال يُحمّل ويعمل
- **الإصلاح:** إعادة الملف إلى حالته الأصلية (git checkout)

### 4. خلط اللغات واسع النطاق
- **العرض:** أكثر من 5 صفحات Übungsbuch إنجليزية تعاني من خلط اللغات
- **الإجراء:** أبلغ المنسق — قد تكون مشكلة نظامية في البيانات أو الـ template
- **لا تصلح كل صفحة يدوياً** — ابحث عن السبب الجذري

---

## معايير الإكمال (Definition of Done)

| المعيار | الوصف | طريقة القياس |
|---------|-------|-------------|
| **All 12 issues addressed** | تمت معالجة جميع المشاكل الـ12 | قائمة المشاكل — كلها STATE = DONE |
| **Level test works** | أسئلة A, B, C تُصحح بشكل صحيح | اختبار يدوي لـ 3 أسئلة من كل نوع |
| **No 404 pages** | جميع مسارات mkdocs.yml تعطي 200 | test-pages يمر بنجاح |
| **Build passes** | mkdocs build --verbose لا يظهر ERROR | test-build يمر بنجاح |
| **Exercises work** | choice/text/match كلها تصحح بشكل صحيح | test-exercises يمر بنجاح |
| **English pages correct** | لا dir rtl في الإنجليزية، لا خلط لغات | فحص 3 صفحات إنجليزية |
| **Report delivered** | تقرير الانحدار في /docs/qa/ | ملف موجود |
