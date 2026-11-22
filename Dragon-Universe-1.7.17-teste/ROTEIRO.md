# 1.7.17: roteiro de teste

Montado em 2026-11-22 a partir dos itens "para o roteiro" de cada frente (viagens, construções e Star Navigator, menus, Oozaru e cabelos) e dos itens que ficaram sem teste na 1.7.15 e na 1.7.16.
Marque cada item com **Y** (funcionou), **N** (falhou) ou **?** (não testado ou não deu para saber). Quando falhar: print ou vídeo, Content Log, dimensão e coordenadas.
Nada aqui foi testado no Minecraft pela equipe.

## Quem e onde
- ⚠️ **Não abrir numa versão anterior um mundo que já passou pela 1.7.15, 1.7.16 ou 1.7.17.** As versões antigas não entendem o plano novo e podem duplicar construções. Teste sempre em cópia.
- Testador · PC Windows ☐ · Android ☐ (modelo: ____) · **versão exata do Minecraft: ____** · data
- Content Log File e GUI ligados · Beta APIs ligado · mundo NOVO + CÓPIA de um mundo salvo da 1.7.14, 1.7.15 ou 1.7.16

## 1. Abre?
- [ ] O mundo carrega · auditoria `10/10` · primeiro erro do log: ____

## 2. Viagens (1 jogador)
- [ ] Na 1ª chegada a plataforma já está lá
- [ ] Sair andando da plataforma nos primeiros 20 s: quem cai, ou fica abaixo do chão ainda não gerado, volta para ela, sem sufocar
- [ ] Tempos da 1ª viagem a Vegeta, Freeza e Yardrat: ____ / ____ / ____ · copiar as linhas `[Timing]`
- [ ] Base do Freeza aparece em `/scriptevent dbe:landmarks` em ~2 min no planeta Freeza
- [ ] Content Log sem `PlanetPreservationError` (`gold_ore`/`lapis_ore`) e sem `[Namek] UnloadedChunksError`
- [ ] Namek: ida e volta 3 vezes sem `LocationInUnloadedChunkError` no log

## 2b. Viagens com 2 jogadores (H10, sem teste na 1.7.15)
- [ ] A e B escolhem o mesmo planeta nunca visitado (Vegeta ou Freeza) quase ao mesmo tempo: os dois chegam na plataforma; B vê "Partindo para…" e a mensagem de fila
- [ ] A chega num planeta novo e logo depois B escolhe o mesmo planeta: B chega em poucos segundos
- [ ] A está num planeta e B escolhe outro planeta novo: B chega, sem "Não foi possível iniciar a viagem…"
- [ ] Com B viajando para um destino novo, A (já no destino) sai andando ou voando do pouso: A não cai no vazio e B chega normalmente
- [ ] A e B vão juntos para Kaioshin e depois para Namek: os dois chegam, com a mensagem no idioma do jogo
- [ ] Uma vez em inglês ou espanhol: a mensagem de fila aparece traduzida
- [ ] Se aparecer só "!": print do chat e Content Log do anfitrião
- [ ] Content Log sem `Terrain preparation queue timed out` e sem `LocationInUnloadedChunkError`

## 3. Construções do mundo normal
**Como chegar:** `/scriptevent dbe:landmarks` lista os pontos. **As coordenadas agora são do centro** da construção. Ir com `/tp @s X 200 Z` e descer. No mundo normal, a construção começa a ser feita quando o jogador está a 160 blocos dela.
- [ ] `dbe:landmarks` antes e depois de cada visita: copiar as linhas `[Landmarks]`
- [ ] Corporação Cápsula e Torneio de Artes Marciais **geram na 1ª visita**, sem `spot rejected` no log. `nearby draw k/3 ... usable` também conta como certo
- [ ] Nenhuma construção mostra `(biome border)` em `dbe:landmarks` (se mostrar, anotar qual)
- [ ] Casa do Piccolo e do Yamcha: já estão prontas quando aparecem, sem surgir de repente perto ou atrás do jogador · o centro fica perto da coordenada mostrada
- [ ] Terreno em volta da Cápsula e do Torneio: sem paredes cortadas nem pilares de terra feios (print)
- [ ] Se algum ponto for rejeitado: o log mostra `trying 3 nearby draws, one per scan` e depois `nearby draw k/3`, com um intervalo entre cada uma
- [ ] Enquanto uma construção testa os pontos vizinhos, outra com jogador perto é gerada sem esperar
- [ ] Nenhum ponto vizinho escolhido fica a menos de 900 blocos do spawn
- [ ] Cada uma inteira, sem `could not place` · sair e voltar não duplica

