# 1.7.18: roteiro de teste

Montado em 2026-11-22 a partir de `docs/planos/ROTEIRO_1.7.18_rascunho.md` e dos testes pedidos nas revisões de cada frente: viagens/núcleo e habilidades (Bússola), construções e moradores (Marco), menus (Engrenagem) e visual (Aquarela).
Marque cada item com **Y** (funcionou), **N** (falhou) ou **?** (não testado ou não deu para saber). Quando falhar, mande print ou vídeo, Content Log, dimensão e coordenadas.
Nada aqui foi testado no Minecraft pela equipe. O que tem a marca (1.7.19) no rascunho ficou fora daqui, porque ainda não tem script (veja o README).

## Quem e onde
- ⚠️ **Teste sempre numa CÓPIA do mundo.** Um mundo aberto na 1.7.18 não deve voltar para a 1.7.17:
  - a arena do Torneio do Poder é recolorida;
  - Bills e Whis saem do Palácio de Kami;
  - a 1.7.17 não conhece os moradores novos.
- ⚠️ Os testes **A/B** pedem os dois pacotes instalados em separado: 1.7.17 (`Dragon-Universe-1.7.17-teste`) e 1.7.18. Use o **mesmo mundo copiado duas vezes**: uma cópia para cada versão.
- ⚠️ **Sonda de desempenho (`dbe:perf`):** vem desligada. Para os itens marcados com 📊:
  1. No pack de comportamento **instalado**, abra `scripts/config/config.js` e troque `DEBUG_PERF: false` por `DEBUG_PERF: true`.
  2. Feche e reabra o mundo.
  3. Use `/scriptevent dbe:perf start` (zera e começa a medir), `/scriptevent dbe:perf report` (mostra os números) e `/scriptevent dbe:perf stop`.
  4. Copie o report para o resultado.
  5. Volte para `false` antes dos testes de FPS (a sonda pesa um pouco).
- Testador · PC Windows ☐ · Android ☐ (modelo: ____) · **versão exata do Minecraft: ____** · data
- Content Log File e GUI ligados · Beta APIs ligado.
- Mundos: um mundo NOVO + CÓPIAS de mundos salvos da 1.7.15, 1.7.16 ou 1.7.17. Para a arena: uma cópia em que a arena do Torneio do Poder já foi visitada **pela metade** e outra com ela **inteira**.
- Dois jogadores para os itens marcados com 👥.

## 1. Abre?
- [ ] O mundo novo carrega. Primeiro erro do log, se houver: ____
- [ ] A cópia do mundo antigo carrega. Primeiro erro do log, se houver: ____
- [ ] 10 min jogando sem `[scheduler] tarefa ... falhou` e sem watchdog / `slow script` no log

## 2. OBRIGATÓRIOS (A/B contra a 1.7.17)

### 2.1 Rajadas de ki 👥 (O2e: decide se a 1.7.18 pode sair)
Mesmo lugar, mesmas duas pessoas e a mesma cópia de mundo nas duas versões.
- [ ] **1.7.17:** dois jogadores trocam Kamehameha de frente. As rajadas se empurram ou se atravessam? ____ (gravar vídeo)
- [ ] **1.7.18:** o mesmo. Se empurram ou se atravessam? ____ (gravar vídeo)
- [ ] Se na 1.7.17 elas **atravessam** e na 1.7.18 **se empurram**, a colisão antiga estava quebrada e a 1.7.18 muda a jogabilidade. **Avise antes de lançar.**
- [ ] Genki Dama contra rajada pequena: a pequena é arrastada
- [ ] Ataque grande puxa de mais longe que um pequeno
- [ ] 6 a 12 Ki Blasts ao mesmo tempo: sem erro no log. 📊 o hub de ataques aparece mais rápido no report
- [ ] Ataque no Nether e outro no Overworld nas mesmas coordenadas: não interagem
- [ ] Ataque que bate num bloco com outro perto: sem erro, e as Esferas do Dragão continuam atualizando
- [ ] Ki Blast que bate num bloco no mesmo tick em que um ataque maior o puxa: sem erro

### 2.2 Oozaru nas prévias (A = 1.7.17, B = 1.7.18)
Personagem Saiyajin com rabo, com nível para Oozaru e Golden Oozaru. Faça cada linha em A e em B, nas formas **base**, **Oozaru** e **Golden Oozaru**, e tire print.

