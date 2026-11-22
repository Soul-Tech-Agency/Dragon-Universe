# Skills sem efeito (ou com efeito incompleto)

Autor: Bússola. Data: 2026-11-22. Base: `agent/viagens` em `08fd14e` (= integration/1.7.17 + redesign). Trabalho só de leitura: nada foi alterado nem testado no Minecraft.

Caminhos relativos a `Dragon Universe_bp/scripts/`: `ix` = `index.js`, `sd` = `data/skills_data.js`, `rd` = `data/races_data.js`.
Os textos citados são do `Dragon Universe_rp/texts/pt_BR.lang`. A referência DragonMineZ está em `~/projects/addon/Dragon-Universe/docs/dragonminez-2.2.1/`.

## 1. Como uma skill passa a ter efeito (para ler as tabelas)

- **Classe própria:** só 6 skills têm classe dedicada (`cG.register`, ix:20459-20465): absorption, burst_move, fly, jump, metamoran_dance e rapid_movement.
- **Classes genéricas:** as outras usam `hj` (as `ki_attack`) ou `cH` (as `toggle`) (ix:20466-20474).
- **Efeitos genéricos pelos dados** (aplicados quando a skill está ativa):
  - `multipliers` vão para os modificadores (ix:18758-18764, via `dN` ix:8583). Valem para atributos e também para **stats pelo id** (`melee_damage`, `defense`, `jump`, `flying_speed`, `dodge`…), porque `setValue` de cada stat multiplica por `getMultiplier(id)` (ix:~8706).
  - `kiDrain` com `always`, `on_damage` e `on_hit` (ix:8777, 10395, 14634).
  - Os demais campos e onde são lidos:

    | Campo | Onde é lido |
    |---|---|
    | `healthDrain` | ix:10506 |
    | `wilDamage` | ix:14624 |
    | `propertyId` | ix:7866-7891 |
    | `functionSlot` (menu Funções) | ix:16573 |
    | `showHudIcon` | ix:7908 |
    | `spawnChance` | ix:9975 |
    | `removeOnDeath` | ix:10013 |
    | requisito `has_skill` | ix:20024 |

### Resultado da varredura das 29 skills

**Têm efeito real (25):**

- **Com classe própria:** absorption, burst_move, fly, jump, metamoran_dance, rapid_movement.
- **Os 7 `ki_attack`:** final_flash, galick_gun, genki_dama, kamehameha, ki_blast, kienzan, makankosappo.
- **Toggles com efeito pelos dados:**
  - aura_boost, gigantification, kaioken, ki_protect, ki_sense, legendary, majin_mark, ultra_instinct e friendly_fist;
  - **ki_fist e ki_scythe:** têm efeito, mas com um bug na cobrança de ki (§2.4);
  - **limiter:** funciona, mas ninguém consegue obtê-lo (§2.5).

**Sem efeito ou incompletas:**

| Skill | Veredito | Resumo |
|---|---|---|
| `healing_power` | **NENHUM efeito** | nenhum código lê a skill; ela é skill inicial de 3 raças |
| `potential_unleashed` | **só requisito** | os 10 níveis estão vazios; serve só de requisito para formas |
| `divine_ki` | **só requisito** | requisito de formas e diálogos; a descrição é vaga, então não promete nada além disso |
| `hakai` | **parcial (bug)** | depois de desligada, nunca mais religa |
| `ki_fist`, `ki_scythe` | **bug** | gastam ki a cada golpe mesmo desligadas |
| `limiter` | **inacessível** | funciona, mas nenhum jogador consegue obtê-la |

---

## 2. Itens, um por um

### 2.1 `healing_power` (Poder de Cura): sem efeito

- **Texto:** "Concede a capacidade de se autocurar ou, se aprimorada, também a possibilidade de curar aliados próximos."
- **O que acontece hoje:**
  - Nenhuma linha do script lê `healing_power`.
  - A definição é `{type:"toggle", isPassive:true, price:4, availableTrainers:[/* "dbe:king_kai" */], tiers:[]}` (sd:281-290).
  - Com `tiers: []` o nível máximo é 0, então ela não pode ser aprimorada (ix:7748, 16764).
  - A cura que existe vem só da regeneração da raça (`regenRate`; stat `regen_rate`, ix:8806-8813, usada por `restoreHealth` ix:10340-10353) e não depende da skill.
