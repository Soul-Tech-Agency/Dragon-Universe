# oozaru_ui_scale.patch: Oozaru nas prévias de UI (alvo 1.7.18, NÃO entra na 1.7.17)

Autora: Aquarela. Base: `agent/oozaru` em `530461b` (= integration/1.7.17 + du2). Testado com `git apply --check`.
Com o patch aplicado: check-syntax OK, validate 6 (linha de base). **Nada testado no jogo.**

## Problema
- O Oozaru e o Golden vazam da prévia do inventário vanilla (`Testes/Testes Outubro/image.png`).
- O Oozaru montado tem ~48 px de altura contra 32 do jogador (1,5x), e a forma aplica `minecraft:scale` 2. A prévia mostra ~3x o tamanho normal.

## Parte 1: este patch (Aquarela, RP)
- `animations/player/oozaru_ui.animation.json` (novo): `animation.player.oozaru_ui_scale`, com `root` em escala 0,33.
- `entity/player.entity.json`: registra a animação e a toca com `v.is_oozaru && v.is_paperdoll`.
  - Usa só `is_paperdoll`, de propósito: com `q.is_in_ui` o Oozaru encolheria no mundo enquanto qualquer menu estivesse aberto.
- `contents.json`: registra o arquivo novo.
- Aplicar: `git apply planos/oozaru_ui_scale.patch` na raiz do repositório.

## Parte 2: Engrenagem (`ui/**`), no mesmo build
Sem a parte 2, as Estatísticas e o barbeiro ficam com o Oozaru minúsculo (~1/9).
- `ui/menus/statistics_form.json`: desfazer o ramo "zaru" de `6d2c2e8`, voltando a uma única prévia de 70x70 (sem `oozaru_renderer` 22x22).
- Barbeiro: o mesmo para `3847fb2`.
- Redesign du2: prévia única, sem caso especial para o Oozaru.

## Teste A/B (obrigatório, porque o G2 da 1.7.14 regrediu)
Build A = 1.7.18 sem o patch. Build B = com as partes 1 e 2. Em cada um, nas formas **base**, **Oozaru** e **Golden Oozaru**:
1. Inventário (E): o modelo inteiro dentro da caixa preta, sem cobrir armaduras e slots.
2. Estatísticas: corpo inteiro, do tamanho de um jogador comum.
3. Barbeiro: idem.
4. Prévia do redesign du2: idem.
5. No mundo, com o inventário aberto e a câmera em terceira pessoa: o Oozaru **não** encolhe.
6. Forma base e SSJ: prévias iguais às do build A.

**Se no build B o Oozaru sumir de alguma prévia (como na 1.7.14):**
- O renderer daquela tela não marca `v.is_paperdoll`.
- Saída: fica só a parte 2 (UI), e o vazamento no inventário vanilla vira limitação conhecida.
- Alternativa: trocar a condição por `v.is_oozaru && q.is_in_ui && !v.isLive`, testar de novo e anotar o resultado aqui.

**Se o corpo aparecer desmontado (pernas, tronco e cabeça sobrepostos):**
- Somar ao `animate` a linha `{ "oozaru_setup": "v.is_oozaru && !v.isLive" }`. O `dbe_general`, que monta o Oozaru, só roda fora da UI.
