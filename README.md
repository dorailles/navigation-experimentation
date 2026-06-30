# Navigation experimentation

A standalone prototype exploring updated navigation for New Quizzes in Canvas by Instructure, built with [Instructure UI (InstUI) v11](https://instructure.design/).

This was extracted from a larger InstUI prototyping sandbox into a self-contained app so it can run, deploy, and be shared on its own.

## Stack

- React 19 + TypeScript
- Vite
- Instructure UI v11

## Getting started

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (the prototype renders at the root route).

## Build

```bash
npm run build      # type-checks, then bundles to dist/
npm run preview    # serve the production build locally
```

## Deploy to GitHub Pages

The Vite `base` defaults to `/navigation-experimentation/` to match a GitHub Pages project site. To publish:

```bash
npm run deploy     # builds, then pushes dist/ to the gh-pages branch
```

Then enable Pages on the `gh-pages` branch in the repo settings. The live URL will be:

```
https://dorailles.github.io/navigation-experimentation/
```

## Project layout

```
src/
  main.tsx                        # standalone host: theme provider + light/dark toggle
  types.ts                        # PrototypeProps (isDark, onToggleTheme)
  navigation-experimentation/
    index.tsx                     # the prototype
    model.ts                      # static data (nav items, questions, students, etc.)
    handoff.ts                    # one-shot state seam (no-op when run standalone)
```

## Theming

`main.tsx` wraps the prototype in an `InstUISettingsProvider` and toggles between the InstUI `light` and `dark` themes. The prototype's own header includes a sun/moon button wired to that toggle.
