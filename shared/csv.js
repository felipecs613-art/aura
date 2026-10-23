import { validateState } from './state.js';

const IMPORTANCE = { low: 'Baixa', medium: 'Média', high: 'Alta' };
const EXAM_HEADERS = ['Concurso', 'ID do concurso', 'Banca', 'Início das inscrições', 'Último dia de inscrição', 'Link do edital', 'Data da prova', 'Taxa de inscrição', 'Inscrição realizada', 'Concurso atual', 'Concurso criado em'];
export const MISSION_HEADERS = ['Item do Edital', 'Link do Notebook', 'Disciplina', 'Importância / Relevância', 'Ciclo', 'Prazo', 'Concluída', 'ID da missão', 'ID do concurso', ...[1, 2, 3, 4].map(c => `Acerto no ${c}º ciclo (%)`), 'Criada em', 'Atualizada em', 'Histórico (JSON)'];

function encode(rows) {
  const quote = value => {
    const cell = typeof value === 'number' ? String(value).replace('.', ',') : String(value ?? '');
    return `"${cell.replace(/"/g, '""')}"`;
  };
  return '\uFEFF' + rows.map(row => row.map(quote).join(';')).join('\r\n');
}
function examCells(exam, currentExamId) {
  if (!exam) return EXAM_HEADERS.map(() => '');
  return [exam.name, exam.id, exam.board, exam.registrationStartDate ?? exam.registrationDate, exam.registrationEndDate, exam.noticeUrl, exam.examDate, exam.fee, exam.registered ? 'Sim' : 'Não', exam.id === currentExamId ? 'Sim' : 'Não', exam.createdAt];
}
export function exportMissionsCsv(state) {
  return encode([MISSION_HEADERS, ...state.tasks.map(task => [task.title, task.link, task.subject, IMPORTANCE[task.importance], `${task.cycle}º Ciclo`, task.deadline, task.done ? 'Sim' : 'Não', task.id, task.examId || '', ...[1, 2, 3, 4].map(c => task.accuracyByCycle?.[String(c)] ?? ''), task.createdAt, task.updatedAt, JSON.stringify(task.history || [])])]);
}
export function exportExamsCsv(state) {
  return encode([EXAM_HEADERS, ...state.exams.map(exam => examCells(exam, state.currentExamId))]);
}

