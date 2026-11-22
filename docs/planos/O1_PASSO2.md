# O1, passo 2: unificar as duas cópias do vanilla-data

Autor: Bússola. Data: 2026-11-22. Base: `agent/viagens` depois do O1 passo 1 (`671f2ab`), com as cópias em `scripts/vendor/vanilla_data_a.js` e `vanilla_data_b.js`.
Trabalho só de leitura: nada foi alterado. A unificação espera a decisão do usuário.

## 1. O que difere entre A e B

As duas cópias foram carregadas como módulos e comparadas enum a enum: chaves, valores e ordem.

| Cópia A | Cópia B | Conteúdo | Chaves A / B | Diferença |
|---|---|---|---:|---|
| `aT` | `bZ` | biomas | 87 / 87 | nenhuma |
| `aU` | `c0` | blocos | 1307 / 1308 | **B tem a mais `GoldenDandelion = "minecraft:golden_dandelion"`** (`vanilla_data_b.js:641`) |
| `aV` | `c1` | presets de câmera | 7 / 7 | nenhuma |
| `aW` | `c2` | cooldowns de item | 6 / 6 | nenhuma |
| `aX` | `c3` | dimensões | 3 / 3 | nenhuma |
| `aY` | `c4` | efeitos | 37 / 37 | nenhuma |
| `aZ` | `c5` | encantamentos | 42 / 42 | nenhuma |
| `b0` | `c6` | entidades | 127 / 127 | nenhuma |
| `b1` | `c7` | estruturas | 17 / 17 | nenhuma |
| `b2` | `c8` | itens | 1486 / 1487 | **B tem a mais `GoldenDandelion = "minecraft:golden_dandelion"`** (`vanilla_data_b.js:2221`) |
| `b3` | `c9` | causas de consumo | 3 / 3 | nenhuma |
| `b4` | `cb` | poções | 47 / 47 | nenhuma |

- Não há nenhum valor diferente numa mesma chave, e as chaves em comum estão na mesma ordem.
- **B contém A inteira**: B = A + `GoldenDandelion` em blocos e em itens.
- Ninguém usa o `GoldenDandelion` (§2).

## 2. Quem usa cada cópia

Busca por todos os 24 nomes no `index.js` (fora das linhas de import) e nos outros scripts.

| Nome | Cópia | Uso | Onde |
|---|---|---|---|
| `aX` (dimensões) | A | `aX.Nether`, `aX.Overworld`, `aX.TheEnd` em `world.getDimension(...)` | `index.js:524-526` (classe `b5`, getter `dimensions`) |
| `c1` (câmera) | B | `c1.ThirdPerson`, `c1.FollowOrbit`, `c1.Free` em `camera.setCamera(...)` | `index.js:3781`, `4422`, `7761`, `14012`, `14013` |
| `c4` (efeitos) | B | `c4.Invisibility` em `addEffect(...)` | `index.js:8668` (absorção) |
| os outros 21 | — | **nenhum uso** | — |

- Nenhum outro arquivo de `scripts/` usa esses nomes.
- Nenhum enum é percorrido (`Object.keys`/`values`/`entries`, `for…in`): todos os usos são acesso direto a uma chave, e todas as chaves usadas existem nas duas cópias com o mesmo valor.
- O `GoldenDandelion`, a única diferença, não é usado.

## 3. Proposta de unificação

### Passo 2a, sem perder dados (recomendado)

1. Ficar só com a cópia **B** (a mais completa), renomeada para `scripts/vendor/vanilla_data.js`, com conteúdo e nomes iguais (`bZ…cb`).
2. Apagar `vendor/vanilla_data_a.js`.
3. No `index.js`, trocar **só a linha de import da cópia A** por apelidos para a B, sem mexer em nenhuma outra linha:
   ```js
   import { bZ as aT, c0 as aU, c1 as aV, c2 as aW, c3 as aX, c4 as aY, c5 as aZ, c6 as b0, c7 as b1, c8 as b2, c9 as b3, cb as b4 } from "./vendor/vanilla_data.js"; // vanilla-data (O1 passo 2: cópia única)
   import { bZ, c0, c1, c2, c3, c4, c5, c6, c7, c8, c9, cb } from "./vendor/vanilla_data.js";
   ```
4. Atualizar o `contents.json`: sai `vanilla_data_a.js` e `vanilla_data_b.js`, entra `vanilla_data.js`.

- **Ganho:** −3.204 linhas e −173 KB.
- **Risco:** praticamente nulo. `aX.Nether/Overworld/TheEnd` têm os mesmos valores em `c3`.

### Passo 2b, opcional: deixar só o que é usado

- Manter em `vendor/vanilla_data.js` apenas os 3 enums usados: `c3` (dimensões, 3 chaves), `c1` (câmera, 7) e `c4` (efeitos, 37). Seriam cerca de 60 linhas, contra ~3.200.
- **Ganho:** mais cerca de −3.140 linhas e −170 KB, sobre o 2a.
- **Custo:**
  - código novo que precisar de um id vanilla terá de escrever a string `"minecraft:…"` ou trazer o enum de volta do pacote `@minecraft/vanilla-data`;
  - os 21 nomes que sobram somem do núcleo, então o import vira só `c3 as aX, c1, c4`.

## 4. Prova

| Item | Como provar |
|---|---|
| Comportamento | `node tools/compare-scripts.mjs <commit anterior>` → **IDÊNTICO**. Os enums são dados puros, não chamam o jogo e não aparecem no registro do stub; a prova cobre carga, inscrições e callbacks. Antes de commitar, o commit anterior é `HEAD`; depois, `<commit>~1`. O compare agora falha se um lado não carregar, o que pega um import ou apelido errado |
| Valores usados | script de conferência (só leitura, fora do repositório): carregar a versão anterior e a nova; para cada uso de §2 (`aX.Nether`, `aX.Overworld`, `aX.TheEnd`, `c1.ThirdPerson`, `c1.FollowOrbit`, `c1.Free`, `c4.Invisibility`), conferir que o valor é idêntico. No 2a, conferir também que cada enum apelidado tem todas as chaves do antigo com o mesmo valor (B ⊇ A, §1) |
| Divisão | `node tools/core-split-report.mjs --only-problems` → 0 problemas |
| Validação | `node tools/check-syntax.mjs` OK; `node tools/validate.mjs` = 6 (check-refs confere o `contents.json`) |
| Tamanho | `node tools/measure-scripts.mjs` antes e depois (linhas e KB de `vendor/`) |
| No jogo | checklist curto: absorção do Majin (fica invisível: `c4`); transformações e Instinto Superior com mudança de câmera (`c1`); viagens com troca de dimensão pelo núcleo (`b5.dimensions`: `aX`) |

## 5. Decisões para o usuário

1. **Unificar** (passo 2a, cópia única B, sem perder dados)? Recomendado.
2. **Enxugar** (passo 2b, só os 3 enums usados)? Ganha mais tamanho, mas tira do núcleo a lista pronta de ids vanilla.
