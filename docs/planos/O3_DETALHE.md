# O3: relógio único das dimensões (detalhe para implementar)

Autor: Arquiteto. Data: 2026-11-22. Base: `agent/viagens` em `b8a0144` (O2 fechado). Os números de linha abaixo valem para essa versão. O `world_residents.js` é de `agent/marcos` (`5a9c302`) e ainda não está nessa base.
Trabalho só de leitura: nada foi implementado.
Escopo: decisão 3 (A3). **Só os intervalos das dimensões e as tarefas gerais agora.** Os intervalos por entidade (`dbeEntity.runInterval`, skills, combate, voo) ficam para o O6.
Regras para cada commit:
- um arquivo por commit, e o `index.js` só com a Bússola;
- **cada tarefa mantém a lógica e o período**: muda só quem chama;
- prova (§5): `compare-scripts` IDÊNTICO **na ordem** com o modo de passagem do stub, `node tools/test-scheduler.mjs` OK, `validate` = 6 e `measure-scripts` antes e depois;
- a sonda `/scriptevent dbe:perf` com `CONFIG.DEBUG_PERF = true` só no teste;
- nada muda chave de save, id `dbe:`, propriedade dinâmica ou tag.

---

## 1. Os intervalos de hoje

### 1a. Dimensões e mundo (fora do `index.js`)

| # | Arquivo:linha | Período (ticks) | Onde é registrado | O que faz | `getPlayers` por execução |
|---|---|---:|---|---|---|
| D1 | `space_planets.js:2320` | 4 (`SCAN_TICKS`) | `worldLoad` | `scan()`: névoa por planeta, resgate de morto, lançamento ao espaço (y ≥ `LAUNCH_Y`), efeitos do planeta, queda no espaço, entrada nas esferas, resgate de pouso, retrofit das esferas | 1 `world.getPlayers()` |
| D2 | `kaioshin_dimension.js:1010` | 4 | `worldLoad` | `scan()`: névoa ao entrar e sair, resgate de quem cai pelo terreno não gerado, geração de chunks perto do jogador | 1 `world` |
| D3 | `other_world_kai.js:215` | 5 | `worldLoad` | `scan()`: constrói o planeta do Kaio no Outro Mundo, entrada no planeta (`enterKai`) e saída pelo topo de `dbe:kai` (y ≥ 300, `dbe:kai_return`). `dbe:kai` é a mesma dimensão do Kaioshin (D2) | 1 `world` |
| D4 | `world_structures.js:339` | 40 | `worldLoad` | `scan()`: planeja 1 local por execução; coloca a construção quando há jogador perto | 1 `dim` |
| D5 | `hell_dimension.js:558` | 4 | `worldLoad` | `scan()`: névoa, ambiente (a cada 5 execuções), fuga pelo topo, queda do Outro Mundo para o Inferno, geração de chunks | 1 `world` |
| D6 | `universe_6_dimension.js:492` | 10 | `worldLoad` | `scan()`: névoa, garante o Goku na arena, resgate de queda da arena | 1 `world` |
| D7 | `space_arena.js:265` (×2 em tempo de execução: `bills_planet.js` e `tournament_of_power.js` chamam `createSpaceArena`) | 10 (`LOAD_TICKS`) | `worldLoad` (dentro de `createSpaceArena`) | `scanPlayers()`: névoa, saída sem chave, resgate de queda; `loadNearby()`: coloca a peça da arena mais perto | 1 `world` + 1 `dim` |
| D8 | `namek_dimension.js:745` | 4 | `worldLoad` | `scan()`: névoa, resgate de queda, geração de chunks | 1 `world` |
| D9 | `namek_dimension.js:814` | 100 | **carga do módulo** | `populateVillages()`: põe os namekianos das vilas (uma vez por vila) | 1 `dim` |
| D10 | `world_landmarks.js:1009` | 40 | `worldLoad` | `scan()`: coloca ou completa um marco perto de jogador | 1 `dim` por marco |
| D11 | `future_terrain.js:585` | 20 | `worldLoad`, dentro de `initializeFutureTerrain` (chamado em `index.js:13253`) | gera o próximo chunk do Futuro perto do jogador (raio 2) | 1 `dim` |
| D12 | `planet_villages.js:1025` | 100 | `worldLoad` | esquece a ofensa ao golem depois de `GOLEM_MEMORY_TICKS` e tira a tag | 1 `getAllPlayers` por ofensa vencida |
| D13 | `planet_villages.js:1045` | 200 | **carga do módulo** | remove golems demoníacos fora do Inferno (6 dimensões, `getEntities`) | 0 (6 `getEntities`) |
| D14 | `world_residents.js:248` (`agent/marcos`) | 20 | `worldLoad` | `tickResidents`: moradores fixos (o comentário na linha já diz que o O3 troca essa linha) | ver no arquivo |

