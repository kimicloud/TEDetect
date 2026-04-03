/* ══════════════════════════════════════
   TED SCREEN — script.js
   Questionnaire logic & scoring engine
   ══════════════════════════════════════ */

'use strict';

/* ──────────────────────────────────────
   QUESTION BANK (20 questions)
   Types: radio | yesno | slider | multi
   Each has a weight & category for scoring
   ────────────────────────────────────── */
const QUESTIONS = [
  {
    id: 1,
    category: 'Medical History',
    text: 'Have you been diagnosed with a thyroid disorder?',
    hint: 'Include Graves\' disease, Hashimoto\'s, hyperthyroidism, or hypothyroidism.',
    type: 'radio',
    options: [
      { label: 'Yes — Graves\' disease',           value: 3 },
      { label: 'Yes — another thyroid condition', value: 2 },
      { label: 'Suspected but undiagnosed',        value: 1 },
      { label: 'No thyroid condition',             value: 0 },
    ],
  },
  {
    id: 2,
    category: 'Medical History',
    text: 'Are you currently receiving treatment for a thyroid disorder?',
    hint: 'Include medication, radioactive iodine therapy, or surgery.',
    type: 'yesno',
    yesWeight: 2,
    noWeight: 0,
  },
  {
    id: 3,
    category: 'Eye Symptoms',
    text: 'Do you notice that your eyes appear more prominent or "bulging" than before?',
    hint: 'This is known as proptosis or exophthalmos — a hallmark sign of TED.',
    type: 'radio',
    options: [
      { label: 'Yes — clearly noticeable',  value: 4 },
      { label: 'Yes — subtle change',       value: 2 },
      { label: 'Unsure / others noticed',   value: 1 },
      { label: 'No change',                 value: 0 },
    ],
  },
  {
    id: 4,
    category: 'Eye Symptoms',
    text: 'Do you experience dryness, grittiness, or a "foreign body" sensation in your eyes?',
    hint: 'These symptoms are common when eyelids don\'t close completely.',
    type: 'radio',
    options: [
      { label: 'Yes — frequently (daily)',   value: 3 },
      { label: 'Yes — occasionally',         value: 1 },
      { label: 'Rarely',                     value: 0.5 },
      { label: 'Never',                      value: 0 },
    ],
  },
  {
    id: 5,
    category: 'Eye Symptoms',
    text: 'Do you have excessive tearing or watering eyes?',
    type: 'yesno',
    yesWeight: 1.5,
    noWeight: 0,
  },
  {
    id: 6,
    category: 'Eye Appearance',
    text: 'Have you or anyone else noticed that your upper eyelids appear retracted (higher than normal)?',
    hint: 'Lid retraction can expose more of the white of the eye.',
    type: 'radio',
    options: [
      { label: 'Yes — clearly visible',   value: 3 },
      { label: 'Possibly — subtle change', value: 1.5 },
      { label: 'Not sure',                 value: 0.5 },
      { label: 'No',                       value: 0 },
    ],
  },
  {
    id: 7,
    category: 'Eye Appearance',
    text: 'Do you notice puffiness or swelling around your eyelids, especially in the morning?',
    type: 'radio',
    options: [
      { label: 'Yes — significant puffiness',  value: 2.5 },
      { label: 'Yes — mild puffiness',         value: 1 },
      { label: 'Occasionally',                 value: 0.5 },
      { label: 'No',                           value: 0 },
    ],
  },
  {
    id: 8,
    category: 'Visual Function',
    text: 'Do you experience double vision (diplopia) in any direction of gaze?',
    hint: 'This may be caused by inflammation of the eye muscles.',
    type: 'radio',
    options: [
      { label: 'Yes — constant',                  value: 4 },
      { label: 'Yes — intermittent',              value: 2.5 },
      { label: 'Only in extreme gaze positions',  value: 1 },
      { label: 'No double vision',                value: 0 },
    ],
  },
  {
    id: 9,
    category: 'Visual Function',
    text: 'Have you noticed any blurring or reduction in your vision?',
    hint: 'Optic nerve compression in TED can affect visual acuity.',
    type: 'yesno',
    yesWeight: 3,
    noWeight: 0,
  },
  {
    id: 10,
    category: 'Visual Function',
    text: 'Do colours appear less vivid or washed out in one or both eyes?',
    type: 'yesno',
    yesWeight: 3,
    noWeight: 0,
  },
  {
    id: 11,
    category: 'Pain & Discomfort',
    text: 'On a scale of 0–10, how would you rate the pain or pressure behind your eyes?',
    hint: '0 = no pain at all, 10 = severe, constant pain.',
    type: 'slider',
    min: 0,
    max: 10,
    step: 1,
    minLabel: 'No pain',
    maxLabel: 'Severe pain',
    weightFn: (v) => v * 0.4,
  },
  {
    id: 12,
    category: 'Pain & Discomfort',
    text: 'Does eye pain worsen when you look to the sides, up, or down?',
    hint: 'Pain with movement may suggest extraocular muscle involvement.',
    type: 'radio',
    options: [
      { label: 'Yes — clearly worse with movement',   value: 3 },
      { label: 'Slightly worse with movement',        value: 1.5 },
      { label: 'No — same regardless of direction',  value: 0 },
    ],
  },
  {
    id: 13,
    category: 'Light & Vision',
    text: 'Do you experience increased sensitivity to light (photophobia)?',
    type: 'radio',
    options: [
      { label: 'Yes — severe sensitivity',    value: 2 },
      { label: 'Yes — mild sensitivity',      value: 1 },
      { label: 'Occasionally',               value: 0.5 },
      { label: 'No',                          value: 0 },
    ],
  },
  {
    id: 14,
    category: 'Light & Vision',
    text: 'Do you notice any pulsating or throbbing sensation behind or around your eyes?',
    type: 'yesno',
    yesWeight: 1.5,
    noWeight: 0,
  },
  {
    id: 15,
    category: 'Lifestyle Impact',
    text: 'On a scale of 0–10, how much do your eye symptoms affect your daily activities?',
    hint: '0 = no impact, 10 = severely limiting daily life.',
    type: 'slider',
    min: 0,
    max: 10,
    step: 1,
    minLabel: 'No impact',
    maxLabel: 'Severely limiting',
    weightFn: (v) => v * 0.25,
  },
  {
    id: 16,
    category: 'Lifestyle Impact',
    text: 'Do your eye symptoms affect your ability to drive, read, or use screens?',
    type: 'radio',
    options: [
      { label: 'Yes — severely',      value: 2.5 },
      { label: 'Yes — moderately',    value: 1.5 },
      { label: 'Yes — mildly',        value: 0.5 },
      { label: 'No',                  value: 0 },
    ],
  },
  {
    id: 17,
    category: 'Symptom Duration',
    text: 'How long have you been experiencing these eye symptoms?',
    type: 'radio',
    options: [
      { label: 'More than 2 years',    value: 1 },
      { label: '6 months – 2 years',   value: 2.5 },
      { label: '1 – 6 months',         value: 3 },
      { label: 'Less than 1 month',    value: 1.5 },
      { label: 'No symptoms',          value: 0 },
    ],
  },
  {
    id: 18,
    category: 'Associated Symptoms',
    text: 'Do you experience any of the following general symptoms? (Select all that apply)',
    hint: 'These may indicate active thyroid disease.',
    type: 'multi',
    options: [
      { label: 'Unexplained weight changes', value: 0.5 },
      { label: 'Heart palpitations',         value: 0.5 },
      { label: 'Excessive sweating',         value: 0.5 },
      { label: 'Tremors or shakiness',        value: 0.5 },
      { label: 'Fatigue / weakness',          value: 0.5 },
      { label: 'None of the above',           value: 0 },
    ],
  },
  {
    id: 19,
    category: 'Family & Risk Factors',
    text: 'Do you have a family history of thyroid disease or autoimmune conditions?',
    type: 'radio',
    options: [
      { label: 'Yes — multiple relatives',  value: 2 },
      { label: 'Yes — one relative',        value: 1 },
      { label: 'Not sure',                  value: 0.5 },
      { label: 'No',                        value: 0 },
    ],
  },
  {
    id: 20,
    category: 'Risk Factors',
    text: 'Do you currently smoke or have you smoked in the past 5 years?',
    hint: 'Smoking significantly increases the risk and severity of TED.',
    type: 'radio',
    options: [
      { label: 'Yes — currently smoke',       value: 3 },
      { label: 'Quit within last 5 years',    value: 1.5 },
      { label: 'Quit more than 5 years ago',  value: 0.5 },
      { label: 'Never smoked',                value: 0 },
    ],
  },
];

