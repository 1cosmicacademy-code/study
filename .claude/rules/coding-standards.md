---
paths:
  - "**/*.{js,ts,jsx,tsx,py,java,go,rs}"
---

# معايير البرمجة

## عام
- اتّبع نمط الكود الموجود في المشروع (اتساق لا إعادة كتابة)
- استخدم ES modules (import/export) مع TypeScript
- التسمية: camelCase للمتغيرات والدوال، PascalCase للكلاسات
- أضف تعليقات فقط عند الضرورة — الكود الواضح لا يحتاج تعليق

## الجودة
- غطِّ الحالات الحدية (edge cases)
- لا تترك dead code أو commented-out code
- أضف type hints/types أينما أمكن
