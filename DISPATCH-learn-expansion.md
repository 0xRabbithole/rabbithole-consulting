# DISPATCH — Learn hub fixes + 3 new guide kits

**For:** Claude Code, run inside the `consulting` repo (this site).
**Goal:** Fix the existing `/learn` hub, then ship 3 new guide+kit lessons.
**How to run:** The four work streams below (A, B, C, D) are independent — dispatch them in parallel. Stream A touches only existing files; B/C/D each create new files and append one card to the hub. The only shared file is `learn/index.html` (each guide adds one card) and `sitemap.xml` — make those edits last / serialize them to avoid clobbering.

---

## 0. Operating philosophy (applies to everything below)

Rabbithole's bet: **give away genuinely complete, powerful kits — not crippled demos.** People are going to build on our repos anyway; we want to be the ones they learn from. The kit teaches the DIY crowd how to do it themselves, and a slice of them will hire us to run the production version (real bookings, their CRM, their inbox, guardrails, their whole team). So:

- Kits are **real and runnable**, MIT-licensed, `npm run setup` to configure, run on the user's own machine. No paywall, no neutered features.
- **Read-only / dry-run by default.** Anything that writes, sends, or charges shows a plan and waits for explicit confirmation ("confirm-before-send"). This is both safety and the brand's trust differentiator.
- Every lesson ends with a **clear, non-spammy upsell**: "you can run this yourself — or we'll build the production version for your whole team." One CTA per logical section, varied phrasing (see fix A3).
- Plain English. No jargon without a one-line plain-English unpacking. Match the voice of the existing two guides.

