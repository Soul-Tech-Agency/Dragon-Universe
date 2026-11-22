# Pendências visuais depois da 1.7.17

Autora: Aquarela. Data: 2026-11-22. Base: `integration/1.7.17` (`5f80820`) + du2 (`e4bd987`).
Fonte: todas as imagens de `Testes/Testes 12-11/` (pacote 1.7.15) e `Testes/Testes Outubro/` (1.7.13/1.7.14).
Os 7 vídeos `.webm` de Outubro **não foram vistos** (o servidor não tem ffmpeg para extrair quadros). Peça ao usuário prints dos trechos que importam.
Nada aqui foi testado no jogo. "Corrigido na 1.7.17" significa que a correção está no pacote e entra no roteiro, não que foi confirmada.

Tamanho: **P** = até 1 h, 1 arquivo. **M** = algumas horas, vários arquivos ou um modelo. **G** = modelo, construção ou sistema novo.

## Resumo

| # | Tema | Imagem | Estado | Tam. |
|---|---|---|---|---|
| 1 | Quadradinhos na cabeça do Oozaru | `12-11/ozaaru.png`, `Outubro/testesoza.png` | **Corrigido na 1.7.17** | — |
| 2 | SSJ3 do Goku redondo e pálido | `12-11/ssj3.png` | **Corrigido na 1.7.17** | — |
| 3 | Raditz SSJ1/2/3 iguais | `Outubro/radtizssj1..3.png` | **Corrigido na 1.7.16** | — |
| 4 | Chão verde na Base do Freeza | `12-11/basefreeza.png` | **Corrigido na 1.7.17** | — |
| 5 | Recorte retangular na Casa do Guru | `12-11/namek guru.png`, `Outubro/namek1/2.png` | **Corrigido na 1.7.16** | — |
| 6 | Ícone DU por cima do título do menu | `12-11/image.png` | **Corrigido na 1.7.17**; o redesign substitui | — |
| 7 | Prévia do Oozaru nas Estatísticas (close do pelo) | `12-11/menu ozaaru.png` | **Corrigido na 1.7.17** (H4) | — |
| 8 | Oozaru vaza da prévia do **inventário** | `Outubro/image.png` | Investigado; proposta com a Engrenagem | M |
| 9 | Três convites com o mesmo ícone | `Outubro/craft*.png` | **Feito** (`28792c1`, agent/oozaru) | — |
| 10 | Base quadrada de terra sob construções | `Outubro/casa yamcha.png`, `picollo.png` | Parcial (1.7.17 mexe no terreno) | M |
| 11 | Corporação Cápsula: placa grosseira e linha até o céu | `Outubro/capsulecorp.png` | Aberto | P/M |
| 12 | Torneio do Poder: chão de retalhos | `Outubro/torneiopoder.png` | Aberto | G |
| 13 | Planeta do Bills sem palácio, Bills e Whis | `Outubro/bills2.png`, `bills.png` | Aberto (com o Marco) | G |
| 14 | Namek: copas de árvore soltas no ar | `Outubro/namek1.png` | Aberto | P |
| 15 | Olhos assimétricos no SSJ4 | `12-11/ssj4.png` | Dúvida | P |
| 16 | Vegeta e Trunks SSJ3 (DMZ) curtos | (nova, da 1.7.17) | Aguarda o usuário | M |
| 17 | Beast (Goku) com pontas de "cubinho" | `12-11/beast*.png` | Dúvida | P |
| 18 | Menus antigos fora do redesign | `Outubro/menu.png` e outros | Aberto | M |

## Detalhes

### 1. Oozaru: quadradinhos na cabeça — corrigido na 1.7.17
- **Errado:** tufo da `geometry.oozaru` (oco na 1.7.14, um bloco em dois degraus na 1.7.15), além de 32 px transparentes na frente da cabeça.
- **Correção feita:** tufo removido (`33073c4`) e face frontal preenchida (`3af485c`). Vale para Oozaru, Golden e Vegeta Oozaru inimigo.
- **Conferir:** roteiro §7.

### 2. SSJ3 do Goku — corrigido na 1.7.17
- **Errado:** textura DMZ com 2 tons de creme e mechas que abriam em leque.
- **Correção feita:** juba `hairlong` e dourado em `a02ff37`; Beast separado em `4a56fd6`. O Gohan também foi corrigido.
- **Conferir:** roteiro §7.

