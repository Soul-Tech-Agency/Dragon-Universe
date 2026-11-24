# Roteiro de teste da 1.7.20

Marque [x] o que passou, [N] o que falhou e [?] o que não deu para testar. Quando falhar, mande o print e o número da parte.
Teste sempre em **mundo novo** ou numa **cópia** de mundo salvo, nunca no original. Ligue o Content Log (Configurações → Criador) e mande os arquivos `ContentLog*.txt` no fim.

## Parte 0. Abre?
- [ ] O mundo novo carrega sem "Falha ao carregar pelo menos um pacote".
- [ ] O primeiro erro do Content Log, se houver: ____
- [ ] A cópia de um mundo antigo carrega. O primeiro erro, se houver: ____
- [ ] 10 min jogando sem `[scheduler] tarefa ... falhou`, sem watchdog e sem slow script no log.

## Parte 1. Menus e telas
Cobre os commits `a58f48c` (valores dos slots, check de propriedades), `d87708f` (Notícias), `e27aeb9`/`38237c1` (Treino 1.7.20) e o item 13 (`1f28be7`), se entrar.

**Como testar**
- Faça tudo no **PC** e no **celular**, e marque os dois.
- Troque a língua no fim (seção 9).
- Um print de cada tela ajuda a revisão.

### 0. Antes de começar
- [ ] Apague o Content Log antigo e entre no mundo com o pacote da 1.7.20.
- [ ] Personagem com XP, pontos de atributo e de habilidade, e pelo menos uma habilidade que dá para melhorar.

### 1. Estatísticas
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

### 2. Habilidades
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

### 3. Notícias
- [ ] Só o texto das notícias. Sem a imagem do inventário e sem "[Patron] About04 >> Hello".

### 4. Seleção de raça, customização e barbeiro
- [ ] Cada raça mostra o nome inteiro e os bônus com números.
- [ ] As setas ◀ ▶ da prévia vão para o lado certo.
- [ ] "Aleatório" sorteia de verdade (troca a raça e a aparência).
- [ ] ✓ avança: Raça → Aparência → Começar. O ✓ final começa a aventura.
- [ ] Customização: cada linha mostra o nome e o "n/total" com números.
- [ ] Na customização, ◀ ▶ mudam o valor certo.
- [ ] Barbeiro: o mesmo que a customização. Confirmar aplica o cabelo.
- [ ] Nenhum texto "ui.dbe…" cru em nenhuma dessas telas.

### 5. Telas da 1.7.20 (Treino)
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

### 6. Conquistas
- [ ] A lista mostra os ícones coloridos e os nomes.
- [ ] O detalhe de uma conquista mostra o corpo (texto completo), sem linhas vazias nem chave crua.
- [ ] Voltar retorna à lista.

### 7. Item 13 (só se a remoção entrar na 1.7.20)
- [ ] Todas as telas du2 abrem com conteúdo e sem textura rosa ou preta:
  - Estatísticas e Informações completas;
  - Habilidades, Transformações, Missões e o detalhe;
  - Treino, séries e mental;
  - Conquistas e o detalhe;
  - Notícias, Ajuda;
  - Raças, Customização e Barbeiro.
- [ ] As telas que ficaram abrem: alinhamento, NPC (diálogo e habilidades), loja, funções, máquina de gravidade, Shenron e Natal.

### 8. Content Log
- [ ] Depois de abrir todas as telas acima, o Content Log não tem **nenhum** `[UI][error]`.
- [ ] O Content Log não tem nenhum "Unknown property".
- [ ] O Content Log não tem textura ausente nem `ui/menus/...`.
- [ ] Se aparecer algum, mande o arquivo `ContentLog*.txt` inteiro.

### 9. Línguas (pt_BR, en_US, es_ES)
- [ ] Em cada língua, abra Estatísticas, Habilidades, Treino (e séries/mental) e Raças.
- [ ] Nenhuma chave crua (`ui.dbe…`, `training.…`).
- [ ] Nenhum texto saindo da caixa ou cortado no meio da palavra.
- [ ] Os números aparecem iguais nas 3 línguas.