## 4. Planetas: Base do Freeza e Casa do Guru
- [ ] Base do Freeza nova: chão e enchimento embaixo roxos (solo do planeta), **sem quadrado verde** (print)
- [ ] Mundo com a base já gerada: ao chegar perto, o chão troca e o log mostra `floor swapped to the planet ground`
- [ ] Casa do Guru em mundo novo: terreno natural em volta do pilar, **sem buraco ou chão plano retangular** · o pilar que abre para cima é o desenho original (print de lado se parecer errado)

## 5. Star Navigator: lista de construções
- [ ] `/scriptevent dbe:constructions` abre a lista com **todas** as construções (geradas ou não), com X/Z e estado
- [ ] Botão "Construções" no Star Navigator abre a mesma lista
- [ ] Nomes e textos em pt/en/es sem chave crua (`dbe.constructions...`) · West City antiga só aparece se tiver sido construída
- [ ] Fechar a lista não trava o Navigator: dá para abrir de novo e viajar

## 6. Menus
- [ ] Ícone DU nos 7 painéis com abas (estatísticas, skills, missões, treino, notícias, conquistas, transformações), **no PC e no celular** (print de cada): centralizado acima do painel, sem corte e sem cobrir título, X ou abas. Em tela muito baixa ele pode ficar menor ou sumir: anotar
- [ ] Customização (Saiyajin, masculino e feminino): cada seta muda e **mantém** a opção, nos dois sentidos (cabelo, cor do cabelo, olhos, cor dos olhos, pele, barba, gênero) · clicar rápido várias vezes não volta para a anterior
- [ ] Customização → Voltar → Selecionar de novo: abre normal, sem formulário repetido nem travado
- [ ] Customização com o chat aberto: não fica reabrindo sem parar
- [ ] Sair do mundo com a customização aberta, entrar de novo: a seleção de raça abre normal, sem trava nem dado perdido
- [ ] Barbeiro: as setas mudam e mantêm o estilo, nos dois sentidos
- [ ] Estatísticas em Oozaru e Golden Oozaru: **corpo inteiro** na prévia, sem close do pelo (print)
- [ ] Barbeiro em Oozaru e Golden Oozaru: corpo inteiro na prévia, nada estranho no fim do texto
- [ ] Estatísticas e barbeiro na forma base e no SSJ: prévia do mesmo tamanho de antes · uma vez em inglês ou espanhol: a prévia pequena só aparece no Oozaru
- [ ] Loja: todos os itens (inclusive a máquina de gravidade) dourados, com hover ciano · a tela da máquina de gravidade continua com o visual antigo

## 7. Oozaru e cabelos
- [ ] Oozaru: cabeça lisa vista **de cima, de trás e de frente** (sem quadradinhos)
- [ ] Golden Oozaru: o mesmo
- [ ] Vegeta Oozaru inimigo: o mesmo
- [ ] SSJ3 do Goku: cabelo **comprido e opaco** (sem partes transparentes)
- [ ] Goku SSJ3 com a aura desligada: cabelo dourado e opaco, caindo nas costas até a cintura (de frente, de lado e de trás)
- [ ] Correndo e parado: a juba balança e não atravessa o corpo
- [ ] Gohan jovem e adulto SSJ3: igual
- [ ] Vegeta e Trunks SSJ3 (DMZ): dourados, ainda curtos
- [ ] Beast do Goku: sem a juba do SSJ3 (igual à 1.7.16)
- [ ] SSJ e SSJ2 desses estilos sem mudança

