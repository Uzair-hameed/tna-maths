/* ============================================================
   OBSERVATION.JS — Mathematics Version
   13 domains, 66 indicators, live scoring
   ============================================================ */

const OBSERVATION_DOMAINS = [
  {
    id: 1, name: 'Lesson Planning & Preparation', max: 20,
    indicators: [
      { code: '1.1', text: 'SLO/objective is clear and aligned with lesson activities.' },
      { code: '1.2', text: 'Lesson materials/resources are prepared.' },
      { code: '1.3', text: 'Prior learning is identified/activated.' },
      { code: '1.4', text: 'Lesson stages are logically sequenced.' },
      { code: '1.5', text: 'Assessment opportunities are planned.' }
    ]
  },
  {
    id: 2, name: 'Subject Knowledge & Command', max: 20,
    indicators: [
      { code: '2.1', text: 'Mathematical content is accurate.' },
      { code: '2.2', text: 'Teacher explains concepts clearly.' },
      { code: '2.3', text: 'Teacher links procedures to concepts/meaning.' },
      { code: '2.4', text: 'Teacher identifies/responds to misconceptions.' },
      { code: '2.5', text: 'Teacher demonstrates confidence and mathematical reasoning.' }
    ]
  },
  {
    id: 3, name: 'Instructional Delivery', max: 28,
    indicators: [
      { code: '3.1', text: 'Warm-up is purposeful.' },
      { code: '3.2', text: 'Motivation is meaningful.' },
      { code: '3.3', text: 'Presentation is clear and logically sequenced.' },
      { code: '3.4', text: 'Teacher modelling is appropriate.' },
      { code: '3.5', text: 'Guided practice is provided.' },
      { code: '3.6', text: 'Independent production/application is provided.' },
      { code: '3.7', text: 'Lesson concludes with consolidation.' }
    ]
  },
  {
    id: 4, name: "Students' Engagement", max: 20,
    indicators: [
      { code: '4.1', text: 'Learners actively participate.' },
      { code: '4.2', text: 'Learners explain mathematical thinking.' },
      { code: '4.3', text: 'Learners work collaboratively where appropriate.' },
      { code: '4.4', text: 'Learners use materials/resources.' },
      { code: '4.5', text: 'Learners remain engaged in meaningful mathematical tasks.' }
    ]
  },
  {
    id: 5, name: 'Teaching Methods & Strategies', max: 24,
    indicators: [
      { code: '5.1', text: 'Uses appropriate teaching methods for the topic.' },
      { code: '5.2', text: 'Uses concrete/pictorial/abstract representations where appropriate.' },
      { code: '5.3', text: 'Uses multiple solution strategies.' },
      { code: '5.4', text: 'Uses real-life applications.' },
      { code: '5.5', text: 'Uses problem solving and reasoning.' },
      { code: '5.6', text: 'Uses error analysis/misconceptions as learning opportunities.' }
    ]
  },
  {
    id: 6, name: 'Assessment & Feedback', max: 24,
    indicators: [
      { code: '6.1', text: 'Checks prior knowledge.' },
      { code: '6.2', text: 'Uses formative questioning.' },
      { code: '6.3', text: 'Checks understanding during activities.' },
      { code: '6.4', text: 'Gives constructive feedback.' },
      { code: '6.5', text: 'Adjusts instruction based on learner responses.' },
      { code: '6.6', text: 'Uses appropriate summative/exit assessment evidence.' }
    ]
  },
  {
    id: 7, name: 'Differentiation & Inclusion', max: 28,
    indicators: [
      { code: '7.1', text: 'Supports learners needing additional help.' },
      { code: '7.2', text: 'Provides grade-level challenge.' },
      { code: '7.3', text: 'Provides extension/enrichment.' },
      { code: '7.4', text: 'Uses multiple access modes.' },
      { code: '7.5', text: 'Adapts for visual impairment where needed.' },
      { code: '7.6', text: 'Adapts for hearing impairment where needed.' },
      { code: '7.7', text: 'Uses appropriate strategies for attention difficulties/ADHD.' }
    ]
  },
  {
    id: 8, name: 'Classroom Management', max: 24,
    indicators: [
      { code: '8.1', text: 'Clear routines and expectations.' },
      { code: '8.2', text: 'Effective time and transition management.' },
      { code: '8.3', text: 'Handles incorrect responses respectfully.' },
      { code: '8.4', text: 'Manages group/pair activities effectively.' },
      { code: '8.5', text: 'Maintains learner attention.' },
      { code: '8.6', text: 'Responds appropriately to critical incidents.' }
    ]
  },
  {
    id: 9, name: 'Learning Environment', max: 16,
    indicators: [
      { code: '9.1', text: 'Classroom is respectful and psychologically safe.' },
      { code: '9.2', text: 'Learners feel safe to make mistakes.' },
      { code: '9.3', text: 'Teacher encourages questions.' },
      { code: '9.4', text: 'Classroom climate supports collaboration and mathematical discussion.' }
    ]
  },
  {
    id: 10, name: 'Use of Resources & Material', max: 20,
    indicators: [
      { code: '10.1', text: 'Resources are aligned with objectives.' },
      { code: '10.2', text: 'Resources are accurate and appropriate.' },
      { code: '10.3', text: 'Manipulatives/models are used effectively.' },
      { code: '10.4', text: 'Low-cost/local resources are used where useful.' },
      { code: '10.5', text: 'Technology is used purposefully where available.' }
    ]
  },
  {
    id: 11, name: 'Teacher Language & Communication', max: 20,
    indicators: [
      { code: '11.1', text: 'Instructions are clear and concise.' },
      { code: '11.2', text: 'Mathematical language is accurate.' },
      { code: '11.3', text: 'Teacher uses understandable language for learners.' },
      { code: '11.4', text: 'Teacher checks comprehension.' },
      { code: '11.5', text: 'Teacher communicates respectfully and positively.' }
    ]
  },
  {
    id: 12, name: "Students' Learning Outcomes", max: 20,
    indicators: [
      { code: '12.1', text: 'Learners demonstrate progress toward the stated SLO.' },
      { code: '12.2', text: 'Learners can explain what they are learning.' },
      { code: '12.3', text: 'Learners demonstrate conceptual understanding.' },
      { code: '12.4', text: 'Learners apply learning to tasks/problems.' },
      { code: '12.5', text: 'Evidence indicates the lesson objectives are being achieved.' }
    ]
  }
];

