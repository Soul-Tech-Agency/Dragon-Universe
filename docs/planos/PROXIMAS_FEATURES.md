# Próximas versões do Dragon Universe (resumo dos planos)

> Escrito pelo Arquiteto em 2026-11-22, juntando os planos desta pasta:
> `ARQUITETURA_OTIMIZACAO.md` (Arquiteto), `TREINOS.md` (Arquiteto), `MUNDO_MOBS_BILLS.md` (Marco), `SKILLS_PENDENTES.md` (Bússola), `VISUAL_PENDENTE.md` + `oozaru_ui_scale.README.md` + `PALACIO_BILLS_ARENA_TP.md` (com a prancha `PALACIO_BILLS_ARENA_TP.png`) (Aquarela) e `ICONES_FALTANDO.md` (Aquarela + Engrenagem).
> Nada destes planos foi testado no jogo. São propostas: só viram trabalho depois que você decidir.

---

## 1. Visão geral (em 10 linhas)

1. A 1.7.17 (redesign do menu + correções) está em teste. Também entram nela o restyle das telas antigas (em revisão) e as correções das construções do Marco. Os planos abaixo são para **depois** dela.
2. **Por dentro:** o arquivo principal do addon tem 20 mil linhas, e um terço delas é uma lista do Minecraft copiada duas vezes por engano. Dá para tirar sem mudar nada no jogo.
3. O jogo faz trabalho repetido a cada instante (19 "relógios" que rodam sempre). Juntá-los num só deve reduzir travadas, principalmente em vilas e com 2+ jogadores.
4. **O tremor do voo tem uma causa provável:** o jogo reenvia a velocidade e o modo de voo 20 vezes por segundo, mesmo sem mudança.
5. **Treinos novos:** concentração com tela nova e sem lag, flexões com Shift (com opção para celular/controle) e treino mental contra réplicas de chefes que você já venceu.
6. **Habilidades:** o "Poder de Cura" não faz nada hoje, e outras habilidades só servem de requisito. As correções seguras (Punho/Foice de Ki e Hakai) e o texto do Punho Amigável **já foram feitos**.
7. **Mundo:** Bills e Whis passam a morar no planeta deles. A Corporação Cápsula ganha engenheiros, a Casa do Guru ganha o Grande Patriarca e algumas construções ganham guardas que voltam com o tempo.
8. **Visual:** quase tudo dos prints de outubro/novembro já foi corrigido. Faltam o Oozaru vazando da prévia do inventário e duas construções:
   - **Arena do Torneio do Poder:** já existe. Só precisa trocar as cores do chão de "retalhos" por pedra clara, sem reconstruir.
   - **Palácio do Bills:** precisa ser construído do zero (trabalho grande).
9. Proposta de ritmo:
   - **1.7.18:** estabilidade, casa arrumada e arena recolorida;
   - **1.7.19:** treinos e Palácio do Bills;
   - **depois:** treino mental e o resto da reorganização.
10. A seção 3 junta **todas as perguntas para você numa lista só**: cada uma tem uma recomendação, e dá para responder só "aceito as recomendações".

---

## 2. Roteiro proposto

Estimativas em **dias de trabalho de um agente**. Vários agentes trabalham ao mesmo tempo, então o tempo de calendário é menor.

### 1.7.18: estabilidade e casa arrumada (~2 semanas)

