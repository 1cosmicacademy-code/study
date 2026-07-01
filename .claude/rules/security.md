---
paths:
  - "**/*.{js,ts,jsx,tsx,py,java,go,rs,json,yaml,yml}"
---

# الأمان

## ممنوع
- لا تضع secrets, keys, tokens في الكود
- لا تستخدم `eval()` أو `exec()` على مدخلات المستخدم
- لا تعرض معلومات حساسة في logs أو error messages

## مطلوب
- تحقق من صحة المدخلات (input validation)
- استخدم parameterized queries مع قواعد البيانات
- أضف rate limiting على الـ APIs العامة
- راجع أذونات الملفات والـ dependencies
