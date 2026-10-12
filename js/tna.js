/* ============================================================
   TNA.JS — Mathematics Version
   Self-assessment + Gap Analysis (10 Math domains)
   ============================================================ */

const TNA_SECTIONS = ['a', 'b', 'c', 'd', 'e', 'f'];

function updateTNASummary() {
  const vals = TNA_SECTIONS.map(s => num('tna-' + s)).filter(v => v > 0);
  const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
  const converted = (avg / 5) * 4;

  document.getElementById('tna-avg').textContent = avg.toFixed(2);
  document.getElementById('tna-converted').textContent = converted.toFixed(2);
}

function saveTNA() {
  const name = document.getElementById('tna-teacher').value.trim();
  if (!name) { alert('Please enter the teacher name.'); return; }

  const sections = {};
  TNA_SECTIONS.forEach(s => sections[s] = num('tna-' + s));

  const vals = Object.values(sections).filter(v => v > 0);
  const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;

  upsertTeacher({
    name: name,
    employeeId: document.getElementById('tna-empid').value.trim(),
    gradeBand: document.getElementById('tna-band').value,
    tnaDate: document.getElementById('tna-date').value,
    tna: {
      sections: sections,
      average: parseFloat(avg.toFixed(2)),
      converted: parseFloat(((avg / 5) * 4).toFixed(2))
    }
  });

  setStatus('TNA saved for ' + name);
  alert('✅ TNA self-assessment saved for ' + name);
}

function clearTNAForm() {
  if (!confirm('Clear all TNA inputs?')) return;
  ['tna-teacher','tna-empid','tna-date','tna-a','tna-b','tna-c','tna-d','tna-e','tna-f']
    .forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  document.getElementById('tna-band').value = '1-5';
  updateTNASummary();
}

function loadTNAForTeacher(teacher) {
  if (!teacher || !teacher.tna) return;
  const t = teacher.tna;
  document.getElementById('tna-teacher').value = teacher.name || '';
  document.getElementById('tna-empid').value = teacher.employeeId || '';
  document.getElementById('tna-band').value = teacher.gradeBand || '1-5';
  document.getElementById('tna-date').value = teacher.tnaDate || '';
  TNA_SECTIONS.forEach(s => {
    document.getElementById('tna-' + s).value = t.sections[s] || '';
  });
  updateTNASummary();
}

/* ============================================================
   GAP ANALYSIS ENGINE — 10 Mathematics Domains
   ============================================================ */

const TNA_DOMAINS = [
  { key: 'contentKnowledge',   label: 'Mathematical Content Knowledge' },
  { key: 'numberOps',          label: 'Number & Operations' },
  { key: 'fractionsDecimals',  label: 'Fractions, Decimals & Percentages' },
  { key: 'ratioAlgebraGeo',    label: 'Ratio, Algebra & Geometry' },
  { key: 'pck',                label: 'Pedagogical Content Knowledge' },
  { key: 'assessment',         label: 'Assessment Literacy' },
  { key: 'classroomMgmt',      label: 'Classroom Management' },
  { key: 'materials',          label: 'Materials & Resources' },
  { key: 'inclusion',          label: 'Inclusive Teaching & Differentiation' },
  { key: 'engagement',         label: 'Student Engagement & Learning Outcomes' }
];