### 10. PC e celular
- [ ] No PC, cada seção acima foi conferida.
- [ ] No celular, cada seção acima foi conferida (layout próprio, toque na linha inteira).
- [ ] Celular fraco: rolar a lista de réplicas e a de Missões sem travar.

## Parte 2. Treinos, voo, radar e cidade do Futuro
Treinos (concentração, flexões e treino mental), tela Treino, voo no Star Navigator, radar e cidade do Futuro.
Marque cada item depois de ver no jogo. Quando algo falhar, anote o que aconteceu e, se der, mande um print.
Alguns itens pedem dois jogadores ou um mundo antigo: estão marcados assim.

> Regras ainda provisórias (podem mudar depois deste teste): o combo da concentração só aparece na tela; as flexões não
> começam com luta de missão em andamento; a réplica do Beerus é uma luta normal (não "sobreviva 3 min"); o mesmo chefe
> conta 1 vez por dia só quando você vence; o treino mental protege de qualquer golpe que mataria você; ir e voltar com o
> Star Navigator em menos de 10 s chega a pé.

### 1. Tela Treino

- [ ] Abrir o menu, aba Treino: aparecem 4 linhas (Sombra, Concentração, Flexões, Treino mental), cada uma com ícone colorido.
- [ ] Na gravidade ou num planeta com treino mais forte, aparece "Treino x2" (ou o valor certo) no topo. Na Terra, sem gravidade, não aparece.
- [ ] Concentração mostra "Chances 3/5" (ou o que você tiver); Flexões mostra "Séries 0/3"; Treino mental mostra "Réplicas hoje 0/3".
- [ ] Com um treino em andamento, as outras linhas mostram "Outro treino em andamento" com cadeado, e a linha do treino ativo vira "Encerrar" em vermelho.
- [ ] Clicar numa linha com cadeado ou em recarga manda o motivo no chat e reabre a tela.
- [ ] Nenhum texto aparece como código (ex.: "ui.dbe…").

### 2. Concentração

- [ ] Começar: o personagem fica parado no lugar (não anda nem pula, mas a câmera mexe), com uma contagem 3-2-1.
- [ ] Aparece uma grade 3×3 de orbes à sua frente, na altura dos olhos. Os orbes não somem e não mudam de lugar durante o treino.
- [ ] A cada rodada as cores trocam: verde dá ponto, vermelho tira, preto encerra; os apagados (anel vazado) não fazem nada.
- [ ] O painel no canto da tela mostra pontos, prêmio (até 10), chances, combo, tempo e a grade espelhada.
- [ ] As rodadas ficam mais rápidas conforme você pontua, mas nunca rápidas demais (dá para acompanhar).
- [ ] Acertar o mesmo orbe duas vezes na mesma rodada só conta uma vez.
- [ ] Ao chegar a 50 pontos, o prêmio fica em 10 (não passa disso).
- [ ] O treino termina sozinho em 90 s.
- [ ] Levar dano no meio encerra o treino, paga o que você fez até ali e mostra a mensagem de interrompido.
- [ ] Sair do mundo no meio e voltar: nenhum orbe sobra no lugar e você consegue pular de novo.
- [ ] Dois jogadores lado a lado (2 jogadores): acertar o orbe do outro não dá ponto para ninguém.
- [ ] Celular: os orbes ficam ao alcance do toque.

### 3. Flexões (treino físico)

