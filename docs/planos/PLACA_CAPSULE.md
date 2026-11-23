# Molde do letreiro CAPSULE (Corporação Cápsula), item E do VISUAL_PENDENTE

- **Autora:** Aquarela. **Data:** 2026-11-22. Nada aplicado; o Marco aplica.
- **Prancha:** `PLACA_CAPSULE.png` (hoje x depois + grade de blocos por camada).
- **Lista:** `placa_capsule.json`.

## Achado
- A Cápsula da 1.7.17 (`world_landmarks`: `capsule_corp_1..9`, 141x42x154) é a cúpula amarela. O print de outubro (`capsulecorp.png`) mostra o prédio antigo, que não existe mais.
- O letreiro atual fica na **fachada oeste da cúpula**, camadas y 18–22, z 35–58, em `blue_wool` sobre `yellow_wool`/`yellow_carpet`. Ele já diz "CAPSULE", mas de forma irregular: o "A" não tem topo, as letras têm larguras diferentes e os tapetes dos degraus quebram os traços.

## O molde
- **Texto:** "CAPSULE", em fonte 3x5 com 1 coluna de espaço (27 colunas, z 33→59, y 22→18).
- **Orientação:** quem está a oeste olhando para leste lê da esquerda (norte, z menor) para a direita.
- **Regra por célula (z, y):** o bloco trocado é o **primeiro bloco a partir de x=0** (a cúpula é curva, então a profundidade muda por coluna):
  - lã: `blue_wool` (letra) ou `yellow_wool` (fundo);
  - tapete na frente: `blue_carpet` / `yellow_carpet`.
- **"CORP" não cabe:** a faixa lisa nessas camadas vai de z 32 a 60 (29 colunas); dos lados há janelas.

## Lista (`placa_capsule.json`)
- `edits[]`: `{piece, x, y, z, from, to, global}`, com coordenadas **locais da peça** (todas em `capsule_corp_1`, que começa em (0,0,0) da construção).
- São 94 trocas. Aplicar só se o bloco atual for igual a `from`; senão, pular e avisar.
- O `tools/mcstructure.mjs` ainda não tem um comando para trocar bloco por posição. Sugestão:

  ```
  node tools/mcstructure.mjs set <entrada> <saída> planos/placa_capsule.json
  ```

  Para cada edit, acrescentar `to` à `block_palette` (se faltar) e reapontar `block_indices[0]` em `x*sy*sz + y*sz + z`.
- **Mundos já gerados:** a Cápsula colocada não muda. Vale para mundos novos (ou com rebuild).
