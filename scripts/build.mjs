import { mkdir, copyFile } from 'node:fs/promises';
await mkdir('dist/shared', { recursive: true });
for (const file of ['index.html', 'favicon.svg', 'app.js', 'styles.css', 'shared/state.js', 'shared/sync.js', 'shared/client.js', 'shared/auth.js', 'shared/registration.js', 'shared/csv.js', 'shared/planning.js']) {
  await copyFile(file, `dist/${file}`);
}
