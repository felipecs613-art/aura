# Aura Tracker

Aplicação de estudos com missões, quatro ciclos, concursos, percentuais de acerto, histórico, moedas, recompensas e backups. O login usa GitHub OAuth com escopo `gist`; os dados são sincronizados em um Gist secreto por conta. Saldos de XP anteriores são preservados; a interface 2.0 usa moedas e progresso por ciclo.

## Produção: GitHub Pages e Cloudflare

- Site: https://felipecs613-art.github.io/aura/
- API: https://aura-auth.felipecs613.workers.dev/api
- Callback OAuth cadastrado: `https://felipecs613-art.github.io/aura` (preservado).

O GitHub Pages serve os arquivos estáticos de `main` na raiz, com `.nojekyll`. `shared/auth.js` aponta para o Worker somente quando a aplicação está na origem do Pages. O Worker mantém os segredos existentes `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` e a restrição opcional `ALLOWED_USER`.

No Pages, o login usa PKCE S256, `state` de uso único e uma sessão opaca do Aura em `sessionStorage`. O token do GitHub nunca é enviado ao frontend. As chamadas usam `Authorization` com a sessão do Aura, sem cookies de terceiros, e CORS permite apenas a origem configurada em `PAGES_URL`. Ao fechar a aba, poderá ser necessário entrar novamente. Os dados e alterações pendentes permanecem no cache da conta e no Gist.

Para atualizar produção, execute os testes, publique o Worker com `npm run build` e `npx wrangler deploy --keep-vars`, depois publique os arquivos do projeto em `main`. Os assets do Worker incluem somente a lista explícita de `scripts/build.mjs`; nunca publique `.dev.vars` ou credenciais. Se alterar o domínio do Pages, atualize `shared/auth.js`, `wrangler.jsonc` e o callback na OAuth App.

O estado usa versão 3. Dados das versões 1 e 2 são migrados preservando tarefas, saldos, recompensas e resgates. Concursos, concurso atual, ciclo atual, vínculos, acertos, histórico e marcador de concurso padrão participam de todos os salvamentos e backups JSON. Implante frontend e backend juntos para evitar que um validador antigo descarte esses campos.

Cada concurso aceita início e último dia de inscrição e link do edital (HTTP/HTTPS). A data única das versões anteriores é preservada como início; o fim fica vazio até ser informado. Na tela inicial, concursos não inscritos, com inscrições já abertas e faltando de zero a sete dias para o encerramento, exibem aviso ordenado pelo prazo. O aviso inclui concursos do radar, some ao marcar a inscrição realizada e é reavaliado ao voltar à aba e a cada minuto. Os dias seguem o calendário local do navegador. A notificação funciona dentro do Aura; não solicita permissão para notificações do sistema.

## Estrutura

| Caminho | Responsabilidade |
| --- | --- |
| `index.html`, `styles.css`, `app.js` | Interface e regras de estudos |
| `shared/state.js` | Esquema, limites e validação de cache, backup e API |
| `shared/client.js`, `shared/sync.js` | Cache por conta, fila de gravações, retentativas e conflitos |
| `shared/auth.js` | Transporte de sessão e OAuth com PKCE no GitHub Pages |
| `worker/index.js` | OAuth, sessão, API e descoberta/criação/atualização de Gists |
| `wrangler.jsonc` | Worker, assets e Durable Objects SQLite |
| `scripts/build.mjs` | Copia apenas os arquivos públicos para `dist/` |
| `tests/` | Testes de autenticação, persistência, concorrência e interface |

## Executar localmente

Requer Node.js 22 ou superior e npm.

```sh
npm ci
```

Crie uma OAuth App para desenvolvimento no GitHub:

- Homepage URL: `http://127.0.0.1:8787`
- Authorization callback URL: `http://127.0.0.1:8787/api/auth/callback`

Copie `.dev.vars.example` para `.dev.vars` e preencha Client ID e Client Secret dessa aplicação. Esse arquivo é ignorado pelo Git. Execute:

```sh
npm run dev
```

Abra `http://127.0.0.1:8787`. Após editar o frontend, execute `npm run build` novamente para atualizar os assets locais. No desenvolvimento em mesma origem, a sessão usa cookie `HttpOnly`. Abrir `index.html` diretamente não disponibiliza a API.

## Publicar na Cloudflare

A produção usa a arquitetura Pages + Worker descrita acima. Também é possível servir interface e API na mesma origem pelo Worker, com uma OAuth App separada e callback nessa origem.

1. Configure `GITHUB_CLIENT_ID` como segredo do Worker com o ID da OAuth App.
2. Autentique a CLI e configure o segredo do Worker:

```sh
npx wrangler login
npx wrangler secret put GITHUB_CLIENT_ID
npx wrangler secret put GITHUB_CLIENT_SECRET
```

3. Para usar somente o Worker, configure a Homepage URL com a URL pública do Worker ou domínio próprio e o callback como `https://SEU-DOMINIO/api/auth/callback`. Para o Pages, mantenha o callback do Pages informado acima.
4. Publique:

```sh
npm run deploy
```

O nome configurado é `aura-auth`, reutilizando os segredos do Worker existente. O deploy cria o binding SQLite `AURA` e publica somente os assets de `dist/`; segredos, testes e código do servidor ficam fora dos assets. A API aceita a própria origem e a origem configurada do Pages. O endpoint antigo `/callback?code=...` e tokens GitHub enviados pelo navegador não são mais usados.

## Autenticação e dados

