# QA Audit Harness — هارنس تشغيل التدقيق الشامل

## Overview
This harness orchestrates the complete QA audit process for the German language learning website. It coordinates 4 specialized agents, manages execution flow, model fallback, screenshots, and reporting.

## Team Structure

| Agent | Role | Model | Fallback |
|-------|------|-------|----------|
| QA Manager | Team Lead & Report Consolidation | Opus | — |
| Frontend QA Agent | UI/UX/Performance/Accessibility | Opus | Sonnet → Haiku |
| Content QA Agent | Content/Video/Links/Translation | Opus | Sonnet → Haiku |
| User Simulation Agent | Real User Simulation & UAT | Opus | Sonnet → Haiku |

## Prerequisites
1. Local server running: `mkdocs serve` on `http://localhost:8000`
2. Kimi WebBridge skill available for browser interaction
3. All 4 agents defined in `.claude/agents/`
4. All skills defined in `.claude/skills/`

---

## Execution Sequence

### Phase 0: Setup (QA Manager)

**Trigger:** `use subagent qa-manager in plan-audit mode to "..."`

```
1. Start mkdocs serve
   bash: mkdocs serve
   Verify: http://localhost:8000 responds 200

2. Read mkdocs.yml for page structure
   bash: cat mkdocs.yml | grep -E "^\s+- [A-Za-z]" | head -50

3. Define audit scope (A1 / All levels / specific pages)
   Output: audit-scope.md with exact page list

4. Create audit plan:
   - For each Agent: exact tasks, pages, estimated time
   - Priority matrix: Critical > High > Medium > Low
   - Screenshot requirements per task
```

### Phase 1: Parallel Inspection (3 Agents — Concurrent)

**Execution:** All 3 agents launch simultaneously via separate `use subagent` calls.

#### Agent 1: Frontend QA Agent
```
use subagent frontend-qa-agent in ui-audit mode to "فحص جميع صفحات A1"
use subagent frontend-qa-agent in responsive-check mode to "فحص تجاوب A1"
use subagent frontend-qa-agent in accessibility-audit mode to "تدقيق وصول A1"
use subagent frontend-qa-agent in performance-audit mode to "فحص أداء 5 صفحات رئيسية"
use subagent frontend-qa-agent in css-html-audit mode to "فحص جودة كود الصفحات"
```

**Screenshots required:** screenshots in UI audit
  - Full page, viewport-1200 (desktop)
  - Full page, viewport-768 (tablet)
  - Full page, viewport-375 (mobile)
  - Console errors if any

**Output:** `frontend-qa-report.md`

#### Agent 2: Content QA Agent
```
use subagent content-qa-agent in content-audit mode to "فحص جميع دروس A1"
use subagent content-qa-agent in video-verification mode to "التحقق من فيديوهات A1"
use subagent content-qa-agent in link-integrity mode to "فحص روابط A1"
use subagent content-qa-agent in data-validation mode to "التحقق من بيانات تمارين A1"
use subagent content-qa-agent in translation-check mode to "فحص ترجمة A1"
use subagent content-qa-agent in structure-audit mode to "فحص هيكل الموقع"
```

**Screenshots required:**
  - Pages with content issues
  - Broken links (404 pages)
  - Translation mismatches

**Output:** `content-qa-report.md`

#### Agent 3: User Simulation Agent
```
use subagent user-simulation-agent in full-browse mode to "تصفح A1 كمستخدم جديد"
use subagent user-simulation-agent in exercise-solve mode to "حل جميع تمارين A1"
use subagent user-simulation-agent in video-watch mode to "تشغيل فيديوهات A1"
use subagent user-simulation-agent in bilingual-check mode to "فحص العربية والإنجليزية"
use subagent user-simulation-agent in error-scenarios mode to "اختبار سيناريوهات الخطأ"
```

**Screenshots required:** 10+ per scenario
  - Every step in user journey
  - Exercise solutions (correct + incorrect)
  - Video playback states
  - Bilingual comparison (same page in AR/EN)
  - Error scenarios

**Output:** `user-simulation-report.md`

---

### Phase 2: Consolidation (QA Manager)

**Trigger:** `use subagent qa-manager in consolidate-results mode to "..."`

**Input:** 3 agent reports from Phase 1

**Process:**
```
1. Read all 3 reports
2. Merge all issues into unified list:
   - Deduplicate (same issue from multiple agents → keep one)
   - Classify by priority (Critical/High/Medium/Low)
   - Classify by type (UI/Content/Data/UX/Performance/Accessibility/Link)
3. Add root cause analysis per issue
4. Add fix recommendations per issue
5. Output: unified-issues.json / unified-issues.md
```

---

### Phase 3: Report Generation (QA Manager)

**Trigger:** `use subagent qa-manager in generate-report mode to "..."`

**Report Structure:**
```
/docs/qa/report-YYYY-MM-DD.md

1. Executive Summary (3-5 bullet points in Arabic + English)
2. Session Statistics
   - Pages inspected: N
   - Total issues: N
   - By priority: Critical N, High N, Medium N, Low N
   - By type: UI N, Content N, Data N, UX N, Performance N, Accessibility N, Link N
3. Detailed Issues
   For each issue:
   - ID: #001
   - Title: clear description
   - Page: exact URL
   - Priority: Critical/High/Medium/Low
   - Type: UI/Content/Data/UX/Performance/Accessibility/Link
   - Description: full details
   - Screenshot: ![screenshot](path)
   - Steps to Reproduce: numbered
   - Recommendation: fix description
4. Trend Analysis
   - Recurring patterns (>3 same issue = systemic)
   - Strengths (what works well)
   - Weaknesses (what needs improvement)
5. Strategic Recommendations (3-5 long-term improvements)
6. File Change List
   - Per issue: exact file path needing modification
```

