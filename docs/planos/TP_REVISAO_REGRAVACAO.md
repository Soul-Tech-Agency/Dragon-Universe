# Arena do TP regravada (db02a33, Marco): revisão visual da Aquarela (item D)

- **Prancha:** `TP_REVISAO_REGRAVACAO.png` (proposta x peças novas, de cima; recorte do centro; vista lateral do sul). Gerada das 63 `.mcstructure` de `db02a33`.
- Nada testado no jogo.

## Veredito: **paleta e anel como propostos**
- **Paleta:** cada bloco novo soma o mesmo que as cores antigas da tabela (diferença < 1%, compatível com os 430 blocos do anel):

  | Bloco novo | Contagem | Esperado |
  |---|---|---|
  | `polished_andesite` | 44.244 | ~44,4 mil |
  | `smooth_stone` | 34.393 | ~34,4 mil |
  | `polished_deepslate` | 23.544 | ~23,7 mil |
  | `smooth_quartz` | 19.057 | ~18,9 mil |
  | `polished_diorite` | 15.143 | ~15,2 mil |
  | `calcite` | 7.006 | 7.021 |
  | `stone` | 6.517 | ~6,5 mil |

  - Não sobrou terracota/concreto do mosaico nem `light_block_15`.
  - Restos fora do mosaico, sem efeito visual relevante: 11 `light_blue_terracotta`, 9 `black_concrete_powder`.
- **Anel dourado:** 432 `gold_block` (430 do anel + 2 que já existiam). Na vista de cima é um círculo contínuo de 3 blocos na faixa 21 ≤ r < 24, centrado no disco claro. Igual à prévia A (`TP_ANEL_DOURADO.png`).
- **Lateral:** a arena é um disco com o fundo em cone invertido, que também ficou em pedra clara com o mesmo desenho. A torre central está em faixas claras/cinza, a arquibancada à esquerda, e o camarote (esfera) à direita mantém o amarelo dos vidros.

## Para o teste no jogo
1. **Luz:** sem `light_block` sobram só 3 `sea_lantern`.
   - De dia o topo fica claro pela luz do céu.
   - **Testar à noite** (ou com o tempo parado) e embaixo da arena. Se ficar escuro demais, entram as lâmpadas embutidas no piso (Marco, já previsto).
2. **Leitura rente ao chão:** print de pé no piso. O pontilhado agora é de cinzas próximos e não deve mais parecer retalho.
3. **Anel:** visível de cima e do piso, sem falhas.
4. **Névoa:** com o `cfg.fogId` do Marco ligado, confirmar `dbe:fog_tournament_of_power` (azul claro).