## 8. Mundo salvo antigo (CÓPIA; sem teste na 1.7.15)
- [ ] Mundo da 1.7.14: log com `plan updated to v2` · construções já geradas continuam `placed`, **sem segunda cópia**
- [ ] Mundo da 1.7.15/1.7.16: plano lido como está · ponto planejado e ainda não gerado gera ao chegar (pode ir para perto, nunca duplica)
- [ ] West City antiga: continua intacta · não aparece em `/scriptevent dbe:structures` · na lista do Navigator aparece como "(antiga)"
- [ ] Cápsula já gerada: continua `placed`, sem duplicar
- [ ] Mundo com o Torneio antigo: continua só o antigo, nenhum Torneio novo no mundo normal
- [ ] Chunks, construções do jogador e personagens salvos intactos

## 9. Travadas (sem teste na 1.7.15)
- [ ] Primeiros minutos de mundo novo: travadas? Procurar `slow script` / watchdog no log
- [ ] Ao gerar a Cápsula, o Torneio e a Base do Freeza: travadas? Quanto tempo? ____
- [ ] Viagens entre planetas: travadas na chegada? ____

## 10. Enviar
- [ ] Este roteiro marcado + Content Log (PC e celular) + prints numa pasta "Testes"

## 11. Menu e seleção de raça novos (redesign)

Roteiro detalhado, escrito pela Sentinela 2. Marque também nesta parte.

### Como usar este roteiro

- Marque **[x]** no que funcionou. Se algo deu errado, deixe **[ ]** e escreva ao lado o que aconteceu.
- Tire **print** de tudo que parecer estranho: texto cortado, texto saindo da caixa, botão que não responde, imagem faltando.
- Anote em todos os prints **onde** você estava: PC ou celular, e qual escala de interface.
- Se aparecer erro no chat ou no Content Log, copie a mensagem.
- Não precisa testar tudo de uma vez. Faça uma seção por vez.

### 11.0. Preparação

- [ ] Instalei o pacote novo (BP e RP da mesma versão) e ativei os dois no mundo.
- [ ] O Content Log está ligado (Configurações → Criador → "Content Log" e "Mostrar na tela").
- [ ] Tenho **dois mundos**:
  - (A) um **mundo novo**, para ver a seleção de raça;
  - (B) um **mundo antigo**, da 1.7.15 ou 1.7.16, com personagem já criado.
- [ ] No mundo antigo, anotei antes **raça, nível, pontos de atributo e forma** do personagem, para comparar depois.

#### Onde mudar a escala da interface (PC)

Configurações → Vídeo → **"Escala da interface"** (GUI scale). Faça o roteiro do PC **três vezes**:
- [ ] **Pequena** (o menor valor);
- [ ] **Média** (o valor do meio / padrão);
- [ ] **Grande** (o maior valor que a sua tela aceita).

No **celular**, faça uma vez com a escala padrão. Se der, repita com a escala maior.

---

### 11.1. Seleção de raça (mundo novo)

Para abrir: entre no mundo novo e use qualquer item do addon (ex.: o item de menu). A tela "Escolha sua raça" deve abrir.

#### 1.1 PC (repita nas 3 escalas: P / M / G)

