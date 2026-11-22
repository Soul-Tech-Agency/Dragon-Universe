// Gera RP textures/ui/du2 conforme CONTRATO.md §7 (redesign 1.7.17). Escala: 1 px = 1 unidade de UI.
// Uso: node du2_textures.cjs "<RP>/textures/ui/du2" preview_texturas.png
// Requer @resvg/resvg-js (instalar com pnpm numa pasta temporária fora do repo).
const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');

const OUT = process.argv[2];
const PREVIEW = process.argv[3];
const made = [];

function render(svg, w, h) {
  const png = new Resvg(svg, { fitTo: { mode: 'original' }, font: { loadSystemFonts: true } }).render();
  if (png.width !== w || png.height !== h) throw new Error(`tamanho ${png.width}x${png.height} != ${w}x${h}`);
  return png.asPng();
}
function save(rel, buf) { const f = path.join(OUT, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, buf); }
const svgWrap = (w, h, body, defs = '') => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs>${defs}</defs>${body}</svg>`;
function rr(x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  if (r <= 0) return `M${x} ${y}h${w}v${h}h${-w}Z`;
  return `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`;
}
// cantos só em cima
function rrTop(x, y, w, h, r) { return `M${x} ${y + h}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h}Z`; }

/** Caixa padrão: borda (opcional) de 1 px + miolo, raio r medido na borda. */
function box(w, h, { r, fill, border = null, fillOpacity = 1, extra = '' }) {
  let s = '';
  if (border) { s += `<path d="${rr(0, 0, w, h, r)}" fill="${border}"/>`; s += `<path d="${rr(1, 1, w - 2, h - 2, Math.max(r - 1, 0))}" fill="${fill}" fill-opacity="${fillOpacity}"/>`; }
  else s += `<path d="${rr(0, 0, w, h, r)}" fill="${fill}" fill-opacity="${fillOpacity}"/>`;
  return s + extra;
}
/**
 * Registra uma textura.
 * ns: número, [l,t,r,b] ou 0 (sem nineslice -> sem .json)
 */
function tex(name, w, h, ns, body, defs = '', group = 'base') {
  save(`${name}.png`, render(svgWrap(w, h, body, defs), w, h));
  if (ns !== 0) save(`${name}.json`, Buffer.from(JSON.stringify({ nineslice_size: ns, base_size: [w, h] }) + '\n'));
  made.push({ name, rel: `${name}.png`, w, h, ns, group });
}

// ---------- 7.1 Painéis e molduras ----------
// panel_main: contorno escuro 1 px, brilho ciano 1 px, borda ciano 1 px, miolo; r4 na borda
tex('panel_main', 32, 32, 6,
  `<path d="${rr(0, 0, 32, 32, 6)}" fill="#060A16"/>` +
  `<path d="${rr(1, 1, 30, 30, 5)}" fill="#23D7FF" fill-opacity="0.35"/>` +
  `<path d="${rr(2, 2, 28, 28, 4)}" fill="#23D7FF"/>` +
  `<path d="${rr(3, 3, 26, 26, 3)}" fill="#122344"/>`, '', 'panel');
tex('title_bar', 32, 24, 5,
  `<path d="${rrTop(0, 0, 32, 24, 3)}" fill="#172B4D"/><rect x="0" y="23" width="32" height="1" fill="#1D3F73"/>`, '', 'panel');
tex('panel_dark', 16, 16, 4, box(16, 16, { r: 3, fill: '#0C1730', border: '#1D3F73' }), '', 'panel');
tex('panel_row', 16, 16, 4, box(16, 16, { r: 3, fill: '#172B4D', border: '#1D3F73' }), '', 'panel');
tex('panel_nav', 16, 16, 3, `<rect width="16" height="16" fill="#0C1730"/><rect x="15" width="1" height="16" fill="#1D3F73"/>`, '', 'panel');
tex('panel_preview', 64, 96, 6,
  `<path d="${rr(0, 0, 64, 96, 3)}" fill="#1D3F73"/><path d="${rr(1, 1, 62, 94, 2)}" fill="url(#g)"/>`,
  `<radialGradient id="g" gradientUnits="userSpaceOnUse" cx="32" cy="57.6" r="52"><stop offset="0" stop-color="#1D3F73"/><stop offset="0.7" stop-color="#0C1730"/><stop offset="1" stop-color="#0C1730"/></radialGradient>`, 'panel');
tex('panel_overlay', 16, 16, 4, box(16, 16, { r: 4, fill: '#0C1730', border: '#23D7FF' }), '', 'panel');
tex('caption_box', 16, 16, 4, box(16, 16, { r: 3, fill: '#060A16', fillOpacity: 0.75 }), '', 'panel');
tex('divider', 4, 2, 0, `<rect width="4" height="2" fill="#1D3F73"/>`, '', 'panel');

// ---------- 7.2 Pílulas e chips ----------
tex('pill_dark', 16, 16, 7, box(16, 16, { r: 8, fill: '#0C1730', border: '#1674FF' }), '', 'pill');
tex('pill_gold', 16, 16, 7, box(16, 16, { r: 8, fill: '#F6B943' }), '', 'pill');
tex('pill_blue', 16, 16, 7, box(16, 16, { r: 8, fill: '#172B4D', border: '#1674FF' }), '', 'pill');
tex('step_dot', 12, 12, 0, `<circle cx="6" cy="6" r="6" fill="#0C1730"/>`, '', 'pill');
tex('step_dot_off', 12, 12, 0, `<circle cx="6" cy="6" r="6" fill="#172B4D"/>`, '', 'pill');
tex('icon_box', 16, 16, 4, box(16, 16, { r: 3, fill: '#172B4D' }), '', 'pill');
tex('icon_box_dark', 16, 16, 4, box(16, 16, { r: 3, fill: '#0C1730' }), '', 'pill');
tex('icon_box_gold', 16, 16, 4, box(16, 16, { r: 3, fill: '#F6B943' }), '', 'pill');
// xp: 4x4 visíveis + 1 px de brilho (on) ou de folga transparente (off), para os dois ocuparem o mesmo espaço
tex('xp_on', 6, 6, 2, `<path d="${rr(0, 0, 6, 6, 2)}" fill="#23D7FF" fill-opacity="0.35"/><path d="${rr(1, 1, 4, 4, 1)}" fill="#23D7FF"/>`, '', 'pill');
tex('xp_off', 6, 6, 2, `<path d="${rr(1, 1, 4, 4, 1)}" fill="#1D3F73"/>`, '', 'pill');

// ---------- 7.3 Botões ----------
// btn_primary 16x18: face 16x16 + sombra de 2 px embaixo; pressed desce 2 px sem sombra
const primary = (face, shadow, dy) => (shadow ? `<path d="${rr(0, 2, 16, 16, 3)}" fill="${shadow}"/>` : '') + `<path d="${rr(0, dy, 16, 16, 3)}" fill="${face}"/>` +
  `<path d="${rr(1, dy + 1, 14, 1, 0.5)}" fill="#FFFFFF" fill-opacity="${shadow ? 0.22 : 0.08}"/>`;
tex('btn_primary', 16, 18, [4, 4, 4, 6], primary('#F6B943', '#B9801C', 0), '', 'btn');
tex('btn_primary_hover', 16, 18, [4, 4, 4, 6], primary('#FFCB5C', '#B9801C', 0), '', 'btn');
tex('btn_primary_pressed', 16, 18, [4, 4, 4, 6], primary('#E0A532', null, 2), '', 'btn');
tex('btn_secondary', 16, 16, 4, box(16, 16, { r: 3, fill: '#172B4D', border: '#1674FF' }), '', 'btn');
tex('btn_secondary_hover', 16, 16, 4, box(16, 16, { r: 3, fill: '#172B4D', border: '#23D7FF' }), '', 'btn');
tex('btn_secondary_pressed', 16, 16, 4, box(16, 16, { r: 3, fill: '#0C1730', border: '#23D7FF' }), '', 'btn');
tex('btn_plus', 16, 16, 4, box(16, 16, { r: 3, fill: '#1D3F73', border: '#23D7FF' }), '', 'btn');
tex('btn_plus_hover', 16, 16, 4, box(16, 16, { r: 3, fill: '#24508F', border: '#23D7FF' }), '', 'btn');
tex('btn_plus_pressed', 16, 16, 4, box(16, 16, { r: 3, fill: '#0C1730', border: '#23D7FF' }), '', 'btn');
tex('btn_close', 16, 16, 4, box(16, 16, { r: 3, fill: '#0C1730', border: '#1674FF' }), '', 'btn');
tex('btn_close_hover', 16, 16, 4, box(16, 16, { r: 3, fill: '#0C1730', border: '#23D7FF' }), '', 'btn');
tex('btn_close_pressed', 16, 16, 4, box(16, 16, { r: 3, fill: '#172B4D', border: '#1674FF' }), '', 'btn');
// tab normal: totalmente transparente (alpha 0)
tex('tab', 32, 16, 4, `<rect width="32" height="16" fill="#000000" fill-opacity="0"/>`, '', 'btn');
tex('tab_hover', 32, 16, 4, box(32, 16, { r: 3, fill: '#172B4D', border: '#1D3F73' }), '', 'btn');
tex('tab_pressed', 32, 16, 4, box(32, 16, { r: 3, fill: '#0C1730', border: '#23D7FF' }), '', 'btn');
tex('tab_active', 32, 16, [5, 4, 4, 4],
  box(32, 16, { r: 3, fill: '#1D3F73', border: '#23D7FF' }) + `<g clip-path="url(#ci)"><rect x="1" y="1" width="2" height="14" fill="#F6B943"/></g>`,
  `<clipPath id="ci"><path d="${rr(1, 1, 30, 14, 2)}"/></clipPath>`, 'btn');
tex('tab_icon', 16, 16, 4, box(16, 16, { r: 3, fill: '#172B4D', border: '#1D3F73' }), '', 'btn');
tex('tab_icon_hover', 16, 16, 4, box(16, 16, { r: 3, fill: '#172B4D', border: '#23D7FF' }), '', 'btn');
tex('tab_icon_pressed', 16, 16, 4, box(16, 16, { r: 3, fill: '#0C1730', border: '#1D3F73' }), '', 'btn');
tex('tab_icon_active', 16, 16, 4, box(16, 16, { r: 3, fill: '#F6B943' }), '', 'btn');
tex('seg', 16, 12, 3, `<rect width="16" height="12" fill="#000000" fill-opacity="0"/>`, '', 'btn');
tex('seg_hover', 16, 12, 3, box(16, 12, { r: 2, fill: '#172B4D' }), '', 'btn');
tex('seg_pressed', 16, 12, 3, box(16, 12, { r: 2, fill: '#1D3F73' }), '', 'btn');
tex('seg_active', 16, 12, 3, box(16, 12, { r: 2, fill: '#23D7FF' }), '', 'btn');
tex('race_card', 24, 24, 5, box(24, 24, { r: 4, fill: '#172B4D', border: '#1D3F73' }), '', 'btn');
tex('race_card_hover', 24, 24, 5, box(24, 24, { r: 4, fill: '#172B4D', border: '#23D7FF' }), '', 'btn');
tex('race_card_pressed', 24, 24, 5, box(24, 24, { r: 4, fill: '#0C1730', border: '#1D3F73' }), '', 'btn');
// ativo: brilho ciano de 1 px por dentro da borda + barra dourada de 3 px embaixo
tex('race_card_active', 24, 24, [5, 5, 5, 7],
  `<path d="${rr(0, 0, 24, 24, 4)}" fill="#23D7FF"/><path d="${rr(1, 1, 22, 22, 3)}" fill="#3C8FC0"/><path d="${rr(2, 2, 20, 20, 2)}" fill="#1D3F73"/>` +
  `<g clip-path="url(#cb)"><rect x="1" y="20" width="22" height="3" fill="#F6B943"/></g>`,
  `<clipPath id="cb"><path d="${rr(1, 1, 22, 22, 3)}"/></clipPath>`, 'btn');
tex('race_icon_active', 24, 24, 5,
  `<path d="${rr(0, 0, 24, 24, 4)}" fill="#F6B943" fill-opacity="0.35"/><path d="${rr(1, 1, 22, 22, 3)}" fill="#F6B943"/>`, '', 'btn');

// ---------- 7.4 Logo ----------
// "DU" em traço chanfrado (estilo Chakra Petch), dourado
tex('du_logo', 48, 48, 0,
  `<circle cx="24" cy="24" r="23" fill="#23D7FF" fill-opacity="0.18"/><circle cx="24" cy="24" r="22" fill="#23D7FF" fill-opacity="0.25" filter="url(#bl)"/>` +
  `<circle cx="24" cy="24" r="21" fill="#23D7FF"/><circle cx="24" cy="24" r="19" fill="#0C1730"/>` +
  `<path d="M13.5 16.5h6l3.5 3.5v8l-3.5 3.5h-6z M26 16.5v11.5l3.5 3.5h3.5l3.5-3.5v-11.5" fill="none" stroke="#F6B943" stroke-width="3" stroke-linejoin="miter" stroke-linecap="butt"/>`,
  `<filter id="bl" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="1"/></filter>`, 'logo');

// ---------- 7.5 Ícones brancos 32x32, traço ~3 px ----------
const P = {
  stats: 'M4 20V11M10 20V5M16 20v-6M2 20h20',
  skills: 'M12 2c1 4 5 6 5 11a5 5 0 0 1-10 0c0-3 2-4 2-7 2 1 3 3 3 3s1-3 0-7z',
  bolt: 'M13 2 4 14h7l-1 8 9-12h-7l1-8z',
  missions: 'M5 21V4M5 4h12l-2.5 4L17 12H5',
  training: 'M6 7v10M3 9v6M18 7v10M21 9v6M6 12h12',
  trophy: 'M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4zM7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4',
  news: 'M4 5h13v14H6a2 2 0 0 1-2-2V5zM17 9h3v8a2 2 0 0 1-2 2M8 9h5M8 13h5M8 16h3',
  help: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.7M12 17h.01',
  person: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
  scale: 'M12 3v18M5 7h14M5 7l-3 7a3 3 0 0 0 6 0L5 7zM19 7l-3 7a3 3 0 0 0 6 0l-3-7zM8 21h8',
  mentor: 'M2 9l10-5 10 5-10 5L2 9zM6 11v5c3 2 9 2 12 0v-5',
  heart: 'M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-3 4.5 4.5 0 0 1 8 3c0 6-8 11-8 11z',
  wind: 'M3 8h11a3 3 0 1 0-3-3M3 12h16a3 3 0 1 1-3 3M3 16h8',
  orb: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  fist: 'M6 11V7a2 2 0 0 1 4 0v4M10 10V6a2 2 0 0 1 4 0v4M14 10V7a2 2 0 0 1 4 0v6a7 7 0 0 1-7 7h-1a6 6 0 0 1-6-6v-2a2 2 0 0 1 4 0',
  burst: 'M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M5 19l3-3M16 8l3-3M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  size: 'M4 20 20 4M14 4h6v6M10 20H4v-6',
  sword: 'M14 4h6v6L9 21l-6-6L14 4zM5 13l6 6',
  shield: 'M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6l8-3z',
  regen: 'M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-3 4.5 4.5 0 0 1 8 3c0 6-8 11-8 11zM12 9v6M9 12h6',
  plus: 'M12 5v14M5 12h14',
  close: 'M6 6l12 12M18 6 6 18',
  chevron_left: 'M15 5l-7 7 7 7',
  chevron_right: 'M9 5l7 7-7 7',
  random: 'M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5',
  check: 'M5 12l5 5 9-10',
  info: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 16v-5M12 8h.01',
  globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18',
  spikes: 'M4 19l2-10 3 4 3-10 3 10 3-4 2 10z',
  namek: 'M9 9 7 3M15 9l2-6M12 21a6 6 0 0 0 6-6v-2a6 6 0 0 0-12 0v2a6 6 0 0 0 6 6z',
  frost: 'M12 2v20M3.3 7l17.4 10M20.7 7 3.3 17M9 4l3 2 3-2M9 20l3-2 3 2',
  majin: 'M12 3c4 5 7 8 7 12a7 7 0 0 1-14 0c0-4 3-7 7-12z',
  bio: 'M12 2l9 5v10l-9 5-9-5V7l9-5zM12 8l4 2v4l-4 2-4-2v-4z',
  glind: 'M5 3c0 5 2 8 5 9M19 3c0 5-2 8-5 9M12 21a5 5 0 0 0 5-5v-2H7v2a5 5 0 0 0 5 5z',
  // sem mockup: chip de circuito (Androide)
  android: 'M7 7h10v10H7zM10.5 10.5h3v3h-3zM10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4'
};
const ICONS = {
  tab_statistics: 'stats', tab_skills: 'skills', tab_transformations: 'bolt', tab_quests: 'missions', tab_training: 'training',
  tab_achievements: 'trophy', tab_news: 'news', tab_help: 'help',
  chip_race: 'person', chip_form: 'bolt', chip_alignment: 'scale', chip_mentor: 'mentor',
  attr_constitution: 'heart', attr_dexterity: 'wind', attr_spirit: 'orb', attr_strength: 'fist', attr_willpower: 'burst', attr_size: 'size',
  stat_damage: 'sword', stat_defense: 'shield', stat_energy: 'bolt', stat_bp: 'bolt',
  fact_regen: 'regen', fact_forms: 'bolt', fact_gender: 'person',
  race_earthling: 'globe', race_saiyan: 'spikes', race_namekian: 'namek', race_frost_demon: 'frost', race_majin: 'majin',
  race_bio_android: 'bio', race_glind: 'glind', race_android: 'android',
  plus: 'plus', close: 'close', chevron_left: 'chevron_left', chevron_right: 'chevron_right', random: 'random', check: 'check', info: 'info'
};
for (const [name, key] of Object.entries(ICONS)) {
  // viewBox 24 com 1 un. de respiro -> escala 32/26; traço 2.4 -> ~3 px
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="-1 -1 26 26"><path d="${P[key]}" fill="none" stroke="#FFFFFF" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  save(`icons/${name}.png`, render(svg, 32, 32));
  made.push({ name: `icons/${name}`, rel: `icons/${name}.png`, w: 32, h: 32, ns: 0, group: 'icon' });
}

// ---------- Preview (tudo junto; pixels ampliados sem suavizar) ----------
if (PREVIEW) {
  const b64 = rel => 'data:image/png;base64,' + fs.readFileSync(path.join(OUT, rel)).toString('base64');
  const T = (x, y, t, s = 12, c = '#A8B6D0') => `<text x="${x}" y="${y}" font-family="DejaVu Sans" font-size="${s}" fill="${c}">${t.replace(/&/g, '&amp;')}</text>`;
  const img = (x, y, w, h, href, vb) => vb
    ? `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="${vb}" preserveAspectRatio="none"><image image-rendering="optimizeSpeed" width="${vb.split(' ')[4]}" height="${vb.split(' ')[5]}" href="${href}"/></svg>`
    : `<image image-rendering="optimizeSpeed" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="none" href="${href}"/>`;
  // nineslice simulado: alvo dw x dh em unidades, ampliado por Z
  function nine(m, x0, y0, dw, dh, Z) {
    const [l, t, r, b] = Array.isArray(m.ns) ? m.ns : [m.ns, m.ns, m.ns, m.ns];
    const href = b64(m.rel); let s = '';
    const cols = [[0, l, 0, l], [l, m.w - l - r, l, dw - l - r], [m.w - r, r, dw - r, r]];
    const rows = [[0, t, 0, t], [t, m.h - t - b, t, dh - t - b], [m.h - b, b, dh - b, b]];
    for (const [sx, sw, dx, ddw] of cols) for (const [sy, sh, dy, ddh] of rows) {
      if (sw <= 0 || sh <= 0 || ddw <= 0 || ddh <= 0) continue;
      s += `<svg x="${x0 + dx * Z}" y="${y0 + dy * Z}" width="${ddw * Z}" height="${ddh * Z}" viewBox="${sx} ${sy} ${sw} ${sh}" preserveAspectRatio="none"><image image-rendering="optimizeSpeed" width="${m.w}" height="${m.h}" href="${href}"/></svg>`;
    }
    return s;
  }
  const W = 1600; let y = 34; let body = T(20, y, 'textures/ui/du2 — CONTRATO §7 (Aquarela). 1 px = 1 un.; mostrado em 3x (texturas) / 2x (ícones)', 18, '#E6ECF7');
  y += 26; body += T(20, y, 'Nineslices: à esquerda o PNG em 3x; à direita esticado como no jogo (nineslice simulado), 3x.'); y += 14;
  const Z = 3; const pieces = made.filter(m => m.group !== 'icon');
  const colW = 520; let col = 0, rowH = 0, x = 20;
  for (const m of pieces) {
    const stretch = m.ns !== 0 && !['divider'].includes(m.name);
    const dw = stretch ? Math.max(m.w, 64) : m.w, dh = stretch ? Math.max(m.h, m.name === 'panel_preview' ? 96 : 24) : m.h;
    const need = Math.max(m.h, dh) * Z + 28;
    const bx = 20 + col * colW;
    body += `<rect x="${bx - 6}" y="${y - 4}" width="${colW - 12}" height="${need}" rx="6" fill="#16202f"/>`;
    body += img(bx, y, m.w * Z, m.h * Z, b64(m.rel));
    if (stretch) body += nine(m, bx + m.w * Z + 24, y, dw, dh, Z);
    body += T(bx, y + need - 10, `${m.name}  ${m.w}x${m.h}  ns ${JSON.stringify(m.ns)}`, 11);
    rowH = Math.max(rowH, need + 8); col++;
    if (col === 3) { col = 0; y += rowH; rowH = 0; }
  }
  if (col) y += rowH;
  // ícones com as cores do contrato
  const tint = { tab_help: '#F6B943', chip_form: '#F6B943', chip_alignment: '#A8B6D0', chip_mentor: '#A8B6D0', attr_constitution: '#FF6B7A', attr_dexterity: '#7CE38B',
    attr_strength: '#FF9F43', attr_willpower: '#C38BFF', attr_size: '#A8B6D0', stat_damage: '#FF9F43', stat_defense: '#7CE38B', stat_bp: '#F6B943', fact_regen: '#7CE38B',
    fact_forms: '#F6B943', plus: '#F6B943', close: '#A8B6D0', chevron_left: '#F6B943', chevron_right: '#F6B943' };
  y += 16; body += T(20, y, 'icons/ — 32x32 brancos (linha de cima de cada célula: branco 2x; embaixo: tingido como o JSON vai fazer, 1x)'); y += 12;
  const icons = made.filter(m => m.group === 'icon');
  icons.forEach((m, i) => {
    const n = m.name.slice(6), cx = 20 + (i % 13) * 120, cy = y + Math.floor(i / 13) * 122;
    const c = tint[n] || '#23D7FF';
    body += `<rect x="${cx}" y="${cy}" width="108" height="110" rx="8" fill="#0C1730" stroke="#1D3F73"/>`;
    body += img(cx + 22, cy + 6, 64, 64, b64(m.rel));
    body += `<defs><filter id="t${i}"><feFlood flood-color="${c}"/><feComposite in2="SourceAlpha" operator="in"/></filter></defs>`;
    body += `<image x="${cx + 38}" y="${cy + 72}" width="32" height="32" filter="url(#t${i})" href="${b64(m.rel)}"/>`;
    body += T(cx + 4, cy + 122, n, 9);
  });
  y += Math.ceil(icons.length / 13) * 122 + 24;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${y}"><rect width="${W}" height="${y}" fill="#0A1222"/>${body}</svg>`;
  fs.writeFileSync(PREVIEW, new Resvg(svg, { fitTo: { mode: 'original' }, font: { loadSystemFonts: true } }).render().asPng());
  console.log('preview', W + 'x' + y);
}
console.log('texturas', made.filter(m => m.group !== 'icon').length, 'ícones', made.filter(m => m.group === 'icon').length);
