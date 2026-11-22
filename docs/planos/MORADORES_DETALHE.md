# Moradores fixos e guarnição: detalhe de implementação

Autor: Marco (Mundo). Data: 2026-11-22. Base: `agent/marcos` (`b7b89e2`, sobre `integration/1.7.17` `8121a6f`).
Só planejamento, sem código. Complementa `planos/MUNDO_MOBS_BILLS.md` (§1.2 e §2).
Considero aprovada a remoção única de Bills e Whis do Lookout (decisão "23a" do Coordenador = D1 "mover"). O resto continua dependendo de D2–D6.
**Revisado** com os ajustes do Arquiteto (seção "Revisão do Arquiteto" no fim). O que mudou por achado está em "Ajustes incorporados", logo antes da revisão.

> **Regra fixa:** o `id` de um morador é chave de save, porque vira a tag `dbe_resident:<id>` gravada na entidade. **Nunca renomear.** Se um dia for preciso, o nome antigo vai em `formerIds`: as entidades com a tag antiga são adotadas e ganham a tag nova (§2.3).

---

## 1. Visão geral

| Peça | Arquivo | Dono | Save |
|---|---|---|---|
| Moradores fixos (NPC, um por mundo) | `scripts/world_residents.js` (novo) | Marco | **nenhum**: a verdade é uma tag na própria entidade |
| Moradores das construções sorteadas | campo `residents` nas specs de `world_landmarks.js` | Marco | nenhum (a posição vem do spot já salvo) |
| Guarnição (inimigos com reposição, **só tropa**) | campo `garrison` nas specs de `world_landmarks.js` | Marco | `spot.garrisonAt` dentro do plano `dbe:world_landmarks` (campo opcional, gravado só quando o lote fecha) |
| Remoção única de Bills/Whis do Lookout | `world_landmarks.js` (dono do plano) | Marco | `plan.lookoutMoved = 1` dentro do plano `dbe:world_landmarks` |
| Lookout novo sem Bills/Whis | `lookout.mcstructure` regravada com `tools/mcstructure.mjs strip-entities` | Marco (com OK do Coordenador, é arquivo do pacote) | — |

Nenhuma propriedade dinâmica nova, nenhum ID `dbe:` novo e nenhum `.lang` novo. O comando de debug é só texto em inglês no chat/log, como o `dbe:landmarks`. O `index.js` não muda. Entra uma linha `scripts/world_residents.js` no `contents.json` (BP), e o `world_landmarks.js` importa o módulo, como faz com o `navigator_extras.js`.

---

## 2. `world_residents.js`

### 2.1 API
```js
// Registro (no carregamento do módulo; a ordem não importa).
addResident({
  id: "bills_beerus",              // único e NUNCA renomeado; vira a tag "dbe_resident:bills_beerus"
  formerIds: [],                   // nomes antigos deste morador, se um dia houver: adotados e retagueados
  type: "dbe:beerus",              // entidade
  dim: "dbe:bills_planet",         // id da dimensão
  at: { x: -2.5, y: 130, z: -10.5 } | (() => pos | undefined),  // função: posição que depende de um spot (undefined = ainda não existe)
  yaw: 180,                        // rotação Y ao nascer e ao voltar
  radius: 24,                      // busca de cópias em volta de `at`
  near: 48,                        // só age com jogador a esta distância
  adopt: false,                    // true: adota uma entidade do mesmo tipo SEM tag no raio, em vez de criar outra
  enabled: () => true,             // opcional (ex.: modo do Torneio)
  onPresent: (entity) => {},       // opcional (ex.: marcar spot.announcer para versões antigas)
});
export function residentsSummary(); // [{ id, type, dim, at, state, recentSpawns }] para o debug
export function tickResidents();    // um passo do ciclo (§2.2); registrado por UMA linha isolada
```
Registro do ciclo, numa linha isolada no fim do arquivo, para o agendador único (O3) trocar só ela por `every(20, "residents", tickResidents)`:
```js
system.runInterval(tickResidents, 20);
```

