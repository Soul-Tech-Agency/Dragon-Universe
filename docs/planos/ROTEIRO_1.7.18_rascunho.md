# 1.7.18: rascunho do roteiro de teste (vai sendo montado conforme as entregas)

## O1 (lista duplicada, 74c095b)
- [ ] Absorção do Majin funciona
- [ ] Câmera nas transformações e no Instinto Superior
- [ ] Troca de dimensão pelo núcleo (Overworld/Nether/End)

## O2a voo (02b2924)
- [ ] Voar parado 60 s, depois segurar/soltar o pulo várias vezes: animação normal/rápido e velocidade trocam no mesmo instante; comparar o tremor em vídeo com a 1.7.17
- [ ] Sonda dbe:perf, 1 jogador voando parado: setProperty/s ~1
- [ ] Pegar/soltar peso e entrar na máquina de gravidade voando: a velocidade muda em até 1 s
- [ ] Pousar e voltar a voar 5x (inclusive toque duplo logo após pousar): velocidade certa desde o início, nenhuma montaria órfã (/testfor @e[type=dbe:player_fly])
- [ ] Star Navigator com voo ligado: desliga na troca e religa no destino
- [ ] Morrer voando: depois do respawn a animação não fica presa e o voo religa
- [ ] Sair do mundo voando e entrar de novo: sem animação presa
- [ ] Virar Oozaru voando: o voo desliga e a animação sai do voo
- [ ] Fusão voando; reset do personagem no Outro Mundo voando
- [ ] Voar na água, normal e rápido
- [ ] Dois jogadores voando ao mesmo tempo, sem interferência

## Moradores 1/4 (5c66fdd + 1379748), roteiro completo em MORADORES_DETALHE §7
- [ ] Ir e voltar do planeta do Bills 6x sem 'removed duplicate' no log
- [ ] /kill em Bills/Whis 6x aciona o freio (5 em 10 min)
- [ ] Rebuild do planeta mantém um de cada

## Moradores 2/4 e 3/4 (26fd295, e45908f)
- [ ] Torneio em mundo novo: 1 locutor só
- [ ] CÓPIA de mundo 1.7.16/17 com locutor: continua 1 e o log mostra 'adopted'; repetir chegando rápido (teleporte direto para o Torneio)
- [ ] 3 engenheiros dentro da cúpula da Cápsula, com diálogo
- [ ] Grande Patriarca no tapete da Casa do Guru, sem cair
- [ ] Mundo antigo: Bills e Whis somem do Palácio de Kami (uma vez só) e continuam no planeta do Bills

## Arena do Torneio do Poder
- [ ] Teste de cor da névoa (já dá para fazer na 1.7.17 com o RP novo): /fog @s push dbe:fog_tournament_of_power teste (variantes _b e _c); voltar com /fog @s remove teste

## O2b propriedades (0430255)
- [ ] Transformar e destransformar rápido (2 trocas em menos de 1 s): visual, aura, cor e som terminam no estado certo
- [ ] Kamehameha: carregar, soltar e carregar de novo logo em seguida; a pose não fica presa
- [ ] Defender com toques rápidos no slot 9, e NPC defendendo: a pose acompanha
- [ ] Kaioken e Instinto Superior: ligar e desligar
- [ ] Fusão e desfusão; morrer, Outro Mundo e voltar; nocaute do Punho Amigável e recuperação
- [ ] Criar personagem (raça, gênero, corpo, customização); barbeiro com 3 trocas seguidas
- [ ] Sair transformado, voando e com a armadura escondida, e entrar de novo: tudo volta certo
- [ ] Reset do personagem no Outro Mundo e escolher outra raça: sem visual da raça antiga
- [ ] Sonda dbe:perf: setProperty/s ~0 parado, ~1 voando
- [ ] 2 jogadores: um transformando enquanto o outro defende, sem vazar de um para o outro

## Oozaru nas prévias (28fb62b + 5ba9258), teste A/B em docs/wip/TESTE_AB_OOZARU_1.7.18.md
- [ ] Os 6 itens do documento
- [ ] A cauda não é cortada na caixa quando a prévia gira
- [ ] Se o Oozaru sumir das telas: reverter OS DOIS commits juntos

