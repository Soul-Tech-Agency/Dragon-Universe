// Movido do index.js SEM mudança de código (O4, de cima para baixo): os segmentos 1–2 de então, linhas 157–343.
// Gerado por tools/move-segments.mjs. Os imports abaixo são os que o trecho usava de outros pontos do index.js.
import { jW } from "./20_shop_dialogues.js";
import { i0 } from "./15_entities.js";
import { hO } from "./14_player.js";
import { dialogues_data as pk } from "../data/dialogues_data.js";
import { system as pp } from "@minecraft/server";
import { cY } from "./04_tournament_dims.js";
import { fC } from "./11_entity_wrapper.js";
jW.registerDialogue({
  id: "enma_daioh_main_menu",
  npcId: "dbe:enma_daioh",
  title: "ui.dbe.npc.enma_daioh.title",
  body: [
    { text: "ui.dbe.npc.enma_daioh.main.text.evil", requirements: [{ test: "is_alignment", value: "evil" }] },
    { text: "ui.dbe.npc.enma_daioh.main.text.neutral", requirements: [{ test: "is_alignment", value: "neutral" }] },
    { text: "ui.dbe.npc.enma_daioh.main.text.good", requirements: [{ test: "is_alignment", value: "good" }] },
  ],
  buttons: [
    {
      buttonText: "ui.dbe.npc.enma_daioh.main.button.revive",
      onClick: (sG) => i0.get(sG.id)?.returnFromAfterlife("revive"),
    },
    { buttonText: "ui.dbe.npc.enma_daioh.main.button.reincarnate", nextDialogue: "confirm_reincarnate" },
  ],
  subMenus: [
    {
      id: "confirm_reincarnate",
      title: "ui.dbe.npc.enma_daioh.title",
      body: "ui.dbe.npc.enma_daioh.reincarnate.text",
      backButtonDialogue: "enma_daioh_main_menu",
      buttons: [
        {
          buttonText: "ui.dbe.npc.enma_daioh.reincarnate.button.confirm",
          onClick: (sG) => i0.get(sG.id)?.returnFromAfterlife("reincarnate"),
        },
      ],
    },
  ],
}),
  jW.registerDialogue({
    id: "goku_main_menu",
    npcId: "dbe:goku",
    title: "ui.dbe.npc.goku.title",
    body: [
      {
        text: "ui.dbe.npc.goku.main.text.master_bad_alignment",
        requirements: [
          { test: "has_master", value: "dbe:goku", operator: ">=", level: 1 },
          { test: "is_alignment", value: "evil" },
        ],
      },
      {
        text: "ui.dbe.npc.goku.main.text.master_1",
        requirements: [{ test: "has_master", level: 1, value: "dbe:goku" }],
      },
      {
        text: "ui.dbe.npc.goku.main.text.master_2",
        requirements: [{ test: "has_master", level: 2, value: "dbe:goku" }],
      },
      {
        text: "ui.dbe.npc.goku.main.text.master_3",
        requirements: [{ test: "has_master", level: 3, value: "dbe:goku" }],
      },
      {
        text: "ui.dbe.npc.goku.main.text.master_4",
        requirements: [{ test: "has_master", level: 4, value: "dbe:goku" }],
      },
      {
        text: "ui.dbe.npc.goku.main.text.master_5",
        requirements: [{ test: "has_master", level: 5, value: "dbe:goku" }],
      },
      { text: "ui.dbe.npc.goku.main.text.evil", requirements: [{ test: "is_alignment", value: "evil" }] },
      { text: "ui.dbe.npc.goku.main.text.neutral", requirements: [{ test: "is_alignment", value: "neutral" }] },
      { text: "ui.dbe.npc.goku.main.text.good", requirements: [{ test: "is_alignment", value: "good" }] },
    ],
    buttons: [
      {
        buttonText: "ui.dbe.npc.goku.main.button.weight",
        nextDialogue: "weight",
        requirements: [
          { test: "is_alignment", operator: "!=", value: "evil" },
          { test: "has_master", value: "dbe:goku", operator: ">=", level: 2 },
        ],
      },
      {
        buttonText: "ui.dbe.npc.goku.main.button.skills",
        nextDialogue: "goku_skills",
        requirements: [
          { test: "is_alignment", operator: "!=", value: "evil" },
          { test: "has_master", value: "dbe:goku", operator: ">=", level: 3 },
        ],
      },
      {
        buttonText: "ui.dbe.mentor.main.button.invite",
        nextDialogue: "mentor_invite",
        requirements: [
          { test: "is_alignment", operator: "!=", value: "evil" },
          { test: "has_master", operator: "!=", value: "dbe:goku" },
        ],
      },
    ],
    subMenus: [
      {
        id: "weight",
        title: "ui.dbe.npc.goku.title",
        body: "ui.dbe.weight.text",
        backButtonDialogue: "goku_main_menu",
        buttons: [
          {
            buttonText: "ui.dbe.npc.goku.weight.button.catch",
            rewards: [{ type: "item", item: "dbe:training_shirt" }],
          },
        ],
      },
      { id: "goku_skills", backButtonDialogue: "goku_main_menu", type: "skills" },
      {
        id: "mentor_invite",
        title: "ui.dbe.npc.goku.title",
        backButtonDialogue: "goku_main_menu",
        type: "mentor_invite",
      },
    ],
  }),
  jW.registerDialogue({
    id: "kami_sama_main_menu",
    npcId: "dbe:kami_sama",
    title: "ui.dbe.npc.kami_sama.title",
    body: [
      { text: "ui.dbe.npc.kami_sama.main.text.evil", requirements: [{ test: "is_alignment", value: "evil" }] },
      { text: "ui.dbe.npc.kami_sama.main.text.neutral", requirements: [{ test: "is_alignment", value: "neutral" }] },
      { text: "ui.dbe.npc.kami_sama.main.text.good", requirements: [{ test: "is_alignment", value: "good" }] },
    ],
    buttons: [
      {
        buttonText: "ui.dbe.npc.kami_sama.main.button.cut_tail",
        nextDialogue: "cut_tail",
        requirements: [
          { test: "has_modifier", value: "saiyan_tail" },
          { test: "is_race", value: "saiyan" },
          { test: "is_alignment", operator: "!=", value: "evil" },
        ],
      },
      {
        buttonText: "ui.dbe.npc.kami_sama.main.button.skills",
        nextDialogue: "kami_sama_skills",
        requirements: [{ test: "is_alignment", operator: "!=", value: "evil" }],
      },
    ],
    subMenus: [
      {
        id: "cut_tail",
        title: "ui.dbe.npc.kami_sama.title",
        body: "ui.dbe.npc.kami_sama.cut_tail.text",
        backButtonDialogue: "kami_sama_main_menu",
        buttons: [
          {
            buttonText: "ui.dbe.npc.kami_sama.cut_tail.button.confirm",
            onClick: (sG) => {
              hO(sG).removeTail(!0);
            },
          },
        ],
      },
      { id: "kami_sama_skills", backButtonDialogue: "kami_sama_main_menu", type: "skills" },
    ],
  });
function pv(sG) {
  jW.registerDialogue(sG);
}
function pw() {
  for (let sG of pk) pv(sG);
  pp.afterEvents.scriptEventReceive.subscribe(({ id: sH, message: sI }) => {
    if (sH === "dbe:dialogue_registry") {
      let sK = JSON.parse(sI);
      for (let sL of sK) pv(sL);
    }
  });
}
pw(),
  cY.register("dbe:future_trunks"),
  cY.register("dbe:hyperbolic_time_chamber"),
  cY.register("dbe:other_world"),
  cY.register("dbe:world_martial_arts_tournament");
import { entity_data as px } from "../data/entities_data.js";
import { system as py } from "@minecraft/server";
function pz() {
  for (let sG of px) fC.registerDBEEntityData(sG);
  py.afterEvents.scriptEventReceive.subscribe(({ id: sH, message: sI }) => {
    if (sH === "dbe:entity_registry") {
      let sK = JSON.parse(sI);
      for (let sL of sK) fC.registerDBEEntityData(sL);
    }
  });
}
pz();
export { pv, pw, pz };
