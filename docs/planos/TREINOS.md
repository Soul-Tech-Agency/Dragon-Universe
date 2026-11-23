# Treinos novos (ROADMAP Fase 5.1)

> Autor: Arquiteto (planejamento, somente leitura). Base: `integration/1.7.17` @ `5f80820`, lida com `git show`/`git archive`.
> Referências: `docs/ROADMAP.md` (Fase 4, Fase 5.1, "Observações sobre o treino físico"), `docs/ARCHITECTURE.md §3.4`, `docs/SYSTEMS.md §4`, `docs/KNOWN_ISSUES.md` (C2, C30, P7), redesign em `../redesign/` (`BRIEF.md`, `CONTRATO.md`) e `ARQUITETURA_OTIMIZACAO.md` (nesta pasta).
> **Nada foi testado no Minecraft.** As APIs marcadas com "(conferir)" precisam ser verificadas na documentação do `@minecraft/server` para o Bedrock 26.52 antes de implementar.
> Atenção: o redesign (flag `du2;`, abas novas) **ainda não está em `integration/1.7.17`**: `grep du2 index.js` = 0. Este plano assume que ele entra antes dos treinos.

---

## 0. Estado atual (o que já existe e pode ser reaproveitado)

| Peça | Onde (`index.js`, integration/1.7.17) | Uso nos treinos novos |
|---|---|---|
| Classe da concentração `hL` | 13575–13700 | reformular (seção 1) |
| Menu Treino `kH` (`ui.dbe.training.title`) | 16852–16890 | ganha os botões novos |
| Texto da concentração na action bar (`k1`) | ~15945 | trocar pelo painel do HUD |
| Clique no orb (`afterEntityHitEntity`) | ~16059 | validar dono do orb |
| Gerenciador de permissões de entrada `hM` (`blockInputPermission(dono, categorias)`) | ~13700 | travar movimento durante flexões/concentração |
| `isActionBlocked` (nocaute, fusão não controladora, espectador) | 13776 | incluir "em treino físico" |
| Recompensa de pontos `hD` / XP `hE.addPoints` | 13459–13520 | recompensas |
| Cooldowns com `"absolute_time"` | vários | todos os cooldowns novos (evita C2) |
| `trySpawnDBEEntity(typeId, dim, loc, { entityDefinitions })` | 12760 | réplicas com nível próprio |
| `dbe:spawned_by` (ignorado pelo `afterEntitySpawn`) | 12769, 16070 | marcar réplicas |
| Ouvinte `defeat_enemy` (conta pelo `typeId` do morto) | 12780 | filtrar réplicas |
| Recompensa por abate (XP + zeni) `distributeRewards` | ~10368 | filtrar réplicas |
| `trainingMultiplier` (dimensão × gravidade; Sala do Tempo ×25) | 11368 | limitar nos treinos novos |
| Dados salvos | `data.get/set("concentration_training")` dentro do JSON `dbe` | chaves novas no mesmo JSON |

**Conflitos do Shift (por leitura):**

| Onde | Efeito do Shift | Lado |
|---|---|---|
| `handleKi` (`index.js:10535`) | carrega ki enquanto `isSneaking` (só se `!isActionBlocked`) | servidor |
| `entityStartSneaking` (`index.js:11014`) | com o slot 8 (`dbe:functions`) selecionado, carrega a transformação (só se `!isActionBlocked`) | servidor |
| `auraEnabled` (`index.js:10413`) | aura ligada enquanto `isSneaking` | servidor |
| Voo | Shift desmonta a montaria `dbe:player_fly` (vanilla) | motor |
| `player_dbe.animation_controllers.json` (BP, linhas 30/37) | toca o som da aura com `q.is_sneaking` | **cliente** |
| `player.entity.json` (RP, linha 867) `v.is_charging_ki = q.is_sneaking && !q.is_moving` | pose e partículas de carregar ki | **cliente** |

