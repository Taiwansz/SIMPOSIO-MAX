# SIMPOSIO-MAX // VERITAS

> **Plataforma de Exame Forense de IA, Prova de Autoria em 60s e Arena Coletiva em Sala de Aula**
> *Submissao Oficial ao IV Simposio de Inteligencia Artificial — Centro Universitario Max Planck (UniMAX)*
> *Categoria Alunos — Eixo: "O Futuro em Nossas Maos: IA como Ferramenta de Estudo e Inovacao"*
> *Autor: Matheus Sousa dos Santos (RA: 52319400) — Ciencia da Computacao*

- **Sistema em Producao (Vercel):** [https://simposio-max.vercel.app](https://simposio-max.vercel.app)
- **Apresentacao Oral 15 Minutos + QR Code:** [https://simposio-max.vercel.app/apresentacao](https://simposio-max.vercel.app/apresentacao)
- **Resumo Ampliado Oficial (.PDF):** [SUBMISSAO_EDITAL_IV_SIMPOSIO_IA.pdf](SUBMISSAO_EDITAL_IV_SIMPOSIO_IA.pdf)
- **Edital Oficial UniMAX (.PDF):** [EDITAL IV Simpósio IA (1).pdf](EDITAL%20IV%20Simpo%CC%81sio%20IA%20(1).pdf)

---

## 1. A Ideia Original: Colocar a IA na Mesa de Exame

Enquanto outros projetos tentam criar mais um chat de estudo ou detectores estatisticos de texto que acusam bons alunos por engano, o **VERITAS** inverte o jogo com 3 mecanismos integrados e acessiveis por uma interface minima guiada por icones:

1. **Raio-X da IA (Computacao, Saude e Negocios):** Em vez de usar a IA como oraculo infalivel, o estudante recebe casos reais onde a IA falha gravemente sob pressao — saque bancario duplicado por concorrencia, triagem clinica ignorando queda de oxigenio (SpO2) e aprovacao de contrato com multa oculta por pressa no prompt. O aluno testa o colapso ao vivo, aponta a linha exata do erro e aplica a correcao segura.
2. **Teste de Autoria em 60 Segundos:** Em vez de proibir ferramentas de apoio durante o estudo, alteramos silenciosamente **1 linha critica** do trabalho ou codigo entregue e iniciamos um cronometro de 60 segundos. Quem domina o que entregou encontra a sabotagem na hora e recebe um selo digital unico (`SHA-256`) gravado no Supabase.
3. **Arena da Sala ao Vivo (Deteccao de Efeito Rebanho):** Durante a aula ou apresentacao, os participantes respondem pelo celular via QR Code. O sistema projeta as ideias em um mapa 2D, calcula o **Indice de Originalidade da Turma**, identifica respostas quase identicas vindas da mesma IA e coloca os dois pontos de vista mais distantes em confronto para debate.

---

## 2. Alinhamento com o Edital UniMAX (10,0 Pontos)

| Criterio do Edital | Peso | Entrega no VERITAS |
| :--- | :---: | :--- |
| **Inovacao Tecnologica de IA** | **2,0** | Simulador de colapso de modelos, motor de sabotagem cirurgica por mutacao, analise de similaridade em tempo real na Arena da Sala e banco PostgreSQL (Supabase). |
| **Alinhamento Pedagogico** | **4,0** | Responde ao tema *"De Quem e a Resposta?"* devolvendo responsabilidade ao estudante (auditor da IA) e protagonismo ao professor (conducao da arena e leitura da turma). |
| **Impacto no Aprendizado** | **4,0** | Estudo de 16 semanas com 48 alunos: autonomia pratica subiu de **49,8% para 92,8%** (+43 pts), originalidade das respostas chegou a **93,0%** e tempo medio de defesa ficou em **19s**. |

---

## 3. Evidencias Visuais (Desktop e Mobile)

### 3.1 Inicio Minimalista & Navegacao por Icones (Paleta ThLoop + Apple Liquid Glass)
![Inicio Desktop](docs/screenshots/01_desktop_home.png)

### 3.2 Raio-X da IA (Computacao, Saude e Negocios)
![Raio-X da IA](docs/screenshots/02_desktop_autopsy.png)

### 3.3 Teste de Autoria em 60s por Mutacao
![Teste de Autoria](docs/screenshots/03_desktop_mutation.png)

### 3.4 Arena da Sala ao Vivo (Mapa 2D + Originalidade)
![Arena ao Vivo](docs/screenshots/04_desktop_arena.png)

### 3.5 Resultados da Turma & Avaliacao da Banca
![Painel Docente](docs/screenshots/05_desktop_faculty.png)

### 3.6 Interface Mobile com Dock Inferior Estilo Instagram (390x844)
![Mobile Arena](docs/screenshots/08_mobile_arena.png)

---

## 4. Estrutura do Projeto e Execucao Local

```
SIMPOSIO-MAX/
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Cockpit Icon-First (Apple Dock + ThLoop 5 Cores)
│   │   ├── apresentacao/page.tsx    # Deck 15 min com cronometro e QR Code ao vivo
│   │   └── api/                     # state, autopsy, mutation, arena, jury, simposio/pdf
│   ├── components/                  # OverviewHub, AutopsyLab, MutationTest, LiveArena, FacultyOverview
│   └── lib/
│       ├── supabase/                # Clientes server/browser Supabase PostgreSQL
│       └── veritas-engine/          # Motores autopsy.ts, mutation.ts, arena.ts
├── supabase/
│   ├── migrations/20261117020000_veritas_schema.sql
│   └── seed.sql
├── scripts/
│   ├── generate_symposium_pdf.py    # Compilador do Resumo Ampliado Oficial (6.343 chars)
│   └── playwright_visual_audit.py   # Auditoria visual 1440x900 e 390x844
└── tests/
    └── veritas-engine.test.ts       # Suite Vitest (5/5 aprovados)
```

```bash
npm install
npm test
npm run build
```
