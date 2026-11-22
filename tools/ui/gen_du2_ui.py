#!/usr/bin/env python3
"""Gera o JSON UI do redesign 1.7.17: "Dragon Universe_rp/ui/du2/*.json".

Como rodar (na raiz do repositório):
    python3 tools/ui/gen_du2_ui.py "Dragon Universe_rp/ui"

- Sobrescreve du2_common.json, du2_statistics.json e du2_select_race.json.
  Não edite esses JSON à mão: mude este gerador, rode de novo e commite os dois juntos.
- Só usa a biblioteca padrão do Python 3.
- Contrato com o script e as texturas (índices dos botões, slots, flags e nomes de
  textura): redesign/CONTRATO.md.
- Depois de gerar, rode node tools/check-syntax.mjs e node tools/validate.mjs.
"""
import json, os, sys

UI = sys.argv[1]  # caminho de "Dragon Universe_rp/ui"
T = "textures/ui/du2/"
I = T + "icons/"


def hexc(h):
    h = h.lstrip("#")
    return [round(int(h[i:i + 2], 16) / 255, 3) for i in (0, 2, 4)]


C = {k: hexc(v) for k, v in dict(
    panel="#122344", title="#172B4D", dark="#0C1730", line="#1D3F73", cyan="#23D7FF", blue="#1674FF",
    gold="#F6B943", value="#55FFFF", text="#E6ECF7", weak="#8FA0BF", soft="#A8B6D0", desc="#C9D3E6",
    white="#FFFFFF", red="#FF6B7A", green="#7CE38B", orange="#FF9F43", purple="#C38BFF").items()}

ATTRS = ["constitution", "dexterity", "spirit", "strength", "willpower"]
ATTR_COLOR = dict(constitution="red", dexterity="green", spirit="cyan", strength="orange", willpower="purple", size="soft")

COL = "form_buttons"
STATS_TITLE = "ui.dbe.statistics.title"
RACE_TITLE = "ui.dbe.select_race.title"
FLAG_DU2 = "(not ((#form_text - 'du2;') = #form_text))"

# --------------------------------------------------------------------------- helpers

def P(size, controls=None, **kw):
    d = {"type": "panel", "size": size}
    d.update(kw)
    if controls:
        d["controls"] = controls
    return d


def S(orient, size, controls, **kw):
    d = {"type": "stack_panel", "orientation": orient, "size": size}
    d.update(kw)
    d["controls"] = controls
    return d


def H(size, controls, **kw):
    return S("horizontal", size, controls, **kw)


def V(size, controls, **kw):
    return S("vertical", size, controls, **kw)


_n = [0]


def c(name, ctrl):
    """Uma entrada de controls; nomes repetidos ganham sufixo."""
    _n[0] += 1
    return {name: ctrl}


def pad(w, h="100%"):
    return c("pad", P([w, h]))


def img(tex, size, color=None, **kw):
    d = {"type": "image", "texture": tex, "size": size}
    if color:
        d["color"] = C[color]
    d.update(kw)
    return d


def lbl(text, size, color="text", scale=None, font="smooth", align="left", **kw):
    d = {"type": "label", "text": text, "size": size, "color": C[color], "font_type": font,
         "shadow": False, "text_alignment": align}
    if scale:
        d["font_scale_factor"] = scale
    d.update(kw)
    return d


def centered(w, ctrl, h="100%", anchor="center"):
    """Célula de stack com o filho centrado no eixo cruzado."""
    ctrl = dict(ctrl)
    ctrl.setdefault("anchor_from", anchor)
    ctrl.setdefault("anchor_to", anchor)
    return c("cell", P([w, h], [c("x", ctrl)]))


def coll_text():
    return {"binding_type": "collection", "binding_collection_name": COL, "binding_name": "#form_button_text"}


def view(expr, target="#visible", source=None):
    b = {"binding_type": "view", "source_property_name": expr, "target_property_name": target}
    if source:
        b["source_control_name"] = source
    return b


def title_vis(expr):
    return [{"binding_name": "#title_text"}, view(expr)]


def text_shown():
    """Texto do slot sem o marcador '*'."""
    return [coll_text(), view("(#form_button_text - '*')", "#du2_text")]


def slot(idx, size, color="text", scale=None, font="smooth", align="left", lines=1, anchor="left_middle", vis=None):
    """Slot de dado (botão só lido): rótulo com corte, some quando o texto é ''."""
    lh = 10 if lines == 1 else "default"
    label = lbl("#du2_text", ["100%", lh], color, scale, font, align,
                anchor_from=anchor, anchor_to=anchor, collection_index=idx,
                bindings=text_shown())
    hide = [coll_text(), view(vis or "(not (#form_button_text = ''))")]
    inner = P(["100%", "100%" if lines == 1 else "100%c"], [c("t", label)], collection_index=idx, bindings=hide)
    return P(size, [c("s", inner)], collection_name=COL, clips_children=True)


def coll_tex():
    return [
        {"binding_type": "collection", "binding_collection_name": COL, "binding_name": "#form_button_texture",
         "binding_name_override": "#texture"},
        {"binding_type": "collection", "binding_collection_name": COL,
         "binding_name": "#form_button_texture_file_system", "binding_name_override": "#texture_file_system"},
    ]


def btn_icon(size, color, vis=None, **kw):
    """Ícone que vem do botão (caminho mandado pelo script)."""
    b = coll_tex()
    if vis:
        b = b + [coll_text(), view(vis)]
    return img("", size, color, bindings=b, **kw)


ACTIVE = "(not ((#form_button_text - '*') = #form_button_text))"
INACTIVE = "((#form_button_text - '*') = #form_button_text)"


def form_button(idx, size, faces, hide_empty=True, sound=True, vis=None, **kw):
    """Botão de formulário. faces: {'default': [...], 'hover': [...], 'pressed': [...]}
    idx None = item de factory (o índice vem da factory). vis = expressão de visibilidade própria."""
    binds = [{"binding_type": "collection_details", "binding_collection_name": COL}]
    if vis:
        binds += [coll_text(), view(vis)]
    elif hide_empty:
        binds += [coll_text(), view("(not (#form_button_text = ''))")]
    d = {"size": size, "collection_index": idx, "$pressed_button_name": "button.form_button_click",
         "default_control": "default", "hover_control": "hover", "pressed_control": "pressed",
         "controls": [c(k, P(["100%", "100%"], faces[k])) for k in ("default", "hover", "pressed")],
         "bindings": binds}
    if idx is None:
        del d["collection_index"]
    if not sound:
        d["sound_volume"] = 0
    d.update(kw)
    return d


def bg(tex, size=None, **kw):
    return c("bg", img(tex, size or ["100%", "100%"], **kw))


def btn_label(color="text", scale=None, size=None, align="center", bindings=None, **kw):
    return lbl("#du2_text", size or ["100%", 10], color, scale, "smooth", align, bindings=bindings or text_shown(), **kw)


def host(ctrl_name, ctrl, size):
    """Envolve um controle indexado num painel com a coleção."""
    return P(size, [c(ctrl_name, ctrl)], collection_name=COL)


# --------------------------------------------------------------------------- comum

common = {"namespace": "du2"}

common["root"] = {
    "type": "panel", "size": ["100%", "100%"],
    "$du2_pc|default": True, "$du2_mobile|default": False,
    "variables": [{"requires": "$pocket_edition", "$du2_pc": False, "$du2_mobile": True}],
}

