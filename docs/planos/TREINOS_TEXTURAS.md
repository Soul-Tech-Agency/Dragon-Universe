# Texturas dos treinos novos (1.7.19): mapa visual da Aquarela

- **Canal e tokens:** valem os do `redesign/CONTRATO.md` §11 (Engrenagem), ou seja, tokens de estado no título e o subtítulo `train_vals` com os números. Não há tokens `conc_score`/`conc_reward`/… separados.
- **Este arquivo diz só que textura vai em cada elemento** (decisão de coordenação sobre o P3 da Sentinela 2 em `45748c2`).
- Os caminhos vão sem extensão, a partir de `textures/ui/du2/`.
- O treino mental (`ment_*`, vida do chefe) entra no contrato novo da Engrenagem (§12), com `bar_red_on`.

## Painel (`ui/du2/du2_training_hud.json`, `train_hud` = `conc;` / `phys;`)
| Elemento | Textura | Observação |
|---|---|---|
| Fundo do painel | `panel_dark` | já existe (nineslice 16x16, ns 4) |
| Título do painel | ícone `icons/train_concentration` / `icons/train_physical` | já existem (§11.6) |
| Contagem `train_count` (3-2-1) | `pill_gold` atrás do número grande | já existe |

## Tokens de estado (título, CONTRATO §11.2)
| Token | Visual |
|---|---|
| `conc_pace` 0–10 | 10 segmentos `xp_on` / `xp_off` (ciano), legenda `ui.dbe.du2.pace` |
| `phys_stamina` 0–10 | 10 segmentos **`bar_gold_on`** / `xp_off` (dourado, **não** `xp_on`), legenda `ui.dbe.du2.stamina` |
| `phys_cue` = `down;` | **`pill_gold`** + ícone **`icons/chevron_down`** (`#0C1730` sobre o dourado) + "DESÇA" |
| `phys_cue` = `up;` | **`pill_blue`** + ícone **`icons/chevron_up`** (`#23D7FF`) + "SUBA" |
| `phys_cue` = `wait;` | `pill_dark` + ícone `icons/clock` (`#8FA0BF`) + "…" |
| `conc_c0`…`conc_c8` (grade 3x3 espelhada) | ícone `icons/attr_spirit` (orbe), tingido: `g;` `#7CE38B`, `r;` `#FF6B7A`, `k;` `#0C1730` com aro (ou `#1D3F73`), `o;` `#8FA0BF` a 40% |

## Subtítulo `train_vals` (CONTRATO §11.3): ícone fixo na coluna das legendas, um por linha
Os ícones são fixos por linha, então o JSON não precisa de token novo.

| Modo | Linha | Legenda | Ícone fixo | Cor sugerida |
|---|---|---|---|---|
| `conc` | 1 pontos | `ui.dbe.du2.score` | `icons/quest_main` | `#F6B943` |
| `conc` | 2 recompensa (AP) | `ui.dbe.du2.reward` | `icons/plus` | `#7CE38B` |
| `conc` | 3 tentativas | `ui.dbe.du2.tries` | `icons/restart` | `#A8B6D0` |
| `conc` | 4 combo | `ui.dbe.du2.combo` | `icons/tab_skills` (chama) | `#FF9F43` |
| `conc` | 5 tempo restante | `ui.dbe.du2.time` | **`icons/clock`** | `#23D7FF` |
| `phys` | 1 repetições | `ui.dbe.du2.reps` | `icons/train_physical` | `#F6B943` |
| `phys` | 2 séries de hoje | `ui.dbe.du2.series` | `icons/check` | `#7CE38B` |
| `phys` | 3 aviso de AFK | `ui.dbe.du2.afk` | `icons/clock` | `#FF9F43` (só quando a linha não está vazia) |

## Grade 3x3 no mundo (os orbes, fora do HUD)
- Hoje: partícula `dbe:concentration_orb` (disco branco 16x16, tingido por `v.color`).
- **Opcional (Bússola):** para o orbe apagado, a partícula `dbe:concentration_orb_off` (anel vazado, `textures/particle/concentration_orb_off`), já no RP desde `45748c2`. Sem isso, o apagado é o disco tingido de cinza.

## Reservados para o treino mental (CONTRATO §12, Engrenagem)
- Vida do chefe 0–10: `bar_red_on` (vermelho `#FF6B7A` da paleta du2) / `xp_off`.
- Tempo: `icons/clock`.
- Chefe derrotado: `icons/ach_defeat`.
- Ícone do modo: `icons/train_mental`.