Os dois últimos rodam no cliente e **não podem ser desligados só pelo script**. O cliente precisa de um sinal. O jogador já usa **32 de 32 propriedades** (`player.json`), então não dá para criar `dbe:training`. Proposta: **acrescentar o valor `"pushup"` no fim do enum `dbe:fly_mode`** (`["none","normal","fast","pushup"]`). O valor salvo é a string, então mundos antigos continuam válidos. As condições do RP que testam `== 'none'` passam a tratar `pushup` como "não ocioso", o que é desejado (sem animação de ocioso nem de queda). Engrenagem/Aquarela (RP) e o dono do BP precisam aprovar (ver Decisões).

---

## 1. Concentração reformulada

### 1.1 Problemas atuais
- Os orbs aparecem em posições aleatórias. A pontuação aparece misturada na action bar com missões e ki sense. O pedido do C30 é "quadrado ou painel fixo".
- **Custo:** com pontuação ≥ 95, `tickSpeed` = 1. Aí `updateOrbs` **cria e remove 5 entidades por tick** (até 100 por segundo).
- **Exploit em multiplayer:** `claimOrb` aceita qualquer `dbe:training_orb` acertado pelo jogador, até o orb de outro jogador.
- Se o jogador sair, morrer ou trocar de dimensão no meio, `stopTraining` não roda e os orbs ficam no mundo (só o `minecraft:despawn` do orb limpa).
- Não há limite por sessão: a recompensa é `floor(pontos/5)` pontos de atributo, sem teto.

### 1.2 Fluxo do jogador
1. Aba **Treino** (layout do redesign) → cartão **Concentração** mostra tentativas, recorde e tempo até recarregar → **Começar**.
2. Contagem 3‑2‑1 no painel. O jogador fica **parado no lugar**: o dono `"concentration"` bloqueia `Movement` e `Jump` em `hM`. A câmera continua livre.
3. Uma **grade 3×3 fixa** (o "quadrado") aparece 2,5 blocos à frente, na altura dos olhos, alinhada à direção em que o jogador olhava ao começar. Os 9 orbs são criados **uma vez**. A cada ciclo só muda a cor deles (`dbe:color`): **verde** dá +1, **vermelho** dá −1, **preto** encerra, e **apagado** (valor novo 3) não faz nada. A regra de cores de hoje continua.
4. Um painel fixo no HUD (estilo du2) mostra PONTOS, RECOMPENSA (AP), TENTATIVAS, uma barra de RITMO (0–10) e o COMBO.
5. A sessão termina com o orb preto, com o tempo máximo, com o botão **Encerrar** (no menu ou no item de menu) ou com uma interrupção (dano, morte, saída, troca de dimensão, distância > 3 blocos do ponto inicial). Ao terminar aparece o resumo com a recompensa.

### 1.3 Recompensas e limites

| Regra | Valor proposto | Motivo |
|---|---|---|
| Recompensa | `floor(pontos/5)` AP, como hoje | compatível |
| Teto por sessão | 10 AP (50 pontos) | evita sessões infinitas |
| Duração máxima | 90 s | evita macro/AFK |
| Ritmo mínimo | ciclo ≥ 6 ticks (hoje chega a 1) | jogável e barato |
| Tentativas | 3 iniciais, recarrega para 5 após `CONCENTRATION_COOLDOWN_TICKS` (24000) com `"absolute_time"`, como hoje | compatível |
| Dono do orb | só conta orb com `dbe:orb_owner` = id do jogador | corrige o exploit em multiplayer |
| Interrupção | dano recebido, morte, saída ou dimensão: encerra **com** a recompensa até ali, a tentativa é gasta e os orbs são removidos | sem orbs perdidos no mundo |
| Saída do jogador | `playerLeave`: remove os orbs dele (guardar ids no mapa por jogador) | limpeza |

### 1.4 Peças necessárias