### 2.2 Ciclo (`tickResidents`, a cada 20 ticks, até 2 moradores por chamada em rodízio, try/catch por morador)
**Espalhado pelos ticks:**
- Cada chamada lê `dim.getPlayers()` uma vez por dimensão. No O3, essa lista vem do `players()` do agendador.
- Dimensão sem jogadores: pula todos os moradores dela sem custo.
- Das restantes, processa no máximo **2 moradores** (rodízio pela lista). Com ~8 moradores, cada um é visto a cada ~80 ticks (~4 s), e nenhum tick concentra o trabalho todo.

Para cada morador da vez:
1. `enabled()` falso, ou `at()` indefinido → pula e zera `readyStreak`.
2. Nenhum jogador da lista a `near` blocos de `at` → pula e zera `readyStreak`. **Nunca carrega área sozinho**: sem ticking area e sem `acquireLoadedArea`.
3. `areaReady(dim, at - radius, at + radius)` (do `travel_safety.js`) falso → pula, zera `readyStreak` (estado "not loaded").
4. Bloco sob `at` não é sólido (peça do planeta ou da construção ainda não colocada) → pula, zera `readyStreak` (estado "no floor"). Isso evita NPC caindo no vazio do planeta do Bills antes da peça `bills_3` existir.
5. `readyStreak++`. `copies` = entidades de `type` com a tag `dbe_resident:<id>` na dimensão inteira (só as carregadas), mais as com tag de um `formerIds`, que são retagueadas na hora.
   - **0 cópias:**
     - com `adopt`: procura `dim.getEntities({ type, location: at, maxDistance: radius, excludeTags: [tag] })` sem `dbe:spawned_by`, adota a mais próxima (`addTag`) e não cria nada.
     - senão, **só cria se `readyStreak >= 2`**: área pronta e jogador perto em 2 vezes seguidas, ≥ ~80 ticks. As entidades de um chunk podem aparecer alguns ticks depois dos blocos; esperar um ciclo evita criar uma 2ª cópia na chegada.
     - Criar = `spawnEntity(type, at)` → `addTag(tag)` → `setRotation({ x: 0, y: yaw })` → guardar `entity.id` em `createdThisSession` (memória).
   - **2 ou mais:** fica a **mais antiga**: uma que não está em `createdThisSession` (o original salvo), a mais próxima de `at` entre essas. Se todas foram criadas nesta sessão, fica a primeira criada. As outras saem com `remove()`, e o log diz quantas.
   - **1 a mais de 3 blocos de `at`:** `teleport(at, { rotation })` (empurrada por jogador, pistão ou água).
6. `onPresent(entity)` com a cópia que ficou.

Proteções:
- Nunca dispara `dbe:despawn`.
- Nunca põe `dbe:spawned_by` (a marca das missões, que `despawnEntities` apaga).
- **Freio de laço por janela de tempo:** mais de 5 criações do mesmo morador em 10 min (`system.currentTick`, timestamps em memória) → para de criar até a janela esvaziar, com aviso no log. Chegadas normais não gastam o freio, porque o ajuste do `readyStreak` evita a criação dupla.
- Depois de criar, espera 200 ticks antes de reavaliar aquele morador. O `initializeEntity` do núcleo inicializa a entidade DBE 20 ticks depois do spawn.

### 2.3 Um por mundo
- A identidade é a tag `dbe_resident:<id>`, salva com a entidade. NPCs têm `minecraft:persistent`, então a tag e a entidade sobrevivem a sair e voltar.
- A busca por tag é na dimensão inteira, não só no raio. Uma cópia carregada em qualquer lugar conta.
- **`entityLoad`:**
  - Filtra primeiro por `typeId`, num `Set` com os tipos de morador (`dbe:beerus`, `dbe:whis`, `dbe:grand_elder_guru`, `dbe:capsule_corp_engineer`, `dbe:announcer`). Só então lê `getTags()`, evitando um `getTags()` por entidade carregada (vilas, mobs, itens).
  - Com tag `dbe_resident:*` (ou de um `formerIds`), agenda o passo 5 daquele morador (com a área pronta, usando a regra da cópia mais antiga).
  - Se havia uma cópia num chunk descarregado e outra foi criada, a duplicata some assim que as duas estão carregadas, e fica o original.