## Treino mental: como distinguir a réplica do chefe de verdade (RP `cf7bc07`, dec. 14)

A réplica é o próprio chefe, com a tag `dbe:mental_replica`. **Nenhum arquivo de entidade muda.** A diferença visual vem só de partículas e de uma névoa que o **script** solta (Bússola, `scripts/training/mental.js`).

| Efeito | Id | Quando | Custo |
|---|---|---|---|
| Aura "mental" (brilhos roxo→azul translúcidos subindo em volta do corpo) | `dbe:mental_replica_aura` | **a cada 10 ticks** por réplica viva, na posição dela (nota (a) da Sentinela 2, partícula ajustada em `587a24c`). Usar o laço da sessão, sem `runInterval` novo | servidor: 2 `spawnParticle`/s por réplica. Cliente: ~11 partículas/s, no máximo 10 vivas por emissor. O emissor dura 0,6 s, então um chefe rápido deixa a aura no máximo ~0,5 s para trás |
| Entrada (anel de fagulhas que se expande e sobe) | `dbe:mental_enter` | uma vez, quando a réplica surge (no lugar dela) e, se quiser, no jogador | 40 partículas, uma vez |
| Saída (o corpo se desfaz em brilhos que sobem) | `dbe:mental_exit` | uma vez, **antes** do `remove()` da réplica (vitória, derrota, desistência, tempo, saída) | 36 partículas, uma vez |
| Névoa "dentro da mente" | `dbe:fog_mental` (roxo `#3A2A66`, começa a 15% da distância) | `fog @s push dbe:fog_mental dbe_mental` no jogador ao entrar; `fog @s remove dbe_mental` ao sair, **em todos os caminhos de fim** (inclusive morte, saída e troca de dimensão) | nenhum por tick |

**Variáveis Molang** (tamanho do chefe; sem elas, valem os padrões, bons para um humanoide):
```js
const vars = new MolangVariableMap();
vars.setFloat("variable.radius", r); // meia-largura + ~0,2. Padrão 0,7
vars.setFloat("variable.height", h); // altura do corpo em blocos. Padrão 2,0
dim.spawnParticle("dbe:mental_replica_aura", replica.location, vars);
```
- Sugestão: `r`/`h` numa tabela pequena por chefe em `progression_data.js` (ex.: Oozaru/Broly maiores) ou pela escala do chefe. Mandar o mesmo `vars` nos três efeitos.
- A aura sai dos pés (`location`) e sobe até ~`h`.

**Opcional, sem RP:**
- `player.camera.fade` com cor roxa escura (~0,5 s) na entrada e na saída reforça o "entrar na mente".
- O nome da réplica pode levar um prefixo "Réplica" no `nameTag` (texto, Bússola).

**Notas da Sentinela 2 (aprovação de `cf7bc07`), obrigatórias na 1.7.19:**
- **(a) Aura de chefe rápido:** o emissor fica parado no lugar onde nasceu. Por isso solta-se **a cada 10 ticks**, com o emissor de 0,6 s (`587a24c`). Com 1 por segundo, um chefe rápido deixaria a aura até 1 s para trás.
  - **Como soltar (nit da Sentinela 2):** sempre dentro do **laço da sessão** que já existe.
    - Laço com passo de 10 ticks: 1 disparo por volta.
    - Laço de 20 ticks: 2 disparos por volta, o segundo 10 ticks depois, num único `system.runTimeout(…, 10)` **da sessão** que solta para todas as réplicas dela. O ideal é baixar o passo do laço para 10.
    - **Nunca** um `runInterval` (nem um timer próprio) por réplica.
- **(b) Névoa e réplicas órfãs** (para quem saiu do mundo no meio da luta):
  - no `playerSpawn` com `initialSpawn` **e** no carregamento do script, rodar `fog @s remove dbe_mental` **sem condição** no jogador;
  - nos mesmos dois momentos, apagar as **réplicas órfãs** pela tag `dbe:mental_replica` (as que não têm sessão ativa), com `remove()`, sem loot e sem contar abate.

**Teste no jogo:** sair do mundo no meio da luta e voltar: sem névoa roxa e sem réplica parada no lugar. A réplica tem aura roxa e o chefe verdadeiro não; o anel aparece quando ela surge e ela se desfaz no fim; a névoa liga e desliga em todos os fins; ~10 partículas/s não pesam no celular.
