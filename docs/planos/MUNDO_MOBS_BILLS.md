# Mundo: mobs/NPCs das construções e Bills/Whis no planeta do Bills (plano)

Autor: Marco (Mundo). Data: 2026-11-22. Base: `agent/marcos` com `integration/1.7.17` mesclada (`5f80820`).
Somente planejamento: nenhum código foi alterado. Nada aqui foi testado no Minecraft.
Os dados das estruturas foram lidos direto dos `.mcstructure`, com um leitor NBT descartável (entidades salvas, blocos e pisos). Também entram os itens do relatório da Aquarela (`planos/VISUAL_PENDENTE.md`, itens 10–14).

---

## 0. Resumo

- **Nenhuma construção nova da 1.7.17 tem mob ou NPC dentro do `.mcstructure`.** Piccolo, Yamcha, Red Ribbon, Base do Freeza, Guru, Cápsula e Torneio só têm blocos. A Cápsula tem ainda 39 entidades `minecraft:cushion` (assentos). A única entidade criada por script é o locutor do Torneio (`dbe:announcer`).
- **Bills e Whis não estão no planeta do Bills.** Os dois estão no `lookout.mcstructure` (Palácio de Kami, mundo normal, perto de x=150 z=150), junto com Kami, Popo, Korin, Piccolo, Bulma e a Máquina do Tempo. O planeta do Bills (`bills_1..5`) tem só peixes, almofadas e 2 armor stands, e nenhum script coloca NPC lá.
- O **Grande Patriarca** (`dbe:grand_elder_guru`) tem entidade BP+RP completa e nome traduzido, mas não aparece em lugar nenhum e não tem diálogo.
- Com a West City aposentada, mundos novos ficam **sem nenhum Engenheiro da Cápsula** (`dbe:capsule_corp_engineer`), que tem diálogo próprio. Os 15 engenheiros estavam na `west_city.mcstructure`.
- **Qualquer morte conta na missão.** `defeat_enemy` (index.js ~12783) conta toda morte do tipo certo feita pelo jogador, não só a dos mobs que a missão criou. Guardas de construção vão contar para as missões ativas do mesmo tipo.

---

## 1. Mobs/NPCs por construção

Legenda de origem: **S** = entidade salva no `.mcstructure`; **R** = spawn rule natural (bioma); **J** = script.

### 1.1 Tabela do que existe hoje

| Construção | Onde | O que aparece hoje | Origem | Estado |
|---|---|---|---|---|
| Casa do Piccolo | mundo normal (`world_landmarks.js`) | nada | — | sem NPC |
| Casa do Yamcha | deserto (`world_landmarks.js`) | nada (o `bear_thief` só nasce em `diablo_desert`/`dirtstone`, não em `minecraft:desert`) | — | sem NPC; laje de terra (§1.3) |
| Torre Red Ribbon | mundo normal | nada | — | sem guarda |
| Base do Exército do Freeza | planeta Freeza | soldados, Freeza, King Cold, saibaman e namekuseijin do planeta (bioma, não da base) | R | sem guarda própria |
| Casa do Guru | Namek | namekuseijins do bioma; Guru **não** | R | Guru ausente |
| Corporação Cápsula | mundo normal | 39 `minecraft:cushion` (assentos) | S | sem NPC; placa e linha (§1.3) |
| Torneio de Artes Marciais | mundo normal (modo `relative`) | `dbe:announcer` | J (`spawnAnnouncer`, flag `spot.announcer`) | OK, mas não volta se sumir |
| Torneio antigo (modo `legacy`) | dimensão própria | locutor do mapa antigo | S/J (index.js) | OK |
| Torneio do Poder | `dbe:tournament_of_power` | nada; `removeMobs` apaga tudo da família `mob` | — | sem NPC; chão de retalhos (§1.3) |
| Planeta do Bills | `dbe:bills_planet` | 3 peixes tropicais, 1 baiacu, 1 `dbe:giant_fish` (peixe oráculo), 2 almofadas, 2 armor stands | S (`bills_3`) | **sem Bills e Whis** |
| Palácio de Kami (Lookout) | mundo normal, ~(150, 219, 150) | Popo, Korin, Piccolo, **Whis, Beerus**, Kami, Bulma, Máquina do Tempo | S (colocado uma vez, `lookoutLoaded`) | OK (é onde Bills/Whis estão) |
| Kame House | oceano quente (`world_structures.js`) | Roshi, Krillin, Unigame | S | OK |
| Casa do Goku | dirtstone (`world_structures.js`) | Goku, Chi-Chi | S | OK |
| Arena do Cell | dirtstone plains | `dbe:cell_npc` | S | OK |
| Nave do Babidi | deserto | `dbe:babidi` | S | OK |
| Planeta do Sr. Kaioh | Outro Mundo | Sr. Kaioh, Akira Toriyama | S | OK |
| Palácio do Enma | Outro Mundo | Enma | S | OK |
| Sala do Tempo | dimensão própria | `dbe:vegeta_npc` | S | OK |
| West City (aposentada) | só mundos antigos | 15 engenheiros | S | fica como está |
| Vilas dos planetas / de Namek | planetas | aldeões de cada planeta / namekuseijins persistentes | J (`planet_villages.js`, `namek_dimension.js`) | OK |