| O que testar | P | M | G |
|---|---|---|---|
| A tela abre com o título **ESCOLHA SUA RAÇA** e o ícone **DU** em cima, sem cobrir o título. | [ ] | [ ] | [ ] |
| Aparecem as etapas **1 Raça · 2 Aparência · 3 Começar**, com a etapa 1 em destaque. | [ ] | [ ] | [ ] |
| Aparecem as **7 raças**, cada uma com ícone e nome: Terráqueo, Saiyajin, Namekuseijin, Frost Demon, Majin, Bio Androide, Glind. | [ ] | [ ] | [ ] |
| Os nomes compridos (**Namekuseijin**, **Bio Androide**, **Frost Demon**) **cabem** no cartão, sem cortar nem sair da borda. | [ ] | [ ] | [ ] |
| Clicar no ícone de uma raça **seleciona** essa raça: o cartão fica destacado (borda ciano, faixa dourada). | [ ] | [ ] | [ ] |
| Clicar na raça **já selecionada** não quebra nada (a tela só reabre). | [ ] | [ ] | [ ] |
| As **setas** ◀ ▶ trocam de raça. Da última, ▶ volta para a primeira, e da primeira, ◀ vai para a última. | [ ] | [ ] | [ ] |
| O **contador** "N / 7" muda junto com a raça. | [ ] | [ ] | [ ] |
| A **prévia ao vivo** mostra o personagem com a raça escolhida e muda ao trocar de raça. | [ ] | [ ] | [ ] |
| A prévia **não sai da caixa** e não fica cortada no meio do corpo. | [ ] | [ ] | [ ] |
| O nome e a descrição da raça aparecem inteiros, sem texto vazando para fora do painel. | [ ] | [ ] | [ ] |
| **BÔNUS DA RAÇA** aparece com ícone e valor (ex.: Saiyajin: Força x1.5). | [ ] | [ ] | [ ] |
| Aparecem **Regeneração**, **Transformações** (número) e **Escolha de gênero** (Sim/Não). | [ ] | [ ] | [ ] |
| **PRIMEIRAS FORMAS** e **PERSONALIZAÇÃO NA ETAPA 2** aparecem e não vazam. | [ ] | [ ] | [ ] |
| O botão **Aleatório** sorteia uma raça e abre a etapa de aparência com a aparência sorteada. | [ ] | [ ] | [ ] |
| O botão **Selecionar ⟨raça⟩** mostra o nome da raça certa e abre a etapa de aparência. | [ ] | [ ] | [ ] |
| O texto do botão **Selecionar Namekuseijin** (o nome mais longo) cabe no botão. | [ ] | [ ] | [ ] |

**Confira os dados de cada raça.** Escolha uma por uma e compare com a tabela. Se algum número for diferente, anote.

| Raça | Bônus | Regeneração | Transformações | Gênero | [ ] |
|---|---|---|---|---|---|
| Terráqueo | Ki Máximo x1.25, Poder de Ki x1.25 | x1.0 | 6 | Sim | [ ] |
| Saiyajin | Força x1.5 | x1.0 | 16 | Sim | [ ] |
| Namekuseijin | Constituição x1.5, Tamanho x1.05 | x1.6 | 6 | Não | [ ] |
| Frost Demon | Destreza x1.25, Poder de Ki x1.25, Tamanho x0.95 | x1.2 | **10** (a maquete diz 11; o jogo tem 10) | Não | [ ] |
| Majin | Constituição x1.25, Destreza x1.25, Tamanho x0.95 | x2.0 | 6 | Sim | [ ] |
| Bio Androide | Constituição x1.25, Força x1.25, Tamanho x1.05 | x1.7 | 7 | Não | [ ] |
| Glind | Força x1.25, Ki Máximo x1.15, Constituição x1.1, Poder de Ki x1.1 | x1.5 | 8 | Sim | [ ] |

#### 1.2 Etapa 2: aparência (customização)

- [ ] Depois de "Selecionar", abre a tela de aparência com a etapa **2** em destaque.
- [ ] Cada opção (Gênero, Barba, Olhos, Cabelo, Cor do cabelo, Pele…) tem setas ◀ ▶.
- [ ] Clicar várias vezes **rápido** na mesma seta **só avança**: nunca volta para a opção anterior.
- [ ] A prévia muda a cada clique.
- [ ] Fechar a tela com **X** ou **Esc** e reabrir **mantém** o que eu escolhi.
- [ ] Trocar o **gênero** e voltar mantém a escolha. As opções que só existem para um gênero (ex.: barba) somem e voltam certinho.
- [ ] O botão **Voltar** leva de volta à escolha de raça. Isso **zera** a aparência, e é o esperado.
- [ ] O botão **Confirmar** começa a aventura (etapa 3) e a raça escolhida fica salva.
- [ ] Nada de texto vazando nas linhas de opção, nem na escala Grande.