/* ──────────────────────────────────────
   MAX POSSIBLE SCORE (for normalisation)
   ────────────────────────────────────── */
const MAX_RAW = 3 + 2 + 4 + 3 + 1.5 + 3 + 2.5 + 4 + 3 + 3 + 4 + 3 + 2 + 1.5 + 2.5 + 2.5 + 3 + 2.5 + 2 + 3;
// = ~54. We'll normalise to 100.

/* ──────────────────────────────────────
   STATE
   ────────────────────────────────────── */
let currentQ     = 0;
let answers      = new Array(QUESTIONS.length).fill(null);
let answered     = new Array(QUESTIONS.length).fill(false);

/* ──────────────────────────────────────
   DOM REFS
   ────────────────────────────────────── */
const pageLanding  = document.getElementById('page-landing');
const pageQuiz     = document.getElementById('page-quiz');
const pageResults  = document.getElementById('page-results');
const quizStage    = document.getElementById('quiz-stage');
const progressBar  = document.getElementById('progress-bar');
const progressPct  = document.getElementById('progress-pct');
const questionCounter = document.getElementById('question-counter');
const btnNext      = document.getElementById('btn-next');
const btnPrev      = document.getElementById('btn-prev');
const quizDots     = document.getElementById('quiz-dots');

/* ──────────────────────────────────────
   PAGE NAVIGATION
   ────────────────────────────────────── */