**Achado:** D1, D2, D5 e D8 têm período 4 e são registrados no mesmo `worldLoad`, por isso **rodam todos no mesmo tick**: 4 `getPlayers` e 4 varreduras a cada 4 ticks, e nada nos outros 3. D4 e D10 (40) também caem juntos. Espalhar essas tarefas em fases diferentes é o ganho principal do O3, mais do que o número de intervalos.

### 1b. Tarefas gerais no `index.js` (Bússola)

| # | `index.js:linha` | Período | Registro | O que faz |
|---|---|---:|---|---|
| G1 | `994` | 1200 | carga | `bF.cleanup()`: tira do cache as instâncias de dados cujo dono não existe mais |
| G2 | `2015` | 1200 | carga | `df.cleanup()`: o mesmo para os cooldowns |
| G3 | `3488` | 1200 | carga | `cleanup()` de cada `RegionManager` de dimensão |
| G4 | `12112` (período em `12122`) | 30 | carga (construtor de `pI`) | fila do gerador de terreno das dimensões: chunk de cada jogador por gerador |
| G5 | `14228` | 1 | `sq.init()`, se `SERVER_MODE.CLEAR_LAG` (**ligado** em `config.js:154`) | contagem regressiva do clear lag (avisos e limpeza a cada 18000 ticks) |
| G6 | `14246` | 3600 | `sy.init()`, se `SERVER_MODE.CUSTOM_CHAT` (desligado) | mensagem do servidor em rodízio |

### 1c. Fora do O3

| O quê | Onde | Por quê |
|---|---|---|
| Hub `onTickEvent`, 1 tick | `index.js:9728` | É o laço das entidades (jogadores, colisão de ki, Esferas), que já tem fases próprias (`% 20 === 0`, `% 100 === 2`, `% 600 === 3`). Fica para o O6, junto com as entidades |
| Intervalos por entidade | `index.js:2079, 2361, 2439, 3570, 3662, 3831, 4149, 4223, 5062, 5210, 7262, 7445, 7805` etc. | O6 |
| Intervalos temporários (param sozinhos) | `index.js:332` (`waitForChunkLoad`), `1650`, `1757`, `1844` (torneio), `4642`, `6269`, `7017`, `8014`, `8637`, `8705`, `9074`; cápsula `8740` e `8847` (O2c) | Não são permanentes; migrar não ganha nada |
| `runTimeout`/`runJob` (esperas, geração em partes, `terrain_repair`, `travel_safety`) | vários | São de uso único |
| Intervalo da sonda | `core/perf.js:74` | Só existe com `DEBUG_PERF` e precisa ficar fora do que mede |

**Total de intervalos permanentes globais:** hoje são 20 em execução (14 de dimensão, contando D7 duas vezes e D14; G1–G5; e o hub), mais G6 se o chat for ligado. Depois do O3: **2** (o relógio único e o hub).

---

## 2. O relógio: `scripts/core/scheduler.js` (novo)

Fica em `core/`, ao lado do `perf.js`. O `ARQUITETURA_OTIMIZACAO.md` previa `shared/scheduler.js`, mas o `shared/` é do O5 (código repetido das dimensões), e o relógio é infraestrutura do núcleo.

**API:**
```js
export function every(period, name, fn, { phase } = {})  // devolve um id
export function cancel(id)
export function players()           // world.getPlayers() lido 1 vez por tick, compartilhado
export function playersIn(dimId)    // players() filtrado por p.dimension.id
```