## Ícones das telas (item 12)
- [ ] Listas de missões e conquistas com ícone e cor certos (precisa do script da Bússola no mesmo build)
- [ ] Os títulos longos não são cortados (a coluna de ícone some quando não há ícone)
- [ ] Névoa: no celular com 6–8 chunks, o lado oposto do ringue continua legível do centro; céu preto com horizonte azulado nas 3 variantes; /fog @s remove teste volta à dbe:fog_space
- [ ] CÓPIA de mundo 1.7.15–1.7.17, chegando ao Palácio de Kami: Bills e Whis somem uma vez ('moved' no log); Popo, Kami, Piccolo, Korin, Bulma e Máquina do Tempo intactos
- [ ] Voltar ao Palácio outro dia: nada novo acontece
- [ ] Mundo novo: o Palácio nasce sem Bills e Whis
- [ ] Depois de passar pelo Palácio, o planeta do Bills continua com 1 de cada
- [ ] **Stack_panel recolhe os invisíveis?** Com o script ANTIGO (sem ícone), as linhas de missões e conquistas ficam iguais às da 1.7.17, sem um recuo de ~19 px antes do texto. Se o recuo aparecer, o stack não recolhe controles invisíveis; avisar a Engrenagem, porque o detalhe de missão (12c) usa o mesmo recurso.
- [ ] Transformações bloqueadas com o cadeado du2 cinza-azulado (12b)
- [ ] Customização e barbeiro (12d): em cada linha, ícone, nome e "n/total" entre as setas; o valor muda ao clicar nas setas; no celular a lista rola
- [ ] Habilidades (12e): cabeçalho "Pontos de habilidade N" com ícone; habilidade no máximo com o ícone dourado no lugar do "+"
- [ ] Detalhe de missão (12c):
  - título com ícone do tipo; tipo e nível recomendado; descrição;
  - objetivos com ✓ verde nos concluídos; requisitos; recompensas com ícone (item, pontos, zeni);
  - espera e erro em linhas próprias;
  - sem buracos entre as seções, numa missão com 1 objetivo e 1 recompensa;
  - `pirate_robot_treasure` (8 recompensas) e `saga_saiyan_2` (8 objetivos) rolando inteiros no PC e no celular
- [ ] Detalhe de conquista (mesma tela): continua mostrando o texto inteiro, como antes
- [ ] CÓPIA de mundo 1.7.16/17 com locutor, teleporte direto para o Torneio: 1 locutor; no log 'adopted' (ou 'adopted ... next to a copy' + 'removed duplicate x1'); reabrir continua 1; a fila do Torneio abre ao interagir
- [ ] Sair do mundo antes do Palácio de Kami carregar e voltar: a remoção de Bills e Whis acontece na visita seguinte
- [ ] Telas com o script ANTIGO: customização com 3 e com 7 opções, barbeiro, habilidades e detalhe de missão e de conquista, sem nada deslocado em relação à 1.7.17
- [ ] Telas com o script NOVO: missão com 8 objetivos (saga_saiyan_2) e 8 recompensas (pirate_robot_treasure), habilidade no máximo e cabeçalho de pontos, no PC e no celular

## Guardas (ec36dba)
- [ ] Casa do Yamcha com 2 Ladrão-Urso, Red Ribbon com 3 Battle Jacket, Base do Freeza com 5 soldados
- [ ] Matar todos: voltam depois de 30 min de jogo, sem passar do número
- [ ] Matar guardas conta nas missões de derrotar
- [ ] Red Ribbon: os 3 Battle Jacket aparecem, sem erro no log
- [ ] Matar os guardas à medida que nascem: não vira fazenda (no máximo o número da construção por lote)
- [ ] Não há reposição antes de 30 min (dormir adianta, é esperado)
- [ ] Balanceamento: Ladrão-Urso natural agora é nível 12 também (bioma dirtstone/deserto perto do spawn); Battle Jacket some 60 s depois de ficar bravo (comportamento antigo)

## O2c cápsula 991 (40cb2fc)
- [ ] /summon dbe:capsule_991, montar, andar, subir e descer rampa: a inclinação segue o terreno como na 1.7.17
- [ ] Nenhum texto Center/Speed na action bar
- [ ] Descer e dar /kill na cápsula: /testfor @e[type=dbe:location] = 0 depois de 2 ticks
- [ ] Invocar 5, montar e desmontar em cada uma, /kill @e[type=dbe:capsule_991]: a sonda dbe:perf volta ao número de intervalos do começo
- [ ] Montado, afastar até o chunk descarregar e voltar: montar de novo funciona
- [ ] Matar a cápsula com alguém montado: nenhum erro no log

## O2e colisão de ki (3789603)
- [ ] **OBRIGATÓRIO, A/B contra a 1.7.17:** dois jogadores trocando Kamehameha de frente. Se na 1.7.17 as rajadas atravessam e na 1.7.18 se empurram, a colisão antiga estava quebrada e isso é mudança de jogabilidade: avisar antes de lançar
- [ ] Genki Dama contra rajada pequena: a pequena é arrastada
- [ ] 6 a 12 Ki Blasts ao mesmo tempo: sem erro; a sonda mostra o hub mais rápido
- [ ] Ataque no Nether e outro no Overworld nas mesmas coordenadas: não interagem
- [ ] Ataque grande puxa de mais longe que um pequeno
- [ ] Ataque que bate num bloco com outro perto: sem erro, e as Esferas do Dragão continuam atualizando

