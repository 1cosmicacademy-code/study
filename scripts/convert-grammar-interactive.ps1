# PowerShell script to convert grammar exercises to interactive format
# Runs mechanically on all 60 files - much faster than 31 AI agents

$ErrorActionPreference = 'Stop'
$grammarDir = "h:\دراسة\docs\grammatik"

function Convert-GrammarExercises {
    param([string]$FilePath)

    $content = Get-Content -Path $FilePath -Raw
    $fileName = Split-Path -Leaf $FilePath
    $isEnglish = $fileName -match '\.en\.md$'

    # Skip if already interactive
    if ($content -match '<div class="exercise"') {
        return $false
    }

    if ($isEnglish) {
        $exercisePattern = '(?m)^### Exercise (\d+):'
        $solutionsHeader = '## ✅ Solutions'
        $solutionLinePattern = '(?m)^### Solution Exercise (\d+)'
        $solutionLinePattern2 = '(?m)^### Solution (\d+)'
    } else {
        $exercisePattern = '(?m)^### تمرين (\d+):'
        $solutionsHeader = '## ✅ الحلول'
        $solutionLinePattern = '(?m)^### حل تمرين (\d+)'
        $solutionLinePattern2 = '(?m)^### الحل (\d+)'
    }

    # Extract solutions section
    $solutionsMatch = [regex]::Match($content, "(?ms)$solutionsHeader(.*?)(?=\n---|\n## |\n$$)")
    if (-not $solutionsMatch.Success) {
        return $false
    }

    $solutionsText = $solutionsMatch.Groups[1].Value

    # Parse solutions into a hashtable: exercise number -> array of answers
    $solutions = @{}
    $currentExNum = $null
    $currentAnswers = @()

    $solutionsLines = $solutionsText -split "`n"
    foreach ($line in $solutionsLines) {
        $trimmed = $line.Trim()
        if ($trimmed -eq '' -or $trimmed -eq '---') { continue }
        $solutionMatch = [regex]::Match($trimmed, $solutionLinePattern)
        if (-not $solutionMatch.Success) {
            $solutionMatch = [regex]::Match($trimmed, $solutionLinePattern2)
        }
        if ($solutionMatch.Success) {
            if ($currentExNum) {
                $solutions[$currentExNum] = $currentAnswers
            }
            $currentExNum = [int]$solutionMatch.Groups[1].Value
            $currentAnswers = @()
        } elseif ($currentExNum -and $trimmed -match '^\d+\.') {
            # Parse answer line: "1. answer1 | 2. answer2 | 3. answer3"
            $currentAnswers = @()
            $parts = $trimmed -split '\|'
            foreach ($part in $parts) {
                $part = $part.Trim()
                $part = $part -replace '^\d+[\.\)]\s*', ''
                $currentAnswers += $part.Trim()
            }
        }
    }
    # Save last exercise
    if ($currentExNum) {
        $solutions[$currentExNum] = $currentAnswers
    }

    if ($solutions.Count -eq 0) {
        return $false
    }

    # Remove the solutions section from content
    $content = $content -replace "(?ms)$solutionsHeader.*?(?=\n---|\n## |`n`$)", ''

    # Find all exercise blocks
    $exRegex = [regex]::new("(?ms)(### (?:تمرين |Exercise )(\d+):[^\n]*\n+)(.*?)(?=\n### |\n## |\n---|`n`$|\z)", [System.Text.RegularExpressions.RegexOptions]::None)
    $matches = $exRegex.Matches($content)
    $replacements = @()

    foreach ($match in $matches) {
        $exNum = [int]$match.Groups[2].Value
        $exBody = $match.Groups[3].Value

        if (-not $solutions.ContainsKey($exNum)) {
            Write-Host "  WARNING: No solutions for Exercise $exNum in $fileName" -ForegroundColor Red
            continue
        }

        $answers = $solutions[$exNum]

        # Parse questions
        $questions = @()
        $lines = $exBody -split "`n"
        foreach ($line in $lines) {
            $trimmed = $line.Trim()
            if ($trimmed -match '^(\d+)\.\s*(.*)') {
                $qNum = [int]$Matches[1]
                $qText = $Matches[2].Trim()
                $questions += @{Num = $qNum; Text = $qText}
            }
        }

        if ($questions.Count -eq 0) {
            Write-Host "  WARNING: No questions found in Exercise $exNum in $fileName" -ForegroundColor Red
            continue
        }

        # Build data-answers JSON
        $answerItems = @()
        foreach ($a in $answers) {
            $escaped = $a -replace "'", "&apos;"
            $answerItems += "'$escaped'"
        }
        $answersJson = "[$($answerItems -join ',')]"

        if ($isEnglish) {
            $tableHeader = "| # | Sentence | Answer |`n|---|----------|--------|"
            $rowTemplate = "| {0} | {1} | |"
        } else {
            $tableHeader = "| # | الجملة | الإجابة |`n|---|--------|---------|"
            $rowTemplate = "| {0} | {1} | |"
        }

        $rows = @()
        foreach ($q in $questions) {
            $rows += $rowTemplate -f $q.Num, $q.Text
        }

        # Build div content (no here-string to avoid column-0 issues)
        $divContent = '<div class="exercise" markdown="1" data-answers=' + "'" + $answersJson + "'>`n"
        $divContent += $tableHeader + "`n"
        $divContent += ($rows -join "`n") + "`n"
        $divContent += "</div>"

        $replacements += @{
            Start = $match.Index
            Len   = $match.Length
            Text  = $divContent
        }
    }

    if ($replacements.Count -eq 0) {
        return $false
    }

    # Apply replacements from end to start (preserve index positions)
    $replacements = $replacements | Sort-Object Start -Descending
    $sb = New-Object System.Text.StringBuilder $content
    foreach ($r in $replacements) {
        [void]$sb.Remove($r.Start, $r.Len)
        [void]$sb.Insert($r.Start, $r.Text)
    }
    $modified = $sb.ToString()

    # Normalize whitespace
    $modified = $modified -replace "`n{3,}", "`n`n"
    $modified = $modified.Trim()

    Set-Content -Path $FilePath -Value $modified -Encoding UTF8 -NoNewline
    Write-Host "  CONVERTED $fileName - $($replacements.Count) exercises" -ForegroundColor Green
    return $true
}

# === MAIN ===
Write-Host "=== Converting Grammar Exercises to Interactive Format ===" -ForegroundColor Cyan
Write-Host ""
$total = 0
$converted = 0
$skipped = 0

Get-ChildItem -Path $grammarDir -Filter "*.md" | Where-Object { $_.Name -notlike "index*" } | Sort-Object Name | ForEach-Object {
    $total++
    Write-Host "[$total] $($_.Name)..." -NoNewline
    $result = Convert-GrammarExercises -FilePath $_.FullName
    if ($result) { $converted++ } else { $skipped++ }
    Write-Host ""
}

Write-Host ""
Write-Host "=== Done ===" -ForegroundColor Cyan
Write-Host "Total files: $total"
Write-Host "Converted: $converted" -ForegroundColor Green
Write-Host "Skipped: $skipped" -ForegroundColor Yellow