| Tipo | Item |
|---|---|
| Entidade | `dbe:training_orb` (existe): faixa de `dbe:color` de `[0,2]` para `[0,3]` (3 = apagado), nova dynamic property `dbe:orb_owner` |
| UI (RP, Engrenagem) | `ui/hud_screen/concentration_panel.json` (novo, lê tokens do `title`); layout novo do formulário Treino (seção 4) |
| Texturas (Aquarela) | reaproveitar `du2/panel_dark`, `pill_gold`, `xp_on`/`xp_off`; ícone novo `du2/icons/train_concentration` |
| Tokens do HUD | `conc_on:1`, `conc_score:<n>`, `conc_reward:<n>`, `conc_tries:<n>`, `conc_pace:0..10`, `conc_combo:<n>`, `conc_time:<s>` (pares `chave:valor`, mesmo mecanismo da barra de ki) |
| .lang (pt/en/es) | `ui.dbe.training.concentration.{title,desc,start,stop,summary,interrupted,best}`, `ui.dbe.du2.{score,reward,tries,pace,combo}` |
| Config | `CONFIG.CONCENTRATION = { GRID_DISTANCE: 2.5, MIN_CYCLE_TICKS: 6, MAX_SESSION_TICKS: 1800, MAX_REWARD: 10 }` |
| Save | `concentration_training` continua `{ highScore, remainingAttempts }`; campo aditivo `v: 2` (sem migração) |

**Arquivos tocados:** `scripts/training/concentration.js` (depois de O4.6; antes disso, `index.js` 13575–13700, 15945, 16059, 16852), `config/config.js`, `entities/training_orb.json`, RP `ui/hud_screen/*`, `ui/menus/training_form.json`, `textures/ui/du2/*`, três `.lang`.

**Teste no jogo:** sessão completa até o orb preto; atingir 50 pontos (teto); 2 jogadores treinando lado a lado (acertar o orb do outro não pontua); sair do mundo no meio e voltar (nenhum orb sobra); sonda `dbe:perf` sem entidades criadas por ciclo; celular (orbs ao alcance do toque).

**Estimativa:** script 1,5 dia · JSON UI 1 dia · texturas 0,5 dia (os três em paralelo, um dono por área).

---

## 2. Treino físico (flexões com Shift)

### 2.1 Fluxo do jogador
1. Aba Treino → **Treino físico** → escolher a série: **20 / 30 / 50** flexões. A de 50 só libera a partir do nível 30.
2. O servidor confere: no chão, fora d'água, sem voar, sem montaria, sem fusão, sem nocaute, sem missão de combate ativa, fora de torneio, sem ataque de ki carregando, sem dano nos últimos 10 s. Se algo falhar, aparece uma mensagem dizendo o motivo.
3. Contagem 3‑2‑1. O jogador entra na pose: `dbe:fly_mode = "pushup"` mais a animação. Movimento, pulo e montaria ficam bloqueados (dono `"physical_training"` em `hM`). **O Shift continua livre.**
4. **Cada repetição:** quando o painel mostra **DESÇA**, segurar o Shift. Quando mostra **SUBA**, soltar. O servidor valida o tempo de cada fase:
   - fase de baixo ≥ 8 ticks e fase de cima ≥ 8 ticks;
   - ciclo inteiro ≤ 60 ticks; se passar, a repetição não conta e aparece "ritmo perdido";
   - o pedido seguinte vem depois de uma pausa aleatória de 0–10 ticks (anti-macro: um macro de ritmo fixo erra a sincronia);
   - apertar antes do pedido = repetição inválida.
5. Cada repetição gasta stamina (sistema existente). Com stamina 0 o jogador precisa esperar ela regenerar parado: a série fica pausada, sem perder o progresso.
6. A série termina quando completa, ou com **Parar** (item de menu), dano, saída, morte ou dimensão (interrompida), ou com 5 s sem responder (AFK). No fim, um resumo mostra repetições válidas e XP.