Detalhes que valem para todas as propostas:
- NPCs (`dbe:beerus`, `dbe:whis`, `dbe:grand_elder_guru`, `dbe:piccolo`, `dbe:announcer`, engenheiro…):
  - família `npc`, `minecraft:persistent` e dano desligado (`deals_damage: no`).
  - Não andam, só olham para o jogador.
  - Têm o grupo `dbe:despawn` (`instant_despawn`). **Nenhum script do BP dispara esse evento**: ele só roda com `/event entity … dbe:despawn`.
- Inimigos `quest_mob` (frieza_soldier, zarbon, dodoria, general_black, androides, piccolo_enemy):
  - **não são persistentes** e têm `minecraft:despawn`, então somem longe do jogador.
  - Todo `dbe:*` criado por script é inicializado sozinho com nível e habilidades (`initializeEntity`, 20 ticks depois do spawn).
- Regiões com `preventMobSpawning` (área do Torneio) removem tudo o que não é `npc`, `inanimate` ou `ki_attack`. Guarda hostil não pode ficar ali.
- O `removeMobs` do Torneio do Poder só remove a família `mob`. Família `npc` e `quest_mob` ficam.

### 1.2 Proposta concreta por construção

Dois mecanismos novos, os dois em arquivos do Marco:

**A. Moradores fixos (NPCs, um por mundo): `scripts/world_residents.js` (novo).**
- Registro `addResident({ id, type, dim, pos, yaw, radius })`.
- A cada ~5 s, se há jogador a até 48 blocos de `pos` **e** os chunks do raio estão carregados:
  - procura entidades `type` com a tag `dbe_resident:<id>` num raio de 24.
  - **0 encontradas:** `spawnEntity` em `pos`, `addTag("dbe_resident:<id>")`, gira para `yaw`.
  - **mais de 1:** remove as extras (corrige duplicação).
  - **1 longe mais de 3 blocos de `pos`:** `teleport` de volta (empurrada).
- Não salva nada no mundo além da tag na própria entidade. A verdade é "existe a entidade com a tag".
- Nunca dispara `dbe:despawn` e não usa `dbe:spawned_by`, que é a marca das missões e faz `despawnEntities` apagar a entidade.
- Construções com spot sorteado registram moradores pelo `world_landmarks.js` depois de `placed`, com `pos` relativo ao canto do spot.
- Substitui a flag `spot.announcer`: o locutor volta se for removido. A flag continua sendo lida e o plano não muda de formato.