**Regras de funcionamento:**
- **Um único `system.runInterval(…, 1)`**, criado dentro de `world.afterEvents.worldLoad` e assinado na carga do módulo. Como o módulo é importado cedo pelos arquivos de dimensão, o relógio passa a existir no `worldLoad`, depois do hub (registrado na carga do `index.js`). Isso mantém a ordem de hoje para as tarefas registradas no `worldLoad` (§6).
- Uma tarefa roda quando `(currentTick - phase) % period === 0`. As tarefas ficam numa lista **na ordem do registro**, e no mesmo tick rodam nessa ordem, como os intervalos de hoje.
- Uma tarefa registrada antes do `worldLoad` (D9, D13) espera o relógio começar.
- **Cada tarefa tem o seu `try/catch`.** O erro vai para o `console.warn` com `name` e stack, **limitado a 1 aviso por tarefa por minuto**, com o número de erros repetidos. Nada fica escondido, e uma tarefa com erro não para as outras. Se a tarefa devolver uma Promise, o relógio não espera por ela, mas registra a rejeição do mesmo jeito.
- **Medição:** se o `perf.js` estiver ligado, cada tarefa é medida com o seu nome (§2a). Desligado, o custo é só um `if`.
- **Modo de passagem para a prova:** se `globalThis.__DU_STUB__` existir (só o `run-with-stub` define), `every()` chama `system.runInterval(fn, period)` direto, sem o relógio. Assim o `compare-scripts` vê o mesmo registro, com o mesmo período, no mesmo lugar e na mesma ordem de antes (§5). Em jogo essa flag nunca existe.
- O `players()` só é usado onde o commit do arquivo adotar (passo O3-P, §3). A migração em si não troca nenhum `getPlayers`.

**Fases propostas** (espalhar a carga e fugir das fases do hub: 0 de 20, 2 de 100, 3 de 600):

| Tarefa | Período | Fase |
|---|---:|---:|
| D1 space_planets | 4 | 0 |
| D2 kaioshin | 4 | 1 |
| D5 hell | 4 | 2 |
| D8 namek | 4 | 3 |
| D3 other_world_kai | 5 | 4 |
| D6 universe_6 | 10 | 5 |
| D7 arena do Bills / arena do TP | 10 | 6 / 8 |
| D11 future_terrain | 20 | 10 |
| D14 world_residents | 20 | 15 |
| G4 gerador de terreno | 30 | 17 |
| D4 world_structures | 40 | 7 |
| D10 world_landmarks | 40 | 27 |
| D9 namek populateVillages | 100 | 51 |
| D12 memória do golem | 100 | 77 |
| D13 golems fora do Inferno | 200 | 133 |
| G1 / G2 / G3 cleanups | 1200 | 101 / 401 / 701 |
| G5 clear lag | 1 | 0 |
| G6 mensagens | 3600 | 1801 |

A fase de hoje já é arbitrária: depende do tick em que o `worldLoad` acontece em cada sessão. Por isso fixar uma fase não muda nenhuma garantia que exista hoje. O que muda é a ordem entre tarefas que hoje caem no mesmo tick (§6).

### 2a. Mudança no `core/perf.js`

- Exportar `perfTask(name, fn)`, que mede `fn` como uma tarefa chamada `"every <name>"` e faz só a chamada direta quando a sonda está desligada.
- Hoje a sonda identifica a tarefa pelo `arquivo:linha` de quem chamou `system.runInterval`. Sem essa mudança, tudo apareceria como `scheduler.js`.
- Contar também `getPlayers`/`getAllPlayers` por segundo, junto com `setProperty` e `getEntities`.

---

## 3. Commits, na ordem

| # | Commit | Arquivos | Quem | Depende de |
|---|---|---|---|---|
| **O3-0** | Relógio + sonda + stub + teste, **e o piloto Namek** (D8, D9) | `scripts/core/scheduler.js` (novo), `scripts/core/perf.js`, `tools/lib/run-with-stub.mjs` (1 linha: `globalThis.__DU_STUB__ = true`), `tools/test-scheduler.mjs` (novo), `contents.json` (+1 linha; **o arquivo é CRLF**, editar sem converter e conferir com `git diff --stat`), `namek_dimension.js` | Bússola | item 12 (restyle) da 1.7.18 |
| — | **Teste no jogo do piloto** (roteiro §7, itens 1–3) antes de abrir para os outros | — | usuário | O3-0 |
| O3-1 | D1 | `space_planets.js` | agente A | teste do piloto |
| O3-2 | D2 | `kaioshin_dimension.js` | agente A | idem |
| O3-3 | D3 | `other_world_kai.js` | agente A | idem |
| O3-4 | D5 | `hell_dimension.js` | agente B | idem |
| O3-5 | D12, D13 | `planet_villages.js` | agente B | idem |
| O3-6 | D6 | `universe_6_dimension.js` | agente B | idem |
| O3-7 | D4 | `world_structures.js` | agente C | idem |
| O3-8 | D10 | `world_landmarks.js` | **Marco** (dono do arquivo) | idem |
| O3-9 | D11 | `future_terrain.js` | agente C | idem |
| O3-10 | D7 | `space_arena.js` | **Marco** (dono do arquivo agora: migração da arena do TP e `cfg.fogId`) | o trabalho da arena dele estar no `integration` |
| O3-11 | D14 | `world_residents.js` | **Marco** | os moradores (dele) estarem no `integration` |
| O3-12 | G1–G6 | `index.js` | Bússola | O3-0 (pode correr em paralelo com O3-1…O3-9, porque nenhum outro mexe no `index.js`) |
| O3-P (opcional) | Adotar `players()`/`playersIn()` nas varreduras, um commit por arquivo, pelo mesmo dono do commit acima | os mesmos | idem | todos os O3-1…O3-11 e a sonda medida |

