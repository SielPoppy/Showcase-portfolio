# Portfolio and CV improvements

Based on the supplied feedback, the repository, and a direct review of yourivanbaal.nl on 17 November 2026.

## Corrections to the earlier feedback

- The live site already has a CV download in the hero.
- The category badges open panels with specific technologies and how you used them.
- Poppythorn and Media Vault already have live-site links.
- Media Vault is another useful example of Rust and Cloudflare experience.
- The Geography popup does overlap the About heading at the desktop viewport reviewed.
- The deployed site still says internship opportunities; the local contact copy had already been changed to job opportunities.

## Implemented locally

- [x] Use a software developer title and consistent job opportunity wording.
- [x] Rewrite Yookr, monitoring, BDO, DeskMate, and CloudAIScanner summaries using existing project information.
- [x] Feature professional IoT work, schema automation, and Poppythorn.
- [x] Use one responsive project card component with visible summaries and actions.
- [x] Add project detail dialogs with all existing skill contributions and supporting images.
- [x] Add structured problem/contribution/approach/result sections to the three featured projects.
- [x] Keep screenshot viewers, video demos, and existing live-site links.
- [x] Add search and technology filters, a result count, reset action, and empty state.
- [x] Replace hobby overlays with native expandable cards and associated photos.
- [x] Add a contact-section CV download and a hero link to projects.
- [x] Correct nested link/button markup, name navigation controls, add a skip link and reduced-motion styles.
- [x] Add canonical/social metadata, sitemap, and Cloudflare static response headers.
- [x] Add repeatable scoped lint and application type checks.
- [x] Add a local browser editor for profile text, projects, skills, case studies, and picture uploads, launched with Edit Portfolio.cmd.
- [x] Remove the student email from the site and its downloadable CV.
- [x] Create a one-page Word resume with editable text fields, and update the site's PDF download from it.

## Your next actions, in priority order

1. **Review the prepared Word resume.** The revised copy puts the Yookr developer role first, condenses retail experience, and uses named sections and editable fields. Replace the field text as needed; Word handles wrapping and styles.
2. **Add two or three evidence-led work bullets.** Explain your contribution to sensor ingestion, Rust/Actix-web APIs, and container deployments. Distinguish individual ownership from team results. Do not include confidential architecture or customer data.
3. **Add verified outcomes.** For example, number of supported services or integrations, schema objects compared, frequency of reports, or a measured improvement. Use figures only if you can substantiate and share them; the site currently makes no invented numerical impact claims.
4. **Confirm your target and dates.** The site follows your local job-seeking change. Add the specific role level, availability, and location/remote preferences if useful. Confirm current study status and add an actual or expected graduation date to the CV.
5. **Keep contact details consistent.** The site and revised CV now use mail@yourivanbaal.nl. Change the primary site address through Profile and contact in the editor if needed.
6. **Review the drafted project copy.** Validate the three featured overviews for accuracy and permission to share. Add a specific engineering challenge and tradeoff to each; current source material does not establish those details.
7. **Improve the Yookr evidence.** The available backend image is an event presentation. A permitted, sanitized architecture diagram would explain the engineering more directly. Add GitHub links only for repositories you can publicly share.
8. **Deploy after reviewing the CV.** The site's public/document/Resume.pdf has been updated from the revised Word document. After future Word edits, export a new PDF to that path and deploy the production build to Pages.
9. **Perform a final production smoke check.** Test the new PDF download, screenshots, video playback, live-site links, keyboard controls, and a real phone after deployment.

## Cloudflare direction

Keep the portfolio static on Pages for now. Its project information, filtering, dialogs, and downloads run without a backend. Your paid Workers/R2 capacity can support future requirements, but does not itself justify additional infrastructure.

If larger videos or project assets outgrow the repository, consider R2 with a public custom asset domain. If you need a contact form with delivery and abuse protection, add a narrowly scoped Worker or Pages Function. These are optional later features; neither was provisioned or deployed here.