- Os NPCs não andam (só `look_at_player`), e o passo 5 os devolve ao lugar. Por isso uma cópia "perdida" longe e descarregada é quase impossível. Se acontecer, o `entityLoad` corrige.
- 2 jogadores perto ao mesmo tempo: o ciclo é único e sequencial, então não há corrida. Chegarem juntos é o mesmo caso da entidade que aparece atrasada, coberto pelo `readyStreak`.
- **Ids:** a tag é a identidade. Renomear um `id` sem `formerIds` criaria uma cópia nova e deixaria a antiga órfã (o dedupe não a veria). Por isso a regra fixa do topo.

### 2.4 Chunk descarregado
- Só age com jogador perto **e** o raio inteiro carregado (`areaReady`). Com a área incompleta, não cria nada: a cópia pode estar no pedaço que falta.
- Morador numa dimensão sem jogadores: nada roda. O NPC continua salvo no chunk.
- Sem chave de save: não existe estado "criado mas não confirmado" que possa ficar errado.

### 2.5 Comando de debug
`/scriptevent dbe:residents` lista id, dimensão, posição, estado (`ok`, `missing`, `waiting` (1º ciclo pronto), `not loaded`, `no floor`, `disabled`, `stopped`) e criações nos últimos 10 min.

---

## 3. Moradores registrados

| id | tipo | dimensão | posição (`at`) | adopt | origem |
|---|---|---|---|---|---|
| `bills_beerus` | `dbe:beerus` | `dbe:bills_planet` | (-2.5, 130, -10.5), yaw 180 | não | constante `BILLS_SPOTS` em `world_residents.js` (troca quando o palácio existir) |
| `bills_whis` | `dbe:whis` | `dbe:bills_planet` | (0.5, 130, -10.5), yaw 180 | não | idem |
| `guru` | `dbe:grand_elder_guru` | `dbe:namek` | spot da `guru_house` + (45.5, 75, 45.5) | não | `residents` na spec |
| `capsule_engineer_1..3` | `dbe:capsule_corp_engineer` | overworld | spot da `capsule_corp` + (66.5 / 70.5 / 74.5, 24, 77.5) | não (a West City antiga, colada, tem engenheiros próprios) | `residents` na spec |
| `tournament_announcer` | `dbe:announcer` | overworld | spot do Torneio + (38.5, 1, 53.5) | **sim** (adota o locutor já criado pelo `spawnAnnouncer`) | `residents` na spec; `enabled: modo "relative"` |

As posições foram medidas no NBT. O passo 4 (piso sólido) cobre um erro de 1 bloco, mas convém conferir cada uma no jogo.

**Especificação nas specs de `world_landmarks.js`:**
`residents: [{ id, type, at: [dx, dy, dz], yaw, adopt? }]`. No carregamento, para cada spec com `residents`, faz `addResident({ ..., dim: dimensão da spec, at: () => spot?.placed ? { x: spot.x + dx, y: spot.y + dy, z: spot.z + dz } : undefined })`. O spot é lido do plano em memória.

**Locutor:**
- `spawnAnnouncer` e o follow-up `!spot.announcer` saem. Quem cuida passa a ser o morador `tournament_announcer`.
- `onPresent` faz `spot.announcer = true` e chama `savePlan` **só quando muda** (de indefinido para `true`), nunca a cada ciclo. Assim uma versão antiga aberta depois não cria outro.
- Em mundo antigo, o locutor já existe sem tag: `adopt: true` o adota, sem duplicar.

---

## 4. Guarnição (`garrison` na spec): só tropa