**Divisão entre os 3 agentes:** nenhum arquivo aparece com dois donos. Os grupos seguem a relação entre os sistemas: A = espaço, Kaioshin e Kaio; B = Inferno, vilas e U6; C = superfície. A Bússola fica com o núcleo e o piloto. O Marco fica com os 2 arquivos que já são dele.

**Distribuição confirmada pelo coordenador (2026-11-22):** o Marco continua dono de `world_landmarks.js`, `world_residents.js`, `space_arena.js` e `bills_planet.js`, e por isso fica com O3-8, O3-10 e O3-11. Os agentes A, B e C só são recrutados depois que o piloto Namek passar no jogo (limite de 4 agentes escrevendo código ao mesmo tempo). O agente C fica com O3-7 (`world_structures.js`) e O3-9 (`future_terrain.js`). Nota original: na 1.7.18 o Marco também mexe em `world_landmarks.js` (locutor do torneio, moradores) e talvez em `world_structures.js` (guardas). Se ele ainda estiver nesses arquivos, O3-7 e O3-8 vão para ele, ou esperam o merge dele. Cada commit do O3 tem 3 a 10 linhas, então a regra é simples: **quem é dono do arquivo naquele momento faz o commit do O3 dele.**

**Como fica cada commit de arquivo** (exemplo, Namek):
```js
import { every } from "./core/scheduler.js";
// antes: world.afterEvents.worldLoad.subscribe(() => { system.runInterval(() => { try { scan(); } catch (e) {…} }, SCAN_TICKS); … });
every(SCAN_TICKS, "namek.scan", () => { try { scan(); } catch (e) { console.warn("[Namek] scan error: " + e); } }, { phase: 3 });
// antes: system.runInterval(populateVillages, 100);
every(100, "namek.villages", populateVillages, { phase: 51 });
```
- O `try/catch` de cada arquivo fica onde está: a lógica não muda. O do relógio é uma rede a mais.
- O `every()` substitui o `runInterval` **no mesmo lugar** (dentro do `worldLoad`, quando ele estava lá). Isso preserva a ordem de registro, que é o que a prova confere.

---

## 4. Riscos

| Risco | Nível | Mitigação |
|---|---|---|
| **Ordem dentro do tick: tarefas que hoje rodam juntas passam a rodar em ticks diferentes.** D1, D2, D5 e D8 hoje rodam no mesmo tick, na ordem de registro. Com as fases 0–3, cada uma roda num tick | médio-baixo | Ver §6, caso a caso. Os pares que agem sobre o mesmo jogador já têm `travelling`, cooldown ou `lastFall` |
| **Ordem em relação ao hub:** D9 e D13 hoje são registrados na carga do módulo, antes do hub, e rodam antes dele. No relógio, rodam depois | baixo | Nenhum dos dois lê ou escreve estado do hub (vilas namekianas e golems) |
| Tarefa com erro que se repete todo tick enche o log | baixo | Limite de 1 aviso por tarefa por minuto, com contagem |
| Relógio que não começa (`worldLoad` não chega ao módulo) para todas as dimensões de uma vez | baixo, alto impacto | `test-scheduler.mjs` cobre o início; o piloto no jogo vem antes de abrir para os outros; a sonda mostra `every namek.scan` com chamadas |
| `__DU_STUB__` vazar para o jogo | muito baixo | Só o `run-with-stub.mjs` define; o `test-scheduler` confere que, sem a flag, nenhum `runInterval` por tarefa é criado |
| `players()` compartilhado ficar velho dentro do tick (jogador teleportado por uma tarefa anterior) | baixo | `p.dimension` e `p.location` continuam sendo lidos ao vivo. É por isso que o `players()` fica no passo O3-P, separado e medido |
| Dois agentes no `contents.json` | — | Só o O3-0 acrescenta arquivo |