common["close_button@common.button"] = {
    "size": [18, 18], "$pressed_button_name": "button.menu_exit",
    "default_control": "default", "hover_control": "hover", "pressed_control": "pressed",
    "controls": [c(k, P(["100%", "100%"], [bg(T + "btn_close" + s), c("i", img(I + "close", [8, 8], "soft"))]))
                 for k, s in (("default", ""), ("hover", "_hover"), ("pressed", "_pressed"))],
}

common["logo"] = img(T + "du_logo", ["100%y", "100% - 4px"], anchor_from="center", anchor_to="center")

common["title_label"] = lbl("#title_text", ["100%", 10], "white", None, "MinecraftTen", "left",
                            anchor_from="left_middle", anchor_to="left_middle",
                            bindings=[{"binding_name": "#title_text"}])


def title_bar(h, right_controls, close_w, left_controls=None):
    return P(["100%", h], [
        bg(T + "title_bar"),
        c("row", H(["100%", "100%"], [
            *(left_controls or []),
            pad(3),
            c("logo", P([h, "100%"], [c("logo@du2.logo", {})])),
            pad(4),
            c("title", P(["fill", "100%"], [c("t@du2.title_label", {})], clips_children=True)),
            *right_controls,
            pad(4),
            c("close", P([close_w, "100%"], [c("b@du2.close_button", {"size": [close_w, h - 6 if h >= 24 else h],
                                                                      "anchor_from": "center", "anchor_to": "center"})])),
            pad(3),
        ])),
    ])


# Abas: (índice, ícone, rótulo, título da tela)
TABS = [(1, "tab_statistics", "ui.dbe.statistics.title", STATS_TITLE),
        (2, "tab_skills", "ui.dbe.skills.title", "ui.dbe.skills.title"),
        (7, "tab_transformations", "ui.dbe.transformations.title", "ui.dbe.transformations.title"),
        (3, "tab_quests", "ui.dbe.quest_list.title", "ui.dbe.quest_list.title"),
        (4, "tab_training", "ui.dbe.training.title", "ui.dbe.training.title"),
        (6, "tab_achievements", "ui.dbe.achievement_list.title", "ui.dbe.achievement_list.title"),
        (5, "tab_news", "ui.dbe.news.title", "ui.dbe.news.title")]
HELP_TAB = (0, "tab_help", "ui.dbe.help.title", "ui.dbe.help.title")


def tab_pc(t, help_tab=False):
    idx, icon, label, title = t
    on = f"(#title_text = '{title}')"
    off = f"(not (#title_text = '{title}'))"
    icol = "gold" if help_tab else "cyan"

    def face(state_tex):
        return [
            c("bg_off", img(T + state_tex, ["100%", "100%"], bindings=title_vis(off))),
            c("bg_on", img(T + "tab_active", ["100%", "100%"], bindings=title_vis(on))),
            c("row", H(["100%", "100%"], [
                pad(4),
                centered(14, P([14, 14], [
                    c("box_off", img(T + "icon_box", ["100%", "100%"], bindings=title_vis(off))),
                    c("box_on", img(T + "icon_box_gold", ["100%", "100%"], bindings=title_vis(on))),
                    c("i_off", img(I + icon, [10, 10], icol, bindings=title_vis(off))),
                    c("i_on", img(I + icon, [10, 10], "dark", bindings=title_vis(on))),
                ])),
                pad(5),
                c("name", P(["fill", "100%"], [
                    c("off", lbl(label, ["100%", 10], "soft", None, "smooth", "left", anchor_from="left_middle",
                                 anchor_to="left_middle", bindings=title_vis(off))),
                    c("on", lbl(label, ["100%", 10], "white", None, "smooth", "left", anchor_from="left_middle",
                                anchor_to="left_middle", bindings=title_vis(on))),
                ], clips_children=True)),
                pad(3),
            ])),
        ]
    return form_button(idx, ["100%", 20], {"default": face("tab"), "hover": face("tab_hover"),
                                            "pressed": face("tab_pressed")}, hide_empty=False)


def tab_mobile(t, help_tab=False):
    idx, icon, label, title = t
    on = f"(#title_text = '{title}')"
    off = f"(not (#title_text = '{title}'))"
    icol = "gold" if help_tab else "cyan"

    def face(state_tex):
        return [
            c("bg_off", img(T + state_tex, ["100%", "100%"], bindings=title_vis(off))),
            c("bg_on", img(T + "tab_icon_active", ["100%", "100%"], bindings=title_vis(on))),
            c("i_off", img(I + icon, [13, 13], icol, bindings=title_vis(off))),
            c("i_on", img(I + icon, [13, 13], "dark", bindings=title_vis(on))),
        ]
    return form_button(idx, ["100%", 20], {"default": face("tab_icon"), "hover": face("tab_icon_hover"),
                                            "pressed": face("tab_icon_pressed")}, hide_empty=False)


def nav(width, mobile):
    mk = tab_mobile if mobile else tab_pc
    gap = 1 if mobile else 2
    items = []
    for i, t in enumerate(TABS):
        if i:
            items.append(c("gap", P(["100%", gap])))
        items.append(c(f"tab_{t[0]}@common.button", mk(t)))
    items.append(c("fill", P(["100%", "fill"])))
    items.append(c("tab_0@common.button", mk(HELP_TAB, True)))
    inset = 3 if mobile else 4
    return P([width, "100%"], [
        bg(T + "panel_nav"),
        c("tabs", V([f"100% - {inset * 2}px", f"100% - {inset * 2}px"], items, collection_name=COL,
                    anchor_from="center", anchor_to="center")),
    ])


common["nav_pc"] = nav(100, False)
common["nav_mobile"] = nav(28, True)

# Toggle de detalhes (só JSON UI)
def details_toggle(label_key):
    def face(tex, icon, icol):
        return [bg(T + tex), c("row", H(["100%c", "100%"], [
            centered(10, img(I + icon, [9, 9], icol)), pad(4),
            centered(70, lbl(label_key, ["100%", 10], "text", None, "smooth", "left")),
        ], anchor_from="center", anchor_to="center"))]
    return {
        "type": "toggle",
        "toggle_name": "du2_details",
        "toggle_default_state": False,
        "radio_toggle_group": False,
        "toggle_on_button": "button.menu_select",
        "toggle_off_button": "button.menu_select",
        "unchecked_control": "unchecked", "checked_control": "checked",
        "unchecked_hover_control": "unchecked_hover", "checked_hover_control": "checked_hover",
        "button_mappings": [
            {"from_button_id": "button.menu_select", "to_button_id": "button.menu_select", "mapping_type": "pressed"},
            {"from_button_id": "button.menu_ok", "to_button_id": "button.menu_ok", "mapping_type": "focused"},
        ],
        "sound_name": "random.click", "sound_volume": 1.0,
        "controls": [
            c("unchecked", P(["100%", "100%"], face("btn_secondary", "info", "cyan"))),
            c("unchecked_hover", P(["100%", "100%"], face("btn_secondary_hover", "info", "cyan"))),
            c("checked", P(["100%", "100%"], face("btn_secondary_pressed", "close", "gold"))),
            c("checked_hover", P(["100%", "100%"], face("btn_secondary_pressed", "close", "gold"))),
        ],
    }


common["details_toggle"] = details_toggle("ui.dbe.du2.details")
common["more_details_toggle"] = details_toggle("ui.dbe.du2.more_details")


def caption(key, w="100%", h=8, scale=0.8, color="weak"):
    return lbl(key, [w, h], color, scale, "smooth", "left")


