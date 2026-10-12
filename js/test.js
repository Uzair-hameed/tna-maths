/* ============================================================
   TEST.JS — Mathematics Teachers' Content & PCK Test
   Total: 40 marks
   Section A: 10 MCQs (1 mark each)
   Section B: 5 Short Answers (2 marks each)
   Section C: 5 PCK Scenarios (4 marks each)
   ============================================================ */

function updateTestSummary() {
  // Section A: 10 MCQs (1 mark each = 10)
  const a1 = num('test-a1'), a2 = num('test-a2'), a3 = num('test-a3'), a4 = num('test-a4'), a5 = num('test-a5');
  const a6 = num('test-a6'), a7 = num('test-a7'), a8 = num('test-a8'), a9 = num('test-a9'), a10 = num('test-a10');

  // Section B: 5 Short Answers (2 marks each = 10)
  const b1 = num('test-b1'), b2 = num('test-b2'), b3 = num('test-b3'), b4 = num('test-b4'), b5 = num('test-b5');

  // Section C: 5 PCK Scenarios (4 marks each = 20)
  const c1 = num('test-c1'), c2 = num('test-c2'), c3 = num('test-c3'), c4 = num('test-c4'), c5 = num('test-c5');

  const partA = a1 + a2 + a3 + a4 + a5 + a6 + a7 + a8 + a9 + a10;
  const partB = b1 + b2 + b3 + b4 + b5;
  const partC = c1 + c2 + c3 + c4 + c5;
  const total = partA + partB + partC;
  const pct = (total / 40) * 100;

  document.getElementById('test-partA').textContent = partA;
  document.getElementById('test-partB').textContent = partB;
  document.getElementById('test-partC').textContent = partC;
  document.getElementById('test-total').textContent = total;
  document.getElementById('test-percent').textContent = pct.toFixed(1) + '%';

  const rating = getTestRating(pct);
  const badge = document.getElementById('test-rating');
  badge.textContent = rating.label;
  badge.className = 'rating-badge ' + rating.className;
}

function getTestRating(pct) {
  if (pct >= 90) return { label: 'Highly Effective', className: 'exemplary' };
  if (pct >= 75) return { label: 'Effective', className: 'proficient' };
  if (pct >= 60) return { label: 'Developing', className: 'developing' };
  return { label: 'Priority Support Needed', className: 'ineffective' };
}

function saveTest() {
  const name = document.getElementById('test-teacher').value.trim();
  if (!name) { alert('Please enter the teacher name.'); return; }

  // Section A
  const a1 = num('test-a1'), a2 = num('test-a2'), a3 = num('test-a3'), a4 = num('test-a4'), a5 = num('test-a5');
  const a6 = num('test-a6'), a7 = num('test-a7'), a8 = num('test-a8'), a9 = num('test-a9'), a10 = num('test-a10');
  const partA = a1 + a2 + a3 + a4 + a5 + a6 + a7 + a8 + a9 + a10;

  // Section B
  const b1 = num('test-b1'), b2 = num('test-b2'), b3 = num('test-b3'), b4 = num('test-b4'), b5 = num('test-b5');
  const partB = b1 + b2 + b3 + b4 + b5;

  // Section C
  const c1 = num('test-c1'), c2 = num('test-c2'), c3 = num('test-c3'), c4 = num('test-c4'), c5 = num('test-c5');
  const partC = c1 + c2 + c3 + c4 + c5;

  const total = partA + partB + partC;

  upsertTeacher({
    name: name,
    gradeBand: document.getElementById('test-band').value,
    testDate: document.getElementById('test-date').value,
    test: {
      partA: partA,
      partB: partB,
      partC: partC,
      total: total,
      max: 40,
      percentage: parseFloat(((total / 40) * 100).toFixed(2)),
      subs: {
        a1, a2, a3, a4, a5, a6, a7, a8, a9, a10,
        b1, b2, b3, b4, b5,
        c1, c2, c3, c4, c5
      }
    }
  });

  setStatus('Test saved for ' + name);
  alert('✅ Test saved for ' + name);
}

function clearTestForm() {
  if (!confirm('Clear all test inputs?')) return;
  const fields = [
    'test-teacher','test-date',
    'test-a1','test-a2','test-a3','test-a4','test-a5',
    'test-a6','test-a7','test-a8','test-a9','test-a10',
    'test-b1','test-b2','test-b3','test-b4','test-b5',
    'test-c1','test-c2','test-c3','test-c4','test-c5'
  ];
  fields.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  document.getElementById('test-band').value = '1-5';
  updateTestSummary();
}

function loadTestForTeacher(teacher) {
  if (!teacher || !teacher.test) return;
  const t = teacher.test;
  document.getElementById('test-teacher').value = teacher.name || '';
  document.getElementById('test-band').value = teacher.gradeBand || '1-5';
  document.getElementById('test-date').value = teacher.testDate || '';

  if (t.subs) {
    const fields = [
      'a1','a2','a3','a4','a5','a6','a7','a8','a9','a10',
      'b1','b2','b3','b4','b5',
      'c1','c2','c3','c4','c5'
    ];
    fields.forEach(key => {
      const el = document.getElementById('test-' + key);
      if (el) el.value = t.subs[key] || '';
    });
  }
  updateTestSummary();
}

function num(id) {
  const el = document.getElementById(id);
  if (!el || el.value === '') return 0;
  const n = parseFloat(el.value);
  return isNaN(n) ? 0 : n;
}
