# 1.7.17: roteiro de teste (rascunho)

Rascunho montado em 2026-11-22 a partir dos itens "para o roteiro" de cada frente (viagens, construções e Star Navigator, menus, Oozaru e cabelos) e dos itens que ficaram sem teste na 1.7.15.
Marque cada item com **Y** (funcionou), **N** (falhou) ou **?** (não testado ou não deu para saber). Quando falhar: print ou vídeo, Content Log, dimensão e coordenadas.
Nada aqui foi testado no Minecraft pela equipe.

## Quem e onde
- ⚠️ **Não abrir numa versão anterior um mundo que já passou pela 1.7.17.** As versões antigas não entendem o plano novo e podem duplicar construções. Teste sempre em cópia.
- Testador · PC Windows ☐ · Android ☐ (modelo: ____) · **versão exata do Minecraft: ____** · data
- Content Log File e GUI ligados · Beta APIs ligado · mundo NOVO + CÓPIA de um mundo salvo da 1.7.14 ou 1.7.15

## 1. Abre?
- [ ] O mundo carrega · auditoria `10/10` · primeiro erro do log: ____

## 2. Viagens
- [ ] Na 1ª chegada a plataforma já está lá
- [ ] Sair andando da plataforma nos primeiros 20 s: quem cai, ou fica abaixo do chão ainda não gerado, volta para ela, sem sufocar
- [ ] Tempos da 1ª viagem a Vegeta, Freeza e Yardrat: ____ / ____ / ____ · copiar as linhas `[Timing]`
- [ ] Base do Freeza aparece em `/scriptevent dbe:landmarks` em ~2 min no planeta Freeza
- [ ] ContentLog sem `PlanetPreservationError` (`gold_ore`/`lapis_ore`) e sem `[Namek] UnloadedChunksError`
- [ ] Namek: ida e volta 3 vezes sem `LocationInUnloadedChunkError` no log
- [ ] **2 jogadores viajando juntos (H10, sem teste na 1.7.15):** os dois chegam? O que aparece para cada um? ____

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
- [ ] Botão "Construções" no Star Navigator abre a mesma lista (depende do patch da Bússola no `space_planets.js`)
- [ ] Nomes e textos em pt/en/es sem chave crua (`dbe.constructions...`) · West City antiga só aparece se tiver sido construída
- [ ] Fechar a lista não trava o Navigator: dá para abrir de novo e viajar

## 6. Menus
- [ ] Ícone DU nos 7 painéis, **no PC e no celular** (print de cada): centralizado, sem corte e sem cobrir botão ou texto
- [ ] Setas da customização funcionam nos dois sentidos
- [ ] Setas do barbeiro funcionam nos dois sentidos
- [ ] Barbeiro em Oozaru e Golden Oozaru: corpo inteiro na prévia, nada estranho no fim do texto
- [ ] Barbeiro na forma base: prévia do mesmo tamanho de antes
- [ ] Sair do mundo com a customização aberta, entrar de novo: sem trava nem dado perdido
- [ ] Prévia do Oozaru na customização aparece certa

## 7. Oozaru e cabelos
- [ ] Oozaru: cabeça lisa vista **de cima, de trás e de frente** (sem quadradinhos)
- [ ] Golden Oozaru: o mesmo
- [ ] Vegeta Oozaru inimigo: o mesmo
- [ ] SSJ3 do Goku: cabelo **comprido e opaco** (sem partes transparentes)
- [ ] Goku SSJ3 com a aura desligada: cabelo dourado e opaco, caindo nas costas até a cintura (de frente, de lado e de trás)
- [ ] Correndo e parado: a juba balança e não atravessa o corpo
- [ ] Gohan jovem e adulto SSJ3: igual
- [ ] Vegeta e Trunks SSJ3 (DMZ): dourados, ainda curtos
- [ ] SSJ, SSJ2 e Beast desses estilos sem mudança

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