| # | Tela | Esperado em B | A (anotar) | B |
|---|---|---|---|---|
| 1 | Inventário (E), prévia à esquerda | Oozaru/Golden **inteiro dentro da caixa preta**, sem cobrir armaduras e slots | vaza (conhecido) | [ ] |
| 2 | Estatísticas (menu DU) | corpo inteiro, do tamanho de um jogador comum | prévia pequena | [ ] |
| 3 | Customização e barbeiro | corpo inteiro, nada cortado | prévia pequena | [ ] |
| 4 | Mundo em terceira pessoa (F5), **com o inventário aberto** | o Oozaru **não** encolhe no mundo | normal | [ ] |
| 5 | Forma base e SSJ nas telas 1–3 | iguais à 1.7.17 | — | [ ] |
| 6 | Sair do Oozaru com o inventário aberto e reabrir | a prévia volta ao tamanho normal | — | [ ] |
| 7 | Estatísticas e customização: **girar a prévia** (mouse ou dedo) em Oozaru e Golden, de lado e de trás | a cauda inteira dentro da caixa (a ponta pode encostar na borda: anotar) | — | [ ] |

- **Se em B o Oozaru SUMIR de alguma prévia** (como aconteceu na 1.7.14) ou **encolher no mundo** (linha 4): avise. A correção é reverter `28fb62b` e `5ba9258` **juntos, nunca só um**.
- Se só a linha 7 falhar, é aceitável; mande print de lado.

### 2.3 FPS no celular (barras do HUD, `0c122ef`)
Celular fraco, sonda **desligada**. Mesmo mundo, parado, olhando para o mesmo lugar e sem treino ativo. Meça com o contador de quadros do Android (Opções do desenvolvedor → "Perfil de renderização da GPU" ou "Mostrar FPS", conforme o aparelho).
- [ ] FPS na 1.7.17: ____ · FPS na 1.7.18: ____ (média de 1 min em cada)
- [ ] Se a 1.7.18 for **pior**, avise: reverte-se só o `0c122ef`.
- [ ] Visual das barras igual à 1.7.17: vida, estamina, ki (trocar de cor transformando) e carga, cheias, vazias e pela metade (print das duas versões)

### 2.4 Listas dos menus (`6bb3656`) no PC e no celular
Compare com a 1.7.17, lado a lado, em Missões, Conquistas, Treino, Transformações, Guia e Habilidades:
- [ ] Texto e ícones no mesmo lugar
- [ ] Passar o mouse e apertar muda o fundo, e o texto e os ícones continuam visíveis por cima
- [ ] **Tocar ou clicar em cima do texto** aciona a linha (não só nas bordas)
- [ ] Habilidades: o "+" com fundo dourado no hover; habilidade no máximo com o ícone dourado no lugar do "+"
- [ ] FPS rolando a lista de Missões até o fim e voltando: 1.7.17 ____ · 1.7.18 ____
- [ ] Se algo falhar (texto escondido pelo fundo, toque que não pega sobre o texto), avise: reverte-se só o `6bb3656`.

## 3. Mundo antigo (CÓPIA de 1.7.15–1.7.17)
- [ ] Chegar ao Palácio de Kami: Bills e Whis somem **uma vez** (`moved` no log). Popo, Kami, Piccolo, Korin, Bulma e a Máquina do Tempo continuam lá.
- [ ] Voltar ao Palácio outro dia: nada novo acontece.
- [ ] Sair do mundo antes de o Palácio carregar e voltar: a remoção acontece na visita seguinte. Sair em menos de 1 min da chegada: Bills e Whis não ficam lá para sempre.
- [ ] Depois de passar pelo Palácio, o planeta do Bills tem 1 Bills e 1 Whis.
- [ ] Mundo com locutor no Torneio, chegando por teleporte direto ao Torneio: continua **1 locutor**. O log mostra `adopted` (ou `adopted ... next to a copy` + `removed duplicate x1`). Reabrir: continua 1. A fila do Torneio abre ao interagir.
- [ ] Mundo com duplicatas no planeta do Bills: a limpeza loga `removed N` uma vez e sobra 1 de cada (peixes, almofadas, suportes).
- [ ] Personagens, construções do jogador, missões e conquistas intactos.

