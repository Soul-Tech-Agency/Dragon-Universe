# O4.0: ligação tardia antes de dividir o núcleo (detalhe para implementar, 1.7.19)

Autor: Arquiteto. Data: 2026-11-22. Base: `agent/viagens` em `b8a0144` (O2 fechado). O `index.js` tem 14.292 linhas e 128 segmentos, e os números de linha abaixo valem para essa versão.
Trabalho só de leitura: nada foi implementado. **Antes de começar, rodar a ferramenta de novo sobre a base do momento**: o item 12 e o O3-12 vão mexer no `index.js` e deslocar as linhas. O comando está no §5.
Contexto: `ARQUITETURA_OTIMIZACAO.md` §8, item 2 (por que o O4 não é só mover) e item 4 (regras do O4.0/O4.1).
Regras:
- **só o `index.js` (Bússola)**, mais 2 arquivos novos em `core/`;
- nenhuma mudança de lógica: cada uso `X` vira `late.X`, e cada declaração ganha o getter;
- prova: `compare-scripts` **na ordem** IDÊNTICO, e o `--plan` mais fino com **0 ligações tardias pendentes e 0 problemas**.

---

## 1. Correção do número: são 8 nomes e 112 usos, não ~33

O "~33" do roteiro (`PROXIMAS_FEATURES.md`) e do `ARQUITETURA_OTIMIZACAO.md` §8.4 valia para **um recorte só** (`1-40 / 41-80`: 3 nomes, `i0`, `i3` e `qM`, 32 usos). Como o O4 vai cortar em mais pontos, o O4.0 deve preparar **qualquer recorte contíguo**. Por isso rodei o plano **mais fino possível**: cada um dos 127 segmentos num módulo próprio. Qualquer recorte real em faixas contíguas é um agrupamento desse plano e precisa de um subconjunto destas ligações.

```
node tools/core-split-report.mjs <index.js> --plan=<plano fino>
1. Só com imports:          12 problemas (6 não avaliados, 6 trocas de ordem de efeitos)
2. Ligação tardia:          112 referências a 8 nomes
3. Com a ligação tardia:    0 problemas, ordem ES = ordem de hoje (s001 → … → s127 → index.js)
```

Conclusão: **com esses 8 nomes resolvidos, qualquer divisão do núcleo em faixas contíguas fica sem problema de ordem.** A ferramenta não segue chamadas de método (`X.m()`) feitas na carga, então a prova final continua sendo o `compare-scripts` na ordem (§5).

## 2. Os 8 nomes

| Nome | O que é | Declarado em | Segmento | Usos para frente (segmento: linhas) | Total |
|---|---|---|---|---|---:|
| `duTravel` | `async function`: viagem segura (`travel_safety`) | `index.js:17` | **#0** (fica no `index.js`) | #5: 1639, 1640, 1667 · #6: 1790 · #17: 3283, 3296 · #87: 11666 · #98: 12189, 12210 | 9 |
| `cI` | classe da skill de movimento rápido (`extends cH`) | `index.js:1549` | #4 | #3: 1309 (`sG instanceof cI`) | 1 |
| `dC` | `new dB()`: avaliador de requisitos (`testAll`, `listDescription`) | `index.js:2189` | #11 | #4: 1486, 1487 | 2 |
| `hN` | classe do jogador (`extends fV`) | `index.js:7364` | #39 | #4: 1486, 1491, 1515, 1521, 1585, 1613 · #13: 2358 · #14: 2436, 2461 · #15: 2494, 2590, 2677 · #16: 2887 · #17: 2943, 3391 · #18: 3503, 3590, 3607, 3613, 3676, 3679 · #19: 3789 · #20: 3927, 3935, 3945, 3977, 4009 · #21: 4037, 4085, 4100, 4119, 4148 · #22: 4203, 4215 · #25: 4398, 4416, 4427, 4431, 4536, 4568, 4612, 4741, 4751, 4812, 4835 · #35: 6870, 6876, 6889, 6905, 6924, 6957 · #37: 7063 | 52 |
| `hO` | `function hO(entity)`: o wrapper do jogador (ou `undefined`) | `index.js:7789` | #39 | #15: 2679 · #16: 2748, 2799, 2811, 2848 · #17: 2989, 3055, 3282, 3295 · #20: 3996, 4001 · #25: 4640 · #26: 5237 · #29: 5626 · #34: 6420 · #35: 6970 | 16 |
| `i0` | `new Map()`: wrappers por `entity.id` | `index.js:8085` | #41 | #31: 5950, 5952 · #34: 6431, 6688 · #39: 7452, 7563, 7584, 7645, 7657, 7757, 7761 | 11 |
| `i3` | `new i2()`: gerenciador de entidades (`getDBEEntity`…) | `index.js:8192` | #41 | #4: 1613 · #6: 1683, 1689 · #15: 2684 · #17: 3387, 3440 · #19: 3799 · #20: 3928 · #25: 4851, 4877 · #34: 6398 · #35: 6853 · #37: 7061 · #39: 7433, 7503, 7541, 7790, 7826 · #40: 7855, 7905 | 20 |
| `qM` | classe de recompensa (`extends gA`) | `index.js:12977` | #108 | #39: 7701 (`new qM({ type: "item", … })`) | 1 |