def frame(size, max_size, title_h, right, close_w, body, left=None):
    return P(size, [
        bg(T + "panel_main"),
        c("col", V(["100%", "100%"], [
            c("title", title_bar(title_h, right, close_w, left)),
            c("body", P(["100%", "fill"], body)),
        ])),
    ], max_size=max_size, anchor_from="center", anchor_to="center", layer=1)


def scroll(content, bar=4):
    return {"anchor_to": "top_left", "anchor_from": "top_left", "size": ["100%", "100%"],
            "$show_background": False, "$scrolling_content": content,
            "$scroll_size": [bar, "100% - 2px"], "$scrolling_pane_size": ["100% - 6px", "100%"],
            "$scrolling_pane_offset": [0, 0], "$scroll_bar_right_padding_size": [0, 0]}


# --------------------------------------------------------------------------- Estatísticas

st = {"namespace": "du2_statistics"}

st["statistics_form@du2.root"] = {
    "controls": [
        c("pc@du2_statistics.pc", {"ignored": "$du2_mobile"}),
        c("mobile@du2_statistics.mobile", {"ignored": "$du2_pc"}),
    ]
}


def bp_pill(w):
    return c("bp", P([w, "100%"], [c("pill", P([w, 16], [
        bg(T + "pill_dark"),
        c("row", H(["100% - 8px", "100%"], [
            centered(10, img(I + "stat_bp", [9, 9], "gold")), pad(3),
            centered(14, lbl("BP", ["100%", 10], "soft", None, "smooth")),
            c("v", slot(28, ["fill", "100%"], "gold", None, "smooth", "right")),
        ], anchor_from="center", anchor_to="center")),
    ], anchor_from="center", anchor_to="center"))]))


def chip(icon, icol, cap_key, idx, val_color="value"):
    return P(["fill", "100%"], [
        bg(T + "panel_dark"),
        c("row", H(["100%", "100%"], [
            pad(3),
            centered(16, P([16, 16], [bg(T + "icon_box"), c("i", img(I + icon, [10, 10], icol))])),
            pad(4),
            c("txt", V(["fill", 20], [
                c("cap", caption(cap_key)),
                c("val", slot(idx, ["100%", 11], val_color)),
            ], anchor_from="left_middle", anchor_to="left_middle")),
            pad(3),
        ])),
    ])


def xp_segments(h):
    segs = []
    for k in range(1, 11):
        expr = "(" + " or ".join(f"(#form_button_text = '{j}')" for j in range(k, 11)) + ")"
        on = img(T + "xp_on", ["100%", "100%"], collection_index=26, bindings=[coll_text(), view(expr)])
        segs.append(c(f"seg{k}", P(["10%", "100%"], [
            c("off", img(T + "xp_off", ["100% - 2px", h])),
            c("on_host", P(["100% - 2px", h], [c("on", on)], collection_name=COL)),
        ])))
    return H(["fill", "100%"], segs)


def level_bar(mobile):
    xp_w = 56 if mobile else 64
    items = [pad(5)]
    cap_key = "ui.dbe.du2.level_short" if mobile else "ui.dbe.du2.level"
    items += [
        centered(18 if mobile else 30, lbl(cap_key, ["100%", 10], "weak", 0.8, "smooth")),
        c("lv", slot(24, [22, "100%"], "white", None, "MinecraftTen")),
        pad(4),
        c("segs", xp_segments(5)),
        pad(4),
        c("xp", slot(25, [xp_w, "100%"], "soft", 0.8, "smooth", "right")),
        pad(5),
    ]
    return P(["fill" if mobile else "100%", "100%" if mobile else 16], [bg(T + "panel_dark"),
                                                                         c("row", H(["100%", "100%"], items))])


def seg_button(idx, w, h):
    def face(tex_off):
        return [
            c("on", img(T + "seg_active", ["100%", "100%"], bindings=[coll_text(), view(ACTIVE)])),
            c("off", img(T + tex_off, ["100%", "100%"], bindings=[coll_text(), view(INACTIVE)])),
            c("t_on", btn_label("dark", 0.9 if h < 16 else None, bindings=text_shown() + [view(ACTIVE)])),
            c("t_off", btn_label("soft", 0.9 if h < 16 else None, bindings=text_shown() + [view(INACTIVE)])),
        ]
    return form_button(idx, [w, h], {"default": face("seg"), "hover": face("seg_hover"), "pressed": face("seg_pressed")})


def fix_label_bindings(d):
    """btn_label recebe bindings extras: junta coleção + view do texto + visibilidade."""
    return d


def segmented(w, h):
    return P([3 * w + 6, h + 4], [
        bg(T + "panel_dark"),
        c("row", H(["100% - 4px", h], [
            c("x1@common.button", seg_button(11, w, h)), pad(1),
            c("x10@common.button", seg_button(12, w, h)), pad(1),
            c("x100@common.button", seg_button(13, w, h)),
        ], collection_name=COL, anchor_from="center", anchor_to="center")),
    ])


def attr_row(k, h, mobile):
    idx = 14 + k
    attr = ATTRS[k]
    plus_w, plus_h = (26, h - 3) if mobile else (20, h - 4)

    def face(row_tex, plus_tex):
        return [
            bg(T + row_tex),
            c("row", H(["100%", "100%"], [
                pad(4),
                centered(12, img(I + "attr_" + attr, [12, 12], ATTR_COLOR[attr])),
                pad(5),
                c("name", P(["fill", "100%"], [c("t", btn_label("text", None, align="left",
                                                                anchor_from="left_middle", anchor_to="left_middle"))],
                            clips_children=True)),
                # espaço dos slots (desenhados por cima, fora do botão)
                pad(30 + 30 + (0 if mobile else 36)),
                pad(3),
                centered(plus_w, P([plus_w, plus_h], [bg(T + plus_tex), c("i", img(I + "plus", [8, 8], "gold"))])),
                pad(2),
            ])),
        ]
    button = form_button(idx, ["100%", "100%"], {"default": face("panel_row", "btn_plus"),
                                                  "hover": face("panel_row", "btn_plus_hover"),
                                                  "pressed": face("panel_row", "btn_plus_pressed")})
    overlay = [c("fill", P(["fill", "100%"])),
               c("val", slot(32 + k, [30, "100%"], "value", None, "smooth", "right")),
               c("mult", slot(37 + k, [30, "100%"], "gold", 0.8, "smooth", "right"))]
    if not mobile:
        overlay.append(c("cost", slot(42 + k, [36, "100%"], "weak", 0.8, "smooth", "right")))
    overlay += [pad(3 + plus_w + 2)]
    return P(["100%", h], [
        c("button_host", host("b@common.button", button, ["100%", "100%"])),
        c("slots", H(["100%", "100%"], overlay, layer=5)),
    ])


def attr_rows(h, gap, mobile):
    items = []
    for k in range(5):
        if k:
            items.append(c("gap", P(["100%", gap])))
        items.append(c(f"attr_{ATTRS[k]}", attr_row(k, h, mobile)))
    return V(["100%", "100%c"], items)


def preview(caption_key=None):
    ctrls = [bg(T + "panel_preview"),
             c("player@statistics_form.player_preview", {"size": [70, 70], "offset": [0, 4],
                                                          "$preview_visible": "((#form_text - 'ozr;') = #form_text)"}),
             c("oozaru@statistics_form.player_preview", {"size": [22, 22], "offset": [0, 4],
                                                          "$preview_visible": "(not ((#form_text - 'ozr;') = #form_text))"})]
    if caption_key:
        ctrls.append(c("cap", lbl(caption_key, ["100% - 8px", 8], "weak", 0.7, "smooth", "left",
                                  anchor_from="top_left", anchor_to="top_left", offset=[4, 3])))
    return P(["100%", "fill"], ctrls, clips_children=True)


