# Otimização de código e arquitetura (pós-redesign 1.7.17)

> Autor: Arquiteto (planejamento, somente leitura). Base lida: `integration/1.7.17` @ `5f80820` (via `git show`/`git archive`, sem checkout).
> Fontes: `docs/ROADMAP.md` (Fases 3 e 6), `docs/ARCHITECTURE.md`, `docs/SYSTEMS.md`, `docs/KNOWN_ISSUES.md` (C9, C19, P3–P5, seção 4) e leitura do código.
> **Nada aqui foi medido dentro do Minecraft.** Os números vêm de contagem estática (grep e um parser simples de parênteses) e da leitura do código. Onde está escrito "por leitura", o dado precisa ser confirmado pela instrumentação da fatia O0.
> Linha de base da validação nesta revisão: `node tools/validate.mjs` → **6 erros conhecidos** (check-refs 5, check-data 1), 39 scripts com sintaxe OK.

---

## 1. Diagnóstico

### 1.1 Tamanho

| Arquivo | Linhas | Bytes | Observação |
|---|---:|---:|---|
| `scripts/index.js` | 20.568 | 864 KB | núcleo legível (Fase 3, passo 1), nomes curtos do ofuscador |
| `space_planets.js` | 2.365 | 108 KB | maior módulo de dimensão |
| `kaioshin_dimension.js` | 1.073 | 46 KB | |
| `planet_villages.js` | 1.053 | 40 KB | |
| `world_landmarks.js` | 920 | 45 KB | |
| `namek_dimension.js` | 814 | 31 KB | |
| `future_terrain.js` | 605 | 36 KB | |
| outros 13 arquivos de mundo/viagem | 2.700 | — | `travel_safety.js` e `terrain_repair.js` já são módulos compartilhados |
| **Total `scripts/*.js` (sem `data/`)** | **30.372** | **1,30 MB** | |

**Achado principal (novo, não está nos docs):** o `index.js` carrega **duas cópias do `@minecraft/vanilla-data`** (enums de biomas, itens, entidades, encantamentos…), que vieram do bundler:

| Cópia | Linhas | Ids `minecraft:` distintos |
|---|---|---:|
| A | ~519–3818 | 2.143 |
| B | ~4444–7641 | 2.141 (só 2 ids diferentes entre as cópias: versões diferentes do pacote) |

São **~6.500 linhas (≈32% do núcleo)** de dados puros, sem lógica de jogo. Tirá-las do `index.js` é a fatia de maior ganho e menor risco.

**Fronteiras de módulo preservadas:** o bundle manteve **223 linhas `import`** no meio do arquivo. Cada bloco de `import { … } from "@minecraft/server"` / `"./data/…"` marca o começo de um módulo-fonte original (esbuild emite os módulos em ordem de dependência). Essas "costuras" são o guia natural para a extração: cortar nelas não separa código que nasceu junto.

Mapa aproximado por domínio (contagem de palavras-chave por bloco de 1.000 linhas; **confirmar com a ferramenta da fatia O0**):

| Linhas (aprox.) | Conteúdo dominante | Destino proposto |
|---|---|---|
| 57–518, 3819–4443 | utilitários (clamp, vetores, tempo, itens), **banco de dados `bF`** (4042–4190) | `core/util.js`, `core/db.js` |
| 519–3818, 4444–7641 | vanilla-data ×2 | `vendor/vanilla_data.js` |
| 7663–8000 | config, cores de ki, skills base, maestrias | `core/` / `skills/` |
| 8000–8330 | torneio (estado em memória, 3 intervalos de 1 tick) | `world/tournament.js` |
| 8330–9280 | registro de entidades, IA de combate, stats (velocidade, voo de NPC) | `core/entities.js`, `combat/ai.js` |
| 9280–9880 | regiões, claims, grupos, fusão | `world/regions.js`, `races/fusion.js` |
| 9880–11530 | skills, combo/guarda, ki, stamina, **transformações** (10704), wrapper de entidade (11025–11530) | `skills/`, `combat/`, `races/transformations.js`, `core/entity_wrapper.js` |
| 11530–13160 | formulários base, conquistas, **missões** (12035–13160) | `ui/forms.js`, `quests/` |
| 13160–14300 | ataques de ki (projétil, colisão), recompensas, nível, **concentração** (13575), permissões de entrada (`hM`), classe do jogador `hN` (13726) | `skills/ki_attack.js`, `training/`, `core/player.js` |
| 14640–15600 | estruturas, Esferas do Dragão, desejos, veículos (`capsule_991` 15146) | `world/dragon_balls.js`, `world/vehicles.js` |
| 15878–16300 | **hub de eventos `k6`** (inscrições, `onTickEvent`) | `core/events.js` |
| 16294–17200 | menus (`setTitle("ui.dbe.*")`): estatísticas, raça, treino, customização | `ui/menus/*.js` |
| 17183–18200 | blocos com componentes, comandos `/dbe:*` (18195) | `world/blocks.js`, `core/commands.js` |
| 18198–19500 | diálogos, NPCs, mestres, registro de missões/scriptevents | `quests/`, `npc/` |
| 19497–20140 | regiões de dimensão, estruturas do núcleo, Lookout/Futuro | `world/` |
| 20141–20270 | loja, **voo `rP`** (20154) | `ui/shop.js`, `flight/flight.js` |
| 20459–20568 | torneios (dados), clear lag, mensagens periódicas | `world/` |

