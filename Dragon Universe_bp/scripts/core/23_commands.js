// Movido do index.js SEM mudança de código (O4, de cima para baixo): os segmentos 1–35 de então, linhas 154–1129.
// Gerado por tools/move-segments.mjs. Os imports abaixo são os que o trecho usava de outros pontos do index.js.
import { system as lb, CommandPermissionLevel as lf, CustomCommandParamType as lj, CustomCommandStatus as lk, Player as lp } from "@minecraft/server";
import { g5, gI, gT } from "./12_quests.js";
import { i3 } from "./15_entities.js";
import { d4 } from "./05_db_cooldowns.js";
import { aI, aO, bG } from "./01_util.js";
import { hO } from "./14_player.js";
import { eG, eJ, eO, eP } from "./08_fusion_regions.js";
import { e8 } from "./07_stats.js";
import { fO, fR, fT } from "./11_entity_wrapper.js";
import { cj } from "./02_forms_timers.js";
import { duTravel } from "./du_travel.js";
import { physicalDestinationId as duPhysicalDestinationId, reportTravelFailure as duReportTravelFailure } from "../travel_safety.js";
import { modifiers_data as l7 } from "../data/modifiers_data.js";
import { regionsData as l8 } from "../data/regions_data.js";
import { skills_data as l9 } from "../data/skills_data.js";
var lq = {
  customCommand: {
    name: "dbe:ban",
    description: "Use para banir um jogador.",
    permissionLevel: lf.GameDirectors,
    mandatoryParameters: [{ name: "playerName", type: lj.String }],
    optionalParameters: [{ name: "reason", type: lj.String }],
  },
  callback: ({ sourceEntity: sG }, sH, sI) => (
    sG instanceof lp && sG.name !== sH && gI.ban(sH, sI), { status: lk.Success }
  ),
};
import {
  CommandPermissionLevel as lv,
  CustomCommandParamType as lw,
  CustomCommandStatus as lx,
  Player as ly,
  system as lz,
} from "@minecraft/server";
var lA = {
  customCommand: {
    name: "dbe:data",
    description: "Use para ver os dados de jogadores.",
    permissionLevel: lv.GameDirectors,
    optionalParameters: [{ name: "victim", type: lw.EntitySelector }],
  },
  callback: ({ sourceEntity: sG }, sH) => (
    sG instanceof ly &&
      lz.run(() => {
        if (sH)
          for (let sI of sH) {
            let sK = i3.getDBEEntity(sI);
            if (sK) {
              let { data: sL } = sK;
              sG.sendMessage(
                (sI instanceof ly ? sI.name : sI.id) + ": \n§a" + JSON.stringify(sL.getData(), null, "  "),
              );
            }
          }
        else {
          let sM = i3.getDBEEntity(sG);
          if (sM) {
            let { data: sN } = sM;
            sG.sendMessage("§a" + JSON.stringify(sN.getData(), null, "  "));
          }
        }
      }),
    { status: lx.Success }
  ),
};
import {
  CommandPermissionLevel as lB,
  CustomCommandParamType as lC,
  CustomCommandStatus as lD,
  EntityTypes as lE,
  system as lF,
  world as lG,
} from "@minecraft/server";
var lH = {
  customCommand: {
    name: "dbe:entities",
    description: "",
    permissionLevel: lB.GameDirectors,
    mandatoryParameters: [
      { name: "dimension", type: lC.String },
      { name: "destination", type: lC.Location },
    ],
  },
  callback: (sG, sH, sI) => {
    let sK = lG.getDimension(sH),
      sL = lE.getAll().filter((sP) => sP.id.startsWith("dbe:")),
      sM = 2,
      sN = 0,
      sO = sI;
    return (
      lF.run(() => {
        for (let sP of sL) {
          try {
            let sQ = d4(sP.id, sK, sO);
            sQ && i3.getDBEEntity(sQ)?.attributes.getAttribute("constitution")?.setValue(9999999);
          } catch {}
          (sN += sM), (sO.x += sM), sN >= 16 && ((sO.x -= sN), (sO.z += sM), (sN = 0));
        }
      }),
      { status: lD.Success }
    );
  },
};
import { CommandPermissionLevel as lI, CustomCommandStatus as lJ, world as lK } from "@minecraft/server";
var lL = {
  customCommand: {
    name: "dbe:fixstructures",
    description: "Recarrega as estruturas. Reinicie o mundo para aplicar as alterações.",
    permissionLevel: lI.Admin,
  },
  callback: () => (bG(lK, "structures").set("loaded", []), { status: lJ.Success }),
};
import { skills_data as lM } from "../data/skills_data.js";
import {
  CommandPermissionLevel as lN,
  CustomCommandParamType as lO,
  CustomCommandStatus as lP,
  Player as lQ,
} from "@minecraft/server";
var lR = {
  customCommand: {
    name: "dbe:learn",
    description: "Use para aprender novas habilidades.",
    permissionLevel: lN.GameDirectors,
    mandatoryParameters: [{ name: "dbe:skill", type: lO.Enum }],
    optionalParameters: [
      { name: "level", type: lO.Integer },
      { name: "victim", type: lO.PlayerSelector },
    ],
  },
  callback: ({ sourceEntity: sG }, sH, sI, sK) => {
    let sL = sK ?? (sG ? [sG] : []);
    for (let sM of sL) {
      if (!(sM instanceof lQ)) continue;
      let { skills: sN } = hO(sM);
      if (sH === "*")
        for (let { id: sO } of lM) {
          let sP = sN.tryLearnSkill(sO);
          sI && sP?.setLevel(sI);
        }
      else {
        let sQ = sN.tryLearnSkill(sH);
        sI && sQ?.setLevel(sI);
      }
    }
    return { status: lP.Success };
  },
};
import {
  CommandPermissionLevel as lS,
  CustomCommandParamType as lT,
  CustomCommandStatus as lU,
  system as lV,
} from "@minecraft/server";
function lW(sG, sH) {
  lV.run(() => {
    eP.getAllRegions()
      .find(({ id: sI }) => sI === sH)
      ?.teleportToRegion(sG);
  });
}
var lX = {
  customCommand: {
    name: "dbe:region",
    description: "Teleporta entidades para regiões específicas do add-on.",
    permissionLevel: lS.GameDirectors,
    mandatoryParameters: [{ name: "dbe:region", type: lT.Enum }],
    optionalParameters: [{ name: "victim", type: lT.EntitySelector }],
  },
  callback: ({ sourceEntity: sG }, sH, sI) => {
    let sK = sI ?? (sG ? [sG] : []);
    for (let sL of sK) lW(sL, sH);
    return { status: lU.Success };
  },
};
import {
  CommandPermissionLevel as lY,
  CustomCommandParamType as lZ,
  CustomCommandStatus as m0,
  Player as m1,
} from "@minecraft/server";
var m2 = {
  customCommand: {
    name: "dbe:removemodifier",
    description: "Remove modificadores.",
    permissionLevel: lY.GameDirectors,
    mandatoryParameters: [{ name: "dbe:modifier", type: lZ.Enum }],
    optionalParameters: [{ name: "victim", type: lZ.PlayerSelector }],
  },
  callback: ({ sourceEntity: sG }, sH, sI) => {
    let sK = sI ?? (sG ? [sG] : []);
    for (let sL of sK) {
      if (!(sL instanceof m1)) continue;
      let { attributes: sM } = hO(sL);
      sM.modifiers.removeModifier(sH);
    }
    return { status: m0.Success };
  },
};
import { skills_data as m3 } from "../data/skills_data.js";
import {
  CommandPermissionLevel as m4,
  CustomCommandParamType as m5,
  CustomCommandStatus as m6,
  Player as m7,
  system as m8,
} from "@minecraft/server";
var m9 = {
  customCommand: {
    name: "dbe:removeskill",
    description: "Remove habilidades.",
    permissionLevel: m4.GameDirectors,
    mandatoryParameters: [{ name: "dbe:skill", type: m5.Enum }],
    optionalParameters: [{ name: "victim", type: m5.PlayerSelector }],
  },
  callback: ({ sourceEntity: sG }, sH, sI) => (
    m8.run(() => {
      let sK = sI ?? (sG ? [sG] : []);
      for (let sL of sK) {
        if (!(sL instanceof m7)) continue;
        let { skills: sM } = hO(sL);
        if (sH === "*") {
          for (let { id: sN } of m3) sM.removeSkill(sN);
        } else sM.removeSkill(sH);
      }
    }),
    { status: m6.Success }
  ),
};
import {
  CommandPermissionLevel as mb,
  CustomCommandParamType as mf,
  CustomCommandStatus as mj,
  Player as mk,
} from "@minecraft/server";
var mp = {
  customCommand: {
    name: "dbe:reset",
    description: "Reseta os dados de um ou mais jogadores.",
    permissionLevel: mb.GameDirectors,
    optionalParameters: [{ name: "player", type: mf.PlayerSelector }],
  },
  callback: ({ sourceEntity: sG }, sH) => {
    let sI = sH ?? (sG ? [sG] : []);
    for (let sK of sI) sK instanceof mk && hO(sK).reset();
    return { status: mj.Success };
  },
};
import {
  CommandPermissionLevel as mq,
  CustomCommandParamType as mv,
  CustomCommandStatus as mw,
  Player as mx,
} from "@minecraft/server";
var my = {
  customCommand: {
    name: "dbe:setattribute",
    description: "Define atributos (força, destreza, etc.).",
    permissionLevel: mq.GameDirectors,
    mandatoryParameters: [
      { name: "dbe:attribute", type: mv.Enum },
      { name: "value", type: mv.Integer },
    ],
    optionalParameters: [{ name: "victim", type: mv.PlayerSelector }],
  },
  callback: ({ sourceEntity: sG }, sH, sI, sK) => {
    let sL = sK ?? (sG ? [sG] : []);
    for (let sM of sL) {
      if (!(sM instanceof mx)) continue;
      let { attributes: sN } = hO(sM);
      if (sH === "*") {
        for (let sO of e8) sN.getAttribute(sO)?.setValue(sI);
      } else sN.getAttribute(sH)?.setValue(sI);
    }
    return { status: mw.Success };
  },
};
import {
  CommandPermissionLevel as mz,
  CustomCommandParamType as mA,
  CustomCommandStatus as mB,
} from "@minecraft/server";
var mC = {
  customCommand: {
    name: "dbe:setcolor",
    description: "Define cores específicas (aura, cabelo, etc.).",
    permissionLevel: mz.GameDirectors,
    mandatoryParameters: [
      { name: "dbe:color", type: mA.Enum },
      { name: "red", type: mA.Integer },
      { name: "green", type: mA.Integer },
      { name: "blue", type: mA.Integer },
    ],
    optionalParameters: [{ name: "victim", type: mA.EntitySelector }],
  },
  callback: ({ sourceEntity: sG }, sH, sI, sK, sL, sM) => {
    let sN = sM ?? (sG ? [sG] : []);
    for (let sO of sN) {
      let sP = i3.getDBEEntity(sO);
      if (sP) {
        let { colors: sQ, ki: sR } = sP;
        sQ.setDefaultColor(sH, aI.normalize({ red: sI, green: sK, blue: sL })), sR.updateAuraColor();
      }
    }
    return { status: mB.Success };
  },
};
import {
  CommandPermissionLevel as mD,
  CustomCommandParamType as mE,
  CustomCommandStatus as mF,
  Player as mG,
  system as mH,
} from "@minecraft/server";
var mI = {
  customCommand: {
    name: "dbe:setcustom",
    description: "Define customizações de um ou mais jogadores",
    permissionLevel: mD.GameDirectors,
    mandatoryParameters: [
      { name: "dbe:customId", type: mE.Enum },
      { name: "index", type: mE.Integer },
    ],
    optionalParameters: [{ name: "victim", type: mE.PlayerSelector }],
  },
  callback: ({ sourceEntity: sG }, sH, sI, sK) => (
    mH.run(() => {
      let sL = sK ?? (sG ? [sG] : []);
      for (let sM of sL) sM instanceof mG && hO(sM).playerCustomization.setOptionValue(sH, sI);
    }),
    { status: mF.Success }
  ),
};
import {
  CommandPermissionLevel as mJ,
  CustomCommandParamType as mK,
  CustomCommandStatus as mL,
  Player as mM,
} from "@minecraft/server";
var mN = {
  customCommand: {
    name: "dbe:setmodifier",
    description: "Define modificadores.",
    permissionLevel: mJ.GameDirectors,
    mandatoryParameters: [{ name: "dbe:modifier", type: mK.Enum }],
    optionalParameters: [{ name: "victim", type: mK.PlayerSelector }],
  },
  callback: ({ sourceEntity: sG }, sH, sI) => {
    let sK = sI ?? (sG ? [sG] : []);
    for (let sL of sK) {
      if (!(sL instanceof mM)) continue;
      let { attributes: sM } = hO(sL);
      sM.modifiers.setModifier(sH);
    }
    return { status: mL.Success };
  },
};
import {
  CommandPermissionLevel as mO,
  CustomCommandParamType as mP,
  CustomCommandStatus as mQ,
  Player as mR,
  system as mS,
} from "@minecraft/server";
async function mT(sG, sH) {
  let { quests: sI } = sG;
  sI.hasQuest(sH) && (sI.deleteQuest(sH), await mS.waitTicks(20)), sI.addQuest(sH);
}
var mU = {
  customCommand: {
    name: "dbe:setquest",
    description: "Use para adicionar novas missões.",
    permissionLevel: mO.GameDirectors,
    mandatoryParameters: [{ name: "dbe:quest", type: mP.Enum }],
    optionalParameters: [{ name: "victim", type: mP.PlayerSelector }],
  },
  callback: ({ sourceEntity: sG }, sH, sI) => {
    let sK = sI ?? (sG ? [sG] : []);
    for (let sL of sK) {
      if (!(sL instanceof mR)) continue;
      let sM = hO(sL);
      if (sH === "*") {
        for (let { id: sN } of g5.getAllQuestData()) mT(sM, sN);
      } else mT(sM, sH);
    }
    return { status: mQ.Success };
  },
};
import {
  CommandPermissionLevel as mV,
  CustomCommandParamType as mW,
  CustomCommandStatus as mX,
  Player as mY,
  system as mZ,
} from "@minecraft/server";
var n0 = {
  customCommand: {
    name: "dbe:setrace",
    description: "Define a raça de um ou mais jogadores",
    permissionLevel: mV.GameDirectors,
    mandatoryParameters: [{ name: "dbe:race", type: mW.Enum }],
    optionalParameters: [{ name: "victim", type: mW.PlayerSelector }],
  },
  callback: ({ sourceEntity: sG }, sH, sI) => (
    mZ.run(() => {
      let sK = sI ?? (sG ? [sG] : []);
      for (let sL of sK) {
        if (!(sL instanceof mY)) continue;
        let sM = hO(sL);
        fR.isRaceAvailableForPlayer(sM, sH)
          ? sM.setRace(sH)
          : sL.sendMessage({ translate: "message.changeRace.noPermission" });
      }
    }),
    { status: mX.Success }
  ),
};
import {
  CommandPermissionLevel as n1,
  CustomCommandParamType as n2,
  CustomCommandStatus as n3,
  Player as n4,
} from "@minecraft/server";
var n5 = {
  customCommand: {
    name: "dbe:setvalue",
    description: "Define certos valores (nível, pontos de treinamento, etc.).",
    permissionLevel: n1.GameDirectors,
    mandatoryParameters: [
      { name: "dbe:value", type: n2.Enum },
      { name: "value", type: n2.Integer },
    ],
    optionalParameters: [{ name: "player", type: n2.PlayerSelector }],
  },
  callback: ({ sourceEntity: sG }, sH, sI, sK) => {
    let sL = sK ?? (sG ? [sG] : []),
      sM = n3.Failure;
    for (let sN of sL) {
      if (!(sN instanceof n4)) continue;
      let sO = hO(sN);
      switch (sH) {
        case "alignment":
          sO.alignment.setAlignment(sI), (sM = n3.Success);
          break;
        case "attribute_points":
          sO.pointsManager.add("attribute_points", sI), (sM = n3.Success);
          break;
        case "mastery":
          let { masteries: sP, transformations: sQ } = sO;
          sP.getMastery(sQ.currentTransformation.id)?.setPercentage(sI), (sM = n3.Success);
          break;
        case "skill_points":
          sO.pointsManager.add("skill_points", sI), (sM = n3.Success);
          break;
        case "zeni":
          sO.zeni.setValue(sI), (sM = n3.Success);
          break;
        case "level":
          sO.level.setLevel(sI), (sM = n3.Success);
          break;
      }
    }
    return { status: sM };
  },
};
import {
  CommandPermissionLevel as n6,
  CustomCommandParamType as n7,
  CustomCommandStatus as n8,
  Player as n9,
  system as nb,
} from "@minecraft/server";
var nf = {
  customCommand: {
    name: "dbe:showform",
    description: "Abre um formulário para um jogador.",
    permissionLevel: n6.GameDirectors,
    mandatoryParameters: [{ name: "dbe:actionform", type: n7.Enum }],
    optionalParameters: [{ name: "victim", type: n7.PlayerSelector }],
  },
  callback: ({ sourceEntity: sG }, sH, sI) => (
    nb.run(() => {
      let sK = sI ?? (sG ? [sG] : []);
      for (let sL of sK) sL instanceof n9 && cj.displayForm(sL, sH);
    }),
    { status: n8.Success }
  ),
};
import {
  CommandPermissionLevel as nj,
  CustomCommandParamType as nk,
  CustomCommandStatus as np,
  system as nq,
} from "@minecraft/server";
var nv = {
  customCommand: {
    name: "dbe:transform",
    description: "Transforma jogadores.",
    permissionLevel: nj.GameDirectors,
    mandatoryParameters: [{ name: "dbe:transformation", type: nk.Enum }],
    optionalParameters: [{ name: "victim", type: nk.EntitySelector }],
  },
  callback: ({ sourceEntity: sG }, sH, sI) => (
    nq.run(() => {
      let sK = sI ?? (sG ? [sG] : []);
      for (let sL of sK) {
        let sM = i3.getDBEEntity(sL);
        sM && sM.transformations.getTransformationById(sH)?.transform();
      }
    }),
    { status: np.Success }
  ),
};
import {
  CommandPermissionLevel as nw,
  CustomCommandParamType as nx,
  CustomCommandStatus as ny,
  Player as nz,
} from "@minecraft/server";
var nA = {
  customCommand: {
    name: "dbe:unban",
    description: "Use para desbanir um jogador.",
    permissionLevel: nw.GameDirectors,
    mandatoryParameters: [{ name: "playerName", type: nx.String }],
  },
  callback: ({ sourceEntity: sG }, sH) => (sG instanceof nz && sG.name !== sH && gI.unban(sH), { status: ny.Success }),
};
import {
  CommandPermissionLevel as nB,
  CustomCommandStatus as nC,
  Player as nD,
  system as nE,
  world as nF,
} from "@minecraft/server";
var nG = {
  customCommand: { name: "dbe:worlddata", description: "Exibe dados do mundo", permissionLevel: nB.GameDirectors },
  callback: ({ sourceEntity: sG }) => (
    nE.run(() => {
      let sH = bG(nF, "dragon_evolution");
      sG instanceof nD && sG.sendMessage("world: \n§a" + JSON.stringify(sH.getData(), null, "  "));
    }),
    { status: nC.Success }
  ),
};
import {
  CommandPermissionLevel as nH,
  CustomCommandParamType as nI,
  CustomCommandStatus as nJ,
  Player as nK,
  system as nL,
} from "@minecraft/server";
var nM = {
  customCommand: {
    name: "dbe:pay",
    cheatsRequired: !1,
    description: "Transfere zeni para outro jogador.",
    permissionLevel: nH.Any,
    mandatoryParameters: [
      { name: "amount", type: nI.Integer },
      { name: "player", type: nI.PlayerSelector },
    ],
  },
  callback: ({ sourceEntity: sG }, sH, sI) => (
    nL.run(() => {
      if (sG instanceof nK)
        for (let sK of sI) {
          let { zeni: sL } = hO(sK),
            sM = hO(sG).zeni.transferValue(sH, sL);
          if (sM === "InsufficientBalance") {
            sG.sendMessage({ translate: "command.pay.insufficient_balance" });
            break;
          }
          if (sM === "InvalidAmount") {
            sG.sendMessage({ translate: "command.pay.invalid_amount" });
            break;
          }
          sM === "Success" && sG.sendMessage({ translate: "command.pay.success", with: ["" + sH, sK.name] });
        }
    }),
    { status: nJ.Success }
  ),
};
import {
  CommandPermissionLevel as nN,
  CustomCommandParamType as nO,
  CustomCommandStatus as nP,
  Player as nQ,
} from "@minecraft/server";
var nR = {
  customCommand: {
    name: "dbe:group.acceptinvite",
    description: "Aceita o convite para entrar em um grupo de jogadores.",
    permissionLevel: nN.Any,
    mandatoryParameters: [{ name: "groupName", type: nO.String }],
  },
  callback: ({ sourceEntity: sG }, sH) => {
    if (sG instanceof nQ) {
      let sI = eJ.getGroupByName(sH);
      return sI && eJ.acceptInvite(sG, sI.id), { status: nP.Success };
    }
  },
};
import { CommandPermissionLevel as nS, CustomCommandStatus as nT, Player as nU } from "@minecraft/server";
var nV = {
  customCommand: {
    name: "dbe:group.claim",
    description: "Reivindica a região atual como território do seu grupo.",
    permissionLevel: nS.Any,
  },
  callback: ({ sourceEntity: sG }) => {
    if (sG instanceof nU) {
      let sH = eJ.getPlayerGroup(sG.id);
      if (!sH) {
        sG.sendMessage({ translate: "player_group.not_in_group" });
        return;
      }
      if (!sH.isOwner(sG.id)) {
        sG.sendMessage({ translate: "player_group.no_permission" });
        return;
      }
      if (sH.claimedRegions.length >= sH.maxClaims) {
        sG.sendMessage({ translate: "player_group.claim.max_claims_reached" });
        return;
      }
      let { dimension: sI, location: sK } = sG;
      return (
        sH.tryClaimLocation(sI, sK).then((sL) => {
          sL || sG.sendMessage({ translate: "player_group.claim.already_owned" });
        }),
        { status: nT.Success }
      );
    }
  },
};
import { CommandPermissionLevel as nW, CustomCommandStatus as nX, Player as nY } from "@minecraft/server";
var nZ = {
  customCommand: {
    name: "dbe:group.claims",
    description: "Exibe as coordenadas de todos os territórios do grupo.",
    permissionLevel: nW.Any,
  },
  callback: ({ sourceEntity: sG }) => {
    if (!(sG instanceof nY)) return;
    let sH = eJ.getPlayerGroup(sG.id);
    if (!sH) {
      sG.sendMessage({ translate: "player_group.not_in_group" });
      return;
    }
    let { claimedRegions: sI } = sH,
      sK = sI.map(({ dimension: sL, spawnPoint: sM }, sN) => {
        let { x: sO, y: sP, z: sQ } = sM;
        return "§6" + (sN + 1) + ". §e" + sL.id + "§7: §f" + sO + " " + sP + " " + sQ;
      });
    for (let sL of sI) sH.displayClaimBorder(sG, sL);
    return sG.sendMessage([{ translate: "player_group.claim.list" }, "\n", sK.join("\n")]), { status: nX.Success };
  },
};
import { CommandPermissionLevel as o0, CustomCommandStatus as o1, Player as o2, system as o3 } from "@minecraft/server";
import { CustomForm as o4, ObservableString as o5 } from "@minecraft/server-ui";
var o6 = 800;
function o7(sG, sH) {
  let sI = eG(sH),
    sK = hO(sG),
    { zeni: sL } = sK;
  if (sL.value < o6) {
    sG.sendMessage({ translate: "shop.result.insufficient_zeni" });
    return;
  }
  if (sI.length < 3) {
    sG.sendMessage({ translate: "player_group.create.name_too_short" });
    return;
  }
  if (sI.length > 10) {
    sG.sendMessage({ translate: "player_group.create.name_too_long" });
    return;
  }
  if (eJ.getGroupByName(sI)) {
    sG.sendMessage({ translate: "player_group.create.already_exists" });
    return;
  }
  let sM = eJ.createGroup(sI);
  sM &&
    (sL.removeValue(o6),
    sG.sendMessage({ translate: "player_group.create.success", with: [sI] }),
    sM.addPlayerToGroup(sG));
}
var o8 = {
  customCommand: { name: "dbe:group.create", description: "Crie um grupo de jogadores.", permissionLevel: o0.Any },
  callback: ({ sourceEntity: sG }) => {
    if (sG instanceof o2) {
      if (eJ.hasGroup(sG)) {
        sG.sendMessage({ translate: "player_group.already_in_group" });
        return;
      }
      return (
        o3.run(() => {
          let sH = new o5("", { clientWritable: !0 }),
            sI = new o4(sG, { translate: "ui.create_group.title" });
          sI.textField({ translate: "ui.create_group.text_field.group_name" }, sH, {
            description: { translate: "ui.create_group.text", with: ["" + o6] },
          }),
            sI.button({ translate: "ui.create_group.button.confirm" }, () => {
              o7(sG, sH.getData()), sI.close();
            }),
            sI.show();
        }),
        { status: o1.Success }
      );
    }
  },
};
import { CommandPermissionLevel as o9, CustomCommandStatus as ob, Player as of } from "@minecraft/server";
var oj = {
  customCommand: {
    name: "dbe:group.friendlyfire",
    description: "Ativa ou desativa o fogo amigo do grupo.",
    permissionLevel: o9.Any,
  },
  callback: ({ sourceEntity: sG }) => {
    if (!(sG instanceof of)) return;
    let sH = eJ.getPlayerGroup(sG.id);
    if (!sH) {
      sG.sendMessage({ translate: "player_group.not_in_group" });
      return;
    }
    if (!sH.isOwner(sG.id)) {
      sG.sendMessage({ translate: "player_group.friendlyfire.no_permission" });
      return;
    }
    let sI = sH.toggleFriendlyFire();
    sG.sendMessage({ translate: sI ? "player_group.friendlyfire.enabled" : "player_group.friendlyfire.disabled" });
    for (let sK of sH.getOnlinePlayers())
      sK.id !== sG.id &&
        sK.sendMessage({
          translate: sI ? "player_group.friendlyfire.enabled.announce" : "player_group.friendlyfire.disabled.announce",
          with: [sH.name],
        });
    return { status: ob.Success };
  },
};
import {
  CommandPermissionLevel as ok,
  CustomCommandStatus as op,
  Player as oq,
  system as ov,
  world as ow,
} from "@minecraft/server";
var ox = {
  customCommand: { name: "dbe:group.home", description: "Teleporta para a base do grupo.", permissionLevel: ok.Any },
  callback: ({ sourceEntity: sG }) => (
    ov.run(() => {
      if (sG instanceof oq) {
        let sH = eJ.getPlayerGroup(sG.id);
        if (sH) {
          let { spawnPoint: sI } = sH;
          sI
            ? (sG.sendMessage({ translate: "player_group.base.teleporting" }),
              ov.runTimeout(() => {
                if (!sG.isValid) return;
                try {
                  sG.playSound("entity.player.teleport");
                  duTravel(sG, sI.location, { dimension: ow.getDimension(duPhysicalDestinationId(sI.dimensionId)), label: "group home" });
                } catch (error) { duReportTravelFailure(sG, "group home", error); }
              }, 80))
            : sG.sendMessage({ translate: "player_group.base.not_set" });
        } else sG.sendMessage({ translate: "player_group.not_in_group" });
      }
    }),
    { status: op.Success }
  ),
};
import {
  CommandPermissionLevel as oy,
  CustomCommandParamType as oz,
  CustomCommandStatus as oA,
  Player as oB,
  system as oC,
} from "@minecraft/server";
import { CustomForm as oD } from "@minecraft/server-ui";
var oE = {
  customCommand: {
    name: "dbe:group.info",
    description: "Exibe informações de um grupo.",
    permissionLevel: oy.Any,
    mandatoryParameters: [{ type: oz.String, name: "groupName" }],
  },
  callback: ({ sourceEntity: sG }, sH) => {
    if (sG instanceof oB) {
      let sI = eJ.getGroupByName(sH);
      sI &&
        oC.run(() => {
          let sK = new oD(sG, sI.name);
          sK.label("Dono: " + sI.getOwner()?.name),
            sK.spacer(),
            sK.label("Poder: " + aO.shortenNumber(sI.getGroupPower())),
            sK.spacer(),
            sK.label("Membros:");
          for (let sL of sI.members) sK.spacer(), sK.label("- " + sL.name);
          sK.show();
        });
    }
    return { status: oA.Success };
  },
};
import {
  CommandPermissionLevel as oF,
  CustomCommandParamType as oG,
  CustomCommandStatus as oH,
  Player as oI,
  world as oJ,
} from "@minecraft/server";
var oK = {
  customCommand: {
    name: "dbe:group.invite",
    description: "Convide jogadores para o seu grupo.",
    permissionLevel: oF.Any,
    mandatoryParameters: [{ name: "playerName", type: oG.String }],
  },
  callback: ({ sourceEntity: sG }, sH) => {
    if (sG instanceof oI) {
      let sI = eJ.getPlayerGroup(sG.id);
      if (!sI || !sI.isOwner(sG.id)) {
        sG.sendMessage({ translate: "player_group.no_permission" });
        return;
      }
      let sK = oJ.getAllPlayers().find(({ name: sL }) => sL === sH);
      if (sK) eJ.invitePlayerToGroup(sK, sI.id);
      else {
        sG.sendMessage({ translate: "player_group.invite.player_not_found" });
        return;
      }
      return { status: oH.Success };
    }
  },
};
import {
  CommandPermissionLevel as oL,
  CustomCommandParamType as oM,
  CustomCommandStatus as oN,
  Player as oO,
} from "@minecraft/server";
var oP = {
  customCommand: {
    name: "dbe:group.kickplayer",
    description: "Remova jogadores do seu grupo.",
    permissionLevel: oL.Any,
    mandatoryParameters: [{ name: "playerName", type: oM.String }],
  },
  callback: ({ sourceEntity: sG }, sH) => {
    if (sG instanceof oO) {
      let sI = eJ.getPlayerGroup(sG.id);
      if (!sI || !sI.isOwner(sG.id)) {
        sG.sendMessage({ translate: "player_group.no_permission" });
        return;
      }
      let sK = sI.getMemberByName(sH);
      if (sK) {
        if (sK.id === sG.id) {
          sG.sendMessage({ translate: "player_group.remove.owner_cannot_remove_self" });
          return;
        }
        return sI.removePlayerFromGroup(sK.id), { status: oN.Success };
      } else sG.sendMessage({ translate: "player_group.remove.player_not_in_group" });
    }
  },
};
import { CommandPermissionLevel as oQ, CustomCommandStatus as oR, Player as oS } from "@minecraft/server";
var oT = {
  customCommand: { name: "dbe:group.leave", description: "Saia de um grupo de jogadores.", permissionLevel: oQ.Any },
  callback: ({ sourceEntity: sG }) => {
    if (sG instanceof oS) {
      let sH = eJ.getPlayerGroup(sG.id);
      if (sH) return sH.removePlayerFromGroup(sG.id), { status: oR.Success };
      sG.sendMessage({ translate: "player_group.not_in_group" });
    }
  },
};
import { CommandPermissionLevel as oU, CustomCommandStatus as oV, Player as oW, system as oX } from "@minecraft/server";
var oY = {
  customCommand: {
    name: "dbe:group.setbase",
    description: "Define uma base para o seu grupo.",
    permissionLevel: oU.Any,
  },
  callback: ({ sourceEntity: sG }) => (
    oX.run(() => {
      if (sG instanceof oW) {
        let { dimension: sH, location: sI } = sG,
          sK = eJ.getPlayerGroup(sG.id);
        if (!sK) {
          sG.sendMessage({ translate: "player_group.not_in_group" });
          return;
        }
        if (!sK.isOwner(sG.id)) {
          sG.sendMessage({ translate: "player_group.no_permission" });
          return;
        }
        if (
          !eO(sH)
            .getChunkRegions(sI)
            .some((sL) => sL.isOwner(sK.id))
        ) {
          sG.sendMessage({ translate: "player_group.base.not_in_claim" });
          return;
        }
        sK.setSpawnPoint(sH, sI), sG.sendMessage({ translate: "player_group.base.set.success" });
      }
    }),
    { status: oV.Success }
  ),
};
import { CommandPermissionLevel as oZ, CustomCommandStatus as p0, Player as p1 } from "@minecraft/server";
var p2 = {
  customCommand: {
    name: "dbe:group.unclaim",
    description: "Remove a reivindicação do território atual.",
    permissionLevel: oZ.Any,
  },
  callback: ({ sourceEntity: sG }) => {
    if (sG instanceof p1) {
      let sH = eJ.getPlayerGroup(sG.id);
      if (!sH) {
        sG.sendMessage({ translate: "player_group.not_in_group" });
        return;
      }
      if (!sH.isOwner(sG.id)) {
        sG.sendMessage({ translate: "player_group.no_permission" });
        return;
      }
      let { dimension: sI, location: sK } = sG;
      return sH.unClaimLocation(sI, sK), { status: p0.Success };
    }
  },
};
import {
  CommandPermissionLevel as p3,
  CustomCommandParamType as p4,
  CustomCommandStatus as p5,
  Player as p6,
  system as p7,
} from "@minecraft/server";
var p8 = {
  customCommand: {
    name: "dbe:redeem",
    cheatsRequired: !1,
    description: "Resgata códigos especiais.",
    // o formato do código não tem segredo (qualquer um pode gerá-lo), então só operadores resgatam
    permissionLevel: p3.GameDirectors,
    mandatoryParameters: [{ name: "code", type: p4.String }],
  },
  callback: ({ sourceEntity: sG }, sH) => (
    p7.run(() => {
      sG instanceof p6 && hO(sG).redeem.redeemCode(sH);
    }),
    { status: p5.Success }
  ),
};
import { CommandPermissionLevel as p9, CustomCommandStatus as pb } from "@minecraft/server";
var pf = {
  customCommand: {
    name: "dbe:updatestats",
    cheatsRequired: !1,
    description: "Atualiza os atributos e estatísticas do jogador.",
    permissionLevel: p9.Any,
  },
  callback: ({ sourceEntity: sG }) => (sG && i3.getDBEEntity(sG)?.attributes.updateStats(), { status: pb.Success }),
};
function pj(sG) {
  sG.registerEnum("dbe:actionform", cj.getRegisteredFormIds()),
    sG.registerEnum("dbe:attribute", ["*", ...e8]),
    sG.registerEnum("dbe:color", fT.getAllOptionIds()),
    sG.registerEnum("dbe:customId", gT.getAllOptionIds()),
    sG.registerEnum(
      "dbe:modifier",
      l7.map(({ id: sK }) => sK),
    ),
    sG.registerEnum("dbe:quest", ["*", ...g5.getAllQuestData().map(({ id: sK }) => sK)]),
    sG.registerEnum(
      "dbe:race",
      fR.getAll().map(({ id: sK }) => sK),
    ),
    sG.registerEnum("dbe:region", [...l8.map(({ id: sK }) => sK)]),
    sG.registerEnum("dbe:skill", ["*", ...l9.map(({ id: sK }) => sK)]),
    sG.registerEnum("dbe:transformation", fO.getAllTransformationIds()),
    sG.registerEnum("dbe:value", ["alignment", "attribute_points", "mastery", "skill_points", "zeni", "level"]);
  let sH = [lq, lA, lH, lL, lR, nM, p8, lX, m2, m9, mp, my, mC, mI, mN, mU, n0, n5, nf, nv, nA, pf, nG],
    sI = [nR, nV, nZ, o8, oj, ox, oE, oK, oP, oT, oY, p2];
  for (let { customCommand: sK, callback: sL } of [...sH, ...sI]) sG.registerCommand(sK, sL);
}
lb.beforeEvents.startup.subscribe(({ customCommandRegistry: sG }) => pj(sG));
export { lq, lA, lH, lL, lR, lW, lX, m2, m9, mp, my, mC, mI, mN, mT, mU, n0, n5, nf, nv, nA, nG, nM, nR, nV, nZ, o6, o7, o8, oj, ox, oE, oK, oP, oT, oY, p2, p8, pf, pj };