```js
garrison: { every: 36000, mobs: [{ type: "dbe:frieza_soldier", n: 5, at: [29, 3, 29], spread: 6 }] }
```
- **Só tropa.** Tipos permitidos: `dbe:frieza_soldier`, `dbe:battle_jacket` e `dbe:bear_thief` (lista fixa `GARRISON_TYPES`). Uma spec com outro tipo é recusada no carregamento, com aviso.
  - **Chefes ficam fora** (`dbe:zarbon`, `dbe:dodoria`, `dbe:general_black` e qualquer alvo de missão principal):
    - não têm `powerDefinition` e nasceriam com ~20 de vida;
    - matar um guarda fraco completaria a etapa do chefe na saga;
    - e liberaria a réplica do treino mental sem luta.
  - Só voltam a ser cogitados quando existir a marca única "não conta para missão" da decisão 13, com nível próprio e ignorados pelo registro de chefes. Isso depende do `index.js`, então fica para depois.
- **Quando:** no `scan()` do `world_landmarks.js` (40 ticks), para spot `placed` com jogador a até 48 blocos e `areaReady` da área da construção. Roda **fora** do `busy` (é rápido), com no máximo 3 spawns por scan.
- **Conta pela tag na dimensão carregada inteira:** `dim.getEntities({ tags: ["dbe_garrison:<key>"] })`, por tipo. Guardas perseguem o jogador e saem da caixa da construção, mas continuam contados; um "raio + 16" faria nascer reposição com os antigos ainda vivos.
- **Lote:**
  - Abre só se `spot.garrisonAt` é indefinido (1ª visita) ou `world.getAbsoluteTime() - spot.garrisonAt >= every`.
  - Com o lote aberto (em memória: `batchOpen[key]`), cada scan cria até 3 dos que faltam. Cada mob nasce em `at` ± `spread`, num ponto com `isSafeStanding`, com `addTag("dbe_garrison:<key>")`.
  - **`spot.garrisonAt = world.getAbsoluteTime()` e `savePlan` só quando o lote fecha**, isto é, quando a contagem chega ao total da spec. Na Base do Freeza (5 soldados) são 2 scans, e o resto do lote não espera 30 min.
  - Se o mundo fechar com o lote aberto, `garrisonAt` fica como estava e o lote reabre na próxima visita. A contagem por tag impede excesso.
- **Save:** só o número `spot.garrisonAt` dentro do spot que já existe. O plano continua v2. Versões antigas ignoram o campo.
- **Missões:** os guardas não têm `dbe:spawned_by`. Contam nas missões `defeat_enemy` ativas do mesmo tipo (D4).
- **Some longe:** `quest_mob` tem `minecraft:despawn`. A guarnição se recompõe na próxima visita depois do intervalo, sem laço.
- **Nunca** em região com `preventMobSpawning` (Torneio): validar na spec e recusar no carregamento com aviso.
- **Specs (D6), só tropa:**
  - Red Ribbon: **3 `battle_jacket`**, 2 no térreo e 1 no topo (piso y=48), no lugar do General Black.
  - Base do Freeza: **5 `frieza_soldier`**, no lugar de Zarbon/Dodoria.
  - Yamcha: 2 `bear_thief`.
  - As posições estão em `MUNDO_MOBS_BILLS.md` §1.2.
- **Nível dos guardas (decisão nova, G1):**
  - `frieza_soldier` tem `level: 14`. `battle_jacket` tem `level: 1`, e `bear_thief` não tem nível: como guardas, viram figurantes.
  - O core usa o `entities_data.js` (Content) ao criar fora de missão.
  - Opções: (a) dar um `powerDefinition` próprio a `battle_jacket` e `bear_thief` no `entities_data.js`, por exemplo nível ~12–15 como o soldado do Freeza (vale também para os que nascem naturalmente); (b) aceitar e registrar no roteiro.
  - **Recomendo (a)**, com o dono do `entities_data.js`.
- **Pedido à Bússola** (para quando o registro de chefes existir): ignorar entidades com a tag `dbe_garrison:*`, como defesa.

---

## 5. Remoção única de Bills e Whis do Lookout (23a)

**Mundo novo:**
- `lookout.mcstructure` regravado sem as duas entidades:
  - `node tools/mcstructure.mjs strip-entities lookout.mcstructure lookout_novo.mcstructure dbe:beerus dbe:whis`.
  - Conferir com `info` e com o round-trip.
  - Substituir o arquivo, que é do pacote: commit próprio com OK do Coordenador.
