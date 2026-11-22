# Dragon Universe 1.7.17: pacote de teste

**Candidata para teste controlado. Ainda não foi testada no Minecraft e não deve ser distribuída.**

| Item | Valor |
|---|---|
| Arquivo | `Dragon-Universe-1.7.17.mcaddon` (21.727.204 bytes, 3051 arquivos) |
| SHA-256 | `f9692e844a72551f397f0d304f8705e23953eab3c8a671a7c2c29b9df8c3e4ae` |
| Fonte | commit `9b3dbd7` (branch `integration/1.7.17`): 1.7.16 com as frentes de viagens, construções, menus e Oozaru |
| Alvo | Minecraft Bedrock 26.60, PC (Windows) e Android |
| Versão dos packs | BP e RP `[1,7,17]`, `min_engine_version` `[1,26,50]`, UUIDs iguais aos da 1.7.11 |

Antes de instalar, confira o hash com `sha256sum Dragon-Universe-1.7.17.mcaddon` (Linux) ou `Get-FileHash Dragon-Universe-1.7.17.mcaddon` (PowerShell).

## O que mudou em relação à 1.7.15 e à 1.7.16

A 1.7.16 trouxe o Raditz com SSJ2 e SSJ3 próprios, a Casa do Guru sem o recorte retangular em Namek e o nome "Convite para o Torneio Universo 6". Isso continua aqui. Desde a 1.7.16:

**Viagens**
- A 1ª viagem a um planeta faz cerca de 5 vezes menos leituras de blocos; a Base do Freeza prepara cerca de 4 vezes mais rápido.
- A plataforma de pouso é feita antes do teleporte. Quem desce abaixo do chão ainda não gerado, perto do pouso, volta para a plataforma.
- Minério de decoração não aborta mais a geração (`PlanetPreservationError` com `gold_ore`/`lapis_ore`).
- **2 jogadores (H10):** quando dois viajam juntos, os dois chegam; o segundo espera com um aviso de fila, traduzido.
- Star Navigator: botão "Construções".

**Construções**
- Corporação Cápsula, Torneio, Casa do Piccolo e do Yamcha são sorteados dentro do bioma, não na borda, e começam a ser gerados com o jogador a 160 blocos, para já estarem prontos quando ele chega.
- Ponto rejeitado tenta até 3 pontos vizinhos, um por vez, sem travar as outras construções.
- `/scriptevent dbe:landmarks` mostra o centro da construção.
- Lista de construções (`/scriptevent dbe:constructions` ou o botão do Star Navigator), com coordenadas e estado.
- Base do Freeza com chão roxo do planeta, sem o quadrado de grama. Uma base já gerada troca o chão quando alguém chega perto.

**Menus**
- Ícone DU centralizado acima do painel, sem cobrir o título; em tela pequena ele encolhe em vez de ser cortado.
- Setas da customização e do barbeiro não voltam mais para a opção anterior.
- Estatísticas e barbeiro em Oozaru e Golden Oozaru: prévia menor, com o corpo inteiro.

**Oozaru e cabelos**
- Oozaru, Golden Oozaru e Vegeta Oozaru sem o tufo de quadradinhos no topo da cabeça.
- SSJ3 do Goku e do Gohan (estilos DMZ): cabelo comprido, dourado e opaco, caindo nas costas. O Beast do Goku continua como antes.

## Limitações conhecidas

- **Não abra numa versão anterior um mundo que já passou pela 1.7.15, 1.7.16 ou 1.7.17.** A versão antiga não entende o plano novo de construções e pode duplicá-las.
- Uma Casa do Guru que já foi gerada continua com o recorte. Para ver a correção, use um mundo novo ou um Namek ainda não visitado.
- Construções já geradas não mudam de lugar; o sorteio novo vale para pontos ainda não gerados.
- Erro conhecido, ainda sem correção (H11): usar um comando do addon logo ao entrar, antes de o personagem existir, pode gerar `setPermissionCategory ... restricted execution` no log. Se aparecer, copie a linha e o comando usado.
- Quem já tinha escolhido castanho continua com o tom antigo até escolher a cor de novo no barbeiro.
- Em telas muito baixas, o ícone DU pode ficar bem pequeno ou sumir.
- Os arquivos da West City continuam no pacote, mas nada mais os usa.
- **Medição temporária:** as linhas `[Timing]` continuam no log das viagens. Existem só nos pacotes de teste.

## Como testar sem arriscar mundos

1. **Faça backup externo** dos mundos importantes. Não teste no mundo principal.
2. **Mundo salvo: teste sempre numa cópia**, nunca no original. Depois de aberto na 1.7.17, o mundo não deve voltar para uma versão anterior.
3. Ligue o Content Log em Configurações → Criador: **Content Log File** e **Content Log GUI**.
4. Remova o pacote de teste anterior e instale este.
5. Crie um **mundo novo** com os dois packs (BP e RP) da **1.7.17** e o experimento **Beta APIs** ligado.
6. Para mundos existentes, use somente uma **cópia**. A cópia de um mundo da 1.7.14 testa a migração; a de um mundo da 1.7.15 ou 1.7.16 testa o plano atual.

O roteiro completo para marcar está em [`ROTEIRO.md`](ROTEIRO.md). As viagens com 2 jogadores (seção 2b) precisam de duas pessoas no mesmo mundo.
Registre cada resultado com o nome de quem testou, a plataforma, a versão exata do jogo e a data. Envie o Content Log completo. Coloque os prints e vídeos na pasta "Testes" (vídeos de preferência em .mp4).