- [ ] Tela de séries: 20, 30 e 50 flexões; a de 50 aparece com cadeado e "Libera no nível 30" antes do nível 30.
- [ ] Cada série mostra quanto de um nível ela dá (ex.: "≈ 12% de um nível").
- [ ] Começar uma série: contagem 3-2-1 e o personagem entra na pose de flexão (não pode andar, pular nem montar).
- [ ] O painel mostra DESÇA (dourado) e SUBA (azul): segurar o agachar quando pede DESÇA e soltar quando pede SUBA conta uma flexão.
- [ ] O boneco desce e sobe junto com você.
- [ ] Apertar antes do pedido mostra "Cedo demais" e não conta.
- [ ] Demorar demais para subir mostra "Ritmo perdido" e não conta.
- [ ] Durante a série: o agachar não carrega ki, não liga a aura nem o som de carga, não transforma e não ataca com técnica.
- [ ] Sem vigor, a série pausa e volta quando o vigor recupera (sem perder as flexões feitas).
- [ ] Ficar uns 5 s sem responder encerra a série.
- [ ] Completar a série dá XP e mostra o resumo; a tela passa a mostrar "Séries 1/3".
- [ ] Parar no meio (tela Treino ou o item de menu) paga metade; parar sem nenhuma flexão válida não gasta a série.
- [ ] Depois de 3 séries no dia, as séries mostram recarga.
- [ ] Na Sala do Tempo, o ganho é maior, mas no máximo o triplo.
- [ ] Modo alternativo ligado (tela de séries): usar o item do slot 8 desce e sobe, sem precisar agachar. Desligado, o item não faz nada na série.
- [ ] Celular (botão de agachar) e controle: as flexões funcionam.
- [ ] Começar com o slot 8 selecionado: o personagem não fica em posição de defesa durante a série.
- [ ] Sair do mundo no meio e voltar: o personagem não fica preso na pose de flexão e volta a andar e pular.
- [ ] Tentar começar voando, na água, montado, em fusão, logo depois de levar dano ou durante uma luta de missão: aparece o motivo no chat.
- [ ] Dois jogadores (2 jogadores): um vê o outro fazendo flexões na pose certa.

### 4. Treino mental

Checklist da Sentinela:
- [ ] (a) Golpe final na réplica com soco, ki blast, explosão de ki e combo (uma luta para cada): ela some com brilhos, sem
  deixar item e sem dar o XP de chefe; a névoa roxa sai; o painel some inteiro, inclusive o modo.
- [ ] (b) Uma luta com a versão de teste que registra o dano na réplica: se aparecer no log "damage on replica ignored"
  depois de um ataque seu, anote qual ataque foi.
- [ ] (c) Golpe que mataria você: fica com 1 de vida, não vai ao Outro Mundo, aparece a mensagem de derrota e a névoa sai.
- [ ] (d) Golpe final dos dois lados ao mesmo tempo (você e a réplica quase sem vida): um resultado só e uma recompensa só.
- [ ] (e) Painel: o modo aparece certo (Memória ou Desafio) e, abaixo do tempo, não aparece nada.
- [ ] (f) Flexão agachando: sem fagulhas, sem carga de ki e sem aura.

Também (decisão 14):
- [ ] Vencer a réplica de Raditz com uma missão de Raditz/Nappa ativa: a missão NÃO avança.
- [ ] Vencer uma réplica não dá conquista de "derrotar" nem zeni.
- [ ] Outro jogador batendo na réplica não tira vida dela (2 jogadores).
- [ ] Sair do mundo no meio e voltar: a réplica não está mais lá e a névoa roxa sumiu.

Resto:
- [ ] A lista mostra os chefes na ordem da campanha; os não vencidos aparecem com cadeado e "Derrote na campanha".
- [ ] Escolher um chefe vencido abre a confirmação com Memória e Desafio, o nível de cada um e a recompensa da primeira vitória.
- [ ] Começar: névoa roxa, contagem 3-2-1, a réplica surge perto com um anel de fagulhas e fica com uma aura roxa/azul.
- [ ] O painel mostra a vida da réplica, o tempo e o modo (Memória ou Desafio).
- [ ] Primeira vitória na Memória: 1 ponto de habilidade. No Desafio: 2 pontos de habilidade e 3 pontos de atributo.
- [ ] Vencer de novo um chefe já vencido dá XP; depois de 3 vitórias repetidas no dia, aparece o limite.
- [ ] O mesmo chefe não pode ser vencido duas vezes no mesmo dia.
- [ ] Na lista, o chefe vencido nas duas dificuldades aparece com o ícone de concluído e o melhor tempo.
- [ ] O tempo acaba em 3 min e a réplica se desfaz.
- [ ] Afastar-se muito da réplica (uns 30 blocos), trocar de dimensão ou desistir na tela Treino encerra sem recompensa.
- [ ] Ataques de ki, explosões e combos funcionam contra a réplica (se algum não tirar vida dela, anote qual).
- [ ] Réplica do Beerus: dá para acertar e vencer.

