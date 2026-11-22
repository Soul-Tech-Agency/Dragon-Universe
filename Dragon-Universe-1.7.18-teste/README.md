# Dragon Universe 1.7.18: pacote de teste

**Candidata para teste controlado. Ainda não foi testada no Minecraft e não deve ser distribuída.**

| Item | Valor |
|---|---|
| Arquivo | `Dragon-Universe-1.7.18.mcaddon` (21.891.348 bytes, 3278 arquivos) |
| SHA-256 | `9cd582898d3a3f54d11a586b31f5259a88b33137226b90447fdc3e8b2943aa04` |
| Fonte | commit `aaf840e` (branch `integration/1.7.18`): 1.7.17 com as frentes de núcleo e habilidades, construções e moradores (sem o Palácio do Bills), menus e visual |
| Alvo | Minecraft Bedrock 26.60, PC (Windows) e Android |
| Versão dos packs | BP e RP `[1,7,18]`, `min_engine_version` `[1,26,50]`, UUIDs iguais aos da 1.7.11 |

Antes de instalar, confira o hash com `sha256sum Dragon-Universe-1.7.18.mcaddon` (Linux) ou `Get-FileHash Dragon-Universe-1.7.18.mcaddon` (PowerShell).

## O que mudou em relação à 1.7.17

**Mais leve por dentro** (o jogador não deve ver diferença, só menos lag)
- O voo não reenvia mais os mesmos dados a cada tick. O tremor ao voar parado deve diminuir.
- As marcações visuais do personagem só são enviadas quando mudam.
- A cápsula 991 não deixa mais relógios ligados nem texto de depuração na tela.
- A colisão entre rajadas de ki faz muito menos contas. **Atenção:** é preciso conferir se o empurrão entre rajadas continua igual (teste obrigatório).
- Criaturas sem habilidade não têm mais um relógio rodando à toa.
- Namek e as tarefas gerais (limpeza, clear lag, fila de terreno, mensagens do servidor) passam a usar um relógio só.
- Menus e HUD fazem menos comparações por quadro: barras de vida, estamina, ki e carga; abas; listas; barra de XP.

**Mundo**
- Bills e Whis moram agora na sala de jantar do planeta do Bills. Num mundo antigo, eles saem do Palácio de Kami uma única vez.
- Novos moradores fixos: 3 engenheiros na Corporação Cápsula, o Grande Patriarca na Casa do Guru e o locutor do Torneio, que não duplica mais.
- Os peixes do aquário e as almofadas da mesa do planeta do Bills voltam por script, um de cada. Num mundo antigo, as cópias que sobravam são removidas uma vez.
- Guardas: 2 Ladrão-Urso na Casa do Yamcha, 3 Battle Jacket na Red Ribbon e 5 soldados na Base do Freeza. Eles voltam a cada 30 min de jogo e contam nas missões de derrotar.
- Arena do Torneio do Poder: piso de pedra clara com anel dourado, névoa clara azulada e sem os ~1,34 milhão de blocos de luz invisível. Uma arena já existente é recolorida aos poucos na 1ª visita.
- Corporação Cápsula nova com a placa "CAPSULE" na fachada.
- Comandos de operador para recolocar o planeta do Bills e a arena (`/scriptevent dbe:bills_planet_rebuild` e `dbe:tournament_of_power_rebuild`). A 1ª vez só avisa; para executar, repita o comando em até 10 s. Os jogadores da dimensão são levados para o ponto de chegada antes.

**Menus**
- Listas de missões e conquistas com ícone e cor pelo tipo e pelo estado. Transformações bloqueadas com o cadeado novo.
- Detalhe de missão organizado em partes: título, tipo, nível, descrição, objetivos, requisitos e recompensas com ícone (item, pontos, zeni, XP), espera e erro.
- Customização e barbeiro com ícone, nome e valor atual ("3/8") em cada linha.
- Habilidades com os pontos num cabeçalho e um ícone dourado na habilidade que já está no máximo.
- Oozaru e Golden Oozaru cabem nas prévias: inventário, Estatísticas, customização e barbeiro.

**Habilidades**
- Poder de Cura: +25% de regeneração de vida.
- Desbloqueio de Potencial: até +10% em Força, Destreza e Poder de Ki no nível 10.
- Ki Divino: só o texto foi reescrito.
- Limitador: só para administradores, fora da loja.

## Riscos aceitos

