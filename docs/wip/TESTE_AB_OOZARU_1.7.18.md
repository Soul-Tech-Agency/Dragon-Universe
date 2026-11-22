# 1.7.18: teste A/B do Oozaru nas prévias de UI (decisão 31)

Item 9 do roteiro da 1.7.18. Nada aqui foi testado no jogo pela equipe.
Commits: parte 1 (RP, Aquarela) `28fb62b`; parte 2 (UI, Engrenagem) `5ba9258`. **Os dois entram e saem juntos.**

## O que muda
- **Parte 1 (Aquarela, RP):**
  - Novo `animations/player/oozaru_ui.animation.json` (`animation.player.oozaru_ui_scale`, `root` em escala 0,33).
  - `entity/player.entity.json` toca essa animação com `v.is_oozaru && v.is_paperdoll`.
  - Sem `q.is_in_ui`, para o Oozaru não encolher no mundo com menu aberto.
- **Parte 2 (Engrenagem, `ui/**`), obrigatória no mesmo build:**
  - Tirar o ramo "zaru" de 22x22 e deixar uma prévia única nas telas que têm o ramo hoje:
    - `ui/menus/statistics_form.json` (`oozaru_renderer`);
    - `ui/du2/du2_statistics.json` (`oozaru@statistics_form.player_preview`, nos dois layouts);
    - `ui/du2/du2_customization.json` (os dois `oozaru@…`, que cobrem a customização e o barbeiro).
  - Sem a parte 2, essas prévias encolhem duas vezes (~1/9).

## Builds
- **A (controle):** 1.7.18 **sem** o commit da parte 1 e **sem** a parte 2 (comportamento da 1.7.17).
- **B (teste):** 1.7.18 com as partes 1 e 2.
- Mesmo mundo (cópia), mesmo personagem Saiyajin com rabo, nível suficiente para Oozaru e Golden Oozaru.

## Roteiro (fazer em A e em B; marcar Y/N/? e tirar print de cada linha)
Formas: **base**, **Oozaru**, **Golden Oozaru**.

| # | Tela | Esperado em B | A (anotar) | B |
|---|---|---|---|---|
| 1 | Inventário (E), prévia à esquerda | Oozaru/Golden **inteiro dentro da caixa preta**, sem cobrir armaduras e slots | vaza (conhecido) | |
| 2 | Estatísticas (menu DU) | corpo inteiro, do tamanho de um jogador comum | prévia 22x22 | |
| 3 | Customização / barbeiro | corpo inteiro, nada cortado | prévia 22x22 | |
| 4 | Mundo, terceira pessoa (F5), **com o inventário aberto** | o Oozaru **não** encolhe no mundo | normal | |
| 5 | Forma base e SSJ nas telas 1–3 | iguais ao build A | — | |
| 6 | Sair do Oozaru com o inventário aberto e reabrir | prévia volta ao tamanho normal | — | |
| 7 | Estatísticas e customização (prévia 70x70): **girar a prévia** (arrastar/olhar com o cursor) em Oozaru e Golden, vendo de lado e de trás | a **cauda inteira** dentro da caixa. A ponta (`tail4`, de z=41 a z=53 no modelo, ~14–17,5 depois da escala 0,33) pode sair da caixa de 70x70 quando a prévia gira | — | |

## Critério de volta atrás (decisão 31)
- **Se em B o Oozaru SUMIR de qualquer prévia (2 ou 3), como na 1.7.14:** reverter **as duas partes juntas**: `git revert 28fb62b 5ba9258` (parte 1 RP da Aquarela + parte 2 UI da Engrenagem). Isso volta à 1.7.17 (prévia 22x22 nas telas do addon). **Nunca reverter só a parte 1**: com a prévia única de 70x70 da parte 2, o Oozaru volta gigante (~3x) e vaza também das Estatísticas, da customização e do barbeiro. O vazamento no inventário vanilla vira limitação conhecida.
- **Se em B o corpo aparecer desmontado** (pernas, tronco e cabeça sobrepostos): acrescentar ao `animate` do `player.entity.json` a linha `{ "oozaru_setup": "v.is_oozaru && !v.isLive" }` e testar de novo.
- **Se o Oozaru encolher no mundo (linha 4):** a condição `v.is_paperdoll` vale também fora da UI. Reverter **as duas partes juntas** (`git revert 28fb62b 5ba9258`) e anotar.
- **Se só a linha 1 falhar** (inventário ainda vaza, mas menor): ajustar a escala (0,33 → 0,25) e testar de novo.
- **Se só a linha 7 falhar** (ponta da cauda cortada ao girar): é aceitável. Para corrigir: escala 0,33 → 0,28 (Aquarela) ou caixa um pouco maior (Engrenagem). Anotar com print de lado.

## Enviar
Prints de cada linha em A e em B, a versão exata do Minecraft, a plataforma (PC/celular) e o Content Log.