### 1.2 Agendadores e intervalos

Contagem estática por arquivo (`runInterval` / `runTimeout` / `system.run` / `runJob` / inscrições `after` / `before`):

| Arquivo | runInterval | runTimeout | run | runJob | after | before | getEntities | getAllPlayers | getBlock |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `index.js` | 34 | 24 | (via alias) | 4 | 21 | 12 | 10 | 13 | 8 |
| dimensões/mundo (19 arquivos) | 14 | 17 | 7 | 23 | 34 | 4 | 5 | 14 | 64 |

**Intervalos globais permanentes (rodam sempre, mesmo sem ninguém na dimensão):**

| Onde | Período (ticks) | Faz |
|---|---:|---|
| `index.js:16047` hub `onTickEvent` | 1 | percorre **todas** as entidades gerenciadas; subtarefas a cada 20/100/600; colisão de ki O(K²) |
| `index.js:18415` | 30 | geradores de chunk do núcleo |
| `index.js:4190`, `8401`, `9874` | 1200 | limpezas (DB, regiões) |
| `index.js:20523` | 3600 | mensagens do servidor |
| `space_planets.js:2320` | 4 | scanner do Espaço/planetas |
| `kaioshin_dimension.js:1010` | 4 | scanner Kaioshin |
| `hell_dimension.js:558` | 4 | scanner Inferno |
| `namek_dimension.js:745` | 4 | scanner Namek |
| `other_world_kai.js:215` | 5 | scanner Kai no Outro Mundo |
| `space_arena.js:265` | 10 | arenas (Bills/Torneio do Poder) |
| `universe_6_dimension.js:492` | 10 | scanner U6 |
| `future_terrain.js:585` | 20 | Futuro de Trunks |
| `world_structures.js:339`, `world_landmarks.js:906` | 40 | estruturas/marcos do Mundo Superior |
| `namek_dimension.js:814` | 100 | moradores de Namek |
| `planet_villages.js:1025` / `1045` | 100 / 200 | ofensas / limpeza de golems |

→ **19 intervalos globais**, **13 só nos módulos de mundo**, e **cada scanner chama `world.getAllPlayers()` sozinho** (6 scanners a cada 4–5 ticks ≈ 1,4 chamadas/tick só para listar jogadores, antes de qualquer trabalho).

**Intervalos por entidade (por leitura):**

| Onde | Período | Para quem |
|---|---:|---|
| `index.js:9946` (skills/maestrias, `init`) | **1** | **toda** entidade `dbe:*` gerenciada (inclui orbs, props, `player_fly`; ver C9) |
| `index.js:8825` (`handleSpeed`, corrida/stamina) | 1 | cada jogador |
| `index.js:10525` (`handleKi`) | 5 | cada jogador |
| `index.js:8465` (IA de combate) | 20 | NPC/inimigo com `advancedCombat` |
| `index.js:8747` (velocidade de voo de NPC) | 20 | toda entidade não-jogador gerenciada |
| `index.js:13379` (fila do HUD) | 5 | jogador, enquanto houver fila |
| `index.js:10207` (combo), `10599` (stamina), `13624` (concentração), `14167`, `14376`, `15035`, `15065`, `15158` (veículos) | 1–2 | transitórios |
| `index.js:15146–15160` `capsule_991` | 1 | **2 por instância, nunca limpos** (C19) |

Estimativa: com N jogadores e E entidades gerenciadas, há ≈ `3N + 2E + 19` callbacks de intervalo vivos, **cada um com seu próprio `try/Promise`** (o wrapper `runInterval` do núcleo, `index.js:11426`, cria uma `Promise` por execução). Com 2 jogadores e uma vila de Vegeta carregada (35–45 aldeões, P5), isso passa de **100 callbacks/tick** só de agendamento.

### 1.3 Consultas caras

| Consulta | Onde | Frequência | Problema |
|---|---|---|---|
| `world.getAllPlayers()` | 6 scanners + núcleo | ~1,4/tick | repetido; deveria vir de uma lista única por tick |
| `dimension.getEntities({location, maxDistance:16})` | `k7` (`index.js:16285`), aviso de NPC de missão | a cada 100 ticks por jogador | aceitável; juntar com o scanner único |
| `getEntities()` em **todas** as dimensões | `despawnEntities` de missão (`index.js:12726`) | ao falhar/cancelar missão | varre o mundo inteiro; usar a lista `spawnedEntities` + tag |
| `getBlock` | 64 chamadas nos módulos de mundo (`space_planets` 15, `terrain_repair` 13) | durante geração | P3: em chunk descarregado lança erro; já há `acquireLoadedArea` em `travel_safety.js` |
| `trySetProperty` | `index.js:11447` | várias por tick por jogador | **agenda um `system.run` por chamada** e grava mesmo se o valor não mudou (propriedades `client_sync` vão para a rede) |
| colisão de ataques de ki | `hZ.testCollision` no hub | 1 tick, O(K²) | com muitos ataques simultâneos cresce ao quadrado |

