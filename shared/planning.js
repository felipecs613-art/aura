export function cycleCompletionEstimate(tasks, cycle, now = new Date()) {
  const pending = tasks.filter(task => Number(task.cycle) === Number(cycle) && !task.done).length;
  const sameDay = value => {
    const date = new Date(value);
    return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate();
  };
  // As missões concluídas podem já estar no próximo ciclo; consulte todo o histórico.
  const completedToday = tasks.reduce((total, task) => total + new Set((task.history || [])
    .filter(event => event.type === 'status' && event.done === true && sameDay(event.at))
    .map(event => event.cycle ?? task.cycle)).size, 0);
  const remainingToday = Math.max(0, 3 - completedToday);
  const offset = pending <= remainingToday ? 0 : Math.ceil((pending - remainingToday) / 3);
  const days = pending ? offset + 1 : 0;
  if (!days) return { pending, completedToday, remainingToday, days, date: null };
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  // Hoje já comporta as primeiras três missões; usa dias do calendário local.
  date.setDate(date.getDate() + offset);
  return { pending, completedToday, remainingToday, days, date };
}