function showPage(pageEl) {
  [pageLanding, pageQuiz, pageResults].forEach(p => {
    p.classList.remove('active', 'fade-in');
  });
  pageEl.classList.add('active');
  // Force scroll to absolute top
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  requestAnimationFrame(() => pageEl.classList.add('fade-in'));
}

document.getElementById('btn-start').addEventListener('click', () => {
  currentQ = 0;
  answers  = new Array(QUESTIONS.length).fill(null);
  answered = new Array(QUESTIONS.length).fill(false);
  renderDots();
  renderQuestion(0);
  showPage(pageQuiz);
});

document.getElementById('btn-back-to-landing').addEventListener('click', () => {
  showPage(pageLanding);
});

document.getElementById('btn-retake').addEventListener('click', () => {
  showPage(pageLanding);
});

document.getElementById('btn-retake-bottom').addEventListener('click', () => {
  showPage(pageLanding);
});

/* ──────────────────────────────────────
   QUESTION RENDERING
   ────────────────────────────────────── */
function renderQuestion(index, direction = 'forward') {
  const q = QUESTIONS[index];

  // Update progress
  const pct = Math.round((index / QUESTIONS.length) * 100);
  progressBar.style.width = pct + '%';
  progressPct.textContent = pct + '% complete';
  questionCounter.textContent = `Question ${index + 1} of ${QUESTIONS.length}`;

  // Update nav buttons
  btnPrev.disabled = index === 0;
  updateNextBtn(index);

  // Build HTML
  let inputHTML = '';

  if (q.type === 'radio') {
    inputHTML = `<div class="options-grid">` +
      q.options.map((opt, i) => {
        const sel = answers[index] === i ? 'selected' : '';
        return `<label class="option-label ${sel}" data-index="${i}">
          <input type="radio" name="q${q.id}" value="${i}" ${answers[index] === i ? 'checked' : ''}>
          <span class="option-check"></span>
          ${opt.label}
        </label>`;
      }).join('') +
      `</div>`;

  } else if (q.type === 'yesno') {
    const savedAns = answers[index];
    inputHTML = `<div class="yesno-wrap">
      <label class="yesno-label yesno-yes ${savedAns === 'yes' ? 'selected' : ''}" data-val="yes">
        <input type="radio" name="q${q.id}" value="yes" ${savedAns === 'yes' ? 'checked' : ''}>
        <span class="yesno-icon">✓</span>
        Yes
      </label>
      <label class="yesno-label yesno-no ${savedAns === 'no' ? 'selected' : ''}" data-val="no">
        <input type="radio" name="q${q.id}" value="no" ${savedAns === 'no' ? 'checked' : ''}>
        <span class="yesno-icon">✗</span>
        No
      </label>
    </div>`;

  } else if (q.type === 'slider') {
    const savedVal = answers[index] !== null ? answers[index] : q.min;
    inputHTML = `<div class="slider-wrap">
      <div class="slider-row">
        <input type="range" id="slider-${q.id}" min="${q.min}" max="${q.max}" step="${q.step}" value="${savedVal}">
        <div class="slider-value" id="slider-val-${q.id}">${savedVal}</div>
      </div>
      <div class="slider-labels">
        <span>${q.minLabel}</span>
        <span>${q.maxLabel}</span>
      </div>
    </div>`;

  } else if (q.type === 'multi') {
    const savedArr = Array.isArray(answers[index]) ? answers[index] : [];
    inputHTML = `<div class="multi-options">` +
      q.options.map((opt, i) => {
        const sel = savedArr.includes(i) ? 'selected' : '';
        return `<label class="multi-label ${sel}" data-index="${i}">
          <input type="checkbox" value="${i}" ${savedArr.includes(i) ? 'checked' : ''}>
          ${opt.label}
        </label>`;
      }).join('') +
      `</div>`;
  }

  const hintHTML = q.hint ? `<div class="question-hint">${q.hint}</div>` : '';

  const slide = document.createElement('div');
  slide.className = 'question-slide';
  slide.innerHTML = `
    <div class="question-category">${q.category}</div>
    <div class="question-text">${q.text}</div>
    ${hintHTML}
    ${inputHTML}
  `;

  // Animate out old, animate in new
  const old = quizStage.querySelector('.question-slide');
  if (old) {
    old.classList.add('slide-out');
    old.addEventListener('animationend', () => old.remove(), { once: true });
  }

  setTimeout(() => {
    quizStage.appendChild(slide);
    attachInputListeners(slide, q, index);
  }, old ? 200 : 0);

  updateDots(index);
}