- `world_landmarks.js` marca `plan.lookoutMoved = 1` logo no carregamento se `world.getDynamicProperty("lookoutLoaded")` ainda não é `true`: o Lookout ainda não foi colocado, e o novo virá sem eles.

**Mundo antigo** (`lookoutLoaded === true` e `plan.lookoutMoved` indefinido):
1. Só com jogador no overworld a até 96 blocos de (141, 299, 178): Whis em (140.5, 299, 177.5) e Beerus em (142.5, 299, 178.5), medidos no NBT, com origem do Lookout em (119, 219, 119).
2. `areaReady` de (110, 280, 150)–(170, 310, 205) verdadeiro.
3. `overworld.getEntities({ type: "dbe:beerus" | "dbe:whis", location: (141, 299, 178), maxDistance: 48 })`, **excluindo** quem tem a tag `dbe_resident:*` ou `dbe:spawned_by` → `remove()`.
4. Grava `plan.lookoutMoved = 1` (mesmo com 0 encontrados: o jogador pode tê-los tirado do lugar) e loga `[Landmarks] Lookout: Beerus x N, Whis x N moved to Bills' planet`.

**Lookout interrompido e retomado** (revisão, achado 11):
- O `index.js` grava `lookoutLoaded` **antes** do `structureManager.place`, e a colocação tem retomada pela lista `structures.placing`.
- Se ela for interrompida e o pacote atualizado, a retomada usa o `.mcstructure` novo (sem os dois). O caminho de "mundo antigo" acha 0 e marca `moved`. Correto, e vira item do roteiro (§7).

- Só esses dois tipos, só nesse raio, só uma vez. Kami, Popo, Korin, Piccolo, Bulma e a Máquina do Tempo não são tocados.
- Downgrade: a versão antiga não recria os dois no Lookout, porque a estrutura já está marcada como `loaded`. Eles ficam só no planeta, sem script, parados.
- Missões: `saga_beerus_1`, `whis_ramen_delivery` e o desafio "falar com todos" são por tipo e passam a ser feitos no planeta. O convite do Bills (`dbe:bills_invitation`) é craftável, e isso vale registrar no texto de ajuda/dicas se o Coordenador quiser.

---

## 6. Ordem de implementação (commits separados)
1. `world_residents.js` + `contents.json` + debug, com Bills e Whis registrados (planeta do Bills).
2. `residents` nas specs: Guru, engenheiros e locutor (adoção; `spawnAnnouncer` sai).
3. Guarnição, só tropa (depois de D6 e da decisão nova G1 sobre o nível).
4. Lookout: `.mcstructure` regravado (com OK) + remoção única em mundos antigos.

Validação a cada commit: `check-syntax`, `validate` (base 6) e, para o Lookout, `tools/mcstructure.mjs info`/`roundtrip`.

---

## 7. Testes (roteiro)

**Moradores:**
- Mundo novo, 1ª chegada ao planeta do Bills: Bills e Whis à mesa, olhando para a chegada. `/scriptevent dbe:residents` mostra `ok`.
- Sair e voltar 3x, e reabrir o mundo: `/testfor @e[type=dbe:whis]` no planeta dá 1.
- `/event entity @e[type=dbe:whis] dbe:despawn`: some, volta em ~5 s com o jogador perto, e é um só.
- `/summon dbe:whis` + `/tag @e[type=dbe:whis,c=1] add dbe_resident:bills_whis`: em ~5 s sobra só um.
- Empurrar com pistão ou água: volta ao lugar.
- `/kill` repetido 6 vezes: depois da 5ª para de recriar e o log avisa. Reabrir o mundo volta ao normal.
- Rebuild do planeta (`/scriptevent dbe:bills_planet_rebuild`): Bills e Whis continuam um de cada.
- Chegar ao planeta do Bills 6 vezes seguidas (ir e voltar): continua um de cada e o freio **não** dispara. O log não mostra `removed duplicate`, ou mostra no máximo uma vez.
- Com Bills e Whis já presentes, sair e voltar logo: nenhuma criação no log (o original salvo é encontrado no 2º ciclo).
- Guru em mundo novo de Namek: aparece na cúpula, sobre o tapete, e não cai.
- Engenheiros na Cápsula: 3, nos lugares, e o diálogo abre.
- Torneio, mundo novo: 1 locutor. Mundo antigo com locutor: continua 1 (adotado). `spot.announcer` continua `true`.
- 2 jogadores chegando juntos ao planeta do Bills: um de cada.
- Missões: `whis_ramen_delivery` e a 1ª etapa de `saga_beerus_1` com o Whis do planeta.

