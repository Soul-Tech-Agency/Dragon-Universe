# O2: ganhos rápidos de custo (detalhe para implementar)

Autor: Bússola. Data: 2026-11-22. Base: `agent/viagens` em `ec6a2df`, depois do O1 passo 1: o `index.js` tem 14.204 linhas e os números abaixo valem para esta versão.
Trabalho só de leitura: nada foi implementado. **A implementação espera o OK do usuário para a ordem (decisão 1).**
Regras para cada item:
- um commit por item;
- prova com `node tools/compare-scripts.mjs <rev> [--unordered] [--ignore=…]`, `node tools/measure-scripts.mjs` antes e depois, e `validate` = 6;
- sonda `/scriptevent dbe:perf start|report` com `CONFIG.DEBUG_PERF = true` só no teste;
- nada muda chave de save, id `dbe:` ou propriedade de entidade.

**Ordem sugerida** (do mais seguro e mais visível para o mais delicado): O2a → O2b → O2c → O2e → O2d.

---

## O2a: voo (`rP`), parar de reescrever propriedade e velocidade a cada tick

**Onde:**

| Linha | O que tem |
|---|---|
| `index.js:13808-13816` | getters `flyMode` (`isHover` → "fast"/"normal"), `flySpeed` (stat `flying_speed`) e `isHover` (= `player.isJumping`) |
| `index.js:13817-13832` | `disable()` e `enable()`, que chamam `setFlyModeProperty("none")` / `("normal")` |
| `index.js:13833-13849` | `onTick()`. Com o voo ligado, a linha 13846 chama `this.setFlyModeProperty(this.flyMode)` **todo tick** |
| `index.js:13860-13867` | `setFlyModeProperty(sG)`: `trySetProperty("dbe:fly_mode", sG)` (agenda um `system.run` e um `setProperty` com `client_sync`) e depois `setFlySpeed(...)` |
| `index.js:13868-13873` | `setFlySpeed`: reescreve o `FlyingSpeed.value` e o `UnderwaterMovement` da montaria `dbe:player_fly` |
| `index.js:13874-13890` | `startRiding()`: cria a montaria e aplica a velocidade |

O `onTick` é chamado pelo intervalo de 1 tick das skills (`index.js:3562-3572`, §O2d).

**Problema:**
- Com o voo ligado, cada tick faz 1 `system.run` + `setProperty("dbe:fly_mode")`, que vai pela rede, e reescreve 2 componentes da montaria, mesmo sem nada mudar. É a suspeita principal do tremor e um custo fixo de rede.
- Detalhe: `setFlyModeProperty(sG)` aplica a velocidade de `this.flyMode` e ignora o argumento. Isso continua igual.

**Mudança proposta** (só dentro da classe `rP`):
- Campos `lastFlyMode` (texto) e `lastFlySpeed` (número aplicado à montaria, junto com o id da montaria).
- Em `setFlyModeProperty(sG)`: chamar `trySetProperty` só quando `sG !== lastFlyMode`.
  - O `"none"` continua com a espera de 1 tick e a checagem `isEnabled`.
- Em `setFlySpeed(sG)`: calcular `sH = flySpeed * sG` e só escrever nos componentes quando `sH` mudar **ou** a montaria for outra (`flyEntity.id`).
  - A velocidade também muda quando o stat `flying_speed` muda (gravidade, peso, skill), então a comparação é pelo valor final, não pelo modo.
- Zerar os dois caches em `startRiding()`, `stopRiding()` e `disable()`, para a primeira escrita de uma montaria nova sempre acontecer.

**Risco:**
- Baixo. O cliente já tem o valor; a propriedade `dbe:fly_mode` só alimenta animações (`player.dbe.animation_controllers.json:241-257`).
- **A conferir no jogo:** se o servidor ou o cliente reverter o `FlyingSpeed` da montaria sozinho (ex.: ao trocar de dimensão), a velocidade deixaria de ser reaplicada. Mitigação: reaplicar à força a cada 20 ticks.

**O que a sonda mede:**
- `setProperty/s`: com 1 jogador voando parado, deve cair de ~20/s para ~0 (só nas trocas de modo).
- `run index.js:<linha do trySetProperty>`: o número de chamadas deve cair.
- `interval(1)` das skills: o tempo médio por tick do jogador voando.

**Teste no jogo:**
- Voar 60 s parado, depois 60 s segurando o pulo (rápido) e soltando.
  - A animação muda entre normal e rápido na hora.
  - A velocidade muda na troca.
  - Sem tremor ou menos tremor que antes; comparar em vídeo com a versão anterior.
