# D7: Palácio do Bills x Arena do Torneio do Poder (proposta visual)

- **Autora:** Aquarela. **Data:** 2026-11-22. Só planejamento, sem commit.
- **Prancha:** `planos/PALACIO_BILLS_ARENA_TP.png`. As vistas de cima foram geradas das `.mcstructure` reais (leitura do NBT): 1 cor por família de bloco, e quanto mais claro, mais alto.
- **Base:** `integration/1.7.17` (BP `structures/dbe/bills_planet/`, `structures/dbe/tournament_of_power/`, `scripts/bills_planet.js`, `scripts/tournament_of_power.js`).
- Nada foi testado no jogo.

## Resumo para decidir

| | Palácio do Bills | Arena do Torneio do Poder |
|---|---|---|
| O que existe hoje | ilha flutuante 138x106 (5 peças), sem palácio; sala de jantar dentro da ilha | **a arena já existe**: disco de ~250 blocos, anéis de mosaico, arquibancada em arco e esfera de observação (63 peças, de Ricardo Vinicius) |
| Problema visual | falta o palácio; uma árvore vermelha gigante no centro parece uma "esfera de folhas" de longe | piso em 10 cores de terracota pontilhadas ("retalhos"); 89% dos blocos são luz invisível, então tudo fica chapado, sem sombra |
| Proposta | palácio novo em degraus (31x31, ~50 de altura) no centro + terraço de jantar com Bills e Whis + lago | **recolorir** a geometria existente em pedra clara (troca de paleta, sem rebuild) + tirar a luz invisível + céu/névoa |
| Reaproveita | ilha, anel de árvores, luazinhas, sala de jantar atual (provisória) | 100% da geometria; só a paleta e a luz mudam |
| Esforço | **G** (construção nova ~25–35 mil blocos, mais ajuste de NPC com o Marco) | **M** (script de troca de paleta nas 63 peças, mais teste) |
| Risco de save | baixo: peça nova; a ilha antiga fica | baixo: mesmas peças e coordenadas; o mundo já gerado mantém a versão antiga até um rebuild |

**Recomendação:** a arena do TP primeiro. Resolve um problema visível já reportado (o chão de retalhos) com esforço M e ainda alivia a colocação de 1,34 milhão de blocos de luz. O palácio do Bills é G, e Bills e Whis podem ir antes para a sala de jantar atual (D2 do plano do Marco).

---

## 1. Palácio do Bills

### 1.1 Referência da obra
- Planeta pequeno de Bills (Beerus) em *Dragon Ball Super*.
- O palácio é uma torre-templo em degraus, de estilo egípcio, com detalhes roxos e a silhueta lembrando a cabeça de gato do Bills.
- Vegetação de árvores redondas e coloridas, e um lago.
- As refeições são servidas por Whis numa mesa ao ar livre.
- A ilha atual já tem o anel de árvores redondas azuis. Falta o palácio.

### 1.2 Estado atual (vista 1 da prancha)
- `bills_1..5`: 138x134x106. Ilha quadrada (~100x95 úteis) de `dbe:namek_grass`, com borda de `warped_wart_block`/prismarine.
- 10 árvores azuis (`dbe:ajisa_leaves`) em anel, raio ~40.
- No centro, uma árvore gigante de mangue/crimson (~50x50), com folhas vermelhas e raízes.
- Duas luazinhas ao lado: uma de arenito/terracota laranja (`bills_5`) e outra roxa.
- Miolo da ilha: 63 mil `purple_terracotta` (bills_1 e bills_3), com purpur e concreto roxo.
- Sala de jantar **dentro** da ilha, perto da chegada (y≈130): tábuas de dark oak, tijolo, mesa de quartzo com bolo (`bills_3`, print `Outubro/bills.png`).
- Entidades salvas em `bills_3`: 4 peixes, `dbe:giant_fish`, 2 almofadas e 2 armor stands. Elas duplicam no `bills_planet_rebuild`, problema que já existe hoje.

### 1.3 Proposta (vista 2 da prancha)
| Parte | Tamanho (blocos) | Blocos |
|---|---|---|
| **Piso/praça** em volta do palácio | 45x45, no lugar da árvore central | `smooth_sandstone`, borda `cut_sandstone`, juntas `chiseled_sandstone` a cada 5 |
| **Palácio**: 5 degraus de 6 de altura, base 31x31 recuando 3 por lado a cada degrau | 31x31x30 | `smooth_sandstone` / `sandstone` alternados; faixa `purpur_block` no topo de cada degrau; cantos `cut_sandstone` |
| **Templo do topo** com "orelhas de gato" e ponta dourada | 7x7x10, mais 5 de ponta | `smooth_sandstone`; orelhas `purpur_stairs`; ponta `gold_block` + `end_rod`; "olhos" de `cyan_stained_glass` (brilho de `sea_lantern` atrás) |
| **Entrada** (frente sul) | portal 4x5 | `dark_oak` + cortina de `purple_stained_glass_pane` |
| **Terraço de jantar** (ao sul, entre o palácio e a chegada) | 15x9 | piso `smooth_quartz`; mesa 7x3 de `quartz_slab` sobre `quartz_pillar`; 2 assentos (`purple_wool` / `light_blue_wool`); 4 postes de `end_rod` |
| **Lago** ao lado do terraço | ~12x8, 2 de fundo | água, borda `prismarine_bricks`, `lily_pad`, os peixes atuais **via script** (não no `.mcstructure`) |
| **Jardim/caminho** chegada → terraço | 3 de largura | `smooth_quartz`; mantém as 10 árvores azuis atuais |

