# Roteiro de teste da 1.7.20: menus e HUD (Engrenagem) — rascunho

Cobre os commits `a58f48c` (valores dos slots, check de propriedades), `d87708f` (Notícias), `e27aeb9`/`38237c1` (Treino 1.7.20) e o item 13 (`1f28be7`), se entrar.

**Como testar**
- Faça tudo no **PC** e no **celular**, e marque os dois.
- Troque a língua no fim (seção 9).
- Um print de cada tela ajuda a revisão.

## 0. Antes de começar
- [ ] Apague o Content Log antigo e entre no mundo com o pacote da 1.7.20.
- [ ] Personagem com XP, pontos de atributo e de habilidade, e pelo menos uma habilidade que dá para melhorar.

## 1. Estatísticas
- [ ] O BP aparece com número no topo, ao lado de "BP".
- [ ] O nível aparece com número.
- [ ] A barra de XP tem segmentos acesos e o número (ex.: "340 / 1200 XP").
- [ ] A pílula dourada mostra os pontos de atributo (ex.: "5 pontos livres"), inclusive com 0.
- [ ] Cada atributo mostra o valor, o multiplicador (x1.0) e o custo (1 AP).
- [ ] x1 / x10 / x100 trocam e o botão aceso muda.
- [ ] O "+" compra e o valor sobe na hora.
- [ ] Com o peso ou na Sala do Tempo aparece o "x" do treino. Sem eles, não aparece nada.
- [ ] O painel embaixo da prévia (espada, escudo, raio) mostra dano, defesa e ki com números.
- [ ] Raça "Saiyajin" inteira (o "y" e o "j" com a perna, não "Saivaiin").
- [ ] Forma, alinhamento e mestre aparecem.
- [ ] "Informações" abre a tela completa, e o Voltar retorna.

## 2. Habilidades
- [ ] "Pontos de habilidade" mostra o número (também com 0).
- [ ] Nenhum quadrado vazio na lista.
- [ ] Não aparecem "pts;…" nem uma linha "Transformações" dentro da lista.
- [ ] Aparecem **todas** as habilidades que o personagem tem, nesta ordem:
  - primeiro, as que dá para subir, com nível, custo e o "+";
  - depois, as no máximo, com "Maximizado" e o ícone dourado;
  - por último, as de nível único (ex.: Esfera de Ki, Kamehameha), com "Aprendida" e um ✓ azul, sem custo e sem "+".
- [ ] Clicar numa habilidade que sobe melhora **ela** e gasta os pontos.
- [ ] Clicar numa linha "Aprendida" ou "Maximizado" só reabre a tela: não gasta ponto e não abre a Ajuda.
- [ ] Personagem novo (só com habilidades de nível único) vê a lista com elas, e não o aviso de "nenhuma habilidade".
- [ ] O aviso de vazio só aparece se o personagem não tiver nenhuma habilidade.
- [ ] O botão Transformações (embaixo) abre Transformações.

## 3. Notícias
- [ ] Só o texto das notícias. Sem a imagem do inventário e sem "[Patron] About04 >> Hello".

## 4. Seleção de raça, customização e barbeiro
- [ ] Cada raça mostra o nome inteiro e os bônus com números.
- [ ] As setas ◀ ▶ da prévia vão para o lado certo.
- [ ] "Aleatório" sorteia de verdade (troca a raça e a aparência).
- [ ] ✓ avança: Raça → Aparência → Começar. O ✓ final começa a aventura.
- [ ] Customização: cada linha mostra o nome e o "n/total" com números.
- [ ] Na customização, ◀ ▶ mudam o valor certo.
- [ ] Barbeiro: o mesmo que a customização. Confirmar aplica o cabelo.
- [ ] Nenhum texto "ui.dbe…" cru em nenhuma dessas telas.

## 5. Telas da 1.7.20 (Treino)
- [ ] Treino: o cabeçalho "x<n>" aparece quando o multiplicador é maior que 1. Com x1, não aparece nada.
- [ ] As 4 linhas aparecem (sombra, concentração, flexões, mental), cada uma com a ação e o estado em 2 linhas.
- [ ] O ícone muda com o estado: disponível, ativo (parar), recarga (relógio) e bloqueado (cadeado).
- [ ] Linha bloqueada: o clique mostra o motivo e volta ao Treino.
- [ ] Séries das flexões: o cabeçalho "Séries" mostra feitas/máximo.
- [ ] Séries das flexões: as séries 20/30/50 aparecem com a recompensa, ou com o cadeado (nível 30) ou o relógio.
- [ ] O modo alternativo liga e desliga, com ✓ ou ×.
- [ ] Séries das flexões: a aba Treino fica acesa.
- [ ] Mental: a lista de réplicas mostra o cabeçalho do dia e os chefes. Os bloqueados aparecem com o cadeado.
- [ ] Confirmação do mental: os dois cartões (Memória e Desafio) mostram nível, recompensa (✓ se já ganha), "Melhor tempo", "Réplicas hoje" e o aviso.
- [ ] HUD durante o treino: o painel aparece com as barras, e o mental mostra "Memória" ou "Desafio" traduzido.

## 6. Conquistas
- [ ] A lista mostra os ícones coloridos e os nomes.
- [ ] O detalhe de uma conquista mostra o corpo (texto completo), sem linhas vazias nem chave crua.
- [ ] Voltar retorna à lista.

## 7. Item 13 (só se a remoção entrar na 1.7.20)
- [ ] Todas as telas du2 abrem com conteúdo e sem textura rosa ou preta:
  - Estatísticas e Informações completas;
  - Habilidades, Transformações, Missões e o detalhe;
  - Treino, séries e mental;
  - Conquistas e o detalhe;
  - Notícias, Ajuda;
  - Raças, Customização e Barbeiro.
- [ ] As telas que ficaram abrem: alinhamento, NPC (diálogo e habilidades), loja, funções, máquina de gravidade, Shenron e Natal.

## 8. Content Log
- [ ] Depois de abrir todas as telas acima, o Content Log não tem **nenhum** `[UI][error]`.
- [ ] O Content Log não tem nenhum "Unknown property".
- [ ] O Content Log não tem textura ausente nem `ui/menus/...`.
- [ ] Se aparecer algum, mande o arquivo `ContentLog*.txt` inteiro.

## 9. Línguas (pt_BR, en_US, es_ES)
- [ ] Em cada língua, abra Estatísticas, Habilidades, Treino (e séries/mental) e Raças.
- [ ] Nenhuma chave crua (`ui.dbe…`, `training.…`).
- [ ] Nenhum texto saindo da caixa ou cortado no meio da palavra.
- [ ] Os números aparecem iguais nas 3 línguas.

## 10. PC e celular
- [ ] No PC, cada seção acima foi conferida.
- [ ] No celular, cada seção acima foi conferida (layout próprio, toque na linha inteira).
- [ ] Celular fraco: rolar a lista de réplicas e a de Missões sem travar.