- **Impacto:**
  - É skill inicial de **Namekuseijin, Majin e Bio Androide** (rd:655, 980, 1072). Todo jogador dessas raças a tem, e ela não faz nada.
  - Não pode ser comprada (sem treinador), nem obtida por desejo ou missão; só pelo comando `/dbe:learn`.
- **O que a descrição promete:** (a) curar a si mesmo; (b) com nível maior, curar aliados próximos.
- **Referência DragonMineZ** (`assets/dragonminez/lang/en_us.json`):
  - `skill.dragonminez.racial_namekian.regeneration` = "recover %s%% of your max health over %s seconds, spending %s%% of your Ki and %s%% of your stamina. Taking damage interrupts it. Cooldown…".
  - É uma cura canalizada, com custo de ki e de vigor, que é interrompida por dano e tem recarga.
  - Os parâmetros estão em `GeneralServerConfig$NamekianRacialConfig` (regenChannelSeconds, regenHealthRatio, regenEnergyCost, regenStaminaCost, regenCooldownSeconds). Os valores padrão não foram extraídos.
  - Não achei skill de curar aliados.
- **Proposta mínima, em 2 passos:**
  1. **Passo A, só dados, sem risco de save.**
     - Dar à skill um efeito passivo de verdade: `multipliers: { regen_rate: 1.25 }` (valor a decidir, D2).
     - O stat `regen_rate` já multiplica pelos modificadores do id, e skills passivas ficam ativas ao serem adicionadas (ix:9886-9889), então todos os jogadores que já a têm passam a regenerar mais.
     - Junto, trocar o texto para o que ela faz: "Aumenta a sua regeneração de vida em 25%." (pt/en/es).
  2. **Passo B, opcional, cura ativa como no DragonMineZ.**
     - Tornar a skill ativa no menu Funções, com `functionSlot` e `isPassive: false`. Com ela ligada e o jogador parado ou agachado, cura X% da vida máxima ao longo de N segundos, gastando ki e vigor; dano interrompe e há recarga.
     - Com `tiers` (ex.: 2 níveis), o nível 2 também cura aliados num raio de R blocos.
     - Precisa de classe nova `cG.register("healing_power", …)`, no padrão de `rV`/`cI`.
- **Arquivos:**
  - Passo A: `sd` e os 3 `.lang`.
  - Passo B: também `ix` (classe nova e registro), mais um som ou partícula opcional.
- **Risco de save:**
  - **A: nenhum.** As definições não são salvas: o save guarda só `{id, level, state}` na propriedade `"dbe"` (ix:9886, 9966-9969, 11269).
  - **B: médio.**
    - Hoje as entradas salvas estão com `state.enabled = true`, porque a skill é passiva e foi ligada ao ser adicionada. Ao virar ativa, ela já carregaria **ligada** nos personagens antigos.
    - Resolver de um destes jeitos: ao carregar, desligar `healing_power` uma vez (marca de migração `dbe:` nova); ou ler um estado novo (`state.channeling`) em vez de `enabled`.
    - Aumentar `tiers` não precisa de migração: o nível salvo é 1, e o tier 0 libera sozinho (ix:7791).
- **Como testar:**
  - **A:**
    1. Num Namekuseijin antigo, anotar a "Taxa de Regeneração" em Estatísticas → Informações completas.
    2. Atualizar o pacote: o valor deve subir 25%.
    3. Levar dano e cronometrar a volta da vida, antes e depois.
    4. Um Terráqueo não deve mudar.
  - **B:**
    1. Ligar no menu Funções e ficar parado: a vida sobe e o ki cai.
    2. Levar um golpe: a cura para.
    3. A recarga impede religar logo em seguida.
    4. Com o nível 2, um aliado a menos de R blocos também cura.
    5. Num mundo antigo, a skill **não** começa ligada.

### 2.2 `potential_unleashed` (Desbloqueio de Potencial): só requisito

- **Texto:** "Desperte todo o seu potencial oculto."
- **O que acontece hoje:**
  - Os 10 níveis só têm `upgradeCost`, sem `multipliers` (sd:772-788).
  - A skill é requisito de:
    - a forma Potencial Liberado do Namekuseijin (rd:697);
    - a Forma Orange (rd:728);
    - a Forma Mística (global_transformations_data:32);
    - a Forma Bestial, com nível ≥ 10 da skill (global_transformations_data:69-71).
  - Subir de nível só importa para a Bestial.