/* ──────────────────────────────────────
   INPUT LISTENERS
   ────────────────────────────────────── */
function attachInputListeners(slide, q, index) {

  if (q.type === 'radio') {
    // Use change on the hidden radio inputs for reliability
    slide.querySelectorAll('.option-label').forEach(label => {
      const radio = label.querySelector('input[type="radio"]');

      label.addEventListener('click', (e) => {
        e.preventDefault();
        // Manually check the radio
        slide.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
        radio.checked = true;
        // Update visual
        slide.querySelectorAll('.option-label').forEach(l => l.classList.remove('selected'));
        label.classList.add('selected');
        // Save answer
        answers[index] = parseInt(label.dataset.index);
        answered[index] = true;
        updateNextBtn(index);
        updateDots(index);
      });
    });

  } else if (q.type === 'yesno') {
    slide.querySelectorAll('.yesno-label').forEach(label => {
      label.addEventListener('click', (e) => {
        e.preventDefault();
        slide.querySelectorAll('.yesno-label').forEach(l => l.classList.remove('selected'));
        label.classList.add('selected');
        answers[index] = label.dataset.val;
        answered[index] = true;
        updateNextBtn(index);
        updateDots(index);
      });
    });

  } else if (q.type === 'slider') {
    const slider    = slide.querySelector(`#slider-${q.id}`);
    const sliderVal = slide.querySelector(`#slider-val-${q.id}`);

    if (answers[index] === null) answers[index] = q.min;
    answered[index] = true;
    updateNextBtn(index);

    slider.addEventListener('input', () => {
      const v = parseInt(slider.value);
      sliderVal.textContent = v;
      answers[index] = v;
    });

  } else if (q.type === 'multi') {
    if (!Array.isArray(answers[index])) answers[index] = null; // null = unanswered
    // Multi is NOT auto-answered — user must pick at least one
    answered[index] = Array.isArray(answers[index]) && answers[index].length > 0;
    updateNextBtn(index);

    slide.querySelectorAll('.multi-label').forEach(label => {
      label.addEventListener('click', (e) => {
        // Prevent the checkbox inside from double-firing
        e.preventDefault();
        e.stopPropagation();

        if (!Array.isArray(answers[index])) answers[index] = [];

        const i = parseInt(label.dataset.index);
        const isNone = q.options[i] && q.options[i].label === 'None of the above';
        const noneIdx = q.options.findIndex(o => o.label === 'None of the above');

        if (isNone) {
          // Toggle "None" — if selecting None, clear everything else
          if (answers[index].includes(i)) {
            answers[index] = [];
          } else {
            answers[index] = [i];
          }
        } else {
          // Remove "None" from selection when picking a real option
          answers[index] = answers[index].filter(v => v !== noneIdx);

          const pos = answers[index].indexOf(i);
          if (pos === -1) {
            answers[index].push(i);
          } else {
            answers[index].splice(pos, 1);
          }
        }

        // Sync visual state for all labels
        slide.querySelectorAll('.multi-label').forEach((l, li) => {
          l.classList.toggle('selected', answers[index].includes(li));
        });

        // Mark answered only when at least one option selected
        answered[index] = answers[index].length > 0;
        updateNextBtn(index);
        updateDots(index);
      });
    });
  }
}

