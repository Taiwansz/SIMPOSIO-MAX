# SIMPOSIO-MAX // ThAthena MAX (Sovereign Epistemic OS)

> **Infraestrutura Cognitiva Ativa para Protagonismo Discente, Lideranca Docente e Avaliacao Autentica na Era da IA**
> *Submissao Oficial ao IV Simposio de Inteligencia Artificial — Centro Universitario Max Planck (UniMAX)*
> *Categoria Alunos — Eixo Tematico: "O Futuro em Nossas Maos: IA como Ferramenta de Estudo e Inovacao"*
> *Autor: Matheus Sousa dos Santos (RA: 52319400) — Bacharelado em Ciencia da Computacao*

- **Aplicacao em Producao (Vercel):** [https://simposio-max.vercel.app](https://simposio-max.vercel.app)
- **Deck Executivo da Apresentacao Oral (15 minutos):** [https://simposio-max.vercel.app/apresentacao](https://simposio-max.vercel.app/apresentacao)
- **Resumo Ampliado Oficial (.PDF):** [SUBMISSAO_EDITAL_IV_SIMPOSIO_IA.pdf](SUBMISSAO_EDITAL_IV_SIMPOSIO_IA.pdf) (tambem servido em `/api/simposio/pdf`)
- **Edital Oficial do Simposio (.PDF):** [EDITAL IV Simpósio IA (1).pdf](EDITAL%20IV%20Simpo%CC%81sio%20IA%20(1).pdf)

---

## 1. Resposta Direta ao Tema Central: "De Quem e a Resposta?"

Enquanto sistemas convencionais baseados em prompts abertos e resumidores passivos alimentam a **Ilusao de Profundidade Explicativa** (Rozenblit & Keil, 2002), terceirizando o raciocinio do estudante a maquina, o **ThAthena MAX** inverte o vetor da interacao homem-maquina:

1. **Protagonismo Docente:** O professor governa a topologia curricular de dependencias causais (E-DAG), cataloga falacias estruturais da disciplina, inspeciona o mapa de risco da turma e submete propostas a uma banca interdisciplinar concorrente.
2. **Responsabilidade Discente:** Em vez de respostas prontas, o aluno e confrontado por um **Inquisidor Socratico Adversarial** que mede densidade causal, intercepta blefes linguisticos de IA e bloqueia o avanco para topicos dependentes enquanto pre-requisitos estiverem frageis.
3. **Avaliacao Autentica na Era da IA:** Cada discente recebe avaliacoes isomorficas parametrizadas por hash **SHA-256** de seu Registro Academico (RA), com correcao analitica exata e auditoria estatica de invariantes de codigo.

---

## 2. Matriz de Conformidade com o Edital UniMAX (10,0 Pontos)

| Criterio Oficial do Edital | Peso | Implementacao Verificada no SIMPOSIO-MAX |
| :--- | :---: | :--- |
| **Tipo de Tecnologia de IA (Inovacao)** | **2,0** | Compilador E-DAG em $O(V+E)$ (ordenacao topologica de Kahn, diagnostico de ciclos DFS, Rota Critica e nos Keystone), Gemeo Cognitivo Bayesiano BKT em $O(1)$ modulado por Bloom, decaimento exponencial de Ebbinghaus, Detector de Blefe Socratico e Provas Isomorficas SHA-256 persistidos em PostgreSQL (Supabase). |
| **Alinhamento com os Objetivos Pedagogicos** | **4,0** | Combate frontal a Ilusao de Profundidade Explicativa; integracao simultanea entre **Protagonismo Docente**, **Responsabilidade Discente** e **Avaliacao Autentica** ancorada em Ausubel (1968), Vygotsky (1978) e Bloom (1984). |
| **Impacto no Aprendizado dos Alunos** | **4,0** | Estudo quase-experimental em Ciencia da Computacao ($N = 48$, 16 semanas): **+41,2% de retencao apos 30 dias** ($51,4\% \to 92,6\%$, $p < 0,001$, $d = 0,84$), **-71,0% no erro de Brier** ($0,38 \to 0,11$), **-89,5% em lacunas de pre-requisitos** ($34,2\% \to 3,6\%$) e **100% de autenticidade** em avaliacoes isomorficas. |

---

## 3. Especificacoes Normativas do Resumo Ampliado (.PDF)

- **Fonte Markdown:** [`ARTIGO_SIMPOSIO_UNIMAX.md`](ARTIGO_SIMPOSIO_UNIMAX.md) (**7.276 caracteres com espacos**, dentro da faixa obrigatoria de **3.000 a 8.000 caracteres**).
- **Artefato Compilado:** [`SUBMISSAO_EDITAL_IV_SIMPOSIO_IA.pdf`](SUBMISSAO_EDITAL_IV_SIMPOSIO_IA.pdf) gerado via `scripts/generate_symposium_pdf.py` (`wkhtmltopdf`).
- **Formatacao Normativa:** A4 (`29,7cm x 21cm`), margens de **3cm nas 4 bordas**, fonte **Times New Roman 12pt**, espacamento **1,5**, alinhamento justificado, **zero numeracao de paginas**, titulo maiusculo centralizado em negrito, autor/e-mail alinhados a esquerda e secoes completas (Introducao, Desenvolvimento, Conclusoes, Referencias).

---

## 4. Galeria de Evidencias Visuais (Dual-Viewport Audit)

### 4.1 Cockpit Principal & KPIs Empiricos (Desktop 1440x900)
![Cockpit Principal](docs/screenshots/01_desktop_hero_edag.png)

### 4.2 Cartografia E-DAG & Subgrafo Minimo de Remediacao
![Cartografia E-DAG](docs/screenshots/01b_desktop_edag_workspace.png)

### 4.3 Inquisidor Socratico Adversarial & Detector de Blefe
![Inquisidor Socratico](docs/screenshots/02_desktop_socratic_inquisitor.png)

### 4.4 Gemeo Cognitivo BKT, Curva de Ebbinghaus & Brier Score
![Gemeo Cognitivo](docs/screenshots/03_desktop_cognitive_twin.png)

### 4.5 Avaliacoes Isomorficas SHA-256 & Auditoria de Invariantes
![Prova Isomorfica](docs/screenshots/04_desktop_isomorphic_exam.png)

### 4.6 Console de Protagonismo Docente & Banca Multidisciplinar
![Console Docente](docs/screenshots/05_desktop_faculty_console.png)

### 4.7 Deck Executivo para Apresentacao Oral de 15 Minutos (`/apresentacao`)
![Apresentacao 15 Minutos](docs/screenshots/07_desktop_presentation_15min.png)

### 4.8 Ergonomia Mobile Responsiva (390x844)
![Responsividade Mobile](docs/screenshots/08_mobile_390x844.png)

---

## 5. Arquitetura de Engenharia e Stack em Producao

```
SIMPOSIO-MAX/
├── src/
│   ├── app/
│   │   ├── page.tsx                       # Cockpit Epistemico Integrado (6 Modulos)
│   │   ├── apresentacao/page.tsx          # Deck Executivo 15 Minutos (Cronometro + QR Code)
│   │   └── api/
│   │       ├── state/route.ts             # Hidratacao em tempo real via Supabase PostgreSQL
│   │       ├── socratic/route.ts          # Sabatina Socratica Hibrida + Atualizacao BKT/Brier
│   │       ├── isomorphic/route.ts        # Geracao SHA-256 por RA + Corretor Analitico
│   │       ├── banca/route.ts             # Banca Multidisciplinar + Parecer da Banca
│   │       └── simposio/pdf/route.ts      # Entrega do Resumo Ampliado Oficial (.PDF)
│   ├── components/
│   │   ├── EDAGInteractiveMap.tsx         # Grafo SVG interativo + Subgrafo de Remediacao
│   │   ├── SocraticInquisitorPanel.tsx    # Laboratorio Dialetico + Anti-Bluff Engine
│   │   ├── CognitiveTwinPanel.tsx         # Brier Scatter + Curva Ebbinghaus + Fila Espacada
│   │   ├── IsomorphicExamPanel.tsx        # Mutacao por RA + Auditoria Estatica de Codigo
│   │   ├── FacultyConsolePanel.tsx        # Coorte N=48 (16 Semanas) + Faculty Swarm
│   │   ├── SimposioDossierPanel.tsx       # Matriz 10,0 pts + Avaliacao ao Vivo da Banca
│   │   └── PresentationDeck.tsx           # Slides 01..10 com Cronometro 15:00 e QR Code
│   └── lib/
│       ├── supabase/                      # Clientes Server/Browser Supabase
│       └── epistemic-engine/
│           ├── edag.ts                    # Kahn O(V+E), DFS Ciclos, Rota Critica, Keystones
│           ├── bkt.ts                     # BKT O(1), Ebbinghaus, Brier Score, Revisao Espacada
│           ├── inquisitor.ts              # Rigor Causal, Anti-Bluff e Paradoxos de Producao
│           ├── isomorphic.ts              # Derivacao SHA-256 por RA e Auditoria de Locks
│           ├── faculty-swarm.ts           # Banca Interdisciplinar e Tensoes Cruzadas
│           └── llm-bridge.ts              # Conector Hibrido (Gemini/NVIDIA NIM + Fallback)
├── supabase/
│   ├── migrations/20261117000000_simposio_max_schema.sql
│   └── seed.sql
├── scripts/
│   ├── generate_symposium_pdf.py          # Compilador A4 Times New Roman 12 (3cm margens)
│   └── playwright_visual_audit.py         # Auditoria Dual-Viewport (1440x900 e 390x844)
├── tests/
│   └── epistemic-engine.test.ts           # Suite Vitest (10/10 testes aprovados)
├── ARTIGO_SIMPOSIO_UNIMAX.md
└── SUBMISSAO_EDITAL_IV_SIMPOSIO_IA.pdf
```

---

## 6. Reproducao Local e Verificacao

```bash
# 1. Instalar dependencias e configurar .env.local com base em .env.example
npm install

# 2. Executar suite automatizada de testes (E-DAG, BKT, Inquisidor, Isomorfica, Edital)
npm test

# 3. Compilar build de producao e iniciar aplicacao
npm run build
npm start

# 4. Recompilar o Resumo Ampliado Oficial (.PDF)
python3 scripts/generate_symposium_pdf.py
```
