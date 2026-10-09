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
- The official plugin also declares a separate Vercel connected app, found uninstalled. Connection was offered; no user confirmation received. This may explain the exposed app tools' missing authorization, but it is not a verified root cause. A later project read still returned 403; stop unchanged retries.

## OPS-M1-007 — Preview commit author permission (blocked)
- CLI inspect of dpl_71ofeJW1s4M8RoTpTcySH3UTxZSv confirms target preview and Blocked: commit author lacks permission to create deployments for this project.
- The commit uses verified GitHub no-reply author Jinghua2128. Vercel CLI account is separately authenticated. Required next step: normal Git account/team authorization. Do not fake authorship, strip Git metadata, or use another upload route to evade the access check.