- `GET /api/auth/login`: cria transação OAuth de 10 minutos, `state` aleatório e PKCE S256, com vínculo a cookie do navegador.
- `GET /api/auth/callback`: consome a transação uma vez, troca o código no servidor e consulta `/user` no GitHub.
- `POST /api/auth/start`: inicia OAuth com PKCE na origem autorizada do Pages.
- `POST /api/auth/exchange`: valida `state` e PKCE e devolve somente a sessão opaca do Aura.
- `GET /api/session`: devolve apenas identidade pública do usuário.
- `POST /api/auth/logout`: invalida a sessão no servidor e remove o cookie.
- `GET /api/data`: carrega dados e revisão do Gist.
- `POST /api/data`: recebe `{ data, revision }`; rejeita revisões antigas com HTTP 409.

Na modalidade de mesma origem, o cookie de sessão é `HttpOnly`, `SameSite=Lax` e `Secure` em HTTPS. No Pages, a sessão opaca fica em `sessionStorage`, vinculada à origem autorizada. Em ambos os casos o token GitHub fica no armazenamento do Durable Object da sessão, com prazo máximo de sete dias ou o prazo menor informado pelo GitHub. Sessões e transações OAuth são removidas por alarme. Tokens expirados ou revogados exigem novo login; não é solicitado `offline_access` nem implementada renovação automática. Sair encerra a sessão do Aura; não revoga a autorização da OAuth App no GitHub.

Cada conta tem um Durable Object de dados, que serializa gravações e guarda somente o vínculo com o Gist. A descoberta percorre páginas da API e procura `aura-data.json` pertencente ao usuário. Mais de um candidato gera conflito; um arquivo inválido, público, truncado ou removido não é substituído silenciosamente. Gists anteriores com JSON de estado válido são lidos; na próxima gravação recebem o envelope `{ app: "Aura Tracker", data }`.

São aceitos até 750.000 bytes de estado, 5.000 missões, 1.000 recompensas e 5.000 resgates. Conteúdo truncado é recusado em vez de carregar parcialmente. O escopo `gist` concede acesso amplo aos Gists da conta; o código da aplicação restringe suas operações ao arquivo identificado do Aura.

**Gists secretos não são privados:** qualquer pessoa com a URL pode ler o conteúdo e seu histórico. Esta implementação não criptografa o JSON; não armazene segredos ou informações sensíveis nele. Para confidencialidade, use armazenamento com controle de acesso ou implemente criptografia com uma estratégia de recuperação de chaves.

## Sincronização e recuperação

O cache usa `auraTracker.user.<github-id>.v1`. Cada envelope local guarda dados, revisão e indicação de alterações pendentes. O conteúdo inicial só é aplicado após autenticação e carregamento remoto. Uma falha de leitura sem cache impede a edição; com cache válido da conta, ele pode ser usado até a recuperação da conexão.

As gravações são serializadas, têm debounce de 1,2 segundo e usam revisão calculada sobre o conteúdo do Gist. Alterações feitas durante um envio permanecem pendentes. Erros transitórios recebem até cinco retentativas com espera crescente; sessão expirada e conflito exigem intervenção. Web Locks coordena envios entre abas quando disponível; mudanças vindas de outra aba exibem conflito em vez de descartar a cópia aberta.

O aviso de conflito permite baixar a cópia aberta, carregar a nuvem ou enviar a cópia local mediante confirmação. Não há mesclagem automática. Fechar a página pode deixar alterações pendentes, preservadas no cache para o próximo login dessa conta. Logout cancela o agendamento e aguarda a requisição em andamento; não promete que pendências já chegaram à nuvem.

O Worker detecta alterações externas ao reler o Gist antes de gravar. A serialização garante conflitos entre clientes deste Worker; a API de Gists não fornece aqui uma transação atômica de comparação e escrita contra edições simultâneas feitas diretamente no GitHub ou por outro sistema. Evite editar o mesmo arquivo por esses caminhos enquanto usa o Aura.

## Migrar dados antigos

Antes de trocar a hospedagem, baixe um backup JSON no Aura antigo. O armazenamento do navegador é específico da origem e não acompanha a mudança de GitHub Pages para Worker.

Após entrar na conta correta, use **Configurações → Restaurar backup JSON**. Se o cache antigo estiver na mesma origem, **Importar dados anteriores deste navegador** permite importação explícita. O cache antigo é preservado e nunca associado automaticamente a uma conta. Credenciais antigas `gh_token`, `gh_user`, `gist_id` e `oauth_state` são removidas do navegador.

CSV conserva ciclo, prazo e conclusão ao importar arquivos exportados pelo Aura, mas não altera o saldo de XP/moedas nem substitui backup completo. Use JSON para transportar todo o estado.

## Validação

```sh
npm run check
npm test
npm run build
npx wrangler deploy --dry-run
npx playwright install chromium
npm run test:browser
```

Os testes de navegador usam o runtime local do Worker e respostas simuladas para conta e Gists. Para usar Edge já instalado no PowerShell:

```powershell
$env:PLAYWRIGHT_CHANNEL = 'msedge'
npm run test:browser
```

O login real e as operações na conta GitHub requerem as credenciais OAuth e configuração do callback; não são executados pelos testes automatizados.

Referências: [OAuth e PKCE](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps), [API de Gists](https://docs.github.com/en/rest/gists/gists), [visibilidade dos Gists](https://docs.github.com/en/get-started/writing-on-github/editing-and-sharing-content-with-gists/creating-gists).