### 3. Raditz SSJ1/SSJ2/SSJ3 iguais — corrigido na 1.7.16
- **Errado:** as três formas tinham o mesmo cabelo amarelo.
- **Correção feita:** SSJ2 próprio e SSJ3 até o joelho em `c22a938`. O SSJ4 já estava certo (preto, com pelo vermelho).

### 4. Base do Freeza com quadrado verde — corrigido na 1.7.17
- **Errado:** o chão da construção é grama verde sobre o planeta roxo, com pedras e entulho escuro espalhados.
- **Correção feita:** o piso troca para o solo do planeta (roteiro §4).
- **Resto:** os blocos escuros soltos em volta (blackstone) são da própria estrutura. Se incomodarem: **P** (Marco, `.mcstructure`).

### 5. Casa do Guru — corrigido na 1.7.16
- **Errado:** a área em volta do pilar ficava plana e retangular (terra e água em faixas).
- **Correção feita:** H6 (`ed987d6`). O pilar que se abre para cima é o desenho original.
- **Conferir:** roteiro §4.

### 6 e 7. Menu de Estatísticas — corrigidos na 1.7.17
- **Errado:** o ícone DU cobria o título "Estatísticas" (6), e a prévia do Oozaru mostrava só o pelo (7).
- **Correção feita:** os dois foram corrigidos na 1.7.17. O redesign du2 refaz a tela inteira.

### 8. Oozaru vaza da prévia do inventário — investigado; proposta, sem commit (M)
- **Imagem:** `Outubro/image.png`. O Oozaru gigante sai da caixa preta do inventário vanilla e fica por cima das armaduras e dos slots.
- **Causa:**
  - O Oozaru montado (`geometry.oozaru` + `animation.player.oozaru_setup`) tem ~48 px de altura contra 32 do jogador (1,5x).
  - A forma aplica `minecraft:scale` 2 (`races_data.js`, `size: 2`), então a prévia mostra ~3x.
  - O renderer do inventário não reenquadra pelo tamanho, então o modelo vaza.
  - O `dbe_general` (que roda o `oozaru_setup`) só toca com `v.isLive` (`!v.is_paperdoll`).
- **Por que não dá para corrigir só pelo lado visual:**
  - O inventário vanilla, a prévia das Estatísticas e a do barbeiro usam o mesmo renderer do jogador ao vivo. Do lado da entidade, só `v.is_paperdoll`/`q.is_in_ui` distinguem a UI, e as duas condições valem nas três telas.
  - A Engrenagem já compensa o tamanho nas Estatísticas e no barbeiro pela UI (`6d2c2e8`, `3847fb2`: renderer de 22x22 quando o texto tem "zaru"). Encolher a entidade na UI encolheria essas duas prévias duas vezes.
  - O G2 da 1.7.14 (root 0,3 + `oozaru_setup` com `v.is_paperdoll || q.is_in_ui`) é essa mesma ideia e foi revertido no H4: o Oozaru deixou de aparecer nas Estatísticas.
- **Proposta (duas partes, juntas e testadas em build separado):**
  1. **Aquarela (RP entity/animations):** `animation.player.oozaru_ui_scale` com `root` em escala 0,33, tocando só com `v.is_oozaru && v.is_paperdoll`. Sem `q.is_in_ui`, para não encolher o Oozaru no mundo enquanto um menu está aberto. Montagem do `oozaru_setup` também com `v.is_oozaru && !v.isLive`, se no teste o corpo aparecer desmontado.
  2. **Engrenagem (`ui/**`):** voltar a uma prévia única de 70x70 nas Estatísticas e no barbeiro (desfazer o ramo "zaru" de 22x22). No redesign, prévia única, sem caso especial do Oozaru.
  - **Teste A/B obrigatório:** inventário, Estatísticas, barbeiro e prévia do redesign, em Oozaru e Golden, e uma vez na forma base. Se o Oozaru sumir de novo (como na 1.7.14), a causa é o `v.is_paperdoll` não valer para o renderer das telas do addon; aí fica só a parte 2 sem a 1, e o inventário vanilla fica como limitação conhecida.
- **Alternativa só de UI:** sobrescrever o paperdoll do `inventory_screen` vanilla. Não é viável sem um sinal da forma nessa tela, que hoje não existe.