/* ──────────────────────────────────────
   NAVIGATION
   ────────────────────────────────────── */
function updateNextBtn(index) {
  const isLast  = index === QUESTIONS.length - 1;
  const isReady = answered[index];
  btnNext.disabled = !isReady;
  btnNext.innerHTML = isLast
    ? `View Results <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`
    : `Next <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`;
}

btnNext.addEventListener('click', () => {
  if (currentQ < QUESTIONS.length - 1) {
    currentQ++;
    renderQuestion(currentQ, 'forward');
  } else {
    showResults();
  }
});

btnPrev.addEventListener('click', () => {
  if (currentQ > 0) {
    currentQ--;
    renderQuestion(currentQ, 'back');
  }
});

/* ──────────────────────────────────────
   DOTS
   ────────────────────────────────────── */
function renderDots() {
  quizDots.innerHTML = QUESTIONS.map((_, i) =>
    `<div class="nav-dot-item" data-dot="${i}"></div>`
  ).join('');
}

function updateDots(current) {
  quizDots.querySelectorAll('.nav-dot-item').forEach((dot, i) => {
    dot.classList.remove('current', 'answered');
    if (i === current)       dot.classList.add('current');
    else if (answered[i])    dot.classList.add('answered');
  });
}

/* ──────────────────────────────────────
   SCORING ENGINE
   ────────────────────────────────────── */
function calculateScore() {
  let raw = 0;

  QUESTIONS.forEach((q, i) => {
    const ans = answers[i];
    if (ans === null || ans === undefined) return;

    if (q.type === 'radio') {
      const optIdx = typeof ans === 'number' ? ans : null;
      if (optIdx !== null && q.options[optIdx]) {
        raw += q.options[optIdx].value;
      }

    } else if (q.type === 'yesno') {
      raw += ans === 'yes' ? q.yesWeight : q.noWeight;

    } else if (q.type === 'slider') {
      raw += q.weightFn(typeof ans === 'number' ? ans : 0);

    } else if (q.type === 'multi') {
      if (Array.isArray(ans) && ans.length > 0) {
        ans.forEach(idx => {
          if (q.options[idx]) raw += q.options[idx].value;
        });
      }
    }
  });

  return Math.min(100, Math.round((raw / MAX_RAW) * 100));
}

function getBreakdown() {
  const categories = {};

  QUESTIONS.forEach((q, i) => {
    const cat = q.category;
    if (!categories[cat]) categories[cat] = { raw: 0, max: 0 };
    const ans = answers[i];

    let maxPossible = 0;
    let got = 0;

    if (q.type === 'radio') {
      maxPossible = Math.max(...q.options.map(o => o.value));
      if (ans !== null && ans !== undefined && q.options[ans]) got = q.options[ans].value;

    } else if (q.type === 'yesno') {
      maxPossible = q.yesWeight;
      got = ans === 'yes' ? q.yesWeight : 0;

    } else if (q.type === 'slider') {
      maxPossible = q.weightFn(q.max);
      got = q.weightFn(typeof ans === 'number' ? ans : 0);

    } else if (q.type === 'multi') {
      maxPossible = q.options.reduce((s, o) => s + o.value, 0);
      if (Array.isArray(ans)) {
        ans.forEach(idx => { if (q.options[idx]) got += q.options[idx].value; });
      }
    }

    categories[cat].raw += got;
    categories[cat].max += maxPossible;
  });

  return Object.entries(categories).map(([label, data]) => ({
    label,
    pct: data.max > 0 ? Math.round((data.raw / data.max) * 100) : 0,
  }));
}