#### 1.3 Celular (escolha de raça)

- [ ] A tela abre inteira, sem precisar rolar para ver os botões principais.
- [ ] O título mostra **ESCOLHA SUA RAÇA** e "**Etapa 1 de 3**".
- [ ] As raças aparecem **só com ícone**, e o nome da raça escolhida aparece em destaque.
- [ ] Os ícones de raça são fáceis de tocar com o dedo, sem tocar o vizinho por engano.
- [ ] As setas ◀ ▶ e o contador "N / 7" funcionam.
- [ ] A descrição aparece na versão **curta** (uma frase).
- [ ] Bônus, Regeneração, Transformações e Gênero aparecem sem vazar.
- [ ] O botão **Mais detalhes** abre a descrição completa, as **Primeiras formas** e a **Personalização na etapa 2**.
- [ ] Tocar de novo (ou no fechar) **esconde** os detalhes. Isso acontece **na hora**, sem a tela piscar ou recarregar.
- [ ] **Selecionar ⟨raça⟩** funciona e o texto cabe no botão.
- [ ] **Aleatório** existe e funciona (se o layout do celular tiver esse botão; anote se não tiver).
- [ ] A prévia do personagem aparece e não fica cortada.
- [ ] A etapa 2 (aparência) funciona no celular: setas tocáveis, prévia mudando, Confirmar.

---

### 11.2. Menu principal (mundo antigo e mundo novo, depois de começar)

Para abrir: use o **item de menu**. Ele abre na última aba que você usou.

#### 2.1 Comum a todas as abas (PC, nas 3 escalas)

| O que testar | P | M | G |
|---|---|---|---|
| O ícone **DU** fica em cima do painel, **sem cobrir o título** e sem sair da tela. | [ ] | [ ] | [ ] |
| Na escala Grande, o ícone pode diminuir ou sumir, mas **não** fica cortado nem cobre o título. | [ ] | [ ] | [ ] |
| A lista de abas mostra **ícone + nome**: Estatísticas, Habilidades, Transformações, Missões, Treino, Conquistas, Notícias, e **Ajuda**. | [ ] | [ ] | [ ] |
| O nome **Transformações** (o mais comprido) cabe na aba. | [ ] | [ ] | [ ] |
| A aba aberta fica destacada (fundo mais claro, borda ciano, faixa dourada). | [ ] | [ ] | [ ] |
| Clicar em cada aba abre a tela certa, e o título muda para o nome dela. | [ ] | [ ] | [ ] |
| Passar o mouse por cima das abas e botões muda o visual (hover) e não deixa nenhum quadrado vazio ou textura faltando. | [ ] | [ ] | [ ] |
| O visual é liso, com cantos arredondados e borda ciano fina. Nada fica "quadriculado" ou esticado de um jeito feio. | [ ] | [ ] | [ ] |
| Fechar com **X** / **Esc** fecha o menu normalmente. | [ ] | [ ] | [ ] |

#### 2.2 Estatísticas (PC, nas 3 escalas)