/* Domain extraction: for a given teacher record, get current average (1-4 scale) */
function computeDomainScores(teacher) {
  const out = {};
  const obs = teacher.observation ? teacher.observation.domainScores : null;
  const test = teacher.test || null;
  const tna = teacher.tna || null;

  const norm = (val, max) => (max > 0 && val != null) ? (val / max) * 4 : null;
  const avg = (arr) => {
    const v = arr.filter(x => x != null);
    return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null;
  };

  // 1. Mathematical Content Knowledge — TNA.A, Test Section A+B, Obs Domain 2
  out.contentKnowledge = avg([
    tna ? tna.sections.a : null,
    test ? norm(test.partA + test.partB, 20) : null,
    obs ? norm(obs.d2, obs.d2_max) : null
  ]);

  // 2. Number & Operations — TNA.A + Test A1,2 + Obs Domain 1
  out.numberOps = avg([
    tna ? tna.sections.a : null,
    test && test.subs ? norm(test.subs.a1 + test.subs.a2, 2) : null,
    obs ? norm(obs.d1, obs.d1_max) : null
  ]);

  // 3. Fractions, Decimals & Percentages — TNA.A + Test A3 + Obs Domain 2
  out.fractionsDecimals = avg([
    tna ? tna.sections.a : null,
    test && test.subs ? norm(test.subs.a3, 1) : null,
    obs ? norm(obs.d2, obs.d2_max) : null
  ]);

  // 4. Ratio, Algebra & Geometry — TNA.A + Test A4-A9 + Obs Domain 5
  out.ratioAlgebraGeo = avg([
    tna ? tna.sections.a : null,
    test && test.subs ? norm((test.subs.a4 + test.subs.a5 + test.subs.a6 + test.subs.a7 + test.subs.a8 + test.subs.a9), 6) : null,
    obs ? norm(obs.d5, obs.d5_max) : null
  ]);

  // 5. Pedagogical Content Knowledge — TNA.B + Test Section C + Obs Domain 3
  out.pck = avg([
    tna ? tna.sections.b : null,
    test ? norm(test.partC, 20) : null,
    obs ? norm(obs.d3, obs.d3_max) : null
  ]);

  // 6. Assessment Literacy — TNA.C + Test A10 + Obs Domain 6
  out.assessment = avg([
    tna ? tna.sections.c : null,
    test && test.subs ? norm(test.subs.a10, 1) : null,
    obs ? norm(obs.d6, obs.d6_max) : null
  ]);

  // 7. Classroom Management — TNA.D + Obs Domain 8
  out.classroomMgmt = avg([
    tna ? tna.sections.d : null,
    obs ? norm(obs.d8, obs.d8_max) : null
  ]);

  // 8. Materials & Resources — TNA.E + Obs Domain 10
  out.materials = avg([
    tna ? tna.sections.e : null,
    obs ? norm(obs.d10, obs.d10_max) : null
  ]);

  // 9. Inclusive Teaching & Differentiation — TNA.F + Obs Domain 7
  out.inclusion = avg([
    tna ? tna.sections.f : null,
    obs ? norm(obs.d7, obs.d7_max) : null
  ]);

  // 10. Student Engagement & Learning Outcomes — Obs Domain 4 + Domain 12
  out.engagement = avg([
    obs ? norm(obs.d4, obs.d4_max) : null,
    obs ? norm(obs.d12, obs.d12_max) : null
  ]);

  return out;
}

/* Priority from current score (1-4 scale) */
function priorityFromScore(score) {
  if (score == null) return { code: '—', label: 'No Data', className: '' };
  if (score < 2.5) return { code: 'H', label: 'High',   className: 'ineffective' };
  if (score < 3.5) return { code: 'M', label: 'Medium', className: 'developing' };
  return { code: 'L', label: 'Low', className: 'exemplary' };
}

/* Group-wide domain averages */
function computeGroupDomainAverages() {
  const teachers = getAllTeachers();
  const totals = {}, counts = {};

  TNA_DOMAINS.forEach(d => { totals[d.key] = 0; counts[d.key] = 0; });

  teachers.forEach(t => {
    const scores = computeDomainScores(t);
    TNA_DOMAINS.forEach(d => {
      if (scores[d.key] != null) {
        totals[d.key] += scores[d.key];
        counts[d.key]++;
      }
    });
  });

  const result = {};
  TNA_DOMAINS.forEach(d => {
    result[d.key] = counts[d.key] ? totals[d.key] / counts[d.key] : null;
  });
  return result;
}

/* Top N priority domains */
function getTopPriorities(n) {
  n = n || 5;
  const avgs = computeGroupDomainAverages();
  const list = TNA_DOMAINS
    .map(d => ({ ...d, current: avgs[d.key] }))
    .filter(d => d.current != null)
    .sort((a, b) => a.current - b.current);
  return list.slice(0, n);
}
