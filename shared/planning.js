export function cycleCompletionEstimate(tasks, cycle, now = new Date()) {
  const pending = tasks.filter(task => Number(task.cycle) === Number(cycle) && !task.done).length;
  const days = Math.ceil(pending / 3);
  if (!days) return { pending, days, date: null };
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  // Hoje já comporta as primeiras três missões; usa dias do calendário local.
  date.setDate(date.getDate() + days - 1);
  return { pending, days, date };
}