| O que testar | P | M | G |
|---|---|---|---|
| No topo aparecem o **BP** (pontos de batalha) e os chips **Raça**, **Forma**, **Alinhamento**, **Mentor** com os valores certos do meu personagem. | [ ] | [ ] | [ ] |
| **NÍVEL** e o XP ("atual / próximo") estão certos. No mundo antigo, comparar com o que eu anotei. | [ ] | [ ] | [ ] |
| **ATRIBUTOS** mostra "N pontos livres" com o número certo. | [ ] | [ ] | [ ] |
| Os 5 atributos (Constituição, Destreza, Ki Máximo, Força, Poder de Ki) mostram ícone, valor, multiplicador (ex.: x1.5) e custo (ex.: 1 AP). | [ ] | [ ] | [ ] |
| São **3 botões separados**, **x1 / x10 / x100**. Clicar num deles destaca esse e a tela reabre com a nova quantidade (antes era um botão só, "Quantidade N"). | [ ] | [ ] | [ ] |
| A quantidade escolhida **continua** ao fechar e reabrir o menu na mesma sessão. | [ ] | [ ] | [ ] |
| Os 10 quadradinhos de XP enchem de acordo com o XP (ex.: 340/1200 = 2 cheios). Com o nível recém-subido, 0 cheios. | [ ] | [ ] | [ ] |
| Com treino ativo, o multiplicador de **Treino** (ex.: x2) aparece. Sem treino, ele não aparece. | [ ] | [ ] | [ ] |
| Com **x1**, clicar no **+** de um atributo gasta 1 ponto e soma 1 ao atributo. | [ ] | [ ] | [ ] |
| Com **x10** e **x100**, o + gasta 10 / 100. Com menos pontos que isso, nada acontece ou só gasta o que tem (anote qual dos dois). | [ ] | [ ] | [ ] |
| Cada **+** sobe **o atributo da mesma linha** (ex.: o + da Força sobe Força, não Destreza). Teste os 5. | [ ] | [ ] | [ ] |
| Com **0 pontos livres**, o + não faz nada e não dá erro. | [ ] | [ ] | [ ] |
| A **prévia do personagem** (SEU PERSONAGEM) aparece, segue o mouse e não sai da caixa. | [ ] | [ ] | [ ] |
| Em **Oozaru / Golden Oozaru** a prévia fica menor e o personagem aparece **inteiro**. | [ ] | [ ] | [ ] |
| **Dano**, **Defesa** e **Energia** aparecem com valores. | [ ] | [ ] | [ ] |
| O botão **Informações completas** abre a lista detalhada (Corpo, Defesa, Esquiva, Velocidade de voo…). A tela **não fica vazia**, aparece no layout de lista (não no layout novo das Estatísticas, com campos vazios), e as abas funcionam a partir dela. | [ ] | [ ] | [ ] |
| Usar o item de menu depois de ter fechado em "Informações completas" reabre essa mesma tela, e não uma tela vazia. | [ ] | [ ] | [ ] |
| Números grandes (nível 100+, atributo 1000+, BP com muitos dígitos) **não vazam** da caixa. | [ ] | [ ] | [ ] |

#### 2.3 Habilidades

- [ ] A tela mostra "Pontos de Habilidade" e a lista de habilidades.
- [ ] Clicar numa habilidade gasta pontos e sobe o nível. A **mesma** habilidade sobe, não a de cima ou a de baixo.
- [ ] Nomes compridos de habilidade não vazam.
- [ ] Sem habilidades disponíveis, aparece a mensagem de aviso, e não uma tela vazia.

#### 2.4 Transformações (agora é aba própria)

- [ ] A aba **Transformações** abre a lista de formas da minha raça.
- [ ] As formas bloqueadas mostram **cadeado**, e as liberadas não.
- [ ] Clicar numa forma liberada (com ki suficiente) **transforma**. Na bloqueada, nada acontece ou aparece um aviso.
- [ ] Os nomes e requisitos compridos não vazam.
- [ ] O botão antigo "Transformações" dentro de Habilidades, se ainda existir, abre a mesma tela.

#### 2.5 Missões

- [ ] A lista de missões aparece. Clicar numa abre os detalhes, com Iniciar/Reiniciar e voltar.
- [ ] Os nomes de missão compridos não vazam.

#### 2.6 Treino

- [ ] Aparecem "Sombra de treinamento" e "Treino de concentração" (se eu tiver tentativas).
- [ ] Cada botão faz o que diz.

