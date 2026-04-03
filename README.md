# TEDScreen — Thyroid Eye Disease Screening Tool

A symptom-based web screening tool for early detection of Thyroid Eye Disease (TED). Built with plain HTML, CSS, and JavaScript — no frameworks, no dependencies.

<img width="1710" height="989" alt="TEDDETECT" src="https://github.com/user-attachments/assets/efd3b403-f521-4bb9-a53b-3a7094c4a5c1" />

---

## What it does

Walks the user through 20 clinically inspired questions covering eye symptoms, thyroid history, pain, visual changes, and lifestyle impact. At the end it gives a risk score (Low / Moderate / High) with a breakdown by category and guidance on next steps.

It's not a diagnostic tool — it's meant to help people recognize symptoms early and have better conversations with their doctors.

---

## Pages

**Landing** — hero section, 3 stat cards, info about TED, and a start button

**Questionnaire** — 20 questions, one at a time, with a progress bar and smooth transitions. Uses 4 input types: radio cards, yes/no toggles, sliders, and multi-select chips. All questions are mandatory before moving forward.

**Results** — risk level badge, animated score arc, category breakdown bars, a plain-text note about the AI analysis model, and a medical disclaimer.

---

## Stack

- HTML / CSS / JavaScript only
- Google Fonts (DM Serif Display + DM Sans)
- No frameworks, no libraries, no build step

Just open `index.html` in a browser and it works.

---

## Color palette

| Color | Hex | Used for |
|---|---|---|
| Dark green | `#346739` | Nav, buttons, headers |
| Medium green | `#79AE6F` | Highlights, progress bar |
| Soft green | `#9FCB98` | Accents |
| Beige | `#F2EDC2` | Section backgrounds, CTA |

No gradients anywhere.

---

## File structure

```
├── index.html      # All three pages (landing, quiz, results)
├── style.css       # Design system + layout
├── script.js       # Questions, logic, scoring
└── README.md
```

---

## Running it

No setup needed. Clone the repo and open `index.html`.

```bash
git clone https://github.com/your-username/tedscreen.git
cd tedscreen
open index.html
```

---

## Disclaimer

This tool is for informational and screening purposes only. It does not constitute medical advice or a clinical diagnosis. Always consult a qualified ophthalmologist or endocrinologist.