### Repo conventions (match these exactly)
- The site is **static HTML on Vercel**. Each `/learn` lesson is a **standalone HTML file** (`learn/<slug>.html`) with its own inline `<style>` — there is no shared template/include. Copy structure from the existing pages.
- **Design tokens** (define in each page's `:root`, copy from `learn/index.html`): `--bg #ffffff`, `--bg-soft #f5f6f8`, `--line #eaecf0`, `--line-2 #e3e6eb`, `--navy #0a0e1c`, `--navy-2 #142253`, `--blue #1d3a8a`, `--blue-soft #dee3f3`, `--text #1a1a1a`, `--muted #6b7280`, `--muted-2 #5a5f66`.
- **Fonts:** `Inter` (body), `Inter Tight` (headings/UI), `Newsreader` italic for the `.serif` accent span. Same Google Fonts `<link>` as `learn/index.html`.
- **PostHog snippet** goes at the very top of `<head>` on every page — copy verbatim from `learn/index.html` lines 4–13.
- **Meta block:** canonical + og + twitter, same shape as existing pages. **Canonical host = apex `https://rabbithole.consulting`** (no `www`) — see fix A1.
- **Kits live in their own GitHub repos** under owner `0xJRP` (the secretary kit is `github.com/0xJRP/secretary-agent-kit`). Create a new repo per kit; the `/learn` page links to it. Tech baseline: Node, the official Anthropic SDK for the Claude brain, MCP where tools are involved, `.env` via setup wizard, tokens gitignored.
- **Day counter:** pages carry "Day N of 30". Current: MCP = Day 1, Secretary = Day 2. New guides below are Days 3, 4, 5.

---

## STREAM A — Fix the Learn hub & site hygiene

Five fixes. All in existing files. No new pages.

### A1. Canonical / www mismatch
**Problem:** Every `/learn` page's `<link rel="canonical">` and `og:url` use the apex `https://rabbithole.consulting`, but the live site 301-redirects the apex → `www.rabbithole.consulting`. So the URL Google is sent to (apex) is not the URL that actually serves — split signal.
**Fix (pick apex as primary, to match every existing canonical & the sitemap):**
- In the **Vercel project domain settings**, set `rabbithole.consulting` (apex) as the primary domain and redirect `www.rabbithole.consulting` → apex (301). (This is a dashboard setting, not `vercel.json`. If you can't reach the dashboard, leave a clearly-marked TODO note in the PR description — do not silently flip all canonicals to www instead.)
- Verify no page hard-codes a `www.` URL in canonical/og/links. `grep -rn "www\.rabbithole" .` should return nothing in shipped HTML.
**Acceptance:** Requesting either host lands on apex with one 301 hop; canonical host == served host on all `/learn` pages.

### A2. Standardize the lesson header
**Problem:** Three different headers across three pages:
- `learn/index.html` → `.topbar`: "🐇 Rabbithole" wordmark + "Work with us →" CTA (no back link).
- `learn/mcp.html` → `.brand` span reading "← All lessons · MCP" (no wordmark, no CTA).
- `learn/secretary.html` → `.brandbar`: "🐇" + "Rabbithole Consulting" + "← All lessons".
**Fix:** Define ONE header pattern and use it on every lesson page (mcp, secretary, and all new guides). Recommended structure (left→right): `🐇 Rabbithole` wordmark (links to `/`) · `← All lessons` (links to `/learn`) · right-aligned `Work with us →` CTA button (links to `https://rabbithole.consulting`). The hub (`index.html`) keeps wordmark + CTA but omits "← All lessons" (it IS the lessons page). Keep markup + class names identical across pages so it reads as one site.
**Acceptance:** All `/learn/*` lesson pages render a byte-identical header block (same DOM + styles); hub differs only by dropping the back link.

### A3. De-duplicate / vary CTAs on `learn/secretary.html`
**Problem:** "Have Rabbithole build it →" appears twice (lines ~294, ~328) plus "Book a call →" (~345) — three near-identical asks close together.
**Fix:** Keep at most one CTA per logical section and vary the language so it doesn't read as repetition. Suggested copy bank (use distinct ones): "Have Rabbithole build the production version →", "Want it wired to your real tools? Book a call →", "We'll run this for your whole team →". Keep the final footer CTA strong; trim the mid-page duplicate.
**Acceptance:** No two visible CTAs on the page share identical text; asks feel deliberate, not looped.

### A4. Add `/learn` pages to `sitemap.xml`
**Problem:** `sitemap.xml` lists the marketing pages but **none of the `/learn` pages**.
**Fix:** Add entries for `/learn`, `/learn/mcp`, `/learn/secretary`, plus the three new guide slugs from streams B/C/D (`/learn/quote-bot`, `/learn/lead-catcher`, `/learn/build-an-mcp`). Use `changefreq` weekly, `priority` ~0.7, apex host to match the rest of the file.
**Acceptance:** All current and new lesson URLs present once each, apex host, valid XML.

### A5. Make the "30 kits" promise feel real (backlog scaffolding)
**Problem:** The hub grid shows only the two live lessons + a single dashed "More lessons coming / Soon" card, yet the lesson pages advertise "Day N of **30**." Two real + one vague placeholder makes the 30-kit ambition read as unfinished rather than intentional.
**Fix:**
- Expand the hub grid (`learn/index.html`) so the pipeline is visible: keep the 2 live cards, add the **3 new live cards** as B/C/D ship, and add **named "Soon" cards** (dashed `.lesson.soon` style already exists) for a credible backlog — e.g. "AI Inbox Triage", "Review Responder", "AI Receptionist", "Weekly Business Digest", "Appointment Reminder Bot". Named upcoming cards >> one vague placeholder.
- Add a small progress line near the hero, e.g. "5 of 30 kits shipped — new ones regularly," so the counter on lesson pages has a matching home on the hub.
- Keep the per-page "Day N of 30" but ensure numbering is consistent and sequential.
**Acceptance:** Hub shows ≥5 live + several named-Soon cards; a hub-level progress indicator matches the per-page day counter.

---

## STREAM B — Guide 3: "Job Quote & Invoice Bot" (construction / trades)

**Slug:** `/learn/quote-bot` · **Day 3 of 30** · ~12 min
**One-liner:** Text the job details, get a clean quote (and invoice) drafted — you approve, it sends.

### Why this vertical (grounded)
Construction & trades are the clearest fit: quoting/invoicing is already where this segment adopts software fastest (Joist, Simpro's AI-assisted quote/invoice generation, BuildOps), and the work is bid-driven. Brand the guide to **general contractors, plumbing, HVAC, electrical, roofing, landscaping, painting** — show a contractor texting "200 sq ft bathroom remodel, retile + new vanity" and getting a line-itemed quote back. Keep the engine general enough that any quote-driven business can reuse it, but every example, screenshot, and the hero should speak trades.

### Audience & promise
A contractor in a truck, not a developer. Promise: stop losing evenings to writing quotes; text the job like you'd text your office, get a professional quote draft in seconds, approve before it goes to the customer.

### Scope (match existing kit pattern — BOTH tracks)
1. **Interactive `/learn/quote-bot.html` walkthrough** (mirror `secretary.html`'s structure: numbered steps, a live in-page dry-run planner that drafts a quote from typed input but sends nothing, "what's happening" plain-English callouts, confirm-before-send framing, progress tracker).
2. **Runnable kit** in a new repo `github.com/0xJRP/quote-bot-kit`: Telegram (or SMS) in → Claude brain → produces a structured quote (line items, qty, unit price, subtotal, tax, total) → renders a clean PDF/HTML quote → **shows the draft for approval** before emailing it to the customer. Optional second step: turn an accepted quote into an invoice. `npm run setup` wizard for Claude API key + a simple editable price list (JSON/CSV the contractor owns) + email creds. Read-only/draft by default; nothing sends without a tap.

### Core flow to teach
1. Give it a phone (reuse Telegram-bot step from secretary kit; cross-link Lesson 2).
2. Give it a brain (Claude) + **your price book** (a file the contractor edits — materials, labor rates, common line items). This is the part that makes quotes accurate; emphasize they own this file.
3. Text a job in plain words → bot returns a structured, line-itemed quote draft.
4. **Approve → it generates the PDF and emails the customer.** Decline/edit → it revises.
5. (Bonus) Accepted quote → one tap to an invoice.

### Safety / trust beats
Price book lives on the contractor's machine; the bot never invents prices it can't justify from the price book; **nothing is sent to a customer without explicit approval**; money is never moved (it drafts invoices, it does not charge cards).

### CTA
DIY: get the free kit. Paid: "We wire this to your real CRM, your price book, and your accounting (QuickBooks/Jobber) and run it for your crew → Have Rabbithole build it."

### Acceptance
Page matches site conventions (header A2, meta/canonical apex, PostHog, fonts, Day 3 counter, hub card + sitemap entry added). Kit repo has README, MIT license, `npm run setup`, working dry-run, confirm-before-send on every send/charge path.

---

## STREAM C — Guide 4: "Lead Catcher" (general, with vertical callouts)

**Slug:** `/learn/lead-catcher` · **Day 4 of 30** · ~12 min
**One-liner:** A new lead comes in — your bot replies in seconds, qualifies them, logs it, and pings you. Never lose a hot lead to slow follow-up again.

### Positioning (general engine, real-world vertical hooks)
Keep the kit **general** — it catches a lead from a web form, email, or DM. But open with the stat that makes it visceral, and name the verticals that feel it most so readers self-identify:
- **78% of customers go with whoever responds first**; replying within **5 minutes makes you ~100× more likely to make contact.**
- **Home services** (plumbing, HVAC, electrical, roofing, landscaping) miss **60–80% of inbound calls/leads** — for a roofer at a $15k avg job, one caught lead is huge ROI.
- Other heavy adopters to name: **real estate, insurance, auto, and marketing/recruiting agencies.**
Frame: "This kit is industry-agnostic. It just happens to pay for itself fastest if you're in one of these."

### Audience & promise
A small-business owner who can't sit on their inbox. Promise: the instant, always-on first responder that makes you the one who answers first.

### Scope (BOTH tracks)
1. **Interactive `/learn/lead-catcher.html`** walkthrough with a live dry-run: paste a sample lead message, watch it get classified (hot/warm/cold), see the auto-reply drafted, and see the row it would write — all without sending.
2. **Runnable kit** `github.com/0xJRP/lead-catcher-kit`: a webhook/inbox watcher that, on a new lead → uses Claude to (a) draft an instant first reply, (b) qualify/score it, (c) append to a Google Sheet (or CSV), (d) ping the owner (Telegram/Slack/email). **Auto-reply is the one action that can be configured to fire automatically** (speed is the whole point) — but ships defaulting to draft-for-approval, with a clearly documented one-line switch to enable instant auto-reply once the owner trusts it. Everything else (CRM writes, etc.) stays read-only/log-only.

### Core flow to teach
1. Where leads come from (web form/email/DM) → the one webhook or inbox connection.
2. Claude reads the lead → drafts a reply + a qualification summary + score.
3. Log it (Sheet/CRM) + notify you.
4. The speed tradeoff, taught honestly: auto-reply instantly (max conversion, small risk) vs draft-first (full control). Default = draft; show how to flip it.

### Safety / trust beats
Make the auto-send choice explicit and reversible; lead data destination is the owner's own Sheet by default (not sent to us); scoring is explainable.

### CTA
DIY: free kit. Paid: "We connect it to your real CRM, your forms, your phone system, route by territory/rep, and add SMS — Have Rabbithole build the production version."

### Acceptance
Same as Stream B acceptance (conventions, Day 4, hub card, sitemap). README must document the auto-reply switch and its tradeoff prominently.

---

## STREAM D — Guide 5: "Build Your First MCP" (the give-them-everything capstone)

**Slug:** `/learn/build-an-mcp` · **Day 5 of 30** · ~15 min
**One-liner:** You learned what an MCP is in Lesson 1 — now build your own, and connect any AI to your real data and tools.

### Why this one / positioning
This is the lesson that fully embodies the philosophy: hand people the deep capability. Direct sequel to Lesson 1 ("What is an MCP"). It turns a curious reader into someone who can wrap *their own* data/API as a tool any AI agent can use — which is exactly what Rabbithole does for clients, just productionized. The honest pitch lands hardest here: "you can absolutely build this yourself with what's below; when you want it hardened, secured, and connected across your whole stack, that's our day job."

### Audience & promise
The technically-curious owner or their in-house tinkerer (the person who finished Lesson 1 and wants more). Promise: by the end you have a real, running MCP server exposing a tool you wrote, and you've connected it to Claude.

### Scope (BOTH tracks)
1. **Interactive `/learn/build-an-mcp.html`** walkthrough: builds on Lesson 1's diagram, then steps through writing one tool, running the server locally, and pointing an AI at it. Include a live in-page demo where the reader "calls" a sample tool and sees the request/response shape (no real server needed in-page) — same teaching style as the MCP lesson's "watch them work" panel.
2. **Runnable kit** `github.com/0xJRP/first-mcp-kit`: a minimal but real MCP server (served over HTTP, per the Lesson-1 framing) exposing 2–3 read-only example tools (e.g. `search_inventory()`, `read_pricelist()`, `get_hours()`) over a sample data file the user can swap for their own. `npm run setup` + a Claude-connection step (Claude Desktop connector or a tiny CLI agent) so they see their tool actually fire. Tools read-only by default; a commented "how to add a write tool safely (with confirm-before-send)" section shows the next step without shipping foot-guns.

### Core flow to teach
1. Recap the Lesson-1 mental model (AI ⇢ MCP ⇢ your data) — cross-link it.
2. Write one tool: name, description, inputs, what it returns. Stress the "self-describing" idea from Lesson 1 (the AI discovers it).
3. Run the server locally; connect Claude; ask a question that makes the tool fire.
4. Swap the sample data file for theirs.
5. The safety chapter: read-only first, the 5 questions from Lesson 1's safety panel, how to add a write tool behind confirmation.

### Safety / trust beats
Reuse Lesson 1's "5 questions before you connect AI to anything." Everything read-only by default; writes are explicitly gated. Runs entirely on the user's machine.

### CTA
DIY: free kit + "you now understand this better than most devs." Paid: "Going from this toy MCP to one that's secure, audited, and wired to your real systems is the gap we close — See what Rabbithole builds." Strong upgrade narrative since this is the most capable lesson.

### Acceptance
Same conventions (header A2, apex canonical, PostHog, fonts, Day 5, hub card, sitemap). Kit repo: README, MIT, `npm run setup`, a server that actually starts and a tool that actually fires from Claude. Cross-links to/from `/learn/mcp` both directions.

---

## Definition of done (whole dispatch)
- [ ] Stream A: all 5 fixes applied; `grep` for `www.rabbithole` clean; headers identical across lesson pages; sitemap complete; hub shows real backlog.
- [ ] Streams B/C/D: 3 new `/learn/*.html` pages live, each with a matching kit repo (README + MIT + `npm run setup` + working dry-run + confirm-before-send on any send/charge path).
- [ ] Each new page: PostHog snippet, apex canonical/og/twitter, standardized header (A2), correct Day counter, one hub card added, one sitemap entry added.
- [ ] Voice check: plain English, jargon unpacked, one varied CTA per section, DIY-first with a clean "or we build it" upsell.
- [ ] Final pass: open each page locally, click through the dry-run, confirm nothing sends without approval.
