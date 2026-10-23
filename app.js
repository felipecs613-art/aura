import { emptyState, validateState } from './shared/state.js';
import { api, SyncClient } from './shared/client.js';
import { startLogin, finishLogin, clearSession } from './shared/auth.js';
import { registrationAlerts } from './shared/registration.js';

    (() => {
      'use strict';
      const LEGACY_KEY = 'auraTracker.data.v1';
      let sync = null, activeUser = null, localSaveFailed = false;
      const IMPORTANCE = {
        low: { label: 'Baixa', xp: 10, coins: 5, cls: 'tag-low', rank: 1 },
        medium: { label: 'Média', xp: 20, coins: 10, cls: 'tag-medium', rank: 2 },
        high: { label: 'Alta', xp: 30, coins: 15, cls: 'tag-high', rank: 3 }
      };
      const CYCLE_NAMES = { 1: '1º Ciclo', 2: '2º Ciclo', 3: '3º Ciclo', 4: '4º Ciclo' };
      const INITIAL_MISSION_ROWS = [
        ["01 - Engenharia de Software: Fundamentos: Ciclo de vida de software: abordagens de ciclo de vida preditiva, iterativa, incremental adaptativa, inclusive suas combinações.","https://notebook.google.com/notebook/2ddcb0cc-0408-46ad-9575-ca1f84ab1b66","ES","m"],
        ["02 - Abordagem ágil, Kanban, Lean Software Development.","https://notebook.google.com/notebook/db9a1a37-a1ca-4dab-b3f5-3097b4a93102","ES","m"],
        ["03 - Scrum","https://notebook.google.com/notebook/ba528b2b-3a30-444c-bffe-4de32736a010","ES","h"],
        ["04 - Extreming Programin (XP)","https://notebook.google.com/notebook/3a70b2cc-10bb-4fcb-99bf-1cb4f075ee11","ES","l"],
        ["05 - Levantamento, especificação, análise, validação e gerenciamento de requisitos funcionais e não funcionais: histórias de usuário, casos de uso e critérios de aceite.","https://notebook.google.com/notebook/0b53f89a-b916-4347-a2bb-4a66f91915b6","ES","h"],
        ["06 - Modelagem de sistemas e processos com UML.","https://notebook.google.com/notebook/25740573-ffa4-4d83-8eb6-2256a0fe1113","ES","m"],
        ["07 - Qualidade de software: desempenho, escalabilidade, disponibilidade, confiabilidade e manutenibilidade.","https://notebook.google.com/notebook/095b8e6e-cc80-4ca4-a451-1910c0f88b71","ES","m"],
        ["08 - Testes de software: unitários, de integração, funcionais, de regressão, de carga e de estresse: testes automatizados. Revisão de código refatoração: dívida técnica.","https://notebook.google.com/notebook/698868ef-7adc-4d7f-bf3a-883aa9bd2523","ES","m"],
        ["09 - Arquitetura de software: padrões arquiteturais, arquitetura em camadas, coesão e acoplamento.","https://notebook.google.com/notebook/3a5d82d7-641e-4ad4-b055-9b6e00769289","ES","h"],
        ["10 - Arquitetura de software: orientada a serviços (SOA).","https://notebook.google.com/notebook/823cb88c-8b4b-45ba-9792-2d25c35f2862","ES","h"],
        ["11 - Arquitetura de software: microsserviços e orientada a eventos: princípios SOLID, DRY.","https://notebook.google.com/notebook/37eb7b7d-f16d-4531-add1-c91c52b02ce9","ES","h"],
        ["11.5 - Padrões de projeto de software (design patterns), incluindo padrões criacionais, estruturais e comportamentais.","https://notebook.google.com/notebook/fde66d4c-7b1c-45d5-8896-aa27e7729a77","ES","h"],
        ["11.6 - YAGNI","https://notebook.google.com/notebook/e7c653dd-ffaa-428d-afdd-433b9a0ff3bb","ES","l"],
        ["12 - Redes de computadores.","https://notebook.google.com/notebook/4e47a80b-0e6e-4696-9606-78e27ada1db4","REDE","m"],
        ["13 - Arquitetura TCP/IP","https://notebook.google.com/notebook/0c9adefb-5483-4aa9-9170-bbb8ff6fed70","REDE","h"],
        ["14 - Noções de redes sem fio.","https://notebook.google.com/notebook/20958666-0f0a-41ce-a3d8-f39435978866","REDE","l"],
        ["15 - Endereçamento IPv4","https://notebook.google.com/notebook/9900553c-45bf-401e-90fd-d5a502a59c5b","REDE","l"],
        ["16 - Endereçamento IPv6","https://notebook.google.com/notebook/bf81daa7-b020-426d-a0d4-17ae3b938f39","REDE","l"],
        ["17 - Protocolos HTTP/2, HTTP/3 e HTTPS, SMTP","https://notebook.google.com/notebook/d3e6996e-ff1f-4c51-8070-ef05ad314864","REDE","m"],
        ["18 - DNS e DHCP, FTP e SSH","https://notebook.google.com/notebook/c27e8540-9cfa-437a-aea5-4125d2d3865c","REDE","m"],
        ["19 - Observabilidade e monitoramento de sistemas: métricas, logs e traces: telemetria, instrumentação, correlação de eventos, alertas e acompanhamento de indicadores técnicos de aplicações e infraestrutura.","https://notebook.google.com/notebook/88088a12-1c85-46b0-822e-4d02ae030261","REDE","m"],
        ["20 - Princípios de Segurança da Informação e Redes de Computadores","https://notebook.google.com/notebook/03207368-3206-49f0-b2b5-45d52a3d830a","REDE","h"],
        ["21 - Proxies e firewalls: antivírus, IDS/IPS: Conceito de Zero Trust.","https://notebook.google.com/notebook/11bd63be-1b84-4353-bdd3-d799274b41de","REDE","m"],
        ["22 - VPN","https://notebook.google.com/notebook/3b18e4e9-61e2-4802-b738-6fa814654f4b","REDE","m"],
        ["23 - Malware, ransomware, phishing e engenharia social. Segurança em aplicações: OWASP Top 10: testes de invasão e análise de vulnerabilidades.","https://notebook.google.com/notebook/b14bc3ee-344b-46f7-924b-71cfab8ff2d3","REDE","h"],
        ["24 - Criptografia simétrica e assimétrica","https://notebook.google.com/notebook/17f66bc6-f925-45c8-89c6-09454027ceb4","REDE","h"],
        ["25 - Infraestrutura de chaves públicas: certificados e assinatura digital","https://notebook.google.com/notebook/9e3a2994-49d3-4014-9f2c-53eb76ad8efd","REDE","h"],
        ["26 - Backup","https://notebook.google.com/notebook/5c11ab05-e047-416d-802d-f3cbe2d2210a","REDE","m"],
        ["27 - Continuidade de negócios e recuperação de desastres.","https://notebook.google.com/notebook/0fdb3365-719d-429e-be84-5145aef7e62f","REDE","m"],
        ["28 - Computação em nuvem: modelo IaaS, PaaS e SaaS: computação serveless: escalabilidade e alta disponibilidade: integração entre ambientes locais e nuvem: monitoramento de infraestrutura. Segurança em containers e em ambientes de nuvem.","https://notebook.google.com/notebook/98c9d96e-68b7-494a-9324-015ee6dd5579","REDE","h"],
        ["29 - Família de normas ABNT NBR ISO/IEC 27000 (gestão da segurança da informação)","https://notebook.google.com/notebook/6196acc1-b6bd-4dda-a338-f537bc6decbf","REDE","h"],
        ["30 - Lógica de programação","https://notebook.google.com/notebook/162863db-6952-4337-a85c-9926628ee77c","DEV","h"],
        ["31 - Estruturas de daos","https://notebook.google.com/notebook/ceac082a-7ed0-4300-800b-85aad441cc32","DEV","m"],
        ["32 - Algorítmos","https://notebook.google.com/notebook/679edaff-b6ff-49c6-ad5f-64359d84edfa","DEV","h"],
        ["33 - Programação orientada a objetos e programação funcional","https://notebook.google.com/notebook/8901cec0-2b3e-42e3-a369-f5f05dbbcb0e","DEV","h"],
        ["34 - Programação em Java (conceitos básicos)","https://notebook.google.com/notebook/adb543e5-c5df-424c-825e-8cb2362ffdf3","DEV","h"],
        ["35 - Desenvolvimento web: HTML 5.","https://notebook.google.com/notebook/5fb95bcc-4ece-4ddd-931e-07e5600b730d","DEV","l"],
        ["36 - CSS3","https://notebook.google.com/notebook/4ea7bb2e-e7a5-4319-98c0-fca1f0ceba62","DEV","l"],
        ["37 - Programação em JavaScript","https://notebook.google.com/notebook/5e1b3cd6-1980-41c2-ada5-a5011e5f577c","DEV","h"],
        ["38 - Desenvolvimento front-end com React. Node.js. Conceitos de GraphQL e WebSockets: TypeScript.","https://notebook.google.com/notebook/e9ef6014-52e0-44d5-94c3-bb7fa0b5e4e0","DEV","m"],
        ["39 - Programação em Python","https://notebook.google.com/notebook/c1b91880-63da-4684-9a76-afbb795f04a4","DEV","h"],
        ["40 - Desenvolvimento de APIs RESTful: Documentação de APIs (OpenAPI/Swagger).","https://notebook.google.com/notebook/4a5beed1-065d-4cef-8097-8a7aea9374cb","DEV","h"],
        ["41 - Formatos JSON","https://notebook.google.com/notebook/53bf6b29-1390-4bbc-b43b-b402268884e6","DEV","m"],
        ["42 - Formatos XML","https://notebook.google.com/notebook/42a451a3-21ac-4c71-9f13-b27ac49c6946","DEV","l"],
        ["43 - Controle de versão com Git. Controles de versão distribuído com Git: plataformas de hospedagem, colaboração e automação baseadas em Git, incluindo GitHub e GitLab: estratégias de branching, incluindo GiotFlow e trunk-based development: pull requests/merge requests e revisão de código","https://notebook.google.com/notebook/91b99401-d1c9-42d3-aae4-9deb87be5283","DEV","h"],
        ["44 - DevOps, Plataforma de Desenvolvimento e Engenharia de Entrega Integração, entrega e  implementação contínuas (CI/CD): pipelines de desenvolvimento: automação de build e de testes. Infraestrutura como código e gerenciamento de configuração.","https://notebook.google.com/notebook/930b5236-04ed-4fda-8793-7065654787da","DEV","h"],
        ["45 - Conteinerização: Docker e Docker Compose: orquestração de containers com Kubernetes.","https://notebook.google.com/notebook/5ac2b498-d1b3-47dd-8696-00f5fa1c49c0","DEV","h"],
        ["46 - Ambientes de desenvolvimento, homologação e produção. Gerenciamento de dependências, empacotamento e publicação de aplicações.","https://notebook.google.com/notebook/b3381945-0c40-461a-8e08-d6fbf5d98351","DEV","m"],
        ["47 - Automação de pipelines: GitHub Actions, Git CI/CD, Jenkings e ferramentas correlatas.","https://notebook.google.com/notebook/a2476197-7bc3-4b54-a222-8fa287e2242b","DEV","h"],
        ["48 - KISS","https://notebook.google.com/notebook/df95625a-939c-4b5d-8ea4-16ccb8bea559","DEV","l"],
        ["49 - Desenvolvimento de software assistido por IA","https://notebook.google.com/notebook/63d71968-8e28-4d5b-ad13-af368cd26118","DEV","m"],
        ["50 - Sistemas operacionais: gerenciamento de processos, memória e sistemas de arquivos","https://notebook.google.com/notebook/32bc65e4-1c97-4052-834a-6cc4c36bf521","SO","m"],
        ["51 - Sistemas operacionais Windows: administração básica. Comandos básicos de Windows PowerShell: automação por scripts. Serviços de diretório: Active Directory e LDAP.","https://notebook.google.com/notebook/5d2a8022-96d3-44e7-b8e9-774d446f54de","SO","l"],
        ["52 - Sistemas operacionais Linux: administração básica. Comandos básicos de shell (Linux): automação por scripts. Serviços de diretório: LDAP.","https://notebook.google.com/notebook/e9065f73-d55a-490d-a8f7-352649588f8c","SO","l"],
        ["53 - Balanceamento de carga.","https://notebook.google.com/notebook/396ee8ba-9f40-4867-a035-dc5d7ad2a9f4","SO","m"],
        ["54 - Virtualização e containers.","https://notebook.google.com/notebook/f658256c-1499-4a1b-b57f-ab60aab2b072","SO","m"],
        ["55 - Aplicação técnica de Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018) no desenvolvimento e na operação de sistemas: privacy by design e by default, minimização e pseudonimização.","https://notebook.google.com/notebook/359c98b3-6fb3-4c73-ae5a-435c5454c1e7","LEG","h"],
        ["56 - Marco Civil da Internet (Lei nº 12.965/2014): principios de neutralidade de rede, proteção de dados e guarda de registros de conexão e de acesso.","https://notebook.google.com/notebook/86b80c6f-32ad-48f2-97ec-7f019b716b3e","LEG","m"],
        ["57 - Contratação de soluções de tecnologia da informação e comunicação (Lei nº 14.133/2021 aplicada às contratações de TIC). Requisitos de segurança da informação em contratações de soluções de TIC. Certificação digital e sua aplicação em sistemas informatizados.","https://notebook.google.com/notebook/d3ad40c3-d7c3-48d1-9177-f05b7f98ff1c","LEG","h"],
        ["58 - Governo digital e transformação digital no setor público. Lei nº 14.129/2021 (Lei do Governo Digital)","https://notebook.google.com/notebook/9736efd2-97dd-4de0-947f-a1a91e7c8dab","LEG","h"],
        ["59 - Estratégia Nacional do Governo Digital - ENGD 2024-2027, instituída pelo Decreto nº 12.069/2024, consideradas suas recomendações e atualizações vigentes.","https://notebook.google.com/notebook/ec6db2dd-dc6d-46cc-b04b-d49ed9f079ab","LEG","h"],
        ["60 - Lei Complementar estadual nº 205, de 19 de maio de 2025.","https://notebook.google.com/notebook/c626eb85-515e-44b3-a68e-1dc00646dfaa","LEG","m"],
        ["61 - Normativos e instrumentos institucionais do TCE-GO(ESTUDAR AO FINAL)","https://notebook.google.com/notebook/6f762b03-8d12-4bab-8ccf-433994e21f00","LEG","h"],
        ["62 - Governança de Tecnologia da Informação. Governança de TI: estratégia e alinhamento com os objetivos institucionais.","https://notebook.google.com/notebook/7c9eddc0-1bb0-4d7b-93fd-d9865a30d670","GOV","m"],
        ["63 - Gestão de projetos: fundamentos do PMBOK 8ª edição e de métodos ágeis aplicados a projetos de TI.","https://notebook.google.com/notebook/bd64c583-2864-4f0d-9210-2001d19515d1","GOV","h"],
        ["64 - Gestão de serviços de TI: catálogo de serviços, gerenciamento de incidentes, problemas, mudanças e configuração. Gestão de portfólio e de ativos de TI: continuidade de serviços. ITIL V4.","https://notebook.google.com/notebook/66ec3660-840e-4e6d-ac67-d3459f6512a5","GOV","h"],
        ["65 - Boas práticas e modelos de referência: COBIT 2019.","https://notebook.google.com/notebook/4de13435-382d-43a0-8b64-ae230ceb8d77","GOV","h"],
        ["66 - ISO/IEC 38500:2024.","https://notebook.google.com/notebook/8a17e3e6-5a51-4f65-a1a1-084e482c0237","GOV","l"],
        ["67 - Modelagem de sistemas e processos com BPMN","https://notebook.google.com/notebook/98cd1038-0591-4f33-b042-0d12e18cb722","GOV","m"],
        ["68 - Governança de dados","https://notebook.google.com/notebook/4e2631bf-8d93-402d-a3e3-c241146187ff","BD","h"],
        ["69 - Banco de Dados. Transações e propriedades ACID.","https://notebook.google.com/notebook/128f284e-c147-42b8-827b-c0050966a651","BD","h"],
        ["70 - Modelagem de dados, modelo entidade-relacionamento.","https://notebook.google.com/notebook/cc056f8a-1ce3-4c4f-b7c3-6315f9c70670","BD","m"],
        ["71 - Bancos relacionais","https://notebook.google.com/notebook/a4a87150-a7cb-470b-b3cb-f7f88fd072a2","BD","m"],
        ["72 - Normalização de desnormalização","https://notebook.google.com/notebook/076265bb-2da4-449a-9d2d-b69e1a63b89b","BD","m"],
        ["73 - Álgebra relacional","https://notebook.google.com/notebook/4628d1c9-baef-446d-969b-d8640ab5b236","BD","m"],
        ["74 - Linguagem SQL","https://notebook.google.com/notebook/07e57369-56ad-47cd-92ee-2b2b165e040e","BD","h"],
        ["75 - SQL Avançado - Procedures, triggers e views.","https://notebook.google.com/notebook/6453b078-8f09-40cf-8c20-b90f35dfcee7","BD","h"],
        ["76 - Índices e otimização de consultas.","https://notebook.google.com/notebook/b2b7f9b1-7483-402e-8c5c-823ab789728e","BD","m"],
        ["77 - Segurança de dados","https://notebook.google.com/notebook/5d0593ea-5985-4dc5-8e4f-0685dbb810ff","BD","h"],
        ["78 - Administração e otimização de Oracle Database. Replicação, backup e recuperação. Alta disponibilidade.","https://notebook.google.com/notebook/f35acc59-3a25-4cea-ac8f-d95a3e05e449","BD","h"],
        ["80 - Fundamentos de Big Data e características de volume, velocidade e variedade de dados.","https://notebook.google.com/notebook/18ac8c72-741a-45a8-8473-5b1c850f9005","BD","h"],
        ["81 - Processamento distribuído.","https://notebook.google.com/notebook/8fb294af-d97a-49f1-a38d-eb11ce2a24e1","BD","m"],
        ["82 - Fundamentos de ciência de dados: coleta, preparação, limpeza, transformação.","https://notebook.google.com/notebook/e2eef5f7-5308-4307-a83d-33f8d2d1e382","BD","m"],
        ["83 - Fundamentos de inteligência artificial. Inteligência artifical generativa: conceitos e aplicações. Agentes inteligentes e modelos multimodais. Engenharia de prompts e de contexto: recuperação aumentada por geração (RAG). Aplicações práticas de IA em sistemas de informação e automação de processos. Ética em IA, IA responsável, explicabilidade e governança de IA: Estratégia Brasileira de Inteligência Artificial","https://notebook.google.com/notebook/05da257c-3c61-4f21-a12b-3245f369bcad","BD","l"],
        ["84 - Banco de dados NoSQL: modelos orientados a documentos , chave-valor, famílias de colunas (wide-column) e grafos: características, casos de uso e conceitos gerais: tecnologias com MongoDB e Redis.","https://notebook.google.com/notebook/f5bbbdc6-7be3-4ed8-89f0-f4326cabeb5a","BD","h"],
        ["85 - Aprendizado de máquina: aprendizado supervisionado, não supervisionado e por reforço. Avaliação de modelos.","https://notebook.google.com/notebook/f9eeebad-a872-4e35-8352-10ccd41a8714","BD","h"],
        ["86 - Redes neurais artificias e noções de deep learning","https://notebook.google.com/notebook/3434e300-c635-49d8-9f4e-a1703a0f0674","BD","m"],
        ["87 - Processamento de linguagem natural","https://notebook.google.com/notebook/d506e58b-f281-4ffd-b523-8184aa1731bb","BD","h"],
        ["88 - LGPD aplicada à IA.","https://notebook.google.com/notebook/4db106ee-7052-48be-8a4f-85952ff88f76","BD","h"],
        ["89 - Exploração e análise de dados.","https://notebook.google.com/notebook/bb700ab4-57d8-4900-bb55-f3bc88ddc9eb","BD","l"],
        ["90 - Apresentação de Dados.","https://notebook.google.com/notebook/d9350be6-b593-46eb-a605-1c220751498d","BD","m"],
        ["91 - Médias","https://notebook.google.com/notebook/8e5ecfa6-8db3-49f8-82e9-b08a5cec99f8","BD","l"],
        ["92 - Médias separatrizes ou Quantis","https://notebook.google.com/notebook/0fa06ca5-fe59-497e-8091-8013a98bf997","BD","l"],
        ["93 - Moda","https://notebook.google.com/notebook/ca70e7c5-2eac-4870-af83-a7225bb27ee3","BD","l"],
        ["94 - Medidas de Variabilidade ou Dispersão","https://notebook.google.com/notebook/65ff276c-6760-4a7a-945b-dc915ee2d2d9","BD","m"],
        ["95 - Análise Combinatória","https://notebook.google.com/notebook/91d761f4-d523-4cb1-8499-894a81175c08","BD","l"],
        ["96 - Probabilidade","https://notebook.google.com/notebook/7517cfc3-f043-4271-b3f7-732e1771c39d","BD","m"],
      ];
      const MISSION_CATEGORIES = { ES: 'Engenharia de Software', REDE: 'Rede de computadores', DEV: 'Desenvolvimento de Software', SO: 'Sistemas Operacionais', LEG: 'Legislação de TI', GOV: 'Governança de TI', BD: 'Banco de dados' };
      const MISSION_IMPORTANCE = { l: 'low', m: 'medium', h: 'high' };
      const REWARD_ICONS = ['🎬', '☕', '🎮', '🍰', '📚', '🎧', '🌿', '⭐', '🍕', '🧋'];
      const $ = (selector, root = document) => root.querySelector(selector);
      const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
      const safeText = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch]));
      const makeId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
      const defaultState = emptyState;
      // Concurso padrão: adicionado uma única vez, inclusive em instalações existentes.
      // O marcador impede que o concurso reapareça caso seja excluído pelo usuário.
      const TCE_GO_SEED_ID = 'concurso-tce-go-analista-ti-2027';
      function insertTceGoDefault(data) {
        if (data.tceGoSeeded === true) return data;
        if (!Array.isArray(data.exams)) data.exams = [];
        const exists = data.exams.some(e => e.id === TCE_GO_SEED_ID ||
          (String(e.name || '').trim().toLocaleLowerCase('pt-BR') === 'tce goiás - analista de ti' && e.examDate === '2027-01-17'));
        if (!exists) {
          data.exams.push({
            id: TCE_GO_SEED_ID,
            name: 'TCE Goiás - Analista de TI',
            board: 'FCC',
            registrationDate: '2026-10-05',
            fee: 100,
            examDate: '2027-01-17',
            registered: true,
            createdAt: new Date().toISOString()
          });
        }
        // Não substitui um concurso atual já escolhido pelo usuário.
        if (!data.currentExamId && data.exams.length === 1) data.currentExamId = data.exams[0].id;
        data.tceGoSeeded = true;
        return data;
      }
      let state = defaultState();
      let statusFilter = 'pending';
      let currentView = 'tasks';
      let editingExamId = null;
      let completionTaskId = null;
      let editTaskId = null;
      let contextTaskId = null;
      let activeUndo = null;
      let toastTimers = new Set();

      function nonNegativeNumber(value) { const n = Number(value); return Number.isFinite(n) ? Math.max(0, Math.floor(n)) : 0; }
      function saveState() {
        try {
          if (!sync || !activeUser) throw new Error('Entre na sua conta antes de salvar.');
          sync.save(state);
          localSaveFailed = false;
          return true;
        } catch (error) {
          localSaveFailed = true;
          syncStatus(sync?.conflict ? 'conflict' : 'error', error);
          toast('Falha ao salvar', error.message + ' Exporte um backup da cópia aberta.', 'neutral');
          return false;
        }
      }
      function taskPoints(task) { return IMPORTANCE[task.importance] || IMPORTANCE.medium; }
      // Uma missão transferida automaticamente volta a ficar pendente, mas a conclusão
      // anterior continua registrada no histórico e deve contar nas estatísticas.
      function completedInCycle(task, cycle) {
        if (Number(task.cycle) === cycle && task.done) return true;
        return Array.isArray(task.history) && task.history.some(entry =>
          entry && entry.type === 'status' && entry.done === true && Number(entry.cycle) === cycle
        ) || (task.accuracyByCycle != null && task.accuracyByCycle[String(cycle)] !== undefined &&
              task.accuracyByCycle[String(cycle)] !== null && task.accuracyByCycle[String(cycle)] !== '');
      }
      function participatedInCycle(task, cycle) {
        if (Number(task.cycle) === cycle || completedInCycle(task, cycle)) return true;
        return Array.isArray(task.history) && task.history.some(entry =>
          entry && entry.type === 'cycle_transfer' &&
          (Number(entry.from) === cycle || Number(entry.to) === cycle)
        );
      }
      function completedTasks() {
        return state.tasks.filter(task => task.done || [1, 2, 3, 4].some(cycle => completedInCycle(task, cycle)));
      }
      function escapeAttr(value) { return safeText(value).replace(/`/g, '&#96;'); }
      function iconSvg(name) {
        const paths = {
          calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
          external: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5"/>',
          check: '<path d="m5 12 4.5 4.5L19 7"/>',
          copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
          edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/>',
          trash: '<path d="M4 7h16M10 11v6M14 11v6M5.5 7l1 14h11l1-14M9 7V4h6v3"/>',
          book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22Z"/><path d="M4 5v14a3 3 0 0 1 3-3h13M8 7h7"/>',
          star: '<path d="m12 2 2.7 6.1 6.6.6-5 4.3 1.5 6.5-5.8-3.5-5.8 3.5 1.5-6.5-5-4.3 6.6-.6L12 2Z"/>',
          bag: '<path d="M4 8h16l-1.2 12H5.2L4 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/>',
          plus: '<path d="M12 5v14M5 12h14"/>',
          link: '<path d="M10 13a5 5 0 0 0 7.1 0l2-2A5 5 0 0 0 12 3.9l-1.1 1.1"/><path d="M14 11a5 5 0 0 0-7.1 0l-2 2A5 5 0 0 0 12 20.1l1.1-1.1"/>'
        };
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.star}</svg>`;
      }
      function normalizeUrl(raw) {
        const value = String(raw || '').trim();
        if (!value) return '';
        const url = /^[a-zA-Z][a-zA-Z\d+.-]*:\/\//.test(value) ? value : `https://${value}`;
        try {
          const parsed = new URL(url);
          if (!['http:', 'https:'].includes(parsed.protocol)) return '';
          return parsed.href;
        } catch (_) { return ''; }
      }
      function prettyDate(value) {
        if (!value) return 'Sem prazo definido';
        const d = new Date(`${value}T12:00:00`);
        if (Number.isNaN(d.getTime())) return 'Prazo inválido';
        return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', '');
      }
      function daysUntil(value) {
        if (!value) return null;
        const due = new Date(`${value}T00:00:00`); const today = new Date(); today.setHours(0,0,0,0);
        return Math.round((due - today) / 86400000);
      }
      function dueLabel(value) {
        if (!value) return 'Sem prazo';
        const diff = daysUntil(value);
        if (diff < 0) return `Atrasada há ${Math.abs(diff)} dia(s)`;
        if (diff === 0) return 'Vence hoje';
        if (diff === 1) return 'Vence amanhã';
        return prettyDate(value);
      }
      function toast(title, detail = '', type = 'success', undoCallback = null) {
        const stack = $('#toastStack');
        // Apenas a ação mais recente mantém o botão de desfazer, evitando estornos fora de ordem.
        $$('.toast', stack).forEach(existing => { if ($('.toast-undo', existing)) existing.remove(); });
        const node = document.createElement('div');
        node.className = `toast ${type === 'neutral' ? 'toast-neutral' : ''}`;
        const id = makeId();
        node.dataset.toastId = id;
        node.innerHTML = `<div class="toast-row"><div><div class="toast-title">${safeText(title)}</div><div class="toast-detail">${safeText(detail)}</div></div>${undoCallback ? '<button class="toast-undo" type="button">Desfazer</button>' : ''}</div>${undoCallback ? '<div class="toast-timer"></div>' : ''}`;
        if (undoCallback) {
          $('.toast-undo', node).addEventListener('click', () => {
            clearTimeout(timer);
            toastTimers.delete(timer);
            try { undoCallback(); } finally { node.remove(); }
          });
          activeUndo = id;
        }
        stack.appendChild(node);
        const timer = setTimeout(() => { node.remove(); toastTimers.delete(timer); if (activeUndo === id) activeUndo = null; }, undoCallback ? 5000 : 3600);
        toastTimers.add(timer);
      }
      function openModal(id) { $('#' + id).classList.add('open'); document.body.style.overflow = 'hidden'; }
      function closeModal(id) {
        const modal = $('#' + id); if (!modal) return;
        modal.classList.remove('open');
        if (!$('.overlay.open')) document.body.style.overflow = '';
      }
      function populateTaskExams(selectedId = '') {
        const select = $('#taskExam');
        if (!select) return;
        select.replaceChildren();
        const empty = new Option('Sem concurso vinculado', '');
        select.add(empty);
        const exams = [...(state.exams || [])].sort((a, b) => {
          if (a.id === state.currentExamId) return -1;
          if (b.id === state.currentExamId) return 1;
          return String(a.name || '').localeCompare(String(b.name || ''), 'pt-BR');
        });
        exams.forEach(exam => select.add(new Option(`${exam.id === state.currentExamId ? '★ ' : ''}${exam.name}`, String(exam.id))));
        if (selectedId && !exams.some(exam => String(exam.id) === String(selectedId))) {
          select.add(new Option('Concurso excluído (vínculo antigo)', String(selectedId)));
        }
        select.value = String(selectedId || '');
      }
      function taskExamName(task) {
        if (!task.examId) return '';
        const exam = (state.exams || []).find(e => String(e.id) === String(task.examId));
        return exam ? String(exam.name || 'Concurso sem nome') : 'Concurso excluído';
      }
      function showTaskForm(task = null) {
        editTaskId = task?.id || null;
        $('#taskModalTitle').textContent = task ? 'Editar missão' : 'Nova missão';
        $('#saveTaskButton').textContent = task ? 'Salvar alterações' : 'Salvar missão';
        $('#taskTitle').value = task?.title || '';
        $('#taskSubject').value = task?.subject || '';
        populateTaskExams(task?.examId || '');
        $('#taskCycle').value = String(task ? (Number(task.cycle) || 1) : (Number(state.currentCycle) || 1));
        $('#taskImportance').value = task?.importance || 'medium';
        $('#taskDeadline').value = task?.deadline || '';
        $('#taskAccuracy').value = task ? (taskAccuracy(task, Number(task.cycle)) ?? '') : '';
        $('#taskLink').value = task?.link || '';
        openModal('taskModal');
        setTimeout(() => $('#taskTitle').focus(), 50);
      }
      function renderProfile() {
        const name = activeUser?.name || activeUser?.login || state.profile.name || 'Estudante';
        if ($('#profileName')) $('#profileName').textContent = name;
        if ($('#avatarText')) $('#avatarText').textContent = [...name][0].toUpperCase();
        for (const id of ['coinBalance', 'shopCoinBalance']) if ($('#' + id)) $('#' + id).textContent = state.coins.toLocaleString('pt-BR');
      }
      function taskAccuracy(task, cycle) {
        const values = task.accuracyByCycle || {};
        const value = values[String(cycle)];
        return value === '' || value === null || value === undefined || !Number.isFinite(Number(value)) ? null : Number(value);
      }
      function accuracyText(value) { return value === null ? '—' : `${value.toLocaleString('pt-BR', {maximumFractionDigits:2})}%`; }
      function accuracyBadge(value) {
        const cls = value === null ? 'accuracy-empty' : value < 60 ? 'accuracy-low' : value < 80 ? 'accuracy-mid' : 'accuracy-high';
        return `<span class="accuracy-badge ${cls}" aria-label="Percentual de acerto: ${accuracyText(value)}">${accuracyText(value)}</span>`;
      }
      function renderProgress() {
        const cycle = Number(state.currentCycle) || 1;
        const tasks = state.tasks.filter(t => participatedInCycle(t, cycle));
        const done = tasks.filter(t => completedInCycle(t, cycle)).length;
        const total = tasks.length;
        const pct = total ? Math.round(done / total * 100) : 0;
        if ($('#progressCopy')) $('#progressCopy').textContent = `${done} de ${total} missões concluídas`;
        if ($('#progressPercent')) $('#progressPercent').textContent = `${pct}%`;
        if ($('#progressFill')) $('#progressFill').style.width = `${pct}%`;
        if ($('#cycleProgressHeading')) $('#cycleProgressHeading').textContent = `PROGRESSO DO ${cycle}º CICLO`;
        if ($('#cycleProgressValue')) $('#cycleProgressValue').textContent = `${pct}%`;
        if ($('#cycleProgressFoot')) $('#cycleProgressFoot').textContent = `${done} de ${total} missões concluídas`;
        if ($('#progressRing')) $('#progressRing').style.setProperty('--p', `${pct}%`);
        if ($('#pendingPill')) $('#pendingPill').textContent = `${state.tasks.filter(t => Number(t.cycle) === cycle && !t.done).length} pendentes`;
        const activeCycles = new Set(state.tasks.map(t => String(t.cycle))).size;
        if ($('#cycleCountPill')) $('#cycleCountPill').textContent = `${activeCycles} ciclo(s) com missões`;
        if ($('#duePill')) $('#duePill').textContent = `${state.tasks.filter(t => Number(t.cycle) === cycle && t.deadline).length} com prazo definido`;
        if ($('#ringCycleTitle')) {
          $('#ringCycleTitle').textContent = cycle === 'all' ? 'Conclusão do ciclo atual' : `Conclusão do ${cycle}º ciclo`;
        }
        if ($('#ringSubtext')) {
          $('#ringSubtext').textContent = total ? `${total - done} ainda não concluídas neste ciclo` : '0 para concluir';
        }
        if ($('#completedTotal')) $('#completedTotal').textContent = completedTasks().length.toLocaleString('pt-BR');
        if ($('#completedFoot')) $('#completedFoot').textContent = `de ${state.tasks.length.toLocaleString('pt-BR')} missões cadastradas`;
      }
      function taskCard(task) {
        const pts = taskPoints(task);
        const due = dueLabel(task.deadline);
        const url = normalizeUrl(task.link);
        const dueColor = task.deadline && daysUntil(task.deadline) < 0 && !task.done ? ' style="color:var(--red)"' : '';
        return `<article class="task-card ${task.done ? 'completed' : ''}" data-task-id="${escapeAttr(task.id)}">
          <div class="task-topline"><div class="tag-row"><span class="tag ${pts.cls}">${pts.label} relevância</span></div><button class="task-menu" type="button" data-task-menu="${escapeAttr(task.id)}" aria-label="Opções da missão" title="Opções">···</button></div>
          <h3 class="task-title">${safeText(task.title || 'Missão sem título')}</h3><div class="task-subject">${safeText(task.subject || 'Disciplina não informada')}</div>
          ${task.examId ? `<div style="margin:6px 0 8px"><span class="tag tag-cycle" style="display:inline-block">🎯 ${safeText(taskExamName(task))}</span></div>` : ''}
          <div class="task-bottom">
          <div class="task-meta"><span${dueColor}>${iconSvg('calendar')}${safeText(due)}</span></div>
          <div class="task-history-accuracy">${[1,2,3,4].filter(c => taskAccuracy(task,c) !== null).map(c => `<span class="task-history-cycle">${c}º: ${accuracyBadge(taskAccuracy(task,c))}</span>`).join('') || '<span style="font-size:10px;color:var(--muted)">Sem percentuais registrados</span>'}</div>
          ${url ? `<a class="task-link" href="${escapeAttr(url)}" target="_blank" rel="noopener noreferrer">${iconSvg('book')} Abrir Gemini Notebook ${iconSvg('external')}</a>` : '<span class="task-link" style="color:var(--faint)">'+iconSvg('link')+' Nenhum caderno vinculado</span>'}
          <div class="task-footer"><span class="task-award">Moedas: <strong style="color:var(--yellow)">+${pts.coins} ◉</strong></span><button class="complete-btn" type="button" data-toggle-task="${escapeAttr(task.id)}">${task.done ? iconSvg('check') + ' Concluída' : iconSvg('check') + ' Concluir'}</button></div>
          </div>
        </article>`;
      }
      function filteredTasks() {
        const q = $('#searchInput').value.trim().toLocaleLowerCase('pt-BR');
        let list = state.tasks.filter(t => Number(t.cycle) === Number(state.currentCycle)).filter(t => statusFilter === 'all' || (statusFilter === 'pending' ? !t.done : t.done));
        if (q) list = list.filter(t => `${t.title} ${t.subject} ${taskExamName(t)} ${CYCLE_NAMES[t.cycle]}`.toLocaleLowerCase('pt-BR').includes(q));
        const sort = $('#sortSelect').value;
        list.sort((a, b) => {
          if (sort === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
          if (sort === 'oldest') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
          if (sort === 'deadline') return (a.deadline || '9999-12-31').localeCompare(b.deadline || '9999-12-31') || a.title.localeCompare(b.title, 'pt-BR');
          if (sort === 'importance') return taskPoints(b).rank - taskPoints(a).rank || a.title.localeCompare(b.title, 'pt-BR');
          return String(a.title || '').localeCompare(String(b.title || ''), 'pt-BR', { sensitivity: 'base' });
        });
        return list;
      }
      function renderTasks() {
        const list = filteredTasks();
        $('#visibleTaskCount').textContent = list.length;
        if (!list.length) {
          const hasTasks = state.tasks.length > 0;
          const title = hasTasks ? 'Nenhuma missão encontrada' : 'Seu próximo nível começa aqui';
          const copy = hasTasks ? 'Não há missões com esses filtros no ciclo atual. Selecione outro ciclo acima ou limpe a busca.' : 'Adicione seu primeiro item do edital ou importe uma planilha CSV pelas configurações para montar seu plano de estudos.';
          $('#taskGrid').innerHTML = `<div class="empty-state"><div class="empty-icon">${iconSvg(hasTasks ? 'book' : 'plus')}</div><h3>${title}</h3><p>${copy}</p><button class="btn btn-primary" type="button" id="emptyAddButton">${hasTasks ? 'Limpar filtros' : 'Criar primeira missão'}</button></div>`;
          $('#emptyAddButton')?.addEventListener('click', () => { if (hasTasks) { $('#searchInput').value = ''; setStatusFilter('all'); renderTasks(); } else showTaskForm(); });
        } else {
          $('#taskGrid').innerHTML = list.map(taskCard).join('');
        }
      }
      function renderShop() {
        $('#rewardCount').textContent = `${state.rewards.length} itens`;
        if (!state.rewards.length) {
          $('#shopGrid').innerHTML = '<div class="empty-state" style="min-height:210px"><div class="empty-icon">🎁</div><h3>Sua loja está esperando</h3><p>Crie uma recompensa ao lado, defina o preço em moedas e tenha algo legal para buscar ao cumprir suas metas.</p></div>';
        } else {
          $('#shopGrid').innerHTML = state.rewards.map((reward, index) => {
            const affordable = state.coins >= reward.cost;
            return `<article class="shop-card" data-reward-id="${escapeAttr(reward.id)}"><div class="shop-card-head"><div class="shop-symbol">${safeText(reward.icon || REWARD_ICONS[index % REWARD_ICONS.length])}</div><div class="shop-cost">◉ ${Number(reward.cost).toLocaleString('pt-BR')}</div></div><h3>${safeText(reward.name)}</h3><p>${safeText(reward.description || 'Uma recompensa pela sua dedicação.')}</p><div class="shop-card-bottom"><span class="owned-tag">${affordable ? 'Disponível para resgate' : `Faltam ${(reward.cost - state.coins).toLocaleString('pt-BR')} moedas`}</span><div style="display:flex;gap:5px"><button class="icon-btn" type="button" data-edit-reward="${escapeAttr(reward.id)}" aria-label="Editar recompensa" title="Editar" style="width:30px;height:30px">${iconSvg('edit')}</button><button class="icon-btn" type="button" data-delete-reward="${escapeAttr(reward.id)}" aria-label="Excluir recompensa" title="Excluir" style="width:30px;height:30px">${iconSvg('trash')}</button><button class="btn btn-small ${affordable ? 'btn-primary' : ''}" type="button" data-buy-reward="${escapeAttr(reward.id)}" ${affordable ? '' : 'disabled'}>Resgatar</button></div></div></article>`;
          }).join('');
        }
        if (!state.redemptions.length) {
          $('#redemptionHistory').innerHTML = '<p style="color:var(--muted);font-size:11px;margin:0">Nenhuma recompensa resgatada ainda.</p>';
        } else {
          $('#redemptionHistory').innerHTML = `<div style="display:grid;gap:8px">${state.redemptions.slice(0,8).map(item => `<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;padding:9px 0;border-bottom:1px solid var(--border)"><div><strong style="display:block;font-size:11px">${safeText(item.name)}</strong><span style="color:var(--muted);font-size:10px">${new Date(item.date).toLocaleDateString('pt-BR')}</span></div><span style="color:var(--yellow);font-size:10px;font-weight:800">−${Number(item.cost).toLocaleString('pt-BR')} ◉</span></div>`).join('')}</div>`;
        }
      }
      function renderAll() { if ($('#currentCycleSelect')) $('#currentCycleSelect').value = String(state.currentCycle); renderProfile(); renderProgress(); renderTasks(); renderShop(); renderExams(); }
      function seedInitialMissions() {
        const seedKey = 'TCE_GO_Analise_FCC_Espacado_v1';
        const seededSets = Array.isArray(state.seededMissionSets) ? state.seededMissionSets : [];
        if (seededSets.includes(seedKey)) return;
        const existingKeys = new Set(state.tasks.map(task => String(task.title || '').trim() + '|||' + normalizeUrl(task.link || '')));
        const now = new Date().toISOString();
        const newTasks = [];
        INITIAL_MISSION_ROWS.forEach(row => {
          const key = row[0] + '|||' + normalizeUrl(row[1]);
          if (existingKeys.has(key)) return;
          existingKeys.add(key);
          newTasks.push({
            id: makeId(), title: row[0], link: normalizeUrl(row[1]), subject: MISSION_CATEGORIES[row[2]] || row[2],
            deadline: '', cycle: 1, importance: MISSION_IMPORTANCE[row[3]] || 'medium', done: false,
            createdAt: now, updatedAt: now
          });
        });
        state.seededMissionSets = seededSets.concat(seedKey);
        if (newTasks.length) state.tasks.push(...newTasks);
        if (!saveState()) { renderAll(); return; }
        if (newTasks.length) toast(newTasks.length + ' missão(ões) adicionada(s)', 'TCE-GO: títulos, links, disciplinas e relevância FCC importados para o 1º Ciclo.');
      }
      function setStatusFilter(filter) {
        statusFilter = filter;
        $$('[data-status]').forEach(btn => btn.classList.toggle('active', btn.dataset.status === filter));
      }
      function setView(view) {
        currentView = view;
        $('#tasksView').classList.toggle('hidden', view !== 'tasks');
        $('#shopView').classList.toggle('hidden', view !== 'shop');
        $('#examsView').classList.toggle('hidden', view !== 'exams');
        if (view === 'exams') renderExams();
        $('#taskDock').classList.toggle('compact-mode', view !== 'tasks');
        $$('.nav-tab').forEach(tab => tab.classList.toggle('active', tab.dataset.view === view));
      }
      function addOrUpdateTask(event) {
        event.preventDefault();
        const title = $('#taskTitle').value.trim();
        if (!title) { toast('Título obrigatório', 'Informe o título da missão antes de salvar.', 'neutral'); $('#taskTitle').focus(); return; }
        const rawLink = $('#taskLink').value.trim();
        const link = rawLink ? normalizeUrl(rawLink) : '';
        if (rawLink && !link) { toast('Link inválido', 'Use um endereço começando por http:// ou https://, ou um domínio válido.', 'neutral'); return; }
        const existing = editTaskId ? state.tasks.find(t => t.id === editTaskId) : null;
        const accuracyRaw = $('#taskAccuracy').value.trim();
        const accuracy = accuracyRaw === '' ? null : Number(accuracyRaw.replace(',', '.'));
        if (accuracy !== null && (!Number.isFinite(accuracy) || accuracy < 0 || accuracy > 100)) { toast('Percentual inválido', 'Informe um valor entre 0 e 100.', 'neutral'); return; }
        const targetCycle = Number($('#taskCycle').value) || 1;
        const accuracyByCycle = { ...(existing?.accuracyByCycle || {}) };
        if (accuracy === null) delete accuracyByCycle[String(targetCycle)];
        else accuracyByCycle[String(targetCycle)] = accuracy;
        const task = {
          id: existing?.id || makeId(), title,
          subject: $('#taskSubject').value.trim(), link, examId: $('#taskExam').value || '',
          deadline: $('#taskDeadline').value || '', cycle: Number($('#taskCycle').value) || 1,
          importance: $('#taskImportance').value, done: existing?.done || false, accuracyByCycle,
          createdAt: existing?.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString()
        };
        if (existing) {
          task.history = Array.isArray(existing.history) ? [...existing.history] : [];
          const changed = ['title','subject','examId','link','deadline','cycle','importance'].filter(key => String(existing[key] ?? '') !== String(task[key] ?? ''));
          if (taskAccuracy(existing, targetCycle) !== taskAccuracy(task, targetCycle)) changed.push('accuracyByCycle');
          if (changed.length) task.history.push({ type: 'edit', at: task.updatedAt, changes: changed.map(key => key === 'accuracyByCycle' ? ({ field: `% de acerto ciclo ${targetCycle}`, before: accuracyText(taskAccuracy(existing,targetCycle)), after: accuracyText(taskAccuracy(task,targetCycle)) }) : ({ field: key === 'examId' ? 'Concurso' : key, before: key === 'examId' ? (taskExamName(existing) || 'Sem concurso') : (existing[key] ?? ''), after: key === 'examId' ? (taskExamName(task) || 'Sem concurso') : (task[key] ?? '') })) });
          state.tasks = state.tasks.map(t => t.id === existing.id ? task : t);
        }
        else state.tasks.push(task);
        if (!saveState()) return;
        closeModal('taskModal'); renderAll();
        toast(existing ? 'Missão atualizada' : 'Missão criada', existing ? 'As alterações foram salvas.' : 'Sua nova missão já está no quadro.');
      }
      function requestTaskCompletion(id) {
        const task = state.tasks.find(t => t.id === id);
        if (!task || task.done) return;
        completionTaskId = id;
        const previous = taskAccuracy(task, Number(task.cycle));
        $('#completionMissionTitle').textContent = task.title;
        $('#completionCycleHint').textContent = `Informe o resultado do ${task.cycle}º ciclo (0 a 100%).`;
        $('#completionAccuracy').value = previous === null ? '' : String(previous);
        openModal('completionModal');
        $('#completionAccuracy').focus();
      }
      function confirmTaskCompletion(event) {
        event.preventDefault();
        const id = completionTaskId;
        if (!id || !state.tasks.some(task => task.id === id && !task.done)) {
          toast('Não foi possível concluir', 'Abra novamente a missão e tente outra vez.', 'neutral');
          return;
        }
        const value = $('#completionAccuracy').value.trim().replace(',', '.');
        const accuracy = value === '' ? NaN : Number(value);
        if (!Number.isFinite(accuracy) || accuracy < 0 || accuracy > 100) {
          toast('Percentual inválido', 'Informe um número de 0 a 100.', 'neutral');
          return;
        }
        completionTaskId = null;
        setTaskDone(id, true, accuracy);
        closeModal('completionModal');
      }
      function setTaskDone(id, done, newAccuracy = null) {
        const task = state.tasks.find(t => t.id === id);
        if (!task || task.done === done) return;
        const cycle = Number(task.cycle);
        if (done && (!Number.isFinite(newAccuracy) || newAccuracy < 0 || newAccuracy > 100)) {
          requestTaskCompletion(id);
          return;
        }
        const pts = taskPoints(task);
        const snapshot = {
          task: JSON.parse(JSON.stringify(task)),
          xp: state.xp, coins: state.coins
        };
        const at = new Date().toISOString();
        task.history = Array.isArray(task.history) ? task.history : [];
        if (done) {
          task.accuracyByCycle = { ...(task.accuracyByCycle || {}), [String(cycle)]: newAccuracy };
          task.history.push({ type: 'status', at, done: true, accuracy: newAccuracy, cycle });
          state.coins += pts.coins;
          if (cycle < 4) {
            task.history.push({
              type: 'cycle_transfer', at, from: cycle, to: cycle + 1,
              previousDone: true, previousDeadline: task.deadline || '',
              previousAccuracy: newAccuracy
            });
            task.cycle = cycle + 1;
            task.deadline = '';
            task.done = false;
          } else {
            // No 4º ciclo, a missão permanece concluída: não existe um 5º ciclo.
            task.done = true;
          }
        } else {
          task.done = false;
          task.history.push({ type: 'status', at, done: false });
          state.coins = Math.max(0, state.coins - pts.coins);
        }
        task.updatedAt = at;
        if (!saveState()) {
          Object.keys(task).forEach(key => delete task[key]);
          Object.assign(task, snapshot.task);
          state.xp = snapshot.xp;
          state.coins = snapshot.coins;
          return;
        }
        renderAll();
        if (done) {
          const moved = cycle < 4;
          toast(moved ? `Missão concluída e transferida!` : `Missão concluída!`,
            moved ? `Acerto do ${cycle}º ciclo: ${accuracyText(newAccuracy)}. Agora no ${cycle+1}º ciclo, pendente e sem prazo. +${pts.coins} moedas.` : `Acerto do 4º ciclo registrado. +${pts.coins} moedas.`,
            'success', () => {
              const current = state.tasks.find(t => t.id === id);
              if (!current) return;
              Object.keys(current).forEach(key => delete current[key]);
              Object.assign(current, JSON.parse(JSON.stringify(snapshot.task)));
              state.xp = snapshot.xp;
              state.coins = snapshot.coins;
              if (!saveState()) { renderAll(); return; } renderAll();
              toast('Conclusão desfeita', 'O ciclo, o prazo e os pontos anteriores foram restaurados.', 'neutral');
            });
        } else {
          toast('Missão reaberta', `−${pts.coins} moedas.`, 'neutral', () => {
            const current = state.tasks.find(t => t.id === id);
            if (!current) return;
            Object.keys(current).forEach(key => delete current[key]);
            Object.assign(current, JSON.parse(JSON.stringify(snapshot.task)));
            state.xp = snapshot.xp;
            state.coins = snapshot.coins;
            if (!saveState()) { renderAll(); return; } renderAll();
            toast('Alteração desfeita', 'O estado anterior da missão foi restaurado.', 'neutral');
          });
        }
      }
      function duplicateTask(id) {
        const original = state.tasks.find(t => t.id === id); if (!original) return;
        const clone = { ...original, id: makeId(), accuracyByCycle: { ...(original.accuracyByCycle || {}) }, history: [], title: original.title, done: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        state.tasks.push(clone); if (!saveState()) { renderAll(); return; } renderAll(); toast('Missão duplicada', 'A cópia foi criada como pendente.');
      }
      function deleteTask(id) {
        const task = state.tasks.find(t => t.id === id); if (!task) return;
        if (!confirm(`Excluir a missão "${task.title}"?${task.done ? '\nOs pontos já conquistados permanecerão no seu perfil.' : ''}`)) return;
        state.tasks = state.tasks.filter(t => t.id !== id); if (!saveState()) { renderAll(); return; } renderAll(); toast('Missão excluída', 'O item foi removido do quadro.', 'neutral');
      }
      function openTaskContext(id, button) {
        contextTaskId = id;
        const menu = $('#taskContextMenu');
        menu.innerHTML = `<button class="context-item" data-action="edit">${iconSvg('edit')} Editar missão</button><button class="context-item" data-action="history">${iconSvg('book')} Ver histórico</button><button class="context-item" data-action="duplicate">${iconSvg('copy')} Duplicar missão</button><button class="context-item ${state.tasks.find(t=>t.id===id)?.done ? '' : 'danger'}" data-action="delete">${iconSvg('trash')} Excluir missão</button>`;
        const rect = button.getBoundingClientRect();
        menu.style.left = `${Math.max(8, Math.min(window.innerWidth - 170, rect.right - 155))}px`;
        menu.style.top = `${Math.min(window.innerHeight - 145, rect.bottom + 5)}px`;
        menu.classList.remove('hidden');
      }
      function closeTaskContext() { $('#taskContextMenu').classList.add('hidden'); }
      function duplicateCycle(event) {
        event.preventDefault();
        const from = Number($('#cycleFrom').value), to = Number($('#cycleTo').value), days = Number($('#cycleOffset').value) || 0;
        if (from === to) { toast('Selecione ciclos diferentes', 'A origem e o destino precisam ser distintos.', 'neutral'); return; }
        const sources = state.tasks.filter(t => Number(t.cycle) === from);
        if (!sources.length) { toast('Nenhuma missão para copiar', `${CYCLE_NAMES[from]} não possui itens cadastrados.`, 'neutral'); return; }
        const copies = sources.map(t => {
          let deadline = t.deadline || '';
          if (deadline) { const d = new Date(`${deadline}T12:00:00`); d.setDate(d.getDate() + days); deadline = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
          return { ...t, id: makeId(), history: [], cycle: to, deadline, done: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        });
        state.tasks.push(...copies); if (!saveState()) { renderAll(); return; } renderAll(); closeModal('cycleModal');
        toast(`${copies.length} missão(ões) duplicada(s)`, `De ${CYCLE_NAMES[from]} para ${CYCLE_NAMES[to]}, com ${days >= 0 ? '+' : ''}${days} dia(s) nos prazos.`);
      }
      function moveCycle(event) {
        if (event) event.preventDefault();
        const fromField = $('#moveCycleFrom');
        const toField = $('#moveCycleTo');
        const from = Number(fromField?.value);
        const to = Number(toField?.value);
        if (![1, 2, 3, 4].includes(from) || ![1, 2, 3, 4].includes(to)) {
          toast('Ciclo inválido', 'Selecione ciclos de origem e destino válidos.', 'neutral'); return;
        }
        if (from === to) {
          toast('Selecione ciclos diferentes', 'Origem e destino devem ser distintos.', 'neutral'); return;
        }
        const sources = state.tasks.filter(task => Number(task.cycle) === from);
        if (!sources.length) {
          toast('Ciclo vazio', `${CYCLE_NAMES[from]} não possui missões.`, 'neutral'); return;
        }
        if (!window.confirm(`Transferir ${sources.length} missão(ões) do ${CYCLE_NAMES[from]} para o ${CYCLE_NAMES[to]}?\n\nAs missões serão movidas sem duplicar. As conclusões e prazos serão reiniciados. Histórico, percentuais dos ciclos anteriores e moedas permanecerão salvos.`)) return;

        const backup = JSON.stringify(state.tasks);
        const at = new Date().toISOString();
        try {
          for (const task of sources) {
            const previousAccuracy = taskAccuracy(task, from);
            task.history = Array.isArray(task.history) ? task.history : [];
            task.history.push({
              type: 'cycle_transfer', at, from, to,
              previousDone: Boolean(task.done),
              previousDeadline: task.deadline || '', previousAccuracy
            });
            task.cycle = to;
            task.deadline = '';
            task.done = false;
            task.updatedAt = at;
          }
          if (!saveState()) {
            state.tasks = JSON.parse(backup);
            return;
          }
          closeModal('cycleModal');
          renderAll();
          toast('Transferência concluída', `${sources.length} missão(ões): ${CYCLE_NAMES[from]} → ${CYCLE_NAMES[to]}. Prazos e conclusões reiniciados; histórico e acertos mantidos.`);
        } catch (error) {
          state.tasks = JSON.parse(backup);
          console.error('Erro ao transferir missões:', error);
          toast('Erro na transferência', 'Não foi possível concluir a operação. Nenhuma missão foi alterada nesta tentativa.', 'neutral');
        }
      }

      function showTaskHistory(id) {
        const task = state.tasks.find(t => t.id === id);
        if (!task) return;
        $('#historyMissionTitle').textContent = task.title || 'Missão sem título';
        const history = Array.isArray(task.history) ? [...task.history].reverse() : [];
        $('#historyModalBody').innerHTML = history.length ? history.map(entry => {
          const date = entry.at && !Number.isNaN(Date.parse(entry.at)) ? new Date(entry.at).toLocaleString('pt-BR') : 'Data não informada';
          let detail = '';
          if (entry.type === 'cycle_transfer') detail = `Transferência: ${CYCLE_NAMES[entry.from] || entry.from} → ${CYCLE_NAMES[entry.to] || entry.to}` + (Object.hasOwn(entry, 'previousDone') ? ` | Antes: ${entry.previousDone ? 'concluída' : 'pendente'}, prazo: ${entry.previousDeadline || 'sem prazo'}, acerto: ${accuracyText(entry.previousAccuracy ?? null)} | Depois: pendente, sem prazo` : ' | Status e prazo anteriores não registrados');
          else if (entry.type === 'status') detail = `${entry.done ? 'Missão concluída' : 'Missão reaberta'}${entry.done && entry.accuracy !== undefined ? ` | Acerto no ${entry.cycle}º ciclo: ${accuracyText(entry.accuracy)}` : ''}${entry.undo ? ' (desfazer)' : ''}`;
          else if (entry.type === 'edit') detail = 'Alterações: ' + (entry.changes || []).map(c => `${c.field}: "${c.before}" → "${c.after}"`).join('; ');
          else detail = 'Alteração registrada';
          return `<div style="padding:11px 0;border-bottom:1px solid var(--border)"><strong style="font-size:11px">${safeText(date)}</strong><p style="color:var(--muted);font-size:11px;overflow-wrap:anywhere;margin:5px 0 0">${safeText(detail)}</p></div>`;
        }).join('') : '<p class="subsection-copy">Ainda não há registros de alterações para esta missão. As próximas alterações serão registradas aqui.</p>';
        openModal('historyModal');
      }

      function deleteCycle(event) {
        event.preventDefault();
        const cycle = Number($('#cycleDelete').value);
        const count = state.tasks.filter(t => Number(t.cycle) === cycle).length;
        if (!count) { toast('Ciclo vazio', `${CYCLE_NAMES[cycle]} não possui missões.`, 'neutral'); return; }
        if (!confirm(`Excluir permanentemente as ${count} missão(ões) do ${CYCLE_NAMES[cycle]}?\n\nAs moedas já ganhas serão mantidas.`)) return;
        state.tasks = state.tasks.filter(t => Number(t.cycle) !== cycle); if (!saveState()) { renderAll(); return; } renderAll(); closeModal('cycleModal');
        toast('Ciclo excluído', `${count} missão(ões) removida(s).`, 'neutral');
      }
      function addReward(event) {
        event.preventDefault();
        const name = $('#rewardName').value.trim(); const cost = Number($('#rewardCost').value);
        if (!name || !Number.isInteger(cost) || cost < 1) { toast('Confira os dados', 'Informe o nome e um preço inteiro maior que zero.', 'neutral'); return; }
        state.rewards.push({ id: makeId(), name, description: $('#rewardDescription').value.trim(), cost, icon: REWARD_ICONS[state.rewards.length % REWARD_ICONS.length], createdAt: new Date().toISOString() });
        if (!saveState()) { renderAll(); return; } $('#rewardForm').reset(); renderShop(); toast('Recompensa criada', 'Seu novo prêmio já está disponível na loja.');
      }
      function buyReward(id) {
        const reward = state.rewards.find(r => r.id === id); if (!reward) return;
        if (state.coins < reward.cost) { toast('Moedas insuficientes', 'Conclua mais missões para juntar moedas.', 'neutral'); return; }
        if (!confirm(`Resgatar "${reward.name}" por ${reward.cost} moedas?`)) return;
        state.coins -= reward.cost;
        state.redemptions.unshift({ id: makeId(), rewardId: reward.id, name: reward.name, cost: reward.cost, date: new Date().toISOString() });
        if (!saveState()) { renderAll(); return; } renderAll(); toast('Recompensa resgatada!', `${reward.name} — aproveite seu prêmio.`);
      }
      function editReward(id) {
        const reward = state.rewards.find(r => r.id === id); if (!reward) return;
        $('#editRewardId').value = id; $('#editRewardName').value = reward.name; $('#editRewardDescription').value = reward.description || ''; $('#editRewardCost').value = reward.cost; openModal('editRewardModal');
      }
      function saveEditedReward(event) {
        event.preventDefault();
        const id = $('#editRewardId').value; const reward = state.rewards.find(r => r.id === id); if (!reward) return;
        const cost = Number($('#editRewardCost').value);
        if (!Number.isInteger(cost) || cost < 1) { toast('Preço inválido', 'Use um número inteiro maior que zero.', 'neutral'); return; }
        reward.name = $('#editRewardName').value.trim(); reward.description = $('#editRewardDescription').value.trim(); reward.cost = cost;
        if (!saveState()) { renderAll(); return; } closeModal('editRewardModal'); renderShop(); toast('Recompensa atualizada', 'As alterações foram salvas.');
      }
      function deleteReward(id) {
        const reward = state.rewards.find(r => r.id === id); if (!reward) return;
        if (!confirm(`Excluir a recompensa "${reward.name}"? O histórico de resgates será mantido.`)) return;
        state.rewards = state.rewards.filter(r => r.id !== id); if (!saveState()) { renderAll(); return; } renderShop(); toast('Recompensa excluída', 'O item foi removido da loja.', 'neutral');
      }
      function parseCsv(text) {
        const input = text.replace(/^\uFEFF/, '');
        // Planilhas brasileiras normalmente usam ponto e vírgula; outros CSVs usam vírgula.
        // Detecta o separador na primeira linha, ignorando separadores dentro de aspas.
        let commas = 0, semicolons = 0, quotedHeader = false;
        for (let i = 0; i < input.length && input[i] !== '\n' && input[i] !== '\r'; i++) {
          if (input[i] === '"') {
            if (quotedHeader && input[i + 1] === '"') i++;
            else quotedHeader = !quotedHeader;
          } else if (!quotedHeader && input[i] === ',') commas++;
          else if (!quotedHeader && input[i] === ';') semicolons++;
        }
        const delimiter = semicolons > commas ? ';' : ',';
        const rows = []; let row = []; let cell = ''; let quoted = false;
        for (let i = 0; i < input.length; i++) {
          const ch = input[i];
          if (ch === '"') {
            if (quoted && input[i + 1] === '"') { cell += '"'; i++; }
            else quoted = !quoted;
          } else if (ch === delimiter && !quoted) { row.push(cell); cell = ''; }
          else if ((ch === '\n' || ch === '\r') && !quoted) {
            if (ch === '\r' && input[i + 1] === '\n') i++;
            row.push(cell); if (row.some(v => v.trim() !== '')) rows.push(row); row = []; cell = '';
          } else cell += ch;
        }
        row.push(cell); if (row.some(v => v.trim() !== '')) rows.push(row);
        return rows;
      }
      function importCsvFile(file) {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const rows = parseCsv(String(reader.result || ''));
            if (!rows.length) { toast('CSV vazio', 'O arquivo não contém linhas para importar.', 'neutral'); return; }
            const norm = s => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
            const headerWords = rows[0].map(norm);
            const hasHeader = headerWords.some(v => /item do edital|titulo|title|link do notebook|disciplina|materia|relevancia|importancia/.test(v));
            const headers = hasHeader ? headerWords : [];
            const findCol = regexes => headers.findIndex(h => regexes.some(re => re.test(h)));
            const titleCol = hasHeader ? findCol([/item do edital/, /^titulo$/, /^title$/]) : 0;
            const linkCol = hasHeader ? findCol([/link do notebook/, /^link$/, /notebook/, /url/]) : 1;
            const subjectCol = hasHeader ? findCol([/^disciplina$/, /^materia$/, /subject/]) : 2;
            const cycleCol = hasHeader ? findCol([/^ciclo$/, /^cycle$/]) : -1;
            const deadlineCol = hasHeader ? findCol([/^prazo$/, /^deadline$/]) : -1;
            const doneCol = hasHeader ? findCol([/^concluida$/, /^done$/]) : -1;
            const importanceCol = hasHeader ? findCol([/relevancia/, /importancia/, /importance/]) : 3;
            const dataRows = hasHeader ? rows.slice(1) : rows;
            const imported = [];
            dataRows.forEach(cols => {
              const title = String(cols[titleCol >= 0 ? titleCol : 0] || '').trim();
              if (!title) return;
              const linkRaw = linkCol >= 0 ? String(cols[linkCol] || '').trim() : '';
              const normalizedImportance = norm(importanceCol >= 0 ? cols[importanceCol] : 'medio');
              let importance = 'medium';
              if (/alta|high|^h$/.test(normalizedImportance)) importance = 'high';
              else if (/baixa|low|^l$/.test(normalizedImportance)) importance = 'low';
              const subject = subjectCol >= 0 ? String(cols[subjectCol] || '').trim() : '';
              imported.push({ id: makeId(), title, link: linkRaw ? normalizeUrl(linkRaw) : '', subject, deadline: deadlineCol >= 0 ? String(cols[deadlineCol] || '').trim() : '', cycle: Math.min(4, Math.max(1, Number(String(cols[cycleCol] || '1').match(/[1-4]/)?.[0] || 1))), importance, done: doneCol >= 0 && /^(sim|true|1)$/.test(norm(cols[doneCol])), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
            });
            if (!imported.length) { toast('Nenhuma missão importada', 'Confira o cabeçalho e a primeira coluna do CSV.', 'neutral'); return; }
            const rejectedLinks = imported.filter(t => t.link === '' && t.title && dataRows.some(r => String(r[linkCol] || '').trim() && String(r[titleCol >= 0 ? titleCol : 0] || '').trim() === t.title)).length;
            state = validateState({ ...state, tasks: [...state.tasks, ...imported] }); if (!saveState()) { renderAll(); return; } renderAll();
            toast(`${imported.length} missão(ões) importada(s)`, `Ciclos, prazos e conclusões preservados. XP e moedas não foram alterados.${rejectedLinks ? ` ${rejectedLinks} link(s) inválido(s) foram ignorados.` : ''}`);
          } catch (error) { console.error(error); toast('Erro ao importar CSV', 'Confira se o arquivo está no formato CSV.', 'neutral'); }
          $('#csvFileInput').value = '';
        };
        reader.onerror = () => { toast('Falha na leitura', 'Não foi possível abrir este arquivo.', 'neutral'); $('#csvFileInput').value = ''; };
        reader.readAsText(file, 'UTF-8');
      }
      function downloadBlob(content, filename, type) {
        const blob = new Blob([content], { type }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
      function exportCsv() {
        const headers = ['Item do Edital','Link do Notebook','Disciplina','Importância / Relevância','Ciclo','Prazo','Concluída'];
        const quote = value => `"${String(value ?? '').replace(/"/g, '""')}"`;
        const lines = [headers, ...state.tasks.map(t => [t.title, t.link, t.subject, IMPORTANCE[t.importance]?.label || 'Média', CYCLE_NAMES[t.cycle] || '1º Ciclo', t.deadline, t.done ? 'Sim' : 'Não'])].map(row => row.map(quote).join(';')).join('\r\n');
        downloadBlob('\uFEFF' + lines, `aura-tracker-missoes-${new Date().toISOString().slice(0,10)}.csv`, 'text/csv;charset=utf-8;');
        toast('CSV exportado', 'O arquivo foi preparado para download.');
      }
      function backupData() {
        const payload = { ...state, exportedAt: new Date().toISOString(), app: 'Aura Tracker' };
        downloadBlob(JSON.stringify(payload, null, 2), `aura-tracker-backup-${new Date().toISOString().slice(0,10)}.json`, 'application/json;charset=utf-8;');
        toast('Backup criado', 'Guarde o arquivo JSON em um local seguro.');
      }
      function restoreBackup(file) {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const parsed = JSON.parse(String(reader.result || ''));
            if (!parsed || !Array.isArray(parsed.tasks) || !Array.isArray(parsed.rewards) || !Number.isFinite(Number(parsed.xp)) || !Number.isFinite(Number(parsed.coins))) throw new Error('Estrutura inválida');
            if (!confirm(`Restaurar este backup?\n\nMissões: ${parsed.tasks.length}\nRecompensas: ${parsed.rewards.length}\n\nOs dados atuais deste navegador serão substituídos.`)) return;
            state = validateState(parsed);
            if (!saveState()) { renderAll(); return; } renderAll(); toast('Backup restaurado', 'Seus dados foram carregados neste navegador.');
          } catch (error) { console.error(error); toast('Backup inválido', 'Selecione um arquivo JSON de backup do Aura Tracker.', 'neutral'); }
          $('#backupFileInput').value = '';
        };
        reader.onerror = () => { toast('Falha ao ler backup', 'Tente selecionar o arquivo novamente.', 'neutral'); $('#backupFileInput').value = ''; };
        reader.readAsText(file, 'UTF-8');
      }

      function examDate(value) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ''))) return null;
        const [year,month,day] = value.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date : null;
      }
      function examDateText(value) { const d = examDate(value); return d ? d.toLocaleDateString('pt-BR') : 'Não informada'; }
      function examDays(value) {
        const d = examDate(value); if (!d) return null;
        const now = new Date();
        const todayUTC = Date.UTC(now.getFullYear(),now.getMonth(),now.getDate());
        return Math.round((Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()) - todayUTC) / 86400000);
      }
      function examCard(item,isCurrent) {
        const days=examDays(item.examDate);
        const countdown=days===null?'<strong>—</strong><span>Sem data</span>':days<0?`<strong>${Math.abs(days)}</strong><span>dias desde a prova</span>`:days===0?'<strong>Hoje</strong><span>Dia da prova!</span>':`<strong>${days}</strong><span>dias para a prova</span>`;
        const fee=Number(item.fee);
        return `<article class="exam-card ${isCurrent?'current':''}" data-exam-id="${escapeAttr(item.id)}" tabindex="-1">
          ${isCurrent?'<div class="exam-tag">★ PRIORIDADE ATUAL</div>':''}
          <div class="exam-card-top"><div><h3>${safeText(item.name)}</h3><div style="font-size:12px;color:var(--muted)">Banca: <strong>${safeText(item.board||'Não informada')}</strong></div></div><div class="exam-countdown">${countdown}</div></div>
          <div class="exam-registration-status ${item.registered?'registered':''}">${item.registered?'✅ INSCRIÇÃO REALIZADA':'○ INSCRIÇÃO NÃO REALIZADA'}</div>
          <div class="exam-details"><div><small>Início das inscrições</small><strong>${examDateText(item.registrationStartDate ?? item.registrationDate)}</strong></div><div><small>Último dia para se inscrever</small><strong>${examDateText(item.registrationEndDate)}</strong></div><div><small>Taxa de inscrição</small><strong>${item.fee!==''&&item.fee!=null&&Number.isFinite(fee)?fee.toLocaleString('pt-BR',{style:'currency',currency:'BRL'}):'Não informada'}</strong></div><div><small>Data da prova</small><strong>${examDateText(item.examDate)}</strong></div><div><small>Status</small><strong>${isCurrent?'Concurso atual':'No radar'}</strong></div></div>
          ${normalizeUrl(item.noticeUrl) ? `<a class="btn btn-small" href="${escapeAttr(normalizeUrl(item.noticeUrl))}" target="_blank" rel="noopener noreferrer">Abrir edital ${iconSvg('external')}</a>` : ''}
          <div class="exam-actions">${isCurrent?'':`<button class="btn btn-small btn-primary" type="button" data-exam-action="promote" data-exam-id="${escapeAttr(item.id)}">★ Tornar atual</button>`}<button class="btn btn-small" type="button" data-exam-action="toggle-registration" data-exam-id="${escapeAttr(item.id)}">${item.registered?'↩ Desmarcar inscrição':'✓ Marcar inscrição realizada'}</button><button class="btn btn-small" type="button" data-exam-action="edit" data-exam-id="${escapeAttr(item.id)}">Editar</button><button class="btn btn-small btn-quiet" type="button" data-exam-action="delete" data-exam-id="${escapeAttr(item.id)}">Excluir</button></div>
        </article>`;
      }
      function renderExams() {
        renderRegistrationAlerts();
        const exams=Array.isArray(state.exams)?state.exams:[];
        $('#examCount').textContent=String(exams.length);
        const current=exams.find(e=>e.id===state.currentExamId);
        $('#currentExam').innerHTML=current?examCard(current,true):'<div class="empty-state" style="min-height:115px"><p>Nenhum concurso atual selecionado. Cadastre um concurso ou escolha “Tornar atual” no radar.</p></div>';
        const radar=exams.filter(e=>e.id!==state.currentExamId).sort((a,b)=>(a.examDate||'9999').localeCompare(b.examDate||'9999'));
        $('#radarExams').innerHTML=radar.length?radar.map(e=>examCard(e,false)).join(''):'<div class="empty-state" style="min-height:120px"><p>Nenhum outro concurso no radar.</p></div>';
      }
      function renderRegistrationAlerts() {
        const alerts = registrationAlerts(state.exams || []);
        const container = $('#registrationAlerts');
        container.classList.toggle('hidden', alerts.length === 0);
        const content = alerts.map(({ exam, days }) => {
          const deadline = days === 0 ? 'Último dia de inscrição: hoje!' : days === 1 ? 'Inscrições terminam amanhã.' : `Faltam ${days} dias para o fim das inscrições.`;
          return `<div class="registration-alert-row"><div><strong>${safeText(exam.name)}</strong><p>${safeText(deadline)} Prazo: ${examDateText(exam.registrationEndDate)}.</p></div><button class="btn btn-small" type="button" data-registration-exam="${escapeAttr(exam.id)}">Ver concurso</button></div>`;
        }).join('');
        const list = $('#registrationAlertList');
        if (list.innerHTML !== content) list.innerHTML = content;
      }
      function showExamForm(item=null) {
        editingExamId=item?.id||null;
        $('#examModalTitle').textContent=item?'Editar concurso':'Adicionar concurso';
        $('#examForm').reset();
        $('#examFormMessage').textContent = '';
        $('#examName').value=item?.name||'';
        $('#examBoard').value=item?.board||'';
        $('#examRegistration').value=item?.registrationStartDate ?? item?.registrationDate ?? '';
        $('#examRegistrationEnd').value=item?.registrationEndDate||'';
        $('#examNoticeUrl').value=item?.noticeUrl||'';
        $('#examFee').value=item?.fee!==undefined&&item?.fee!==''?String(item.fee).replace('.',','):'';
        $('#examDate').value=item?.examDate||'';
        $('#examRegistered').checked=Boolean(item?.registered);
        openModal('examModal');
        $('#examName').focus();
      }
      function saveExam(event) {
        if (event) event.preventDefault();
        const message = $('#examFormMessage');
        const reportError = (detail) => {
          message.textContent = detail;
          message.style.color = '#ef7777';
          toast('Confira os dados', detail, 'neutral');
        };
        try {
          message.textContent = '';
          const name = $('#examName').value.trim();
          const board = $('#examBoard').value.trim();
          const registrationDate = $('#examRegistration').value;
          const registrationEndDate = $('#examRegistrationEnd').value;
          const noticeRaw = $('#examNoticeUrl').value.trim();
          const noticeUrl = noticeRaw ? normalizeUrl(noticeRaw) : '';
          const examDateValue = $('#examDate').value;
          const rawFee = $('#examFee').value.trim();
          const normalizedFee = rawFee.replace(/\s|R\$/gi, '').replace(/\./g, '').replace(',', '.');
          const fee = normalizedFee === '' ? '' : Number(normalizedFee);
          if (!name) { reportError('Informe o nome do concurso.'); $('#examName').focus(); return; }
          if (!examDate(examDateValue)) { reportError('Informe uma data válida para a prova.'); $('#examDate').focus(); return; }
          if (registrationDate && !examDate(registrationDate)) { reportError('Confira a data de inscrição.'); return; }
          if (registrationEndDate && !examDate(registrationEndDate)) { reportError('Confira o último dia de inscrição.'); return; }
          if (registrationDate && registrationEndDate && registrationEndDate < registrationDate) { reportError('O último dia de inscrição deve ser igual ou posterior ao início.'); $('#examRegistrationEnd').focus(); return; }
          if (noticeRaw && !noticeUrl) { reportError('Informe um link válido para o edital, usando http:// ou https://.'); $('#examNoticeUrl').focus(); return; }
          if (fee !== '' && (!Number.isFinite(fee) || fee < 0)) { reportError('Informe uma taxa válida, como 120,00.'); return; }

          const newItem = {
            id: editingExamId || makeId(), name, board, registrationDate, registrationStartDate: registrationDate, registrationEndDate, noticeUrl, fee,
            registered: $('#examRegistered').checked,
            examDate: examDateValue, createdAt: new Date().toISOString()
          };
          if (!Array.isArray(state.exams)) state.exams = [];
          const oldIndex = state.exams.findIndex(e => e.id === editingExamId);
          if (oldIndex >= 0) {
            newItem.createdAt = state.exams[oldIndex].createdAt || newItem.createdAt;
            state.exams[oldIndex] = { ...state.exams[oldIndex], ...newItem };
          } else {
            state.exams.push(newItem);
          }
          if (!state.currentExamId && state.exams.length === 1) state.currentExamId = newItem.id;
          if (!saveState()) { reportError('Não foi possível gravar os dados neste navegador.'); return; }
          renderExams();
          closeModal('examModal');
          toast('Concurso salvo', name);
        } catch (error) {
          console.error('Erro ao salvar concurso:', error);
          reportError('Falha ao salvar concurso. Verifique o console (F12) para detalhes.');
        }
      }
      function handleExamAction(event) {
        const button=event.target.closest('[data-exam-action]');if(!button)return;
        const item=(state.exams||[]).find(e=>e.id===button.dataset.examId);if(!item)return;
        const action=button.dataset.examAction;
        if(action==='edit')showExamForm(item);
        else if(action==='toggle-registration'){
          const previous = Boolean(item.registered);
          item.registered = !previous;
          if (!saveState()) { item.registered = previous; toast('Falha ao salvar', 'Não foi possível registrar a alteração.', 'neutral'); return; }
          renderExams();
          toast(item.registered?'Inscrição realizada':'Inscrição desmarcada', item.name);
        }
        else if(action==='promote'){state.currentExamId=item.id;saveState();renderExams();toast('Concurso atual definido',item.name);}
        else if(action==='delete'&&confirm(`Excluir o concurso "${item.name}"?`)){
          state.exams=state.exams.filter(e=>e.id!==item.id);
          if(state.currentExamId===item.id) state.currentExamId=null;
          if (!saveState()) { renderAll(); return; }renderExams();toast('Concurso excluído',item.name);
        }
      }

      // Navegação e ações principais
      $('#registrationAlertList').addEventListener('click', event => {
        const button = event.target.closest('[data-registration-exam]');
        if (!button) return;
        setView('exams');
        const card = $$('.exam-card').find(card => card.dataset.examId === button.dataset.registrationExam);
        if (card) { card.scrollIntoView({ behavior: 'smooth', block: 'center' }); card.focus({ preventScroll: true }); }
      });
      // Reavalia os prazos se a página permanecer aberta durante a virada do dia.
      setInterval(() => { if (activeUser) renderRegistrationAlerts(); }, 60_000);
      document.addEventListener('visibilitychange', () => { if (!document.hidden && activeUser) renderRegistrationAlerts(); });
      $$('.nav-tab').forEach(tab => tab.addEventListener('click', () => setView(tab.dataset.view)));
      $('#newExamButton')?.addEventListener('click', () => showExamForm());
      $('#examForm')?.addEventListener('submit', saveExam);
      $('#currentExam')?.addEventListener('click', handleExamAction);
      $('#radarExams')?.addEventListener('click', handleExamAction);

      $('#settingsButton')?.addEventListener('click', () => openModal('cycleModal'));
      $('#dockAddButton')?.addEventListener('click', () => showTaskForm());
      $('#taskForm')?.addEventListener('submit', addOrUpdateTask);
      $('#currentCycleSelect')?.addEventListener('change', event => { state.currentCycle = Number(event.target.value) || 1; if (!saveState()) { renderAll(); return; } renderProgress(); renderTasks(); });
      $('#searchInput')?.addEventListener('input', renderTasks);
      $('#sortSelect')?.addEventListener('change', renderTasks);
      $$('[data-status]').forEach(button => button.addEventListener('click', () => { setStatusFilter(button.dataset.status); renderTasks(); }));
      $('#importButton')?.addEventListener('click', () => $('#csvFileInput').click());
      $('#csvFileInput')?.addEventListener('change', event => { const file = event.target.files?.[0]; if (file) importCsvFile(file); });
      $('#exportCsvButton')?.addEventListener('click', exportCsv);
      $('#cycleBackupButton')?.addEventListener('click', backupData);
      $('#cycleRestoreButton')?.addEventListener('click', () => $('#backupFileInput').click());
      $('#backupFileInput')?.addEventListener('change', event => { const file = event.target.files?.[0]; if (file) restoreBackup(file); });
      $('#duplicateCycleForm')?.addEventListener('submit', duplicateCycle);
      $('#moveCycleForm')?.addEventListener('submit', moveCycle);
      $('#deleteCycleForm')?.addEventListener('submit', deleteCycle);
      $('#rewardForm')?.addEventListener('submit', addReward);
      $('#editRewardForm')?.addEventListener('submit', saveEditedReward);
      $('#completionForm')?.addEventListener('submit', confirmTaskCompletion);
      $('#taskGrid')?.addEventListener('click', event => {
        const toggle = event.target.closest('[data-toggle-task]');
        const menu = event.target.closest('[data-task-menu]');
        if (toggle) { const task = state.tasks.find(t => t.id === toggle.dataset.toggleTask); if (task) { if (task.done) setTaskDone(task.id, false); else requestTaskCompletion(task.id); } return; }
        if (menu) { event.stopPropagation(); openTaskContext(menu.dataset.taskMenu, menu); }
      });
      $('#taskContextMenu')?.addEventListener('click', event => {
        const button = event.target.closest('[data-action]'); if (!button || !contextTaskId) return;
        const id = contextTaskId, action = button.dataset.action; closeTaskContext();
        if (action === 'edit') { const task = state.tasks.find(t => t.id === id); if (task) showTaskForm(task); }
        else if (action === 'history') showTaskHistory(id);
        else if (action === 'duplicate') duplicateTask(id);
        else if (action === 'delete') deleteTask(id);
      });
      $('#shopGrid')?.addEventListener('click', event => {
        const buy = event.target.closest('[data-buy-reward]'); const edit = event.target.closest('[data-edit-reward]'); const del = event.target.closest('[data-delete-reward]');
        if (buy) buyReward(buy.dataset.buyReward);
        else if (edit) editReward(edit.dataset.editReward);
        else if (del) deleteReward(del.dataset.deleteReward);
      });
      $$('[data-close]').forEach(button => button.addEventListener('click', () => closeModal(button.dataset.close)));
      $$('.overlay').forEach(overlay => overlay.addEventListener('click', event => { if (event.target === overlay) closeModal(overlay.id); }));
      document.addEventListener('keydown', event => { if (event.key === 'Escape') { $$('.overlay.open').forEach(modal => closeModal(modal.id)); closeTaskContext(); } });
      document.addEventListener('click', event => { if (!event.target.closest('#taskContextMenu') && !event.target.closest('[data-task-menu]')) closeTaskContext(); });
      window.addEventListener('resize', closeTaskContext);

      function showLoginScreen(message = 'Entre com GitHub para carregar os dados da sua conta.') {
        $('#loginScreen').classList.remove('hidden');
        $('.app-root').hidden = true;
        $('#logoutBtn').style.display = 'none';
        $('#loginScreen p').textContent = message;
      }
      function showApp() {
        $('#loginScreen').classList.add('hidden');
        $('.app-root').hidden = false;
        $('#logoutBtn').style.display = 'flex';
        renderAll();
      }
      function syncStatus(status, error) {
        const labels = { saved: 'Sincronizado', saving: 'Salvando...', pending: 'Alterações pendentes', error: 'Falha na sincronização', conflict: 'Conflito de versões', expired: 'Sessão expirada' };
        const indicator = $('#syncIndicator');
        indicator.classList.toggle('syncing', status === 'saving');
        indicator.title = labels[status];
        indicator.replaceChildren();
        indicator.textContent = labels[status];
        const problem = ['error', 'conflict', 'expired'].includes(status);
        $('#syncNotice').classList.toggle('hidden', !problem);
        $('#syncMessage').textContent = status === 'conflict'
          ? 'A cópia local foi preservada. Baixe um backup e escolha qual versão manter. Enviar a cópia local substitui os dados da nuvem.'
          : error?.message || labels[status];
        $('#useRemoteButton').classList.toggle('hidden', status !== 'conflict');
        $('#useLocalButton').classList.toggle('hidden', status !== 'conflict');
        $('#reauthButton').classList.toggle('hidden', status !== 'expired');
        $('#retrySyncButton').classList.toggle('hidden', status === 'expired' || status === 'conflict');
      }
      function report(error) { toast('Não foi possível concluir', error.message, 'neutral'); }
      function login() { startLogin(api).catch(report); }
      $('#ghLoginBtn').addEventListener('click', login);
      $('#reauthButton').addEventListener('click', login);
      $('#conflictBackupButton').addEventListener('click', backupData);
      $('#retrySyncButton').addEventListener('click', async () => {
        try {
          if (localSaveFailed && !saveState()) return;
          await sync.refresh();
          if (sync.cache) state = structuredClone(sync.cache.data);
          renderAll();
          await sync.flush();
        } catch (error) { syncStatus('error', error); }
      });
      async function resolveConflict(useLocal) {
        if (!sync) return;
        if (!confirm(useLocal
          ? 'Substituir os dados da nuvem pela cópia aberta? Baixe um backup antes de continuar.'
          : 'Substituir a cópia aberta pela versão da nuvem? Baixe um backup antes de continuar.')) return;
        const button = $(useLocal ? '#useLocalButton' : '#useRemoteButton');
        button.disabled = true;
        try {
          if (useLocal) {
            // A cópia em memória também pode conter uma edição recusada por outra aba.
            sync.write({ data: validateState(state), revision: sync.cache?.revision ?? null, dirty: true, conflict: true });
            localSaveFailed = false;
          }
          state = structuredClone(await sync.resolve(useLocal));
          localSaveFailed = false;
          renderAll();
        } catch (error) { report(error); }
        finally { button.disabled = false; }
      }
      $('#useRemoteButton').addEventListener('click', () => resolveConflict(false));
      $('#useLocalButton').addEventListener('click', () => resolveConflict(true));
      $('#migrateLegacyButton').addEventListener('click', () => {
        try {
          const raw = localStorage.getItem(LEGACY_KEY);
          if (!raw) throw new Error('Nenhum dado anterior encontrado. Você também pode restaurar um backup JSON.');
          const legacy = validateState(JSON.parse(raw));
          if (!confirm(`Importar ${legacy.tasks.length} missões antigas para ${activeUser.login}? Os dados da conta serão substituídos. O cache antigo será preservado.`)) return;
          backupData();
          state = legacy;
          if (!saveState()) { renderAll(); return; } renderAll();
        } catch (error) { report(error); }
      });
      $('#logoutBtn').addEventListener('click', async () => {
        if (localSaveFailed) { toast('Baixe um backup antes de sair', 'Há alterações na tela que não puderam ser salvas neste navegador.', 'neutral'); return; }
        const pending = sync?.cache?.dirty || sync?.saving || sync?.conflict;
        if (!confirm(pending ? 'Há alterações pendentes. Elas ficarão neste navegador, vinculadas à sua conta. Sair agora?' : 'Sair da conta?')) return;
        $('#logoutBtn').disabled = true;
        try {
          await sync?.stop();
          await api('/auth/logout', {});
          clearSession();
          sync = null; activeUser = null; state = defaultState();
          $$('.overlay.open').forEach(modal => closeModal(modal.id));
          closeTaskContext();
          for (const timer of toastTimers) clearTimeout(timer);
          toastTimers.clear(); $('#toastStack').replaceChildren();
          $('#syncNotice').classList.add('hidden');
          renderAll(); showLoginScreen();
        } catch (error) {
          if (sync) { sync.stopped = false; sync.schedule(); }
          report(error);
        } finally { $('#logoutBtn').disabled = false; }
      });
      window.addEventListener('beforeunload', event => {
        if (localSaveFailed || sync?.cache?.dirty || sync?.saving) { event.preventDefault(); event.returnValue = ''; }
      });
      window.addEventListener('online', () => { if (sync) { sync.ready = false; sync.schedule(0); } });
      window.addEventListener('storage', event => {
        if (!sync || event.key !== sync.key) return;
        // Não substitui uma edição aberta silenciosamente, nem dispara envio de outra aba.
        sync.conflict = true;
        sync.ready = false;
        clearTimeout(sync.timer);
        syncStatus('conflict');
      });
      async function bootstrapAuth() {
        showLoginScreen('Carregando sua sessão...');
        // Remove credenciais do fluxo antigo; o token GitHub passa a existir somente no servidor.
        for (const storage of [localStorage, sessionStorage]) {
          for (const key of ['gh_token', 'gh_user', 'gist_id', 'oauth_state']) storage.removeItem(key);
        }
        const error = new URLSearchParams(location.search).get('auth_error');
        if (error) {
          history.replaceState({}, '', location.pathname);
          showLoginScreen(error === 'denied' ? 'Autorização cancelada. Entre para tentar novamente.' : 'Não foi possível autenticar. Inicie o login novamente.');
          return;
        }
        try {
          await finishLogin(api);
          const session = await api('/session');
          if (!Number.isSafeInteger(session.user?.id) || !session.user.login) throw new Error('Sessão inválida.');
          activeUser = session.user;
          sync = new SyncClient(activeUser.id, { notify: syncStatus });
          try {
            const data = await sync.initialize();
            state = data ? structuredClone(data) : defaultState();
            state.profile.name = activeUser.name || activeUser.login;
            if (!sync.conflict) {
              const hadExamSeed = state.tceGoSeeded;
              insertTceGoDefault(state);
              seedInitialMissions();
              if (!hadExamSeed) saveState();
              sync.schedule();
            }
          } catch (error) {
            if (error.status === 401 || !sync.cache) throw error;
            state = structuredClone(sync.cache.data);
            syncStatus(error.status === 409 ? 'conflict' : 'error', error);
            if (error.status === 409) sync.conflict = true;
          }
          showApp();
        } catch (error) {
          await sync?.stop(); sync = null; activeUser = null; state = defaultState();
          showLoginScreen(error.status === 401 ? 'Entre com GitHub para carregar sua conta.' : error.message);
        }
      }
      bootstrapAuth().catch(error => showLoginScreen(error.message));
    })();
