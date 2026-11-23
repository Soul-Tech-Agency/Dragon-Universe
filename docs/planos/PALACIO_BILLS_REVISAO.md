# Palácio do Bills: revisão visual das peças (51afe77 + 8fbc8e1)

- **Autora:** Aquarela. **Data:** 2026-11-22.
- **Pranchas:**
  - `PALACIO_BILLS_REVISAO.png`: de cima, de frente e do terraço, com a ilha inteira.
  - `PALACIO_BILLS_NOTA_A.png`: camadas da sala de jantar antes e depois.
- Renderizado das `.mcstructure` reais nas coordenadas do `bills_planet.js`. Nada testado no jogo.

## Veredito: APROVADO
- **Igual à proposta:**
  - degraus 31x31 com faixas roxas, janelas, entrada com cortina, templo com olhos e orelhas, ponta dourada em y 187;
  - contagens iguais ao modelo: arenito 937, purpur 431, vidro 100, ouro 5, sea lantern 4;
  - mais a escada interna (33 degraus) e 21 `light_block_15`.
- **Layout confirmado:**
  - o arco e a saída existentes ficam no meio do lado sul, com o lago a oeste e o terraço a leste;
  - a praça de 47x50 em y 140 substitui a grama, sem colisão com o anel de árvores;
  - a árvore central saiu sem restos (os 2 `coarse_dirt` que sobram ficam sob o piso do palácio).
- **Bills e Whis:** Bills (3,5, 142, 22,5, yaw −90) e Whis (11,5, 142, 22,5, yaw 90) ficam exatamente sobre os assentos de lã, frente a frente.
- **Diferenças aceitas:** sem caminho de quartzo (o arco já liga a saída) e sem nenúfares.

## Nota (A) da Sentinela: escada x decoração da sala de jantar
- **O que é:** em x=5 há uma parede entre a sala de jantar (oeste) e a cozinha (leste), com uma **porta de 3 de largura em z 7–9**, pilares de tronco de mangue em z=6 e z=10 e verga de `mud_bricks` em y 134–135.
- **O que a escada faz:** ela ocupa z **8–10** e sobe para leste (x=4, y 131 → x=13, y 140), ou seja, passa pela porta **desalinhada 1 bloco para o sul**. Isso:
  - derruba a verga em z 8–9 (inevitável: é a altura livre da escada);
  - tira o **pilar de z=10** em y 132–135 (sobra um toco em y 131);
  - remove a **placa pendurada** (5, 133, 8);
  - troca um painel de vidro da cozinha (8, 135, 8) por degrau;
  - abre o teto de tábuas (y 136) em x 3–8.
- A cozinha continua acessível por baixo da escada (em x=6 sobram 2 blocos de altura).
- **Avaliação:** dá para jogar, mas o corte fica com cara de buraco: porta sem um pilar e o toco solto no chão. **Recomendo recompor (P, Marco):**
  1. **Alinhar a escada com a porta:** z **7–9** em vez de 8–10. O pilar de z=10 volta inteiro, e só a verga sobre a porta sai (necessária para a altura). Conferir na saída da escada dentro do palácio (x=13, y 140–141) que z 7–9 continua livre.
  2. **Placa:** pendurar de novo ao lado da porta, por exemplo na face do pilar z=6, do lado da sala (com o mesmo texto).
  3. **Furo do teto** (y 136): emoldurar com `stripped_mangrove_log` nas bordas do poço. É opcional.
  4. O vidro (8, 135, 8) pode ficar como degrau.
- Se não der tempo, **aceitável como está** para o teste da 1.7.19.

## Nota (B) da Sentinela: luz
- Os 21 `light_block_15` nos andares ocos do `palace_a` são **de propósito**. Eles são invisíveis, não sólidos e iluminam o interior sem lanterna à vista.
- Ok visualmente. No teste: o interior não fica escuro e não aparece nenhum bloco no lugar deles.

## Para o teste no jogo
- **De fora:** silhueta vista da borda da ilha; olhos acesos à noite.
- **Por dentro:** a escada desce até o salão (y 130) sem bater a cabeça; o interior fica iluminado.
- **NPCs:** Bills e Whis à mesa do terraço; o rebuild não os duplica.
