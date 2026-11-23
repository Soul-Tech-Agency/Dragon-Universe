# Desempenho da UI (telas du2 e HUD) em celular fraco: auditoria da Engrenagem (2026-11-22)

Escopo: `Dragon Universe_rp/ui/**`. Foram medidos:
- bindings por controle;
- comparações de texto com `#hud_title_text_string`, `#title_text`, `#form_text` e `#form_button_text`;
- factories, `clips_children` e `live_player_renderer`;
- o HUD sempre ligado.

A medição é estática: um script conta os bindings nos JSON. **Nada foi medido no jogo.** A conferência de FPS proposta está no fim.

## Como o custo aparece

- Um binding `view` é recalculado a cada quadro. Com `#hud_title_text_string` (o título invisível que carrega os tokens do HUD), cada `(#hud_title_text_string - 'x') = #hud_title_text_string` é uma busca de texto no título inteiro.
  - Esse título junta todos os tokens: vida, ki, estamina, técnicas, status e treino. Fica com algumas centenas de caracteres.
- **O HUD fica ligado o tempo todo.** Por isso é onde mais pesa.
- As telas du2 só custam enquanto estão abertas. A tela fechada é destruída, e os renderers somem com ela.
- Os layouts PC/celular usam `ignored` (`$pocket_edition`). O layout da outra plataforma nem é criado.
- **Ponto em aberto:** não se sabe se o jogo deixa de recalcular os bindings dos filhos de um painel invisível. Os itens 1 e 2 ganham muito se ele deixa. Se não deixa, o item 1 custa um pouco a mais (ver o item). O visual não muda em nenhum dos casos.

## Achados, por ganho estimado (maior primeiro) e risco

| # | Achado | Custo antes (por quadro) | Ação | Risco | Commit |
|---|---|---|---|---|---|
| 1 | **Barras do HUD sempre ligado** (`common/common_bar.json`). Cada barra tem 51 imagens, uma por valor de 0 a 50, cada uma com busca de texto no título. São 11 barras: vida, estamina, 7 cores de ki, carga e concentração | **~560 buscas** (11 × 51), sempre | 51 imagens agrupadas pela dezena, em 10 grupos com 1 busca cada. Uma imagem só aparecia se o grupo dela também aparecesse, então o conjunto visível é o mesmo | Visual: nenhum. Ganho: com o jogo pulando filhos invisíveis, ~21 buscas por barra visível e 1 nas cores de ki escondidas (**~560 → ~60**). Sem isso, +10 por barra (~670) | `0c122ef` |
| 2 | **Barras de segmentos do painel de treino** (ritmo, estamina, vida do chefe). Cada segmento aceso testava "k OU … OU 10" | 55 buscas por barra, só com o painel visível (em treino) | Um painel por nível (n segmentos acesos) com 1 busca cada; os apagados ficam fixos | Nenhum (mesmo desenho) | `3ed32fd` |
| 3 | **Abas** (`du2_common`). Cada imagem e cada rótulo de cada face (normal, hover, pressionada) tinha um binding de `#title_text` | 192 por tela no PC, 96 no celular, com a tela aberta | Dois grupos por face (apagada e acesa), 1 binding cada | Nenhum | `8137eea` |
| 4 | **Itens de lista** (Missões, Conquistas, Treino, Transformações, Guia, Habilidades, réplicas): o conteúdo (rótulo, ícones tingidos, ícone por chave, "+") estava repetido nas 3 faces do botão | Bindings por item (uma instância): Missões **106 → 38**, réplicas **70 → 26** (~2700 → ~1000 com 39 chefes), Habilidades 43 → 26, Treino 28 → 12 | As faces ficam só com os fundos (o da linha e o do "+"). O conteúdo vai uma vez numa camada por cima (`layer` 1), nas mesmas posições | **Médio:** muda a ordem de camadas. Commit separado, fácil de reverter (A/B abaixo) | `6bb3656` |
| 5 | **Barra de XP das Estatísticas**: o mesmo "OU" por segmento, no slot 26 | 55 comparações com a tela aberta | Painel por nível, como no item 2 | Nenhum | `c127b9a` |
| 6 | **Roteamento do `server_form`**: cada tela du2 tem um binding de `#title_text` (24 no total) | 24 comparações por quadro com qualquer formulário aberto | **Analisado e não feito (decisão de 2026-11-22).** `binding_condition: "once"` calcula a rota uma vez, quando a tela é criada. Ganho pequeno: 24 comparações, só com o menu aberto, contra os ~2000 dos itens 1–4 | **Alto:** se o título ainda não chegou quando a tela é criada, ou se o jogo reaproveita a tela no formulário seguinte (o script reabre formulários em sequência na Customização, no Barbeiro e nas Estatísticas), **todos** os menus ficam vazios ou na tela errada. Só vale reconsiderar com um teste que prove os dois pontos, por exemplo um build de teste com uma única rota em `once` (a da Ajuda) | — |
| 7 | **Slots ocultos** (`""`) continuam com o binding de visibilidade | 1–2 por slot (Estatísticas ~300, Raças ~330, Customização ~330), só com a tela aberta | Nada a fazer sem script: é o mecanismo do contrato | — | — |
| 8 | **`clips_children`**: 82 nas Estatísticas, 65 na Customização, 57 nas Raças | Um recorte por controle visível. É barato, mas soma com muitos rótulos | Manter: é o que impede o texto de vazar (regra do BRIEF). Os que estão em ramos invisíveis não desenham | — | — |
| 9 | **`live_player_renderer`** | 1 por tela aberta (Estatísticas, Raças, Customização, Barbeiro). A outra plataforma é `ignored` | Nada a fazer: morre com a tela. O renderer do inventário do HUD (`hud_player_renderer`) já está desligado. Os layouts antigos (`menus/*`) não têm rota: são lidos no carregamento, mas não instanciados | — | — |
| 10 | **Layouts antigos ainda registrados** (`menus/*.json`, ~100 KB) | Só no carregamento do pacote (leitura e memória), nada por quadro | Remover no item 13 (depois do teste da 1.7.17), como já decidido | Baixo, mas depende do teste | — |
| 11 | **Painel de treino com o HUD sem treino** | 1 busca (`train_hud:`) na raiz. Os filhos só contam se o jogo calcular invisíveis | Já está fechado na raiz | — | — |
| 12 | **Tamanho dos arquivos du2** (~1 MB no total, 1140 controles nas Estatísticas, 956 na Customização) | Carregamento e memória ao abrir a tela | O gerador já reaproveita subárvores iguais (`hoist`). Pode-se reduzir mais juntando as variantes PC/celular onde só muda a medida | Baixo; sem pressa | — |