const OBSERVATION_TOTAL_MAX = 264;

/* ---------- Live Score State ---------- */
let observationScores = {};

/* ---------- Build the Form UI ---------- */
function renderObservationForm() {
  const container = document.getElementById('observation-domains');
  if (!container) return;
  container.innerHTML = '';

  OBSERVATION_DOMAINS.forEach(domain => {
    const block = document.createElement('div');
    block.className = 'domain-block';

    let rowsHTML = '';
    domain.indicators.forEach(ind => {
      rowsHTML += `
        <div class="indicator-row" data-code="${ind.code}">
          <div class="indicator-num">${ind.code}</div>
          <div class="indicator-text">${ind.text}</div>
          <div class="score-buttons">
            <button class="score-btn" data-score="1">1</button>
            <button class="score-btn" data-score="2">2</button>
            <button class="score-btn" data-score="3">3</button>
            <button class="score-btn" data-score="4">4</button>
            <button class="score-btn na-btn" data-score="NA">NA</button>
          </div>
          <div class="indicator-points" data-points="${ind.code}">0</div>
        </div>`;
    });

    block.innerHTML = `
      <div class="domain-header">
        <span>Domain ${domain.id}: ${domain.name}</span>
        <span class="domain-max">Max: ${domain.max}</span>
      </div>
      ${rowsHTML}
      <div class="domain-footer">
        <span>Domain Score:</span>
        <span data-domain-score="${domain.id}">0 / ${domain.max}</span>
      </div>
    `;
    container.appendChild(block);
  });

  attachScoreHandlers();
  updateObservationSummary();
}

/* ---------- Score Button Clicks ---------- */
function attachScoreHandlers() {
  document.querySelectorAll('.indicator-row').forEach(row => {
    const code = row.dataset.code;
    row.querySelectorAll('.score-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const score = btn.dataset.score;
        if (observationScores[code] == score) {
          delete observationScores[code];
        } else {
          observationScores[code] = score;
        }
        refreshRowUI(code);
        updateObservationSummary();
      });
    });
  });
}

function refreshRowUI(code) {
  const row = document.querySelector(`.indicator-row[data-code="${code}"]`);
  if (!row) return;
  const val = observationScores[code];

  row.querySelectorAll('.score-btn').forEach(btn => {
    btn.classList.remove('selected-1','selected-2','selected-3','selected-4','selected-NA');
    if (btn.dataset.score == val) {
      btn.classList.add('selected-' + val);
    }
  });

  const points = (val === undefined || val === 'NA') ? 0 : parseInt(val);
  row.querySelector('.indicator-points').textContent = points;
}