#### 2.7 Conquistas

- [ ] A lista aparece com nome, progresso [P/100] ou "Concluído", e a descrição.
- [ ] Clicar numa abre os detalhes, e o voltar funciona.

#### 2.8 Notícias

- [ ] O texto de boas-vindas aparece inteiro.
- [ ] As **2 imagens** aparecem: a de **itens** (mais alta) e a do **chat** (faixa comprida).
- [ ] As imagens não ficam esticadas, cortadas ou por cima do texto.

#### 2.9 Ajuda / Guia

- [ ] A aba **Ajuda** (ícone "?", dourado, no rodapé da barra de abas) **abre a tela "Ajuda"**. Antes ela não fazia nada.
- [ ] Ao abrir, aparecem uma **introdução** e uma **lista de tópicos** (ex.: evoluir, transformações e ki, missões e mestres, Esferas do Dragão, planetas e Star Navigator, comandos).
- [ ] Clicar num tópico mostra o texto **daquele** tópico, e a lista continua visível para escolher outro.
- [ ] O Guia explica o básico em português (como abrir o menu, treinar, transformar, viajar…).
- [ ] As abas também funcionam a partir da Ajuda, e a aba **Ajuda** fica destacada.
- [ ] Os textos do Guia não vazam, e dá para rolar se for longo.
- [ ] Do Guia dá para voltar ao menu.
- [ ] Mude o jogo para **inglês** e **espanhol** e abra o Guia. O texto aparece traduzido, e não como uma chave do tipo `dbe.guide.algo`.

#### 2.10 Celular: menu

- [ ] As abas aparecem **só com ícone**, numa coluna, com a **Ajuda** separada embaixo (em dourado).
- [ ] Tocar numa aba muda o **título** para o nome dela (ex.: "TRANSFORMAÇÕES").
- [ ] Todas as abas são fáceis de tocar, sem acertar a vizinha.
- [ ] Estatísticas: aparecem **BP**, **Raça** e **Forma**, **NV**, XP e "N pontos livres".
- [ ] Os botões **x1 / x10 / x100** e os **+** têm **tamanho de dedo** e funcionam (mesmos testes do PC: cada + sobe o atributo da sua linha).
- [ ] O botão **Detalhes** mostra **Alinhamento, Mentor, Dano, Defesa, Energia**, o multiplicador de **Treino** (se houver) e o botão **Informações completas**. Tocar de novo esconde, **na hora**.
- [ ] Com Detalhes aberto, o botão **Informações completas** funciona.
- [ ] A prévia do personagem aparece (ou fica em Detalhes; anote onde está).
- [ ] Nenhum texto fica pequeno demais para ler, nem vaza.
- [ ] As outras abas (Habilidades, Transformações, Missões, Treino, Conquistas, Notícias com as 2 imagens, Ajuda) abrem e funcionam.
- [ ] Girar o aparelho ou abrir e fechar o teclado não quebra o layout.

---

### 11.3. Mundo antigo: nada foi perdido

- [ ] Raça, nível, pontos, forma, alinhamento e mentor estão **iguais** ao que eu anotei antes da atualização.
- [ ] A aparência do personagem (cabelo, cor, pele) continua igual.
- [ ] As missões em andamento e as conquistas continuam lá.
- [ ] O barbeiro (item de trocar cabelo) ainda funciona: as setas não voltam, e em Oozaru a prévia fica pequena.
- [ ] Os outros formulários que não fazem parte do redesign (loja, NPCs, Shenlong, máquina de gravidade, funções) abrem normais, **sem** o ícone DU e sem layout quebrado.

### 11.4. O que enviar de volta

1. Este arquivo com as caixas marcadas, ou uma lista do que ficou **[ ]**.
2. Os prints, com o nome dizendo onde: ex. `pc_grande_estatisticas.png`, `celular_racas_detalhes.png`.
3. O Content Log, se apareceu algum erro em vermelho ou amarelo do Dragon Universe.

---

