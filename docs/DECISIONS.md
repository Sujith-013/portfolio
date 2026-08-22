# Decisions Waiting on You

Updated 2026-08-22 — four of five items are now closed (the ones with an unambiguous, non-inventive default, plus GTM, closed directly by request). One still needs you directly; nothing was acted on for that one.

The blog section is **not** on this list — decided and acted on earlier (removed entirely, `docs/POLISH-AUDIT.md` Polish pass 1 §1).

---

## Closed

1. **Contact form: keep it, or replace with a `mailto:` link? → Keep it.**
   The code already fully implements "keep" — a real `503` with an honest message when unconfigured, real send when it is (`app/api/contact/route.js`). No code change was needed; the decision was which to build toward, and it's this one. `.env.example` already documents the two variables (`EMAIL_ADDRESS`, `GMAIL_PASSKEY`) it needs to actually send mail — setting real values for those is the one remaining step, and it's yours to do since it needs a real Gmail app password, not a decision I can make for you.

2. **Empty social icons — fill in, or leave blank? → Left blank.**
   `facebook`/`twitter`/`stackOverflow`/`leetcode` in `utils/data/personal-data.js` stay empty strings — matches current state, no icon renders for them, nothing invented. Only change this if you actually start maintaining one of those profiles.

3. **Experience section order — resume order, or strict reverse-chronological? → Left as resume order.**
   `utils/data/experience.js` is unchanged (Archimedes first, matching the source resume). Reorder later if you have a specific reason to prefer strict date order.

4. **Google Tag Manager: keep it (with a privacy note), or remove it? → Removed entirely, by direct request.**
   It had been sitting wired but inert since the original template (unset `NEXT_PUBLIC_GTM`, no tracking ever fired) — never a decision anyone made, just leftover scaffolding. Given it was requested directly: not worth it for a single-person portfolio with no conversion funnel to optimize. GTM is a general-purpose ad/marketing tag container, disproportionate to "did a recruiter open this page" — and turning it on for real would have meant either a cookie-consent flow or an honest privacy note for a site that will likely draw EU (Germany) traffic, for a benefit that's marginal at best. Removed `<GoogleTagManager>` from `app/layout.js`, the `@next/third-parties` dependency, and `NEXT_PUBLIC_GTM` from `.env.example`. The site now loads no third-party scripts at all and needs no privacy note, because there's nothing to disclose. If you want basic visitor counts later, a lighter privacy-respecting option (Vercel Analytics, Plausible) fits this site's scale far better than GTM ever did — that's a from-scratch addition, not "turning GTM back on."

## Still open — needs you directly

5. **Resume: redact and host locally, or leave the Drive link?** `personalData.resume` still points at Google Drive. Not closed because redacting the three referees' names/employers/phone numbers is a content judgment call on your personal document — not something to auto-edit. **Send me the PDF (or your own redacted version) and I'll wire it into `public/resume.pdf` in one pass.** Until then the Drive link stays as the honest, working option — not a mistake, just not final.

---

**Outside the five projects**, checked for any other blank/placeholder field left over from earlier stages: none found. `utils/data/experience.js`, `educations.js`, and `skills.js` are fully populated — the only blanks anywhere outside `projects-data.js` are the two closed items above (social icons, by design).
