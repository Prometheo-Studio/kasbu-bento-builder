#!/usr/bin/env node
/*
 * kasbu.js — render, lint and preview HTML blocks for a Kasbu bento page.
 *
 *   node scripts/kasbu.js build  site.json [--out out]   render blocks + lint + preview
 *   node scripts/kasbu.js lint   <dir|file> [...]        lint existing block files
 *
 * No dependencies (Node 18+).
 *
 * Template syntax (see references/block-catalog.md):
 *   {{KEY}} {{KEY|default}}        value (HTML-escaped, except keys that start with RAW_)
 *   {{.}} {{.field}} {{.length}}   current item inside {{#each}}  ({{@index}} 0-based, {{@n}} 1-based)
 *   {{#each LIST}}...{{/each}}     loop over an array (strings or objects)
 *   {{#if KEY}}...{{else}}...{{/if}}
 *   {{> partial prefix}}           include templates/partials/partial.css with __P__ replaced by prefix
 *   {{! comment }}
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TEMPLATES = path.join(ROOT, 'templates');

/* ----------------------------------------------------------------- colors */
function hexToRgb(hex) {
  let h = String(hex).replace('#', '').trim();
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function rgbToHex([r, g, b]) {
  return '#' + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
}
const mix = (rgb, to, t) => rgb.map((v, i) => v + (to[i] - v) * t);
function accentVars(hex) {
  const rgb = hexToRgb(hex || '#e8503f');
  return `--a:${rgbToHex(rgb)};--a-rgb:${rgb.join(',')};--a-dk:${rgbToHex(mix(rgb, [0, 0, 0], 0.22))};--a-lt:${rgbToHex(mix(rgb, [255, 255, 255], 0.38))}`;
}

/* ------------------------------------------------------------ mini engine */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function resolvePartials(tpl) {
  return tpl.replace(/\{\{>\s*([\w-]+)\s+([\w-]+)\s*\}\}/g, (_, name, prefix) => {
    const file = path.join(TEMPLATES, 'partials', name + '.css');
    if (!fs.existsSync(file)) throw new Error(`Partial not found: ${name}`);
    return fs.readFileSync(file, 'utf8').replace(/__P__/g, prefix).replace(/\s+$/, '');
  });
}

const TAG = /\{\{(#each|#if|\/each|\/if|else)\b([^}]*)\}\}/g;
function parse(tpl) {
  const root = { type: 'root', children: [] };
  const stack = [root];
  const target = (n) => (n._else ? n.elseChildren : n.children);
  let last = 0;
  let m;
  TAG.lastIndex = 0;
  while ((m = TAG.exec(tpl))) {
    const cur = stack[stack.length - 1];
    if (m.index > last) target(cur).push({ type: 'text', value: tpl.slice(last, m.index) });
    last = TAG.lastIndex;
    const kind = m[1];
    const arg = m[2].trim();
    if (kind === '#each' || kind === '#if') {
      const node = { type: kind.slice(1), arg, children: [], elseChildren: [], _else: false };
      target(cur).push(node);
      stack.push(node);
    } else if (kind === 'else') {
      cur._else = true;
    } else {
      stack.pop();
    }
  }
  if (last < tpl.length) target(stack[stack.length - 1]).push({ type: 'text', value: tpl.slice(last) });
  return root;
}

function lookup(key, ctx) {
  if (key === '.') return ctx.item;
  if (key === '@index') return ctx.index;
  if (key === '@n') return ctx.index + 1;
  if (key.startsWith('.')) {
    const f = key.slice(1);
    if (f === 'length') {
      const base = ctx.item && typeof ctx.item === 'object' ? ctx.item.text || ctx.item.name || '' : ctx.item;
      return String(base == null ? '' : base).length;
    }
    return ctx.item && typeof ctx.item === 'object' ? ctx.item[f] : undefined;
  }
  return key.split('.').reduce((o, k) => (o == null ? undefined : o[k]), ctx.data);
}
const truthy = (v) => (Array.isArray(v) ? v.length > 0 : !!v && v !== 'false' && v !== '0');

function renderText(text, ctx) {
  return text
    .replace(/\{\{!.*?\}\}/gs, '')
    .replace(/\{\{\s*([^#\/>!}|\s][^}|]*?)\s*(?:\|([^}]*))?\}\}/g, (_, key, def) => {
      let v = lookup(key.trim(), ctx);
      if (v === undefined || v === null || v === '') v = def === undefined ? '' : def;
      return key.trim().startsWith('RAW_') || key.trim().startsWith('.RAW_') ? String(v) : esc(v);
    });
}
function renderNodes(nodes, ctx) {
  let out = '';
  for (const n of nodes) {
    if (n.type === 'text') out += renderText(n.value, ctx);
    else if (n.type === 'if') {
      const neg = n.arg.startsWith('!');
      const v = truthy(lookup(neg ? n.arg.slice(1) : n.arg, ctx));
      out += renderNodes(neg ? (v ? n.elseChildren : n.children) : v ? n.children : n.elseChildren, ctx);
    } else if (n.type === 'each') {
      const list = lookup(n.arg, ctx);
      if (Array.isArray(list)) list.forEach((item, index) => { out += renderNodes(n.children, { data: ctx.data, item, index }); });
    }
  }
  return out;
}
function renderTemplate(tpl, data) {
  return renderNodes(parse(resolvePartials(tpl)).children, { data, item: undefined, index: 0 });
}

/* ------------------------------------------------ derived data per template */
const derive = {
  'stat-counter'(d) {
    const n = Math.max(1, parseInt(d.NUMBER || 10, 10));
    const variant = d.VARIANT || (n <= 12 ? 'ring' : n <= 36 ? 'rings2' : 'mosaic');
    const out = {
      N: n, REEL: Array.from({ length: n + 1 }, (_, i) => i), VARIANT: variant,
      IS_MOSAIC: variant === 'mosaic',
      TOP: variant === 'ring' ? 50 : variant === 'rings2' ? 42 : 45,
      LABEL_BOTTOM: variant === 'ring' ? 19 : 7,
    };
    if (variant === 'ring') {
      const c = Math.min(n, 12);
      out.DOTS = Array.from({ length: c }, (_, i) => ({ k: i, a: (i * 360 / c).toFixed(1), r: 41 }));
      out.DOT_DELAY = (2 / c).toFixed(3);
    } else if (variant === 'rings2') {
      const c = Math.min(n, 36);
      const inner = Math.round(c * 0.27);
      out.DOTS = [];
      for (let i = 0; i < inner; i++) out.DOTS.push({ k: i, a: (22.5 + i * (360 / inner)).toFixed(1), r: 29 });
      const outer = c - inner;
      for (let i = 0; i < outer; i++) out.DOTS.push({ k: inner + i, a: (8 + i * (360 / outer)).toFixed(1), r: 39.5 });
      out.DOT_DELAY = (2 / c).toFixed(3);
    } else {
      const c = Math.min(n, 48);
      out.CELLS = Array.from({ length: c }, (_, i) => i);
      out.CELL_DELAY = (2 / c).toFixed(3);
      out.ROWS = Math.ceil(c / 8);
    }
    return out;
  },
  'quote-card'(d) {
    return d.INITIALS || !d.NAME ? {} : { INITIALS: d.NAME.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase() };
  },
  'timeline-card'(d) {
    const items = (d.ITEMS && d.ITEMS.length ? d.ITEMS : [{ year: '2020', text: 'Started' }, { year: '2023', text: 'Grew' }]).slice(0, 4);
    const n = items.length, s = 100 / n, f = (v) => +v.toFixed(2);
    const on = f(s * 0.9), off = f(s * 0.96);
    return {
      ITEM_LIST: items.map((it, i) => ({ ...it, i })),
      CYCLE: n * 2,
      RAW_KF: `@keyframes tl-d{0%,${on}%{background:var(--a);border-color:var(--a);box-shadow:0 0 0 1.4cqw rgba(var(--a-rgb),.25)}${off}%,100%{background:#0b0b0d;border-color:rgba(255,255,255,.4);box-shadow:0 0 0 0 rgba(var(--a-rgb),0)}}`,
    };
  },
  'link-list'(d) {
    const links = (d.LINKS && d.LINKS.length ? d.LINKS : [{ label: 'My site', hint: 'example.com', url: 'https://example.com' }]).slice(0, 3);
    return { LINK_LIST: links.map((l, i) => ({ ...l, i })) };
  },
  'profile-card'(d) {
    const given = d.ROLES && d.ROLES.length ? d.ROLES : ['Founder', 'Designer', 'Developer', 'Speaker'];
    const roles = Array.from({ length: 4 }, (_, i) => given[i % given.length]); // always 4 slots; repeats if fewer
    const out = { ROLE_LIST: roles.map((text, i) => ({ text, delay: i * 3, last: i === roles.length - 1 })) };
    if (!d.INITIALS && d.NAME) out.INITIALS = d.NAME.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
    if (!d.SEAL_TEXT) out.SEAL_TEXT = roles.slice(0, 3).map((r) => r.toUpperCase()).join(' · ') + ' · ';
    return out;
  },
  'testimonials-banner'(d) {
    const q = d.QUOTES && d.QUOTES.length ? d.QUOTES : [];
    const n = Math.max(1, q.length);
    const s = 100 / n;
    const f = (v) => +v.toFixed(2);
    const a = f(s * 0.09), b = f(s * 0.9), c = f(s), e = f(s * 0.93), g = f(s * 1.02);
    return {
      QUOTE_LIST: q.map((it, i) => ({ ...it, delay: i * 4, initials: it.initials || String(it.name || '?').split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase() })),
      CYCLE: n * 4,
      RAW_KF: `@keyframes cl-q{0%{opacity:0;transform:translateY(.9cqw)}${a}%{opacity:1;transform:translateY(0)}${b}%{opacity:1;transform:translateY(0)}${c}%{opacity:0;transform:translateY(-.9cqw)}100%{opacity:0;transform:translateY(-.9cqw)}}
@keyframes cl-act{0%,${e}%{background:rgba(var(--a-rgb),.16);border-color:rgba(var(--a-rgb),.6)}${g}%,100%{background:rgba(255,255,255,.04);border-color:rgba(255,255,255,.1)}}
@keyframes cl-dot{0%,${e}%{background:var(--a);border-color:var(--a);transform:scale(1.12)}${g}%,100%{background:rgba(255,255,255,.07);border-color:rgba(255,255,255,.2);transform:scale(1)}}`,
    };
  },
  'logo-marquee'(d) {
    const logos = d.LOGOS || [];
    const rows = [[], [], []];
    logos.forEach((l, i) => rows[i % 3].push(typeof l === 'string' ? { src: l, name: '' } : l));
    // make sure every row has at least 3 items so the loop is wide enough
    rows.forEach((r, i) => { let k = 0; while (r.length && r.length < 4) r.push(r[k++ % Math.max(1, r.length)]); if (!r.length && logos.length) r.push(...rows[0]); });
    return { ROW1: rows[0], ROW2: rows[1], ROW3: rows[2], COUNT: logos.length };
  },
  'social-orbit'(d) {
    const nets = (d.NETWORKS || []).slice(0, 6);
    const n = Math.max(1, nets.length);
    const a = (80 / n).toFixed(2), b = (110 / n).toFixed(2);
    return {
      NET_LIST: nets.map((x, i) => ({ ...x, a: (i * 360 / n).toFixed(1), k: i })),
      LIT_CYCLE: n * 2,
      RAW_KF: `@keyframes rd-lit{0%,${a}%{color:#fff;background:radial-gradient(120% 160% at 30% 0%,var(--a),var(--a-dk));border-color:rgba(255,255,255,.35);box-shadow:0 0 5cqw rgba(var(--a-rgb),.6),0 2cqw 4cqw rgba(0,0,0,.4)}${b}%,100%{color:#a8a8b0;background:linear-gradient(180deg,rgba(255,255,255,.09),rgba(255,255,255,.03));border-color:rgba(255,255,255,.14);box-shadow:0 2cqw 4cqw rgba(0,0,0,.4)}}`,
    };
  },
  'about-photo'(d) {
    const facts = d.FACTS && d.FACTS.length ? d.FACTS : ['Your headline fact', 'Where you studied or trained', 'A community you belong to', 'What you are exploring now'];
    const four = Array.from({ length: 4 }, (_, i) => facts[i % facts.length]);
    const out = { FACT_LIST: four.map((text, i) => ({ text, delay: i * 3 })) };
    if (!d.INITIALS) out.INITIALS = ((d.NAME_FIRST || 'Y')[0] + (d.NAME_LAST || 'N')[0]).toUpperCase();
    return out;
  },
  'role-pills'(d) {
    const rows = d.ROWS && d.ROWS.length ? d.ROWS : [[{ text: 'Designer', icon: 'pen' }, { text: 'Founder', icon: 'puzzle', lit: 0 }, { text: 'Developer', icon: 'spark' }], [{ text: 'Speaker', icon: 'mega', lit: 3 }, { text: 'Marketer', icon: 'target' }, { text: 'Builder', icon: 'bulb' }]];
    return { PILL_ROWS: rows.map((r, i) => ({ items: r.map((p) => ({ ...p, hasLit: p.lit !== undefined && p.lit !== null && p.lit !== '', lit: p.lit })) })) };
  },
  'business-tile'(d) {
    const dark = (d.THEME || 'light') === 'dark';
    const chips = (d.CHIPS && d.CHIPS.length ? d.CHIPS : ['Service one', 'Service two', 'Service three', 'Service four']).slice(0, 4);
    const marquee = d.MARQUEE && d.MARQUEE.length ? d.MARQUEE : ['Client one', 'Client two', 'Client three', 'Client four', 'Client five'];
    return {
      IS_DARK: dark,
      CHIP_LIST: chips.map((text, i) => ({ text, num: String(i + 1).padStart(2, '0'), delay: i * 2 })),
      MARQUEE_LIST: marquee,
      RAW_THEME: dark
        ? '--bg:#0a0a0c;--ink:#f2f2f5;--soft:#9a9aa6;--line:rgba(255,255,255,.12);--card:rgba(255,255,255,.06);--grid:rgba(255,255,255,.05);--sky1:rgba(var(--a-rgb),.35);--sky2:rgba(255,255,255,.06);--noise:1 1 1'
        : '--bg:#f9f9f9;--ink:#06163d;--soft:#4a5878;--line:rgba(6,22,61,.1);--card:rgba(255,255,255,.78);--grid:rgba(6,22,61,.05);--sky1:rgba(194,225,255,.95);--sky2:rgba(174,171,255,.6);--noise:.02 .09 .24',
      NOISE: dark ? '1 1 1' : '.02 .09 .24',
      NOISE_OPACITY: dark ? '.3' : '.16',
    };
  },
};

/* --------------------------------------------------------------- lint */
function lintBlock(html, file) {
  const errs = [];
  const warns = [];
  const style = (html.match(/<style[^>]*>([\s\S]*?)<\/style>/i) || [, ''])[1];
  const rootClass = (html.match(/<(?:div|a|section)\s+[^>]*class="([\w-]+)/) || [, ''])[1];
  if (!/html\s*,\s*body\s*\{[^}]*background\s*:/i.test(style)) errs.push('missing `html,body{margin:0;background:#0b0b0d}` (a slot taller than the block shows white)');
  if (/position\s*:\s*fixed/i.test(style)) errs.push('uses position:fixed (Kasbu sizes the frame to the in-flow content; fixed collapses it)');
  if (/%\s*\{\s*\}/.test(style)) errs.push('has an empty keyframe like `28%,100%{}` (the color fades back slowly instead of snapping; write explicit values)');
  if (!/container-type\s*:\s*inline-size/.test(style)) errs.push('root has no container-type:inline-size (cqw units need a container)');
  if (!/aspect-ratio\s*:/.test(style)) errs.push('no aspect-ratio (the frame height would collapse)');
  const firstRule = style.replace(/\/\*[\s\S]*?\*\//g, '').trim();
  if (/@import/.test(firstRule) && !/^@import/.test(firstRule)) errs.push('@import must be the first statement inside <style>');
  if (!/prefers-reduced-motion/.test(style)) warns.push('no prefers-reduced-motion rule');
  if (!/@keyframes/.test(style)) warns.push('no animation (Kasbu pages feel better with at least a subtle motion)');
  if (rootClass && !new RegExp('\\.' + rootClass + '[\\s{:.,>-]').test(style)) warns.push(`root class "${rootClass}" is not styled`);
  const kf = [...style.matchAll(/@keyframes\s+([\w-]+)/g)].map((m) => m[1]);
  if (rootClass && kf.some((k) => !k.startsWith(rootClass.slice(0, 2)))) warns.push('keyframe names should start with the block prefix to avoid collisions');
  if (/\{\{/.test(html)) errs.push('unresolved {{ }} tokens left in the output');
  const hosts = [...new Set([...html.matchAll(/\ssrc="(https?:\/\/[^"/]+)/g)].map((m) => m[1]))];
  if (hosts.length) warns.push('images loaded from other sites (they break if the source changes; upload them to a host you control): ' + hosts.join(', '));
  return { file, rootClass, style, errs, warns };
}
function crossLint(results) {
  const by = {};
  results.forEach((r) => { if (r.rootClass) (by[r.rootClass] = by[r.rootClass] || []).push(r); });
  const extra = [];
  Object.entries(by).forEach(([cls, list]) => {
    const css = new Set(list.map((r) => r.style.replace(/\s+/g, '')));
    if (css.size > 1) extra.push(`prefix "${cls}" is used by ${list.map((r) => r.file).join(', ')} with DIFFERENT css — styles will clash on the same page`);
  });
  return extra;
}

/* --------------------------------------------------------------- build */
function readJson(file) { return JSON.parse(fs.readFileSync(file, 'utf8')); }

function templateSource(name) {
  const tplFile = path.join(TEMPLATES, name + '.html');
  if (!fs.existsSync(tplFile)) throw new Error(`Unknown template "${name}"`);
  return fs.readFileSync(tplFile, 'utf8');
}
const basePrefix = (src) => (src.match(/class="([a-z]{2,3})["\s]/) || [, ''])[1];
// rename the css/html prefix of a template source: "st" -> "st2" (classes, keyframes, ids)
function renamePrefix(src, from, to) {
  return src.replace(new RegExp('(?<![\\w-])' + from + '(?=[-\\s{.:,>"\'\\[\\]()}#])', 'g'), to);
}
function renderBlock(spec, site, prefix) {
  let src = templateSource(spec.template);
  const p0 = basePrefix(src);
  if (prefix && p0 && prefix !== p0) src = renamePrefix(src, p0, prefix);
  const data = { ...(spec.data || {}) };
  const accent = data.ACCENT || (site.site && site.site.accent) || '#e8503f';
  data.RAW_ACCENT_VARS = accentVars(accent);
  data.ACCENT = accent;
  Object.assign(data, derive[spec.template] ? derive[spec.template](data) : {});
  return renderTemplate(src, data);
}
const cssOf = (html) => ((html.match(/<style[^>]*>([\s\S]*?)<\/style>/i) || [, ''])[1]).replace(/\s+/g, '');
// Two blocks that share a prefix must have identical css. If their data changes the css
// (different counter, theme, number of quotes...) give the second one its own prefix (st2, st3...).
function renderUnique(spec, site, registry) {
  const base = basePrefix(templateSource(spec.template));
  for (let n = 1; n < 50; n++) {
    const pref = n === 1 ? base : base + n;
    const html = renderBlock(spec, site, pref);
    const sig = cssOf(html);
    if (!(pref in registry)) { registry[pref] = sig; return html; }
    if (registry[pref] === sig) return html;
  }
  throw new Error('Too many variants for ' + spec.template);
}

function cell(spec, blocks, mobile) {
  const pos = `grid-column:${spec.col}/span ${spec.w};grid-row:${spec.row}/span ${spec.h}`;
  if (spec.native) return `<div class="n" style="${pos}">${esc(spec.native)}</div>`;
  const html = blocks[spec.id];
  if (!html) return `<div class="n" style="${pos}">missing: ${esc(spec.id)}</div>`;
  return `<div class="c${mobile ? ' m' : ''}" style="${pos}" title="${esc(spec.id)}">${html}</div>`;
}

function previewHtml(site, blocks) {
  const L = site.layout || {};
  const desk = (L.desktop || []).map((s) => cell(s, blocks, false)).join('\n');
  const mob = (L.mobile || []).map((s) => cell(s, blocks, true)).join('\n');
  const name = esc((site.site && site.site.name) || 'Kasbu preview');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${name} · preview</title>
<style>
body{margin:0;background:#000;padding:32px;font-family:Inter,system-ui,sans-serif;color:#777}
h2{font:500 12px/1 monospace;letter-spacing:.06em;text-transform:uppercase;margin:26px auto 14px}
.wrap{width:max-content;margin:0 auto}
.g{display:grid;gap:36px;width:max-content}
.g.d{grid-template-columns:repeat(8,78px);grid-auto-rows:78px}
.g.m{grid-template-columns:repeat(4,78px);grid-auto-rows:78px;gap:12px}
.c{border-radius:24px;overflow:hidden;border:1px solid #2a2a2c;background:#111;min-width:0;min-height:0}
.c.m{border-radius:18px}
.n{border-radius:24px;border:1px dashed #3a3a3e;background:#0f0f10;color:#7a7a80;font-size:11px;display:flex;align-items:center;justify-content:center;text-align:center;padding:8px;line-height:1.3}
.legend{font:11px/1.5 monospace;max-width:876px;margin:0 auto 6px}
</style></head><body>
<p class="legend">Dashed = native Kasbu tiles (not code blocks). Desktop grid: 8 columns × 78 px, 36 px gaps. Mobile grid: 4 columns × 78 px, 12 px gaps. A tile of 3 units is 306 px wide on desktop and 258 px on mobile.</p>
<div class="wrap"><h2>Desktop</h2><div class="g d">
${desk}
</div></div>
<div class="wrap"><h2>Mobile (4 columns, ~350 px)</h2><div class="g m">
${mob}
</div></div>
</body></html>`;
}

function build(siteFile, outDir) {
  const site = readJson(siteFile);
  const out = path.resolve(outDir || path.join(path.dirname(siteFile), 'out'));
  fs.mkdirSync(path.join(out, 'blocks'), { recursive: true });
  const blocks = {};
  const results = [];
  const registry = {};
  for (const spec of site.blocks || []) {
    const html = spec.file ? fs.readFileSync(path.resolve(path.dirname(siteFile), spec.file), 'utf8') : renderUnique(spec, site, registry);
    blocks[spec.id] = html;
    fs.writeFileSync(path.join(out, 'blocks', spec.id + '.html'), html);
    results.push(lintBlock(html, spec.id + '.html'));
  }
  fs.writeFileSync(path.join(out, 'preview.html'), previewHtml(site, blocks));
  report(results);
  console.log(`\nRendered ${results.length} blocks → ${path.join(out, 'blocks')}\nPreview → ${path.join(out, 'preview.html')}`);
  return results.some((r) => r.errs.length) || crossLint(results).length ? 1 : 0;
}

function report(results) {
  let bad = 0;
  results.forEach((r) => {
    if (!r.errs.length && !r.warns.length) return;
    console.log(`\n${r.file}`);
    r.errs.forEach((e) => { bad++; console.log('  ✗ ' + e); });
    r.warns.forEach((w) => console.log('  ! ' + w));
  });
  crossLint(results).forEach((e) => { bad++; console.log('\n✗ ' + e); });
  console.log(bad ? `\nLint: ${bad} error(s)` : '\nLint: OK (no errors)');
}

function lint(targets) {
  const files = [];
  targets.forEach((t) => {
    const st = fs.statSync(t);
    if (st.isDirectory()) fs.readdirSync(t).filter((f) => f.endsWith('.html')).forEach((f) => files.push(path.join(t, f)));
    else files.push(t);
  });
  const results = files.map((f) => lintBlock(fs.readFileSync(f, 'utf8'), path.basename(f)));
  report(results);
  return results.some((r) => r.errs.length) ? 1 : 0;
}

/* ---------------------------------------------------------------- serve */
// Tiny static server so the preview can be opened over http://localhost (some embedded browsers
// refuse big file:// pages). Usage: node scripts/kasbu.js serve out [port]
function serve(dir, port) {
  const http = require('http');
  const root = path.resolve(dir || 'out');
  const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml' };
  http.createServer((req, res) => {
    let p = decodeURIComponent((req.url || '/').split('?')[0]);
    if (p === '/') p = '/preview.html';
    const file = path.join(root, path.normalize(p));
    if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    fs.createReadStream(file).pipe(res);
  }).listen(port || 5173, '127.0.0.1', () => console.log(`Serving ${root} at http://localhost:${port || 5173}/preview.html  (Ctrl+C to stop)`));
}

/* ------------------------------------------------------------------ CLI */
const [cmd, ...rest] = process.argv.slice(2);
try {
  if (cmd === 'build' && rest[0]) {
    const oi = rest.indexOf('--out');
    process.exit(build(rest[0], oi >= 0 ? rest[oi + 1] : undefined));
  } else if (cmd === 'lint' && rest.length) {
    process.exit(lint(rest));
  } else if (cmd === 'serve') {
    serve(rest[0], rest[1] ? parseInt(rest[1], 10) : 5173);
  } else {
    console.log('Usage:\n  node scripts/kasbu.js build site.json [--out out]\n  node scripts/kasbu.js lint <dir|file> [...]\n  node scripts/kasbu.js serve [out] [port]');
    process.exit(2);
  }
} catch (e) {
  console.error('Error: ' + e.message);
  process.exit(2);
}