def derived_row(icon, icol, key, idx, h=12):
    return H(["100%", h], [
        pad(3),
        centered(10, img(I + icon, [9, 9], icol)), pad(3),
        centered("fill", lbl(key, ["100%", 10], "weak", 0.8, "smooth")),
        c("v", slot(idx, [40, "100%"], "white", None, "smooth", "right")),
        pad(3),
    ])


def info_button(h):
    def face(tex):
        return [bg(T + tex), c("row", H(["100%c", "100%"], [
            centered(10, img(I + "info", [9, 9], "dark")), pad(3),
            c("t", P([70, "100%"], [c("l", btn_label("dark", None, align="left",
                                                     anchor_from="left_middle", anchor_to="left_middle"))],
                     clips_children=True)),
        ], anchor_from="center", anchor_to="center"))]
    return host("b@common.button", form_button(10, ["100%", h], {"default": face("btn_primary"),
                                                                   "hover": face("btn_primary_hover"),
                                                                   "pressed": face("btn_primary_pressed")}),
                ["100%", h])


# ---- PC
pc_left = V(["fill", "100%"], [
    c("chips1", H(["100%", 24], [c("race", chip("chip_race", "cyan", "ui.dbe.du2.race", 20)), pad(4),
                                  c("form", chip("chip_form", "gold", "ui.dbe.du2.form", 21))])),
    pad("100%", 3),
    c("chips2", H(["100%", 24], [c("align", chip("chip_alignment", "soft", "ui.dbe.du2.alignment", 22, "text")), pad(4),
                                  c("mentor", chip("chip_mentor", "soft", "ui.dbe.du2.mentor", 23, "text"))])),
    pad("100%", 4),
    c("level", level_bar(False)),
    pad("100%", 4),
    c("attr_header", H(["100%", 16], [
        centered("fill", lbl("ui.dbe.du2.attributes", ["100%", 10], "white", None, "MinecraftTen")),
        c("points", P([78, "100%"], [c("pill", P(["100%", 12], [
            bg(T + "pill_gold"), c("t", slot(27, ["100% - 8px", "100%"], "dark", 0.8, "smooth", "center",
                                             anchor="center"))], anchor_from="center", anchor_to="center"))])),
        pad(4),
        centered(84, segmented(26, 12)),
    ])),
    pad("100%", 3),
    c("attrs", attr_rows(20, 2, False)),
])

pc_right = V([98, "100%"], [
    c("preview", preview("ui.dbe.du2.your_character")),
    pad("100%", 3),
    c("derived", P(["100%", 40], [bg(T + "panel_dark"), c("rows", V(["100%", 36], [
        c("dmg", derived_row("stat_damage", "orange", "ui.dbe.du2.damage", 29)),
        c("def", derived_row("stat_defense", "green", "ui.dbe.du2.defense", 30)),
        c("en", derived_row("stat_energy", "cyan", "ui.dbe.du2.energy", 31)),
    ], anchor_from="center", anchor_to="center"))])),
    pad("100%", 3),
    c("info", info_button(20)),
])

st["pc"] = frame([450, 252], ["100% - 8px", "100% - 8px"], 24, [bp_pill(66)], 18, [
    c("row", H(["100%", "100%"], [
        c("nav@du2.nav_pc", {}),
        c("content", P(["fill", "100%"], [c("inner", H(["100% - 12px", "100% - 10px"], [
            c("left", pc_left), pad(6), c("right", pc_right),
        ], anchor_from="center", anchor_to="center"))])),
    ])),
])

# ---- Celular
DET = "du2_stats_details"
show_details = view("#toggle_state", source=DET)
hide_details = view("(not #toggle_state)", source=DET)


def mini_chip(icon, icol, idx, w):
    return P([w, "100%"], [bg(T + "panel_dark"), c("row", H(["100%", "100%"], [
        pad(4), centered(12, img(I + icon, [11, 11], icol)), pad(4),
        c("v", slot(idx, ["fill", "100%"], "value")), pad(3)]))])


def detail_line(icon, icol, key, idx, val_color="text"):
    return P(["100%", 18], [bg(T + "panel_dark"), c("row", H(["100%", "100%"], [
        pad(4), centered(12, img(I + icon, [11, 11], icol)), pad(4),
        centered(70, lbl(key, ["100%", 10], "weak", None, "smooth")),
        c("v", slot(idx, ["fill", "100%"], val_color, None, "smooth", "right")), pad(4)]))])


m_details = V(["100%", "100%"], [
    c("align", detail_line("chip_alignment", "soft", "ui.dbe.du2.alignment", 22)), pad("100%", 2),
    c("mentor", detail_line("chip_mentor", "soft", "ui.dbe.du2.mentor", 23)), pad("100%", 2),
    c("dmg", detail_line("stat_damage", "orange", "ui.dbe.du2.damage", 29, "white")), pad("100%", 2),
    c("def", detail_line("stat_defense", "green", "ui.dbe.du2.defense", 30, "white")), pad("100%", 2),
    c("en", detail_line("stat_energy", "cyan", "ui.dbe.du2.energy", 31, "white")), pad("100%", 2),
    c("train", detail_line("tab_training", "cyan", "ui.dbe.du2.training_mult", 47, "gold")),
    c("fill", P(["100%", "fill"])),
    c("info", info_button(22)),
])

m_left = P(["fill", "100%"], [
    c("normal", V(["100%", "100%"], [
        c("header", H(["100%", 22], [
            c("points", P([86, "100%"], [c("pill", P(["100%", 14], [
                bg(T + "pill_gold"), c("t", slot(27, ["100% - 8px", "100%"], "dark", None, "smooth", "center",
                                                 anchor="center"))], anchor_from="center", anchor_to="center"))])),
            c("fill", P(["fill", "100%"])),
            centered(90, segmented(28, 20)),
        ])),
        pad("100%", 2),
        c("attrs", attr_rows(21, 1, True)),
    ], bindings=[hide_details])),
    c("details", P(["100%", "100%"], [bg(T + "panel_overlay"),
                                       c("in", P(["100% - 8px", "100% - 8px"], [c("d", m_details)]))],
                   layer=10, bindings=[show_details])),
])

m_right = V([100, "100%"], [
    c("preview", preview()),
    pad("100%", 3),
    c(DET + "@du2.details_toggle", {"size": ["100%", 22]}),
])

st["mobile"] = frame(["100% - 6px", "100% - 6px"], [480, 270], 20,
                     [bp_pill(62)], 22, [
    c("row", H(["100%", "100%"], [
        c("nav@du2.nav_mobile", {}),
        c("content", P(["fill", "100%"], [c("inner", V(["100% - 6px", "100% - 6px"], [
            c("top", H(["100%", 20], [
                c("race", mini_chip("chip_race", "cyan", 20, 84)), pad(3),
                c("form", mini_chip("chip_form", "gold", 21, 84)), pad(3),
                c("level", level_bar(True)),
            ])),
            pad("100%", 3),
            c("main", H(["100%", "fill"], [c("left", m_left), pad(4), c("right", m_right)])),
        ], anchor_from="center", anchor_to="center"))])),
    ])),
])

# --------------------------------------------------------------------------- Seleção de raça

rc = {"namespace": "du2_select_race"}

rc["select_race_form@du2.root"] = {
    "controls": [
        c("pc@du2_select_race.pc", {"ignored": "$du2_mobile"}),
        c("mobile@du2_select_race.mobile", {"ignored": "$du2_pc"}),
    ]
}