- **Bills e Whis** ficam no terraço, com Bills à cabeceira e Whis de pé ao lado.
- As posições ficam na constante `BILLS_SPOTS` do plano do Marco, colocadas por script e **nunca dentro do `.mcstructure`** (senão o rebuild duplica).
- O total cabe em 2 peças novas (≤64 por eixo): `bills_palace_a` (31x48x31, palácio e topo) e `bills_palace_b` (45x6x45, praça, terraço e lago). Entram como `piece(6…)`/`piece(7…)` no `bills_planet.js` (Bússola).

### 1.4 O que reaproveitar
- **Ilha, anel de árvores e luazinhas:** ficam como estão.
- **Árvore central:** sai. O palácio ocupa o lugar dela. Remover exige reexportar `bills_1`/`bills_3` sem a árvore (Marco). A alternativa sem reexportar é pôr o palácio na metade norte e manter a árvore, mas o centro fica disputado.
- **Sala de jantar interna:** vira a posição provisória de Bills e Whis até o palácio existir (D2). Depois pode virar a "adega" (entrada pelo palácio).
- **Paleta:** reaproveita o que a ilha já usa (purpur, sandstone, quartzo da mesa).

### 1.5 Problemas visuais já vistos
- A árvore vermelha central lê como uma esfera de folhas de longe (`Outubro/bills2.png`).
- O interior de tijolo e madeira não tem cara de palácio (`Outubro/bills.png`).
- Entidades salvas em `bills_3` duplicam no rebuild.

### 1.6 Esforço: **G**
- Construção nova: ~25–35 mil blocos. 2–3 dias de construtor, ou 1 dia com um gerador por script que faça os degraus e o terraço, mais o acabamento à mão.
- Reexportar `bills_1`/`bills_3` sem a árvore central: M.
- NPCs no terraço: P, já planejado pelo Marco.

---

## 2. Arena do Torneio do Poder

### 2.1 Referência da obra
- Torneio do Poder em *Dragon Ball Super*.
- Arena circular enorme, flutuando no "Mundo do Nada", com piso de pedra clara em placas.
- Há um pilar central e estruturas na borda.
- Os Zen-Oh e o Grande Sacerdote assistem de uma estrutura à parte, e os deuses ficam em arquibancadas em volta.

### 2.2 Estado atual (vista 3 da prancha)
- **Geometria:** 63 peças, 359x310 de área, y de -63 a 186, 48 MB.
- **Disco principal:** ~250 de diâmetro, com anéis concêntricos de triângulos e trapézios (mosaico).
- **Centro:** um núcleo (azul na vista de cima) e uma torre de peças `y2`/`y3`. É a torre listrada do print.
- **Arquibancada:** em arco à esquerda (oeste).
- **Esfera à direita:** borda amarela, provável camarote dos Zen-Oh.

**Blocos (total das 63 peças, sem ar):**
- `light_block_15`: **1.340.355 (89%)**, preenchendo o ar.
- Mosaico: `gray_concrete` 23k, `brown_terracotta` 22k, `white_terracotta` 18k, `gray_terracotta` 15k, `black_concrete` 14k, `brown_concrete` 11k, `blue`/`black`/`cyan`/`green`/`red_terracotta` 6–9k cada.
- Outros: `barrier` 3k, `quartz_block` 2k, `obsidian` 1,4k, `border_block` 579.
- Nenhuma entidade salva.

**Dimensão:** `dbe:tournament_of_power`, `generator_type: void`, bioma `dbe:space` (céu preto).

### 2.3 Problemas visuais já vistos (`Outubro/torneiopoder.png`)
- **Piso de retalhos:** cada região do mosaico mistura 2 cores pontilhadas, em 10 cores fortes. Rente ao chão, vira uma colcha sem leitura.
- **Luz uniforme:** a luz invisível em todo o volume apaga as sombras. Piso e torre ficam chapados contra o céu preto.
- **Céu preto puro:** sem horizonte nem névoa, a arena parece "no vazio do editor".