## O2d intervalo de habilidades (662128d)
- [ ] Vila de Vegeta ou Freeza carregada: menos intervalos vivos e ms/tick menor na sonda, sem erro
- [ ] Personagem novo: as skills padrão (voo, aura, ki blast) funcionam logo, sem sair do mundo
- [ ] Goku inimigo e Raditz atacam e transformam como antes; Kaioken e aura drenam ki igual
- [ ] Comprar a 1ª skill num treinador: funciona na hora (toggle e passiva)
- [ ] Reset no Outro Mundo e nova raça: skills funcionam
- [ ] Fusão: skills da fusão funcionam
- [ ] Treino de concentração e sombra de treino sem erro
- [ ] A maestria decai com a skill ligada (o % cai)
- [ ] Cápsula 991 montada perto do vazio ou de lava, ou /kill @e[type=dbe:location] enquanto ela anda: /testfor @e[type=dbe:location] volta a 0, sem erro
- [ ] Ki Blast que bate num bloco no mesmo tick em que um ataque maior o puxa: sem erro, e as Esferas do Dragão continuam atualizando
- [ ] Arena do Torneio do Poder (mundo novo): piso em pedra clara, anel dourado contínuo em volta do centro (print de cima e rente ao piso)
- [ ] Luz da arena: agora só há 3 sea_lanterns; conferir de noite e embaixo do ringue. Se escurecer demais, entram lâmpadas no piso
- [ ] Migração da arena em 3 mundos (CÓPIAS): novo; arena pela metade; arena inteira. Nos antigos: recolore aos poucos, a luz invisível some, o anel aparece, sem travadas (watchdog), sem retalho
- [ ] Fechar o mundo no meio da migração e voltar: continua de onde parou
- [ ] /scriptevent dbe:tournament_of_power_rebuild (operador): recoloca tudo; não-operador não consegue

## (1.7.19) HUD dos treinos — testar quando o script existir
- [ ] Durante o treino, gastar ki: o número da barra de ki não atrasa
- [ ] Segunda sessão de treino: o painel não reabre com os números da anterior
- [ ] Posição em celular pequeno 16:9 e 20:9, com controles de toque clássicos e novos, efeito de poção ativo e interface no máximo
- [ ] 1ª visita à arena num mundo antigo: medir FPS/TPS (dbe:perf) com 2 jogadores durante a migração (recálculo de luz de ~1,34 milhão de blocos); tempo da 1ª visita: ____
- [ ] Nenhuma luz invisível sobrando (ver no escuro); reabrir no meio termina e grava a marca 2
- [ ] Corporação Cápsula em mundo novo: 'CAPSULE' legível na fachada oeste, letras regulares e sem letra espelhada (print). Cápsulas antigas não mudam (esperado)

## Planeta do Bills (preparação 1.7.19)
- [ ] Rebuild do planeta 2x seguidas: nenhuma entidade nova duplicada
- [ ] Peixes do aquário e almofadas da mesa voltam por script, um de cada
- [ ] Rebuild do planeta do Bills e do TP (operador): pede confirmação repetindo o comando em 10 s; não-operador não consegue; jogador dentro do planeta durante o rebuild não sufoca nem cai
- [ ] Mundo novo: 5 peixes com as cores originais no aquário e 2 almofadas na mesa
- [ ] CÓPIA de mundo antigo com duplicatas: a limpeza loga 'removed N' uma vez e sobra 1 de cada
- [ ] Os peixes nadam sem 'pular' de volta
- [ ] Risco aceito (permanente): peixe sem tag solto pelo jogador a até 4 blocos do aquário, ou almofada a até 2 da mesa, é adotado e o excedente removido
- [ ] Rebuild com 2 operadores: a confirmação de um não vale para o outro; esperar mais de 10 s e ver que não executa
- [ ] Rebuild com um jogador num buraco e outro numa torre: os dois vão para o spawn da dimensão antes, sem dano
- [ ] Depois do rebuild: 1 de cada morador