## 4. Voo e estados do personagem (O2a, O2b)
- [ ] Voar parado 60 s e depois segurar/soltar o pulo várias vezes: a animação normal/rápida e a velocidade trocam no mesmo instante. **Vídeo comparando o tremor com a 1.7.17.**
- [ ] 📊 1 jogador voando parado: setProperty/s ~1; parado no chão: ~0
- [ ] Pegar/soltar peso e entrar na máquina de gravidade voando: a velocidade muda em até 1 s
- [ ] Pousar e voltar a voar 5x (inclusive toque duplo logo depois de pousar): velocidade certa desde o início. `/testfor @e[type=dbe:player_fly]` não acha montaria órfã
- [ ] Star Navigator com o voo ligado: desliga na troca e religa no destino
- [ ] Morrer voando: depois do respawn, a animação não fica presa e o voo religa
- [ ] Sair do mundo voando e entrar de novo: sem animação presa
- [ ] Virar Oozaru voando: o voo desliga e a animação sai do voo
- [ ] Fusão voando; reset do personagem no Outro Mundo voando
- [ ] Voar na água, normal e rápido
- [ ] 👥 Dois jogadores voando ao mesmo tempo, sem interferência
- [ ] Transformar e destransformar rápido (2 trocas em menos de 1 s): visual, aura, cor e som terminam no estado certo
- [ ] Kamehameha: carregar, soltar e carregar de novo logo em seguida; a pose não fica presa
- [ ] Defender com toques rápidos no slot 9, e NPC defendendo: a pose acompanha
- [ ] Kaioken e Instinto Superior: ligar e desligar
- [ ] Fusão e desfusão; morrer, ir ao Outro Mundo e voltar; nocaute do Punho Amigável e recuperação
- [ ] Criar personagem (raça, gênero, corpo, customização); barbeiro com 3 trocas seguidas
- [ ] Sair transformado, voando e com a armadura escondida, e entrar de novo: tudo volta certo
- [ ] Reset no Outro Mundo escolhendo outra raça: sem visual da raça antiga
- [ ] 👥 Um jogador transformando enquanto o outro defende: nada vaza de um para o outro

## 5. Telas novas do menu (item 12)
- [ ] **Missões:** cada missão com ícone e cor do tipo (principal dourada, secundária ciano, desafio laranja, mentor roxo); bloqueada com cadeado cinza; concluída com ✓ verde
- [ ] **Conquistas:** ícone pela categoria; concluídas com a medalha verde
- [ ] Títulos longos de missão e de conquista não são cortados antes da hora
- [ ] **Transformações:** bloqueadas com o cadeado du2 cinza-azulado
- [ ] **Habilidades:** cabeçalho "Pontos de habilidade N" com ícone; o número muda ao comprar um nível; sem habilidades para melhorar, só o aviso
- [ ] **Customização e barbeiro:** em cada linha, entre as setas, aparecem o ícone, o nome e "n/total". O valor muda ao clicar nas setas. Com 3 e com 7 opções (troque de raça e gênero), nada desloca. No celular, a lista rola e o toque acerta a seta certa.
- [ ] **Detalhe de missão:**
  - título com o ícone do tipo; tipo e nível recomendado; descrição;
  - objetivos; requisitos (quando houver);
  - recompensas com ícone: item (baú), pontos (brilho), zeni (moeda), **XP (ícone "XP" ciano)**;
  - tempo de espera e erro de início em linhas próprias;
  - numa missão com 1 objetivo e 1 recompensa, sem buracos entre as seções;
  - `saga_saiyan_2` (8 objetivos) e `pirate_robot_treasure` (8 recompensas) rolam inteiras no PC e no celular;
  - Iniciar/Reiniciar só aparece quando dá para usar.
- [ ] **Detalhe de conquista** (mesma tela): continua mostrando o texto inteiro, como antes
- [ ] **Abas:** a aba certa fica acesa em cada tela. Passar o mouse ou o dedo e apertar mostra os mesmos fundos de antes.
- [ ] **Barra de XP das Estatísticas:** com XP em 0, metade e quase cheio, enchem 0, 5 e 9 quadradinhos (de 10)
- [ ] Em inglês e espanhol: nenhuma chave crua (`ui.dbe...`, `quest....single`)

