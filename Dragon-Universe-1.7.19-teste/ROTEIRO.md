# 1.7.19: roteiro de teste (correções do teste de 23/11)

Montado em 2026-11-23 a partir do teste de 23/11 (menu de raça, log de UI e `dbe:perf`) e dos testes pedidos nas revisões: menus (Engrenagem, revisão Sentinela), desempenho e Kaioshin (Marco, revisão Sentinela 2), sonda e cidade do Futuro (Bússola, revisão Sentinela 2).
Marque cada item com **Y** (funcionou), **N** (falhou) ou **?** (não testado ou não deu para saber). Quando falhar, mande print ou vídeo, Content Log, dimensão e coordenadas.
Nada aqui foi testado no Minecraft pela equipe.

**O roteiro da 1.7.18 continua valendo** ([`../Dragon-Universe-1.7.18-teste/ROTEIRO.md`](../Dragon-Universe-1.7.18-teste/ROTEIRO.md)): tudo que lá ficou **?** deve ser testado nesta versão. A 1.7.19 é a 1.7.18 mais as correções abaixo.

## Quem e onde
- ⚠️ **Teste sempre numa CÓPIA do mundo.** Um mundo aberto na 1.7.19 não deve voltar para uma versão anterior.
- Remova o pacote 1.7.18 e instale este (a versão subiu, então o Minecraft troca o pack).
- ⚠️ **Sonda (`dbe:perf`)**, itens 📊: no pack de comportamento instalado, troque `DEBUG_PERF: false` por `true` em `scripts/config/config.js`, feche e reabra o mundo, use `/scriptevent dbe:perf start`, `report` e `stop`, e copie o report. Volte para `false` antes de medir FPS.
- Testador · PC ☐ · Android ☐ (modelo: ____) · versão exata do Minecraft: ____ · data
- Content Log File e GUI ligados · Beta APIs ligado.
- Mundos: um mundo NOVO + CÓPIAS de mundos salvos (1.7.17 ou 1.7.18). Dois jogadores nos itens 👥.

## 1. Abre?
- [ ] O mundo novo carrega. Primeiro erro do log, se houver: ____
- [ ] A cópia do mundo antigo carrega. Primeiro erro do log, se houver: ____
- [ ] Content Log **sem** `Unknown property [collection_name]` / `[collection_index]`.
- [ ] 10 min jogando sem `[scheduler] tarefa ... falhou`, sem watchdog / `slow script`.

## 2. Menu de criação de personagem (era o defeito principal)
- [ ] Tela de raça: chips de BÔNUS DA RAÇA, valores (Regeneração, Transformações, Escolha de...), PRIMEIRAS FORMAS e o selo da prévia mostram texto de verdade, **nenhum `ui.dbe.…`**.
- [ ] O ícone da raça aparece no quadrado amarelo acima da descrição.
- [ ] Setas da prévia: **‹** vai para a raça anterior e **›** para a próxima.
- [ ] **Aleatório** sorteia uma raça (repita algumas vezes).
- [ ] **✓** abre a Aparência (etapa 2). Na Aparência, as setas mudam a linha certa e o **✓** começa o jogo.
- Obs.: "Aparência" e "Começar" no topo só mostram a etapa; não são botões.

## 3. Outros menus (mesma correção)
- [ ] Estatísticas: +1 / +10 / +100 vão no atributo certo; valores certos à direita.
- [ ] Customização e Barbeiro: cada seta muda a linha em que está.
- [ ] Detalhe de missão: Iniciar funciona.
- [ ] Habilidades: cada linha abre a habilidade certa.
- [ ] Detalhe de conquista: a descrição aparece, não surge botão vazio, Voltar volta para a lista.
- [ ] Diálogo antigo de NPC mostra "Voltar" (não `ui.dbe.backButton`).
- [ ] Painel de treino no HUD (se aparecer): rótulos traduzidos e sem corte. Em espanhol, conferir "Aguante" na barra de vigor (é o mais apertado).

## 4. Desempenho (era o lag de 23/11)
- [ ] 📊 Mundo NOVO, no spawn, sem viajar: `dbe:perf` por 60 s. Tick médio: ____ ms (precisa ficar < 50). Cole o report.
- [ ] 📊 No report, nenhuma linha "terreno Futuro" no mundo novo antes de viajar ao Futuro.
- [ ] 📊 👥 Um jogador perto da base do Freeza (planeta Freeza) e outro no Kaioshin: o report mostra linhas separadas "terreno espaço/planetas, base do Freeza? (...)" e "terreno Kaioshin (...)" com jobs × passos. A linha `§c[perf] não instrumentado` **não** aparece.
- [ ] Viagem a um planeta e ao Kaioshin: chega normalmente (pode demorar um pouco mais que antes). Tempo até chegar: ____ s.
- [ ] Andar e voar rápido no Kaioshin e num planeta: o terreno acompanha (agora gera 2–3x mais devagar; anote se fica para trás).
- [ ] Base do Freeza: tempo até aparecer: ____ s (até ~18 s é esperado). Ponto e decoração iguais aos de antes.
- [ ] 👥 Um jogador num planeta e outro no Kaioshin ao mesmo tempo: os dois terrenos geram.
- [ ] Content Log: procurar `timed out`, `made no verified progress` e `marked complete but its terrain marker is missing`. Copie se aparecer.

## 5. Cidade do Futuro (decisão: construir na 1ª viagem)
- [ ] Mundo NOVO: ao abrir, nada do Futuro é gerado (confira com o `dbe:perf` do item 4).
- [ ] 1ª viagem ao Futuro num mundo novo: aparecem mensagens de progresso; tempo de espera: ____ min (esperado ~3,5–5,5 min no PC). Chega em chão firme, com a cidade pronta.
- [ ] Durante essa espera, andar para longe: a viagem é cancelada com aviso. Viajar de novo: a espera continua de onde parou.
- [ ] 2ª viagem ao Futuro: sem espera.
- [ ] Na 1ª viagem de um mundo novo **não** pode aparecer a mensagem de cidade adiada por falta de capacidade (`dbe.future.deferred_capacity`). Se aparecer, anote e mande o log.
- [ ] 👥 Dois jogadores viajando juntos ao Futuro pela 1ª vez: os dois chegam, cidade inteira e única.
- [ ] Cópia de mundo da 1.7.18 com a cidade do Futuro pela metade: a 1ª viagem termina a cidade, sem duplicar.
- [ ] Cópia de mundo antigo que já tinha a cidade do Futuro: viagem igual a antes, sem espera.
- [ ] Android: tempo da 1ª viagem ao Futuro: ____ min.
- Obs.: quem já está dentro do Futuro ao abrir o mundo (ou chega por /tp) não dispara a cidade; ela só começa na próxima viagem pelo sistema de viagem.

## 6. Reparo do Kaioshin (só operador, numa CÓPIA)
- [ ] No Kaioshin, apagar o marcador de um chunk já pronto: `/setblock <x0> -64 <z0> stone` (x0/z0 = canto do chunk). O log mostra o aviso `marked complete but its terrain marker is missing`.
- [ ] Antes de reparar, cair num buraco nesse chunk: vai para o ponto de chegada, sem cair sem fim.
- [ ] `/scriptevent dbe:kaioshin_repair` (preview e depois apply): aparece `N chunk generation markers restored` e o terreno em volta volta a gerar.
- [ ] Minerar até perto do fundo num chunk normal do Kaioshin e cair: volta para a superfície, não para a chegada.
- [ ] Cair num chunk ainda não gerado: volta para a superfície.
