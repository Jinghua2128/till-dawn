# FAILURE_LOG — Till Dawn

Setup date: 2026-10-09. No project bug was investigated or fixed as part of workflow installation. Existing issues remain in [HANDOFF.md](HANDOFF.md) and linked project records.


Only record meaningful failures and repeatable lessons. Do not treat a guess as a confirmed root cause. Keep entries short and point to actual evidence. Group repeated manifestations of the same bug instead of adding duplicates.

## Entry template
### BUG-001 — [descriptive short name]
- **Date / status:** [date] — Unconfirmed / Investigating / Fixed but unverified / Verified fixed
- **Environment:** [e.g., Unity version/platform, Bedrock Education edition, browser]
- **Expected:** [intended result]
- **Actual:** [observed result]
- **Reproduction:** [steps and affected paths]
- **Evidence:** [error, log excerpt, failing test, screenshot path]
- **Root cause:** [confirmed explanation, or label as hypothesis]
- **Fix and changed files:** [precise code/asset changes]
- **Verification:** [test and result; any manual checks not run]
- **Prevention:** [what future sessions should do differently]
- **Related:** [commit, ticket, handoff section]

## Recurring mistake patterns
- **Assumed an edit worked without in-app testing:** Use `Needs manual verification`; do not write `Fixed` without an observed passing check.
- **Changed too many things at once:** Prefer incremental edits and diff review so regressions are traceable.
- **Ignored preservation requirements:** Copy non-negotiable requirements into the acceptance checklist, and inspect the diff before finishing.
- **Repeated the same unsuccessful fix:** After two failed attempts, switch from guessing to evidence gathering.
- **File moves broke dependencies:** Before approved moves, locate all references, preserve required metadata/IDs, update imports/links, and run a build or in-app verification.
- **Scattered or duplicate deliverables:** Maintain canonical paths in `PROJECT_MAP.md`, use clear names and investigate duplicates rather than deleting blindly.

> These patterns are preventive checks, not assertions that they occurred in this particular repository. Replace them with evidence-backed findings as the project progresses.

## BUG-M1-001 — Mobile message composer contrast (verified fixed)
- Expected: only an empty send button is disabled; the message field remains fully readable.
- Actual: shadcn InputGroup `has-disabled:opacity-50` dimmed the whole composer. Mobile WebKit axe reported 3.13:1 placeholder contrast.
- Fix: scope disabled styling to `[data-slot=input-group-control]:disabled` in `src/components/ui/input-group.tsx`.
- Verification: rebuilt production app; all 12 browser cases passed including mobile axe. Keep this regression check.

## BUG-M1-002 — Browser-test route changes (verified fixed)
- An alert assertion collided with Next's route announcer; scope it to the recommendation region.
- Mobile WebKit reported an aborted prefetch when the test forced `page.goto` during client navigation. Hypothesis: the full navigation interrupted an RSC prefetch. Replaced unrelated direct navigations with actual account/history links; all 12 tests then passed. Do not suppress real console errors to make tests green.

## OPS-M1-003 — First Vercel deployment became production (access corrected; staging still pending)
- Reproduction: first upload using CLI 63.1.0, `vercel deploy --target preview --yes --no-wait` on a new project.
- Actual: returned target production; inspect confirmed Ready/Promoted and production aliases. Root cause unconfirmed; inspect CLI documentation/source before selecting the next command.
- Standard protection left the primary production alias accessible. User explicitly approved “Protect all deployments”; `ssoProtection.deploymentType = all` was applied and verified. Signed-out checks of both aliases and the immutable deployment returned 302; authenticated CLI checks of the landing and consultation returned 200 with app content. The first deployment remains production-classified; do not label it staging.
- CLI `project pause` refused noninteractive confirmation and requires the user to type the project name in a terminal. Do not bypass that confirmation.

## OPS-M1-004 — Initial Git push timeout (resolved)
- Initial `git push -u origin main` ended with curl 55 receive timeout and unexpected disconnect. “Everything up-to-date” in that failed output is not proof of publication; verify remote SHA and CI explicitly before retry. A command-local HTTP/1.1 + buffered-upload retry succeeded; cause is consistent with transport behavior but remains unconfirmed. CI was triggered.

## OPS-M1-005 — Sandboxed production build stalled (workaround verified)
- `next build` inside the restricted sandbox stayed at compilation. Cancelled it and reran with approved escalation; compilation completed in seconds. Root cause unconfirmed. Lint/type checks ran successfully inside the sandbox.

## OPS-M1-006 — Vercel MCP lacks project scope (open)
- Shared endpoint OAuth completed, but MCP list_teams returned an empty list, get_auth_user returned 404 and explicit project/team read returned 403. CLI project reads/writes succeed for the same IDs.
- Confirmed symptom: MCP credentials lack usable access to this team. Exact authorization-service cause is unconfirmed. Documentation search works. Use CLI for authorized project work and report the MCP limitation separately.
- The official plugin declares a separate Vercel connected app, initially found uninstalled. The user subsequently installed it; a fresh project read still returned 403 and get_auth_user returned 404. The missing-plugin hypothesis alone was insufficient. CLI reads still work; service authorization remains unresolved. Do not repeat unchanged MCP or deployment attempts.