## Commits desta auditoria (`agent/menus`)

| Commit | Item |
|---|---|
| `3ed32fd` | 2: segmentos do HUD de treino por nível |
| `8137eea` | 3: abas com um binding por grupo |
| `0c122ef` | 1: barras do HUD agrupadas pela dezena (CRLF preservado; arquivo editado à mão e conferido por script) |
| `c127b9a` | 5: barra de XP das Estatísticas por nível |
| `6bb3656` | 4: conteúdo dos itens de lista uma vez só, por cima das faces (**risco médio, reverter sozinho se o A/B falhar**) |

Todos:
- não mudam o visual;
- o JSON das telas du2 é exatamente o que o gerador (`tools/ui/gen_du2_ui.py`) produz;
- check-syntax passou;
- o validate dá 6 com as texturas do `agent/oozaru` presentes.

## Conferência no jogo (celular fraco)

1. **A/B de FPS no HUD.** Mesmo mundo, parado, olhando para o mesmo lugar, com o painel de treino desligado.
   - A = 1.7.17 (antes do item 1). B = com `0c122ef`.
   - Medir com o contador de quadros do Android (Opções do desenvolvedor → "Perfil de renderização da GPU" ou "Mostrar FPS", conforme o aparelho).
   - Se B for **pior**, o jogo calcula os filhos invisíveis. Nesse caso, reverter só o `0c122ef` e avisar a Engrenagem. Os itens 2, 3 e 5 não pioram em nenhum dos casos.
2. **Visual das barras.** Vida, estamina, ki (trocar de cor com transformação) e carga em 0, 1, 9, 10, 25, 49 e 50. Devem ficar iguais à 1.7.17.
3. **Abas.** A aba acesa certa em cada tela (Treino acesa também na lista de réplicas). Passar o dedo ou o mouse e apertar: os mesmos fundos de antes.
4. **A/B do item 4 (itens de lista)**, no PC e no celular. Build A = sem o commit do item 4 (`git revert` só dele); build B = com ele.
   - Em Missões, Conquistas, Treino, Transformações, Guia, Habilidades e na lista de réplicas, comparar A e B lado a lado:
     - texto e ícones no mesmo lugar;
     - o fundo muda ao passar o mouse e ao apertar, e o texto e os ícones continuam visíveis por cima;
     - o "+" das Habilidades com o fundo dourado no hover; no máximo, o ícone dourado no lugar do "+";
     - toque e clique na linha inteira funcionam (inclusive sobre o texto).
   - FPS: abrir a lista de réplicas (ou a de Missões com muitas missões), rolar até o fim e voltar. Medir como no item 1. B deve ser igual ou melhor.
   - Se algo falhar (texto por baixo do fundo, toque que não pega sobre o texto), reverter só o commit do item 4.
5. **Barras de segmentos** (XP nas Estatísticas; ritmo e estamina quando o script dos treinos existir): de 0 a 10, os n primeiros acesos.

## Próximos passos sugeridos

- Item 6 fica parado: risco alto para ganho pequeno. Se um dia for testado, começar por uma rota só (Ajuda), num build de teste.
- **Melhoria no script, com a Bússola** (não é da Engrenagem): o `hv` monta o título juntando tokens **sem separador**. Isso obriga a usar `;` nos tokens novos, e as barras antigas usam "contém prefixo+N". Com um terminador em todos os tokens, as 51 imagens da barra poderiam ser trocadas por 2 níveis (dezena e unidade, ~16 buscas no total), sem depender do comportamento com invisíveis. Exige mudar o script e o JSON juntos.
