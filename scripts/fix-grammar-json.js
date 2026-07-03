/**
 * Fix JSON format in data-answers attributes across all grammar files.
 * The current format uses JS single-quote arrays ['a','b'] which is invalid JSON.
 * Fix to proper JSON: ["a","b"]
 *
 * Also handles the problematic exercise content (empty cells in True/False tables, etc.)
 */
const fs = require('fs');
const path = require('path');

const grammarDir = 'h:/دراسة/docs/grammatik';

// Fix single-quote arrays to double-quote JSON arrays
function fixJsonArrays(content) {
  // Match data-answers='[ ... ]' patterns with single-quoted content
  return content.replace(
    /(data-answers=')\[([\s\S]*?)\](?=')/g,
    (match, prefix, inner) => {
      // Check if already valid JSON (has double quotes)
      if (inner.includes('"')) return match;

      // Split by commas between single-quoted strings
      // The inner content is like: 'a','b','c'
      const items = inner.split(',').map(s => s.trim());
      const fixed = items.map(s => {
        // Remove the surrounding single quotes
        s = s.replace(/^'/, '').replace(/'$/, '');
        // Escape any double quotes in the value
        s = s.replace(/"/g, '\\"');
        // Wrap in double quotes
        return '"' + s + '"';
      }).join(',');
      return prefix + '[' + fixed + ']';
    }
  );
}

// Fix empty table cells in True/False exercises (where text was lost)
function checkTrueFalseExercises(content, filePath) {
  const fileName = path.basename(filePath);
  const isEnglish = fileName.endsWith('.en.md');

  // Only process the 6 files that had inline solutions
  const specialFiles = [
    'kausal-konzessivsatze.md', 'kausal-konzessivsatze.en.md',
    'temporal-lokal-angaben.md', 'temporal-lokal-angaben.en.md',
    'wortstellung-erweitert.md', 'wortstellung-erweitert.en.md'
  ];
  if (!specialFiles.includes(fileName)) return content;

  if (isEnglish) {
    // English True/False fixes
    if (fileName === 'temporal-lokal-angaben.en.md') {
      content = content.replace(
        /(\| 1 \|  \| \|\n\| 2 \|  \| \|\n\| 3 \|  \| \|\n\| 4 \|  \| \|\n\| 5 \|  \| \|)/,
        '| 1 | In German, time phrases come before place phrases. | |\n| 2 | TEKAMOLO means: Temporal → Kausal → Modal → Lokal | |\n| 3 | If a sentence starts with a time phrase, the verb goes at the end. | |\n| 4 | "Morgen fahre ich nach Berlin." — correct sentence | |\n| 5 | "Ich fahre nach Berlin morgen." — correct TEKAMOLO order | |'
      );
    }
  } else {
    // Arabic True/False fixes
    if (fileName === 'temporal-lokal-angaben.md') {
      content = content.replace(
        /(\| 1 \|  \| \|\n\| 2 \|  \| \|\n\| 3 \|  \| \|\n\| 4 \|  \| \|\n\| 5 \|  \| \|)/,
        '| 1 | في الألمانية، عبارات الزمان تأتي قبل المكان. | |\n| 2 | TEKAMOLO يعني: Temporal → Kausal → Modal → Lokal | |\n| 3 | إذا بدأت الجملة بعبارة زمان، الفعل يروح في الآخر. | |\n| 4 | "Morgen fahre ich nach Berlin." — جملة صحيحة | |\n| 5 | "Ich fahre nach Berlin morgen." — ترتيب صحيح لـ TEKAMOLO | |'
      );
    }
  }

  return content;
}

// === MAIN ===
const files = fs.readdirSync(grammarDir)
  .filter(f => f.endsWith('.md') && !f.startsWith('index'))
  .sort();

console.log('=== Fixing JSON format in grammar files ===\n');

let fixed = 0;
let unchanged = 0;

for (const f of files) {
  const fp = path.join(grammarDir, f);
  let content = fs.readFileSync(fp, 'utf8');

  if (!content.includes('data-answers=')) {
    unchanged++;
    continue;
  }

  // Check if already has double-quote JSON
  const hasDoubleQuotes = /data-answers='\["/.test(content);
  const hasSingleQuotes = /data-answers='\['/.test(content);

  if (!hasSingleQuotes && hasDoubleQuotes) {
    unchanged++;
    continue;
  }

  if (hasSingleQuotes) {
    content = fixJsonArrays(content);
    // Verify the fix
    const remaining = content.match(/data-answers='\['/);
    if (remaining) {
      console.log(`  WARNING: ${f} still has single-quote arrays!`);
    }
  }

  // Apply file-specific fixes
  content = checkTrueFalseExercises(content, fp);

  // Add Exercise 2 (choice) for English temporal-lokal-angaben
  if (f === 'temporal-lokal-angaben.en.md') {
    const ex2Pattern = /### Exercise 2: Choose the correct order 🎯\n\n\*\*Which sentence is correct\?\*\*\n\n[\s\S]*?\n---\n/;
    if (ex2Pattern.test(content)) {
      content = content.replace(ex2Pattern, '');
      // Add choice exercise after Exercise 1's </div>
      content = content.replace(
        /(<\/div>)\n(?=### Exercise 3:)/,
        '$1\n\n<div class="exercise" markdown="1" data-type="choice" data-answers=\'["B","B","A","B"]\'>\n' +
        '| # | Sentence | A | B | C |\n' +
        '|---|----------|---|---|---|\n' +
        '| 1 | Ich fahre ______________. (nach Berlin / morgen / mit dem Zug) | Ich fahre nach Berlin morgen mit dem Zug. | Ich fahre morgen mit dem Zug nach Berlin. | Ich fahre mit dem Zug nach Berlin morgen. |\n' +
        '| 2 | Wir treffen uns ______________. (morgen / am Bahnhof) | Wir treffen uns am Bahnhof morgen. | Wir treffen uns morgen am Bahnhof. | Morgen am Bahnhof wir treffen uns. |\n' +
        '| 3 | ______________. (heute / mit seiner Freundin / ins Konzert) | Er geht heute Abend mit seiner Freundin ins Konzert. | Er geht mit seiner Freundin heute Abend ins Konzert. | Er geht ins Konzert heute Abend mit seiner Freundin. |\n' +
        '| 4 | ______________. (gestern / mit meinem Bruder / im Kino) | Gestern ich war im Kino mit meinem Bruder. | Gestern war ich mit meinem Bruder im Kino. | Gestern war ich im Kino mit meinem Bruder. |\n' +
        '</div>\n\n---'
      );
    }
  }

  fs.writeFileSync(fp, content, 'utf8');

  if (hasSingleQuotes || f === 'temporal-lokal-angaben.md' || f === 'temporal-lokal-angaben.en.md') {
    fixed++;
    console.log(`  FIXED ${f}`);
  } else {
    unchanged++;
  }
}

console.log(`\n=== Done ===`);
console.log(`Fixed: ${fixed}`);
console.log(`Unchanged: ${unchanged}`);
