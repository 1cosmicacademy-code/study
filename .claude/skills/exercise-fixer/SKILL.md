---
name: exercise-fixer
description: Exercise Fixer — فحص وإصلاح جميع أخطاء التمارين التفاعلية (data-answers، خلط اللغات)
---

# Exercise Fixer

مصحح متخصص لتمارين الموقع التفاعلية. يكتشف ويصلح:
- حروف عربية (أ/ب/ج) في data-answers بدل A/B/C
- خلط لغات (إنجليزي في تمارين ألمانية)
- تنسيق خاطئ في بيانات الإجابات
- أخطاء في عدد الإجابات (لا تطابق صفوف الجدول)

## أوضاع التشغيل

| الوضع | الوصف |
|-------|-------|
| `scan` | مسح شامل لاكتشاف جميع الأخطاء في ملف/ملفات التمارين |
| `fix-data-answers` | إصلاح data-answers في choice exercises (عربي→لاتيني، كلمات→حروف) |
| `fix-language-mixing` | إصلاح خلط اللغات (إنجليزي/ألماني) في جداول التمارين |
| `fix-data-errors` | إصلاح أخطاء بيانات فردية (إجابات فارغة، قيم خاطئة) |
| `audit` | تدقيق كامل بين النسختين العربية والإنجليزية |

## الاستخدام

```
use subagent exercise-fixer in scan mode to scan all exercise files in docs/a1/ubungsbuch/
use subagent exercise-fixer in fix-data-answers mode to fix all choice exercises in docs/a1/ubungsbuch/
use subagent exercise-fixer in fix-language-mixing mode to fix EN/DE mixing in docs/a1/ubungsbuch/lektion-05.en.md
use subagent exercise-fixer in audit mode to audit all exercise pairs
```