- Pegar ou soltar um peso de treino (`flying_speed` muda) e entrar na máquina de gravidade voando: a velocidade se ajusta.
- Pousar (desliga), voltar a voar (montaria nova): a velocidade certa desde o primeiro tick.
- Voar entre dimensões (Star Navigator com o voo ligado), morrer voando e entrar em Oozaru voando (desliga).

---

## O2b: `trySetProperty` sem escrita repetida

**Onde:**
- **`index.js:5063-5070`** (classe base das entidades `dbe:`): `trySetProperty(sG, sH)` agenda `cw.run(() => entity.setProperty(sG, sH))` **a cada chamada**, sem checar se o valor muda.
- São 32 chamadas no `index.js`, com propriedades fixas ou por variável:

  | Propriedade | Chamadas |
  |---|---:|
  | `dbe:charging_attack` | 5 |
  | `dbe:race` | 4 |
  | `dbe:is_defending`, `dbe:fusion_type` | 2 cada |
  | `dbe:fly_mode`, `dbe:transformation`, `dbe:ultra_instinct`, `dbe:aura_type`, `dbe:aura_sound`, `dbe:body_type`, `dbe:color`, `dbe:gender`, `dbe:tail_curled`, `dbe:is_knocked_out`, `dbe:is_death`, `dbe:is_armor_visible`, `dbe:customization_*` | 1 cada |
  | `propertyId` das skills (`index.js:7866-7891` antes do O1) | por variável |

**Mudança proposta** (só dentro de `trySetProperty`):
- `pendingProperties = new Map()` por entidade.
- Ao chamar: se já existe um `run` pendente para a mesma propriedade, só atualizar o valor pendente e não agendar outro. Se não existe, guardar o valor e agendar.
- No `run`: ler o valor pendente (o **último** pedido no tick), apagar a entrada, e chamar `setProperty` **só se `entity.getProperty(sG) !== valor`**.
- A leitura no momento da escrita evita cache velho: o valor pode ter sido mudado por outro caminho, como `setProperty` direto, eventos de entidade do JSON ou o respawn.

**Diferença de comportamento:**
- Dois valores diferentes pedidos no mesmo tick viram só o último. O jogo já só renderiza o último, porque os dois `run` rodavam no mesmo tick.
- **Aceitar ou não é a decisão O2b-1.**
- Alternativa sem essa diferença: manter a fila (um `run` por chamada) e só pular quando `getProperty === valor`. Economiza o `setProperty`, mas não o `system.run`.

**Risco:**
- Baixo a médio. `getProperty` de propriedade `client_sync` é barato.
- Atenção a propriedades com valor `undefined` antes da primeira escrita: nesse caso escrever sempre.

**O que a sonda mede:**
- `setProperty/s` com 1 jogador parado, voando, carregando ataque e transformado.
- O número de chamadas `run index.js:5064`.

**Teste no jogo:**
- Transformar e destransformar (`dbe:transformation`, aura e cor).
- Carregar e soltar o Kamehameha (`dbe:charging_attack`: carga e volta a 0).
- Defender (`dbe:is_defending`), Kaioken e Instinto Superior (`propertyId`).
- Fusão (`dbe:fusion_type`), morrer e ir para o Outro Mundo (`dbe:is_death`), nocaute pelo Punho Amigável (`dbe:is_knocked_out`).
- Trocar raça e customização no início, e o barbeiro (`dbe:customization_*`).
- Sair e entrar no mundo transformado: o visual volta certo.

---

## O2c: `capsule_991` (C19)

**Onde:**
- **`index.js:8678-8693`, classe `j1`:**
  - o `constructor` cria `j0.runInterval(() => calculateHeightSensors(), 1)` e **nunca o limpa**;
  - `instances` é um `WeakMap` com a entidade como chave (`getInstance`, `8695-8701`).
- **`index.js:8719-8750`, `calculateHeightSensors`:** a cada tick e por instância, cria 5 entidades `dbe:location` (`d4("dbe:location", …)`), dá um impulso, espera 1 tick, lê a altura e remove as 5.
  - Cada `dbe:location` passa pelo `entitySpawn` → `i3.initializeEntity` (`index.js:8146-8147` e `8070-8073`).