### 2.2 Celular e controle
- **Celular:** o botão de agachar existe. No modo "alternar", cada toque troca o estado, então o ciclo pressionado/solto continua funcionando com o mesmo código.
- **Controle:** usa o botão de agachar normalmente.
- **Modo alternativo** (opção nas configurações do treino, para quem tem dificuldade com o agachar): **usar o item `dbe:functions` (slot 8)** = uma fase (desce/sobe alternado), com a mesma validação de tempo. Usar `itemUse` evita um formulário a cada repetição: formulário reaberto é lento, sofre `UserBusy` (C20) e tira a visão.
- Detecção opcional: `player.inputInfo.lastInputModeUsed` (conferir) para sugerir o modo alternativo no celular.
- Leitura do Shift: `player.isSneaking` amostrado a cada tick pelo agendador, ou o evento `world.afterEvents.playerButtonInput` (conferir disponibilidade/estabilidade no 26.52). Recomendado: o evento, se for estável; senão, amostragem a cada tick só para quem está em treino.

### 2.3 Resolução dos conflitos

| Conflito | Solução |
|---|---|
| Carga de ki (`handleKi`) e transformação pelo slot 8 | `isActionBlocked` passa a incluir `this.physicalTraining?.active` (os dois pontos já checam `isActionBlocked`) |
| Aura no servidor (`auraEnabled`) | condição extra: não ligar se em treino físico |
| Som da aura (BP, cliente) | `stop_aura_sound`: acrescentar `\|\| q.property('dbe:fly_mode') == 'pushup'` à condição de parar e `&& q.property('dbe:fly_mode') != 'pushup'` à de tocar |
| Pose de ki (RP, cliente) | `v.is_charging_ki = q.is_sneaking && !q.is_moving && q.property('dbe:fly_mode') != 'pushup'` |
| Voo | só começa no chão e sem voo; `Jump` bloqueado impede o pulo duplo |
| Efeitos de `isActionBlocked` em outros pontos (ataques de técnica `16086`, item de menu `16099`, ki sense `13425`) | aceitável: durante a série não se ataca. **Mas o item de menu precisa abrir "Parar"**: tratar o treino físico antes do `if (!isActionBlocked)` de `afterItemUse` |
| Fim da série por qualquer caminho | `finally` único: desbloquear permissões, `fly_mode = "none"`, parar a animação e salvar |

### 2.4 Recompensas e limites

| Regra | Valor proposto |
|---|---|
| XP por repetição válida | `ceil(0,4% × XP do próximo nível)` × `min(trainingMultiplier, 3)` |
| Série de 30 (sem multiplicador) | ≈ 12% de um nível |
| Séries por dia | 3, recarregam a cada 24000 ticks (`"absolute_time"`, cooldown `physical_training`) |
| Multiplicador | gravidade e dimensão contam, **com teto 3** (sem o teto, a Sala do Tempo daria ×25) |
| Pagamento | uma vez só, no fim da série (uma gravação) |
| Interrompida | paga 50% das repetições válidas e gasta a série |
| Sem repetição válida | não gasta a série |
| Validação | tudo no servidor; o cliente só mostra a pose |
| Multiplayer | estado por jogador; sem interação entre jogadores |

### 2.5 Peças necessárias

