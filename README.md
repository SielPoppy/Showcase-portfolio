# Youri van Baal — portfolio

React, TypeScript, and Vite portfolio for https://yourivanbaal.nl.

## Local development

Use Node.js 22.18 or a compatible newer version and run:

```sh
npm ci
npm run dev
```

## Edit without an IDE

Double-click **Edit Portfolio.cmd**, or run `npm run edit`. The editor opens at `http://127.0.0.1:3000/editor.html` (use the printed port if 3000 is already in use). Keep the terminal window open while editing.

1. Choose **Profile and contact** or a project in the sidebar.
2. Type your text, edit individual skills and contributions, and tick **Feature this project** as needed.
3. Use **Add pictures from your computer** to select one or several PNG, JPEG, or WebP images, up to 10 MB each. Edit captions and move images up/down; the first project picture is the card preview.
4. Use **Preview** to see your unsaved changes in the actual portfolio. **Back to editing** returns to the form.
5. Click **Save changes**. This writes the content and pictures into the project folder. Build and deploy through your normal Cloudflare Pages workflow to publish them.

The editor also supports adding/removing projects, video links, JSON backup import/export, browser drafts, and discarding unsaved edits. Removing a picture entry does not delete its file. JSON backups contain image paths, so retain the image files or back up the whole project folder as well.

Content is stored in `src/data/portfolio.json`, with shared types and validation alongside it. The last saved version is kept in `src/data/portfolio.json.backup` (ignored by Git). If another tab or tool changes the content, an outdated editor cannot overwrite it: export your draft and reload to review the latest version.

The editor API runs only in the local editor mode, bound to loopback, and checks the browser origin and a custom request header. Neither the editor page nor its API is included in the production site. Do not expose the development server through a tunnel. No accounts, Cloudflare bindings, or credentials are needed.

Update the downloadable CV at `public/document/Resume.pdf`; the profile form also accepts an alternative CV URL. Hobby images are discovered by the manifest generator before development and production builds.

## Checks

```sh
npm run lint
npm run typecheck
npm run test:editor
npm run build
```

Lint covers the maintained portfolio components, content modules, and editor. TypeScript checks the application and editor entry points and their imported dependencies, plus the Vite configuration. Unused Figma-generated UI components are outside that check. Editor integration tests use a temporary project and verify persistence, backup, conflicting revisions, origin restrictions, validation, and image uploads.

See [PORTFOLIO_CHECKLIST.md](./PORTFOLIO_CHECKLIST.md) for remaining CV/content work and corrections to the screenshot-based advice.

## Cloudflare Pages

- Build command: `npm run build`
- Output directory: `dist`
- Use a compatible Node.js build version (for example Node.js 22).
- Attach `yourivanbaal.nl` as the Pages project's custom domain through Cloudflare.
- The production output is static. The Express `server.cjs` and `npm start` workflow are not required on Pages.
- No credentials or runtime bindings are required for these portfolio features.

Vite copies the CV, images, sitemap, robots file, and `_headers` from `public` into `dist`. Hashed build assets receive a long cache lifetime; the CV is revalidated so updates remain discoverable. Keep HTML and unhashed images on the platform defaults.

Pages supports this static output. A future move to Workers can use the same `dist` directory with Workers Static Assets; see [Cloudflare's static assets documentation](https://developers.cloudflare.com/workers/static-assets/). Optional API features can be added when there is a concrete need. R2 is an option for larger media, while the existing screenshots and CV can remain part of the static build.

## Original design

Originally based on the [Personal Portfolio Website Figma design](https://www.figma.com/design/aRlWGe9K8lnFUP5n0QnXwH/Personal-Portfolio-Website).
