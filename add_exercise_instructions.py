#!/usr/bin/env python3
"""
أضف تعليمات توضيحية فوق كل تمرين في ملفات القواعد
يحدد نوع التمرين تلقائياً ويضيف شرحاً مناسباً
"""

import os
import re
import json

GRAMMATIK_DIR = "h:/دراسة/docs/grammatik"

# الأنماط المختلفة للتمارين وإرشاداتها
INSTRUCTIONS_AR = {
    "fill_word": "✏️ **أكمل الفراغ بالكلمة الصحيحة:** اكتب كلمة واحدة فقط في كل خانة.",
    "fill_sentence": "✏️ **أكمل الفراغ:** اكتب الإجابة كاملة في الخانة.",
    "multiple_choice": "✏️ **اختر الإجابة الصحيحة من الخيارات:**",
    "sentence_building": "✏️ **رتّب الكلمات لتكوين جملة صحيحة:**",
    "classification": "🔤 **صنّف حسب النوع:** اكتب رمز التصنيف المناسب.",
    "true_false": "✅ **حدد: ✅ صحيح / ❌ خطأ:**",
    "translation": "✏️ **ترجم الجملة إلى الألمانية:**",
    "fill_table": "✏️ **أكمل الجدول بالكلمة الصحيحة:**",
}

INSTRUCTIONS_EN = {
    "fill_word": "✏️ **Fill in the blank with the correct word:** Write only one word in each field.",
    "fill_sentence": "✏️ **Complete the blank:** Write the full answer in the field.",
    "multiple_choice": "✏️ **Choose the correct option:**",
    "sentence_building": "✏️ **Rearrange the words to form a correct sentence:**",
    "classification": "🔤 **Classify by type:** Enter the appropriate code.",
    "true_false": "✅ **Mark: ✅ Correct / ❌ Incorrect:**",
    "translation": "✏️ **Translate into German:**",
    "fill_table": "✏️ **Complete the table with the correct word:**",
}


def is_arabic_file(filepath):
    """تحديد إذا كان الملف عربياً (بدون .en)"""
    return not filepath.endswith(".en.md")


def get_instructions(is_arabic):
    """اختيار الإرشادات حسب اللغة"""
    return INSTRUCTIONS_AR if is_arabic else INSTRUCTIONS_EN


def detect_exercise_type(content, answers):
    """
    تحديد نوع التمرين بناءً على محتوى الجدول والإجابات
    """
    # 1- تصنيف: إجابات من حرف واحد (T/L/M) أو رموز (✅/❌)
    single_chars = all(len(a.strip()) <= 2 for a in answers if isinstance(a, str))
    tlm_chars = all(a.strip() in ["T", "L", "M"] for a in answers if isinstance(a, str))
    tf_chars = all(a.strip() in ["✅", "❌"] for a in answers if isinstance(a, str))

    if tlm_chars:
        return "classification"
    if tf_chars:
        return "true_false"

    # 2- اختيار من متعدد: وجود (option1 / option2) في النص
    has_choices = bool(re.search(r'\([^)]+\s*/\s*[^)]+\)', content))

    # 3- ترتيب جملة: وجود → أو →_ في النص
    has_arrow = bool(re.search(r'→', content))

    # 4- ترجمة: وجود نصوص عربية في الجدول
    has_arabic_text = bool(re.search(r'[؀-ۿ]{3,}', content))

    # 5- فراغات طويلة: وجود _____ (5 شرطات أو أكثر)
    has_long_blank = bool(re.search(r'_{5,}', content))

    # 6- فراغات قصيرة: وجود ___ (3-4 شرطات)
    has_short_blank = bool(re.search(r'___{1,4}(?!_)', content))

    # تحليل الإجابات: هل هي كلمات مفردة أم جمل طويلة؟
    has_long_answers = any(len(a.split()) > 3 for a in answers if isinstance(a, str))
    has_short_answers = all(len(a.split()) <= 2 for a in answers if isinstance(a, str))

    # تحديد النوع بناءً على الأنماط
    if has_arrow:
        return "sentence_building"

    if has_arabic_text and not has_short_blank and not has_long_blank and not has_choices:
        return "translation"

    if has_choices:
        return "multiple_choice"

    if has_long_blank and has_long_answers:
        return "fill_sentence"

    if has_short_blank and has_short_answers:
        return "fill_word"

    if (has_long_blank or has_short_blank) and not has_short_answers:
        return "fill_sentence"

    # افتراضي
    return "fill_word"