### 1.4 Entidades por tick

- **C9:** qualquer entidade cujo id começa com `dbe:` e não é item (`index.js:8302`) ganha wrapper completo e o intervalo de 1 tick de skills (`9946`) — inclusive `dbe:training_orb`, `dbe:player_fly`, props, indicadores de dano, veículos.
- **P5:** vilas com 35–45 aldeões a cada ~160 blocos em Vegeta/Freeza (`planet_villages.js`), todos com IA de combate a cada 20 ticks.
- **Concentração:** com pontuação alta, `updateOrbs` roda a cada tick e **cria e remove 5 entidades por ciclo** (`index.js:13627`, `tickSpeed` mínimo 1). Ver `TREINOS.md`.

### 1.5 Voo (Fase 6)

Por leitura de `rP.onTick` (`index.js:20195–20215`), que roda a cada tick para cada jogador com a skill `fly`:

1. `setFlyModeProperty(this.flyMode)` é chamado **todo tick**, mesmo sem mudança → `trySetProperty("dbe:fly_mode")` (um `system.run` + `setProperty` sincronizado com o cliente) **e** `setFlySpeed` (reescreve `FlyingSpeed` e `UnderwaterMovement` da montaria) todo tick. Reescrever o componente de velocidade e a propriedade a cada tick é **a suspeita principal do tremor** e um custo de rede fixo.
2. `flyMode` depende de `player.isJumping` (segurar pulo = rápido). Alternar a velocidade da montaria a cada mudança de `isJumping` gera degraus visíveis.
3. "Peso": a gravidade `g` divide voo e velocidade por `(g+1)` em `stats` (ver `getGravity`, `index.js:11386`), e `flying_speed` é lido toda vez. Não há suavização.
4. A montaria `dbe:player_fly` também é entidade `dbe:*` → recebe o intervalo de skills de 1 tick (C9).

### 1.6 Duplicação nas dimensões (atualizada)

A tabela de `KNOWN_ISSUES §4` está **desatualizada**: `travel_safety.js` (viagem, origem, áreas carregadas) e `terrain_repair.js` (preenchimento de ar, jobs de terreno) já centralizam parte do código. Ainda duplicado nesta revisão:

| Função | Arquivos |
|---|---|
| `hash2` | namek, kaioshin, hell_terrain, universe_6, space_planets (5) |
| `mulberry32` | kaioshin, namek, space_planets, hell_terrain (4) |
| `valueNoise`, `fbm` | hell_terrain, kaioshin, namek (3) |
| `runJobAsync` | other_world_kai, hell, namek, world_landmarks, kaioshin, universe_6 (6) |
| `rememberOrigin` | space_arena, kaioshin, namek, hell, universe_6 (5) |
| `sendHome` | hell, namek, space_arena, kaioshin, space_planets, universe_6 (6) |
| `chunkState`, `prepareArea` | kaioshin, hell, space_planets, namek (4) |
| loop de scanner (`runInterval` + `getAllPlayers` + `try/catch`) | 10 arquivos |

---

## 2. Regras de compatibilidade de save (valem para todas as fatias)

1. **Namespace `dbe:`**: nenhum id de entidade, item, bloco, bioma, dimensão, evento, propriedade ou tag muda.
2. **Dynamic properties (chaves exatas, não renomear nem mudar formato sem migração):**
   - Entidade/jogador: `dbe` (JSON único; chaves internas como `level`, `concentration_training`, skills, cooldowns, maestrias, `completedQuests`, `owner_id`…), `server`, `<id>__corrupt` (cópia de JSON inválido), `dbe:spawned_by`, `dbe:is_friendly_damage`, `ki_attack_id`, `structure_id`, `dimension_id`, `dbe:quest_reward`.
   - Mundo: `dragon_evolution`, `regions`, `groups`, `structures`, `angel_staff_dimension`, `angel_staff_dimension_owners`, `generated:<chunk>`, `dbe:world_structures`, `lookoutLoaded`, `futureTrunksCityLoaded`, chaves de origem de viagem e de vilas dos módulos de dimensão.
   - **Chave nova** só dentro do JSON `dbe` (aditiva, com `v: 1`) ou com prefixo `dbe:` próprio; ler sempre com valor padrão.