def step(num, key, active, w):
    tex = "pill_gold" if active else "pill_dark"
    dot = "step_dot" if active else "step_dot_off"
    return c("step", P([w, "100%"], [c("pill", P([w, 16], [
        bg(T + tex),
        c("row", H(["100%", "100%"], [
            pad(2),
            centered(12, P([12, 12], [bg(T + dot), c("n", lbl(num, [12, 10], "gold" if active else "weak", 0.8,
                                                              "smooth", "center", anchor_from="center",
                                                              anchor_to="center"))])),
            pad(3),
            c("t", P(["fill", "100%"], [c("l", lbl(key, ["100%", 10], "dark" if active else "weak", 0.9, "smooth",
                                                   "left", anchor_from="left_middle", anchor_to="left_middle"))],
                     clips_children=True)),
            pad(3),
        ])),
    ], anchor_from="center", anchor_to="center"))]))


def connector():
    return centered(8, img(T + "divider", [8, 2]))


def race_card_pc(k):
    def face(tex):
        return [
            c("bg_off", img(T + tex, ["100%", "100%"], bindings=[coll_text(), view(INACTIVE)])),
            c("bg_on", img(T + "race_card_active", ["100%", "100%"], bindings=[coll_text(), view(ACTIVE)])),
            c("col", V(["100%", "100%"], [
                pad("100%", 3),
                centered("100%", P([16, 16], [
                    c("b_off", img(T + "icon_box_dark", ["100%", "100%"], bindings=[coll_text(), view(INACTIVE)])),
                    c("b_on", img(T + "icon_box_gold", ["100%", "100%"], bindings=[coll_text(), view(ACTIVE)])),
                    c("i_off", btn_icon([12, 12], "cyan", INACTIVE)),
                    c("i_on", btn_icon([12, 12], "dark", ACTIVE)),
                ]), h=16),
                pad("100%", 2),
                c("name", P(["100% - 4px", 9], [c("l", btn_label("soft", 0.75))], clips_children=True,
                            anchor_from="top_middle", anchor_to="top_middle")),
            ])),
        ]
    return form_button(4 + k, [56, 34], {"default": face("race_card"), "hover": face("race_card_hover"),
                                          "pressed": face("race_card_pressed")})


def race_icon_mobile(k):
    def face(tex):
        return [
            c("bg_off", img(T + tex, ["100%", "100%"], bindings=[coll_text(), view(INACTIVE)])),
            c("bg_on", img(T + "race_icon_active", ["100%", "100%"], bindings=[coll_text(), view(ACTIVE)])),
            c("i_off", btn_icon([15, 15], "cyan", INACTIVE)),
            c("i_on", btn_icon([15, 15], "dark", ACTIVE)),
        ]
    return form_button(4 + k, [24, 24], {"default": face("race_card"), "hover": face("race_card_hover"),
                                          "pressed": face("race_card_pressed")})


def race_strip(mobile):
    items = []
    for k in range(8):
        if k:
            items.append(pad(2 if mobile else 3))
        items.append(c(f"race_{k}@common.button", race_icon_mobile(k) if mobile else race_card_pc(k)))
    return H(["100%c", 24 if mobile else 34], items, collection_name=COL,
             anchor_from="left_middle" if mobile else "center", anchor_to="left_middle" if mobile else "center")


def arrow(idx, icon, w, h):
    def face(tex):
        return [bg(T + tex), c("i", img(I + icon, [10, 10], "gold"))]
    return form_button(idx, [w, h], {"default": face("btn_secondary"), "hover": face("btn_secondary_hover"),
                                      "pressed": face("btn_secondary_pressed")}, sound=True)


def race_preview(w, size, counter_top):
    ctrls = [
        bg(T + "panel_preview"),
        c("player", {"type": "custom", "renderer": "live_player_renderer", "size": [size, size], "layer": 2,
                     "anchor_from": "center", "anchor_to": "center", "offset": [0, 2],
                     "property_bag": {"#look_at_cursor": True}}),
        c("prev", host("b@common.button", arrow(0, "chevron_left", 20, 30), [20, 30]) | {
            "anchor_from": "left_middle", "anchor_to": "left_middle", "offset": [4, 0], "layer": 5}),
        c("next", host("b@common.button", arrow(3, "chevron_right", 20, 30), [20, 30]) | {
            "anchor_from": "right_middle", "anchor_to": "right_middle", "offset": [-4, 0], "layer": 5}),
    ]
    if counter_top:
        ctrls.append(c("cap", lbl("ui.dbe.du2.live_preview", ["60%", 8], "weak", 0.7, "smooth", "left",
                                  anchor_from="top_left", anchor_to="top_left", offset=[5, 4])))
        ctrls.append(c("counter", P([34, 12], [bg(T + "pill_dark"),
                                               c("t", slot(18, ["100% - 4px", "100%"], "weak", 0.8, "smooth", "center",
                                                           anchor="center"))],
                                    anchor_from="top_right", anchor_to="top_right", offset=[-4, 3], layer=3)))
    else:
        ctrls.append(c("counter", P([40, 10], [c("t", slot(18, ["100%", "100%"], "weak", None, "smooth", "center",
                                                           anchor="center"))],
                                    anchor_from="bottom_middle", anchor_to="bottom_middle", offset=[0, -3], layer=3)))
    return P([w, "100%"], ctrls, clips_children=True)


def bonus_chip(k, h, scale):
    icons = []
    for a in ATTRS + ["size"]:
        key = "ui.dbe.size" if a == "size" else f"attribute.{a}"
        icons.append(c(f"i_{a}", img(I + "attr_" + a, [9, 9], ATTR_COLOR[a], collection_index=20 + k,
                                     bindings=[coll_text(), view(f"(#form_button_text = '{key}')")])))
    return P(["33.33%", h], [c("chip", P(["100% - 3px", "100%"], [
        bg(T + "pill_blue"),
        c("row", H(["100%", "100%"], [
            pad(5),
            c("icon", P([10, "100%"], [c("ih", P([9, 9], icons, collection_name=COL))])),
            pad(3),
            c("name", slot(20 + k, ["fill", "100%"], "text", scale)),
            c("val", slot(26 + k, [26, "100%"], "gold", scale, "smooth", "right")),
            pad(5),
        ])),
    ], anchor_from="left_middle", anchor_to="left_middle"))],
        bindings=None)


def bonus_grid(h, scale):
    rows = []
    for r in range(2):
        rows.append(c(f"row{r}", H(["100%", h], [c(f"b{r * 3 + j}", bonus_chip(r * 3 + j, h, scale)) for j in range(3)])))
        if r == 0:
            rows.append(pad("100%", 2))
    return V(["100%", "100%c"], rows)


def fact_card(icon, icol, key, idx, h, scale):
    return P(["33.33%", h], [c("card", P(["100% - 3px", "100%"], [
        bg(T + "panel_dark"),
        c("row", H(["100%", "100%"], [
            pad(4), centered(12, img(I + icon, [11, 11], icol)), pad(4),
            c("cap", P(["fill", "100%"], [c("l", lbl(key, ["100%", 10], "weak", scale, "smooth", "left",
                                                     anchor_from="left_middle", anchor_to="left_middle"))],
                       clips_children=True)),
            c("v", slot(idx, [28, "100%"], "value", None, "smooth", "right")),
            pad(4),
        ])),
    ], anchor_from="left_middle", anchor_to="left_middle"))])