**B. Guarnição (inimigos com reposição): campo opcional `garrison` na spec do `world_landmarks.js`.**
- `garrison: { every: 36000, mobs: [{ type, n, at: [dx, dy, dz] }] }`, onde `every` é o intervalo em ticks de tempo absoluto (36000 = 30 min).
- Com jogador a até 48 blocos e a área carregada:
  - conta as entidades com a tag `dbe_garrison:<key>` na caixa da construção.
  - Repõe só o que falta quando `world.getAbsoluteTime() - spot.garrisonAt >= every`. Na 1ª visita (`garrisonAt` indefinido) repõe na hora.
  - Grava `spot.garrisonAt`: é um número opcional a mais no spot, o plano continua v2.
- Os guardas não recebem `dbe:spawned_by`. Contam nas missões ativas do mesmo tipo (decisão D4).
- Como os `quest_mob` somem longe do jogador, a guarnição se recompõe na próxima visita depois do intervalo, nunca em loop.

Por construção. As posições são o canto do spot mais o deslocamento, medidas nos pisos do `.mcstructure`; conferir no jogo e ajustar 1–2 blocos se preciso.

| Construção | Proposta | Tipo | Posição (relativa ao canto) | Observação |
|---|---|---|---|---|
| Casa do Piccolo | 1 `dbe:piccolo` morador (opcional) | A | piso interno (21, 7, 19) | O Piccolo NPC já existe no Lookout; seria uma 2ª cópia (diálogo por tipo, sem conflito). Decisão D3 |
| Casa do Yamcha | 2 `dbe:bear_thief` (bandido do deserto) | B (`every` 30 min) | térreo (13, 1, 12) e (8, 1, 18) | Não existe entidade do Yamcha; um NPC Yamcha seria modelo novo (Aquarela, G) |
| Torre Red Ribbon | 3 `dbe:battle_jacket` (2 no térreo + 1 no topo) | B | térreo (16, 1, 4) e (16, 1, 28); topo: piso y=48 (16, 48, 16) | Só tropa (revisão do Arquiteto): General Black e androides ficam de fora (chefes de missão). Ver `MORADORES_DETALHE.md` §4 |
| Base do Freeza | 5 `dbe:frieza_soldier` | B | pátio (29, 3, 29) ± 6 | Só tropa (revisão do Arquiteto): Zarbon, Dodoria, Freeza e King Cold ficam de fora (chefes da saga) |
| Casa do Guru | 1 `dbe:grand_elder_guru` morador + 2 `dbe:namekian<dbe:make_persistent>` na entrada | A (Guru), B (namekuseijins, sem reposição frequente) | Guru: centro da cúpula, sobre o tapete, **(45.5, 75, 45.5)** (piso de grama namek em y=74, teto livre até y=97) | Sem diálogo: interagir não faz nada. Diálogo novo = chaves `.lang` (Coordenador) + `dialogues_data.js`. Decisão D5 |
| Corporação Cápsula | 3 `dbe:capsule_corp_engineer` moradores; Bulma opcional | A | piso central (70, 24, 77), (66, 24, 77), (74, 24, 77) | Mundos novos não têm engenheiro desde que a West City saiu. Bulma: 2ª cópia (já está no Lookout). Decisão D3 |
| Torneio de Artes Marciais | locutor passa a ser morador | A | (38.5, 1, 53.5), a posição atual | A região tem `preventMobSpawning`: só NPC aqui, nunca guarnição |
| Torneio do Poder | nada agora | — | — | Espera a arena nova (§1.3, item 12) |
| Planeta do Bills | Bills e Whis | A | ver §2 | — |
| Demais (Lookout, Kame House, Goku, Cell, Babidi, Kaioh, Enma, Sala do Tempo) | sem mudança | S | — | Já vêm na estrutura e são colocados uma vez |

Arquivos e IDs: `world_residents.js` (novo; entra no `contents.json` e é importado pelo `world_landmarks.js`, sem mexer no index.js) e `world_landmarks.js` (campos `residents`/`garrison` nas specs). Sem IDs `dbe:` novos, sem chave de save nova além do campo opcional `garrisonAt` dentro do plano existente, sem `.lang` (exceto o diálogo do Guru, se aprovado).