3. **Listas posicionais (nunca reordenar, só acrescentar no fim):** transformações por raça e globais (índice salvo em `dbe:transformation` 0–31), ordem de `main_quests_data` e índice das tarefas de missão (P8), `propertyIndex` de skills (`dbe:charging_attack` ≤ 15), índices de customização (`dbe:customization_*` 0–16), índices de botões dos formulários (contrato do redesign).
4. **Propriedades de entidade do jogador: 32 de 32 usadas** em `player.json`. O Bedrock limita a quantidade de propriedades por entidade (32, **conferir na documentação do 26.52**). Nenhuma fatia pode exigir propriedade nova no jogador; valores novos em `enum` existente são aceitos se acrescentados no fim (o valor salvo é a string).
5. **Determinismo do terreno:** chunks já gerados ficam no save; chunks novos ao lado precisam sair **bit a bit iguais**, senão aparecem "degraus" na emenda. Qualquer extração de ruído/gerador exige prova de igualdade numérica (fatia O5).
6. **Ordem de inicialização:** os imports de dimensão no topo do `index.js` rodam antes do núcleo; a ordem das inscrições em `world.afterEvents`/`beforeEvents` e dos ouvintes do barramento `bM` (ex.: 4 ouvintes de `entity_died`) deve ser preservada ao mover código.
7. **Cooldowns:** nomes de cooldown (`concentration_training`, `shadow_dummy`, `senzu_bean_daily`, `tail_regeneration`…) são chaves salvas. Cooldown novo usa `"absolute_time"` (não `system.currentTick`, ver C2).
8. **Tags e scriptevents** (`dbe:join_other_world`, `dbe:kai`, `dbe:space`…) e comandos `/dbe:*` não mudam de nome.

---

## 3. Como provar que nada mudou

| Tipo de fatia | Prova automática | Prova no jogo |
|---|---|---|
| **Mover código** (sem renomear, sem mudar lógica) | `node tools/compare-scripts.mjs <rev-anterior>` → `IDÊNTICO`. Se o mover alterar a ordem de avaliação dos módulos, usar o modo `--unordered` (fatia O0) e anexar o diff esperado | checklist curto (abaixo) |
| **Renomear símbolos** dentro de um arquivo | `compare-scripts` → `IDÊNTICO` (renomear não muda chamadas) | não obrigatório se o compare for idêntico; recomendado a cada 3 fatias |
| **Mudar agendamento/custo** (comportamento igual, chamadas diferentes) | `compare-scripts` vai dar `DIFERENTE` **por construção**; usar `--ignore=system.runInterval,system.runTimeout --unordered` + `tools/measure-scripts.mjs` antes/depois | obrigatório, com o roteiro da fatia e a sonda `dbe:perf` |
| **Ruído/terreno** | `tools/terrain-snapshot.mjs` (novo): calcula `heightAt`/blocos de uma grade fixa para 3 sementes antes/depois e compara hashes | entrar num chunk novo ao lado de um antigo e olhar a emenda |
| Todas | `node tools/validate.mjs` = **6 erros conhecidos** (nem mais, nem menos); `node tools/check-syntax.mjs` OK | — |

**Checklist curto no jogo (após cada fatia de movimento):** criar personagem; voar e pousar; carregar e disparar Kamehameha; transformar/destransformar; abrir Estatísticas, Treino e Missões; matar um inimigo de missão; sair e entrar no mundo (zeni/nível/cooldown preservados); viajar Terra → Namek → Terra. O checklist completo do `ROADMAP` roda a cada 3–4 fatias e antes de cada pacote.

---

## 4. Plano em fatias

Legenda de risco: 🟢 baixo · 🟡 médio · 🔴 alto. "Agentes" = quantos podem trabalhar ao mesmo tempo sem editar o mesmo arquivo.

### O0 — Medição e ferramentas (pré-requisito) 🟢

| | |
|---|---|
| Arquivos | `tools/measure-scripts.mjs` (novo), `tools/compare-scripts.mjs` (flags `--unordered`, `--ignore=`), `tools/core-split-report.mjs` (novo), ~~`tools/terrain-snapshot.mjs` (novo)~~ **adiado para o O5** (Sentinela 2, P3-1 do O0), `scripts/core/perf.js` (novo), 1 linha de import no `index.js` |
| O quê | (1) **measure**: roda o stub e conta `runInterval`/`runTimeout`/`subscribe`/`getAllPlayers`/`getEntities` registrados na carga e nos callbacks. (2) **core-split-report**: para cada segmento entre costuras de `import`, lista nomes declarados, referências livres, **atribuições a variáveis de outro segmento** (proibidas entre módulos ES) e **referências adiantadas em tempo de avaliação** (ex.: `class X extends Y` antes de `Y`). (3) **perf** (desligado por padrão, `CONFIG.DEBUG_PERF`): `/scriptevent dbe:perf start|stop|report` mostra, por tarefa, ms médio/p95 por tick (via `Date.now()`), nº de entidades gerenciadas, nº de `runIds` vivos, `trySetProperty`/s e `getEntities`/s |
| Prova | `compare-scripts` IDÊNTICO com perf desligado; `validate` = 6 |
| No jogo | ligar a sonda = `CONFIG.DEBUG_PERF = true` (config.js) **e reabrir o mundo** (a sonda envolve os agendadores na carga dos scripts); depois `/scriptevent dbe:perf start`, esperar 60 s, `report`; conferir que desligado não imprime nada |
| Agentes | **2** (A: tools de análise; B: `perf.js`) |
| Estimativa | 1 dia |

### O1 — Tirar o vanilla-data do núcleo 🟢

