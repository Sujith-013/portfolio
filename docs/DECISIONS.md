# Decisions Waiting on You

Five open questions, pulled from `docs/POLISH-AUDIT.md` (all three polish passes) and `docs/WHERE-THINGS-LIVE.md`'s Known TODOs. Ordered by whether the answer changes anything about asset export (§4 of `docs/START-HERE.md`), then by impact. **None of these block asset export** — the image/video pipeline (dimensions, filenames, `public/projects/<slug>/`) is independent of all five, so you can start exporting assets before or while clearing this list.

The blog section is **not** on this list — it was already decided and acted on (removed entirely, `docs/POLISH-AUDIT.md` Polish pass 1 §1) — nothing further needed from you there.

---

1. **Resume: redact and host locally, or leave the external Google Drive link?**
   Open because: the source PDF has three referees' full names, employers, and personal phone numbers — that PII is the only thing blocking moving it into `public/resume.pdf`. Currently `personalData.resume` (`utils/data/personal-data.js:13`) points at the Drive link.
   Options: (a) redact the PDF yourself and host it same-origin, (b) keep the Drive link as-is, (c) send me the PDF and I redact it.
   Recommendation: **(a) or (c)** — a same-origin PDF can't rot or be revoked the way a Drive share link can, and it's a one-time fix. Whichever route, this needs the actual PDF, which isn't in the repo.
   Blocks asset export: **no.** Independent file, independent field.

2. **Contact form: keep it, or replace with a `mailto:` link?**
   Open because: the code is already correct and honest (a real `503` when unconfigured, no fake success), but it needs `EMAIL_ADDRESS`/`GMAIL_PASSKEY` set — locally and on Vercel — to ever actually send anything. Neither is set today.
   Options: (a) keep the form and set the two env vars, (b) replace with a `mailto:` link and delete the form/API route.
   Recommendation: **(a) keep it** — more capable for a one-time setup cost ("set two secrets"), not an ongoing maintenance burden. Full argument for both sides in `docs/POLISH-AUDIT.md` Polish pass 1 §3.
   Blocks asset export: **no.**

3. **Set `NEXT_PUBLIC_GTM` (Google Tag Manager), or leave analytics off?**
   Open because: `app/layout.js:84` already renders `<GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM} />`, but the env var is unset — currently harmless (resolves to `undefined`, no tracking fires, no error), but it means you're getting zero visitor analytics on a live portfolio.
   Options: (a) get a GTM container ID and set the env var, (b) leave it unset (no tracking, no analytics), (c) remove the `GoogleTagManager` component entirely if you never intend to use it.
   Recommendation: **(a) if you want to know whether anyone's actually visiting**, otherwise (b) — it's already inert, so there's no urgency either way.
   Blocks asset export: **no.**

4. **Empty social icons — fill in, or leave blank?**
   Open because: `facebook`/`twitter`/`stackOverflow`/`leetcode` in `personal-data.js` are empty strings — correctly, no icon renders for them (not a bug), but it's an open question whether that's the final state or you just haven't filled them in yet.
   Options: (a) leave empty (only GitHub/LinkedIn shown), (b) add any of the four you actually maintain.
   Recommendation: **(a) leave empty** unless you actively maintain one of those accounts — an inactive/empty-profile icon is worse than no icon.
   Blocks asset export: **no.**

5. **Experience section order — leave as resume order, or force strict reverse-chronological?**
   Open because: the Experience section currently follows the same entry order as the source resume (Archimedes first), which isn't strict newest-first.
   Options: (a) leave as-is, (b) reorder to strict reverse-chronological.
   Recommendation: **(a) leave as-is** unless you have a specific reason (e.g. Archimedes is the most relevant/recent one) to prefer date order over resume order.
   Blocks asset export: **no.**
