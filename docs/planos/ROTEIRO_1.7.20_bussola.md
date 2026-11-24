# Roteiro de teste da 1.7.20: área da Bússola (rascunho)

Treinos (concentração, flexões e treino mental), tela Treino, voo no Star Navigator, radar e cidade do Futuro.
Marque cada item depois de ver no jogo. Quando algo falhar, anote o que aconteceu e, se der, mande um print.
Alguns itens pedem dois jogadores ou um mundo antigo: estão marcados assim.

> Regras ainda provisórias (podem mudar depois deste teste): o combo da concentração só aparece na tela; as flexões não
> começam com luta de missão em andamento; a réplica do Beerus é uma luta normal (não "sobreviva 3 min"); o mesmo chefe
> conta 1 vez por dia só quando você vence; o treino mental protege de qualquer golpe que mataria você; ir e voltar com o
> Star Navigator em menos de 10 s chega a pé.

## 1. Tela Treino

- [ ] Abrir o menu, aba Treino: aparecem 4 linhas (Sombra, Concentração, Flexões, Treino mental), cada uma com ícone colorido.
- [ ] Na gravidade ou num planeta com treino mais forte, aparece "Treino x2" (ou o valor certo) no topo. Na Terra, sem gravidade, não aparece.
- [ ] Concentração mostra "Chances 3/5" (ou o que você tiver); Flexões mostra "Séries 0/3"; Treino mental mostra "Réplicas hoje 0/3".
- [ ] Com um treino em andamento, as outras linhas mostram "Outro treino em andamento" com cadeado, e a linha do treino ativo vira "Encerrar" em vermelho.
- [ ] Clicar numa linha com cadeado ou em recarga manda o motivo no chat e reabre a tela.
- [ ] Nenhum texto aparece como código (ex.: "ui.dbe…").

## 2. Concentração

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

## 3. Flexões (treino físico)

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

## 4. Treino mental

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

## 5. Star Navigator e voo

- [ ] Voando, viajar 5 vezes pelo Star Navigator (Namek, espaço, Terra…): nas 5, o voo desliga na troca e religa sozinho uns instantes depois de chegar.
- [ ] Chegar sem ki, em Oozaru ou no meio de uma série de flexões: você fica a pé (o voo não religa).
- [ ] Chegar voando e morrer em menos de 10 s: depois do respawn o voo NÃO religa sozinho.
- [ ] Ir e voltar em menos de 10 s: chega a pé (esperado nesta versão).
- [ ] Viajar voando pelo pod e pelo Kaioshin: o voo também religa no destino.

## 6. Radar do Dragão (versão de teste com a sonda ligada)

- [ ] Parado, sem o radar na mão: `/scriptevent dbe:perf start`, esperar 60 s, `/scriptevent dbe:perf report`: o número de setProperty/s fica perto de 0 (antes era ~1 por jogador).
- [ ] Com o radar na mão, ele aponta para as Esferas; guardado, volta a zero.
- [ ] Depois de trocar de dimensão e depois de morrer e renascer, sem o radar na mão, continua em zero.

## 7. Cidade do Futuro (mundo novo)

- [ ] Mundo novo: até a primeira viagem ao Futuro, o jogo não fica pesado à toa (com a sonda: nenhuma linha "terreno Futuro").
- [ ] Primeira viagem ao Futuro: aparecem mensagens de progresso ("Gerando o terreno do Futuro…"); espere parado. Leva alguns minutos (uns 3 a 5 no PC).
- [ ] Ao chegar, você está em chão firme, com a cidade pronta.
- [ ] Sair do lugar durante a espera cancela só a espera; tentar de novo continua de onde parou.
- [ ] Segunda viagem ao Futuro: rápida, sem esperar a cidade de novo.
- [ ] Mundo antigo que já tinha a cidade (mundo antigo): nada muda.

## 8. Troca de raça

- [ ] Majin → Saiyajin (pelo desejo do Shenlong ou `/dbe:setrace saiyan`): Absorção e Poder de Cura somem da tela de
  Habilidades e da barra lateral; o Punho Amigável continua, no mesmo nível.
- [ ] Namekuseijin → Majin: o Poder de Cura continua no mesmo nível e a Absorção aparece.
- [ ] Trocar para a mesma raça: nenhuma habilidade some e nenhuma volta ao nível 1.
- [ ] Personagem novo (e depois do reset no Outro Mundo): recebe as habilidades padrão da raça escolhida.
- [ ] Personagem antigo que era Majin e trocou de raça antes desta versão (mundo antigo): ao entrar, a Absorção some
  (aparece no Content Log uma linha "[Race] … removed skills of a previous race: absorption"); o Poder de Cura continua.
  Sair e entrar de novo: nada muda e a linha não aparece de novo.

## 9. Geral

- [ ] 10 minutos de jogo sem erro novo no Content Log.