### 9. Convites com o mesmo ícone — feito em `28792c1` (agent/oozaru)
- **Imagens:** `craft.png`, `craft1.png`, `craft2.png`. "Convite para o Torneio", "Convite para o Planeta de Bills" e "Convite para o Torneio do Poder" usam o mesmo cartão roxo.
- **Arquivo provável:** `RP textures/item_texture.json` + `textures/items/*invitation*`.
- **Feito:** o Torneio ficou como estava. O Planeta de Bills ganhou moldura dourada, corpo roxo e gema magenta. O Torneio do Poder ganhou moldura verde-azulada, corpo menta e gema azul.

### 10. Base quadrada de terra sob construções — parcial (M)
- **Imagens:**
  - `casa yamcha.png`: a casa fica sobre uma laje quadrada de terra grossa, cortada entre o deserto e a mesa.
  - `picollo.png`: degrau quadrado de grama, com a terra exposta na lateral.
- **Arquivo provável:** o assentamento de terreno das construções (BP, Bússola/Marco) e o `.mcstructure`.
- **Proposta:** a 1.7.17 já evita borda de bioma e trata o terreno da Cápsula e do Torneio. Para Yamcha e Piccolo: suavizar a borda (rampa de 2–3 blocos) e usar o bloco de superfície do bioma em vez de `coarse_dirt`/grama fixa.
- **Conferir:** roteiro §3 ("Casa do Piccolo e do Yamcha" e "Terreno em volta").

### 11. Corporação Cápsula — aberto (P/M)
- **Imagem:** `capsulecorp.png`.
  - A placa "CAPSULE CORP" tem letras irregulares (o "A" e o "S" falham).
  - Uma linha branca fina sai de perto da cúpula até o céu.
  - A calçada avança sobre a água.
- **Arquivo provável:** `.mcstructure` da Cápsula (Marco). A linha deve ser corda/lead de alguma entidade da estrutura ou um feixe de partícula; confirmar no jogo.
- **Proposta:** redesenhar as letras da placa (P) e procurar a origem da linha (P). A calçada sobre a água entra no assentamento de terreno (item 10).

### 12. Torneio do Poder: chão de retalhos — aberto (G)
- **Imagem:** `torneiopoder.png`. O céu é preto e só há uma torre listrada no centro. O chão é uma colcha de blocos de cores aleatórias, sem arena.
- **Arquivo provável:** dimensão e gerador do Torneio do Poder (BP).
- **Proposta:** arena circular de pedra clara com bordas e as colunas do anime, e céu com nebulosa/estrelas. Precisa de construção nova (Marco) e de uma regra de terreno vazio fora dela (Bússola).

### 13. Planeta do Bills; modelos de Bills e Whis — aberto
- **Imagens:**
  - `bills2.png`: ilha flutuante com chão turquesa e roxo, árvores azuis e uma esfera de folhas vermelhas no centro. Não há palácio.
  - `bills.png`: interior de tijolos e madeira, sem cara de palácio; possivelmente outra construção.
- **Estrutura atual:** `BP structures/dbe/bills_planet/bills_1..5.mcstructure`, colocada por `scripts/bills_planet.js` (30 linhas, sem NPC).
- **Bills e Whis hoje:** os dois existem, mas nenhum script os coloca no planeta.

| | Beerus (`dbe:beerus`, NPC; `dbe:beerus_enemy`, inimigo) | Whis (`dbe:whis`, NPC) |
|---|---|---|
| Entidade RP | `entity/npcs/beerus.entity.json`, `entity/opponents/common_enemies/beerus_enemy.entity.json` | `entity/npcs/whis.entity.json` |
| Geometria | `models/entity/opponents/beerus.geo.json` (`geometry.beerus`, 128x128, 35 cubos, com cauda de 5 partes) | `models/entity/npcs/whis.geo.json` (`geometry.whis`, 128x128, 19 cubos: auréola, cabelo alto em 3 partes, ombreiras) |
| Textura | `textures/entity/opponents/beerus.png` (128x128): pele roxa, calça azul, faixas douradas | `textures/entity/npcs/whis.png` (128x128): túnica bordô, rosto claro/azulado, cabelo branco, auréola ciano |
| UV | 210 faces: 24 vazias (internas/sobrepostas), 54 parciais | 114 faces: 19 vazias, 33 parciais |
| Render | `controller.render.default`; animações idle, blink, bob, olhar e `tail_move` | `controller.render.default`; `animation.whis.holding_angel_staff` |
| Escala BP | 1.0 | 1.1 |
| Equipamento | — | `loot_tables/entities/whis_gear.json` → `dbe:angel_staff` na mão (attachable 3D `attachables/items/angel_staff.attachable.json`) |
| Dados | `scripts/data/entities_data.js` | `scripts/data/entities_data.js` (diálogos e missões já citam os dois) |

