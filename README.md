# Interactive Portfolio Website

Auspify Technologies Frontend Developer Internship, Task 2.

A responsive personal portfolio built with plain HTML5, CSS3 and JavaScript. No frameworks or build step.

## Features

- Premium dark theme with an animated glowing gradient background and subtle grain texture
- Glassmorphism cards (frosted-glass blur) with a reflective "shine" sweep on hover
- Sticky navigation with smooth scrolling and active-section highlighting
- Mobile menu that opens and closes with the keyboard and touch
- Hero section with an accent color picker (choice is remembered in the browser)
- About, Skills, Software & Digital Tools, Projects, Journey and Contact sections
- Skill bars that fill when scrolled into view
- Project cards with hover and focus effects
- Contact form with live validation and a character counter
- Layout built with CSS Grid and Flexbox
- Respects reduced-motion settings, keyboard focus and screen readers

## Project structure

```
Task2_Interactive_Portfolio/
├── index.html
├── css/style.css
├── js/script.js
└── README.md
```

## Run locally

Open `index.html` in a browser, or use the Live Server extension in VS Code.

## Customise

1. Name, email and skills (HTML, CSS, JavaScript, TypeScript, C#) are already filled in. Add your LinkedIn link in `index.html`'s contact list when it's ready (it's left commented out for now).
2. Adjust the skill percentages in the Skills section to match your real confidence level, and edit the Software & Digital Tools chip list to match the tools you actually use.
3. Update the project cards and add links when projects are finished.
4. To send form messages directly, set `FORM_ENDPOINT` in `js/script.js` (for example a Formspree URL). Without it, the form opens the visitor's email app with the message filled in.

## Deploy

Push the folder to GitHub, then enable GitHub Pages (Settings, Pages, branch `main`, folder `/root`).