### 5. Star Navigator e voo

- [ ] Voando, viajar 5 vezes pelo Star Navigator (Namek, espaço, Terra…): nas 5, o voo desliga na troca e religa sozinho uns instantes depois de chegar.
- [ ] Chegar sem ki, em Oozaru ou no meio de uma série de flexões: você fica a pé (o voo não religa).
- [ ] Chegar voando e morrer em menos de 10 s: depois do respawn o voo NÃO religa sozinho.
- [ ] Ir e voltar em menos de 10 s: chega a pé (esperado nesta versão).
- [ ] Viajar voando pelo pod e pelo Kaioshin: o voo também religa no destino.

### 6. Radar do Dragão (versão de teste com a sonda ligada)

- [ ] Parado, sem o radar na mão: `/scriptevent dbe:perf start`, esperar 60 s, `/scriptevent dbe:perf report`: o número de setProperty/s fica perto de 0 (antes era ~1 por jogador).
- [ ] Com o radar na mão, ele aponta para as Esferas; guardado, volta a zero.
- [ ] Depois de trocar de dimensão e depois de morrer e renascer, sem o radar na mão, continua em zero.

### 7. Cidade do Futuro (mundo novo)

- [ ] Mundo novo: até a primeira viagem ao Futuro, o jogo não fica pesado à toa (com a sonda: nenhuma linha "terreno Futuro").
- [ ] Primeira viagem ao Futuro: aparecem mensagens de progresso ("Gerando o terreno do Futuro…"); espere parado. Leva alguns minutos (uns 3 a 5 no PC).
- [ ] Ao chegar, você está em chão firme, com a cidade pronta.
- [ ] Sair do lugar durante a espera cancela só a espera; tentar de novo continua de onde parou.
- [ ] Segunda viagem ao Futuro: rápida, sem esperar a cidade de novo.
- [ ] Mundo antigo que já tinha a cidade (mundo antigo): nada muda.

### 8. Geral

- [ ] 10 minutos de jogo sem erro novo no Content Log.

## Parte 3. Visual: cabelos, Oozaru, flexão e névoa
Rascunho. Os commits ficam na `agent/oozaru`. Marque [x] o que passou. Se algo falhar, mande print e o número do item.

### 1. SSJ3 do Vegeta e do Trunks (DMZ), commit 4e1a9d0
Comparação antes/depois: `planos/SSJ3_VEGETA_TRUNKS_23-11.png`.
- [ ] Vegeta SSJ3: espetos penteados para trás, emendando na juba das costas (sem a "tábua" solta).
- [ ] Vegeta SSJ3, de frente: bico na testa, sem franja na cara.
- [ ] Trunks SSJ3: o mesmo, com a franja dele na frente.
- [ ] Os dois, correndo: a juba balança e não atravessa o corpo.
- [ ] As prévias do inventário e das Estatísticas mostram o mesmo cabelo.

### 2. Oozaru e Golden nas prévias, commit 58f71d3
- [ ] Inventário (E): o Oozaru inteiro dentro da caixa preta, mais ou menos do tamanho da forma base.
- [ ] Estatísticas do DU: corpo inteiro dentro da moldura.
- [ ] O mesmo com o Golden Oozaru.
- [ ] A forma base e o SSJ continuam iguais nas prévias.

### 3. Oozaru NO MUNDO com menu aberto (OBRIGATÓRIO)
- [ ] Em Oozaru, câmera em 3ª pessoa (F5): abra o inventário. O Oozaru atrás do menu continua grande.
- [ ] Ainda em F5: abra o menu do DU (Estatísticas). O Oozaru continua grande.
- [ ] Repita com o Golden Oozaru.

**Se falhar** (o Oozaru encolhe no mundo enquanto o menu está aberto): **avise na hora, com print**. A saída é reverter 58f71d3 e ac2f67b juntos. Nesse caso o Oozaru volta a aparecer grande nas prévias, mas fica normal no mundo.