/* ---------- Live Total Calculation ---------- */
function updateObservationSummary() {
  let totalPoints = 0;

  OBSERVATION_DOMAINS.forEach(domain => {
    let domainPoints = 0;
    domain.indicators.forEach(ind => {
      const v = observationScores[ind.code];
      if (v !== undefined && v !== 'NA') domainPoints += parseInt(v);
    });
    const domainEl = document.querySelector(`[data-domain-score="${domain.id}"]`);
    if (domainEl) domainEl.textContent = domainPoints + ' / ' + domain.max;
    totalPoints += domainPoints;
  });

  const pct = (totalPoints / OBSERVATION_TOTAL_MAX) * 100;
  const settings = getSettings();
  const rating = getRatingLabel(pct, settings);

  document.getElementById('obs-total').textContent = totalPoints;
  document.getElementById('obs-percent').textContent = pct.toFixed(1) + '%';

  const badge = document.getElementById('obs-rating');
  badge.textContent = rating.label;
  badge.className = 'rating-badge ' + rating.className;
}

function getRatingLabel(pct, settings) {
  const s = settings || getSettings();
  if (pct >= s.exemplary) return { label: 'Highly Effective', className: 'exemplary' };
  if (pct >= s.proficient) return { label: 'Effective', className: 'proficient' };
  if (pct >= s.developing) return { label: 'Developing', className: 'developing' };
  return { label: 'Priority Support Needed', className: 'ineffective' };
}

/* ---------- Save Observation ---------- */
function saveObservation() {
  const name = document.getElementById('obs-teacher').value.trim();
  if (!name) { alert('Please enter the teacher name.'); return; }

  const totalPoints = Object.values(observationScores)
    .filter(v => v !== 'NA')
    .reduce((a, b) => a + parseInt(b), 0);

  const domainScores = {};
  OBSERVATION_DOMAINS.forEach(d => {
    let pts = 0;
    d.indicators.forEach(ind => {
      const v = observationScores[ind.code];
      if (v !== undefined && v !== 'NA') pts += parseInt(v);
    });
    domainScores['d' + d.id] = pts;
    domainScores['d' + d.id + '_max'] = d.max;
  });

  upsertTeacher({
    name: name,
    grade: document.getElementById('obs-grade').value.trim(),
    section: document.getElementById('obs-section').value.trim(),
    students: document.getElementById('obs-students').value.trim(),
    topic: document.getElementById('obs-topic').value.trim(),
    observer: document.getElementById('obs-observer').value.trim(),
    observationDate: document.getElementById('obs-date').value,
    timeIn: document.getElementById('obs-timein').value,
    timeOut: document.getElementById('obs-timeout').value,
    observation: {
      scores: { ...observationScores },
      domainScores: domainScores,
      totalPoints: totalPoints,
      maxPoints: OBSERVATION_TOTAL_MAX,
      percentage: parseFloat(((totalPoints / OBSERVATION_TOTAL_MAX) * 100).toFixed(2))
    }
  });

  setStatus('Observation saved for ' + name);
  alert('✅ Observation saved for ' + name);
}

/* ---------- Clear Form ---------- */
function clearObservationForm() {
  if (!confirm('Clear all observation inputs?')) return;
  observationScores = {};
  document.querySelectorAll('.indicator-row').forEach(row => {
    row.querySelectorAll('.score-btn').forEach(b => 
      b.classList.remove('selected-1','selected-2','selected-3','selected-4','selected-NA'));
    row.querySelector('.indicator-points').textContent = '0';
  });
  ['obs-teacher','obs-grade','obs-section','obs-students','obs-topic','obs-observer',
   'obs-date','obs-timein','obs-timeout'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  updateObservationSummary();
}

/* ---------- Load Existing for Editing ---------- */
function loadObservationForTeacher(teacher) {
  if (!teacher || !teacher.observation) return;
  observationScores = { ...teacher.observation.scores };
  document.getElementById('obs-teacher').value = teacher.name || '';
  document.getElementById('obs-grade').value = teacher.grade || '';
  document.getElementById('obs-section').value = teacher.section || '';
  document.getElementById('obs-students').value = teacher.students || '';
  document.getElementById('obs-topic').value = teacher.topic || '';
  document.getElementById('obs-observer').value = teacher.observer || '';
  document.getElementById('obs-date').value = teacher.observationDate || '';
  document.getElementById('obs-timein').value = teacher.timeIn || '';
  document.getElementById('obs-timeout').value = teacher.timeOut || '';

  Object.keys(observationScores).forEach(code => refreshRowUI(code));
  updateObservationSummary();
}

/* ---------- Helper ---------- */
function setStatus(msg) {
  const badge = document.getElementById('save-status');
  if (badge) {
    badge.textContent = msg;
    setTimeout(updateBackupStatus, 2000);
  }
}