| # | O quê | Quem | Depende de | Estimativa |
|---|---|---|---|---|
| 1 | **O0**: ferramentas de medição (contar trabalho por tick, comparar versões) | Bússola | — (em andamento) | 1 dia |
| 3 | **O1**: tirar a lista do Minecraft duplicada do arquivo principal | Arquiteto revisa, 1 agente faz | 1 | 0,5 dia |
| 4 | **O2**: voo sem reenviar dados todo tick (tremor), vazamento da cápsula 991, menos entidades pesadas, colisão de ki mais leve. Detalhe em `O2_DETALHE.md` (Bússola), na ordem O2a voo → O2b propriedades → O2c cápsula → O2e colisão de ki → O2d entidades | 1 agente no arquivo principal (Bússola) | 3; decisões 39–42 | 2 dias |
| 5 | **O3**: "relógio" único para as dimensões | 1 + até 3 agentes (um por arquivo) | 1 | 2–3 dias |
| 6 | **Poder de Cura passo A** (+25% de regeneração, texto novo) e textos das habilidades | Bússola | decisões 16–20 | 0,5 dia |
| 7 | **Moradores fixos**: Bills e Whis no planeta, engenheiros na Cápsula, Grande Patriarca, locutor que volta | Marco | decisões 23–27 | 2 dias |
| 8 | **Guardas** (Yamcha, Red Ribbon, Base do Freeza) | Marco | decisões 26, 28, 38 | 1 dia |
| 9 | Oozaru vazando da prévia do inventário (patch pronto + ajuste de UI, teste A/B) | Aquarela + Engrenagem | decisão 31 | 1 dia |
| 12 | **Completar o restyle (script, 5 itens anotados pela Engrenagem):** | Bússola | **depois do O1** (mexe no `index.js`); JSON da Engrenagem e ícones da Aquarela no mesmo build | ~2–3 dias no total |
| 12a | Ícone por tipo e estado de missão e de conquista (principal, secundária, desafio, concluída, bloqueada; categorias de conquista), mandado no botão via `iconPatch` | Bússola | 12 | 0,5 dia |
| 12b | Transformações bloqueadas com `textures/ui/du2/icons/lock` no lugar do cadeado vanilla | Bússola | 12 | 0,1 dia |
| 12c | Detalhe de missão com slots separados (nível recomendado, objetivos, recompensas), como nas Estatísticas | Bússola | 12 | 1 dia |
| 12d | Customização e barbeiro com um slot por linha (nome da opção + valor atual), para os ícones `cust_*` | Bússola | 12 | 0,5–1 dia |
| 12e | Habilidades com pontos e "no máximo" fora do texto do botão (slots próprios), para `skill_points`/`skill_max` | Bússola | 12 | 0,5 dia |
| 13 | **Remover os layouts antigos que ficaram sem uso** (JSON UI e texturas das telas trocadas) | Engrenagem | **só depois do teste no jogo** do restyle (1.7.17) e do item 12 | 0,5 dia |
| 14 | **Arena do Torneio do Poder recolorida**: pedra clara no lugar dos "retalhos", sem luz invisível, com névoa/horizonte. Viabilidade confirmada pelo Marco:<br>• a troca é feita **fora do jogo**, renomeando os blocos na lista de cada peça; o formato e as posições não mudam;<br>• a luz invisível (~1,34 milhão de blocos) vira "vazio" nas peças, e a colocação fica mais leve;<br>• mundos que já têm a arena (inteira ou pela metade) precisam do caminho escolhido na decisão 37a.<br>Teste no jogo: sem a luz invisível, a arena não pode ficar escura demais. Se ficar, entram lâmpadas embutidas no piso (Marco, P/M) | Marco (ferramenta de regravação + verificação) + Bússola (migração em `space_arena.js`/`tournament_of_power.js`) + Aquarela (névoa e revisão da paleta) | decisões 29, 34, 35, 37, 37a | ~1–2 dias (M), com a migração |

> Os antigos itens 2 (correções de habilidades), 10 (restyle das telas antigas) e 11 (correções das construções) saíram desta tabela: já estão feitos e entram na 1.7.17 (ver seção 4). A numeração dos outros itens foi mantida.

### 1.7.19: treinos (~2 semanas)