| Tipo | Item |
|---|---|
| Propriedade | valor `"pushup"` no fim do enum `dbe:fly_mode` (`player.json`) |
| Animação (RP) | `animation.player.dbe.pushup` (loop baixo/cima guiado por `q.is_sneaking`) no controlador do jogador quando `fly_mode == 'pushup'`, mais a correção de `is_charging_ki`. Alternativa sem controlador: `player.playAnimation(...)` (conferir se as animações do jogador continuam por cima) |
| BP | condições do `stop_aura_sound` |
| HUD | o mesmo painel da concentração com tokens `phys_on:1`, `phys_reps:<n>`, `phys_goal:<n>`, `phys_cue:down\|up\|wait`, `phys_stamina:0..10` |
| UI | cartão no formulário Treino (seção 4) mais um sub-formulário de série `ui.dbe.training_physical.title` |
| Ícone | `du2/icons/train_physical` |
| .lang | `ui.dbe.training.physical.{title,desc,series,start,stop,down,up,lost,summary,blocked.<motivo>,alt_mode}` |
| Config | `CONFIG.PHYSICAL = { MIN_PHASE_TICKS: 8, MAX_CYCLE_TICKS: 60, CUE_JITTER: 10, AFK_TICKS: 100, DAILY_SERIES: 3, XP_PER_REP_PCT: 0.004, MULT_CAP: 3, STAMINA_PER_REP: 5 }` |
| Save | chave nova no JSON `dbe`: `physical_training = { v: 1, seriesLeft, totalReps, bestSeries, altMode }`; cooldown `physical_training` |
| Ids novos | nenhuma entidade ou item novo |

**Arquivos tocados:** `scripts/training/physical.js` (novo), ganchos em `core/player.js` (`isActionBlocked`), `skills/ki.js` (`auraEnabled`), `core/events.js` (`afterItemUse`, `playerLeave`), `ui/menus/training.js`, `config.js`, BP `entities/player.json` e `animation_controllers/player_dbe.animation_controllers.json`, RP `entity/player.entity.json`, `animation_controllers/player/player.dbe.animation_controllers.json`, `animations/` (nova), `ui/hud_screen/*`, três `.lang`.

**Teste no jogo:** série de 20 no PC, no celular (agachar no modo alternar) e no controle; modo alternativo com item; tentar carregar ki, transformar e voar durante a série (nada deve acontecer); o som e a pose de ki **não** aparecem; macro (apertar no ritmo fixo de 10 ticks) perde repetições; sair no meio (permissões voltam ao entrar de novo); 2 jogadores (um vê a pose do outro); Sala do Tempo respeita o teto 3.

**Estimativa:** script 2 dias · RP (animação, controlador, painel) 1,5 dia · `.lang`/ícone 0,5 dia.

---

## 3. Treino mental (réplicas de chefes)

### 3.1 Dependência: registro de progressão (Fase 4), versão mínima

A Fase 4 prevê um registro completo (chefes, missões, dimensões, transformações). Para o treino mental basta **chefes derrotados**:

| Peça | Proposta mínima |
|---|---|
| Dados | `data/progression_data.js` (dono: Content Developer): `bosses = [{ id: "dbe:raditz", quest: "saga_saiyan_1", order: 1 }, …]`. A lista vem das 43 entidades `defeat_enemy` de `main_quests_data.js`, **sem** `dbe:shadow_dummy`, `dbe:saibaman`, `dbe:frieza_soldier` e `dbe:cell_junior` (inimigos comuns) |
| Save | chave nova no JSON `dbe`: `progress = { v: 1, bosses: { "dbe:raditz": 1, … } }` |
| Escrita | ouvinte `entity_died`: matador é jogador, alvo está em `bosses` e **não** é réplica → marca |
| Backfill (saves antigos) | ao carregar o jogador sem `progress.v`: percorrer `completedQuests` e marcar os `entity` das tarefas `defeat_enemy` dessas missões. Roda uma vez e grava `v: 1` |
| API | `progression.hasDefeated(player, id)`, `progression.listDefeated(player)` (depois reaproveitada por títulos e eventos) |

Arquivos: `scripts/progression/progression.js` (novo), `data/progression_data.js` (novo), gancho no ouvinte `entity_died` e no carregamento do jogador. Estimativa: 1 dia. Teste: save antigo com a saga Saiyajin completa → Raditz, Nappa e Vegeta aparecem como derrotados.

### 3.2 Fluxo do jogador
1. Aba Treino → **Treino mental** → grade com os chefes derrotados (ícone, nome, melhor tempo, ✓ por dificuldade). Os chefes que faltam aparecem bloqueados com "Derrote na campanha".
2. Escolher o chefe e a dificuldade:
   - **Memória:** nível da missão original (`entityDefinitions.powerDefinition` da tarefa).
   - **Desafio:** nível do jogador × 1,1, com o mesmo foco de atributos.