---

### Phase 4: Regression (QA Manager)

**Trigger:** `use subagent qa-manager in regression-plan mode to "..."`

**When:** After development team applies fixes

**Process:**
```
1. Read issue list → identify which files were changed
2. For each changed file:
   - Frontend: re-check UI if CSS/HTML changed
   - Content: re-check links if routes changed
   - User Sim: re-run scenarios if flow changed
3. Create regression test plan
4. Execute (repeat Phase 1-3 for affected pages only)
```

---

## Model Fallback Mechanism

### Implementation
```yaml
# Each agent file specifies model fallback order
model: opus
fallback:
  - sonnet   # Primary fallback
  - haiku    # Last resort
```

### Rules
- **Phase 0, 2, 3 (QA Manager):** Opus only — never fallback for critical tasks
- **Phase 1 (3 Agents):** Start with Opus. If context overflow or timeout:
  1. Restart with Sonnet (reduce page scope if needed)
  2. If still failing, restart with Haiku (maximum scope reduction)
- **Phase 4 (Regression):** Can use Sonnet/Haiku for quick smoke tests

### Scope Reduction on Fallback
```
Opus → Full audit (all pages, all checks)
Sonnet → 50% of pages, essential checks only
Haiku → 20% of pages, smoke test only
```

---

## Screenshot Mechanism

### Tools
1. **Kimi WebBridge** — primary tool for browser screenshots
   - Open page → Wait for load → Screenshot
   - Supports viewport resizing for responsive testing
   - Can capture full-page or element-level screenshots

### Naming Convention
```
/docs/qa/screenshots/YYYY-MM-DD/
  frontend/
    {page-name}--{viewport}.png
    ex: lesson-01--desktop-1200.png
    ex: lesson-01--tablet-768.png
    ex: lesson-01--mobile-375.png
  content/
    {page-name}--{issue-type}.png
    ex: lesson-01--broken-link.png
    ex: lesson-01--typo.png
  user-sim/
    {scenario}--step-{N}.png
    ex: exercise-solve--step-01.png
    ex: full-browse--step-05.png
```

### Screenshot Checklist
- [ ] Each page in all 3 viewports (desktop/tablet/mobile)
- [ ] Each exercise interaction (before/after/result)
- [ ] Each video (before play/playing/after)
- [ ] Each error scenario
- [ ] Bilingual pair (Arabic page + English page)

---

## Reporting Flow

```
┌──────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  Agent 1     │    │  Agent 2         │    │  Agent 3        │
│  Report.md   │    │  Report.md       │    │  Report.md      │
│  + screens   │    │  + screens       │    │  + screens      │
└──────┬───────┘    └──────┬───────────┘    └───────┬─────────┘
       │                   │                        │
       └───────────────────┼────────────────────────┘
                           ▼
                ┌──────────────────────┐
                │  QA Manager          │
                │  Consolidate         │
                │  unified-issues.md   │
                └──────────┬───────────┘
                           ▼
                ┌──────────────────────┐
                │  QA Manager          │
                │  Generate Report     │
                │  report-YYYY-MM-DD.md│
                └──────────┬───────────┘
                           ▼
                ┌──────────────────────┐
                │  /docs/qa/           │
                │  Final Report        │
                └──────────────────────┘
```

### Temporary Storage
```
/docs/qa/agent-reports/YYYY-MM-DD/
  frontend-qa-report.md
  content-qa-report.md
  user-simulation-report.md
  unified-issues.md
```

### Final Deliverable
```
/docs/qa/report-YYYY-MM-DD.md
  - Executive Summary
  - Full Statistics
  - All Issues with Screenshots
  - Recommendations
  - File Change List
```

---

## Success Criteria

| Metric | Target | Measured By |
|--------|--------|-------------|
| Audit Coverage | 100% of target pages | Page count check |
| All Agents Complete | 3/3 reports submitted | File existence check |
| Deduplication | 0 duplicate issues | Manual review |
| Issues Classified | 100% with type + priority | Report structure check |
| Screenshot Coverage | 3+ per page | File count check |
| Report On Time | < 24h from audit end | Timestamp check |
| Executive Summary | Present | Report structure check |
| Recommendations | 3-5 strategic items | Report content check |

---

## Troubleshooting

### Server Issues
```
# Server won't start
mkdocs serve --dev-addr=0.0.0.0:8000  # Try explicit address
mkdocs serve -f mkdocs.yml              # Explicit config file
```

### Agent Timeout
If an agent takes > 30 minutes:
1. QA Manager decides: continue or reduce scope
2. Log the timeout in performance evaluation
3. Consider fallback to smaller model

### Failed Screenshot
If Kimi fails to capture:
1. Try `curl -o page.html http://localhost:8000/page` to verify page loads
2. Check if Kimi WebBridge is available
3. Fall back to manual inspection if needed
