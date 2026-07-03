/**
 * Convert grammar files with inline ✅ **الحل:** / ✅ **Answers:** markers
 * (not consolidated ## ✅ الحلول sections).
 *
 * Target files (6):
 *   kausal-konzessivsatze, temporal-lokal-angaben, wortstellung-erweitert
 *   (Arabic + English = 6 files)
 *
 * Pattern:
 *   ### تمرين N: Title
 *   ... questions ...
 *   ✅ **الحل:**
 *   N. answer text
 *   ---
 */

const fs = require('fs');
const path = require('path');

const grammarDir = 'h:/دراسة/docs/grammatik';

function escapeJson(s) {
  return s.replace(/"/g, '\\"');
}

/**
 * Clean an answer line from the solution section.
 * Handles formats:
 *   1. **answer** (explanation)       → answer
 *   1. prefix **answer** suffix        → answer
 *   1. **Full sentence answer.**        → Full sentence answer.
 *   1. **❌** False! explanation        → ❌
 *   1. **✅** True! explanation         → ✅
 *   1. answer (simple)                  → answer
 */
function cleanAnswer(line) {
  let a = line.replace(/^\d+[\.\)]\s*/, '').trim();

  // True/False with emoji
  const tfMatch = a.match(/^\*\*([✅❌])\*\*/);
  if (tfMatch) return tfMatch[1];

  // Extract bold content if it's the substantial answer
  const boldParts = a.match(/\*\*(.+?)\*\*/g);
  if (boldParts && boldParts.length > 0) {
    // If there's a bold section embedded in non-bold text (Type 4: prefix **answer**)
    if (boldParts.length === 1 && a.indexOf(boldParts[0]) > 0) {
      // Only the bold part is the answer
      const extracted = boldParts[0].replace(/\*\*/g, '');
      // Remove trailing parenthetical notes from the extracted part
      return extracted.replace(/\s*\(.*?\)\s*$/, '').trim();
    }
    // Multiple bold segments or whole line is bold
    let result = a.replace(/\*\*/g, '');
    // Remove trailing parenthetical notes
    result = result.replace(/\s*\(.*?\)\s*$/, '');
    return result.trim();
  }

  // No bold markers — just strip parenthetical notes
  a = a.replace(/\s*\(.*?\)\s*$/, '');
  return a.trim();
}

/**
 * Convert one exercise block to interactive format.
 */
function convertExercise(exNum, exBody, isEnglish) {
  // Split on the solution marker
  const solMarker = isEnglish ? '✅ **Answers:**' : '✅ **الحل:**';
  const solIdx = exBody.indexOf(solMarker);
  if (solIdx === -1) return null;

  const questionPart = exBody.substring(0, solIdx).trim();
  const solutionPart = exBody.substring(solIdx + solMarker.length).trim();

  // Parse answers from solution lines
  const solLines = solutionPart.split('\n');
  const answers = [];
  for (const line of solLines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    // Stop at next section marker
    if (trimmed.startsWith('---') || trimmed.startsWith('### ') || trimmed.startsWith('## ')) break;
    if (trimmed.match(/^\d+[\.\)]/)) {
      answers.push(cleanAnswer(trimmed));
    }
  }

  if (answers.length === 0) return null;

  // Parse questions from question part — find numbered lines
  const questions = [];
  const qLines = questionPart.split('\n');
  for (const line of qLines) {
    const trimmed = line.trim();
    // Skip lines that start with ✅ (they're part of exercise text, not questions)
    if (trimmed.startsWith('✅')) continue;

    // Match numbered questions: "1. text" or "1) text"
    const qMatch = trimmed.match(/^(\d+)[\.\s]\s*(.*)/);
    if (qMatch) {
      const qNum = parseInt(qMatch[1]);
      const qText = qMatch[2].trim();
      // Skip if it looks like a solution explanation line (has **answer** pattern and no blank)
      if (qText && !qText.startsWith('✅')) {
        questions.push({ num: qNum, text: qText });
      }
    }
  }

  if (questions.length === 0) {
    // Fallback: try to find a table format (True/False exercises)
    // Parse from table rows
    for (const line of qLines) {
      const trimmed = line.trim();
      const tableMatch = trimmed.match(/^\|\s*(\d+)\s*\|/);
      if (tableMatch) {
        const qNum = parseInt(tableMatch[1]);
        // Extract the question statement between # and the last column
        const parts = trimmed.split('|').filter(p => p.trim());
        if (parts.length >= 2) {
          const qText = parts.slice(1, -1).join(' | ').trim();
          questions.push({ num: qNum, text: qText });
        }
      }
    }
  }

  if (questions.length === 0) return null;

  // Build interactive div
  const header = isEnglish
    ? '| # | Sentence | Answer |\n|---|----------|--------|'
    : '| # | الجملة | الإجابة |\n|---|--------|---------|';

  const ansJson = '["' + answers.map(a => `${escapeJson(a)}`).join('","') + '"]';
  const rows = questions.map(q => `| ${q.num} | ${q.text} | |`);

  return `<div class="exercise" markdown="1" data-answers='${ansJson}'>\n${header}\n${rows.join('\n')}\n</div>`;
}

function convertFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath);
  const isEnglish = fileName.endsWith('.en.md');

  // Skip if already interactive
  if (content.includes('<div class="exercise"')) {
    console.log(`  SKIP (already interactive): ${fileName}`);
    return false;
  }

  const exHeader = isEnglish ? '### Exercise ' : '### تمرين ';
  const exHeaderRegex = new RegExp(
    '^' + exHeader.replace(/ /g, '\\s') + '(\\d+):',
    'gm'
  );

  // Find all exercise start positions
  const exerciseStarts = [];
  let match;
  while ((match = exHeaderRegex.exec(content)) !== null) {
    exerciseStarts.push({ index: match.index, num: parseInt(match[1]) });
  }

  if (exerciseStarts.length === 0) {
    console.log(`  SKIP (no exercises found): ${fileName}`);
    return false;
  }

  // Extract each exercise block: from its ### header to the next ### or ## or end
  const blocks = [];
  for (let i = 0; i < exerciseStarts.length; i++) {
    const start = exerciseStarts[i].index;
    const end = i + 1 < exerciseStarts.length
      ? exerciseStarts[i + 1].index
      : content.length;
    blocks.push({
      num: exerciseStarts[i].num,
      start,
      end,
      text: content.substring(start, end)
    });
  }

  // Convert each block
  const replacements = [];
  for (const block of blocks) {
    // Check if this block has a solution marker
    const solMarker = isEnglish ? '✅ **Answers:**' : '✅ **الحل:**';
    if (!block.text.includes(solMarker)) {
      console.log(`  WARNING: Exercise ${block.num} in ${fileName} has no solution marker`);
      continue;
    }

    const divContent = convertExercise(block.num, block.text, isEnglish);
    if (!divContent) {
      console.log(`  WARNING: Could not convert Exercise ${block.num} in ${fileName}`);
      continue;
    }

    replacements.push({ start: block.start, len: block.end - block.start, text: divContent });
  }

  if (replacements.length === 0) {
    console.log(`  NO CONVERSIONS: ${fileName}`);
    return false;
  }

  // Apply replacements from end to start
  let modified = content;
  replacements.sort((a, b) => b.start - a.start);
  for (const r of replacements) {
    modified = modified.slice(0, r.start) + r.text + modified.slice(r.start + r.len);
  }

  modified = modified.replace(/\n{3,}/g, '\n\n').trim();

  // Check for duplicates or empty remaining solution markers
  const checkSolMarker = isEnglish ? '✅ **Answers:**' : '✅ **الحل:**';
  if (modified.includes(checkSolMarker)) {
    console.log(`  WARNING: Unconverted solution markers remain in ${fileName}`);
  }

  fs.writeFileSync(filePath, modified, 'utf8');
  console.log(`  CONVERTED ${fileName} - ${replacements.length} exercises`);
  return true;
}

// === MAIN ===
const targetFiles = [
  'kausal-konzessivsatze.md', 'kausal-konzessivsatze.en.md',
  'temporal-lokal-angaben.md', 'temporal-lokal-angaben.en.md',
  'wortstellung-erweitert.md', 'wortstellung-erweitert.en.md',
];

console.log('=== Converting 6 special-format grammar files ===\n');

let converted = 0;
let skipped = 0;

for (const f of targetFiles) {
  const fp = path.join(grammarDir, f);
  if (!fs.existsSync(fp)) {
    console.log(`  NOT FOUND: ${f}`);
    skipped++;
    continue;
  }
  process.stdout.write(`[${targetFiles.indexOf(f)+1}] ${f}...`);
  const result = convertFile(fp);
  if (result) converted++; else skipped++;
  console.log('');
}

console.log(`\n=== Done ===`);
console.log(`Converted: ${converted}`);
console.log(`Skipped: ${skipped}`);