| | |
|---|---|
| Arquivos | `index.js` (−~6.500 linhas), `scripts/vendor/vanilla_data_a.js` e `vanilla_data_b.js` (novos, cópia literal) |
| O quê | **Passo 1:** mover as duas cópias como estão, exportando os mesmos nomes (`aT`, `bZ`…), e importar no `index.js`. **Passo 2 (commit separado):** se o `core-split-report` mostrar que nenhum enum é iterado (`Object.values/keys/entries`), unificar numa cópia só |
| Prova | `compare-scripts` IDÊNTICO (vanilla-data não chama o jogo); `validate` = 6 |
| No jogo | checklist curto (os enums são usados por itens, encantamentos e biomas) |
| Agentes | 1 (edita `index.js`) |
| Estimativa | 0,5 dia |

### O2 — Ganhos rápidos de custo (mudanças pequenas e localizadas) 🟡

Cada item é um commit separado, com teste no jogo próprio. Todos editam `index.js` em regiões distintas, mas **um agente por vez** no núcleo (ou um agente fazendo os quatro em sequência).

| Item | Onde | Mudança | Teste no jogo |
|---|---|---|---|
| O2a voo | `rP.onTick` / `setFlyModeProperty` (~20195) | chamar só quando `flyMode` mudar; guardar última velocidade aplicada | voar 60 s parado/rápido; comparar tremor e `trySetProperty/s` na sonda |
| O2b `trySetProperty` | `index.js:11447` | cache do último valor por propriedade; não agendar se igual | transformar, carregar ataque, aura, voo, morte (Outro Mundo) |
| O2c C19 | `capsule_991` (~15146) | guardar ids dos 2 intervalos e limpar ao descer/remover; tirar action bar de depuração | montar/desmontar 5×, sonda: `runIds` volta ao valor inicial |
| O2d C9 | filtro em `index.js:8302` | wrapper completo só para entidades com entrada em `entities_data` (+ jogador); orbs, props, `player_fly`, indicadores ficam fora | sombra de treino, concentração, veículos, NPCs de diálogo, voo |
| O2e colisão de ki | `hZ.testCollision` no hub | grade espacial simples (célula 8 blocos) quando K > 8 | 2 jogadores trocando Kamehameha; Genki Dama |

| | |
|---|---|
| Prova | `compare-scripts --ignore=… --unordered` sem diferenças fora da área tocada; `measure` antes/depois |
| Agentes | 1 no núcleo (sequencial); pode correr **em paralelo com O5** (arquivos de dimensão) |
| Estimativa | 2 dias |

### O3 — Agendador único 🟡

| | |
|---|---|
| Arquivos | `scripts/shared/scheduler.js` (novo); um arquivo de dimensão por commit (`space_planets`, `kaioshin`, `hell`, `namek`, `other_world_kai`, `space_arena`, `universe_6`, `future_terrain`, `world_structures`, `world_landmarks`, `planet_villages`) |
| API | `every(period, name, fn, { phase })` — um único `system.runInterval(…, 1)` distribui as tarefas por `tick % period`, com `phase` para espalhar carga (ex.: scanners de 4 ticks em fases 0,1,2,3 em vez de todos no mesmo tick); `players()` devolve a lista de jogadores **do tick** (uma chamada a `getAllPlayers` por tick, compartilhada); `try/catch` por tarefa com log limitado (1 aviso por tarefa por minuto, sem engolir erro); tempo por tarefa alimenta `perf.js` |
| Ordem | 1) criar o agendador e migrar **um** scanner (Namek) → teste no jogo; 2) migrar os demais, um por commit; 3) por último, registrar as subtarefas de 20/100/600 ticks do hub `onTickEvent` (núcleo) |
| Regra | cada scanner mantém sua lógica e seu período; muda só quem chama |
| Prova | `measure`: `runInterval` globais 19 → ~7 (núcleo) + 1; `compare-scripts --ignore=system.runInterval --unordered` sem diferenças nos callbacks; sonda `dbe:perf` |
| No jogo | viajar para cada dimensão migrada, gerar chunks novos, voltar; 2 jogadores em dimensões diferentes |
| Agentes | **1** cria o agendador; depois **até 3** migrando arquivos de dimensão diferentes (dono por arquivo) |
| Estimativa | 2–3 dias |

### O4 — Extração do núcleo por domínio (Fase 3, passo 2) 🟡→🔴

**Método (vale para cada domínio):**
1. Rodar `core-split-report` no intervalo de costuras do domínio. Se houver atribuição entre segmentos (ex.: `kE = 10` de outro módulo) ou referência adiantada em tempo de avaliação, resolver **antes** com um setter/objeto de estado, num commit próprio.
2. **Mover** os segmentos inteiros (de costura a costura) para o arquivo novo, com `export`/`import` explícitos. Sem renomear.
3. Prova: `compare-scripts` (IDÊNTICO, ou `--unordered` com justificativa) + `validate` = 6 + checklist curto.
4. Em commit separado, **renomear** símbolos dentro do arquivo novo (paralelizável).
5. Mover ≠ renomear ≠ mudar comportamento: nunca no mesmo commit.