**Lookout (CÓPIA de mundo 1.7.15):**
- Ao chegar ao Lookout, Beerus e Whis somem uma vez. O log mostra a linha `moved`, e o resto do Lookout fica igual.
- Voltar outro dia: nada mais muda.
- Mundo novo: o Lookout nasce sem os dois.
- Lookout interrompido e retomado: fechar o mundo durante a colocação do Lookout (1ª ida perto do spawn), atualizar o pacote e reabrir. O Lookout termina sem os dois, e o log mostra `moved` com 0.

**Guarnição:**
- 1ª visita: guardas presentes. Na Base do Freeza aparecem os 5 em 2 scans (~2 s), não 3 agora e 2 daqui a 30 min.
- Atrair os guardas para longe da construção e esperar 30 min: não nasce reposição enquanto os antigos estão vivos e carregados.
- Matar todos: não voltam antes de 30 min de jogo. Depois, com o jogador perto, voltam.
- Um guarda morto conta na missão ativa do mesmo tipo (só tropa: nenhuma etapa de chefe completa com guarda).

**Desempenho:** sem travada ao chegar. `tickResidents` (2 moradores por chamada, a cada 20 ticks) não aparece no `slow script`.

---

## 8. Riscos
- **Adoção errada:** só o locutor usa `adopt`. O raio é de 24 e quem tem `dbe:spawned_by` fica de fora.
- **Remoção no Lookout:** é a única operação que apaga entidades num save antigo. Por isso: só 2 tipos, raio de 48, uma vez, flag no plano, sem tag de morador. Testar em CÓPIA.
- **Posição medida no NBT, sem prova no jogo:** o passo 4 (piso sólido) impede NPC no ar. Uma posição ruim aparece como `no floor` no debug.
- **Contagem nas missões:** guardas contam (D4/decisão 13), e por isso a guarnição é **só tropa**. Chefes como guarda dependem da marca da decisão 13 (`index.js`, Coordenador).
- **Agendador (O3):** `world_residents.js` é do Marco. A troca da linha `system.runInterval(tickResidents, 20)` por `every(...)` deve ser combinada com ele.

---

## Ajustes incorporados (resposta à revisão do Arquiteto)
| Achado | O que mudou no plano |
|---|---|
| 1 Chefes na guarnição | §4: só tropa (`GARRISON_TYPES`); Red Ribbon 3 `battle_jacket`, Freeza 5 `frieza_soldier`; chefes só com a marca da decisão 13; pedido à Bússola para ignorar `dbe_garrison:*` |
| 2 Nível dos guardas | §4: decisão nova **G1** (powerDefinition de `battle_jacket`/`bear_thief` no `entities_data.js`, recomendo sim) |
| 3 Entidade carrega depois do chunk | §2.2: criar só com `readyStreak >= 2`; dedupe fica com a cópia mais antiga (fora de `createdThisSession`); freio de 5 em 10 min |
| 4 `entityLoad` | §2.3: `Set` de `typeId` antes de `getTags()` |
| 5 Multiplayer | §2.3: coberto pelo `readyStreak` |
| 6 Ids como chave de save | regra fixa no topo; `formerIds` na API e no passo 5 |
| 7 Guarnição fora do raio / lote | §4: contagem pela tag na dimensão carregada; `garrisonAt` só quando o lote fecha |
| 8 Custo por tick | §2.2: 2 moradores por chamada em rodízio, dimensão sem jogador pulada antes |
| 9 O3 | §2.1: `export function tickResidents()` + uma linha `system.runInterval(tickResidents, 20)`; jogadores lidos uma vez por dimensão |
| 11 Lookout interrompido | §5 e §7: caso documentado e teste no roteiro |
| 14 `savePlan` do locutor | §3: só quando `spot.announcer` muda |

