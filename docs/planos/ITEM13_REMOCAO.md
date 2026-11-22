# Item 13: remoção dos layouts e das texturas antigos (Engrenagem, 2026-11-22)

**Só entra depois que o teste da 1.7.17 no jogo passar** (restyle aprovado). Até lá, os arquivos ficam como reserva.

- Branch local `agent/menus-item13`, commit **`1f28be7`**, criado a partir do topo de `agent/menus` (`6bb3656`). O `agent/menus` não mudou.
- O commit foi montado com um índice temporário, sem checkout.
- Para integrar, depois do teste: `git merge agent/menus-item13`, ou `git cherry-pick 1f28be7` se o `agent/menus` andar.
- O commit só apaga arquivos e tira linhas do `_ui_defs.json` e do `contents.json`. Se houver conflito, refaça a lista a partir desta página.

## O que sai (57 arquivos)

### Layouts JSON (12), em `Dragon Universe_rp/ui/menus/`

| Arquivo | Namespace | Substituído por |
|---|---|---|
| `achievement_list_form.json` | `achievement_list_form` | `du2/du2_achievements.json` |
| `customization_form.json` | `customization_form` | `du2/du2_customization.json` |
| `menu_form.json` | `menu_form` (moldura antiga com abas e o `du_icon_overlay`) | `du2/du2_common.json` |
| `news_form.json` | `news_form` | `du2/du2_news.json` |
| `quest_form.json` | `quest_form` | `du2/du2_detail.json` |
| `quest_list_form.json` | `quest_list_form` | `du2/du2_quests.json` |
| `select_hair_form.json` | `select_hair_form` | `du2/du2_customization.json` (barbeiro) |
| `select_race_form.json` | `select_race_form` | `du2/du2_select_race.json` |
| `skills_form.json` | `skills_form` | `du2/du2_skills.json` |
| `statistics_form.json` | `statistics_form` | `du2/du2_statistics.json` e `du2_statistics_view.json` |
| `training_form.json` | `training_form` | `du2/du2_training.json` |
| `transformations_form.json` | `transformations_form` | `du2/du2_transformations.json` |

### Texturas (45)

- `textures/ui/buttons/<nome>_button.png`, `<nome>_button.json` (nineslice), `<nome>_button_hover.png` e `<nome>_button_hover.json`, para os 11 nomes:
  - `achievements`, `help`, `news`, `next`, `previous`, `quest`, `quests`, `skills`, `statistics`, `training`, `up`;
  - são 44 arquivos.
- `textures/ui/images/du_icon.png`.

Também saem as 12 linhas `ui/menus/<layout>.json` do `ui/_ui_defs.json` e as 57 entradas do `contents.json`. Os dois continuam CRLF.

## Prova de que nada usa esses arquivos

Feita por script sobre o `agent/menus` em `6bb3656`:
1. **Rota e referência de JSON.** Para cada namespace antigo, procurei `@<namespace>.` em todos os JSON do RP, menos o próprio arquivo e o `_ui_defs.json`.
   - Os 9 primeiros (`achievement_list_form`, `news_form`, `quest_form`, `quest_list_form`, `select_hair_form`, `select_race_form`, `skills_form`, `training_form`, `transformations_form`) não têm **nenhuma** referência. O `server_form.json` só roteia para telas `du2_*` e para as telas vivas.
   - `customization_form` só era citado por `select_hair_form`; `statistics_form` só por `skills_form`; `menu_form` só pelos 7 layouts antigos com abas. Todos estão na lista de remoção.
2. **Nome solto em qualquer arquivo** (BP, RP, `tools/`). Fora o próprio arquivo, o `_ui_defs.json` e o `contents.json`, o nome só aparece:
   - como **nome de controle** nas telas du2 e no `server_form` (`"skills_form@du2_skills…"`), que não é referência ao arquivo antigo;
   - num **comentário** do `index.js` (l. ~16935, "select_hair_form.json"), sem efeito. A limpeza fica com a Bússola, quando ela tirar o marcador `§r§o§r`.
3. **Texturas.**
   - Listei todos os caminhos `textures/…` citados pelos 12 layouts.
   - Para cada um, procurei o caminho em todos os `.json`, `.js`, `.mcfunction`, `.material` e `.lang` do BP e do RP, menos os layouts removidos e o `contents.json`.
   - Os 23 caminhos da lista (44 + 1 arquivos com os `.json` de nineslice) não aparecem em nenhum outro lugar.
   - Também não há caminho montado por concatenação (`'textures/ui/buttons/' + …`), nem nos layouts nem no script.
4. **Validação da árvore resultante** (extraída numa pasta temporária, com os mesmos `node_modules`):
   - check-syntax OK;
   - validate **15** sozinho e **6** com as texturas do `agent/oozaru`, igual ao `agent/menus` antes da remoção. Nenhum erro novo.

## O que fica (citado por telas vivas)

| Arquivo | Quem usa |
|---|---|
| `ui/custom_server_form.json` | alinhamento, NPCs (diálogo e habilidades), loja, funções, máquina de gravidade |
| `ui/menus/alignment_question_form.json`, `christmas_form.json`, `functions_form.json`, `gravity_machine_form.json`, `shop_form.json`, `npcs/*` | rotas próprias no `server_form` (telas fora do restyle) |
| `textures/ui/backgrounds/menu_background` | `custom_server_form`, alinhamento, NPCs |
| `textures/ui/buttons/menu_button[_hover]` | alinhamento, NPCs |
| `textures/ui/images/patron_items`, `patron_chat` | Notícias du2 |
| `textures/ui/du2/*` | telas du2 |

## Depois de integrar: conferir no jogo

- Abrir todas as telas du2 (abas, Missões e detalhe, Conquistas e detalhe, Treino, réplicas, Habilidades, Transformações, Notícias, Guia, Estatísticas e Informações completas, Raças, Customização, Barbeiro). Nenhuma pode ficar vazia ou com textura rosa/preta.
- Abrir as telas que ficaram: alinhamento, NPC com diálogo e com habilidades, loja, funções, gravidade, Shenron e Natal.
- O Content Log não pode ter `ui/menus/...` nem textura ausente.