| # | O quê | Quem | Depende de | Estimativa |
|---|---|---|---|---|
| 1 | **O4.0 + O4.1 + O4.6**: separar o "coração" e os treinos do arquivo principal em arquivos próprios. **Atenção (revisão do Arquiteto):** a simulação da ferramenta mostrou que hoje quase todo o arquivo (≈11,9 mil das 14,2 mil linhas) não pode ser cortado só movendo código, porque partes do começo chamam partes do fim. Antes de mover vem o **O4.0**: trocar essas ~33 chamadas por uma ligação tardia (mudança pequena, provada pela comparação na mesma ordem) | 1 agente (sequencial) | 1.7.18 itens 3–4 | 4–5 dias (+1–2 do O4.0) |
| 2 | **Concentração reformulada** (grade 3×3, painel no HUD, sem lag, sem exploit) | script + UI + texturas em paralelo | 1 | 2 dias corridos |
| 3 | **Treino físico (flexões)** | script + animação + textos | 2 (usa o mesmo painel), decisões 9–10 | 2–3 dias corridos |
| 4 | **Registro de chefes derrotados** (base do treino mental, títulos e eventos) | 1 agente + Content (lista de chefes) | — (pode ir em paralelo) | 1 dia |
| 5 | **O5**: código repetido das dimensões num lugar só (terreno igual ao de antes) | até 3 agentes | 1.7.18 item 5 | 2–3 dias |
| 6 | **Palácio do Bills**: palácio em degraus (31×31, ~50 de altura, "orelhas de gato" no topo) no lugar da árvore vermelha central, terraço de jantar com Bills e Whis, e lago. São 2 peças novas no planeta. Na mesma passada, reexportar as peças antigas sem a árvore e sem as entidades salvas (peixes, almofadas e suportes de armadura, que duplicam no rebuild). Bills, Whis e os peixes passam a ser colocados por script | Marco (construção e reexportação) + Bússola (`bills_planet.js`) + Aquarela (revisão visual) | moradores fixos da 1.7.18 (item 7); decisões 29, 36, 37 | G: 2–3 dias de construção (ou 1 com gerador por script) + 1 de reexportação e teste |

### Depois (1.7.20 em diante)

- **Treino mental** (réplicas de chefes), depois do registro de chefes: 3–4 dias.
- Restante da reorganização do arquivo principal (combate, raças, habilidades, missões, menus, mundo): ~10 dias de agente.
- **O6**: custo por entidade (vilas e chefes pesam menos longe dos jogadores): 2–3 dias.
- **O7**: voo, peso e velocidade na água, depois de medir o resultado do O2: 2 dias.
- **O8**: menos aldeões ativos por vila: 1–2 dias.
- **Poder de Cura passo B** (cura ativa e cura de aliados): depois da separação das habilidades.
- Resto da Fase 5 do ROADMAP: passivas raciais, novos ataques, raças e formas, NPCs, eventos, novas Esferas.

### Regras que valem para todas as versões

- **Arquivo principal (`index.js`): um agente por vez.** As correções das habilidades já entraram (`aa0b9eb`), então o O1 não briga mais com elas. O item 12 (script do restyle) vem depois do O1.
- **Save:** nenhum nome `dbe:`, chave de save ou ordem de lista muda. Coisas novas só são acrescentadas.
- **Teste:** cada versão tem roteiro de teste no jogo. "Funcionou" só depois que alguém testou no jogo.

---

## 3. Todas as decisões para você (lista única)

Código de origem: **A** = Arquitetura, **T** = Treinos, **M** = Mundo (Marco), **S** = Skills (Bússola), **V** = Visual (Aquarela), **I** = Ícones. Onde dois planos se cruzavam, a decisão foi juntada e o conflito está explicado.

**Atalho:** responder "aceito todas as recomendações" já destrava a 1.7.18 e a 1.7.19.

### Organização e desempenho

1. **(A1) Ordem do trabalho interno:** ganhos rápidos primeiro (lista duplicada, voo, relógio único) **ou** reorganizar tudo primeiro?
   → **Recomendo ganhos rápidos primeiro.** São seguros e medem o resto.
2. **(A2 + O1_PASSO2) Lista duplicada do Minecraft.** O passo 1 (mover as duas cópias para fora do arquivo principal) está **feito e aprovado** (`671f2ab`).
   - A Bússola comparou as cópias: A e B só diferem num item, `GoldenDandelion` (a B tem, a A não), e ninguém usa esse item.
   - O núcleo usa só 3 das 12 listas: dimensões, câmera e efeitos.
   - Opções para o passo 2:
     - **(2a)** ficar só com a cópia B, com apelidos para os nomes da A: −3.204 linhas, sem perder nenhum dado;
     - **(2b)** além disso, deixar só as 3 listas usadas: ~60 linhas no lugar de ~3.200.
   → **Recomendo o 2a agora e o 2b não.**
     - O 2a é risco praticamente zero: a B contém a A inteira, com os mesmos valores.
     - O 2b ganha pouco no jogo: a lista é montada uma vez ao abrir o mundo, e o custo é irrisório. Em troca, tira a lista pronta de ids do Minecraft que código novo pode usar.
     - Reavaliar o 2b no fim da reorganização (O4).
3. **(A3) Relógio único:** agora só para as dimensões e tarefas gerais **ou** também para cada entidade?
   → **Recomendo só dimensões agora.** Entidades depois da reorganização (O6).