def facts(h, short):
    s = "_short" if short else ""
    sc = None if short else 0.8
    return H(["100%", h], [
        c("regen", fact_card("fact_regen", "green", "ui.dbe.du2.regen" + s, 13, h, sc)),
        c("forms", fact_card("fact_forms", "gold", "ui.dbe.du2.forms" + s, 14, h, sc)),
        c("gender", fact_card("fact_gender", "cyan", "ui.dbe.du2.gender" + s, 15, h, sc)),
    ])


def random_button(w, h, with_label):
    def face(tex):
        row = [centered(12, img(I + "random", [10, 10], "cyan"))]
        if with_label:
            row += [pad(4), c("t", P([50, "100%"], [c("l", btn_label("text", None, align="left",
                                                                    anchor_from="left_middle",
                                                                    anchor_to="left_middle"))], clips_children=True))]
        return [bg(T + tex), c("row", H(["100%c", "100%"], row, anchor_from="center", anchor_to="center"))]
    return form_button(2, [w, h], {"default": face("btn_secondary"), "hover": face("btn_secondary_hover"),
                                    "pressed": face("btn_secondary_pressed")})


def select_button(w, h):
    def face(tex):
        return [bg(T + tex), c("row", H(["100%", "100%"], [
            pad(6),
            c("t", P(["fill", "100%"], [c("l", btn_label("dark", None, align="center",
                                                         anchor_from="center", anchor_to="center"))],
                     clips_children=True)),
            pad(3), centered(12, img(I + "check", [10, 10], "dark")), pad(6),
        ]))]
    return form_button(1, [w, h], {"default": face("btn_primary"), "hover": face("btn_primary_hover"),
                                    "pressed": face("btn_primary_pressed")})


def race_header(h, scale):
    return H(["100%", h], [
        c("icon", P([h, "100%"], [c("box", P([h - 2, h - 2], [
            bg(T + "icon_box_gold"),
            c("ih", P([12, 12], [c("i", btn_icon(["100%", "100%"], "dark", None, collection_index=19))],
                      collection_name=COL)),
        ], anchor_from="center", anchor_to="center"))])),
        pad(5),
        c("name", slot(19, ["fill", "100%"], "white", scale, "MinecraftTen")),
    ])


def long_text(idx, color="desc"):
    return slot(idx, ["100%", "100%c"], color, None, "smooth", "left", lines=2, anchor="top_left")


rc["pc_scroll_content"] = V(["100%", "100%c"], [
    c("desc", lbl("#form_text", ["100%", "default"], "desc", None, "smooth", "left")),
    pad("100%", 5),
    c("cap_bonus", caption("ui.dbe.du2.race_bonus")),
    pad("100%", 2),
    c("bonus", bonus_grid(16, 0.9)),
    pad("100%", 4),
    c("facts", facts(22, False)),
    pad("100%", 5),
    c("cap_forms", caption("ui.dbe.du2.first_forms")),
    pad("100%", 1),
    c("forms", long_text(16, "text")),
    pad("100%", 4),
    c("cap_custom", caption("ui.dbe.du2.customization_step")),
    pad("100%", 1),
    c("custom", long_text(17)),
    pad("100%", 2),
])

rc["pc"] = frame([480, 266], ["100% - 8px", "100% - 8px"], 24, [
    step("1", "ui.dbe.du2.step_race", True, 50), connector(),
    step("2", "ui.dbe.du2.step_look", False, 74), connector(),
    step("3", "ui.dbe.du2.step_start", False, 66),
], 18, [
    c("col", V(["100%", "100%"], [
        c("strip", P(["100%", 40], [bg(T + "panel_dark"), c("cards", race_strip(False))])),
        c("main", H(["100%", "fill"], [
            c("preview", race_preview(136, 80, True)),
            centered(2, img(T + "divider", [2, "100%"])),
            c("info", P(["fill", "100%"], [c("in", V(["100% - 12px", "100% - 10px"], [
                c("header", race_header(20, 1.2)),
                pad("100%", 4),
                c("scroll", P(["100%", "fill"], [c("s@common.scrolling_panel",
                                                   scroll("du2_select_race.pc_scroll_content"))])),
                pad("100%", 4),
                c("buttons", H(["100%", 22], [
                    c("fill", P(["fill", "100%"])),
                    c("random", host("b@common.button", random_button(84, 22, True), [84, 22])),
                    pad(6),
                    c("select", host("b@common.button", select_button(150, 22), [150, 22])),
                ])),
            ], anchor_from="center", anchor_to="center"))])),
        ])),
    ])),
])

# ---- Celular
RDET = "du2_race_details"
r_show = view("#toggle_state", source=RDET)
r_hide = view("(not #toggle_state)", source=RDET)

rc["mobile_details_content"] = V(["100%", "100%c"], [
    c("desc", lbl("#form_text", ["100%", "default"], "desc", None, "smooth", "left")),
    pad("100%", 5),
    c("cap_forms", caption("ui.dbe.du2.first_forms", scale=None, h=10)),
    pad("100%", 1),
    c("forms", long_text(16, "text")),
    pad("100%", 5),
    c("cap_custom", caption("ui.dbe.du2.customization_step", scale=None, h=10)),
    pad("100%", 1),
    c("custom", long_text(17)),
    pad("100%", 2),
])

m_info = P(["100%", "fill"], [
    c("normal", V(["100%", "100%"], [
        c("races", P(["100%", 24], [c("strip", race_strip(True))])),
        pad("100%", 3),
        c("name", slot(19, ["100%", 12], "white", None, "MinecraftTen")),
        pad("100%", 1),
        c("short", P(["100%", 20], [c("t", long_text(12))], clips_children=True)),
        pad("100%", 2),
        c("bonus", bonus_grid(15, None)),
        pad("100%", 3),
        c("facts", facts(20, True)),
    ], bindings=[r_hide])),
    c("details", P(["100%", "100%"], [
        bg(T + "panel_overlay"),
        c("in", V(["100% - 10px", "100% - 8px"], [
            c("head", H(["100%", 12], [
                c("n", slot(19, [110, "100%"], "white", None, "MinecraftTen")),
                centered("fill", lbl("ui.dbe.du2.details_of", ["100%", 10], "weak", None, "smooth")),
            ])),
            pad("100%", 3),
            c("scroll", P(["100%", "fill"], [c("s@common.scrolling_panel",
                                               scroll("du2_select_race.mobile_details_content"))])),
        ], anchor_from="center", anchor_to="center")),
    ], layer=10, bindings=[r_show])),
])

rc["mobile"] = frame(["100% - 6px", "100% - 6px"], [480, 270], 20, [
    c("step", P([76, "100%"], [c("pill", P([76, 15], [
        bg(T + "pill_gold"),
        c("t", lbl("ui.dbe.du2.step_1_of_3", ["100% - 8px", 10], "dark", None, "smooth", "center",
                   anchor_from="center", anchor_to="center")),
    ], anchor_from="center", anchor_to="center"))])),
], 22, [
    c("row", H(["100%", "100%"], [
        c("preview", race_preview(118, 70, False)),
        centered(2, img(T + "divider", [2, "100%"])),
        c("info", P(["fill", "100%"], [c("in", V(["100% - 8px", "100% - 6px"], [
            c("info", m_info),
            pad("100%", 3),
            c("buttons", H(["100%", 22], [
                c(RDET + "@du2.more_details_toggle", {"size": [96, 22]}),
                pad(4),
                c("random", host("b@common.button", random_button(26, 22, False), [26, 22])),
                pad(4),
                c("select", host("b@common.button", select_button("100%", 22), ["fill", 22])),
            ])),
        ], anchor_from="center", anchor_to="center"))])),
    ])),
])