| Ordem | Domínio | Arquivos novos | Risco | Teste no jogo dirigido |
|---|---|---|---|---|
| O4.1 | `core/` | `util.js`, `db.js`, `entities.js`, `entity_wrapper.js`, `player.js`, `events.js`, `commands.js` | 🔴 (tudo depende) | checklist completo; sair/entrar com 2 jogadores |
| O4.2 | `combat/` | `damage.js`, `guard_combo.js`, `ai.js` | 🟡 | melee, guarda, esquiva, combo, IA de chefe |
| O4.3 | `races/` | `races.js`, `transformations.js`, `fusion.js` | 🟡 | transformar cada raça, Oozaru, fusão |
| O4.4 | `skills/` | `skills.js`, `ki.js`, `ki_attack.js`, `stamina.js` | 🟡 | cada ataque de ki, carga de ki, Kaioken |
| O4.5 | `flight/` | `flight.js` | 🟢 | voo completo (já otimizado em O2a) |
| O4.6 | `training/` | `concentration.js`, `shadow.js`, `weights.js` | 🟢 | sombra, concentração, pesos — **pré-requisito dos treinos novos** |
| O4.7 | `quests/` | `quests.js`, `tasks.js`, `rewards.js`, `achievements.js`, `dialogues.js` | 🟡 | completar missão, diálogo, conquista |
| O4.8 | `ui/` | `forms.js`, `menus/*.js`, `hud.js`, `shop.js` | 🟡 | todas as abas do redesign, loja, HUD |
| O4.9 | `world/` | `regions.js`, `dragon_balls.js`, `wishes.js`, `vehicles.js`, `tournament.js`, `structures.js`, `clear_lag.js` | 🟡 | Esferas + desejo, torneio, claims, cápsula |

| | |
|---|---|
| Agentes | **mover é sequencial** (todos editam `index.js`): 1 agente por vez, com a ferramenta isso leva minutos por domínio. **Renomear** em arquivos já extraídos: **até 3–4 agentes em paralelo**, um por domínio |
| Estimativa | O4.1: 2 dias; demais: 0,5–1 dia de mover + 1 dia de renomear cada; total ~10–12 dias-agente, ~5 dias corridos com 3 em paralelo |

> O4.6 (`training/`) pode ser antecipado logo após O4.1 para destravar `TREINOS.md` sem esperar o resto.

### O5 — `scripts/shared/` das dimensões 🟡

| | |
|---|---|
| Arquivos | `scripts/shared/noise.js` (`hash2`, `mulberry32`, `valueNoise`, `fbm`), `shared/jobs.js` (`runJobAsync`), `shared/origin.js` (`rememberOrigin`/`sendHome` em cima de `travel_safety.js`), `shared/chunk_state.js` (`chunkState`, `prepareArea`); depois cada arquivo de dimensão passa a importar |
| Atenção | as cópias **podem ter pequenas diferenças** (constantes, sementes, ordem de operações). Comparar cada cópia com a versão compartilhada; se divergir, manter variante nomeada (`hash2Namek`) em vez de "corrigir" — terreno precisa sair igual (regra 5) |
| Prova | `terrain-snapshot` idêntico para namek, kaioshin, hell, universe_6, space_planets (3 sementes); `compare-scripts --unordered` |
| No jogo | em mundo antigo, andar até chunks não gerados de cada dimensão e olhar as emendas; viagem ida/volta (origem) |
| Agentes | **1** cria `shared/*`; depois **até 3** migrando arquivos diferentes (ex.: A: namek+hell; B: kaioshin+universe_6; C: space_planets+space_arena). Pode correr **em paralelo com O2/O4** (não toca `index.js`) — mas **não junto com O3 no mesmo arquivo**: combinar dono por arquivo |
| Estimativa | 2–3 dias |

### O6 — Custo por entidade (Fase 6) 🔴

| | |
|---|---|
| Arquivos | `core/entity_wrapper.js`, `skills/skills.js`, `combat/ai.js` (já extraídos) |
| O quê | trocar os intervalos por entidade (`9946` de 1 tick, `8747`, `8465`) por **um laço** no agendador que percorre as entidades gerenciadas; nível de detalhe por distância (entidade a > 64 blocos de qualquer jogador roda a cada 20 ticks; sem jogador na dimensão, pausa) |
| Prova | sonda: callbacks/tick e ms/tick numa vila de Vegeta antes/depois; `compare-scripts --ignore=…` |
| No jogo | vila de Vegeta com 2 jogadores; chefes de missão (IA continua reagindo); NPCs de diálogo |
| Agentes | 1 |
| Estimativa | 2–3 dias |

### O7 — Voo: peso e tremor (Fase 6) 🟡

Depois de O2a medido. Suavizar a troca normal↔rápido (interpolar `FlyingSpeed` em 3–4 ticks), aplicar a gravidade com piso (voo nunca abaixo de ~35% da base), velocidade na água (pedido C30), e decidir o controle de "parar o voo com toque duplo" (pedido C30). Arquivo: `flight/flight.js` + `entities/player_fly.json`. 1 agente, 2 dias. Teste no jogo: voo com pesos 0/1/3, Sala do Tempo, água, transformado.