Todos são `var` ou `function`, sem `let`/`const`/`class` de topo, então não há TDZ. Ler `late.X` antes de o getter existir dá `undefined`, o mesmo que ler `X` (um `var`) antes da atribuição hoje. Todos os 112 usos são **em tempo de chamada**, dentro de funções e métodos. A ferramenta já confere isso: ela só lista como LATE os usos em que a ligação tardia resolve.

## 3. Mecanismo

**`scripts/core/late.js` (novo, sem dependências e sem efeitos):**
```js
// Ligação tardia (O4.0): nomes do núcleo usados por código que vem ANTES da declaração no bundle. Quem declara
// registra um getter logo depois da declaração; quem usa lê late.<nome> na hora de chamar. Sem import em ciclo.
export const late = {};
export function bindLate(name, get) {
  Object.defineProperty(late, name, { get, enumerable: true, configurable: false });
}
```
- **Getter, não cópia** (`ARQUITETURA_OTIMIZACAO.md` §8.4): hoje nenhum desses nomes é reatribuído, mas uma cópia ficaria velha se um deles passasse a ser.
- `configurable: false`: registrar o mesmo nome duas vezes lança erro, o que pega getter duplicado na carga.

**Na declaração** (no segmento que declara, logo depois da instrução inteira, que pode ser uma cadeia `var a = …, hN = class {…}, b = …;`):
```js
bindLate("hN", () => hN);
```

**No uso:** `sG instanceof hN` → `sG instanceof late.hN`; `i3.getDBEEntity(x)` → `late.i3.getDBEEntity(x)`; `new qM(…)` → `new late.qM(…)`.
- **Só nos 112 usos da tabela.** Os usos no próprio segmento da declaração, ou depois dele, continuam diretos, como `hN` dentro do #39 e `i3` do #41 em diante.
- Não renomear nada e não juntar com outra mudança.

**`duTravel`: mover em vez de usar `late`.** A regra do O4 é que nenhum módulo novo importe o `index.js`, e o `duTravel` mora no segmento 0, que é o único que fica nele. Mas ele só depende dos imports de `travel_safety.js`. Então:
- mover a função **como está** para `scripts/core/du_travel.js` (com os imports de `travel_safety.js` de que ela precisa) e importá-la no `index.js`. Os 9 usos não mudam;
- o módulo novo não tem efeito na carga (só declara a função), então a ordem de efeitos não muda;
- com isso sobram **7 nomes e 103 usos** para o `late`.

**Import no `index.js` (segmento 0):** logo depois do `import "./core/perf.js";`, que continua sendo o primeiro:
```js
import { late, bindLate } from "./core/late.js";
import { duTravel } from "./core/du_travel.js";
```

## 4. Commits (Bússola, só o `index.js` mais os 2 arquivos novos)