- **Rajadas de ki:** se o teste mostrar que na 1.7.17 elas se atravessavam e agora se empurram, isso muda a jogabilidade. Nesse caso, a decisão volta ao usuário antes de lançar.
- **Oozaru nas prévias:** uma tentativa parecida na 1.7.14 fez o Oozaru sumir das Estatísticas, e a causa nunca foi achada. Se acontecer de novo, as duas partes (`28fb62b` e `5ba9258`) são revertidas juntas.
- **Barras do HUD (`0c122ef`) e listas dos menus (`6bb3656`):** o ganho depende de como o jogo trata partes escondidas da tela. Cada uma pode ser revertida sozinha se o FPS piorar no celular ou se o toque falhar.
- **Desbloqueio de Potencial:** o BP sobe, e os inimigos podem se transformar um degrau antes contra quem o tem alto.
- **Arena num mundo antigo:**
  - a recoloração troca as cores de terracota e concreto dentro da arena, inclusive blocos dessas cores que um jogador tenha posto lá;
  - a luz invisível sai, e só ficam 3 sea_lanterns. Se a arena ficar escura demais, entram lâmpadas no piso numa versão seguinte.
- **Rebuild (planeta do Bills e arena):** o que os jogadores construíram, quebraram ou trocaram ali volta ao original. O comando avisa antes.
- **Planeta do Bills:**
  - um peixe sem tag a até 4 blocos do aquário, ou uma almofada a até 2 da mesa, pode ser "adotado" para sempre no lugar do morador que falta;
  - a limpeza única também remove peixes, almofadas ou suportes de armadura que um jogador tenha posto no aquário, na mesa ou nos 2 suportes.
- **Palácio de Kami interrompido:** se o mundo fechar durante a colocação, o Palácio pode ficar incompleto (já acontecia antes). A remoção de Bills e Whis espera a visita seguinte.

## Limitações conhecidas

- **Não abra numa versão anterior um mundo que já passou pela 1.7.18.** A 1.7.17 não conhece os moradores novos nem a arena recolorida: Bills e Whis podem sumir de vez e a arena pode ficar com retalhos.
- **Já no pacote, mas desligado até a 1.7.19:** o painel dos treinos no HUD (concentração, flexões e treino mental), as telas do treino mental e as texturas, partículas e névoa da réplica. Sem o script dos treinos novos, nada disso aparece no jogo.
- O Palácio do Bills não está nesta versão. A árvore vermelha central do planeta continua.
- A cor da névoa da arena ainda vai ser escolhida no teste; há 3 opções no roteiro.
- Erro conhecido, ainda sem correção (H11): usar um comando do addon logo ao entrar, antes de o personagem existir, pode gerar `setPermissionCategory ... restricted execution` no log. Se aparecer, copie a linha e o comando.
- Cápsulas, arenas e construções já geradas só mudam onde está descrito acima. A placa "CAPSULE" só aparece em Cápsulas novas.
- **Medição temporária:**
  - as linhas `[Timing]` continuam no log das viagens;
  - a sonda `dbe:perf` está no pacote, desligada. Ligar exige editar `scripts/config/config.js` (`DEBUG_PERF: true`) e reabrir o mundo. O roteiro explica.

## Como testar sem arriscar mundos

1. **Faça backup externo** dos mundos importantes. Não teste no mundo principal.
2. **Mundo salvo: teste sempre numa cópia**, nunca no original. Depois de aberto na 1.7.18, o mundo não deve voltar para uma versão anterior.
3. Ligue o Content Log em Configurações → Criador: **Content Log File** e **Content Log GUI**.
4. Remova o pacote de teste anterior e instale este. Para os testes A/B, mantenha também o pacote da 1.7.17 (`Dragon-Universe-1.7.17-teste`) e use uma cópia do mesmo mundo para cada versão.
5. Crie um **mundo novo** com os dois packs (BP e RP) da **1.7.18** e o experimento **Beta APIs** ligado.
6. Para mundos existentes, use somente **cópias** de mundos da 1.7.15, 1.7.16 ou 1.7.17. Para a arena, use uma cópia com a arena do Torneio do Poder visitada pela metade e outra com ela inteira.

O roteiro completo para marcar está em [`ROTEIRO.md`](ROTEIRO.md). **A seção 2 é obrigatória:** rajadas A/B, Oozaru A/B, FPS no celular e listas dos menus. Vários itens precisam de duas pessoas no mesmo mundo (marcados com 👥).
Registre cada resultado com o nome de quem testou, a plataforma, a versão exata do jogo e a data. Envie o Content Log completo. Coloque os prints e vídeos na pasta "Testes" (vídeos de preferência em .mp4).