## Habilidades (85fdc0b..2dbd8ff — integrar SEMPRE até o 2dbd8ff)
- [ ] Estatísticas: BP e Força antes e depois de subir o Desbloqueio de Potencial (muda na hora, sem reabrir)
- [ ] BP na Mística com o Desbloqueio no nível 1 e no 10; a Bestial continua bloqueada abaixo do nível 10
- [ ] Personagem antigo com o Desbloqueio no nível 10 já mostra o bônus máximo ao entrar
- [ ] Sentir Ki SEM bônus (Força igual antes e depois de subir)
- [ ] Majin e Namek com a Taxa de Regeneração 25% maior (cronometrar a volta da vida); Terráqueo sem mudança; a Senzu cura igual
- [ ] Limitador fora de todas as lojas e funcionando em quem já tem; /dbe:learn @s limiter
- [ ] Inimigos podem transformar um degrau antes contra quem tem o Desbloqueio alto (a IA usa o BP)
- [ ] Peixe tirado da água com balde volta ao aquário
- [ ] Rebuild do TP com 2 jogadores
- [ ] (1.7.19) HUD: os números do train_vals alinhados com as legendas (5 linhas na concentração); 3 modos do HUD no celular pequeno com botões de toque; lista do treino mental com 39 chefes rolando
- [ ] Planeta do Bills: pôr um bloco no ponto de chegada e cavar o piso embaixo, confirmar o rebuild: todos aparecem em pé no ponto de chegada, sem dano
- [ ] (1.7.19) Treino mental: sair por vitória, derrota, morte, /tp para outra dimensão e logout/login; a névoa roxa some e a da dimensão volta; aura acompanha um chefe rápido (Freeza, Cell)

## (1.7.19) Palácio do Bills
- [ ] Mundo antigo: a árvore central sai sem tocar no teto da sala de jantar nem no arco de mangue ao norte; o palácio só aparece depois
- [ ] Mundo novo: chão liso e sem buraco no lugar da árvore

## O3-0 piloto Namek (dcfbc11) — se passar, libera o resto do O3
Preparar: CONFIG.DEBUG_PERF = true e reabrir o mundo.
- [ ] /scriptevent dbe:perf start, 60 s parado no spawn, report: 'every namek.scan' ~300 chamadas e 'every namek.villages' ~12; intervalos vivos com 2 a menos que a 1.7.17 no mesmo mundo (7 a menos com o O3-12 junto; o relógio não entra na conta); getPlayers/s aparece
- [ ] Ir a Namek e voltar 3 vezes: a névoa entra e sai
- [ ] Em Namek, voar para longe: o terreno é gerado à frente como antes
- [ ] Cair num buraco de chunk não gerado: volta à superfície
- [ ] Mundo novo: perto de uma vila, os namekianos aparecem em até 5 s depois do chão e não duplicam ao sair e voltar
- [ ] Pod de Namek e scriptevents de Namek funcionando
- [ ] /reload no meio: tudo continua e o report mostra UM intervalo do relógio
- [ ] 10 min sem '[scheduler] tarefa ... falhou' e sem watchdog
- [ ] 2 jogadores (Namek e Overworld) por 5 min: névoa e geração funcionam para quem está em Namek

## Desempenho da UI (Engrenagem, planos/UI_DESEMPENHO.md)
- [ ] A/B de FPS no celular com o 0c122ef (barras do HUD agrupadas) e sem ele; se piorar, reverter só esse
- [ ] Telas e HUD com visual idêntico ao da 1.7.17
- [ ] (1.7.19) CÓPIA com o planeta do Bills inteiro e outra pela metade: a árvore some (pode aparecer alguns segundos na chegada), o chão fica liso, o teto da sala e o arco ficam intactos; reabrir no meio termina e grava a versão 2
- [ ] A/B do 6bb3656 (listas com o conteúdo numa camada): texto e ícones no lugar, hover/pressionado visível, '+' das Habilidades, toque sobre o texto aciona, FPS rolando a lista. Se falhar: git revert 6bb3656

## O3-12 tarefas gerais no relógio (c3d9e10, 979ec9f)
- [ ] Sonda 60 s: 'every core.clear_lag' ~1200; 'every core.terrain_queue' ~40; data/cooldown/region_cleanup 1 cada (120 s para ver 2); sem linha 'interval(1) scheduler.js'
- [ ] Clear lag: avisos nos tempos de sempre e limpeza a cada 15 min
- [ ] Voar em Vegeta ou Freeza: chunks novos gerados como antes
- [ ] 60 min com 2 jogadores entrando e saindo: sem crescimento de memória ou lag
- [ ] /reload: um relógio só, avisos do clear lag sem duplicar
- [ ] (se CUSTOM_CHAT ligado) mensagem a cada 3 min
- [ ] (1.7.19) Palácio: a escada interna sobe para leste e liga ao salão; luz dos andares; Bills e Whis no terraço com o palácio completo
- [ ] (1.7.19) Escada interna do palácio sobe para leste (+x); se estiver invertida vira parede de degraus. Descer e subir nos dois sentidos
- [ ] (1.7.19) Dentro da sala de jantar, a escada corta o tronco de mangue, uma placa e tijolos de lama perto de x=5..8 (esperado); Aquarela confere a aparência
- [ ] (1.7.19) Mundo novo: ilha, depois palácio, Bills e Whis no terraço; CÓPIA 1.7.18: migração da árvore, palácio, e os dois sobem da sala; rebuild: voltam à sala e depois sobem

