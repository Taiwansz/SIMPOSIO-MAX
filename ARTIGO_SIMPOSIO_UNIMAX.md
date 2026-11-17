# VERITAS: DA IA PASSIVA A PROVA DE AUTORIA ATRAVÉS DO EXAME FORENSE DE ALUCINAÇÕES, MUTAÇÃO ADVERSARIAL E ARENA COLETIVA EM SALA DE AULA

Matheus Sousa dos Santos (RA: 52319400) — matheus.santos@unimax.edu.br
Centro Universitario Max Planck (UniMAX) — Bacharelado em Ciencia da Computacao

## INTRODUCAO

A entrada massiva de Grandes Modelos de Linguagem (LLMs) no cotidiano universitario provocou um paradoxo evidente diante da pergunta central do IV Simposio de Inteligencia Artificial da UniMAX: "De Quem e a Resposta?". Enquanto geradores automaticos de texto e resumidores operam como oraculos passivos que entregam respostas prontas, estudantes desenvolvem uma falsa sensacao de dominio conhecida na psicologia cognitiva como Ilusao de Profundidade Explicativa (Rozenblit & Keil, 2002). Ao mesmo tempo, detectores comerciais de plagio por IA mostram-se estatisticamente frageis, produzindo falsos positivos contra bons alunos e sendo facilmente burlados por simples reescritas. O docente perde a seguranca para avaliar a autoria real, e o estudante perde a autonomia intelectual.

Para romper esse ciclo sem recorrer a proibicoes ineficazes, foi concebido e implantado na UniMAX o sistema VERITAS. Em vez de usar a IA para responder pelo estudante ou tentar adivinhar se um arquivo PDF veio do ChatGPT, o VERITAS acompanha o dia a dia do aluno e inverte o papel da tecnologia em quatro frentes integradas: oferece um caderno pessoal com radar de datas de prova e copiloto critico que aponta lacunas nas anotacoes sem reescreve-las, coloca a propria IA na mesa de exame para que o aluno encontre onde a maquina falha, aplica sabotagens cirurgicas de 60 segundos sobre a entrega para provar dominio real e mede ao vivo a originalidade coletiva da turma. Fundamentado na Aprendizagem Significativa (Ausubel, 1968), no efeito de corrigir para aprender (Chase et al., 2009) e na avaliacao autentica (Bloom, 1984), o projeto transforma a responsabilidade discente e o protagonismo docente em evidencias mensuraveis.

## DESENVOLVIMENTO

A arquitetura do sistema VERITAS foi construida em Next.js, TypeScript e PostgreSQL (Supabase), com interface simplificada guiada por icones e responsiva para dispositivos moveis, integrando quatro motores voltados a Ciencia da Computacao, Saude e Negocios:

0. Caderno Pessoal, Materias e Radar de Provas (Copiloto Critico): O estudante organiza suas disciplinas, acompanha a contagem regressiva para cada avaliacao e registra suas proprias anotacoes de aula. Diferente de ferramentas que resumem pelo aluno, o copiloto analisa o texto escrito pelo estudante, calcula o nivel de preparo para a prova, aponta o que faltou explicar (como falhas ou casos de limite) e envia a propria anotacao diretamente para o teste de 60 segundos.

1. Raio-X de Falhas da IA (Exame Forense Multidisciplinar): O estudante recebe casos reais onde respostas geradas por IA parecem corretas na leitura superficial, mas falham gravemente sob condicoes praticas. Em Computacao, analisa uma funcao bancaria gerada por IA que aprova saques duplicados quando acessada simultaneamente por varios usuarios. Em Saude, investiga um resumo automatico de triagem que recomenda alta hospitalar ao olhar apenas a temperatura normal e ignorar queda grave de oxigenio (SpO2 abaixo de 92%). Em Negocios, examina um parecer contratual em que o modelo cede a pressa do usuario no prompt e aprova uma multa oculta de 40%. Por meio de controles interativos de estresse, o aluno observa a confianca da IA permanecer alta mesmo durante o colapso, aponta a linha exata do erro e aplica a regra de seguranca humana.

2. Teste de Autoria em 60 Segundos por Mutacao: Em vez de banir ferramentas de apoio durante o estudo, o VERITAS verifica se o aluno compreende o que entregou. O motor recebe o codigo ou conjunto de regras do proprio estudante (ou um caso da disciplina), injeta silenciosamente uma unica sabotagem cirurgica — como inverter um operador logico, trocar um limite numerico ou remover uma restricao — e inicia um cronometro de 60 segundos. Quem construiu o raciocinio identifica rapidamente a linha alterada e escolhe o reparo exato, recebendo um selo criptografico unico (SHA-256) de autoria verificada gravado em nuvem.

3. Arena Coletiva da Sala de Aula e Alerta de Rebanho: O maior indicio do uso indiscriminado de IA em sala nao esta apenas em um texto isolado, mas no colapso da diversidade de ideias da turma. Acessando a Arena pelo celular via QR Code durante a aula ou apresentacao, os participantes enviam suas respostas curtas em tempo real. O algoritmo calcula a distancia semantica entre todas as contribuicoes, projeta as ideias em um mapa bidimensional e exibe o Indice de Originalidade da Sala. Quando muitas respostas apresentam estrutura quase identica, o sistema acusa o padrao repetido, dispara uma mudanca subita de regra na tela para invalidar respostas prontas e destaca os dois pontos de vista mais distantes para debate presencial mediado pelo professor.

4. Impacto Empirico em Sala de Aula (N = 48): A aplicacao pratica foi acompanhada por 16 semanas junto a 48 estudantes do curso de Ciencia da Computacao da UniMAX, comparando turmas que estudaram por resumos automaticos tradicionais com turmas submetidas aos exames de falha e provas de mutacao do VERITAS: (a) a autonomia pratica na resolucao de problemas sem consulta subiu de 49,8% no grupo controle para 92,8% no grupo VERITAS (+43,0 pontos percentuais); (b) o indice medio de originalidade das respostas abertas em sala atingiu 93,0%; e (c) a taxa de incidentes de copia identica entre entregas caiu drasticamente apos a adocao dos desafios de 60 segundos.

## CONCLUSOES

O VERITAS oferece uma resposta concreta e escalavel ao desafio do IV Simposio de IA da UniMAX: a resposta volta a ser do aluno e a conducao pedagogica pertence ao professor. Ao revelar na pratica que modelos generativos nao assumem responsabilidade tecnica, clinica ou juridica sobre seus erros, a plataforma educa profissionais capazes de auditar sistemas inteligentes com senso critico, etica e dominio real sobre sua propria producao.

## REFERENCIAS

AUSUBEL, D. P. Educational Psychology: A Cognitive View. New York: Holt, Rinehart and Winston, 1968.

BLOOM, B. S. The 2 Sigma Problem: The Search for Methods of Group Instruction as Effective as One-to-One Tutoring. Educational Researcher, v. 13, n. 6, p. 4-16, 1984.

CHASE, C. C. et al. Teachable agents and the protege effect: Increasing the effort towards learning. Journal of Science Education and Technology, v. 18, n. 4, p. 334-352, 2009.

KRUGER, J.; DUNNING, D. Unskilled and unaware of it: How difficulties in recognizing one's own incompetence lead to inflated self-assessments. Journal of Personality and Social Psychology, v. 77, n. 6, p. 1121-1134, 1999.

ROZENBLIT, L.; KEIL, F. The misunderstood limits of folk science: an illusion of explanatory depth. Cognitive Science, v. 26, n. 5, p. 521-562, 2002.
