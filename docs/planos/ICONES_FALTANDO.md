# Ícones du2 que provavelmente faltam nas telas antigas (rascunho da Aquarela)

- **Estado:** a confirmar com a Engrenagem. Nada foi desenhado ainda.
- **Padrão:** mesmo dos 39 atuais. `textures/ui/du2/icons/<nome>.png`, branco, 32x32, traço ~3 px, tingido pelo JSON com `color`.
- **Fonte:** categorias reais do BP (`scripts/data/*`) e chaves do `.lang`.

## Missões (`quest_list_form`, `quest_form`)
| Nome proposto | Desenho | Uso |
|---|---|---|
| `quest_main` | estrela de 5 pontas | missão principal / saga (`main_quests_data`, `type: "main"`) |
| `quest_side` | balão de fala | secundária (`side_quests_data`, `type: "side"`) |
| `quest_challenge` | espadas cruzadas | desafio (`challenge_quests_data`) |
| `quest_done` | círculo com ✓ | concluída |
| `quest_locked` | cadeado | requisito não cumprido (hoje usa `textures/ui/icon_lock` vanilla) |
| `obj_defeat` | caveira simples | objetivo "derrotar" (`defeat_enemy`, 65 usos) |
| `obj_talk` | balão com "…" | "falar com NPC" (`interact_npc`, 33) |
| `obj_collect` | mochila/saco | "coletar item" (`collect_item`, `item`) |
| `obj_location` | alfinete de mapa | "entrar em bioma/região" (`enter_biome`, `enter_region`) |
| `reward_zeni` | moeda | recompensa em zeni (63) |
| `reward_z_points` | "Z" em losango | recompensa em pontos Z (50) |
| `level` | seta para cima em escudo | nível recomendado |

## Conquistas (`achievement_list_form`)
| Nome proposto | Desenho | Uso |
|---|---|---|
| `ach_trophy` | (já existe: `tab_achievements`) | cabeçalho |
| `ach_battle_power` | raio dentro de círculo | `battle_power` (ou reusar `stat_bp`) |
| `ach_defeat` | caveira (= `obj_defeat`) | `defeat_enemy` |
| `ach_item` | baú | `item` |
| `ach_skill` | chama com "+" | `learn_skill` |
| `ach_requirement` | lista com ✓ | `requirement` (11) |
| `ach_done` | medalha com fita | concluída (hoje "§aConcluído") |

## Treino (`training_form`, `gravity_machine_form`)
| Nome proposto | Desenho | Uso |
|---|---|---|
| `train_shadow` | silhueta humana dupla, deslocada | boneco de sombra (`button.shadow_dummy`) |
| `train_concentration` | figura sentada em lótus (ou olho fechado) | concentração (`button.concentration`) |
| `train_stop` | quadrado (stop) | parar concentração |
| `train_weights` | anilha/peso | pesos de treino (`use_training_weight`) |
| `gravity` | seta para baixo sobre uma barra | gravidade |
| `fuel` | gota com chama / galão | combustível da máquina |

## Customização e barbeiro (`customization_form`, `select_hair_form`)
Uma por opção do `.lang` (`customization.*`):
| Nome proposto | Desenho | Opção |
|---|---|---|
| `cust_hair` | mecha de cabelo pontuda | Cabelo |
| `cust_hair_color` | gota com mecha | Cor do Cabelo |
| `cust_eyes` | olho | Olhos |
| `cust_eye_color` | olho com gota | Cor dos Olhos |
| `cust_skin` | mão aberta | Cor da pele |
| `cust_skin_details` | mão com marcas | Detalhes da Pele |
| `cust_face` | rosto oval | Rosto |
| `cust_beard` | queixo com barba | Barba |
| `cust_gender` | (reusar `fact_gender`) | Gênero |
| `cust_antennas` | duas antenas (variante de `race_namekian`) | Antenas |
| `cust_horns` | dois chifres (variante de `race_glind`) | Chifres |
| `cust_shoulder_pads` | ombreira em arco | Ombreiras |
| `cust_tail_color` | rabo em espiral com gota | Cor do Rabo |
| `palette` | paleta de pintor | botão genérico de cor |

## Gerais (várias telas)
| Nome proposto | Desenho | Uso |
|---|---|---|
| `lock` | cadeado | transformações e skills bloqueadas (substitui o `icon_lock` vanilla) |
| `skill_points` | chama com estrela | pontos de habilidade |
| `skill_max` | estrela cheia | skill maximizada |
| `shop_cart` | carrinho | loja |
| `functions` | engrenagem | menu Funções |
| `tail` | rabo em curva | "Modo do rabo" (Funções) |
| `back` | seta curva para a esquerda | voltar (hoje `back_button`) |

**Total:** ~45 ícones novos, alguns reaproveitando desenhos que já existem. É um lote M com o gerador (`tools/art/du2_textures.cjs`): basta acrescentar os paths.

## Confirmado pela Engrenagem (2026-11-22)

O JSON UI só consegue escolher um ícone pela posição fixa do botão, por igualdade com um texto que o script manda como chave simples, ou por um ícone que o próprio script manda no botão. Nas telas antigas o script não muda (regra do Maestro), então só entram os ícones que têm um gatilho desses.

**Vou referenciar (pode desenhar):**

| Caminho exato | Onde | Gatilho |
|---|---|---|
| `textures/ui/du2/icons/back` | botão Voltar (detalhe de missão e de conquista, customização) | texto `ui.dbe.backButton` |
| `textures/ui/du2/icons/train_shadow` | Treino: boneco de sombra | texto `ui.dbe.training.button.shadow_dummy` |
| `textures/ui/du2/icons/train_concentration` | Treino: começar concentração | texto `ui.dbe.training.button.concentration` |
| `textures/ui/du2/icons/train_stop` | Treino: parar concentração | texto `ui.dbe.training.button.stop_concentration` |
| `textures/ui/du2/icons/play` | detalhe de missão: Iniciar (triângulo "play") | texto `ui.dbe.quest.button.start` |
| `textures/ui/du2/icons/restart` | detalhe de missão: Reiniciar (seta circular) | texto `ui.dbe.quest.button.restart` |

Também uso os que já existem: `tab_*` (cabeçalhos), `check` (Confirmar da customização), `chevron_left`/`chevron_right` (setas da customização e do barbeiro), `plus` (Habilidades), `close`.

**Não vou usar agora: dependem de dado novo do script (anotado para o Maestro):**
- `quest_main`, `quest_side`, `quest_challenge`, `quest_done`, `quest_locked`: o tipo e o estado vêm misturados no texto do botão (rawtext). Precisaria de o script mandar o ícone no botão (`iconPatch`).
- `ach_done` e os `ach_*` por categoria: mesmo motivo (concluída / categoria só no texto).
- `lock`: o script manda `textures/ui/icon_lock` (vanilla) nas transformações bloqueadas. Trocar exige mudar o caminho no script; o JSON só mostra o que vier.
- `skill_max`, `skill_points`: a habilidade no máximo e os pontos estão só dentro do texto.
- `obj_*`, `reward_*`, `level`: objetivos, recompensas e nível recomendado vêm num body único. Exigiria slots separados (como nas Estatísticas).
- `cust_*`, `palette`: os nomes das opções da customização e do barbeiro vêm num body único, uma linha por opção, sem identificador por linha. Exigiria um slot por linha.
- `train_weights`, `gravity`, `fuel`, `shop_cart`, `functions`, `tail`: telas fora deste restyle (máquina de gravidade, loja, funções).
