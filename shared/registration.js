const DAY = 86_400_000;
function calendarDay(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split('-').map(Number);
  const timestamp = Date.UTC(year, month - 1, day);
  return new Date(timestamp).toISOString().slice(0, 10) === value ? timestamp : null;
}

// Dias do calendário local: independem da hora e da duração de dias com horário de verão.
export function registrationAlerts(exams, now = new Date()) {
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return exams.flatMap(exam => {
    if (exam.registered) return [];
    const end = calendarDay(exam.registrationEndDate);
    const start = calendarDay(exam.registrationStartDate ?? exam.registrationDate);
    if (end === null || (start !== null && start > today)) return [];
    const days = Math.round((end - today) / DAY);
    return days >= 0 && days <= 7 ? [{ exam, days }] : [];
  }).sort((a, b) => a.days - b.days || a.exam.name.localeCompare(b.exam.name, 'pt-BR'));
}
