# Curtis · Portfolio v2

My portfolio: frontend work, experience, and the 3D characters and scenes I make in Blender, shown live in the browser.

Built with **Vite + React + TypeScript** and **react-three-fiber** (three.js).

## Run it

```bash
npm install
npm run dev       # local dev server
npm run build     # typecheck + production build into dist/
npm run preview   # serve the production build
```

The build uses a relative base (`./`), so `dist/` can be hosted from any sub-path, e.g. GitHub Pages.

## Layout

| Path | What's there |
|---|---|
| `src/components/` | Page sections: `Nav`, `Hero`, `About`, `Experience`, `Projects`, `Lab`, `Tech`, `Contact` |
| `src/three/` | 3D: `CharacterScene` (desk turntable and the animated Funko), `CityScene` (San Francisco), `gridWorld` (grid floor and back wall), `Stage3D` (the card each canvas lives in) |
| `src/data/` | Content: experience, projects, tech stack (`icons.json` holds brand icons from simple-icons) |
| `src/hooks/` | Theme (light/dark) and the scroll slide-in reveal |
| `src/styles/global.css` | All styles and design tokens (Sky palette, Poppins) |
| `public/models/` | `desk.glb`, `funko.glb`, `city.glb` |
| `public/renders/`, `public/projects/`, `public/cv/` | Blender renders, project screenshots and renders, CV |

## Editing content

- **Experience, projects, tech:** edit the files in `src/data/`. Each project cover is an image in `public/projects/` (set `contain: true` to show it whole on white instead of cropped).
- **Colours:** the tokens at the top of `src/styles/global.css` (`--a1`, `--a2`, `--a3`, …). The 3D scenes read them too and recolour when the theme changes.

## Contact form

The form sends through [EmailJS](https://www.emailjs.com/). It needs three IDs, all public by design:

```bash
# .env.local (git-ignored), for local development
VITE_EMAILJS_SERVICE_ID=...
VITE_EMAILJS_TEMPLATE_ID=...
VITE_EMAILJS_PUBLIC_KEY=...
```

On GitHub the same three are repository variables (Settings → Secrets and variables → Actions → Variables), which the Pages workflow passes to the build. The EmailJS template uses `{{from_name}}`, `{{from_email}}`, `{{topic}}` and `{{message}}`. A hidden honeypot field and a one-minute cooldown keep casual spam out. Without the IDs, the form points people to LinkedIn instead.

## Deploying

Every push to `main` builds the site and publishes it to GitHub Pages (`.github/workflows/deploy.yml`): https://curtisdablorh.github.io/curtis-portfolio/

## History

This replaces the [first version](https://github.com/CurtisDAblorh/Curtis_3D_Port_folio), which appears in the Projects section as "3D Portfolio (v1)". The design was prototyped first as a single HTML page (`../portfolio-v2-prototype`).
