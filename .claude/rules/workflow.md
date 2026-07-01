# قواعد سير العمل

## التفويض (Delegation)
1. المستخدم يطلب مهمة
2. كلود يوكّل المهمة لـ subagent (أو ينفذها مباشرة للبسيطة)
3. بعد الانتهاء — كلود يلخص النتيجة للمستخدم
4. المستخدم يراجع ويقرر الخطوة التالية

## استخدام Subagents
- للتحقيقات: "Use a subagent to investigate X"
- للمراجعة: "Use a subagent to review this code for edge cases"
- للاستكشاف: استخدم Explore agent بدل قراءة كل ملف

## Ultracode
- مستوى effort: xhigh (دائماً)
- Workflows: يدوي فقط — لا تشغيل تلقائي
- عند الحاجة لـ workflow — صِف الخيار واسأل المستخدم