---

## 5. Prova

| Item | Como provar |
|---|---|
| **Registro igual** | `node tools/compare-scripts.mjs <commit anterior>` → **IDÊNTICO, na ordem**. Com o modo de passagem (`__DU_STUB__`), cada `every()` vira o mesmo `system.runInterval(fn, período)` no mesmo ponto da carga, e o stub executa o corpo das tarefas como antes. Um período trocado, uma tarefa esquecida ou uma ordem de registro diferente aparecem como DIFERENTE. No O3-0, o `run-with-stub.mjs` muda junto: rodar o compare dos dois lados **com o stub novo** (o `extractRevision` copia só `scripts/`, e as ferramentas vêm da pasta atual). Conferir isso no próprio O3-0 |
| **Despacho do relógio** | `node tools/test-scheduler.mjs` (novo, sem o jogo, com relógio falso): (1) a tarefa roda só em `(tick - phase) % period === 0`; (2) no mesmo tick, as tarefas rodam na ordem do registro; (3) uma tarefa com erro não para as seguintes, e o aviso sai no máximo 1 vez por minuto; (4) `cancel` funciona, inclusive de dentro da própria tarefa; (5) uma tarefa registrada antes do `worldLoad` começa no `worldLoad`; (6) `players()` chama `getPlayers` 1 vez por tick, com N tarefas; (7) sem `__DU_STUB__` existe um único `system.runInterval`; (8) uma Promise rejeitada é registrada |
| **Tamanho e contagem** | `node tools/measure-scripts.mjs` antes e depois: a coluna `interval` cai 1 por site migrado (13 sites de dimensão e 6 do núcleo) e o `scheduler.js` soma 1 |
| **Validação** | `node tools/check-syntax.mjs` OK; `node tools/validate.mjs` = 6; `node tools/core-split-report.mjs --only-problems` = 0 (no O3-12) |
| **Sonda (no jogo)** | `/scriptevent dbe:perf start`, 60 s, `report`, em 4 cenários: parado no spawn; voando em Namek; 1 jogador no Inferno e 1 em Namek; no espaço. Esperado: **intervalos vivos** com −13 a −19 conforme o commit; **duração do tick p95** igual ou menor; os ticks de pico a cada 4 deixam de existir (o máximo por tick cai); `every <nome>` aparece com chamadas = 60 s × 20 / período; `getPlayers/s` com 4 tarefas de período 4 continua em 20/s antes do O3-P e cai depois dele |

---

## 6. Ordem dentro do tick, caso a caso

Hoje, no mesmo tick (a cada 4), rodam nesta ordem: D1 space_planets → D2 kaioshin → D8 namek → D5 hell. A ordem segue a avaliação dos módulos: `kaioshin` importa `space_planets` primeiro, e `world_structures` importa `world_landmarks`, que importa `namek`. **Conferir no O3-0 a ordem real com a sonda** (`report` mostra a ordem das tarefas).
Com as fases, passam a ser D1 no tick 0, D2 no tick 1, D5 no tick 2 e D8 no tick 3.

| Interação | Hoje | Depois | Avaliação |
|---|---|---|---|
| Névoa (D1, D2, D5, D6, D7, D8) | `fog push`/`pop` com uma tag por sistema | igual, em ticks diferentes | Independentes: cada sistema usa a própria tag. A névoa entra até 3 ticks mais cedo ou mais tarde |
| Lançamento ao espaço (D1, em Kaioshin, Namek, U6 e Overworld, y ≥ `LAUNCH_Y`) e resgate de queda (D2, D8: y < `MIN_Y + 8`) | mesmo tick | ticks diferentes | Não se sobrepõem: um é no alto, o outro embaixo |
| Saída do Kaio pelo topo (D3: y ≥ `KAI_EXIT_Y` = 300, só para quem veio do Outro Mundo) e lançamento ao espaço (D1: y ≥ `LAUNCH_Y` = 500) | períodos 4 e 5 | iguais, com fases 0 e 4 | **É a mesma dimensão** (`dbe:kai` é o Kaio e o Kaioshin: `other_world_kai.js:19`, `space_planets.js:54`). As alturas são diferentes: quem sobe passa por 300 antes de 500, então o D3 age primeiro, e a ordem dentro do tick não importa. Teste §7, item 7 |
| Outro Mundo: entrada no planeta do Kaio (D3) e queda para o Inferno (D5) | ticks que coincidem às vezes | fases 4 e 2 | Condições exclusivas: perto da esfera contra y < `fallY`. Cada um tem cooldown ou `travelling`. Teste §7, item 6 |
| Gerador de terreno G4 (`pI`, 30) e geração própria de Namek, Kaioshin e Inferno (D2, D5, D8) | ticks independentes | idem | Sem mudança relevante. Os `busy` continuam valendo |
| Hub (`% 20 === 0`: região, radar, fusão) e varreduras | as varreduras depois do hub, no mesmo tick | igual (o relógio é registrado no `worldLoad`, depois do hub) | Sem mudança |
| D9 e D13 em relação ao hub | antes do hub | depois do hub | Sem dependência |

