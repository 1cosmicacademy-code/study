#!/usr/bin/env python3
"""
أضف تعليمات توضيحية فوق كل تمرين في ملفات القواعد (المرة الثانية)
يصلح الملفات التي لم يتم اكتشاف تمارينها بسبب `</div><div class="exercise"` على نفس السطر
ويتخطى الملفات التي تم تعديلها سابقاً
"""

import os
import re
import json

GRAMMATIK_DIR = "h:/دراسة/docs/grammatik"

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
    return not filepath.endswith(".en.md")


def get_instructions(is_arabic):
    return INSTRUCTIONS_AR if is_arabic else INSTRUCTIONS_EN


def detect_exercise_type(content, answers):
    single_chars = all(len(a.strip()) <= 2 for a in answers if isinstance(a, str))
    tlm_chars = all(a.strip() in ["T", "L", "M"] for a in answers if isinstance(a, str))
    tf_chars = all(a.strip() in ["✅", "❌"] for a in answers if isinstance(a, str))

    if tlm_chars:
        return "classification"
    if tf_chars:
        return "true_false"

    has_choices = bool(re.search(r'\([^)]+\s*/\s*[^)]+\)', content))
    has_arrow = bool(re.search(r'→', content))
    has_arabic_text = bool(re.search(r'[؀-ۿ]{3,}', content))
    has_long_blank = bool(re.search(r'_{5,}', content))
    has_short_blank = bool(re.search(r'___{1,4}(?!_)', content))
    has_long_answers = any(len(a.split()) > 3 for a in answers if isinstance(a, str))
    has_short_answers = all(len(a.split()) <= 2 for a in answers if isinstance(a, str))

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
    return "fill_word"


def already_has_instructions(content):
    """التحقق إذا كان الملف قد أضيفت له تعليمات من قبل"""
    markers = [
        "✏️ **", "🔤 **", "✅ **",                    # أي أيقونة تعليمات
        "أكمل الفراغ", "صنّف", "اختر", "رتّب", "ترجم", "حدد",  # عربي
        "Fill in the blank", "Complete the blank",     # إنجليزي
        "Choose the correct", "Rearrange",             # إنجليزي
        "Classify", "Translate", "Mark",               # إنجليزي
    ]
    return any(m in content for m in markers)


def add_instruction_to_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # تخطي الملفات المعدلة سابقاً
    if already_has_instructions(content):
        return -1  # علامة خاصة: تخطي

    is_ar = is_arabic_file(filepath)
    instructions = get_instructions(is_ar)

    # تطبيع: إضافة سطر جديد بين الكتل المتجاورة وضمان وجود \n في النهاية
    content_norm = re.sub(r'</div>\s*<div class="exercise"', '</div>\n<div class="exercise"', content)
    if not content_norm.endswith('\n'):
        content_norm += '\n'

    # نمط البحث
    pattern = re.compile(
        r'(.*?)(<div class="exercise"[^>]*data-answers=\'([^\']+)\'[^>]*>\s*\n.*?</div>\s*\n)',
        re.DOTALL
    )

    blocks = []
    pos = 0
    while pos < len(content_norm):
        match = pattern.search(content_norm, pos)
        if not match:
            break

        answers_str = match.group(3)
        try:
            answers = json.loads(answers_str)
        except json.JSONDecodeError:
            pos = match.end(2)
            continue

        blocks.append({
            "start": match.start(2),
            "end": match.end(2),
            "content": match.group(2),
            "answers": answers
        })
        pos = match.end(2)

    if not blocks:
        return 0

    # تعديل من اليمين لليسار
    result = content_norm
    for block in reversed(blocks):
        ex_type = detect_exercise_type(block["content"], block["answers"])
        instruction = instructions.get(ex_type, instructions["fill_word"])
        new_block = f"{instruction}\n\n" + block["content"].lstrip()
        result = result[:block["start"]] + new_block + result[block["end"]:]

    # كتابة النتيجة
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(result)

    return len(blocks)


def main():
    print("🔍 البحث عن الملفات التي تحتاج تعليمات...")

    all_files = sorted([
        os.path.join(GRAMMATIK_DIR, f)
        for f in os.listdir(GRAMMATIK_DIR)
        if f.endswith(".md") and "index" not in f
    ])

    total_exercises = 0
    total_files_modified = 0
    skipped = 0

    for filepath in all_files:
        filename = os.path.basename(filepath)
        try:
            count = add_instruction_to_file(filepath)
            if count == -1:
                print(f"  ➖ {filename}: تم التعديل سابقاً (تخطي)")
                skipped += 1
            elif count == 0:
                print(f"  ◻️  {filename}: لا توجد تمارين")
            else:
                print(f"  ✅ {filename}: {count} تمارين جديدة")
                total_exercises += count
                total_files_modified += 1
        except Exception as e:
            print(f"  ❌ {filename}: خطأ — {e}")

    print(f"\n📊 الإحصائيات:")
    print(f"  - ملفات تم تعديلها: {total_files_modified}")
    print(f"  - تمارين جديدة: {total_exercises}")
    print(f"  - ملفات تم تخطيها: {skipped}")


if __name__ == "__main__":
    main()