def find_exercise_blocks(content):
    """
    البحث عن كتل التمارين بصيغة <div class="exercise" ... > ... </div>
    """
    blocks = []

    # تطبيع: إضافة سطر جديد بين الكتل المتجاورة
    content = re.sub(r'</div>\s*<div class="exercise"', '</div>\n<div class="exercise"', content)
    # تطبيع: التأكد من وجود سطر جديد بعد آخر </div>
    if not content.endswith('\n'):
        content += '\n'

    # نمط البحث عن <div class="exercise" ...> ... </div>
    pattern = re.compile(
        r'(.*?)(<div class="exercise"[^>]*data-answers=\'([^\']+)\'[^>]*>\s*\n.*?</div>\s*\n)',
        re.DOTALL
    )

    pos = 0
    while pos < len(content):
        match = pattern.search(content, pos)
        if not match:
            break

        # التحقق من أن المطابقة تبدأ من بداية السطر (أو بعد سطر فارغ)
        before = content[pos:match.start()]

        full_match = match.group(2)
        answers_str = match.group(3)

        try:
            answers = json.loads(answers_str)
        except json.JSONDecodeError:
            answers = []

        blocks.append({
            "start": match.start(2),
            "end": match.end(2),
            "content": full_match,
            "before": before,
            "answers": answers
        })

        pos = match.end(2)

    return blocks


def add_instruction_to_file(filepath):
    """
    تحليل ملف وإضافة تعليمات قبل كل تمرين
    """
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    is_ar = is_arabic_file(filepath)
    instructions = get_instructions(is_ar)

    blocks = find_exercise_blocks(content)
    if not blocks:
        return 0

    # نعدّل من اليمين لليسار حتى لا تتغير المؤشرات
    modifications = []

    for block in reversed(blocks):
        ex_type = detect_exercise_type(block["content"], block["answers"])
        instruction = instructions.get(ex_type, instructions["fill_word"])

        # البحث عن سطر ## 📝 تمارين قبل هذا التمرين
        # ولكن قد يكون هناك تمارين متعددة تحت نفس العنوان
        # نضيف سطر فارغ + instruction + سطر فارغ قبل <div>

        # نبحث في المحتوى قبل الكتلة
        prefix = content[:block["start"]]

        # التأكد من أن التعليمات تضاف مرة واحدة فقط قبل كل <div>
        # إذا كان التمرين هو الأول تحت ## 📝 تمارين، نحتاج لتمييزه
        # نضيف instruction مباشرة قبل <div>

        new_block = f"{instruction}\n\n" + block["content"].lstrip()

        modifications.append({
            "start": block["start"],
            "end": block["end"],
            "new_content": new_block
        })

    if not modifications:
        return 0

    # تطبيق التعديلات من اليمين لليسار
    result = content
    for mod in modifications:
        result = result[:mod["start"]] + mod["new_content"] + result[mod["end"]:]

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(result)

    return len(modifications)


def main():
    print("🔍 البحث عن ملفات القواعد...")

    # الحصول على جميع ملفات .md في مجلد القواعد
    all_files = []
    for f in os.listdir(GRAMMATIK_DIR):
        if f.endswith(".md"):
            all_files.append(os.path.join(GRAMMATIK_DIR, f))
        elif f.endswith(".en.md"):
            all_files.append(os.path.join(GRAMMATIK_DIR, f))

    # إزالة ملفات الفهرس
    all_files = [f for f in all_files if "index" not in os.path.basename(f)]

    # ترتيب الملفات
    all_files.sort()

    total_exercises = 0
    total_files_modified = 0

    for filepath in all_files:
        filename = os.path.basename(filepath)

        try:
            count = add_instruction_to_file(filepath)
            if count > 0:
                print(f"  ✅ {filename}: {count} تمارين")
                total_exercises += count
                total_files_modified += 1
            else:
                print(f"  ➖ {filename}: لا توجد تمارين")
        except Exception as e:
            print(f"  ❌ {filename}: خطأ — {e}")

    print(f"\n📊 الإحصائيات:")
    print(f"  - الملفات المعدلة: {total_files_modified}")
    print(f"  - التمارين المضاف لها تعليمات: {total_exercises}")


if __name__ == "__main__":
    main()