**Conclusão:** nenhuma interação depende de duas varreduras rodarem no mesmo tick. O efeito visível é de, no máximo, 3 ticks (0,15 s) de diferença em névoa e resgates.

---

## 7. Roteiro no jogo

Itens 1–3 depois do O3-0 (piloto); todos os itens depois do O3-12. Em todos: Content Log sem erro novo e sem aviso de watchdog.

1. **Namek:** viajar, ver a névoa ao entrar e ao sair, voar para longe gerando chunks novos e cair por um buraco de chunk não gerado (volta à superfície).
2. **Vilas de Namek:** num mundo novo, os namekianos aparecem nas vilas em até 5 s depois do terreno.
3. **Sonda:** `every namek.scan` com cerca de 300 chamadas em 60 s; os intervalos vivos com −2.
4. **Espaço:** subir até `LAUNCH_Y` no Overworld, em Namek e em Kaioshin (lança ao espaço); entrar na esfera de um planeta; cair abaixo de y 30 no espaço (volta à estação); efeitos de cada planeta.
5. **Kaioshin:** névoa; chunks novos; resgate de queda.
6. **Outro Mundo:** entrar no planeta do Kaio (D3) e cair da borda para o Inferno (D5), cada um 3 vezes. Nunca os dois juntos, nunca viagem dupla.
7. **Kaio/Kaioshin (`dbe:kai`):** vindo do Outro Mundo, subir até y 300 volta ao Outro Mundo e não lança ao espaço. Vindo de outro lugar (Star Navigator), subir até y 500 lança ao espaço.
8. **Inferno:** névoa, sons de ambiente, fuga pelo topo, chunks novos.
9. **Vilas dos planetas:** bater num aldeão (os golems atacam) e esperar 5 min (a tag sai); golem demoníaco fora do Inferno some em até 10 s.
10. **Universo 6:** névoa; Goku presente; cair da arena (volta ao spawn).
11. **Arenas do Bills e do TP:** chegar com a chave e ver as peças aparecerem perto; tentar entrar sem chave; cair (volta); névoa própria do TP.
12. **Superfície:** construções e marcos aparecem ao chegar perto de um local planejado (`dbe:structures`/`dbe:landmarks` report); Futuro gera os chunks em volta.
13. **Moradores fixos:** Bills, Whis e os outros nos lugares certos depois de sair e entrar no mundo.
14. **Núcleo (O3-12):** o clear lag avisa e limpa no horário (dá para testar com o tempo reduzido só no teste); 60 min de jogo sem crescimento de memória visível nos caches (G1–G3).
15. **Dois jogadores em dimensões diferentes** (Namek e Inferno) por 5 min: névoa, resgates e geração funcionando para os dois.
16. **`/reload`** no meio da sessão: tudo volta a rodar (o relógio é recriado no `worldLoad`) e a sonda mostra 1 intervalo do relógio só, sem duplicar.

---

## 8. Decisões (fechadas em 2026-11-22: as 3 seguem a recomendação)

1. **Fases fixas** para espalhar a carga (as varreduras de 4 ticks deixam de cair no mesmo tick)? Isso muda em até 3 ticks quando a névoa e os resgates acontecem. **Recomendo sim:** é o ganho principal.
2. **`players()` compartilhado** (passo O3-P) num segundo momento, depois de medir? **Recomendo sim, depois:** separa a mudança de lógica da mudança de agendamento.
3. **Hub fora do O3** (vai para o O6, junto com as entidades)? **Recomendo sim:** está na decisão 3 e já tem fases próprias.
