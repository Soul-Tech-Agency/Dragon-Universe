# 1.7.20: rascunho do roteiro, área do Marco

Os itens marcados com 📜 se conferem no ContentLog. Use um mundo novo, salvo quando o item disser outra coisa.

## Carga do pacote (950854b)
- [ ] Abrir o mundo: o log não tem `trader_llama` com `child 'presets' not valid here`, e o jogo não mostra "Falha ao carregar pelo menos um pacote"
- [ ] Lhama do caravaneiro (`/summon minecraft:trader_llama`) anda, segue o caravaneiro e pode ser empurrada normalmente

## Como achar um marco (vale para todos os itens abaixo)
1. `/scriptevent dbe:landmarks` lista cada marco com o estado e a coordenada `X Z` do centro.
2. Ir até a coordenada. O marco é construído quando o jogador chega a ~160 blocos no Overworld, ou a ~64 blocos num planeta.
3. 📜 Esperar `[Landmarks] placed <marco> at x, y, z`.
4. Se aparecer `spot rejected` ou `drawing again`, o marco mudou de lugar: rodar `/scriptevent dbe:landmarks` de novo e ir à coordenada nova.
5. Depois de `placed`, o comando mostra o marco como `placed`.

## Torneio de Artes Marciais
- [ ] Achar o Torneio pelos passos acima: 📜 `placed martial_arts_tournament`
- [ ] Há 1 locutor na entrada, e interagir com ele abre a fila do Torneio
- [ ] Sair e voltar ao mundo: continua 1 locutor

## Corporação Cápsula
- [ ] Achar a Cápsula pelos passos acima: 📜 `placed capsule_corp`
- [ ] Há 3 engenheiros dentro da cúpula, e cada um tem diálogo
- [ ] A placa `CAPSULE` aparece legível na fachada oeste, sem letra espelhada (mandar print)

## Guardas (log novo, 38792e0)
- [ ] Casa do Yamcha: 📜 `[Landmarks] yamcha_house: garrison: 2/2`, com 2 Ladrão-Urso no térreo
- [ ] Torre Red Ribbon: 📜 `red_ribbon_tower: garrison: 3/3`, com 2 Battle Jacket nas portas e 1 no topo, sem erro no log
- [ ] Base do Freeza (planeta Freeza): 📜 `frieza_army_base: garrison: 5/5`, com os 5 soldados em ~2 s
- [ ] Se aparecer `missing (no standing room)`: mandar print do lugar e a linha do log
- [ ] Matar os guardas e ficar por perto: eles não voltam antes de 30 min de jogo

## Vilas de Namek (log novo, 125d0f7)
- [ ] Ir a Namek e andar até uma vila; ficar a até 40 blocos do centro dela, com a vila já construída
- [ ] 📜 `[Namek] village cx,cz (x, y, z): 5/5 namekian(s)`, e os namekianos aparecem em até 5 s depois dessa linha
- [ ] Sair e voltar à mesma vila: não aparecem mais namekianos e a linha não se repete

## Bills e Whis (recriação)
- [ ] Planeta do Bills, mundo novo: Bills e Whis à mesa
- [ ] `/event entity @e[type=dbe:beerus] dbe:despawn` 6 vezes, esperando cada um voltar: depois da 5ª ele para de ser recriado e o log avisa `creation stopped for now`
- [ ] Fazer o mesmo com `dbe:whis`
- [ ] Reabrir o mundo: os dois voltam ao normal, 1 de cada

## Kaioshin
- [ ] Ir ao Planeta Kaioshin e voar para longe: o terreno é gerado à frente, e o tick não passa de ~50 ms (o "Tick: média" da sonda)
- [ ] Cair num buraco de chunk não gerado: o jogador volta à superfície, ou à chegada se não houver chão, sem ficar teleportando em laço
- [ ] 📜 Se aparecer `is marked complete but its terrain marker is missing`, a linha aparece 1 vez por chunk na sessão, não em repetição
- [ ] (Operador, numa CÓPIA do mundo) rodar o `/scriptevent dbe:kaioshin_repair preview {...}` que esse aviso sugere e depois `apply <token>`
  - [ ] A mensagem diz `1 chunk generation markers restored`
  - [ ] 📜 Aparece `terrain marker restored after the reviewed repair`
  - [ ] Ao voltar à sessão, o aviso não aparece de novo para esse chunk

## Desempenho e sonda (pacote com `CONFIG.DEBUG_PERF = true`)
- [ ] Depois de `/reload`: 📜 `[perf] sonda de desempenho instalada`
- [ ] Rodar `/scriptevent dbe:perf start`, jogar 2 min e rodar `/scriptevent dbe:perf report`
  - [ ] O report tem a linha `relógio: N tarefas, X ticks despachados (de T), Y execuções`, com N > 0 e X ≤ T
  - [ ] A linha dos contadores mostra `trySetProperty …/s` ao lado de `setProperty …/s`; voando parado, `trySetProperty` fica perto de 0
- [ ] Mundo novo, só no Overworld: a linha `interval(1) terrain_repair.js` fica ≤ 2 ms/tick e a média do tick fica abaixo de 50 ms
- [ ] Viagem a um planeta: os jobs aparecem como `terreno espaço/planetas (...)`, e a viagem chega
- [ ] Ficar perto de marcos ainda não construídos no Overworld: nenhuma linha `world_landmarks.js` passa de ~2 ms/tick
