# ssj4_franja_levantada.patch: decisão 30, item 1, resposta SIM

- **Base:** `agent/oozaru` em `90fe8fd`. Testado com `git apply --check`.
- **Com o patch aplicado:** `check-syntax` OK, `validate` 6 (linha de base). **Nada testado no jogo.**
- **Comparação:** `ssj4_franja_levantada.png`, os 10 estilos de SSJ4, "hoje | levantada", renderizados do modelo e da textura reais.

## O que faz
- **Arquivos:** só as 10 geometrias de cabelo SSJ4: `du_dmz/{goku,vegeta,gohan_mid,gohan_end,trunks}_ssj4`, `du_{flare_a,caulifla,raditz,gogeta,broly}_ssj4`.
- **Quais mechas sobem:** as que passam na frente dos olhos (faixa y 24,5–29,5, à frente do rosto, com 5% ou mais do cubo dentro).
- **Quanto sobem:** o suficiente para a borda de baixo ficar logo acima dos olhos (no máximo 5 blocos). O deslocamento é aplicado no espaço do bone, então a mecha sobe "para cima" mesmo nas rotacionadas.
- **O que não muda:** a touca 8x8x8 da cabeça, textura, UV e o resto do cabelo. Nenhuma mecha é apagada.
- **Diff mínimo:** só mudam os números de `origin`/`pivot` dos cubos levantados (255 números em 10 arquivos).
- **Mechas mais deslocadas:** nos estilos Gohan (jovem e adulto) e Trunks, as duas mechas laterais grandes sobem 5 e ficam mais altas nas laterais. No Caulifla e no Gogeta, as mechas da frente sobem ~5.

## Aplicar
`git apply planos/ssj4_franja_levantada.patch` na raiz do repositório, num commit próprio.

## Testar no jogo
SSJ4 em 2–3 estilos (por exemplo DMZ Goku, Flare A, Gohan):
- os olhos aparecem inteiros de frente e a 3/4;
- nenhuma mecha solta no ar;
- as formas SSJ, SSJ2 e base não mudam (o patch só toca as geometrias `*_ssj4`).
