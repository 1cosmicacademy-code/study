---
title: Video Content QA Skill
model: sonnet
---

## الوصف (Arabic)
المهارة **video-content-qa** تمكّن الـ Agent من فحص جودة وصحة الفيديوهات التعليمية المتضمنة في صفحات الموقع، والتحقق من صلاحية الروابط، ومطابقة محتوى الفيديو مع موضوع الدرس أو القاعدة، وإصدار تقارير شاملة مع توصيات تحسين.

## الاستخدام
```bash
/skill video-content-qa <lesson-or-grammar-path> [--lang ar|en]
```
- `<lesson-or-grammar-path>`: مسار ملف الدرس أو قاعدة القواعد (مثال: `docs/a1/kursbuch/grammatik-01.md`).
- `--lang`: لغة الملف؛ إذا لم يُحدّد يُستنتج من امتداد الملف.

## خطوات التنفيذ التي تقوم بها المهارة
1. **قراءة الملف** بالكامل لاستخراج معرّف الفيديو `data-video-id` وإدراج السياق التعليمي (العنوان، الوصف، الكلمات المفتاحية).
2. **التحقق من صلاحية الرابط** عبر طلب HEAD إلى `https://www.youtube-nocookie.com/embed/<VIDEO_ID>`؛ التأكد من استجابة HTTP 200.
3. **مراجعة محتوى الفيديو** باستخدام **Kimi WebBridge** لتشغيل الفيديو الأول 30 ثانية ومقارنة المحتوى مع الكلمات المفتاحية المستخرجة.
4. **تحليل جودة الإعداد** (دقة الصورة ≥720p، صوت واضح، مدة بين 2‑15 دقيقة، عدم وجود إعلانات أمامية طويلة).
5. **إنشاء سجل في `videos.json`** (إن لم يكن موجوداً) أو تحديث الحالة إلى `valid`/`invalid`/`needs‑refresh`.
6. **تشغيل `mkdocs build --verbose`** للتأكد من عدم وجود أخطاء بناء بعد أي تعديل على الـ Markdown.
7. **إرجاع تقرير JSON** يحتوي على:
   - `lessonPath`
   - `language`
   - `videoId`
   - `validation` (status, httpStatus, contentMatch, qualityScore, views, likesRatio, durationSec)
   - `action` (none, replace, remove)
   - `buildStatus`

## المخرجات (مثال)
```json
{
  "lessonPath": "docs/a2/kursbuch/verb-03.md",
  "language": "en",
  "videoId": "dQw4w9WgXcQ",
  "validation": {
    "httpStatus": 200,
    "contentMatch": 93,
    "qualityScore": 89,
    "views": 22200,
    "likesRatio": 0.96,
    "durationSec": 380
  },
  "action": "none",
  "buildStatus": "success"
}
```

## المتطلبات
- نموذج **Sonnet** فقط – لا يجوز استعمال نماذج أخرى.
- لا يجوز تعديل ملفات JavaScript (`video-switcher.js`) أو ملفات CSS.
- يجب أن تكون ملفات الفيديو مدمجة عبر سمة `data-video-id` الموجودة في الـ Markdown.
- يجب تشغيل `mkdocs build --verbose` بعد أي تعديل لضمان عدم وجود أخطاء بناء.

## مراجع (من عمليات البحث)
- Job description source: [Video QA Engineer Job Description – Indeed 2025]().
- Skills source: [YouTube Content Review Guidelines – Google 2026]().
- KPIs source: [Video QA KPIs for E‑learning – eLearning Industry 2025]().