export function parseCsv(text) {
  const input = String(text).replace(/^\uFEFF/, '');
  let commas = 0, semicolons = 0, quoted = false;
  for (let i = 0; i < input.length && !/[\r\n]/.test(input[i]); i++) {
    if (input[i] === '"') {
      if (quoted && input[i + 1] === '"') i++;
      else quoted = !quoted;
    } else if (!quoted && input[i] === ',') commas++;
    else if (!quoted && input[i] === ';') semicolons++;
  }
  const delimiter = semicolons > commas ? ';' : ',';
  const rows = []; let row = [], cell = ''; quoted = false;
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (ch === '"') {
      if (quoted && input[i + 1] === '"') { cell += '"'; i++; }
      else quoted = !quoted;
    } else if (ch === delimiter && !quoted) { row.push(cell); cell = ''; }
    else if (/[\r\n]/.test(ch) && !quoted) {
      if (ch === '\r' && input[i + 1] === '\n') i++;
      row.push(cell); if (row.some(v => v.trim())) rows.push(row); row = []; cell = '';
    } else cell += ch;
  }
  if (quoted) throw new Error('CSV com aspas não fechadas.');
  row.push(cell); if (row.some(v => v.trim())) rows.push(row);
  return rows;
}
const norm = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
const yes = value => /^(sim|true|1)$/.test(norm(value));
function url(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  const parsed = new URL(/^[a-zA-Z][a-zA-Z\d+.-]*:\/\//.test(raw) ? raw : `https://${raw}`);
  if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('Link inválido no CSV.');
  return parsed.href;
}

// Importação aditiva: não sobrescreve concursos existentes nem altera saldos.
export function importAuraCsv(text, currentState, { makeId = () => crypto.randomUUID(), now = new Date().toISOString() } = {}) {
  const rows = parseCsv(text);
  if (!rows.length) throw new Error('O CSV está vazio.');
  const header = rows[0].map(norm);
  const hasHeader = header.some(h => /^(item do edital|titulo|title|link do notebook|disciplina|materia|concurso|id do concurso)$/.test(h) || /relevancia|importancia/.test(h));
  const find = (names, fallback = -1) => hasHeader ? header.findIndex(h => names.some(name => typeof name === 'string' ? h === norm(name) : name.test(h))) : fallback;
  const titleCol = find(['Item do Edital', 'Título', 'title'], 0);
  const examOnly = hasHeader && titleCol < 0 && find(['Concurso']) >= 0;
  if (hasHeader && titleCol < 0 && !examOnly) throw new Error('Cabeçalho de CSV não reconhecido.');
  const state = structuredClone(validateState(currentState));
  const tasksBefore = state.tasks.length, examsBefore = state.exams.length;
  const taskIds = new Set(state.tasks.map(task => task.id)), examIds = new Set(state.exams.map(exam => exam.id));
  const examMap = new Map();
  let invalidLinks = 0;
  for (const [index, row] of (hasHeader ? rows.slice(1) : rows).entries()) {
    const read = (names, fallback = -1) => { const col = find(names, fallback); return col < 0 ? '' : String(row[col] ?? '').trim(); };
    const title = titleCol < 0 ? '' : String(row[titleCol] || '').trim();
    if (!title && !examOnly) continue;
    try {
      let examId = read(['ID do concurso']);
      const name = read(['Concurso']);
      if (name) {
        const key = examId || name;
        if (!examMap.has(key)) {
          const candidate = {
            id: examId || makeId(), name, board: read(['Banca']),
            registrationStartDate: read(['Início das inscrições']), registrationEndDate: read(['Último dia de inscrição']),
            noticeUrl: url(read(['Link do edital'])), examDate: read(['Data da prova']),
            fee: read(['Taxa de inscrição']) === '' ? '' : Number(read(['Taxa de inscrição']).replace(',', '.')),
            registered: yes(read(['Inscrição realizada'])), createdAt: find(['Concurso criado em']) >= 0 ? read(['Concurso criado em']) : now,
          };
          const normalized = validateState({ ...state, exams: [candidate], currentExamId: null }).exams[0];
          const existing = state.exams.find(exam => exam.id === candidate.id);
          // Reutiliza somente um registro idêntico; uma colisão diferente vira outro concurso.
          if (existing && JSON.stringify(existing) === JSON.stringify(normalized)) examMap.set(key, existing.id);
          else {
            if (examIds.has(candidate.id)) normalized.id = makeId();
            examIds.add(normalized.id); state.exams.push(normalized); examMap.set(key, normalized.id);
          }
          if (!state.currentExamId && yes(read(['Concurso atual']))) state.currentExamId = examMap.get(key);
        }
        examId = examMap.get(key);
      }
      if (examOnly) continue;
      let link = '';
      try { link = url(read(['Link do Notebook', 'link', 'notebook', 'url'], 1)); } catch { invalidLinks++; }
      const relevance = norm(read(['Importância / Relevância', 'Importância', 'Relevância', 'importance'], 3));
      const importance = /^(alta|high|h)$/.test(relevance) ? 'high' : /^(baixa|low|l)$/.test(relevance) ? 'low' : 'medium';
      const id = read(['ID da missão']);
      const accuracyByCycle = {};
      for (const cycle of [1, 2, 3, 4]) {
        const raw = read([`Acerto no ${cycle}º ciclo (%)`]);
        if (raw !== '') accuracyByCycle[String(cycle)] = Number(raw.replace('%', '').replace(',', '.'));
      }
      const historyRaw = read(['Histórico (JSON)']);
      const task = {
        id: id && !taskIds.has(id) ? id : makeId(), title, subject: read(['Disciplina', 'Matéria', 'subject'], 2), link,
        cycle: Number(read(['Ciclo', 'cycle']).match(/[1-4]/)?.[0] || 1), deadline: read(['Prazo', 'deadline']),
        importance, done: yes(read(['Concluída', 'done'])), examId, accuracyByCycle,
        createdAt: find(['Criada em']) >= 0 ? read(['Criada em']) : now, updatedAt: find(['Atualizada em']) >= 0 ? read(['Atualizada em']) : now,
        history: historyRaw ? JSON.parse(historyRaw) : [],
      };
      taskIds.add(task.id); state.tasks.push(task);
    } catch (error) { throw new Error(`Linha ${index + (hasHeader ? 2 : 1)}: ${error.message}`); }
  }
  const tasksAdded = state.tasks.length - tasksBefore, examsAdded = state.exams.length - examsBefore;
  if (!tasksAdded && !examsAdded) throw new Error('Nenhum registro novo encontrado no CSV.');
  return { state: validateState(state), tasksAdded, examsAdded, invalidLinks };
}