- **Avaliação:**
  - Modelos e texturas estão completos e coerentes com o anime: Beerus roxo com cauda, Whis com túnica bordô, auréola e cabelo branco alto.
  - Não vi Bills nem Whis em nenhum print, então a renderização no jogo não foi confirmada.
  - **Cajado:** já é 3D. Existe `attachables/items/angel_staff.attachable.json` (desde a 1.7.11), com `geometry.angel_staff`, `textures/entity/angel_staff.png` e `animation.angel_staff.holding`. O `whis.entity.json` tem `enable_attachables: true` e o bone `rightItem`. A versão anterior deste relatório dizia o contrário: foi erro meu, o grep estava com a saída cortada.
- **Proposta para o Marco:**
  - Colocar `dbe:beerus` (sentado/parado) e `dbe:whis` com `/summon` no palácio quando ele existir, com `nameable` e sem despawn. As duas entidades já têm o grupo `dbe:despawn`; o script tem que evitar o evento que o dispara.
  - O palácio em si (pirâmide com cúpula, cara de gato) é construção nova: **G**.

### 14. Namek: copas soltas no ar — aberto (P)
- **Imagem:** `namek1.png`. Uma copa azul redonda flutua sem tronco à esquerda do pilar do Guru.
- **Arquivo provável:** a feature de árvore de Namek (BP `features`/`feature_rules`) ou uma árvore cortada pelo recorte antigo do H6.
- **Proposta:** ver em mundo novo da 1.7.17. Se ainda acontecer, a feature tem que exigir solo embaixo.

### 15. SSJ4: olhos assimétricos — dúvida (P)
- **Imagem:** `ssj4.png`. Um olho está todo amarelo e o outro tem branco e vermelho.
- Pode ser uma mecha de cabelo passando na frente. Perguntar ao usuário.
- Se for real, o arquivo é a textura dos olhos SSJ4 (`saiyan.render_controllers.json`, eyes_iris/sclera).
- As espirais verdes em volta da cabeça (também em `bills.png` e `ssj3.png`, em outras formas) parecem partículas de efeito de poção vanilla, não defeito.

### 16. Vegeta e Trunks SSJ3 (DMZ) curtos — aguarda o usuário (M)
- Na 1.7.17 eles ficaram dourados, mas o cabelo é curto de propósito (vai até y≈22).
- Se o usuário quiser comprido: mesma juba `hairlong` do Goku em `du_dmz/vegeta_ssj3` e `trunks_ssj3` (Aquarela).

### 17. Beast do Goku — dúvida (P)
- **Imagens:** `beast.png`, `beast-1.png`, `beast-2.png`. Cabelo cinza-prata com pontas mais claras em cubos. As cores estão coerentes.
- Perguntar ao usuário se as pontas em "cubinho" incomodam. Se sim: suavizar a textura `du_dmz/fixa/goku_ssj3__beast.png`.

### 18. Menus antigos fora do redesign — aberto (M)
- **Imagem:** `Outubro/menu.png` (moldura dourada antiga).
- O inventário de design lista as telas que continuam com o visual antigo e não entram no redesign: máquina de gravidade (visual antigo de propósito), loja (tema claro), customização/barbeiro e listas (missões, conquistas).
- **Proposta:** depois do redesign, aplicar os nineslices du2 nessas telas: JSON da Engrenagem, texturas já existentes.

## Ações sugeridas por dono
- **Aquarela:** 8 (prévia do inventário, junto com quem cuida do `player.entity`); 16 e 17 se o usuário pedir. O item 9 está feito.
- **Marco:** 10 e 11 (`.mcstructure`); 12 (arena); 13 (palácio do Bills, Bills e Whis no planeta).
- **Bússola:** 10 (assentamento de terreno), 12 (dimensão), 14 (árvores de Namek).
- **Engrenagem:** 18.