# --------------------------------------------------------------------------- telas com abas e listas

HIDDEN_ITEM = "(#form_button_text = '') or (#form_button_text = 'ui.dbe.backButton')"


def body_label(color="desc"):
    return c("body", lbl("#form_text", ["100%", "default"], color, None, "smooth", "left"))


def list_item(h, gap=2, icon=False, plus=False, extra_hide=None, lines=1, key_icons=None):
    """Item de factory: linha com fundo, texto do botão e ícone opcional (cadeado do script) ou "+".
    key_icons: [(chave do texto, ícone, cor)] = ícone à esquerda quando o texto é igual à chave."""
    hide = HIDDEN_ITEM + (" or " + extra_hide if extra_hide else "")
    anchor = "left_middle" if lines == 1 else "top_left"

    def face(tex, plus_tex):
        row = [pad(6)]
        if key_icons:
            row += [centered(14, P([14, 14], [c("i_" + ic, img(I + ic, [12, 12], col, bindings=[
                coll_text(), view(f"(#form_button_text = '{key}')")])) for key, ic, col in key_icons])), pad(5)]
        label = btn_label("text", None, size=["100%", 10 if lines == 1 else "default"], align="left",
                          anchor_from=anchor, anchor_to=anchor)
        if lines > 1:
            label["offset"] = [0, 4]
        row += [c("t", P(["fill", "100%"], [c("l", label)], clips_children=True))]
        if icon:
            row += [pad(4), centered(16, btn_icon([16, 16], None))]
        if plus:
            maxed = "(not ((#form_button_text - 'maximized_skill') = #form_button_text))"
            row += [pad(4), centered(20, P([20, h - 6], [bg(T + plus_tex), c("i", img(I + "plus", [8, 8], "gold"))],
                                           bindings=[coll_text(), view("(not " + maxed + ")")]))]
        row += [pad(5)]
        return [bg(T + tex), c("row", H(["100%", "100%"], row))]
    button = form_button(None, ["100%", h], {"default": face("panel_row", "btn_plus"),
                                             "hover": face("btn_secondary_hover", "btn_plus_hover"),
                                             "pressed": face("btn_secondary_pressed", "btn_plus_pressed")},
                         hide_empty=False, anchor_from="top_left", anchor_to="top_left")
    return P(["100%", h + gap], [c("b@common.button", button)],
             bindings=[{"binding_type": "collection_details", "binding_collection_name": COL},
                       coll_text(), view("(not (" + hide + "))")])


def factory_list(item_ref):
    d = V(["100%", "100%c"], [], factory={"name": "buttons", "control_name": item_ref}, collection_name=COL,
          bindings=[{"binding_name": "#form_button_length", "binding_name_override": "#collection_length"}])
    del d["controls"]
    return d


def plain_button(idx, w, h, tex, icon=None, icol="cyan", label_color="text", vis=None):
    def face(t):
        row = []
        if icon:
            row += [centered(12, img(I + icon, [10, 10], icol)), pad(4)]
        row += [c("t", P([w - 30 if icon else w - 12, "100%"], [c("l", btn_label(label_color, None, align="center",
                                                                                 anchor_from="center", anchor_to="center"))],
                         clips_children=True))]
        return [bg(T + t), c("row", H(["100%c", "100%"], row, anchor_from="center", anchor_to="center"))]
    return host("b@common.button", form_button(idx, [w, h], {"default": face(tex), "hover": face(tex + "_hover"),
                                                             "pressed": face(tex + "_pressed")}, vis=vis), [w, h])


def screen_root(nsd, form_name):
    ns = nsd["namespace"]
    nsd[form_name + "@du2.root"] = {"controls": [
        c("pc@" + ns + ".pc", {"ignored": "$du2_mobile"}),
        c("mobile@" + ns + ".mobile", {"ignored": "$du2_pc"}),
    ]}


def tab_screen(nsd, form_name, content):
    """Tela com a barra de abas. content(mobile) -> lista de controles da área de conteúdo."""
    screen_root(nsd, form_name)
    nsd["pc"] = frame([450, 252], ["100% - 8px", "100% - 8px"], 24, [], 18, [
        c("row", H(["100%", "100%"], [
            c("nav@du2.nav_pc", {}),
            c("content", P(["fill", "100%"], [c("inner", P(["100% - 12px", "100% - 10px"], content(False),
                                                         anchor_from="center", anchor_to="center"))])),
        ])),
    ])
    nsd["mobile"] = frame(["100% - 6px", "100% - 6px"], [480, 270], 20, [], 22, [
        c("row", H(["100%", "100%"], [
            c("nav@du2.nav_mobile", {}),
            c("content", P(["fill", "100%"], [c("inner", P(["100% - 8px", "100% - 6px"], content(True),
                                                         anchor_from="center", anchor_to="center"))])),
        ])),
    ])


def scroll_area(nsd, name, controls):
    nsd[name] = V(["100%", "100%c"], controls)
    return c("s@common.scrolling_panel", scroll(nsd["namespace"] + "." + name))


# ---- Habilidades (kD): body = pontos; 10 = Transformações; 11+ = melhorar habilidade
sk = {"namespace": "du2_skills"}
sk["row_pc"] = list_item(20, plus=True, extra_hide="(#form_button_text = 'ui.dbe.skills.button.transformations')")
sk["row_mobile"] = list_item(22, plus=True, extra_hide="(#form_button_text = 'ui.dbe.skills.button.transformations')")


def skills_content(mobile):
    m = "mobile" if mobile else "pc"
    return [c("col", V(["100%", "100%"], [
        c("scroll", P(["100%", "fill"], [scroll_area(sk, "scroll_" + m, [
            body_label(), pad("100%", 4), c("list", factory_list("du2_skills.row_" + m))])])),
        pad("100%", 4),
        c("bottom", H(["100%", 22], [
            c("fill", P(["fill", "100%"])),
            c("transformations", plain_button(10, 130, 22, "btn_secondary", "tab_transformations", "gold")),
        ])),
    ]))]


tab_screen(sk, "skills_form", skills_content)


# ---- Transformações (kj): 10+ = formas (texto com requisitos; ícone = cadeado do script)
tr = {"namespace": "du2_transformations"}
tr["row_pc"] = list_item(72, icon=True, lines=6)
tr["row_mobile"] = list_item(76, icon=True, lines=6)


def transformations_content(mobile):
    m = "mobile" if mobile else "pc"
    return [c("scroll", P(["100%", "100%"], [scroll_area(tr, "scroll_" + m, [
        c("list", factory_list("du2_transformations.row_" + m))])]))]


tab_screen(tr, "transformations_form", transformations_content)


def back_button(w, h):
    """Voltar (índice 0, só quando o texto é ui.dbe.backButton)."""
    def face(t):
        return [bg(T + t), c("i", img(I + "back", [10, 10], "gold"))]
    btn = form_button(0, [w, h], {"default": face("btn_secondary"), "hover": face("btn_secondary_hover"),
                                  "pressed": face("btn_secondary_pressed")},
                      vis="(#form_button_text = 'ui.dbe.backButton')")
    return [pad(3), c("back", P([w, "100%"], [c("h", host("b@common.button", btn, [w, h]) | {
        "anchor_from": "center", "anchor_to": "center"})]))]