### 2.4 Proposta (vista 4 da prancha)
1. **Recolorir, sem reconstruir.** Um script de manutenção (Node, como o leitor de NBT usado aqui) troca só as entradas de `block_palette` em cada `.mcstructure`. Geometria, tamanho e coordenadas não mudam.

| Hoje | Proposto |
|---|---|
| `white_terracotta`, `white_concrete` | `smooth_quartz` (placas claras) |
| `light_gray_*`, `blue_terracotta` | `polished_diorite` |
| `cyan_terracotta` | `calcite` |
| `brown_*`, `hardened_clay` | `smooth_stone` |
| `gray_*`, `red_terracotta` | `polished_andesite` |
| `green_terracotta` | `stone` |
| `black_*` | `polished_deepslate` (linhas) |
| `border_block` | sem mudança (borda) |

   - O desenho dos anéis continua e passa a ler como placas de pedra (vista 4).
   - O pontilhado restante dá textura de pedra, sem virar colcha.
   - Opcional: um único anel de destaque em `light_blue_glazed_terracotta`, ou de `gold_block` em volta do centro.
2. **Luz:** trocar `light_block_15` por ar e deixar luz só onde precisa: `sea_lantern`/`shroomlight` embutidos no piso a cada ~12 blocos e na torre.
   - Isso devolve as sombras e tira ~1,34 milhão de blocos da colocação (ganho de desempenho para a Bússola).
   - **Testar antes:** sem a luz invisível, ver se a dimensão `void` tem luz do céu suficiente.
3. **Céu/névoa:** um fog próprio (`fogs/`) para `dbe:tournament_of_power`, com horizonte claro e azulado, para a arena não flutuar num preto absoluto. Vale um teste de cor com o usuário.
4. **Camarote dos Zen-Oh (esfera):** manter. Revisar só a paleta, na mesma passada.

### 2.5 O que reaproveitar
- Tudo: as 63 peças, `tournament_of_power.js` (coordenadas iguais) e a dimensão.
- Ninguém precisa construir nada.

### 2.6 Esforço: **M**
- Script de troca de paleta, com relatório antes/depois e prévia de cima como nesta prancha: ~0,5 dia.
- Fog: P.
- Teste no jogo: piso, luz, desempenho da colocação.
- **Mundo já gerado:** as peças colocadas não mudam sozinhas. Precisa do rebuild da arena (`createSpaceArena`, como o do Bills) ou fica só para mundos novos.

---

## Decisões para o usuário
- **D7a.** O que entra primeiro: arena do TP (M, recomendada) ou palácio do Bills (G)?
- **D7b.** Arena: paleta "pedra clara" sem cor, ou com um anel de destaque (azul ou dourado)?
- **D7c.** Arena: céu preto (como hoje) ou névoa/horizonte claro?
- **D7d.** Palácio: substituir a árvore vermelha central (recomendado) ou manter a árvore e pôr o palácio ao norte?
- **D7e.** Mundos já gerados: oferecer rebuild (comando de operador) ou valer só para mundos novos?

---

## Viabilidade técnica (Marco)

Base: `agent/marcos` (`3ce430e`). As medições foram feitas com o leitor NBT descartável do plano de mobs. Nada testado no jogo.

### A. Trocar a paleta das 63 peças
**Recomendado: regravar as `.mcstructure` (offline).**
- Nas 63 peças, todas as entradas do mosaico e a `light_block_15` têm `states: {}` e a mesma `version`. Os blocos de destino da tabela 2.4 também não têm estados (`smooth_quartz`, `polished_diorite`, `calcite`, `smooth_stone`, `polished_andesite`, `stone`, `polished_deepslate`). A troca é só **renomear o `name` na `block_palette`**.
  - Exceção: `red_glazed_terracotta`, com `facing_direction`. Fica como está ou vira um bloco sem estado.
- Cada paleta tem no máximo 50 entradas. A lista `block_indices` **não muda**: a geometria e os índices são os mesmos.
  - Nomes que viram iguais (várias cores → `smooth_stone`) podem ficar como entradas repetidas, ou ser fundidos com o remapeamento dos índices, que é uma troca de int no lugar.
- Como o nome muda de tamanho, a gravação é uma **reescrita completa do NBT** (little-endian), não uma edição de bytes no lugar como no H6/Guru.
  - Precisa de um escritor NBT pequeno (~150 linhas Node) e de uma verificação depois:
    - releitura da peça.
    - mesma contagem de blocos por posição.
    - prévia de cima igual à da prancha.
    - `check-refs`/tamanhos.
- **Não recomendo** trocar a paleta por script no jogo, a cada colocação. Seriam ~180 mil blocos sólidos, refeitos em toda colocação (ou um `fillBlocks` com filtro por peça e por cor, ~14 cores x centenas de volumes). Esse caminho só serve como **migração** de mundos já gerados (C).

