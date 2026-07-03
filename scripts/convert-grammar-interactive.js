const fs = require('fs');
const path = require('path');

const grammarDir = 'h:/دراسة/docs/grammatik';

function escapeJson(s) {
  return s.replace(/"/g, '\\"');
}

function convertFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath);
  const isEnglish = fileName.endsWith('.en.md');
  const isIndex = fileName.startsWith('index');

  if (isIndex) return false;
  if (content.includes('<div class="exercise"')) return false;

  // Find solutions section - use regex literals since backslash escaping in RegExp(string) breaks on this platform
  let solMatch;
  if (isEnglish) {
    solMatch = content.match(/## ✅ Solutions([\s\S]*?)(?=\n---|\n## |## ✅ |$)/);
  } else {
    solMatch = content.match(/## ✅ الحلول([\s\S]*?)(?=\n---|\n## |## ✅ |$)/);
  }
  if (!solMatch) return false;

  const solText = solMatch[1];

  // Parse solutions
  const solutions = {};
  let curEx = null;
  let curAns = [];

  const solHeaderPat = isEnglish
    ? /^### Solution(?: Exercise)? (\d+)/m
    : /^### (?:حل تمرين|الحل) (\d+)/m;

  const lines = solText.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed === '---') continue;

    const slMatch = trimmed.match(solHeaderPat);
    if (slMatch) {
      if (curEx !== null) solutions[curEx] = curAns;
      curEx = parseInt(slMatch[1]);
      curAns = [];
    } else if (curEx !== null && /^\d+[\.\)]/.test(trimmed)) {
      curAns = [];
      const parts = trimmed.split('|');
      for (const part of parts) {
        const clean = part.trim().replace(/^\d+[\.\)]\s*/, '').trim();
        curAns.push(clean);
      }
    }
  }
  if (curEx !== null) solutions[curEx] = curAns;

  if (Object.keys(solutions).length === 0) return false;

  // Remove solutions section
  let modified;
  if (isEnglish) {
    modified = content.replace(/## ✅ Solutions[\s\S]*?(?=\n---|\n## |$)/, '');
  } else {
    modified = content.replace(/## ✅ الحلول[\s\S]*?(?=\n---|\n## |$)/, '');
  }

  // Find exercise blocks
  const exHeader = isEnglish ? '### Exercise ' : '### تمرين ';
  // Regex to match exercises until next header or section end
  const exRegex = new RegExp(
    '(' + exHeader.replace(/ /g, '\\s') + '(\\d+):[^\\n]*\\n+)([\\s\\S]*?)(?=\\n' + exHeader.replace(/ /g, '\\s') + '|\\n## |\\n---|\\n$|$)',
    'g'
  );

  const replacements = [];
  let exMatch;

  while ((exMatch = exRegex.exec(modified)) !== null) {
    const exNum = parseInt(exMatch[2]);
    const exBody = exMatch[3];

    if (!solutions[exNum]) {
      console.log(`  WARNING: No solutions for Exercise ${exNum} in ${fileName}`);
      continue;
    }

    const answers = solutions[exNum];

    // Parse questions
    const questions = [];
    const bodyLines = exBody.split('\n');
    for (const bl of bodyLines) {
      const trimmed = bl.trim();
      const qMatch = trimmed.match(/^(\d+)[\.\s]\s*(.*)/);
      if (qMatch && !trimmed.startsWith('✅')) {
        questions.push({ num: parseInt(qMatch[1]), text: qMatch[2].trim() });
      }
    }

    if (questions.length === 0) {
      console.log(`  WARNING: No questions in Exercise ${exNum} in ${fileName}`);
      continue;
    }

    // Check if answers count matches questions count
    if (answers.length !== questions.length) {
      console.log(`  NOTE: Exercise ${exNum}: ${questions.length} questions but ${answers.length} answers`);
    }

    // Build answers JSON
    const ansJson = '["' + answers.map(a => `${escapeJson(a)}`).join('","') + '"]';

    const header = isEnglish
      ? '| # | Sentence | Answer |\n|---|----------|--------|'
      : '| # | الجملة | الإجابة |\n|---|--------|---------|';

    const rows = questions.map(q => `| ${q.num} | ${q.text} | |`);
    const divContent = `<div class="exercise" markdown="1" data-answers='${ansJson}'>\n${header}\n${rows.join('\n')}\n</div>`;

    replacements.push({ start: exMatch.index, len: exMatch[0].length, text: divContent });
  }

  if (replacements.length === 0) return false;

  // Apply from end to start
  replacements.sort((a, b) => b.start - a.start);
  for (const r of replacements) {
    modified = modified.slice(0, r.start) + r.text + modified.slice(r.start + r.len);
  }

  modified = modified.replace(/\n{3,}/g, '\n\n').trim();
  fs.writeFileSync(filePath, modified, 'utf8');
  console.log(`  CONVERTED ${fileName} - ${replacements.length} exercises`);
  return true;
}

// === MAIN ===
const files = fs.readdirSync(grammarDir)
  .filter(f => f.endsWith('.md') && !f.startsWith('index'))
  .sort();

console.log(`=== Converting ${files.length} grammar files ===\n`);

let converted = 0;
let skipped = 0;

for (const f of files) {
  process.stdout.write(`[${files.indexOf(f)+1}] ${f}...`);
  const result = convertFile(path.join(grammarDir, f));
  if (result) converted++; else skipped++;
  console.log('');
}

console.log(`\n=== Done ===`);
console.log(`Converted: ${converted}`);
console.log(`Skipped: ${skipped}`);