### 4. Pose da flexão, commits 7e46f6e, 54cce6e e ac2f67b
- [ ] Ao iniciar a série: corpo deitado, mãos e pontas dos pés no chão, sem animação de queda.
- [ ] Subindo e descendo: o peito desce perto do chão, e as mãos não afundam no chão no meio do movimento.
- [ ] No celular, a descida vem do item do slot 8; no PC, também do agachar.
- [ ] Agachar durante a série não liga a aura nem a pose de carregar ki.
- [ ] O som da aura para durante a série e volta depois.
- [ ] O rabo fica deitado sobre as pernas; com o rabo enrolado, nada muda.
- [ ] Durante a série, com o menu aberto em F5, a pose continua no mundo (mesmo teste do item 3).
- [ ] As prévias do inventário e das Estatísticas mostram o jogador em pé, não deitado.

### 5. Orbe apagado da concentração, commit 7e46f6e
Prancha: `planos/FLEXAO_ORB_1.7.20.png`.
- [ ] O orbe apagado aparece como um anel vazado azul-acinzentado, discreto.
- [ ] Só um anel, sem duplicar: o script não deve criar partícula própria para ele.
- [ ] Quando o orbe acende, o anel some; quando apaga de novo, volta.

### 6. Névoa da arena do Torneio do Poder, commit 90d01a8
Ativa desde a 1.7.19 (dbe:fog_tournament_of_power, azul claro #9FC4EA). O céu acima continua preto.
- [ ] Mande um **print da arena olhando para o horizonte**.
- [ ] Informe a sua **distância de renderização** (Configurações > Vídeo), porque a névoa é medida em fração dela.
- [ ] A arena já não parece "flutuar no preto"? Se a cor não agradar, existem as alternativas b (quase branco) e c (azul mais fechado), para testar com `/fog @s push dbe:fog_tournament_of_power_b teste`.

## Parte 4. Mundo: marcos, guardas, Namek, Bills e Whis, Kaioshin e desempenho
Os itens marcados com 📜 se conferem no ContentLog. Use um mundo novo, salvo quando o item disser outra coisa.

### Carga do pacote (950854b)
- [ ] Abrir o mundo: o log não tem `trader_llama` com `child 'presets' not valid here`, e o jogo não mostra "Falha ao carregar pelo menos um pacote"
- [ ] Lhama do caravaneiro (`/summon minecraft:trader_llama`) anda, segue o caravaneiro e pode ser empurrada normalmente

### Como achar um marco (vale para todos os itens abaixo)
1. `/scriptevent dbe:landmarks` lista cada marco com o estado e a coordenada `X Z` do centro.
2. Ir até a coordenada. O marco é construído quando o jogador chega a ~160 blocos no Overworld, ou a ~64 blocos num planeta.
3. 📜 Esperar `[Landmarks] placed <marco> at x, y, z`.
4. Se aparecer `spot rejected` ou `drawing again`, o marco mudou de lugar: rodar `/scriptevent dbe:landmarks` de novo e ir à coordenada nova.
5. Depois de `placed`, o comando mostra o marco como `placed`.

### Torneio de Artes Marciais
- [ ] Achar o Torneio pelos passos acima: 📜 `placed martial_arts_tournament`
- [ ] Há 1 locutor na entrada, e interagir com ele abre a fila do Torneio
- [ ] Sair e voltar ao mundo: continua 1 locutor

### Corporação Cápsula
- [ ] Achar a Cápsula pelos passos acima: 📜 `placed capsule_corp`
- [ ] Há 3 engenheiros dentro da cúpula, e cada um tem diálogo
- [ ] A placa `CAPSULE` aparece legível na fachada oeste, sem letra espelhada (mandar print)

### Guardas (log novo, 38792e0)
- [ ] Casa do Yamcha: 📜 `[Landmarks] yamcha_house: garrison: 2/2`, com 2 Ladrão-Urso no térreo
- [ ] Torre Red Ribbon: 📜 `red_ribbon_tower: garrison: 3/3`, com 2 Battle Jacket nas portas e 1 no topo, sem erro no log
- [ ] Base do Freeza (planeta Freeza): 📜 `frieza_army_base: garrison: 5/5`, com os 5 soldados em ~2 s
- [ ] Se aparecer `missing (no standing room)`: mandar print do lugar e a linha do log
- [ ] Matar os guardas e ficar por perto: eles não voltam antes de 30 min de jogo

### Vilas de Namek (log novo, 125d0f7)
- [ ] Ir a Namek e andar até uma vila; ficar a até 40 blocos do centro dela, com a vila já construída
- [ ] 📜 `[Namek] village cx,cz (x, y, z): 5/5 namekian(s)`, e os namekianos aparecem em até 5 s depois dessa linha
- [ ] Sair e voltar à mesma vila: não aparecem mais namekianos e a linha não se repete

### Bills e Whis (recriação)
- [ ] Planeta do Bills, mundo novo: Bills e Whis à mesa
- [ ] `/event entity @e[type=dbe:beerus] dbe:despawn` 6 vezes, esperando cada um voltar: depois da 5ª ele para de ser recriado e o log avisa `creation stopped for now`
- [ ] Fazer o mesmo com `dbe:whis`
- [ ] Reabrir o mundo: os dois voltam ao normal, 1 de cada

### Kaioshin
- [ ] Ir ao Planeta Kaioshin e voar para longe: o terreno é gerado à frente, e o tick não passa de ~50 ms (o "Tick: média" da sonda)
- [ ] Cair num buraco de chunk não gerado: o jogador volta à superfície, ou à chegada se não houver chão, sem ficar teleportando em laço
- [ ] 📜 Se aparecer `is marked complete but its terrain marker is missing`, a linha aparece 1 vez por chunk na sessão, não em repetição
- [ ] (Operador, numa CÓPIA do mundo) rodar o `/scriptevent dbe:kaioshin_repair preview {...}` que esse aviso sugere e depois `apply <token>`
  - [ ] A mensagem diz `1 chunk generation markers restored`
  - [ ] 📜 Aparece `terrain marker restored after the reviewed repair`
  - [ ] Ao voltar à sessão, o aviso não aparece de novo para esse chunk

### Desempenho e sonda (pacote com `CONFIG.DEBUG_PERF = true`)
- [ ] Depois de `/reload`: 📜 `[perf] sonda de desempenho instalada`
- [ ] Rodar `/scriptevent dbe:perf start`, jogar 2 min e rodar `/scriptevent dbe:perf report`
  - [ ] O report tem a linha `relógio: N tarefas, X ticks despachados (de T), Y execuções`, com N > 0 e X ≤ T
  - [ ] A linha dos contadores mostra `trySetProperty …/s` ao lado de `setProperty …/s`; voando parado, `trySetProperty` fica perto de 0
- [ ] Mundo novo, só no Overworld: a linha `interval(1) terrain_repair.js` fica ≤ 2 ms/tick e a média do tick fica abaixo de 50 ms
- [ ] Viagem a um planeta: os jobs aparecem como `terreno espaço/planetas (...)`, e a viagem chega
- [ ] Ficar perto de marcos ainda não construídos no Overworld: nenhuma linha `world_landmarks.js` passa de ~2 ms/tick

## Observações para ler o resultado
- **Habilidades:** a tela mostra todas as suas habilidades. Primeiro vêm as que sobem de nível, depois as que estão no máximo e por fim as de nível único ("Aprendida", com ✓). Com o voo aprendido, o Voo aparece no topo com o custo. Quem trocou de raça pode continuar vendo habilidades da raça antiga (por exemplo, Absorção): isso já acontecia antes e só ficou visível agora. Avise se incomodar.
- **Vilas de Namek:** a linha nova do log só aparece numa vila **nunca visitada** (mundo novo ou vila nova).
- **Guardas:** num mundo antigo, o primeiro registro pode dizer `0 new` se os guardas já estavam lá. Isso está certo.
- **/reload (só no pacote de depuração):** compare o número de **execuções** da linha `relógio` numa janela igual antes e depois do `/reload`. Se dobrar, o relógio duplicou. Os "ticks despachados" não mostram isso.
- **trySetProperty/s = 0** mesmo transformando ou defendendo: avise, porque a medição pode não funcionar no jogo.