### B. Tirar os `light_block_15` (1.340.355, 89% dos blocos)
Duas formas, também na regravação:
1. **`light_block_15` → `minecraft:air`** (renomear a entrada).
   - Uma recolocação limpa a luz antiga.
   - A colocação custa o mesmo número de blocos, mas sem fonte de luz: o motor não recalcula luz em 1,34 M de blocos, e isso deve aliviar a colocação.
2. **`light_block_15` → vazio de estrutura** (índice -1, como no Guru).
   - O `structureManager.place` pula essas células, então a colocação fica bem mais leve.
   - Numa recolocação de mundo já gerado, a luz antiga **fica** e precisa da remoção de (C).
   - Em mundo novo dá no mesmo, porque a dimensão é `void`.

Recomendo a **2 para mundos novos + a remoção de (C) para mundos antigos**.

Pontos a confirmar no jogo:
- A dimensão `dbe:tournament_of_power` é `void` com bioma `dbe:space`, sem `has_skylight` declarado. Sem a luz invisível, a claridade vem do céu da dimensão.
  - Se ficar escuro demais, pôr `sea_lantern`/`shroomlight` embutidos no piso a cada ~12 blocos (proposta 2.4.2). Isso é edição de blocos, então vira construção (Marco), não só paleta.
- Mobs hostis podem nascer no escuro. O `removeMobs` do Torneio já remove a família `mob`.
- O código não depende mais da luz: a chegada não usa `light_block_15` desde `6b140f0`. A única referência no BP é a do `universe_6_dimension.js` (outra arena).

### C. Risco em mundos onde a arena já foi gerada
- As peças são colocadas aos poucos, conforme o jogador se aproxima. A lista das colocadas fica em `dbe:top_pieces`.
- **Risco principal: arena "meio a meio".** Trocar o arquivo com o mesmo id faz as peças que ainda faltam saírem na paleta nova, ao lado das já colocadas na antiga. Vira um retalho pior. Precisa de migração em `tournament_of_power.js`/`space_arena.js` (Bússola, ou eu com autorização):
  - uma propriedade de versão da arena (ex.: `dbe:top_palette` = 2).
  - mundo com peças colocadas e versão antiga: **recolorir só as peças já colocadas** quando o jogador está na dimensão, uma peça por ciclo e com a área carregada (como o `loadNearby`). Usa `dim.fillBlocks(volume, novo, { blockFilter: { includeTypes: [antigo] } })` em fatias de até 32x32x32 (limite seguro), uma por cor, mais uma passada `light_block_15` → ar.
  - Ordem de grandeza: arena inteira 359x310x250 ≈ 850 fatias x ~15 trocas ≈ 13 mil chamadas nativas, espalhadas em `runJob`. Alguns segundos a 1–2 min, sem travada.
  - Alternativa mais simples: zerar `dbe:top_pieces` e recolocar tudo.
    - Com a luz virando **ar**, a recolocação limpa a luz.
    - Com **vazio**, a luz fica e precisa da passada de remoção.
    - Recolocar apaga o que o jogador **colocou** na arena (`protectBlocks` impede quebrar, não impede colocar).
- **Blocos do jogador:** a troca por filtro também recolore um bloco igual que o jogador tenha posto na arena. É raro (terracota e concreto) e é aceitável, mas documentar.
- **Downgrade:** um mundo recolorido aberto numa versão antiga continua com a paleta nova nas peças colocadas, e as que faltarem saem na antiga. Não duplica nem quebra o save. O downgrade já não é suportado.
- **Save:** nenhum ID `dbe:` muda. Entra uma propriedade de mundo nova (`dbe:top_palette`) e a lista `dbe:top_pieces` continua no mesmo formato.

### D. Esforço
| Parte | Dono | Tamanho |
|---|---|---|
| Escritor NBT + script de troca de paleta, luz → vazio, verificação e prévia de cima | Marco | **M** (~0,5–1 dia) |
| Migração de mundos já gerados (versão, recolorir por `fillBlocks`, remover luz) | Bússola (`space_arena.js`) ou Marco com autorização | **M** (~0,5–1 dia) |
| Luz embutida no piso, se ficar escuro | Marco (`.mcstructure`) | P/M |
| Fog/céu da dimensão | Aquarela (RP) | P |
| Teste no jogo: mundo novo, mundo com arena parcial, mundo com arena inteira, desempenho da chegada | Testador | — |

**Total: M** (1–2 dias com a migração). Sem migração, só mundos novos: ~0,5–1 dia, mas um mundo com a arena parcialmente gerada fica misturado. Então **ou faz a migração, ou troca o id das peças** (`tp2_*` + `dbe:top_pieces` novo, recolocando a arena inteira só em mundos novos e deixando a antiga intacta nos velhos).