3. Efeito de "entrar na mente" (névoa e partículas). A réplica surge a 6 blocos, presa ao jogador.
4. Luta com limite de 3 min. **O combate mental não mata:** dano letal no jogador durante o treino deixa a vida em 1, encerra o treino e o jogador "acorda". Não vai para o Outro Mundo e não perde nada.
5. Ao vencer: resumo (tempo, recompensa). Ao perder ou cancelar: "a mente cedeu", sem recompensa.

### 3.3 Identidade da réplica (ver Decisões)

**Recomendado, opção A: mesmo `typeId` do chefe + tag e propriedades próprias.**
- Criada com `trySpawnDBEEntity(bossId, dim, loc, { entityDefinitions })`. Recebe a tag `dbe:mental_replica` e as dynamic properties `dbe:spawned_by = "mental_<playerId>"` e `dbe:mental_owner = <playerId>`.
- **Pontos que precisam filtrar a tag** (todos no núcleo):
  1. ouvinte `defeat_enemy` (`index.js:12780`): ignorar réplica, para não contar em missões (P7 já mostra que esse ouvinte conta qualquer abate do tipo);
  2. `distributeRewards` (~10368): sem XP nem zeni por abate;
  3. registro de progressão: não marca;
  4. morte da réplica: no lugar de deixá-la morrer (o que gera loot), o serviço de dano faz `remove()` quando a vida chega a 0, então não cai nada;
  5. conquistas `defeat_enemy` (3 em `achievements_data.js`) passam pelo mesmo ouvinte. **Conferir com `git grep`** se há outro contador por `typeId` (diálogos, sobrevivência do Beerus, torneio).
- Vantagem: nenhuma entidade nova no BP/RP, e a aparência acompanha o chefe automaticamente.
- Risco: um contador por `typeId` esquecido. Isso exige o teste de regressão "matar a réplica não avança missão nem conquista".

Opção B, `typeId` próprio (`dbe:mental_<chefe>`): exige arquivo BP + RP + entrada em `entities_data` para cada um dos ~39 chefes (~117 arquivos). Pode ser gerado por ferramenta (`tools/gen-replicas.mjs`) a partir do arquivo do chefe. Não conta em nada por construção, mas é muito conteúdo duplicado e cada mudança de arte precisa regerar os arquivos.

### 3.4 Recompensas e limites

| Regra | Valor proposto |
|---|---|
| Primeira vitória por chefe e dificuldade | Memória: 1 ponto de skill · Desafio: 2 pontos de skill + 3 AP |
| Vitórias repetidas | XP = 25% do XP do próximo nível, no máximo **3 por dia** (cooldown `mental_training_daily`, `"absolute_time"`) |
| Mesmo chefe | 1 vez por dia (cooldown `mental:<bossId>`) |
| Réplica ativa | 1 por jogador; não pode iniciar em torneio, em claim alheio, em missão de combate ou em dimensão de viagem pendente |
| Dano de terceiros | a réplica só recebe dano do dono (filtro no serviço de dano); outros jogadores não "ajudam" |
| Validação da vitória | o dono precisa ter causado ≥ 80% do dano (o log de recompensa já guarda acertos por jogador) |
| Remoção automática | dono sai, morre, troca de dimensão ou fica a > 32 blocos; 3 min sem vitória; recarregamento do mundo: réplica com `dbe:mental_owner` e sem treino ativo em memória é removida no `entityLoad` |
| Proteção contra morte | só enquanto o treino mental está ativo e só para dano vindo da própria réplica ou do ambiente durante a luta |

### 3.5 Peças necessárias