---

## Revisão do Arquiteto (2026-11-22)

Leitura do plano e de `integration/1.7.17` (`entities_data.js`, `index.js` ~19700–19720, `defeat_enemy` ~12780). Nada foi testado no jogo.
**Veredito: OK para moradores fixos (§2–3) e para a remoção no Lookout (§5), com os ajustes abaixo. A guarnição (§4) precisa de mudança antes de implementar (achado 1).**

### Bloqueia a guarnição

1. **Chefes na guarnição: fracos e contando na campanha.**
   - O problema:
     - `dbe:zarbon`, `dbe:dodoria` e `dbe:general_black` **não têm `powerDefinition`** em `entities_data.js`. Criados com `spawnEntity`, nascem com atributos 1, cerca de 20 de vida, como os soldados naturais do C30.
     - Zarbon e Dodoria são **alvos de `defeat_enemy` da saga do Freeza**. Com a missão ativa, matar o guarda fraco completa a etapa do chefe (D4 = guardas contam).
     - Eles também entrariam no **registro de chefes derrotados** (TREINOS §3.1), liberando a réplica do treino mental sem lutar.
   - Proposta:
     - (a) Guarnição **só com tropa**: `frieza_soldier` (tem `level: 14`), `battle_jacket` e `bear_thief`. Nada de tipo que seja chefe de missão principal.
     - (b) Se a equipe quiser um chefe na Base do Freeza, ele precisa da marca única "não conta para missão" da decisão 13, de nível próprio e de ser ignorado pelo registro de progressão. Isso depende do `index.js` (Coordenador/Bússola), então fica para depois.
   - **Recomendo (a).** Nas specs, trocar "1 `zarbon`/`dodoria`" e "1 `general_black`" por mais um soldado ou um `battle_jacket`.
   - Pedir também à Bússola: o registro de progressão ignora entidades com a tag `dbe_garrison:*`, como defesa.
2. **Nível dos guardas.**
   - `battle_jacket` tem `level: 1` e `bear_thief` não tem nível. Como guarda, viram figurante.
   - O que o core usa ao criar fora de missão é o `entities_data.js` (Content). Dar um `powerDefinition` próprio aos tipos usados na guarnição ali, ou aceitar e registrar isso no roteiro.

### Duplicação (multiplayer e chunk descarregado)

3. **A entidade carrega depois do chunk.** No Bedrock as entidades de um chunk podem aparecer alguns ticks depois de os blocos estarem acessíveis. Na chegada ao planeta, `areaReady` pode ser verdadeiro e `getEntities({tags})` ainda vir vazio, e aí o ciclo cria uma segunda cópia. O `entityLoad` corrige depois, mas:
   - a duplicata existe por alguns segundos e pode ser a que o jogador vê ou com quem fala;
   - cada chegada assim gasta 1 do freio de 5 criações. Depois de 5 chegadas "azaradas" na sessão, o morador para de ser recriado mesmo quando falta de verdade.
   - Ajustes:
     - (a) só criar se a área estiver pronta e o jogador estiver lá há **2 ciclos seguidos** (ou ≥ 60 ticks desde a troca de dimensão);
     - (b) no dedupe, ficar com a cópia **mais antiga**: a que não foi criada nesta sessão (guardar os ids criados em memória), não a mais próxima. Assim o original salvo sobrevive;
     - (c) o freio passa a contar criações numa janela de tempo (ex.: 5 em 10 min), não na sessão inteira.