### 1.3 Itens visuais da Aquarela ligados ao Mundo

| # | Item | Causa encontrada | Proposta | Dono / tamanho |
|---|---|---|---|---|
| 10 | Laje quadrada sob a casa do Yamcha | A camada 0 do `yamcha_house` é **491 blocos de terra** + tábuas de acácia, no meio do deserto. A fundação já é arenito | Estender o mecanismo do chão do Freeza (`floor`, troca só onde o template tem o bloco): Yamcha `dirt → sand` (camada de cima) e `→ sandstone` (abaixo). Para mundos já gerados, o `followUp` faz a troca na próxima visita, como na Base do Freeza | Marco, P/M |
| 10 | Degrau de grama/terra sob a casa do Piccolo | A camada 0 é deck de `stripped_mangrove_log` + 202 grama + 172 terra. A fundação de terra fica exposta quando o chão em volta é mais baixo | "Saia" de 2–3 blocos em rampa em volta do contorno, com o bloco de superfície do bioma do lugar, e não terra fixa | Marco (+ Bússola se mexer no assentamento comum), M |
| 11 | Placa "CAPSULE CORP" irregular | Letras feitas de blocos na estrutura | Redesenhar as letras no `.mcstructure` (peças `capsule_corp_4/5`) | Marco, P |
| 11 | Linha branca até o céu | **Na estrutura não há** end rod, lightning rod, beacon, corrente nem barreira, e nenhuma entidade tem `LeashID`. A suspeita são os 39 `minecraft:cushion` ou uma partícula | Confirmar no jogo (print bem de perto + `/scriptevent dbe:landmarks`). Se forem os cushions, removê-los da estrutura (são assentos invisíveis) | Marco, P |
| 11 | Calçada sobre a água | Assentamento | Já coberto pelo filtro de borda de bioma da 1.7.17. Conferir no roteiro §3 | — |
| 12 | Chão de retalhos no Torneio do Poder | Mapa atual (`tp_*`, 63 peças) | Arena circular nova: construção G (Marco) + regra de terreno vazio fora dela (Bússola). Fora do escopo deste plano de mobs | Marco + Bússola, G |
| 13 | Planeta do Bills sem palácio | `bills_1..5` é uma ilha; o interior com tábuas e tijolo é uma sala de jantar (bolo e mesa de quartzo em `bills_3`) | Palácio novo (pirâmide com cúpula, cara de gato): G. Bills e Whis entram antes, na sala de jantar atual (§2), com a posição numa constante para mudar quando o palácio chegar | Marco, G (palácio) / P (NPCs) |
| 14 | Copas soltas em Namek | Feature de árvore ou recorte antigo do H6 | Ver em mundo novo da 1.7.17. Se ainda acontecer, a feature tem que exigir solo | Bússola, P |

---

## 2. Bills e Whis no planeta do Bills

### 2.1 Onde estão hoje
- **Entidades:**
  - `dbe:beerus`: NPC com diálogo `beerus_main_menu` e treinador de habilidade (`skills_data.js` l.259).
  - `dbe:beerus_enemy`: inimigo da saga, criado pela própria missão (`spawnOnStart`) onde o jogador estiver.
  - `dbe:whis`: NPC com diálogo `whis_main_menu`, a missão do ramen, a máquina de peso e 2 habilidades.
  - A Aquarela confirma modelo e textura completos. O cajado é `dbe:angel_staff`, via `loot_tables/entities/whis_gear.json`.
- **Onde aparecem:** só no `lookout.mcstructure`, colocado uma vez por mundo no Palácio de Kami, ~(150, 219, 150), guardado por `lookoutLoaded` e pela lista `structures.loaded`. Não há spawn rule nem script.
- **Planeta do Bills (`dbe:bills_planet`):**
  - `bills_planet.js` → `createSpaceArena`, peças fixas em X=-69, Y=60, Z=-53; chegada em (0.5, 130, 1.5).
  - Não há NPC.
  - `/scriptevent dbe:bills_planet_rebuild` limpa a lista de peças e coloca tudo de novo. Isso **duplica as entidades salvas** em `bills_3` (peixes, almofadas, armor stands): é um problema que já existe hoje.