| Tipo | Item |
|---|---|
| Ids novos | tag `dbe:mental_replica`; dynamic property `dbe:mental_owner`; cooldowns `mental_training_daily`, `mental:<bossId>` |
| Save | `mental_training = { v: 1, clears: { "<bossId>": { memory: n, challenge: n, best: ticks } } }`; `progress` (3.1) |
| UI | formulário `ui.dbe.training_mental.title` (lista com abas, como Missões, seguindo o `CONTRATO.md`): índices 0–9 abas, 10+ um botão por chefe (texto = nome da entidade; `*` no selecionado; ícone `du2/icons/train_mental`); confirmação com a dificuldade |
| HUD | o mesmo painel (modo `train_hud:ment;`); tokens e subtítulo em `redesign/CONTRATO.md` §12.3: `ment_boss_hp:0..10;`, `train_count`, tempo e dificuldade no `train_vals` (substitui os antigos `ment_on`/`ment_time`) |
| Partículas/sons | reaproveitar névoa de viagem e `common.teleport2` |
| .lang | `ui.dbe.training.mental.{title,desc,locked,memory,challenge,start,win,lose,timeout,daily_limit,first_clear}` |
| Config | `CONFIG.MENTAL = { TIME_LIMIT_TICKS: 3600, DAILY_REPEATS: 3, CHALLENGE_LEVEL_MULT: 1.1, MIN_DAMAGE_SHARE: 0.8, LEASH: 32 }` |

**Arquivos tocados:** `scripts/training/mental.js` (novo), `scripts/progression/*` (novo), `data/progression_data.js` (novo, Content), ganchos em `quests/tasks.js` (`defeat_enemy`), `combat/damage.js` (dono, proteção contra morte, `remove()` da réplica), `core/entities.js` (`distributeRewards`, `entityLoad`), `ui/menus/training*.js`, `config.js`, RP `ui/menus/training_mental_form.json` (novo), `ui/server_form.json` (roteamento do título), `textures/ui/du2/icons/*`, três `.lang`.

**Teste no jogo:** derrotar a réplica de Raditz na dificuldade Memória → missão ativa de Raditz/Nappa **não** avança, sem zeni nem XP de abate, sem loot, recompensa de primeira vitória paga uma vez; repetir até o limite diário; perder (vida vai a 1, sem Outro Mundo); outro jogador bate na réplica (sem efeito); sair no meio e voltar (réplica removida); save antigo com backfill.

**Estimativa:** registro mínimo 1 dia · script do treino 2,5 dias · UI 1 dia · teste dirigido 0,5 dia.

---

## 4. Formulário Treino no redesign (proposta para o `CONTRATO.md`, dono: Engrenagem)

Título `ui.dbe.training.title`. Flag `du2;` no body liga o layout novo, como em Estatísticas. Índices 0–9 = abas (seção 2 do contrato).

| Índice | Tipo | Conteúdo | Ação |
|---|---|---|---|
| 10 | botão | `ui.dbe.training.button.shadow_dummy` (`""` durante outro treino) | sombra |
| 11 | botão | concentração: `…concentration` / `…stop_concentration` / `""` sem tentativas | iniciar/parar |
| 12 | botão | `ui.dbe.training.button.physical` (`*` se ativo) | abre a série / parar |
| 13 | botão | `ui.dbe.training.button.mental` (`""` sem nenhum chefe derrotado) | abre a lista |
| 14–17 | slot | status de cada cartão (texto puro): tentativas `"3/5"`, séries `"2/3"`, réplicas hoje `"1/3"`, recarga `"12 min"` ou `""` | — |
| 18 | slot | recorde da concentração `"47"` | — |
| 19 | slot | multiplicador de treino `"x2"` ou `""` | — |

Ícones: `du2/icons/train_shadow`, `train_concentration`, `train_physical`, `train_mental` (brancos 32×32, como os outros).

---

## 5. Ordem e estimativa total

