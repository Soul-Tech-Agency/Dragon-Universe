# Item 12: recados recebidos (Bússola, 2026-11-22), para não perder

- Contrato: redesign/CONTRATO.md §10 (Engrenagem), já atualizado: recompensas 18–25 (8 slots), espera 26, erro 27.
- Ícones: textures/ui/du2/icons/<nome>, sem .png. Tabela "Nomes finais da 1.7.18" em planos/ICONES_FALTANDO.md.
  - mentor → quest_mentor; recompensa zeni → reward_zeni; item → ach_item; points → skill_points.
  - Prioridade: lock > quest_done/ach_done > tipo.
  - Cor fixa no JSON: o script não manda marcador de cor.
- §10.5: o slot 11 'pts;<n>' também manda o iconPatch 'textures/ui/du2/icons/skill_points'.
- Opcional: parar de mandar 'ozr;' (Estatísticas) e '§r§o§r' (barbeiro); a UI ignora desde 5ba9258.
- Lang nova: ui.dbe.quest.caption.{objectives,requirements,rewards,level} (pt/en/es).
- Máximos conferidos nos dados: 8 objetivos, 1 requisito, 8 recompensas, 7 linhas na customização, 3 no barbeiro.
- Regra do Arquiteto: quem escrever dbe:fly_mode passa pela API do rP (disable, ou setFlyModeProperty + forgetFlyCache).
- Lang também: ui.dbe.skills.caption.points (pt/en/es). JSON da Engrenagem pronto (até 75be197). Testes: planos/ROTEIRO_1.7.18_rascunho.md.