/* ──────────────────────────────────────
   RESULTS PAGE
   ────────────────────────────────────── */
function showResults() {
  const score = calculateScore();
  const breakdown = getBreakdown();

  let level, levelClass, icon, message;

  if (score < 30) {
    level = 'Low Risk';
    levelClass = 'low';
    icon = '🟢';
    message = `<p>Your responses suggest a <strong>low likelihood</strong> of Thyroid Eye Disease at this time. Your symptom profile does not indicate significant markers associated with TED.</p>
    <p>However, if you have an existing thyroid condition or notice any changes in your vision or eye appearance, we recommend periodic check-ups with an ophthalmologist. Stay informed and monitor any new symptoms.</p>`;

  } else if (score < 60) {
    level = 'Moderate Risk';
    levelClass = 'moderate';
    icon = '🟡';
    message = `<p>Based on your responses, you show <strong>some indicators</strong> that may be consistent with Thyroid Eye Disease. Your symptom pattern warrants further investigation by a specialist.</p>
    <p>We strongly recommend scheduling an appointment with an ophthalmologist or endocrinologist who can perform a comprehensive clinical evaluation. Early assessment is key to preventing progression.</p>`;

  } else {
    level = 'High Risk';
    levelClass = 'high';
    icon = '🔴';
    message = `<p>Your responses indicate a <strong>higher likelihood</strong> of symptoms associated with Thyroid Eye Disease. Multiple indicators in your symptom profile align with known risk factors and clinical features of TED.</p>
    <p><strong>Please seek prompt medical advice.</strong> An ophthalmologist experienced in orbital disease should evaluate your condition as soon as possible. Early clinical intervention significantly improves outcomes.</p>`;
  }

  // Populate DOM
  document.getElementById('result-icon').className = `result-icon-wrap ${levelClass}`;
  document.getElementById('result-icon').textContent = icon;
  document.getElementById('result-level-badge').className = `result-level-badge ${levelClass}`;
  document.getElementById('result-level-badge').textContent = level;
  document.getElementById('result-message').innerHTML = `
    <p style="font-size:0.78rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:var(--text-muted);margin-bottom:14px;">Assessment Summary</p>
    ${message}
    <p style="margin-top:16px;font-size:0.88rem;font-style:italic;color:var(--text-muted);">Based on your responses, you may show signs associated with Thyroid Eye Disease. <strong>This is not a medical diagnosis.</strong></p>
  `;

  // Score number & arc
  const scoreNumEl = document.getElementById('score-number');
  const scoreArc   = document.getElementById('score-arc');
  const circumf    = 326.7;
  const arcColors  = { low: '#79AE6F', moderate: '#E67E22', high: '#C0392B' };

  scoreArc.style.stroke = arcColors[levelClass];

  let n = 0;
  const animateScore = setInterval(() => {
    n = Math.min(n + 2, score);
    scoreNumEl.textContent = n;
    scoreArc.style.strokeDashoffset = circumf - (circumf * n / 100);
    if (n >= score) clearInterval(animateScore);
  }, 20);

  // Breakdown bars
  const breakdownEl = document.getElementById('score-breakdown');
  breakdownEl.innerHTML = breakdown.map(b => `
    <div class="breakdown-row">
      <div class="breakdown-label">${b.label}</div>
      <div class="breakdown-bar-wrap">
        <div class="breakdown-bar" style="width:0%;background:${b.pct >= 60 ? '#C0392B' : b.pct >= 30 ? '#E67E22' : '#79AE6F'}"
             data-target="${b.pct}"></div>
      </div>
      <div class="breakdown-val">${b.pct}%</div>
    </div>
  `).join('');

  setTimeout(() => {
    breakdownEl.querySelectorAll('.breakdown-bar').forEach(bar => {
      bar.style.width = bar.dataset.target + '%';
    });
  }, 300);

  showPage(pageResults);
}

/* ──────────────────────────────────────
   INIT
   ────────────────────────────────────── */
renderDots();