4. **(A4) Como separar o arquivo principal:** com ferramenta, seguindo as divisões originais **ou** à mão?
   → **Recomendo com ferramenta.**
5. **(A5)** Nas mudanças de desempenho, a comparação automática vai dizer "diferente" de propósito. Aceita como prova a comparação ajustada + a medição + o teste no jogo?
   → **Recomendo sim.**
6. **(A6) Medidor de desempenho (`/scriptevent dbe:perf`):** vai no pacote, desligado, **ou** só em versões de teste?
   → **Recomendo no pacote, desligado.** Não pesa e ajuda a medir em servidor de verdade.
7. **(A7)** Separar os treinos do arquivo principal antes do resto, para começar os treinos novos mais cedo?
   → **Recomendo sim.**


**O2, ganhos rápidos** (detalhe em `O2_DETALHE.md`, da Bússola):

39. **(O2, ordem)** O2a voo → O2b propriedades → O2c cápsula 991 → O2e colisão de ki → O2d entidades?
    → **Recomendo esta ordem.** Começa pelo mais seguro e mais visível (o tremor do voo) e deixa por último o que muda quem recebe o "cérebro" do addon. Cada item é um commit, com medição antes e depois e teste no jogo.
40. **(O2b-1) Quando o jogo pede várias vezes a mesma marcação visual no mesmo instante:** (a) juntar os pedidos e só enviar o último, o que economiza mais; (b) manter um envio por pedido e só pular quando o valor já é igual.
    → **Recomendo (a).** O jogador nunca via os valores intermediários: o jogo só manda ao cliente o estado do fim do tick. A Bússola relê o valor no momento de gravar, o que evita usar valor velho.
41. **(O2c-1) Cápsula 991:** (a) só limpar os 2 relógios que nunca param e tirar o texto de depuração; (b) também trocar as 5 entidades invisíveis que ela cria por tick, para medir o chão, por uma consulta de bloco.
    → **Recomendo (a) agora.** A cápsula só aparece por comando, e (b) muda a física da inclinação: fica para depois, com teste de direção.
42. **(O2d-1) Entidades que não precisam do "cérebro" completo (C9):** (a) agora só tirar o relógio de 1 tick das entidades sem nenhuma habilidade; (b) também excluir algumas entidades técnicas da lista.
    → **Recomendo (a) agora e (b) depois da medição.** A Bússola achou um erro no meu plano: o filtro que eu propus ("só quem está nos dados das entidades") **não excluiria nada**, porque todas as 103 entidades do addon estão nesses dados, até as técnicas. A parte (a) não muda quem recebe o cérebro, só deixa de rodar um relógio vazio, e por leitura o comportamento é idêntico.

### Treinos

8. **(T6) Placar da concentração:** painel fixo no canto da tela (estilo novo) **ou** texto na barra de ação, como hoje?
   → **Recomendo painel**, com o texto como reserva enquanto a tela não fica pronta.
9. **(T1) Flexões precisam avisar o jogo do jogador** para não mostrar a pose e o som de "carregar ki" (o jogador já usa todas as 32 marcações possíveis). Opções: (a) acrescentar o valor "flexão" ao modo de voo; (b) liberar uma marcação, o que mexe em muitos arquivos; (c) deixar a pose de ki aparecer.
   → **Recomendo (a).**
10. **(T2) Flexões no celular/controle:** (a) agachar em todas as plataformas + modo alternativo tocando no item do slot 8; (b) um botão de menu por flexão; (c) botão de pulo.
    → **Recomendo (a).** O menu a cada flexão é lento e falha com o chat aberto, e o pulo fica bloqueado para impedir o voo.
11. **(T5) Gravidade/pesos/Sala do Tempo multiplicam o ganho das flexões?** (a) sim, até ×3; (b) não; (c) sim, sem limite (Sala do Tempo = ×25).
    → **Recomendo (a).**
12. **(T7) Valores iniciais:** concentração no máximo 10 pontos por sessão; flexões 3 séries por dia (≈ 1/3 de nível); treino mental dá pontos de habilidade na primeira vitória contra cada chefe.
    → **Recomendo aprovar como ponto de partida**, ajustando depois do teste em grupo.
