# Roteiro de teste 1.7.20: visual (Aquarela)

Rascunho. Os commits ficam na `agent/oozaru`. Marque [x] o que passou. Se algo falhar, mande print e o número do item.

## 1. SSJ3 do Vegeta e do Trunks (DMZ), commit 4e1a9d0
Comparação antes/depois: `planos/SSJ3_VEGETA_TRUNKS_23-11.png`.
- [ ] Vegeta SSJ3: espetos penteados para trás, emendando na juba das costas (sem a "tábua" solta).
- [ ] Vegeta SSJ3, de frente: bico na testa, sem franja na cara.
- [ ] Trunks SSJ3: o mesmo, com a franja dele na frente.
- [ ] Os dois, correndo: a juba balança e não atravessa o corpo.
- [ ] As prévias do inventário e das Estatísticas mostram o mesmo cabelo.

## 2. Oozaru e Golden nas prévias, commit 58f71d3
- [ ] Inventário (E): o Oozaru inteiro dentro da caixa preta, mais ou menos do tamanho da forma base.
- [ ] Estatísticas do DU: corpo inteiro dentro da moldura.
- [ ] O mesmo com o Golden Oozaru.
- [ ] A forma base e o SSJ continuam iguais nas prévias.

## 3. Oozaru NO MUNDO com menu aberto (OBRIGATÓRIO)
- [ ] Em Oozaru, câmera em 3ª pessoa (F5): abra o inventário. O Oozaru atrás do menu continua grande.
- [ ] Ainda em F5: abra o menu do DU (Estatísticas). O Oozaru continua grande.
- [ ] Repita com o Golden Oozaru.

**Se falhar** (o Oozaru encolhe no mundo enquanto o menu está aberto): **avise na hora, com print**. A saída é reverter 58f71d3 e ac2f67b juntos. Nesse caso o Oozaru volta a aparecer grande nas prévias, mas fica normal no mundo.

## 4. Pose da flexão, commits 7e46f6e, 54cce6e e ac2f67b
- [ ] Ao iniciar a série: corpo deitado, mãos e pontas dos pés no chão, sem animação de queda.
- [ ] Subindo e descendo: o peito desce perto do chão, e as mãos não afundam no chão no meio do movimento.
- [ ] No celular, a descida vem do item do slot 8; no PC, também do agachar.
- [ ] Agachar durante a série não liga a aura nem a pose de carregar ki.
- [ ] O som da aura para durante a série e volta depois.
- [ ] O rabo fica deitado sobre as pernas; com o rabo enrolado, nada muda.
- [ ] Durante a série, com o menu aberto em F5, a pose continua no mundo (mesmo teste do item 3).
- [ ] As prévias do inventário e das Estatísticas mostram o jogador em pé, não deitado.

## 5. Orbe apagado da concentração, commit 7e46f6e
Prancha: `planos/FLEXAO_ORB_1.7.20.png`.
- [ ] O orbe apagado aparece como um anel vazado azul-acinzentado, discreto.
- [ ] Só um anel, sem duplicar: o script não deve criar partícula própria para ele.
- [ ] Quando o orbe acende, o anel some; quando apaga de novo, volta.

## 6. Névoa da arena do Torneio do Poder, commit 90d01a8
Ativa desde a 1.7.19 (dbe:fog_tournament_of_power, azul claro #9FC4EA). O céu acima continua preto.
- [ ] Mande um **print da arena olhando para o horizonte**.
- [ ] Informe a sua **distância de renderização** (Configurações > Vídeo), porque a névoa é medida em fração dela.
- [ ] A arena já não parece "flutuar no preto"? Se a cor não agradar, existem as alternativas b (quase branco) e c (azul mais fechado), para testar com `/fog @s push dbe:fog_tournament_of_power_b teste`.