- **Como se obtém:**
  - comprando do Senhor Kaio por 10 pontos (sd:772-773);
  - por desejo a Shenlong ou Porunga, só para Namekuseijin (wish_data:204-216).
- **Referência DragonMineZ:** `skill.dragonminez.potentialunlock.desc` = "Let's you Unlock your real Potential to increase your power release to the limit!"
- **Proposta mínima:** dar a cada nível um bônus pequeno e crescente, por exemplo `multipliers: { strength, dexterity, willpower: 1 + 0.02 × nível }`, chegando a x1.2 no nível 10. Mantém os requisitos de forma como estão.
- **Alternativa:** não mexer no efeito e só trocar o texto, dizendo que a skill libera formas e que o nível 10 libera a Forma Bestial.
- **Arquivos:** `sd` e os 3 `.lang`.
- **Risco de save:** nenhum, porque as definições não são salvas.
  - **Equilíbrio:** soma com o multiplicador das formas (Mística x3.1, Bestial x4); conferir o BP final.
- **Como testar:** ver o BP e a Força em Estatísticas antes e depois de subir a skill; a Forma Mística continua bloqueada sem a skill.

### 2.3 `divine_ki` (Ki Divino): só requisito

- **Texto:** "Canalize o raro e poderoso Ki Divino."
- **O que acontece hoje:**
  - Só mostra o ícone no HUD.
  - É requisito de:
    - ultra_instinct (sd:857);
    - as formas divinas do Saiyajin: Deus, Blue, Rosé e as Evolution (rd:115, 464, 492, 526, 559, 598);
    - a Forma Divina do Terráqueo;
    - diálogos do Beerus (dialogues_data:137, 1062).
- **Como se obtém:** por desejo (wish_data:189-202). Também é objetivo de uma missão principal (main_quests_data:1751), não recompensa.
- **Referência DragonMineZ:** `racial_glind.divine_ki` = fica oculto ao sentir ki, a scouters e ao Teletransporte, salvo para quem tem forma divina.
- **Proposta:** como o texto é vago, nada falta de fato. Se quiserem efeito:
  - o `ki_sense` de quem **não** tem `divine_ki` deixa de detectar quem tem (ix:13407-13441, onde `canSenseKi` e o alvo são escolhidos);
  - ou só trocar o texto para "Libera as formas divinas e o Instinto Superior".
- **Risco de save:** nenhum.
- **Como testar:** dois jogadores, um com Ki Divino; o outro, com Sentir Ki, não deve ver o primeiro no HUD.

### 2.4 `ki_fist` (Punho de Ki) e `ki_scythe` (Foice de Ki): gastam ki mesmo desligadas (bug)

- **Texto do `ki_fist`:** "Envolva seus punhos com Ki para aumentar o dano. Cada golpe consome energia."
- **Causa:**
  - `processOnHitTriggers` (ix:14634-14638) percorre **todas** as skills toggle com `kiDrainTrigger === "on_hit"` e cobra o `kiDrain` **sem checar `isEnabled`**. Quem só possui a skill perde ki a cada golpe corpo a corpo, mesmo com ela desligada.
  - Quando o ki não basta, a função chama `disable()` numa skill que já estava desligada.
  - O caminho `on_damage` (ix:10395-10402) checa `sM.isEnabled &&` corretamente.
- **Proposta mínima:** em ix:14638, acrescentar `sN.isEnabled &&` antes do teste, igual a ix:10399.
  - A mesma linha concede maestria `on_hit`. Hoje nenhuma skill usa esse gatilho, então não há efeito colateral.
- **Arquivos:** `ix`, 1 linha.
- **Risco de save:** nenhum.
- **Como testar:**
  1. Aprender o Punho de Ki e deixá-lo **desligado**.
  2. Bater num mob e ver a barra de ki: não pode cair.
  3. Ligar e bater de novo: cai o `kiDrain` do nível.

### 2.5 `limiter` (Limitador): funciona, mas é inacessível

- **Texto:** "Permite reduzir ou aumentar seu poder."
- **O que acontece hoje:**
  - Os níveis têm multiplicadores abaixo de 1, e agachar com ki cheio sobe o nível (ix:10536-10537).
  - Não tem preço, treinador, desejo, missão nem raça que a dê; só sai com `/dbe:learn`.