def action_button(idx, w, h, key_icons):
    """Botão principal com ícone escolhido pela chave do texto."""
    def face(t):
        icons = [c("i_" + ic, img(I + ic, [10, 10], "dark", bindings=[coll_text(), view(f"(#form_button_text = '{k}')")]))
                 for k, ic in key_icons]
        return [bg(T + t), c("row", H(["100%", "100%"], [
            pad(8), centered(12, P([12, 12], icons)), pad(4),
            c("t", P(["fill", "100%"], [c("l", btn_label("dark", None, align="center", anchor_from="center",
                                                         anchor_to="center"))], clips_children=True)),
            pad(8),
        ]))]
    btn = form_button(idx, [w, h], {"default": face("btn_primary"), "hover": face("btn_primary_hover"),
                                    "pressed": face("btn_primary_pressed")},
                      vis="(not ((#form_button_text = '') or (#form_button_text = 'ui.dbe.backButton')))")
    return host("b@common.button", btn, [w, h])


def detail_screen(nsd, form_name, bottom):
    """Tela sem abas: Voltar na barra de título, texto com rolagem e botões embaixo."""
    screen_root(nsd, form_name)
    for m, (size, mx, th, inset, bh) in {"pc": ([400, 240], ["100% - 8px", "100% - 8px"], 24, 12, 22),
                                          "mobile": (["100% - 6px", "100% - 6px"], [480, 270], 20, 8, 22)}.items():
        nsd[m] = frame(size, mx, th, [], 22 if m == "mobile" else 18, [
            c("inner", V([f"100% - {inset}px", f"100% - {inset - 2}px"], [
                c("scroll", P(["100%", "fill"], [scroll_area(nsd, "scroll_" + m, [body_label("text")])])),
                pad("100%", 4),
                c("bottom", H(["100%", bh], [c("fill", P(["fill", "100%"])), *bottom(m == "mobile")])),
            ], anchor_from="center", anchor_to="center")),
        ], left=back_button(24, th - 4 if th >= 24 else th))


# ---- Missões (kC lista: 10+ = missões) e detalhe (kB missão / k9 conquista: 0 = Voltar, 1 = Iniciar/Reiniciar)
qs = {"namespace": "du2_quests"}
qs["row_pc"] = list_item(20)
qs["row_mobile"] = list_item(22)


def quests_content(mobile):
    m = "mobile" if mobile else "pc"
    return [c("scroll", P(["100%", "100%"], [scroll_area(qs, "scroll_" + m, [
        c("list", factory_list("du2_quests.row_" + m))])]))]


tab_screen(qs, "quest_list_form", quests_content)

qd = {"namespace": "du2_detail"}
detail_screen(qd, "detail_form", lambda mobile: [
    c("action", action_button(1, 130, 22, [("ui.dbe.quest.button.start", "play"),
                                          ("ui.dbe.quest.button.restart", "restart")]))])


# ---- Treino (kH): 10+ = sombra / concentração / parar (ícone pela chave do texto)
tn = {"namespace": "du2_training"}
TRAIN_ICONS = [("ui.dbe.training.button.shadow_dummy", "train_shadow", "cyan"),
               ("ui.dbe.training.button.concentration", "train_concentration", "gold"),
               ("ui.dbe.training.button.stop_concentration", "train_stop", "red")]
tn["row_pc"] = list_item(24, key_icons=TRAIN_ICONS)
tn["row_mobile"] = list_item(26, key_icons=TRAIN_ICONS)


def training_content(mobile):
    m = "mobile" if mobile else "pc"
    return [c("scroll", P(["100%", "100%"], [scroll_area(tn, "scroll_" + m, [
        c("list", factory_list("du2_training.row_" + m))])]))]


tab_screen(tn, "training_form", training_content)


# ---- Conquistas (kb): 10+ = conquistas (título + progresso, descrição na 2ª linha)
ac = {"namespace": "du2_achievements"}
ac["row_pc"] = list_item(32, lines=2)
ac["row_mobile"] = list_item(34, lines=2)


def achievements_content(mobile):
    m = "mobile" if mobile else "pc"
    return [c("scroll", P(["100%", "100%"], [scroll_area(ac, "scroll_" + m, [
        c("list", factory_list("du2_achievements.row_" + m))])]))]


tab_screen(ac, "achievement_list_form", achievements_content)


# ---- Notícias (kz): só body + as 2 imagens fixas
nw = {"namespace": "du2_news"}


def news_content(mobile):
    m = "mobile" if mobile else "pc"
    return [c("scroll", P(["100%", "100%"], [scroll_area(nw, "scroll_" + m, [
        body_label("text"),
        pad("100%", 6),
        c("items", P(["100%", 121], [c("i", {"type": "image", "texture": "textures/ui/images/patron_items"})])),
        pad("100%", 4),
        c("chat", P(["100%", 47], [c("i", {"type": "image", "texture": "textures/ui/images/patron_chat"})])),
        pad("100%", 2),
    ])]))]


tab_screen(nw, "news_form", news_content)


# ---- Guia de ajuda (help): body = texto do tópico; 10+ = tópicos
hp = {"namespace": "du2_help"}
hp["row_pc"] = list_item(20)
hp["row_mobile"] = list_item(22)


def help_content(mobile):
    m = "mobile" if mobile else "pc"
    return [c("scroll", P(["100%", "100%"], [scroll_area(hp, "scroll_" + m, [
        body_label("text"),
        pad("100%", 6),
        c("list", factory_list("du2_help.row_" + m)),
    ])]))]


tab_screen(hp, "help_form", help_content)


# --------------------------------------------------------------------------- escrita

def fmt(v, ind=0):
    one = json.dumps(v, ensure_ascii=False, separators=(", ", ": "))
    if len(one) + ind <= 110 or not isinstance(v, (dict, list)) or not v:
        return one
    pad_ = " " * (ind + 1)
    if isinstance(v, list):
        return "[\n" + ",\n".join(pad_ + fmt(x, ind + 1) for x in v) + "\n" + " " * ind + "]"
    return "{\n" + ",\n".join(pad_ + json.dumps(k, ensure_ascii=False) + ": " + fmt(x, ind + 1)
                               for k, x in v.items()) + "\n" + " " * ind + "}"


def hoist(data, limit=600):
    """Sobe subárvores grandes para definições do namespace (menos aninhamento, reaproveita iguais)."""
    ns = data["namespace"]
    seen = {}
    out = {}

    def walk(body, depth):
        ctrls = body.get("controls") if isinstance(body, dict) else None
        if not ctrls:
            return
        new = []
        for entry in ctrls:
            (name, sub), = entry.items()
            walk(sub, depth + 1)
            compact = json.dumps(sub, sort_keys=True, ensure_ascii=False)
            if depth >= 1 and len(compact) > limit:
                base = name.split("@", 1)[1] if "@" in name else None
                key = (base, compact)
                if key not in seen:
                    tid = f"h{len(seen) + 1}"
                    seen[key] = tid
                    out[tid + ("@" + base if base else "")] = sub
                short = name.split("@", 1)[0]
                new.append({f"{short}@{ns}.{seen[key]}": {}})
            else:
                new.append(entry)
        body["controls"] = new

    for k, v in list(data.items()):
        if isinstance(v, dict):
            walk(v, 0)
    data.update(out)
    return data


def write(name, data):
    hoist(data)
    path = os.path.join(UI, "du2", name)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", newline="\n") as f:
        f.write(fmt(data) + "\n")
    print("ok", path)


write("du2_common.json", common)
write("du2_statistics.json", st)
write("du2_select_race.json", rc)
write("du2_skills.json", sk)
write("du2_transformations.json", tr)
write("du2_quests.json", qs)
write("du2_detail.json", qd)
write("du2_training.json", tn)
write("du2_achievements.json", ac)
write("du2_news.json", nw)
write("du2_help.json", hp)