## 6. Moradores e guardas
- [ ] Mundo novo, 1ª chegada ao planeta do Bills: Bills e Whis à mesa, olhando para a chegada. `/scriptevent dbe:residents` mostra `ok`.
- [ ] Ir e voltar do planeta do Bills 6x: continua 1 de cada, sem `removed duplicate` repetido no log
- [ ] `/kill` em Bills ou Whis 6x: depois da 5ª para de recriar e o log avisa. Reabrir o mundo volta ao normal.
- [ ] Planeta do Bills, mundo novo: 5 peixes com as cores originais no aquário e 2 almofadas na mesa. Os peixes nadam sem "pular" de volta. Um peixe tirado da água com balde volta ao aquário.
- [ ] 👥 Dois jogadores chegando juntos ao planeta do Bills: um de cada
- [ ] Missões `whis_ramen_delivery` e a 1ª etapa de `saga_beerus_1` funcionam com o Whis do planeta
- [ ] Torneio em mundo novo: 1 locutor
- [ ] Corporação Cápsula: 3 engenheiros dentro da cúpula, com diálogo. Numa Cápsula **nova**, a placa `CAPSULE` aparece legível na fachada oeste, sem letra espelhada (print). Cápsulas já geradas não mudam (esperado).
- [ ] Grande Patriarca no tapete da Casa do Guru, sem cair
- [ ] Guardas: Casa do Yamcha com 2 Ladrão-Urso, Red Ribbon com 3 Battle Jacket (sem erro no log), Base do Freeza com 5 soldados (os 5 aparecem em ~2 s)
- [ ] Matar todos os guardas: não voltam antes de 30 min de jogo (dormir adianta, é esperado). Depois, com o jogador perto, voltam sem passar do número.
- [ ] Matar os guardas à medida que nascem não vira fazenda (no máximo o número da construção por lote)
- [ ] Matar um guarda conta na missão de derrotar do mesmo tipo; nenhuma etapa de chefe completa com guarda
- [ ] Ladrão-Urso natural (bioma dirtstone/deserto) agora é nível 12; Battle Jacket some 60 s depois de ficar bravo (comportamento antigo)

## 7. Arena do Torneio do Poder e rebuilds
- [ ] Mundo novo: piso de pedra clara e anel dourado contínuo em volta do centro (print de cima e rente ao piso)
- [ ] Névoa clara azulada ao entrar na arena; céu preto em cima. No celular, com 6–8 chunks, o lado oposto do ringue continua legível do centro.
- [ ] Teste de cor (para o usuário escolher): `/fog @s push dbe:fog_tournament_of_power_b teste`, depois `/fog @s remove teste` e repetir com `_c`. Preferida: A / B / C
- [ ] Luz da arena (agora só 3 sea_lanterns): conferir de noite e embaixo do ringue. Se ficar escuro demais, avise (entram lâmpadas no piso).
- [ ] Migração em 3 mundos: novo, arena pela metade e arena inteira (CÓPIAS). Nos antigos, a arena recolore aos poucos, a luz invisível some e o anel aparece, sem retalho e sem watchdog.
  - Tempo da 1ª visita até terminar: ____
  - 📊 FPS/TPS durante a migração com 2 jogadores: ____
  - Sem luz invisível sobrando (no escuro)
- [ ] Fechar o mundo no meio da migração e voltar: continua de onde parou e termina
- [ ] `/scriptevent dbe:tournament_of_power_rebuild` (operador): a 1ª vez só avisa; repetir em 10 s recoloca tudo. Esperar mais de 10 s: não executa. Não-operador não consegue.
- [ ] `/scriptevent dbe:bills_planet_rebuild` (operador), com a mesma confirmação: depois do rebuild há 1 de cada morador (Bills, Whis, peixes, almofadas). Rebuild 2x seguidas: nenhuma entidade duplicada.
- [ ] 👥 Rebuild com 2 operadores: a confirmação de um não vale para o outro
- [ ] 👥 Rebuild com um jogador num buraco e outro numa torre: os dois vão para o ponto de chegada antes, em pé e sem dano. Com um bloco posto no ponto de chegada e o piso embaixo cavado: o mesmo.

## 8. Habilidades
- [ ] Estatísticas: BP e Força antes e depois de subir o **Desbloqueio de Potencial**. Muda na hora, sem reabrir. O máximo é **+10%** em Força, Destreza e Poder de Ki no nível 10.
- [ ] BP na Forma Mística com o Desbloqueio no nível 1 e no 10. A Bestial continua bloqueada abaixo do nível 10.
- [ ] Personagem antigo com o Desbloqueio no nível 10 já mostra o bônus máximo ao entrar
- [ ] **Sentir Ki** sem bônus: Força igual antes e depois de subir
- [ ] **Poder de Cura:** quem tem a habilidade (Majin e Namek começam com ela) regenera 25% mais rápido. Cronometre a volta da vida. Terráqueo sem mudança. A Senzu cura igual.
- [ ] **Limitador:** fora de todas as lojas e funcionando em quem já tem. `/dbe:learn @s limiter` (operador) ensina.
- [ ] Inimigos podem transformar um degrau antes contra quem tem o Desbloqueio alto (a IA usa o BP)
- [ ] Textos do Poder de Cura, Desbloqueio de Potencial e Ki Divino nas 3 línguas