- **`index.js:8756-8768`, `j4(player)`:** chamado **a cada tick para cada jogador** pelo hub (`index.js:9885`). Se o jogador monta uma `capsule_991`, chama `j2(entityRidingOn)` → `getInstance`.
- **`index.js:8771-8792`, classe `j5`, a `movement`:** outro `iZ.runInterval` de 1 tick que nunca é limpo. Escreve uma action bar de depuração ("Center/Speed/PitchDiff/RollDiff") para os passageiros.
- **Como se obtém:** a `capsule_991` só aparece com `/summon` (`is_spawnable: false`, `is_summonable: true`, sem item). O impacto real é limitado, mas cada cápsula invocada deixa 2 intervalos de 1 tick para sempre (o `isValid` só pula o corpo).
- **Por leitura:** se o `entityRidingOn` devolver um objeto JS novo a cada acesso, o `WeakMap` não acha a instância. Aí são criados **2 intervalos novos por tick** enquanto alguém monta. Esse é o pior caso do C19, e a sonda vai confirmar (`intervalos vivos` crescendo).

**Mudança proposta:**
1. `instances`: trocar o `WeakMap` por `Map` com a chave `entity.id`, apagando a entrada ao limpar.
2. Guardar os ids dos intervalos de `j1` e `j5` e criar `dispose()`, que dá `system.clearRun` nos dois e apaga a instância.
3. No corpo dos dois intervalos: `if (!entity.isValid) return this.dispose()` (hoje só pula). Também chamar `dispose()` no `entityRemove`/`entityDie` da cápsula, se houver.
4. Tirar a action bar de depuração (`index.js:8778-8789`).
5. **Opcional, mais delicado:** os 5 `dbe:location` por tick são o custo principal. Trocar por `dimension.getBlockBelow`/`getTopmostBlock` nos 5 pontos não cria entidades, mas muda a física da inclinação. **Decisão O2c-1:** só 1–4 agora e 5 depois, com teste de direção?

**Risco:** 1–4 baixo, porque só a cápsula usa isso; 5 médio.

**O que a sonda mede:**
- `intervalos vivos` antes de montar, durante (deve ficar estável em +2) e depois de remover a cápsula (deve voltar ao valor inicial).
- `interval(1) index.js:8682` e `8775`.
- `entidades dbe:` (os `dbe:location` não devem acumular).

**Teste no jogo:**
- `/summon dbe:capsule_991`, montar, andar, subir e descer rampas: a inclinação continua igual.
- Sem a action bar de depuração.
- Descer, `/kill` na cápsula, invocar 5 de novo e montar e desmontar 5 vezes: os `intervalos vivos` voltam ao valor do começo.

---

## O2d: C9, entidades `dbe:` que não precisam do wrapper completo

**Onde:**
- **`index.js:1915-1917`, `d3(sG)`:** um jogador ou qualquer entidade cujo `typeId` começa com `dbe:` e não é item ganha wrapper.
- **`index.js:8085-8107`, `createDBEEntity`:** usa `d3` e cria `hN` (jogador) ou `fV` com `setupCombatBehaviors` e `initialize()`.
- **`index.js:3555-3573`, `init()` das skills de cada entidade:** `this.dbeEntity.runInterval(…)` de **1 tick** que percorre as skills (`onTick`) e, a cada 50 ticks, faz o decaimento das maestrias.
  - Roda para **toda** entidade com wrapper, mesmo sem nenhuma skill.
  - Cada execução passa pelo `runInterval` da entidade (`index.js:5041-5061`), que cria uma `Promise` por tick.

**Achado (muda o plano do Arquiteto):** o plano sugeria um wrapper só para quem tem entrada em `entities_data`. Só que **todas as 103 entidades `dbe:` do BP estão no `entities_data`**, inclusive `dbe:location`, `dbe:damage_indicator`, `dbe:player_fly`, `dbe:training_orb`, `dbe:missile`, `dbe:capsule_991` e as naves. Esse filtro não excluiria nada.

**Mudança proposta, em 2 partes:**
- **O2d-1 (segura, sem mudar quem tem wrapper):** no `init()` das skills, só criar o intervalo de 1 tick se a entidade **tiver pelo menos uma skill**. Criar sob demanda no `addSkill` (`index.js:~3540`) quando a primeira skill entrar.
  - Entidades sem skills (props, orbs, montarias, indicadores, animais, NPCs sem `skills`) deixam de ter esse intervalo e a `Promise` de cada tick.
  - Comportamento: o corpo do intervalo com 0 skills não faz nada (o laço vazio e o `updateStats` só com `sL = true`). **Por leitura, é idêntico.**