| # | Entrega | Depende de | Agentes em paralelo | Estimativa |
|---|---|---|---|---|
| 1 | Redesign integrado em `integration/*` | — | — | (em andamento) |
| 2 | O4.6 `training/` extraído (ou pelo menos O4.1 + concentração em arquivo próprio) | `ARQUITETURA_OTIMIZACAO.md` | 1 | 1 dia |
| 3 | **Concentração reformulada** + painel de HUD compartilhado | 1, 2 | 3 (script · JSON UI · texturas) | 2 dias corridos |
| 4 | **Treino físico** | 3 (painel), aprovação do `fly_mode = "pushup"` | 3 (script · RP anim/controladores · lang/ícones) | 2–3 dias corridos |
| 5 | Registro mínimo de progressão | — (pode ir em paralelo com 3/4; outro arquivo) | 1 + Content (dados) | 1 dia |
| 6 | **Treino mental** | 5, combate legível (O4.2) de preferência | 2 (script · UI) | 3–4 dias corridos |

Total ≈ 9–11 dias corridos com 3 agentes. **Conflito de arquivo:** os três treinos tocam `ui/menus/training*` e `config.js`. Cada etapa precisa ser integrada antes de começar a próxima, ou é preciso definir um dono único para esses dois arquivos.

---

## 6. Decisões para o usuário

1. **Sinal para o cliente durante as flexões** (jogador já tem 32/32 propriedades)
   - (a) Valor novo `"pushup"` no fim do enum `dbe:fly_mode`.
   - (b) Liberar uma propriedade (ex.: juntar booleanos), o que mexe em muitos arquivos do RP.
   - (c) Não tratar o cliente: a pose e o som de carga de ki aparecem durante as flexões.
   - **Recomendação: (a).** É compatível com save, é uma linha no `player.json` e quatro condições no RP/BP.

2. **Entrada no celular/controle**
   - (a) Agachar em todas as plataformas + modo alternativo com o item `dbe:functions`.
   - (b) Botão de formulário a cada repetição (como diz o ROADMAP).
   - (c) Botão de pulo.
   - **Recomendação: (a).** O formulário reaberto é lento e sofre `UserBusy`, e o pulo fica bloqueado para impedir o voo.

3. **Identidade das réplicas do treino mental**
   - (a) Mesmo `typeId` + tag `dbe:mental_replica` + filtros em 4–5 pontos do núcleo.
   - (b) `typeId` próprio por chefe, gerado por ferramenta (~117 arquivos).
   - **Recomendação: (a)**, com o teste obrigatório "réplica não conta em missão/conquista/loot". Migrar para (b) só se aparecer um contador impossível de filtrar.

4. **Onde acontece a luta mental**
   - (a) No lugar onde o jogador está (área livre de raio 6, réplica presa ao jogador).
   - (b) Arena própria (dimensão ou plataforma isolada por jogador, como a Angel Staff).
   - **Recomendação: (a) na primeira versão.** A arena entra junto com as dimensões da Fase 5.6, se o teste mostrar interferência de mobs ou de construções.

5. **Multiplicador de treino nas flexões**
   - (a) Conta, com teto ×3.
   - (b) Não conta.
   - (c) Conta sem teto (Sala do Tempo ×25).
   - **Recomendação: (a).** Pesos e gravidade continuam valendo a pena sem quebrar a progressão.

6. **Painel da concentração**
   - (a) Painel fixo no HUD por tokens do `title` (padrão du2).
   - (b) Manter a action bar, só com o texto reorganizado.
   - **Recomendação: (a)**, com (b) como reserva enquanto o JSON UI não fica pronto. Limitação conhecida: um `/title` de outro sistema apaga o HUD até a próxima atualização.

7. **Valores de recompensa** (teto de 10 AP por sessão de concentração; 3 séries de flexões por dia ≈ 36% de um nível; skill points na primeira vitória mental)
   - **Recomendação:** aprovar estes valores como ponto de partida, deixar todos em `config.js` e ajustar depois do primeiro teste em grupo.
