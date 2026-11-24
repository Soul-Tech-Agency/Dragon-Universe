# Dragon Universe 1.7.20: pacote de teste

**Candidata para teste controlado. Ainda não foi testada no Minecraft e não deve ser distribuída.**

| Item | Valor |
|---|---|
| Arquivo normal | `Dragon-Universe-1.7.20.mcaddon` (21.952.372 bytes, 3271 arquivos): **use este para jogar e testar** |
| Arquivo de depuração | `Dragon-Universe-1.7.20-depuracao.mcaddon`: igual ao normal, mas com a sonda de desempenho (`DEBUG_PERF`) e o log de dano do treino mental (`DEBUG_DAMAGE`) ligados. Use **só** para os itens 📊 e o item (b) do treino mental |
| SHA-256 | em `Dragon-Universe-1.7.20.sha256` (normal `2292acd4…3fea77`) |
| Fonte | commit `6aec792` (branch `integration/1.7.20`) |
| Alvo | Minecraft Bedrock 26.60, PC (Windows) e Android |
| Versão dos packs | BP e RP `[1,7,20]`, `min_engine_version` `[1,26,50]`, UUIDs iguais aos da 1.7.11 |

Os dois arquivos têm a mesma versão. **Instale um de cada vez**: remova um antes de instalar o outro.

## O que mudou em relação à 1.7.19

**Correções do teste de 23/11**
- **Menus vazios corrigidos:** nas Estatísticas voltam a aparecer BP, nível, XP com número, pontos de atributo e de habilidade, o valor de cada atributo, o "x" do peso e da Sala do Tempo e o painel embaixo da prévia. Nas Habilidades voltam o número de pontos e a lista, sem quadrados vazios levando para a Ajuda. A causa era a forma como os textos eram lidos pela tela; o Content Log não deve mais ter `Unknown property [collection_index]`.
- Uma verificação automática nova impede que esse tipo de erro de menu volte num pacote.
- "Saiyajin" não sai mais cortado ("Saivaiin").
- Notícias sem as imagens do Patreon.
- Erro de carga do `trader_llama` (o "Falha ao carregar pelo menos um pacote") corrigido.
- Star Navigator: o voo religa sozinho no destino. Morrendo logo depois de chegar, não religa.
- Cabelo SSJ3 do Vegeta e do Trunks refeito: o topo é penteado para trás e emenda na juba.
- Oozaru e Golden Oozaru cabem na prévia do inventário e das Estatísticas.
- Radar do Dragão: deixou de gravar à toa uma vez por segundo por jogador.
- Logs novos para conferir o teste: guardas (`garrison: N/N`) e vilas de Namek povoadas.

**Novidades da 1.7.20**
- Tela Treino nova, com 4 treinos: Sombra, Concentração, **Flexões** (treino físico em séries) e **Treino mental** (réplicas dos chefes que você já venceu, nos modos Memória e Desafio).
- Concentração refeita com a grade de orbes 3×3.
- Registro dos chefes vencidos (usado pelo treino mental).
- Parte do código dividida e reorganizada (sem mudança de comportamento, conferido por comparação).
- Várias tarefas de dimensões (espaço, Kaioshin, Inferno, Outro Mundo, Universo 6, vilas) passaram para o relógio único, para diminuir o lag.
- Layouts e texturas antigos de menus que não eram mais usados foram removidos.

## Regras provisórias (podem mudar depois do teste)
- A réplica do Beerus é uma luta normal e pode ser derrotada.
- O combo da concentração só aparece na tela; não multiplica pontos.
- As flexões ficam bloqueadas só quando o chefe de uma missão já apareceu.
- O mesmo chefe conta 1 vez por dia, só quando você vence. O treino mental protege de qualquer golpe que mataria você.

## Riscos aceitos
- Continuam os da 1.7.19: terreno de planetas e do Kaioshin mais lento, base do Freeza em até ~18 s e 1ª viagem ao Futuro com espera de alguns minutos.
- Ir e voltar pelo Star Navigator em menos de 10 s chega a pé.
- A tela de Habilidades só lista habilidades que sobem de nível (Voo, Pulo, Punho de Ki, Kaioken etc.). Aura, Ki Blast e outras de nível único não aparecem. Mudar isso é uma decisão para a 1.7.21.

## Ainda não resolvido / a confirmar no teste
- **Cápsula 991 difícil de dirigir:** o código é idêntico ao da 1.7.17. Para saber se piorou, compare a mesma rampa na 1.7.17 e na 1.7.20.
- **Guardas, locutor do Torneio, engenheiros da Corporação Cápsula:** na 1.7.19 você não chegou perto desses lugares, então não dá para saber se funcionam. O roteiro (Parte 4) mostra como achar cada um.
- **Névoa da arena do Torneio do Poder:** mande um print do horizonte e a sua distância de renderização.

## Como testar sem arriscar mundos
1. **Faça backup externo** dos mundos importantes. Não teste no mundo principal.
2. **Mundo salvo: teste sempre numa cópia.** **Não abra numa versão anterior um mundo que já passou pela 1.7.20.**
3. Ligue o Content Log em Configurações → Criador: **Content Log File** e **Content Log GUI**.
4. Remova o pacote 1.7.19 e instale o **normal** da 1.7.20.
5. Crie um **mundo novo** com os dois packs (BP e RP) e o experimento **Beta APIs** ligado.
6. Siga o `ROTEIRO.md`. No fim, mande os prints, o vídeo e os arquivos `ContentLog*.txt`.
7. Para os itens 📊 e o item (b) do treino mental, troque pelo pacote **de depuração** numa cópia do mundo.