- **O que depende deles:**
  - `saga_beerus_1`: falar com Whis (2 diálogos) → aprender `divine_ki` → luta com `beerus_enemy`.
  - `whis_ramen_delivery`: entregar 2 `dbe:ramen` ao Whis.
  - Desafio "falar com todos os NPCs", que inclui `dbe:beerus` e `dbe:whis`.
  - Os menus de habilidade dos dois, liberados após `saga_beerus_1` + `divine_ki`.
  - Tudo isso é **por tipo de entidade, não por lugar**: funciona com eles em qualquer dimensão.

### 2.2 Proposta
1. **Moradores fixos** (mecanismo A, §1.2), registrados num módulo do Marco, sem tocar no `bills_planet.js` (que é da Bússola):
   - `world_residents.js` registra `{ id: "bills_beerus", type: "dbe:beerus", dim: "dbe:bills_planet", pos: { x: -2.5, y: 130, z: -10.5 }, yaw: 180 }` e `{ id: "bills_whis", type: "dbe:whis", pos: { x: 0.5, y: 130, z: -10.5 }, yaw: 180 }`.
   - Esse é o lado livre da mesa com o bolo em `bills_3`: piso de `dark_oak_planks` em y=129, mesa em z=-13, a ~12 blocos da chegada.
   - As posições ficam numa constante `BILLS_SPOTS` para trocar quando o palácio novo existir.
2. **Um por mundo, sem duplicar nem sumir:**
   - A verdade é a tag `dbe_resident:<id>`.
   - Só age com o raio carregado, então uma entidade em chunk descarregado não conta como "sumiu".
   - Extras são removidas e o morador empurrado volta para o lugar.
   - Removido por `/kill` ou `/event … dbe:despawn`: volta na próxima visita.
   - O planeta não tem `removeMobs`, e a família `npc` também escaparia dele.
3. **Comportamento:** o atual (parados, olham para o jogador, invulneráveis). Diálogos, loja de habilidades, máquina de peso e missões funcionam sem mudança, porque são por tipo.
4. **Lookout:** ver a decisão D1.
   - **Manter** é a opção mais segura para o save: duas cópias, missões funcionando nos dois lugares.
   - **Mover:**
     - mundo novo: tirar Beerus e Whis do `lookout.mcstructure` (`.mcstructure` do Marco).
     - mundo antigo: remoção única, com flag `dbe:lookout_bw_moved`, das entidades `dbe:beerus`/`dbe:whis` sem tag dentro da região `lookout` (±64 do centro), feita só quando a área estiver carregada.
5. **Palácio do Bills:**
   - construção nova (G), entra em `bills_planet/` como peças novas.
   - Os NPCs **não** vão dentro do `.mcstructure`: o rebuild os duplicaria. Eles continuam no script.
   - Peixes, almofadas e armor stands de `bills_3` podem sair da estrutura pelo mesmo motivo.

### 2.3 Riscos de save
- **Duplicação:** coberta pela tag e pela remoção de extras. Os originais do Lookout não têm tag e não são tocados (exceto na opção "mover").
- **Downgrade:** abrir numa versão anterior deixa Bills e Whis no planeta, parados e sem script. Não quebra nada, e eles não duplicam porque a versão velha não os cria.
- **Rebuild do planeta:** com NPCs fora da estrutura, o rebuild não os afeta. A duplicação de peixes e almofadas já existe e continua até tirarmos essas entidades do `bills_3`.
- **Opção "mover" (D1):** é a única que apaga entidades num save antigo. Por isso tem flag única, raio limitado à região do Lookout, só tipos `dbe:beerus`/`dbe:whis` e só sem a tag de morador. Mesmo assim, testar em CÓPIA.
- **Missão em andamento:** a saga cria o próprio `beerus_enemy` onde o jogador está. Nada muda.
- **Chunks:** `spawnEntity` só com a área carregada (como o locutor, `acquireLoadedArea`). Sem tickingarea permanente.