### O8 — Vilas e entidades por tick (World Developer) 🟡

`planet_villages.js`: limitar aldeões ativos por vila (ex.: 12 presentes + reposição sob demanda), não gerar vila sem jogador por perto, e registrar no agendador. 1 agente (dono do arquivo de vilas), 1–2 dias. Paralelo a O4.

---

## 5. Ordem recomendada e paralelismo

```
O0 (2 agentes) ──► O1 ──► O2 (núcleo, 1 agente) ──► O4.1 ──► O4.6 ──► [TREINOS] 
                         └─► O3 agendador ──► O5 shared (até 3, por arquivo) ──► O8
                                              O4.2…O4.9 mover (1) + renomear (até 3–4)
                                              O6 ──► O7
```

- Máximo seguro de agentes simultâneos: **4** — 1 no `index.js` (mover/O2), 2–3 em arquivos de dimensão ou em domínios já extraídos (renomear), 0–1 em `tools/`.
- **Congelamento:** durante O1 e cada passo "mover" de O4, nenhuma outra branch edita `index.js`. Avisar antes e integrar logo depois (o diff é grande, mas mecânico).
- Integração: uma fatia = um merge em `integration/*`, com o resultado do `compare-scripts`, do `validate` e da sonda colados na mensagem.

---

## 6. Medidas antes/depois

| Medida | Como medir | Antes (estático, nesta revisão) | Meta |
|---|---|---:|---:|
| Linhas do `index.js` | `wc -l` | 20.568 | < 6.000 após O1+O4 (resto vira módulos) |
| Maior arquivo de script | `wc -l` | 20.568 | < 2.500 |
| `runInterval` globais permanentes | `measure-scripts` | 19 | ≤ 8 (O3) |
| Chamadas `getAllPlayers` por tick | sonda `dbe:perf` | ~1,4 + núcleo | 1 |
| Intervalos de 1 tick por entidade gerenciada | sonda (`runIds` vivos ÷ entidades) | ≥ 1 (todas `dbe:*`) | 0 (O6: laço único) |
| Entidades gerenciadas numa vila de Vegeta | sonda | medir | −50% (O2d + O8) |
| `trySetProperty`/s por jogador voando | sonda | ≥ 20 (por leitura) | ≤ 2 (O2a/O2b) |
| ms de script por tick, p95 (1 jogador parado no spawn / voando / vila de Vegeta / 2 jogadores em dimensões diferentes) | sonda, 60 s por cenário, Bedrock 26.52, mesmo mundo de teste | medir em O0 | −30% |
| Entidades criadas por segundo no treino de concentração (pontuação ≥ 95) | sonda | até 100/s (por leitura) | 0 (orbs reaproveitados, ver `TREINOS.md`) |
| Duplicação nas dimensões (funções copiadas) | grep | 8 funções em 3–6 cópias | 0 |
| Erros do `validate` | `node tools/validate.mjs` | 6 | 6 (até corrigir os conhecidos) |
| Avisos de watchdog no Content Log | sessão de 10 min | medir | 0 |

> Observação: o hub registra `beforeEvents.watchdogTerminate` (`index.js:16048`) com a mensagem "proteção mantida". Não desligar o watchdog para esconder custo: a sonda deve contar quantas vezes ele dispara, e a meta é zero.

---

## 7. Decisões para o usuário

1. **Ordem geral**
   - (a) Ganhos rápidos primeiro (O0 → O1 → O2 → O3), depois a extração do núcleo.
   - (b) Extração completa primeiro (O4), otimizações depois, já em módulos legíveis.
   - **Recomendação: (a).** O1 tira 32% do núcleo sem risco, O2 ataca o voo e o C9/C19 com mudanças pequenas e mensuráveis, e a sonda de O0 dá números para todo o resto.

2. **Duas cópias do vanilla-data**
   - (a) Mover as duas como estão e unificar depois, se a análise permitir.
   - (b) Unificar já.
   - **Recomendação: (a)**, dois commits: o primeiro é provado por `compare-scripts`; o segundo só se nenhum enum for iterado.

3. **Escopo do agendador único**
   - (a) Só os 13 scanners de dimensão e as subtarefas do hub.
   - (b) Também os intervalos por entidade (= O6).
   - **Recomendação: (a) agora, (b) depois de O4.1**, quando o wrapper de entidade estiver legível e testado.

4. **Como extrair o núcleo**
   - (a) Ferramenta (`core-split-report` + corte por costuras de `import`), um domínio por vez.
   - (b) Manual, por leitura.
   - **Recomendação: (a).** As costuras do bundler já separam os módulos originais, e a ferramenta detecta os dois casos que quebram módulos ES (atribuição entre arquivos e referência adiantada).

5. **Aceitar `compare-scripts` DIFERENTE nas fatias de agendamento** (O2, O3, O6), com prova por `--ignore/--unordered` + sonda + teste no jogo?
   - **Recomendação: sim**, desde que o diff esperado seja descrito no commit e o teste no jogo da fatia seja executado e relatado como executado.