13. **(T3 + M4) Quem conta nas missões de "derrotar".** Hoje qualquer morte do tipo certo conta. Os dois planos mexem no mesmo lugar:
    - réplicas do treino mental **não podem** contar (senão o treino vira atalho de missão);
    - os guardas das construções **podem ou não** contar.

    Proposta conjunta: **uma marca única "não conta para missão"**, usada pelas réplicas. Os guardas ficam sem a marca, ou seja, contam, e isso ajuda a achar soldados nas missões do Freeza. Se depois você preferir que os guardas não contem, basta pôr a mesma marca neles, sem trabalho extra.
    → **Recomendo réplicas com a marca e guardas contando.**
14. **(T3) Como criar as réplicas:** (a) o próprio chefe com a marca de réplica (sem arquivos novos); (b) uma entidade nova para cada chefe (~117 arquivos).
    → **Recomendo (a)**, com teste obrigatório: matar réplica não avança missão, não dá conquista e não dá loot.
15. **(T4) Onde acontece a luta mental:** (a) no lugar onde o jogador está; (b) arena própria.
    → **Recomendo (a) na primeira versão.**

### Habilidades

16. **(S1) Poder de Cura** (hoje não faz nada): (a) só bônus de regeneração + texto novo; (b) bônus agora e cura ativa/de aliados depois; (c) só trocar o texto.
    → **Recomendo (b)**, com a parte ativa depois da reorganização das habilidades.
17. **(S2) Bônus de regeneração do Poder de Cura:** +25%? (Para comparar: o Majin já tem ×2 de raça.)
    → **Recomendo +25%.**
18. **(S3) Desbloqueio de Potencial:** bônus pequeno por nível (até ×1,2) **ou** só reescrever o texto?
    → **Recomendo o bônus**, conferindo o poder final com as formas.
19. **(S4) Ki Divino:** esconder quem tem Ki Divino do "Sentir Ki" de quem não tem **ou** só reescrever o texto?
    → **Recomendo só o texto agora.** O efeito pode vir com as técnicas novas da Fase 5.
20. **(S5) Limitador:** vender (preço e mestre?) **ou** deixar só para administradores?
    → **Recomendo só para administradores por enquanto**, documentado e escondido da loja.
21–22. Já resolvidas e feitas (ver o fim desta seção).

### Mundo

23. **(M1) Bills e Whis no Palácio de Kami:** (a) mover para o planeta do Bills (remove os do Palácio uma única vez nos mundos antigos); (b) manter também no Palácio (duas cópias, sem risco).
    → **Recomendo (a), mover**, com teste em cópia de mundo antigo. O Marco também recomenda.
24. **(M2 + V13) Onde ficam Bills e Whis até o palácio existir:** na sala de jantar atual do planeta **ou** esperar o palácio?
    → **Recomendo já na sala de jantar.** Conflito resolvido: a Aquarela sugeria colocá-los dentro do arquivo da construção, mas o Marco mostrou que reconstruir o planeta os duplicaria. Fica o jeito do Marco: colocados por script, um de cada, sempre.
25. **(M3) Cópias de NPCs que já existem no Palácio de Kami:** Piccolo na casa dele e Bulma na Cápsula?
    → **Recomendo não por enquanto.** Os engenheiros na Cápsula entram de qualquer jeito, porque mundos novos ficaram sem nenhum.
26. **(M6) Os guardas voltam a cada quanto tempo?** 30 minutos de jogo, em Yamcha, Red Ribbon e Base do Freeza?
    → **Recomendo 30 minutos.**
27. **(M5) Grande Patriarca:** só aparecer **ou** ter conversa e alguma função (ex.: despertar poder)?
    → **Recomendo só aparecer na 1.7.18.** A função entra com os NPCs úteis da Fase 5.
28. **(M4)** Guardas contam nas missões: resolvido na decisão 13.
29. **(M7 + D7a) O que vem primeiro: arena do Torneio do Poder ou Palácio do Bills?** O plano da Aquarela mostrou que **a arena já existe** e só precisa de troca de cores (trabalho médio), enquanto o palácio é construção nova (trabalho grande).
    → **Recomendo a arena primeiro, na 1.7.18, e o palácio na 1.7.19.** Isso muda a recomendação anterior deste resumo, que era o palácio primeiro. Bills e Whis não esperam pelo palácio: vão já na 1.7.18 para a sala de jantar atual (decisão 24) e mudam para o terraço quando o palácio chegar. Os detalhes das duas construções estão nas decisões 34–37.
