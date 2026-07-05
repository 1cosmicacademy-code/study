# QA Audit Workflow — سير عمل التدقيق الشامل

## نظرة عامة
هذا الـ Workflow ينسق بين 4 Agents لتشغيل عملية تدقيق شاملة لموقع تعلم اللغة الألمانية. الـ Workflow يضمن تغطية كاملة لجميع جوانب الجودة من خلال توزيع المهام على المتخصصين ثم تجميع النتائج في تقرير موحد.

## هيكل فريق التدقيق

```
                          ┌─────────────────────────┐
                          │     QA Manager          │
                          │  (مدير ضمان الجودة)      │
                          │  - تخطيط + تنسيق + تقرير │
                          └───────────┬─────────────┘
                                      │
            ┌─────────────────────────┼─────────────────────────┐
            │                         │                         │
            ▼                         ▼                         ▼
  ┌───────────────────┐   ┌───────────────────┐   ┌───────────────────┐
  │ Frontend QA Agent  │   │ Content QA Agent  │   │User Simulation Ag.│
  │ - UI Audit        │   │ - Content Audit   │   │ - Full Browse     │
  │ - Responsive      │   │ - Video Verify    │   │ - Exercise Solve  │
  │ - Accessibility   │   │ - Link Integrity  │   │ - Video Watch     │
  │ - Performance     │   │ - Data Validation │   │ - Bilingual Check │
  │ - CSS/HTML        │   │ - Translation     │   │ - Error Scenarios │
  └───────────────────┘   └───────────────────┘   └───────────────────┘
```

## تسلسل التشغيل

### المرحلة 0: الإعداد (QA Manager)
1. تشغيل `mkdocs serve` على السيرفر المحلي
2. التأكد من أن الموقع يعمل على `http://localhost:8000`
3. قراءة `mkdocs.yml` لتحديد قائمة الصفحات
4. تحديد نطاق التدقيق (A1 فقط / جميع المستويات / صفحات محددة)
5. تنفيذ `plan-audit` mode لإنشاء خطة التدقيق

### المرحلة 1: فحص متوازي (الـ 3 Agents — بالتوازي)
جميع الـ 3 Agents ينطلقون في نفس الوقت، كل في مجال تخصصه:

#### Agent 1: Frontend QA Agent
```bash
use subagent frontend-qa-agent in ui-audit mode to "فحص جميع صفحات A1"
use subagent frontend-qa-agent in responsive-check mode to "فحص تجاوب A1"
use subagent frontend-qa-agent in accessibility-audit mode to "تدقيق وصول A1"
use subagent frontend-qa-agent in performance-audit mode to "فحص أداء 5 صفحات رئيسية"
use subagent frontend-qa-agent in css-html-audit mode to "فحص جودة كود الصفحات"
```

#### Agent 2: Content QA Agent
```bash
use subagent content-qa-agent in content-audit mode to "فحص جميع دروس A1"
use subagent content-qa-agent in video-verification mode to "التحقق من فيديوهات A1"
use subagent content-qa-agent in link-integrity mode to "فحص روابط A1"
use subagent content-qa-agent in data-validation mode to "التحقق من بيانات تمارين A1"
use subagent content-qa-agent in translation-check mode to "فحص ترجمة A1"
use subagent content-qa-agent in structure-audit mode to "فحص هيكل الموقع"
```

#### Agent 3: User Simulation Agent
```bash
use subagent user-simulation-agent in full-browse mode to "تصفح A1 كمستخدم جديد"
use subagent user-simulation-agent in exercise-solve mode to "حل جميع تمارين A1"
use subagent user-simulation-agent in video-watch mode to "تشغيل فيديوهات A1"
use subagent user-simulation-agent in bilingual-check mode to "فحص العربية والإنجليزية"
use subagent user-simulation-agent in error-scenarios mode to "اختبار سيناريوهات الخطأ"
```

### المرحلة 2: التجميع (QA Manager)
بعد اكتمال جميع الـ Agents:
1. تنفيذ `consolidate-results` mode
2. إزالة التكرار بين تقارير الـ Agents
3. تصنيف الأخطاء حسب الأولوية والنوع
4. تحليل الأسباب الجذرية
5. إضافة توصيات الإصلاح

### المرحلة 3: التقرير (QA Manager)
1. تنفيذ `generate-report` mode
2. كتابة التقرير النهائي في `/docs/qa/report-YYYY-MM-DD.md`
3. تسليم التقرير لإدارة المشروع

### المرحلة 4: المتابعة (QA Manager)
1. بعد تطبيق الإصلاحات — تنفيذ `regression-plan` mode
2. إعادة فحص الصفحات المعدلة عبر الـ 3 Agents
3. تكرار المراحل 2-3 للتأكيد

## Model Fallback Strategy

| المستوى | الـ Agent | النموذج الأساسي | Fallback 1 | Fallback 2 |
|---------|-----------|-----------------|------------|------------|
| 1 (حرج) | QA Manager | Opus | — | — |
| 2 (عادي) | Frontend QA Agent | Opus | Sonnet | Haiku |
| 3 (عادي) | Content QA Agent | Opus | Sonnet | Haiku |
| 4 (عادي) | User Simulation Agent | Opus | Sonnet | Haiku |

### سياسة Fallback
- **Opus:** للمهام الحرجة التي تتطلب دقة عالية (تحليل، تقارير، توصيات)
- **Sonnet:** للمهام المتوسطة (فحص UI، فحص روابط)
- **Haiku:** للمهام السريعة البسيطة (فحص سريع، smoke test فقط)

## آليات الجودة

### Screenshots
- Frontend: screenshot لكل صفحة في كل حرف شاشة
- Content: screenshot للصفحات مع مشاكل محتوى
- User Simulation: screenshot لكل خطوة في رحلة المستخدم
- QA Manager: دمج screenshots في التقرير النهائي

### التقارير
- تقارير Agents: مفصلة، لكل Agent، مع Screenshots
- تقرير QA Manager: شامل، مع ملخص تنفيذي، أولويات، توصيات

### التواصل
- النتائج النهائية: `/docs/qa/report-YYYY-MM-DD.md`
- Screenshots: `/docs/qa/screenshots/YYYY-MM-DD/`
- تقارير Agents المؤقتة: `/docs/qa/agent-reports/YYYY-MM-DD/`

## حالات خاصة

### الفشل في التشغيل
إذا فشل أحد الـ Agents في إكمال مهمته:
1. أعد تشغيله مرة واحدة مع نفس المهمة
2. إذا فشل مجدداً — قلص نطاق المهمة (نصف الصفحات)
3. إذا استمر الفشل — أبلغ QA Manager وانتقل إلى Agent التالي

### الوقت الزائد
إذا استغرق Agent وقتاً أطول من المتوقع:
1. الحد الأقصى لكل Agent: 30 دقيقة
2. بعد 30 دقيقة — QA Manager يقرر: استمرار أم تقليص النطاق
3. سجل الوقت الزائد في تقييم أداء Agent

### تعارض التقارير
إذا أبلغ Agentان عن نفس الخطأ:
1. احتفظ بتقرير واحد مع دمج المعلومات
2. أشر إلى كلا المصدرين في التقرير
3. الأولوية: أعلى تقدير من أي Agent