6. **Sonda `dbe:perf` no pacote distribuído**
   - (a) Vai no pacote, desligada (`CONFIG.DEBUG_PERF = false`), ativável por admin.
   - (b) Só em builds de teste.
   - **Recomendação: (a)**: custo zero desligada e permite medir em servidores reais.

7. **Antecipar O4.6 (`training/`)** para destravar os treinos novos logo após O4.1?
   - **Recomendação: sim** (ver `TREINOS.md`, seção 5).

---

## 8. Correções a este plano depois do O0 (2026-11-22)

1. **O2d (C9):** o filtro "wrapper só para quem tem entrada em `entities_data`" **não exclui nada**. As 103 entidades `dbe:` do BP estão todas no `entities_data`, até `dbe:location`, `dbe:player_fly` e `dbe:training_orb` (achado da Bússola, `O2_DETALHE.md`). Substituído pelo O2d-1 da Bússola: o intervalo de skills só existe para entidades com skill. A lista de exclusão explícita fica para depois da sonda.
2. **O4 não é só "mover".** O `core-split-report --plan` (`add6e23`) simula a ordem de avaliação ES. No `index.js` atual (14.204 linhas), cortes ingênuos quebram, porque partes do começo usam, dentro de funções, nomes de partes do fim:
   - 1–10 / 11–20 / 21–30 → 3 referências não avaliadas;
   - 1–40 / 41–80 → 18;
   - 100–110 → 68.

   Pelo critério conservador (nenhum uso "para frente" atravessando o corte), há 22 cortes limpos, e os segmentos **3–108 (≈11.865 linhas) formam um bloco só**.
   - **Nova fatia O4.0** (antes de O4.1): trocar as ~33 referências para frente (22 segmentos) por ligação tardia. Ex.: um objeto `late` em `core/late.js` que o módulo posterior preenche ao carregar, e o código anterior lê na hora de chamar.
     - É mudança de código pequena e mecânica.
     - Prova: `compare-scripts` **na ordem** = IDÊNTICO, e `--plan` do recorte desejado = 0 problemas.
   - **Pedido de ferramenta:** `--plan` listar, para um recorte, quais referências para frente precisam virar ligação tardia (sugestão automática).
   - Estimativa: +1–2 dias antes do O4.1. O O4.6 (`training/`) também depende disso, porque a concentração está dentro do bloco 3–108.
3. **Sonda `dbe:perf`:** só pode ser ligada por `CONFIG.DEBUG_PERF = true` e reabrindo o mundo. Não há como ativar por comando de admin em tempo de execução, porque ela precisa envolver os agendadores antes da carga dos módulos.
4. **Regras do O4.0/O4.1** (revisão da ferramenta `ef6eeeb`, conferida por simulação):
   - **Funciona.** Cortando de cima para baixo em faixas contíguas, mais a lista LATE, os problemas caem a zero.
     - `1-40 / 41-80`: 19 problemas só com imports; 0 com late em 3 nomes (`i0`, `i3`, `qM`, 32 usos).
     - `1-40 / 41-80 / 81-127`: 138 problemas só com imports; 0 com late nos mesmos 3 nomes.
   - **Cada módulo novo é uma faixa contígua de segmentos.** Um módulo com faixas separadas (ex.: `21-30` + `90-95`) continua com troca de ordem de efeitos mesmo com late, e a ferramenta acusa. Consequência: o O4 produz arquivos **na ordem do bundle** (`core/01_….js`, `core/02_….js`…), nomeados pelo domínio dominante de cada faixa. O agrupamento fino por domínio (mover funções entre arquivos) é refatoração posterior, com mudança de código, fora do "mover sem mudar".
   - **O segmento 0 fica no `index.js`.** São os imports de topo: `perf.js` primeiro, dimensões, `travel_safety`. Nada de topo vai para outro arquivo.
   - **`late` com getter, não com cópia:** `Object.defineProperty(late, "i3", { get: () => i3 })` no módulo que declara, logo depois da declaração. Hoje `i0`, `i3` e `qM` nunca são reatribuídos, mas uma cópia ficaria velha se algum nome LATE futuro for reatribuído.
   - **Com top-down + late, nenhum módulo novo importa o `index.js`.** O que vem antes já foi extraído, e o que vem depois é lido por `late`. Isso evita depender de import do módulo de entrada em ciclo (comportamento a confirmar no motor do Bedrock).
   - **Risco residual:** a ferramenta não segue chamadas de método (`X.m()`) feitas na carga. Se uma delas usar um nome LATE, que é `function` içada no bundle, o `late` estaria vazio na carga. A prova que pega isso: `compare-scripts` **na ordem** IDÊNTICO (o stub executa a carga inteira) e o checklist curto no jogo.
   - **Bug da ferramenta:** um plano que move **todos** os segmentos (`index.js` sem nenhum) quebra com `TypeError` (`deps.get(original)` indefinido). Não afeta planos reais, porque o segmento 0 fica, mas corrigir.
