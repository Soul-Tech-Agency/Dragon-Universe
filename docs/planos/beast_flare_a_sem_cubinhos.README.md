# beast_flare_a_sem_cubinhos.patch: decisão 30, item 3, resposta SIM

- **Base:** `agent/oozaru` em `90fe8fd`. Testado com `git apply --check`.
- **Com o patch aplicado:** `check-syntax` OK, `validate` 6 (linha de base). **Nada testado no jogo.**
- **Comparação:** `beast_flare_a_sem_cubinhos.png` (hoje x sem cubinhos, dos dois lados), renderizado do modelo e da textura reais.

## O que faz
- **Geometria nova:** `geometry.du_flare_a_beast` (`models/entity/races/hairs/du_flare_a_beast.geo.json`). É uma cópia de `du_flare_a_ssj` sem os **14 cubos finos** (menor lado ≤ 1: tamanhos 1x1x2, 1x1x3, 1x2x2, 1x2x3) que formam os "cubinhos" das pontas. As mechas passam a terminar nos blocos de 2x2 ou mais.
- **Só o Beast muda:** a `du_flare_a_ssj` continua igual, porque o SSJ, o SSJ2, o Deus, o Blue etc. do estilo Flare A também a usam. Só o slot `beast` de `Array.du_flare_a_geo` (`saiyan.render_controllers.json`) passa a apontar para a geometria nova, como já foi feito com `du_dmz_goku_beast`.
- **Registros:** `entity/player.entity.json` (1 linha) e `contents.json`.
- **O que não muda:** textura (`du_flare_a_ssj_beast`), UV e os outros estilos.

## Aplicar
`git apply planos/beast_flare_a_sem_cubinhos.patch` na raiz do repositório, num commit próprio.

## Testar no jogo
- Estilo Flare A em Beast: pontas sem os cubinhos finos.
- Flare A em SSJ/SSJ2/Blue sem mudança.
- Outros estilos em Beast sem mudança.