## OPS-M1-007 — Preview commit author permission (blocked)
- CLI inspect of dpl_71ofeJW1s4M8RoTpTcySH3UTxZSv confirms target preview and Blocked: commit author lacks permission to create deployments for this project.
- The commit uses verified GitHub no-reply author Jinghua2128. Vercel CLI account is separately authenticated. Required next step: normal Git account/team authorization. Do not fake authorship, strip Git metadata, or use another upload route to evade the access check.
- After the user's completion report, `dpl_uJNmZJWycoZmFLRRgFqv3apQQXSi` for glass commit `253472d` was again Blocked with the same reason. The browser account page is signed out; the actual account connection remains unverified. All-deployment protection remains enabled.

## UI-GLASS-20261010 — Keep sticky input text readable (verified visually after fix)
- Initial glass pass used the translucent modal fill for the mobile sticky composer. Full-page review showed recommendation text faintly showing through the control area.
- Keep the mobile sticky backing opaque while retaining the glass input surface. Check its 390px screenshot after the change; do not lower all text opacity to create translucency.

## UI-SCROLL-20261010 — Next.js smooth route-scroll warning (verified fixed)
- Browser navigation warned that global smooth scrolling lacked `data-scroll-behavior="smooth"` on the HTML element. The installed Next 16 upgrade guide documents this opt-in for instant route transitions.
- Added the attribute in `src/app/layout.tsx`; repeated landing → consultation navigation produced no new console warnings/errors.

## UI-GLASS-20261011 — Linux mobile WebKit dialog stalls (investigating)
- Expected: preferences and cancellation respond promptly on mobile WebKit, as in local macOS checks. Actual: CI `38030545170` passed 10 tests but two dialog flows timed out on both attempts.
- Trace evidence: waiting for visible/enabled/stable buttons took 4.6–20.6 seconds; screenshots show sharp underlying text despite backdrop filters. Artifacts are in `/private/tmp/till-dawn-ci-38030545170`.
- Hypothesis: repeated nested backdrop filters on dialog choices and buttons overload or stall Linux WebKit compositing. Removing redundant control/content filters while retaining the overlay's scene blur and glass fills. Verification pending; do not increase timeouts or force clicks to hide the problem.
- First fix `87a864d` passed all 12 local tests but CI `38130018984` still failed the same two flows, progressing further before timing out. Nested-control filtering alone was not the complete cause. Second diagnostic change removes the document-height consultation backdrop filter and the unnecessary filter on the opaque sticky composer; navigation and modal overlay retain blur, and all glass fills/highlights remain. Linux verification pending.

### 11 October handoff checkpoint
- `c7d1761` removes full-page and opaque-composer backdrop filters. Local `npm run check` and all 12 browser tests PASS (7.9s); Linux CI `38130463104` is still running at handoff. Do not mark the Linux WebKit failure fixed yet.
- Normal CLI reauthentication now reports `longmai2128` and reads the existing project successfully. Preview `dpl_67QbfKska7KfedC7dfDgNpACN4pT` still fails the commit-author gate, so the account refresh alone was insufficient. `/v2/user` omits Git-provider connection fields; null results from guessed top-level `githubLogin` / `githubId` fields were not evidence of a missing link.
- Connected-app MCP user read now succeeds for `longmai2128`; both MCP team lists remain empty and project reads return scope 403. This narrows the remaining symptom to usable team access; it does not prove a service-side root cause.

### 12 November verification
- Run `38130463104` completed with 11 passes and one mobile WebKit preferences timeout. The prior Linux rendering fixes are not verified; inspect a fresh run/trace before another hypothesis-driven change.
- Vercel CLI still reads the correct project, but Git connection fails because the private repository is inaccessible. GitHub App permission remains the concrete next authorization step; do not bypass commit-author checks.

## OPS-SEC-20261112 — Vulnerable Next.js pin (patched locally)
- `npm audit --omit=dev` confirmed critical Next.js advisories affecting 16.4.0; the production build also refused once with its security advisory.
- Updated Next.js and eslint-config-next to 16.4.6 with the lockfile. Lint/typecheck/build and all 12 local browser tests pass; runtime audit reports zero advisories. Remote deployment verification remains pending.

### 12 November modal investigation
- `43160664727` passed only after one WebKit retry. `43161191184` failed both attempts; retained traces show individual clicks taking 1–7 seconds, and sharp background text visible through the dialog. Failure artifacts now upload even if retries eventually pass.
- Targeted candidate: use a scrim instead of overlay blur, pause header blur behind an open modal, and increase modal opacity to 96%. All normal glass surfaces and motion remain. Local checks and 12 browser tests pass; Linux verification pending. No timeout/assertion/worker changes.

### Final 12 November verification
- The modal change improved legibility, but `43161921153` still needed a WebKit retry. Reduced CI contention by changing from two workers to Playwright's recommended one worker. `43233522101` passed all 12 tests without retries in 45.9s. Timings support runner contention; no product-specific rendering root cause is claimed. Assertions and timeouts are unchanged.
- Normal GitHub App permission and project linking succeeded. Git push produced a Ready deployment for `8b60401`; prior commit-author blocker is resolved for this source.
- Final live check found project protection null and signed-out HTTP 200. Restored the previously approved all-deployment authentication; project read confirms `all`, signed-out URLs return 302, authenticated consultation returns 200. The cause of the protection change is unknown; verify protection after hosting changes.