- **Proposta:** decidir se é uma skill de "modo treino" para vender (preço e treinador em `sd`) ou se fica só para operadores (então deixar documentado e não mostrar na loja).
- **Risco de save:** nenhum.

### 2.6 `hakai`: depois de desligada, não religa mais (bug)

- **Texto:** "Habilidade exclusiva dos Hakaishins. Fique mais forte conforme sua fúria aumenta."
- **Causa:**
  - Ligar o Instinto Superior desliga o Hakai (ix:7883), e carregar o personagem com o Instinto ligado também desliga (ix:9944).
  - O Hakai é passivo e não tem `functionSlot`. O único caminho que liga skills passivas é o `addSkill` (ix:9889), então depois de desligado ele fica desligado para sempre.
- **Proposta mínima:** quando o Instinto Superior for desligado, religar o `hakai` se o jogador o possuir. Há duas formas:
  - em `cH.disable()` para `ultra_instinct`, simétrico a ix:7883;
  - ou no `init()` (ix:9944): se a skill é passiva e o Instinto está desligado, ligar.
- **Arquivos:** `ix`, poucas linhas.
- **Risco de save:** baixo. Personagens antigos com Hakai desligado voltam a tê-lo ligado no próximo `init`, que é o comportamento pretendido.
- **Como testar:**
  1. Ter Hakai e Instinto Superior.
  2. Ligar o Instinto: o Hakai some do HUD.
  3. Desligar o Instinto: o Hakai volta.
  4. Sair e entrar no mundo: o estado se mantém.

### 2.7 Pequenos ajustes de texto e dados mortos (sem efeito no jogo)

- **`friendly_fist`:** o texto diz "Somente em PvP", mas o efeito (o golpe fatal deixa o alvo com 1 de vida) vale também contra mobs (ix:10306-10324, `isFriendlyDamage` ix:11345). Corrigir o texto ou o código (D6).
- **Campos que ninguém lê:**
  - `kaioken.colorPriority` e `legendary.colorPriority` (só valem junto de `colorOverrides`, ix:9925);
  - `hakai.requirements: []`;
  - `price` de `healing_power` e de `makankosappo`, que estão sem treinador (o treinador do makankosappo está comentado, sd:707-709);
  - o getter `cF.staminaDrain` (ix:7760).
- **Proposta:** remover esses campos ou deixar um comentário. Não mudam o jogo.

---

## 3. Risco de save (resumo)

- O personagem salva só `{id, level, state:{enabled?, selectedTierIndex?}}` de cada skill, no JSON da propriedade `"dbe"` (ix:9886, 9966-9969, 11269).
- Tiers, multiplicadores e textos são lidos dos dados a cada carga (ix:7716). Por isso **mudar efeito, texto ou adicionar tiers não precisa de migração**.
- **Precisam de cuidado:**
  - **renomear ou remover** um id de skill: a carga lança erro para id desconhecido (ix:9992-9995, 7717);
  - **trocar passiva ↔ ativa**: o `state.enabled` antigo continua valendo (§2.1, passo B);
  - **skills iniciais novas de raça:** só entram em `setRace` (ix:13897), então personagens antigos não as recebem sem migração. Além disso, `addSkill` não confere duplicata: trocar de raça de novo reinicia essas skills no nível 1.

---

## 4. Decisões para o usuário

- **D1. Poder de Cura:** qual caminho?
  - (a) só o passo A (bônus passivo de regeneração e texto novo), sem risco e em pouco tempo;
  - (b) A agora e B (cura ativa e cura de aliados) numa versão seguinte;
  - (c) só trocar o texto para o que a regeneração da raça já faz.
  - **Recomendo (b).**
- **D2.** Valor do bônus do passo A: x1.25 na regeneração? Uma referência: o Majin já tem x2.0 de raça.
- **D3. Desbloqueio de Potencial:** dar bônus por nível (até x1.2), ou só reescrever o texto?
- **D4. Ki Divino:** esconder do Sentir Ki quem tem Ki Divino, ou só reescrever o texto?
- **D5. Limitador:** vender (por quanto e com qual mestre?) ou deixar só para operadores?
- **D6. Punho Amigável:** "Somente em PvP" vale? Se sim, o código passa a ignorar mobs; se não, corrige-se o texto.
- **D7. Correções seguras para já** (só código, sem save): o bug do ki do Punho e da Foice de Ki (§2.4) e o do Hakai que não religa (§2.6). Posso fazer as duas num commit pequeno?