38. **(G1, Marco: `MORADORES_DETALHE.md`) Nível dos guardas Battle Jacket e Ladrão-Urso.**
    - Por que surgiu: depois da revisão, os guardas passaram a ser só tropa (Soldado do Freeza, Battle Jacket, Ladrão-Urso). Zarbon, Dodoria e General Black saíram, porque nasceriam fracos e completariam etapas da saga do Freeza.
    - O problema: hoje o Battle Jacket tem nível 1 e o Ladrão-Urso não tem nível, então os dois seriam figurantes.
    - Proposta: dar a eles um nível próprio nos dados das entidades (`powerDefinition` no `entities_data.js`), como o Soldado do Freeza (nível 14).
    → **Recomendo nível ~12–15 para os dois**, ajustando depois do teste em grupo.

### Visual e ícones

30. **(V15/V16/V17) Três dúvidas de gosto:**
    - os olhos do SSJ4 estão diferentes de propósito ou é defeito?
    - Vegeta e Trunks SSJ3 devem ter cabelo comprido como o Goku?
    - as pontas em "cubinho" do Beast incomodam?

    → **Recomendo:** olhar os prints (`ssj4.png`, `beast*.png`) e responder sim/não. Cada correção é pequena.
31. **(V8) Oozaru vazando da prévia do inventário:** aplicar o patch da Aquarela + ajuste da Engrenagem na 1.7.18, com teste lado a lado (se o Oozaru sumir das telas, como aconteceu na 1.7.14, volta-se atrás)?
    → **Recomendo sim.**
32. **(V11) Linha branca até o céu na Corporação Cápsula:** não vem dos nossos arquivos. Pode mandar um print bem de perto?
    → Sem print, fica em aberto. Os 7 vídeos de outubro também não foram vistos (o servidor não abre vídeo): prints dos trechos importantes ajudam.
33. **(I1) Ícones das telas antigas:** desenhar já os 6 confirmados pela Engrenagem (voltar, sombra, concentração, parar, iniciar, reiniciar) e os outros (missão, conquista, cadeado, customização, pontos de habilidade) junto com os 5 itens de script da 1.7.18 (item 12 do roteiro)?
    → **Recomendo sim.** Os ícones de máquina de gravidade, loja e Funções ficam para depois, porque essas telas não entram no restyle. Para o treino entram ainda `train_physical` e `train_mental`, junto com os treinos novos (1.7.19). Conflito resolvido: os treinos novos vão mudar a tela de Treino, mas **mantendo os mesmos textos dos botões**, para os ícones da Engrenagem continuarem funcionando.

### Arena do Torneio do Poder e Palácio do Bills

Veja a prancha `PALACIO_BILLS_ARENA_TP.png`: o "hoje" e o "proposto" das duas construções, vistos de cima.

34. **(D7b) Cores da arena:** só pedra clara, sem cor, **ou** com um anel de destaque (azul ou dourado) em volta do centro?
    → **Recomendo um anel dourado em volta do centro.** O resto em pedra clara, como no anime. Se no jogo ficar demais, tira-se o anel.
35. **(D7c) Céu da arena:** preto, como hoje, **ou** névoa com horizonte claro e azulado?
    → **Recomendo a névoa clara**, com um teste de cor para você aprovar no jogo. O céu preto é parte do motivo de a arena parecer "solta no vazio".
36. **(D7d) Palácio:** substituir a árvore vermelha central (a "esfera de folhas") **ou** manter a árvore e pôr o palácio ao norte?
    → **Recomendo substituir a árvore.** Para isso é preciso reexportar duas peças da ilha. Aproveitando a mesma passada, saem dessas peças os peixes, as almofadas e os suportes de armadura, que hoje duplicam a cada rebuild.
37. **(D7e) Mundos que já têm a arena ou o planeta gerados:** oferecer um comando de operador para reconstruir **ou** a mudança vale só para mundos novos?
    → **Recomendo oferecer o comando, nos dois casos.**
    - **Arena:** é seguro, porque ela não tem entidades salvas.
    - **Planeta do Bills:** só é seguro depois que as entidades saírem das peças (decisão 36) e com Bills e Whis colocados por script. Senão o rebuild duplica tudo, que é o problema de hoje.
    - **Aviso para o operador:** o rebuild troca os blocos da construção, então o que um jogador tiver construído ou quebrado dentro dela se perde.

