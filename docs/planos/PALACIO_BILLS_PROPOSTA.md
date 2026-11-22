# Palácio do Bills: proposta visual para a 1.7.19 (dec. 36), para o Marco construir

- **Autora:** Aquarela. **Data:** 2026-11-22. **Base:** `PALACIO_BILLS_ARENA_TP.md` §1. Nada construído nem testado no jogo.
- **Prancha:** `PALACIO_BILLS_PROPOSTA.png`: vistas de cima, de frente e de lado; paleta com contagens; posição sobre a vista de cima real da ilha.
- **Modelo de blocos:** `palacio_bills_modelo.json`, com `{W:45, H:48, D:60, cells:[[x,y,z,bloco], ...]}` e 8.335 blocos.
  - x 0..44 vai de oeste a leste, y 0..47 sobe a partir da praça, z 0..59 vai de norte a sul.
  - O centro do palácio é (22, ·, 22).
  - `quartz_slab_top` = `quartz_slab` com `top_slot_bit`. `water` é fonte.
  - Serve como gabarito para construir ou para gerar a `.mcstructure`. Interior, escadas e decoração ficam a critério do Marco.

## Partes e medidas
| Parte | Medidas (blocos) | Blocos |
|---|---|---|
| Praça (no lugar da árvore vermelha central) | 45x45, y 0 | `smooth_sandstone`; borda `cut_sandstone`; juntas `chiseled_sandstone` a cada 5 |
| Palácio: 5 degraus de 6 de altura | base 31x31, recua 3 por lado (31, 25, 19, 13, 7); y 1–30 | paredes `sandstone`/`smooth_sandstone` alternados; quinas `cut_sandstone`; topo de cada degrau com **faixa `purpur_block` na borda** e laje `smooth_sandstone`; andares ocos |
| Janelas | 3x2 no meio de cada face, andares 1–4 | `cyan_stained_glass` |
| Entrada (sul) | 5x5 | moldura `stripped_dark_oak_log`, cortina `purple_stained_glass_pane` |
| Templo do topo | 7x7, y 31–40 | `smooth_sandstone`, quinas `cut_sandstone`, faixa `purpur_block` em y 34 |
| Olhos do gato (frente) | 2+2 em y 37 | `cyan_stained_glass` com `sea_lantern` atrás |
| Orelhas | triângulos de 5 de altura nas quinas da frente, y 41–45 | `purpur_block` (ou `purpur_stairs` no acabamento) |
| Ponta | y 41–47 | `gold_block` e `end_rod` (topo em y 47, ~48 de altura no total) |
| Terraço de jantar (sul) | 15x9 | piso `smooth_quartz`, borda `quartz_bricks`, postes `end_rod` nos cantos |
| Mesa | 7x3 | pés `quartz_pillar` nas quinas, tampo `quartz_slab` (metade de cima) |
| Bills e Whis | Bills à cabeceira oeste (assento `purple_wool`), Whis de pé a leste | **por script** (`BILLS_SPOTS` do Marco), **nunca** dentro do `.mcstructure` |
| Lago (leste do terraço) | elipse ~13x9 | `water`, borda `prismarine_bricks`, `lily_pad`; os peixes por script |
| Caminho | 3 de largura | `smooth_quartz` |

## Pontos de atenção (vistos ao sobrepor o modelo à ilha)
- **Árvore central:** é maior que a praça. As raízes passam da borda dos 45x45. A reexportação de `bills_1`/`bills_3` tem que tirar a árvore inteira (decisão 36) e, na mesma passada, as entidades salvas (peixes, almofadas, armor stands).
- **Chegada:** o ponto de chegada do planeta (`bills_planet.js`, spawn y≈130) fica **dentro da ilha, sob o centro**, na sala de jantar atual, ~56 blocos abaixo da superfície.
  - O caminho de quartzo tem que sair da saída atual dessa sala.
  - **Sugestão:** escada ou poço por dentro do palácio, descendo da entrada até a sala. Aí o palácio vira a "porta" do planeta.
- **Lago:** a elipse encosta numa das árvores azuis do anel. Se colidir na ilha real, encolher ou mudar o lago para oeste.
- **Peças sugeridas:**
  - `bills_palace_a`: palácio e templo, 31x48x31.
  - `bills_palace_b`: praça, terraço, lago e caminho, 45x2x60.
  - Entram como peças novas em `bills_planet.js` (Bússola). Rebuild por comando de operador (dec. 37) só depois que as entidades saírem das peças.

## Teste no jogo (para o roteiro da 1.7.19)
- **Vistas:**
  - de longe: silhueta em degraus, faixas roxas, orelhas e ponta dourada, legíveis da borda da ilha;
  - de frente: os olhos acendem à noite (`sea_lantern`).
- **Terraço:** Bills e Whis à mesa, sem duplicar no rebuild; o lago não vaza.
- **Caminho:** da chegada até o terraço, sem cair no vazio.

## Migração da árvore em mundos antigos (Marco, 1.7.19)
- Mundo que já tinha a ilha: a árvore central sai uma vez, sozinha, com um jogador no planeta (`dbe:bills_planet_version` = 2). Só as 9.780 células exatas da árvore antiga (`scripts/data/bills_tree_cells.js`), e em cada uma só se ainda houver um bloco dos tipos da árvore (madeiras de mangue, crimson, dark oak, raízes de mangue, lama). A camada da superfície (y=140) vira grama.
- **Risco registrado:** se um jogador pôs um desses blocos exatamente numa célula onde a árvore estava, ele sai junto. Fora dessas células nada muda: o teto da sala de jantar (y=136) e o arco de mangue da saída (x -9..-1, z 24..25) ficam.
- As peças do palácio só são colocadas **depois** da migração e de todas as peças da ilha: o palácio nunca sai cortado.
- Testar em três mundos: novo (sem árvore desde o início), com a ilha inteira (a árvore some na 1ª visita, depois o palácio aparece) e um mundo onde o jogador construiu ao lado da árvore (a construção fica).
- O rebuild por comando continua como opção do operador (pede confirmação e leva todos para a chegada).