4. **`entityLoad`.** O evento dispara para toda entidade que carrega (vilas, mobs, itens). Filtrar primeiro por `typeId` num `Set` com os tipos de morador e só então ler tags. Senão é um `getTags()` por entidade carregada.
5. **Multiplayer.** Com o ciclo único e sequencial, não vejo corrida. 2 jogadores chegando juntos caem no achado 3 (o mesmo ajuste resolve).
6. **Ids de morador são chave de save.** A tag `dbe_resident:<id>` é a identidade. Renomear um `id` deixa a cópia antiga órfã (tag velha) e cria outra, e o dedupe não pega porque as tags são diferentes. Regra no topo do arquivo: nunca renomear; se precisar, campo `formerIds` que é adotado e retagueado.
7. **Guarnição fora do raio.** Guardas perseguem o jogador e saem da caixa contada (meia-diagonal + 16). Depois do intervalo eles contam como "faltando" e nasce reposição com os antigos ainda vivos. Contar pela tag na **dimensão carregada inteira** (como os moradores), que custa pouco com o filtro `tags`.
   - Também: com "no máximo 3 spawns por scan" e 5 mobs na Base do Freeza, deixar explícito que `garrisonAt` só é gravado quando o lote fecha. Senão o resto do lote espera 30 min.

### Custo por tick

8. **O custo é baixo.** ~8 moradores a cada 100 ticks, cada um com `getPlayers` com local, `areaReady` (~16 chunks com raio 24) e um `getEntities` filtrado por tipo e tag. Para não concentrar tudo num tick:
   - processar 1–2 moradores por tick em rodízio, ou espalhar com fase;
   - pular a dimensão inteira se `dim.getPlayers()` vier vazio, antes do laço por morador.
   - A guarnição dentro do `scan()` de 40 ticks do `world_landmarks.js` está ok.

### Agendador único (O3)

9. O ciclo cria **mais um `runInterval` global** (o 20º). Não bloqueia, mas para o O3 não precisar reescrever:
   - escrever o ciclo como `export function tickResidents()` e registrar com uma linha isolada (`system.runInterval(tickResidents, 100)`). O O3 troca só essa linha por `every(100, "residents", tickResidents)`;
   - usar a lista de jogadores da dimensão uma vez por ciclo. No O3 ela vem de `players()` do agendador.
   - O `world_residents.js` é do Marco. A migração do O3 nesse arquivo precisa de combinação com ele, como nos outros arquivos de dimensão (um dono por arquivo).

### Decisão 13 e registro de chefes

10. Moradores são NPCs: não interagem com a marca "não conta para missão" nem com o registro de chefes. A guarnição sim: ver achado 1. A decisão 13 continua valendo: guardas **sem** a marca, contam nas missões, mas **só tropa**.

### Save

11. **Lookout em mundo novo.**
    - O plano marca `plan.lookoutMoved = 1` se `lookoutLoaded` ainda não é `true`.
    - No `index.js`, `lookoutLoaded` é gravado **antes** do `structureManager.place` (linha ~19718), e a colocação tem retomada pela lista `structures.placing`.
    - Cenário: o flag já está gravado, a colocação foi interrompida e o pacote é atualizado. A retomada usa o `.mcstructure` novo (sem os dois), e o caminho de "mundo antigo" acha 0 e marca `moved`. Correto.
    - Só registrar no roteiro um teste de "Lookout interrompido e retomado". Opcionalmente, usar também a lista `structures.loaded` como sinal.
12. **Remoção no Lookout.** Escopo bom (2 tipos, raio 48, uma vez, exclui morador e `dbe:spawned_by`, só com a área pronta). Mantém o teste obrigatório em CÓPIA de mundo 1.7.15.
13. **Sem chaves novas** além de `spot.garrisonAt` e `plan.lookoutMoved`, dentro do plano existente. Downgrade sem quebra. Ok.
14. **Locutor adotado.** `onPresent` grava `spot.announcer = true` só quando muda: ok. Cuidado para o `savePlan` não rodar a cada ciclo.

### Resumo para o Coordenador
- Moradores e Lookout: **OK** com os ajustes 3, 4, 6, 8 e 9 (todos pequenos e no arquivo do Marco).
- Guarnição: **mudar antes**. Tirar Zarbon, Dodoria e General Black (achado 1), contar pela tag na dimensão (7) e decidir o nível dos guardas no `entities_data.js` (2, Content).
- Pedido à Bússola, para quando o registro de chefes existir: ignorar `dbe_garrison:*`.
