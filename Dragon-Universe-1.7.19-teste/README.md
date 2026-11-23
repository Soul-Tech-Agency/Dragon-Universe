# Dragon Universe 1.7.19: pacote de teste

**Candidata para teste controlado. Ainda não foi testada no Minecraft e não deve ser distribuída.**

| Item | Valor |
|---|---|
| Arquivo | `Dragon-Universe-1.7.19.mcaddon` (21.904.274 bytes, 3281 arquivos) |
| SHA-256 | `0fccee47ac4ef0d4f3c2509b7da630361787d6b89cd9566ee16629139bddfe22` |
| Fonte | commit `dab938f` (branch `integration/1.7.19`): 1.7.18 com as correções do teste de 23/11 |
| Alvo | Minecraft Bedrock 26.60, PC (Windows) e Android |
| Versão dos packs | BP e RP `[1,7,19]`, `min_engine_version` `[1,26,50]`, UUIDs iguais aos da 1.7.11 |

Antes de instalar, confira o hash com `sha256sum Dragon-Universe-1.7.19.mcaddon` (Linux) ou `Get-FileHash Dragon-Universe-1.7.19.mcaddon` (PowerShell).

**Numeração:** esta versão é só de correções. As novidades que estavam planejadas como 1.7.19 (Palácio do Bills, registro de chefes, scripts dos treinos, relógio único completo, divisão do código) passam a ser a **1.7.20**.

## O que mudou em relação à 1.7.18

**Menus**
- Corrigido o menu de criação de personagem: setas da prévia, botão Aleatório e ✓ disparavam todos "raça anterior", e os textos apareciam como `ui.dbe.bigPreviousButton`. A causa era uma propriedade de coleção num tipo de painel que não a aceita; o jogo a descartava (`Unknown property [collection_name]` no log) e todo botão lia o primeiro. A mesma correção vale para Estatísticas, Customização, Barbeiro, detalhe de missão, Habilidades e treino mental.
- 26 textos que apareciam como chave crua agora têm tradução em português, inglês e espanhol: o painel de treino do HUD, as telas do treino mental, e Voltar / Anterior / Próximo.
- O detalhe de conquista recebe todos os botões que a tela espera (descrição visível, sem botão vazio).

**Desempenho** (o lag medido em 23/11: tick médio de 53,5 ms)
- A geração de terreno (planetas, espaço, Kaioshin, Futuro e reparo) passa a ter um limite de tempo por tick: 2 ms sem ninguém nessas dimensões, 8 ms com jogador lá e 12 ms durante a preparação de uma viagem. Antes, qualquer geração em andamento ocupava ~22 ms de cada tick.
- O desenho dos pontos da base do Freeza e de Namek roda em fatias de 2 ms (antes tinha picos de até 737 ms).
- **Cidade do Futuro (decisão do usuário, opção A):** num mundo novo, a cidade do Trunks não é mais construída em segundo plano ao abrir o mundo. Ela é preparada na 1ª viagem ao Futuro, com mensagens de progresso. Mundos que já têm a cidade não mudam.

**Kaioshin**
- Corrigido um laço em que um pedaço do terreno marcado como pronto, mas sem o marcador, era pedido de novo para sempre e impedia o terreno em volta de gerar.
- O `/scriptevent dbe:kaioshin_repair` agora regrava esse marcador quando o pedaço está completo.
- O resgate de queda não deixa mais o jogador caindo sem fim num pedaço sem chão: vai para o ponto de chegada.

**Medição (`dbe:perf`)**
- O report separa a geração de terreno por sistema (espaço/planetas, Kaioshin, Futuro, reparo), com jobs × passos e ms, marca "base do Freeza?" quando há jogador perto dela, e lista dimensão e chunk de cada jogador.

## Riscos aceitos

- **Terreno mais lento:** viagens e exploração de planetas e do Kaioshin ficam mais lentas que na 1.7.18 (o terreno gera 2–3x mais devagar). Voando rápido, o terreno pode ficar para trás.
- **Base do Freeza:** pode levar até ~18 s para aparecer no pior caso.
- **1ª viagem ao Futuro:** num mundo novo, espera estimada de ~3,5–5,5 min no PC (mais em aparelho fraco), uma vez por mundo. Se o jogador sair do lugar durante a espera, a viagem é cancelada e a preparação continua mais devagar até a próxima tentativa.
- **Cidade do Futuro sem espaço de carregamento:** se o limite de áreas carregadas do jogo estiver apertado, a cidade pode ser adiada na 1ª viagem (mensagem de cidade adiada); a viagem segue sem a cidade e ela tenta de novo depois. O roteiro pede para conferir.
- **Reparo do Kaioshin:** um pedaço restaurado que nunca tinha recebido decoração fica sem árvores e pedras.

## Limitações conhecidas

- Tudo que está em "Limitações conhecidas" no README da 1.7.18 continua valendo, exceto o que esta versão corrigiu.
- Quem já está dentro do Futuro ao abrir o mundo, ou chega lá por `/tp`, não dispara a construção da cidade: ela só começa na próxima viagem pelo sistema de viagem.
- **Não abra numa versão anterior um mundo que já passou pela 1.7.19.**
- O painel dos treinos no HUD e as telas do treino mental continuam desligados até a 1.7.20 (sem o script dos treinos novos, não aparecem).
- A sonda `dbe:perf` vem desligada. Ligar exige editar `scripts/config/config.js` (`DEBUG_PERF: true`) e reabrir o mundo.

## Como testar sem arriscar mundos

1. **Faça backup externo** dos mundos importantes. Não teste no mundo principal.
2. **Mundo salvo: teste sempre numa cópia**, nunca no original.
3. Ligue o Content Log em Configurações → Criador: **Content Log File** e **Content Log GUI**.
4. Remova o pacote 1.7.18 e instale este.
5. Crie um **mundo novo** com os dois packs (BP e RP) da **1.7.19** e o experimento **Beta APIs** ligado.

O roteiro para marcar está em [`ROTEIRO.md`](ROTEIRO.md). Os itens que ficaram sem resposta no roteiro da 1.7.18 também devem ser testados nesta versão.
Registre cada resultado com o nome de quem testou, a plataforma, a versão exata do jogo e a data. Envie o Content Log completo. Coloque os prints e vídeos na pasta "Testes" (vídeos de preferência em .mp4).