- **O2d-2 (muda quem tem wrapper, decisão do usuário):** uma lista de exclusão explícita em `d3` para entidades técnicas, sem combate e sem skills: `dbe:location`, `dbe:damage_indicator`, `dbe:player_fly`, `dbe:training_orb`.
  - Antes de excluir, conferir cada uma em todos os `getDBEEntity(` (38 chamadas) para ver se o código espera o wrapper delas. Exemplo: a sombra e os orbs do treino de concentração, a montaria do voo e o dano no indicador.
  - **Decisão O2d-1:** fazer só a parte 1 agora e a parte 2 depois do relatório da sonda?

**Risco:** parte 1 baixo, parte 2 médio. Entidades sem wrapper deixam de receber dano "do addon" e saem das listas de `getDBEEntities`.

**O que a sonda mede:**
- `intervalos vivos` e `entidades dbe:` numa vila de Vegeta/Freeza (35–45 aldeões, P5) e durante o treino de concentração.
- O tempo de `interval(1) index.js:3561` (as skills) por tick.
- A duração do tick (média e p95).

**Teste no jogo:**
- Treino de concentração com pontuação alta (orbs aparecendo a cada tick).
- Sombra de treino.
- NPCs com skills (Goku inimigo, Raditz) usando ataques.
- Montaria do voo, naves e Nimbus.
- Indicadores de dano aparecendo.
- Vila de Vegeta carregada: sem erro no Content Log.

---

## O2e: colisão de ataques de ki, O(K²) em chamadas nativas

**Onde:**
- **`index.js:9902`** (fim do hub `onTickEvent`, todo tick): `for (let sS of i3.getKiAttackEntities()) hZ.testCollision(sS);`
- **`index.js:8020-8030`, `hY.testCollision(sG)`:** busca os ataques próximos (`getNearbyKiAttacks`, raio `baseScale * 2`) e, para cada um com dano menor, faz `tryTeleport` para a posição do mais forte.
- **`index.js:8055-8066`, `getKiAttackEntities(dim, {location, maxDistance})`:** percorre **todos** os ataques do mapa `i1`. Para cada um chama `entity.matches({location, maxDistance})` (nativo), calcula `bO.distance`, monta a lista e ordena.
  - Com K ataques: K² chamadas nativas `matches` e K² leituras de `location` por tick, mesmo com os ataques em dimensões diferentes. A checagem de dimensão compara objetos.

**Mudança proposta** (comportamento igual):
- Uma vez por tick, montar `snapshot = [{ atk, dimId, loc }]`, lendo `location` e `dimension.id` uma vez por ataque, e agrupar por dimensão.
- Para cada ataque, achar os vizinhos **em JS**: distância 3D ≤ `baseScale * 2` (o mesmo critério do `matches` com `maxDistance`), ordenados por distância como hoje. Aplicar a mesma regra `damage` maior → `tryTeleport`.
- Quando um ataque é teleportado, atualizar a posição dele no snapshot, para os testes seguintes do mesmo tick verem o que o código atual vê. O `tryTeleport` de hoje é lido de novo pelo `matches` seguinte. **A conferir:** se o `tryTeleport` aplica na hora ou no fim do tick.
- Com K > 8 na mesma dimensão, usar uma grade de células de 8 blocos (mapa `"cx,cy,cz"` → lista).
- O `getKiAttackEntities` continua existindo para os outros usos.

**Risco:** médio, porque mexe na física de choque de rajadas. A regra é a mesma; muda só onde a distância é calculada.

**O que a sonda mede:** o tempo do hub (`interval(1) index.js:<hub>` / `onTickEvent`) com 0, 2, 6 e 12 ataques ao mesmo tempo. Com 12 ataques, hoje são 144 `matches` por tick.

**Teste no jogo:**
- Dois jogadores trocando Kamehameha de frente: o mais forte empurra o mais fraco, como antes.
- Genki Dama contra uma rajada pequena.
- Vários Ki Blasts ao mesmo tempo, um ataque em outra dimensão (não interage) e um ataque grande (`baseScale` alto, raio maior).

---

## Decisões para o usuário

1. **Ordem** (decisão 1 do pedido): O2a → O2b → O2c → O2e → O2d, ou outra?
2. **O2b-1:** juntar pedidos de propriedade no mesmo tick (só o último vale, menos `system.run`), ou só pular quando o valor já é igual (fila mantida)?
3. **O2c-1:** trocar os 5 `dbe:location` por consulta de bloco (sem criar entidades) agora, ou só limpar os intervalos e a action bar?
4. **O2d-1:** fazer só a parte 1 (intervalo de skills só para quem tem skill), e a lista de exclusão do `d3` depois da sonda?