## O3 Marco (guardado até o piloto): landmarks, arenas, residents
- [ ] /scriptevent dbe:landmarks report: marcos aparecem ao chegar perto
- [ ] Arenas do Bills e do TP: peças carregam perto, sair sem chave, cair volta
- [ ] Moradores nos lugares depois de sair e entrar
- [ ] Sonda 60 s: 'every landmarks.scan' ~30, cada arena ~120, 'every residents' ~60; intervalos vivos 4 a menos (landmarks 1 + arenas 2 + residents 1)

## Decisão 30 (32bf9a3, 7c23c5e) — só depois da confirmação do usuário
- [ ] Vegeta e Trunks DMZ em SSJ3: juba nas costas de frente, de lado e de trás; correndo balança e não atravessa o corpo
- [ ] Beast do Vegeta igual ao de hoje
- [ ] Beast Flare A sem os cubinhos, com a forma geral igual
- [ ] SSJ/SSJ2/Blue do Flare A e SSJ/SSJ2 do Vegeta e do Trunks iguais à 1.7.18

## (1.7.19) O4.0 ligação tardia (781eebf..e76a098)
- [ ] Mundo existente e novo (criação de personagem); sair e entrar com 2 jogadores
- [ ] Combate corpo a corpo e com ki contra NPC; morrer, Outro Mundo e voltar
- [ ] Transformar e destransformar; menus de status, skills, missões e conquistas
- [ ] Comprar skill com requisito faltando (mensagem) e uma que cumpre
- [ ] Movimento Rápido (teleporte ao alvo); missão do Power Pole
- [ ] Star Navigator, voltar à Terra e viagem do torneio
- [ ] Fusão; Sentir Ki avisando NPC mais forte; sombra de treino
- [ ] 10 min sem erro no log
- [ ] Sonda 1.7.18 x O4.0 com aura + Kaioken numa vila de Vegeta: p95 do tick não sobe mais de 0,2 ms

## O3 completo (guardado: viagens O3-0/O3-12, marcos O3-7..11 + 75158a4, menus-o3 O3-1..6)
Integração: juntar os 3 e o compare contra a base antes deles tem que dar IDÊNTICO na ordem. Sonda: intervalos vivos 21 a menos que a 1.7.17 (20 com o chat desligado).
- [ ] Espaço: lançar em y 500 do Overworld, Namek e Kaioshin; entrar na esfera de um planeta; cair abaixo de y 30 volta à estação; efeitos dos planetas
- [ ] Kaioshin: névoa, chunks novos, resgate de queda
- [ ] Outro Mundo: entrar no planeta do Kaio e cair para o Inferno, 3 vezes cada, nunca viagem dupla
- [ ] Kai/Kaioshin: subir até y 300 vindo do Outro Mundo volta, sem lançar ao espaço
- [ ] Inferno: névoa, ambiente, fuga pelo topo, chunks
- [ ] Vilas: bater num aldeão, golems atacam, a tag sai em 5 min; golem demoníaco fora do Inferno some em até 10 s
- [ ] Universo 6: névoa, Goku presente, queda volta ao spawn
- [ ] 2 jogadores em dimensões diferentes por 5 min
- [ ] Sonda: space/kaioshin/hell ~300 por minuto, kai 240, universe6 120, golem_memory 12, demon_golems 6

## (1.7.19) Registro de chefes derrotados (1744f5b, f009ae2)
- [ ] Save antigo com a saga Saiyajin concluída: /scriptevent dbe:bosses lista Raditz, Nappa e Vegeta
- [ ] Save com a saga_beerus_1 concluída: o Beerus NÃO aparece (luta de sobrevivência)
- [ ] Matar um chefe de missão marca; matar de novo mostra x2; Saibaman não marca
- [ ] Kill em grupo: só quem deu o golpe final ganha o registro (o outro jogador não)
- [ ] Chefe com a tag dbe:mental_replica (/tag @e[type=dbe:raditz] add dbe:mental_replica) morto não marca
- [ ] Sair e entrar: o registro continua