## 9. Desempenho e núcleo (O1, O2c, O2d, O3)
- [ ] Absorção do Majin funciona
- [ ] Câmera nas transformações e no Instinto Superior
- [ ] Troca de dimensão pelo núcleo (Overworld/Nether/End)
- [ ] **Cápsula 991:** `/summon dbe:capsule_991`, montar, andar, subir e descer rampa: a inclinação segue o terreno como na 1.7.17. Nenhum texto Center/Speed na action bar.
- [ ] Descer e dar `/kill` na cápsula: `/testfor @e[type=dbe:location]` = 0 depois de 2 ticks
- [ ] 📊 Invocar 5 cápsulas, montar e desmontar em cada uma, `/kill @e[type=dbe:capsule_991]`: o número de intervalos volta ao do começo
- [ ] Montado, afastar até o chunk descarregar e voltar: montar de novo funciona. Matar a cápsula com alguém montado: nenhum erro.
- [ ] Cápsula montada perto do vazio ou de lava, ou `/kill @e[type=dbe:location]` enquanto ela anda: volta a 0, sem erro
- [ ] 📊 Vila de Vegeta ou do Freeza carregada: menos intervalos vivos e ms/tick menor que na 1.7.17 (mesmo mundo), sem erro
- [ ] Personagem novo: as habilidades padrão (voo, aura, Ki Blast) funcionam logo, sem sair do mundo
- [ ] Goku inimigo e Raditz atacam e transformam como antes; Kaioken e aura drenam ki igual
- [ ] Comprar a 1ª habilidade num treinador funciona na hora (toggle e passiva)
- [ ] Reset no Outro Mundo com nova raça; fusão: habilidades funcionam
- [ ] Treino de concentração e sombra de treino sem erro. A maestria decai com a habilidade ligada (o % cai).
- [ ] 📊 **Piloto Namek (O3-0):** `/scriptevent dbe:perf start`, 60 s parado no spawn, `report`:
  - `every namek.scan` ~300 chamadas e `every namek.villages` ~12;
  - intervalos vivos com 7 a menos que na 1.7.17, no mesmo mundo;
  - `getPlayers/s` aparece.
- [ ] 📊 Mesmo report: `every core.clear_lag` ~1200; `every core.terrain_queue` ~40; sem linha `interval(1) scheduler.js`. Em 120 s, `data_cleanup`, `cooldown_cleanup` e `region_cleanup` aparecem 2 vezes cada.
- [ ] Ir a Namek e voltar 3 vezes: a névoa entra e sai. Em Namek, voar para longe: o terreno é gerado à frente como antes. Cair num buraco de chunk não gerado: volta à superfície.
- [ ] Namek, mundo novo: perto de uma vila, os namekianos aparecem em até 5 s depois do chão e não duplicam ao sair e voltar. Pod e scriptevents de Namek funcionam.
- [ ] Clear lag: avisos nos tempos de sempre e limpeza a cada 15 min. Voar em Vegeta ou Freeza: chunks novos gerados como antes.
- [ ] `/reload` no meio: tudo continua, o report mostra UM intervalo do relógio e os avisos do clear lag não duplicam
- [ ] 👥 Namek e Overworld por 5 min: névoa e geração funcionam para quem está em Namek
- [ ] 👥 60 min com 2 jogadores entrando e saindo: sem crescimento de lag
- [ ] (se CUSTOM_CHAT estiver ligado) mensagem do servidor a cada 3 min

## 10. Enviar
- [ ] Este roteiro marcado + Content Log (PC e celular) + prints e vídeos numa pasta "Testes" (vídeos de preferência em .mp4)
- [ ] Os reports da sonda copiados, com a versão (1.7.17 ou 1.7.18) e o lugar onde foram medidos
- [ ] Resultado dos 4 obrigatórios da seção 2, mesmo que tudo tenha dado certo