37a. **(D7e, viabilidade do Marco) Arena: o que fazer nos mundos que já têm a arena?** A arena é colocada aos poucos, conforme o jogador chega perto. Trocar só os arquivos deixaria mundos com a arena **pela metade**: peças antigas coloridas ao lado das novas claras, um retalho pior que o de hoje. Opções:
    - **(a) Migração automática.** O mundo ganha uma marca de versão da arena (`dbe:top_palette` = 2). Quando um jogador estiver na dimensão, as peças já colocadas são recoloridas aos poucos (troca por filtro de cor, em pedaços pequenos, sem travar) e a luz invisível é removida. As peças que faltam já saem novas.
      - Custo: ~0,5–1 dia (Bússola). Leva de alguns segundos a 1–2 min na primeira visita.
      - Não apaga o que o jogador construiu. Um bloco igual (terracota/concreto) colocado por ele na arena também muda de cor, o que é raro e vai documentado.
    - **(b) Recolocar a arena inteira.** Zera a lista de peças colocadas.
      - Mais simples.
      - Apaga o que jogadores colocaram dentro da arena.
    - **(c) Ids novos (`tp2_*`) só para mundos novos.** Mundos antigos ficam com a arena antiga para sempre.
      - Risco zero para os mundos antigos.
      - O pacote passa a levar as duas versões da arena (as peças atuais já pesam ~48 MB), e os mundos antigos nunca recebem a correção.
    - **(d) Trocar os arquivos com o mesmo id, sem migração.** **Não aceitável**: causa a arena pela metade.

    → **Recomendo (a)**, com (b) disponível como comando de operador para quem quiser recolocar tudo (decisão 37). Corrige os mundos antigos sem apagar construções e sem dobrar o tamanho do pacote. Nenhum id `dbe:` muda; entra só a marca de versão `dbe:top_palette`, e a lista de peças colocadas (`dbe:top_pieces`) continua no mesmo formato. Testar em três mundos: novo, com a arena pela metade e com a arena inteira.

### Decisões já resolvidas (não precisa responder)

- **21. (S6) Punho Amigável:** ✅ feito. Depois da revisão, o efeito passou a valer só contra jogadores e criaturas do Dragon Universe, e o texto foi ajustado a isso (Bússola, `aa0b9eb` + `8c77357`).
- **22. (S7) Correções seguras:** ✅ feitas. O Punho e a Foice de Ki não gastam ki desligados, e o Hakai volta depois do Instinto Superior (Bússola, `aa0b9eb`, aprovado).

---

## 4. Já em andamento (não precisa decidir nada)

| O quê | Quem | Estado |
|---|---|---|
| **O0**: ferramentas de medição e comparação | Bússola | em andamento. O Arquiteto revisa O0 e O1 quando o Coordenador pedir |
| Correções visuais das construções: chão do Yamcha (`1962432`), rampa em volta do Piccolo/Yamcha (`7bb66ad`), árvores de Namek com copa solta (`6aeefce`), rampa só sobre terreno natural e nunca onde há jogador (`3ce430e`) | Marco | feitas; **entram na 1.7.17** |
| Telas antigas (Missões, Conquistas, Treino, Customização, Barbeiro) no estilo novo, com os 6 ícones confirmados | Engrenagem (+ Aquarela nos ícones) | **entregue, em revisão para entrar na 1.7.17**. O script dessas telas não muda; o que precisa de script é o item 12 da 1.7.18 |
| Correções de habilidades: Punho/Foice de Ki sem gastar ki desligados, Hakai volta após o Instinto Superior, texto e alcance do Punho Amigável (decisões 21 e 22) | Bússola | **feitas** (`aa0b9eb` + `8c77357`, aprovado); ajuste final do texto em andamento |
| Patch do Oozaru na prévia (`oozaru_ui_scale.patch`) | Aquarela | pronto, guardado para a 1.7.18 (decisão 31) |
| Ícones diferentes para os 3 convites | Aquarela | feito (`28792c1`) |
| Teste da 1.7.17 (redesign) | equipe | roteiro em `docs/wip/ROTEIRO_1.7.17.md` e `redesign/ROTEIRO_redesign.md` |