### 2.4 Como testar (para o roteiro)
- Mundo novo: chegar ao planeta do Bills → Bills e Whis à mesa a ~12 blocos da chegada, olhando para o jogador.
- Sair e voltar 3 vezes, e reabrir o mundo: continua um de cada (`/testfor @e[type=dbe:beerus]` na dimensão).
- `/event entity @e[type=dbe:whis] dbe:despawn` → sair do raio e voltar: o Whis reaparece, um só.
- Empurrar com pistão ou bote → volta ao lugar em ~5 s.
- 2 jogadores chegando juntos: continua um de cada.
- `whis_ramen_delivery` e a 1ª etapa de `saga_beerus_1` completam falando com o Whis do planeta.
- Opção "mover": numa CÓPIA de mundo 1.7.15, Beerus e Whis somem do Lookout uma vez só, e nada mais do Lookout muda.
- Guarnições (§1.2):
  - matar os guardas → só voltam depois de 30 min de jogo e com o jogador perto.
  - uma morte conta na missão ativa do mesmo tipo.
- Guru: aparece na cúpula, um só, e não cai (piso de tapete).

---

## Decisões para o usuário

- **D1. Bills e Whis no Lookout:** recomendo **mover**. Na história eles moram no planeta, e é isso que o usuário espera. A alternativa é **manter** os dois lugares, mais simples e sem risco de save.
- **D2. Posição provisória:** colocar Bills e Whis já na sala de jantar atual do planeta (recomendo) ou esperar o palácio novo (G)?
- **D3. Cópias de NPCs que já existem no Lookout:** Piccolo na casa dele e Bulma na Cápsula, sim ou não? Os engenheiros na Cápsula eu recomendo de qualquer forma, porque mundos novos ficaram sem nenhum.
- **D4. Guardas contam nas missões?** Hoje o jogo conta qualquer morte do tipo certo. Recomendo deixar contar, porque ajuda a achar soldados para as missões do Freeza. A alternativa é marcar os guardas e excluí-los da contagem, o que exige mexer no index.js (Coordenador).
- **D5. Grande Patriarca:** só presença (P) ou com diálogo e alguma função, por exemplo despertar de poder? O diálogo pede chaves `.lang` (Coordenador) e texto novo.
- **D6. Frequência da guarnição:** 30 min de jogo está bom? E vale para Yamcha, Red Ribbon e Base do Freeza.
- **D7. Palácio do Bills e arena do Torneio do Poder:** os dois são construções G. Qual entra primeiro, e entra na 1.7.18?

---

## Atualização (correções visuais feitas em `agent/marcos`)
- **10 Yamcha:** `1962432`. A terra da camada 0 vira areia, ou arenito onde não há apoio. Casas já geradas recebem a troca uma vez.
- **10 Piccolo/Yamcha:** `7bb66ad`. Saia em rampa de até 4 blocos.
- **11 Cápsula:** sem mudança. A placa "CAPSULE CORP", a rua e os engenheiros do print são da `west_city.mcstructure`, aposentada na 1.7.17 (mundos novos não a colocam). As letras 3x5 estão legíveis no arquivo. Nenhuma das 137 estruturas tem leash (`LeasherID` = -1 em todas), `leash_knot`, anzol, end rod, lightning rod, beacon ou corrente. Os 39 `minecraft:cushion` da Cápsula são assentos no chão (y+1.5), sem leash. A partícula da Máquina de Gravidade é um anel plano 8x8. A linha não vem dos nossos arquivos: precisa de print de perto no jogo.
- **14 Namek:** `6aeefce`. Ar entre as camadas 40 e 69 da Casa do Guru virou vazio. As árvores ajisa têm até 38 blocos, e o ar cortava o tronco e deixava a copa solta.