| # | Commit | O quê | Usos |
|---|---|---|---:|
| O4.0-1 | `core/late.js` + `core/du_travel.js` + imports | criar os 2 arquivos, mover o `duTravel`, acrescentar os 2 arquivos no `contents.json` (**CRLF**, editar sem converter e conferir com `git diff --stat`) | 0 |
| O4.0-2 | `i0`, `i3`, `qM` | os 3 nomes do recorte `1-40 / 41-80` já simulado | 32 |
| O4.0-3 | `hN`, `hO` | o jogador | 68 |
| O4.0-4 | `cI`, `dC` | os 2 vizinhos próximos (#3→#4, #4→#11) | 3 |

Cada commit é independente e pequeno, e um erro de digitação aparece no compare do próprio commit. A ordem 2 → 3 → 4 não importa, e dá para juntar o 2–4 num só se a revisão preferir. Depois do O4.0-4, o `--plan` fino tem que dizer **"Ligação tardia necessária: 0"**.

## 5. Prova

| Item | Como provar |
|---|---|
| Comportamento | `node tools/compare-scripts.mjs <commit anterior>` → **IDÊNTICO, na ordem** (sem `--unordered` e sem `--ignore`). O `late` é JS puro e não chama o jogo. O stub executa a carga inteira e os callbacks, então um `late.X` lido na carga antes do getter (o risco das chamadas de método que a ferramenta não segue) aparece como erro no log |
| Ligação completa | `node tools/core-split-report.mjs --plan=<plano fino>`, onde o plano fino é `{ "core/s001.js": ["1"], …, "core/s127.js": ["127"] }`, gerado por script (fora do repositório ou em `tools/`): **seção 2 = 0 referências; seção 1 (só imports) = 0 problemas.** Depois de cada commit intermediário, a seção 2 diminui exatamente os usos do commit |
| Sem regressão no recorte | `node tools/core-split-report.mjs --only-problems` = 0, como hoje |
| Validação | `check-syntax` OK; `validate` = 6 (o `check-refs` confere o `contents.json` com os 2 arquivos novos) |
| Custo | o getter custa uma chamada por leitura. O hub (`index.js:9939`, depois do #39) continua usando `hN` direto e não muda. Os caminhos quentes afetados ficam nos segmentos #4–#37: stats (#13, #14, por exemplo o `flying_speed` em 2358), skills (#18, 3503–3679) e combate (#20–#25). **Sonda** `dbe:perf` antes e depois do O4.0-3: ms/tick p95 do hub e do intervalo de skills, com 1 jogador e numa vila de Vegeta. Esperado: diferença dentro do ruído. Se não ficar, a saída é ler `late.hN` uma vez por chamada numa variável local nos 2 ou 3 métodos quentes, num commit separado |
| No jogo | checklist curto (§6) |

## 6. Roteiro no jogo (curto)

Os nomes tocados são o jogador, os wrappers, os requisitos, a recompensa, a skill de movimento rápido e a viagem:
1. Entrar num mundo existente e num mundo novo (criação de personagem); sair e entrar de novo com 2 jogadores.
2. Combate corpo a corpo e com ki contra NPC (`i3`, `hN` no combate); morrer e ir ao Outro Mundo.
3. Transformar e destransformar; abrir os menus de status, skills, missões e conquistas (`hO` nos menus).
4. Comprar uma skill com requisito que falta (mensagem de requisitos: `dC`) e uma que cumpre.
5. Usar o movimento rápido (`cI`: teleporte até o alvo).
6. Concluir a missão que dá o Power Pole (`qM`, `index.js:7701`).
7. Viajar pelo Star Navigator, voltar à Terra e usar a viagem do torneio (`duTravel` nos #5, #6, #17, #87 e #98).
8. Content Log sem erro novo em 10 minutos.

## 7. Depois do O4.0

- O **O4.1** (`core/`) e os seguintes viram **só mover**: faixas contíguas na ordem do bundle (`core/01_….js`…). Cada módulo novo importa `late` e chama `bindLate` para os nomes que declara (o `bindLate` vai junto com a declaração, porque está no mesmo segmento).
- Recorte proposto para a revisão do O4.1: simular com `--plan` o recorte real antes de mover. Pelo §1, ele não pode ter problema; se tiver, é um caso que a ferramenta não cobre e precisa ser olhado à mão.
- A tabela do §2 vira obsoleta depois do O4.0-4. Código novo que use um nome de um segmento posterior deve usar `late` desde o começo: vale incluir essa regra no Dragon Universe Contract.

## 8. Decisões

Nenhuma decisão do usuário: é preparação mecânica, sem mudança de comportamento.
1. **Fechada (coordenador, 2026-11-22):** o `duTravel` é **movido** para `core/du_travel.js`, e os 9 usos não mudam.
