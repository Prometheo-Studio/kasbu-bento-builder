// Generates the hand-written "light editorial" blocks into ./src (run: node gen-editorial.js)
const fs = require('fs'), path = require('path');
const P = path.join(__dirname, '..', '..', 'templates', 'partials');
const grainInk = (p) => fs.readFileSync(path.join(P, 'noise-ink.css'), 'utf8').replace(/__P__/g, p);
const grainLight = (p) => fs.readFileSync(path.join(P, 'noise.css'), 'utf8').replace(/__P__/g, p);
const PAPER = '#f3eee4', INK = '#16140f', AC = '#5b3df5';
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap');`;
const VARS = `--p:${PAPER};--i:${INK};--ac:${AC};--m:rgba(22,20,15,.56);--l:rgba(22,20,15,.16)`;
const SERIF = `'Instrument Serif',Georgia,serif`, SANS = `'Inter',system-ui,sans-serif`, MONO = `'JetBrains Mono',ui-monospace,monospace`;
fs.mkdirSync(path.join(__dirname, 'src'), { recursive: true });
const out = (name, html) => fs.writeFileSync(path.join(__dirname, 'src', name + '.html'), html);
const base = (p, ratio, dark) => `${FONTS}
html,body{margin:0;background:${dark ? INK : PAPER}}
.${p}{${VARS};container-type:inline-size;position:relative;display:block;width:100%;height:100%;aspect-ratio:${ratio};overflow:hidden;isolation:isolate;border-radius:inherit;background:${dark ? INK : PAPER};color:${dark ? PAPER : INK};font-family:${SANS}}
.${p} *{box-sizing:border-box;margin:0}
${dark ? grainLight(p) : grainInk(p)}
@media (prefers-reduced-motion:reduce){.${p} *,.${p}::after{animation:none!important}}`;

// ---------- stat tiles (1x1) ----------
[['sa', 15, 'templates'], ['sb', 8, 'guides'], ['sc', 2, 'views'], ['sd', 4, 'phases']].forEach(([p, n, label]) => {
  const reel = Array.from({ length: n + 1 }, (_, i) => `<span>${i}</span>`).join('');
  out('stat-' + label, `<!-- Block: editorial stat tile · 1×1 · counter climbs to ${n} -->
<div class="${p}" role="img" aria-label="${n} ${label}">
<style>
${base(p, '1/1')}
.${p}-n{position:absolute;left:0;right:0;top:46%;transform:translateY(-52%);display:flex;justify-content:center;font:400 44cqw/1 ${SERIF};letter-spacing:-.04em}
.${p}-w{height:1em;overflow:hidden}
.${p}-r{display:flex;flex-direction:column;animation:${p}-r 6s infinite}
.${p}-r span{display:block;height:1em;line-height:1;text-align:center}
.${p}-n i{font-style:italic;color:var(--ac);font-size:.5em;margin-top:.1em;opacity:0;animation:${p}-p 6s infinite}
.${p}-l{position:absolute;left:0;right:0;bottom:9cqw;text-align:center;font:500 8.4cqw/1 ${MONO};letter-spacing:.14em;text-transform:uppercase;color:var(--m);text-indent:.14em}
.${p}-ln{position:absolute;left:12cqw;right:12cqw;bottom:21cqw;height:.7cqw;background:var(--l);overflow:hidden}
.${p}-ln b{position:absolute;inset:0;background:var(--ac);transform-origin:0 50%;animation:${p}-f 6s infinite}
@keyframes ${p}-r{0%{transform:translateY(0);animation-timing-function:steps(${n})}33.33%{transform:translateY(-${n}em)}86%{transform:translateY(-${n}em)}93%,100%{transform:translateY(0)}}
@keyframes ${p}-p{0%,32%{opacity:0}37%{opacity:1}86%{opacity:1}93%,100%{opacity:0}}
@keyframes ${p}-f{0%{transform:scaleX(0);animation-timing-function:steps(${n})}33.33%{transform:scaleX(1)}86%{transform:scaleX(1)}93%,100%{transform:scaleX(0)}}
@media (prefers-reduced-motion:reduce){.${p}-r{transform:translateY(-${n}em)}.${p}-n i{opacity:1}.${p}-ln b{transform:none}}
</style>
<div class="${p}-n" aria-hidden="true"><div class="${p}-w"><div class="${p}-r">${reel}</div></div><i>+</i></div>
<div class="${p}-ln" aria-hidden="true"><b></b></div>
<span class="${p}-l" aria-hidden="true">${label}</span>
</div>`);
});

// ---------- hero (3x2 desktop / 4x2 phone) ----------
out('hero', `<!-- Block: editorial hero · desktop 3×2 · phone 4×2 (switches at slot width ≥ 315px) -->
<div class="hx" role="group" aria-label="Bento Builder, a Claude skill for Kasbu">
<style>
${FONTS}
html,body{margin:0;background:${PAPER}}
.hx{${VARS};container-type:inline-size;display:block;width:100%;border-radius:inherit;background:${PAPER};color:${INK};font-family:${SANS}}
.hx *{box-sizing:border-box;margin:0}
.hx-in{position:relative;width:100%;aspect-ratio:307/193;overflow:hidden;isolation:isolate;border-radius:inherit}
${grainInk('hx-in')}
.hx-tag{position:absolute;left:6cqw;top:6cqw;font:500 3.3cqw/1 ${MONO};letter-spacing:.14em;text-transform:uppercase;color:var(--m);display:flex;align-items:center;gap:2cqw}
.hx-tag b{width:2.2cqw;height:2.2cqw;border-radius:50%;background:var(--ac);animation:hx-pu 2.4s infinite}
.hx-t{position:absolute;left:6cqw;top:17cqw;font:400 17cqw/.92 ${SERIF};letter-spacing:-.035em;animation:hx-up .9s cubic-bezier(.2,.8,.2,1) both}
.hx-t span{display:block}.hx-t em{color:var(--ac)}
.hx-v{position:absolute;left:6cqw;right:6cqw;bottom:6cqw;display:flex;justify-content:space-between;border-top:1px solid var(--l);padding-top:3cqw;font:500 3.6cqw/1 ${MONO};letter-spacing:.06em;text-transform:uppercase}
.hx-v span{opacity:.35;background:linear-gradient(var(--ac),var(--ac)) 0 100%/0 .5cqw no-repeat;padding-bottom:1cqw;animation:hx-l 8s infinite}
.hx-v span:nth-child(2){animation-delay:2s}.hx-v span:nth-child(3){animation-delay:4s}.hx-v span:nth-child(4){animation-delay:6s}
@keyframes hx-l{0%,22%{opacity:1;background-size:100% .5cqw}26%,100%{opacity:.35;background-size:0 .5cqw}}
@keyframes hx-pu{0%{box-shadow:0 0 0 0 rgba(91,61,245,.55)}70%,100%{box-shadow:0 0 0 2.6cqw rgba(91,61,245,0)}}
@keyframes hx-up{0%{opacity:0;transform:translateY(3cqw)}100%{opacity:1;transform:translateY(0)}}
@container (min-width:315px){
.hx-in{aspect-ratio:21/10}
.hx-tag{font-size:3.2cqw;left:5cqw;top:5cqw}
.hx-t{font-size:13cqw;top:14cqw;left:5cqw;white-space:nowrap}
.hx-t span{display:inline}
.hx-v{left:5cqw;right:5cqw;bottom:5cqw;font-size:3.1cqw}
}
@media (prefers-reduced-motion:reduce){.hx *,.hx-in::after{animation:none!important}.hx-v span:first-child{opacity:1;background-size:100% .5cqw}}
</style>
<div class="hx-in">
<div class="hx-tag"><b></b>claude skill · for kasbu</div>
<h3 class="hx-t"><span>Bento</span> <span><em>Builder</em></span></h3>
<div class="hx-v" aria-hidden="true"><span>Interviews</span><span>Plans</span><span>Builds</span><span>Previews</span></div>
</div>
</div>`);

// ---------- two views illustration (3x3) ----------
const cells = (list) => list.map(([c, r, w, h], i) => `<i style="grid-column:${c}/span ${w};grid-row:${r}/span ${h};--k:${i}"></i>`).join('');
const desk = [[1,1,1,1],[2,1,1,1],[3,1,1,1],[1,2,3,2],[4,1,3,3],[7,1,2,3],[1,4,3,2],[4,4,2,2],[6,4,3,2]];
const phone = [[1,1,1,1],[2,1,1,1],[3,1,1,1],[4,1,1,1],[1,2,4,2],[1,4,2,3],[3,4,2,3]];
out('views', `<!-- Block: editorial two-views illustration · 3×3 / 4×4 -->
<div class="vw" role="img" aria-label="One build, two layouts: 8-column desktop and 4-column phone">
<style>
${base('vw', '1/1')}
.vw-h{position:absolute;left:7cqw;top:7cqw;right:7cqw;font:400 10.5cqw/1 ${SERIF};letter-spacing:-.02em}
.vw-h em{color:var(--ac)}
.vw-d{position:absolute;left:7cqw;top:31cqw;width:64cqw;aspect-ratio:8/5.1;padding:2cqw;border:1px solid var(--l);border-radius:2.4cqw;background:#fbf8f2;display:grid;grid-template-columns:repeat(8,1fr);grid-template-rows:repeat(5,1fr);gap:1.1cqw;animation:vw-fl 7s ease-in-out infinite}
.vw-p{position:absolute;right:6cqw;top:41cqw;width:25cqw;aspect-ratio:9/16;padding:2.4cqw;border:1px solid var(--i);border-radius:4cqw;background:var(--p);display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:repeat(6,1fr);gap:1cqw;box-shadow:0 4cqw 8cqw rgba(22,20,15,.16);animation:vw-fl 7s ease-in-out -3.5s infinite}
.vw-d i,.vw-p i{display:block;border-radius:.9cqw;background:rgba(22,20,15,.08);animation:vw-c 6s infinite;animation-delay:calc(var(--k) * .4s)}
.vw-lb{position:absolute;bottom:7cqw;font:500 3.3cqw/1.2 ${MONO};letter-spacing:.1em;text-transform:uppercase;color:var(--m)}
.vw-lb b{color:var(--i);font-weight:500}
@keyframes vw-c{0%{background:rgba(22,20,15,.08)}6%{background:var(--ac)}16%,100%{background:rgba(22,20,15,.08)}}
@keyframes vw-fl{0%{transform:translateY(0)}50%{transform:translateY(-1.6cqw)}100%{transform:translateY(0)}}
@media (prefers-reduced-motion:reduce){.vw-d i,.vw-p i{background:rgba(91,61,245,.22)}}
</style>
<h3 class="vw-h">One build,<br><em>two layouts.</em></h3>
<div class="vw-d" aria-hidden="true">${cells(desk)}</div>
<div class="vw-p" aria-hidden="true">${cells(phone)}</div>
<div class="vw-lb" style="left:7cqw"><b>Desktop</b> · 8 columns</div>
<div class="vw-lb" style="right:6cqw"><b>Phone</b> · 4</div>
</div>`);

// ---------- dark checklist tile (3x3) ----------
const steps = ['Interview you', 'Plan the grid', 'Build the blocks', 'Preview both views'];
out('manifesto', `<!-- Block: editorial dark checklist · 3×3 / 4×4 -->
<div class="mf" role="group" aria-label="Describe it. Claude builds it.">
<style>
${base('mf', '1/1', true)}
.mf-t{position:absolute;left:8cqw;top:8cqw;right:8cqw;font:400 15cqw/.96 ${SERIF};letter-spacing:-.03em}
.mf-t em{color:#a99bff}
.mf-l{position:absolute;left:8cqw;right:8cqw;bottom:8cqw;list-style:none;padding:0}
.mf-l li{display:flex;align-items:center;gap:4cqw;padding:3.2cqw 0;border-top:1px solid rgba(243,238,228,.16);font:500 4.1cqw/1 ${MONO};letter-spacing:.06em;text-transform:uppercase}
.mf-l b{position:relative;width:5.2cqw;height:5.2cqw;border:1px solid rgba(243,238,228,.5);border-radius:1.2cqw;flex:none}
.mf-l b::after{content:"";position:absolute;inset:.9cqw;border-radius:.5cqw;background:#a99bff;transform:scale(0);animation:mf-k 8s infinite;animation-delay:calc(var(--d) * 1.6s)}
@keyframes mf-k{0%{transform:scale(0)}5%,86%{transform:scale(1)}92%,100%{transform:scale(0)}}
@media (prefers-reduced-motion:reduce){.mf-l b::after{transform:scale(1)}}
</style>
<h3 class="mf-t">Describe it.<br><em>Claude builds it.</em></h3>
<ul class="mf-l">${steps.map((s, i) => `<li style="--d:${i}"><b></b>${s}</li>`).join('')}</ul>
</div>`);

// ---------- CTA (2x3) ----------
out('cta', `<!-- Block: editorial CTA · 2×3 · accent tile with a pulsing button. Set the href below -->
<div class="ct" role="group" aria-label="Get the skill">
<style>
${base('ct', '5/8')}
.ct{background:${AC};color:${PAPER}}
.ct::before{content:"";position:absolute;width:120cqw;height:120cqw;left:-30cqw;bottom:-60cqw;border-radius:50%;border:1px solid rgba(243,238,228,.28);box-shadow:0 0 0 10cqw rgba(243,238,228,.05),0 0 0 22cqw rgba(243,238,228,.04)}
.ct-t{position:absolute;left:8cqw;right:6cqw;top:9cqw;font:400 15.5cqw/.98 ${SERIF};letter-spacing:-.03em}
.ct-t em{display:block}
.ct-s{position:absolute;left:8cqw;right:8cqw;top:62cqw;font:400 5.6cqw/1.45 ${SANS};color:rgba(243,238,228,.78)}
.ct-b{position:absolute;left:8cqw;right:8cqw;bottom:9cqw;height:17cqw;border-radius:99px;background:${PAPER};color:${INK};display:flex;align-items:center;justify-content:center;gap:3cqw;font:500 5.4cqw/1 ${SANS};text-decoration:none;animation:ct-p 2.2s infinite}
.ct-b:hover{transform:scale(1.03)}
.ct-b i{font-style:normal;display:inline-block;transition:transform .2s}
.ct-b:hover i{transform:translateX(1.2cqw)}
@keyframes ct-p{0%{box-shadow:0 0 0 0 rgba(243,238,228,.7),0 0 0 0 rgba(243,238,228,.4)}100%{box-shadow:0 0 0 6cqw rgba(243,238,228,0),0 0 0 12cqw rgba(243,238,228,0)}}
</style>
<h3 class="ct-t">Your Kasbu,<em>in code.</em></h3>
<p class="ct-s">Got a Kasbu page? Make it move.</p>
<a class="ct-b" href="#" target="_blank" rel="noopener">Get the skill <i>→</i></a>
</div>`);

// ---------- marquee of templates (3x2 / 4x2) ----------
const names = ['Stat counter', 'Profile card', 'About photo', 'Role pills', 'Event badge', 'Project card', 'Logo marquee', 'CTA pulse', 'Social orbit', 'Business tile', 'Testimonials', 'Quote card', 'Timeline', 'Link list', 'Status tile'];
const set = (arr) => arr.map((s) => `<span>${s}</span>`).join('');
const row1 = names.slice(0, 8), row2 = names.slice(8);
out('catalog', `<!-- Block: editorial template marquee · desktop 3×2 · phone 4×2 -->
<div class="cg" role="group" aria-label="Fifteen ready-made block templates">
<style>
${FONTS}
html,body{margin:0;background:${PAPER}}
.cg{${VARS};container-type:inline-size;display:block;width:100%;border-radius:inherit;background:${PAPER};color:${INK};font-family:${SANS}}
.cg *{box-sizing:border-box;margin:0}
.cg-in{position:relative;width:100%;aspect-ratio:307/193;overflow:hidden;isolation:isolate;border-radius:inherit;display:flex;flex-direction:column;justify-content:center;gap:3.2cqw}
${grainInk('cg-in')}
.cg-h{padding:0 6cqw;font:400 10cqw/1 ${SERIF};letter-spacing:-.02em}
.cg-h em{color:var(--ac)}
.cg-k{padding:0 6cqw;font:500 3.2cqw/1 ${MONO};letter-spacing:.14em;text-transform:uppercase;color:var(--m)}
.cg-r{display:flex;overflow:hidden;-webkit-mask-image:linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent);mask-image:linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent)}
.cg-r div{display:flex;flex:none;gap:2.4cqw;padding-right:2.4cqw;animation:cg-a 26s linear infinite}
.cg-r.b div{animation-name:cg-b;animation-duration:30s}
.cg-r span{flex:none;padding:2.2cqw 4cqw;border:1px solid var(--l);border-radius:99px;font:500 4.2cqw/1 ${SANS};background:#fbf8f2}
.cg-r span:nth-child(3n){background:var(--i);color:var(--p);border-color:var(--i)}
@keyframes cg-a{0%{transform:translateX(0)}100%{transform:translateX(-100%)}}
@keyframes cg-b{0%{transform:translateX(-100%)}100%{transform:translateX(0)}}
@container (min-width:315px){.cg-in{aspect-ratio:21/10;gap:2.6cqw}.cg-h{font-size:8cqw}.cg-r span{font-size:3.6cqw;padding:1.8cqw 3.4cqw}}
@media (prefers-reduced-motion:reduce){.cg *,.cg-in::after{animation:none!important}}
</style>
<div class="cg-in">
<div class="cg-k">[ 15 templates ]</div>
<h3 class="cg-h">Blocks, <em>ready to paste.</em></h3>
<div class="cg-r" aria-hidden="true"><div>${set(row1)}${set(row1)}</div><div>${set(row1)}${set(row1)}</div></div>
<div class="cg-r b" aria-hidden="true"><div>${set(row2)}${set(row2)}${set(row2)}</div><div>${set(row2)}${set(row2)}${set(row2)}</div></div>
</div>
</div>`);

// ---------- phase cards (2x3) ----------
const phases = [
  ['pa', '01', 'Discover', 'A short interview, plus your sites and past chats, only with your OK.', ['Interview', 'Sources']],
  ['pb', '02', 'Plan', 'Sizes for the 8-column desktop grid and the 4-column phone grid.', ['Desktop', 'Phone']],
  ['pc', '03', 'Build', 'Animated blocks from 15 templates, one accent color, linted.', ['Templates', 'Lint']],
  ['pd', '04', 'Preview', 'See both views side by side, then copy the code block by block.', ['Browser', 'Artifact']],
];
phases.forEach(([p, num, name, desc, tags], i) => out('phase-' + name.toLowerCase(), `<!-- Block: editorial phase card · 2×3 -->
<div class="${p}" role="group" aria-label="Phase ${num}: ${name}">
<style>
${base(p, '5/8')}
.${p}-k{position:absolute;left:8cqw;right:8cqw;top:8cqw;display:flex;justify-content:space-between;font:500 5.2cqw/1 ${MONO};letter-spacing:.12em;text-transform:uppercase;color:var(--m)}
.${p}-n{position:absolute;left:6cqw;top:20cqw;font:400 52cqw/.9 ${SERIF};letter-spacing:-.05em;color:transparent;-webkit-text-stroke:.5cqw var(--i);animation:${p}-lit 8s infinite;animation-delay:${i * 2}s}
.${p}-t{position:absolute;left:8cqw;right:6cqw;top:80cqw;font:400 14cqw/1 ${SERIF};letter-spacing:-.03em}
.${p}-d{position:absolute;left:8cqw;right:8cqw;top:98cqw;font:400 5.3cqw/1.45 ${SANS};color:var(--m)}
.${p}-g{position:absolute;left:8cqw;right:8cqw;bottom:8cqw;display:flex;gap:2.4cqw}
.${p}-g span{padding:2cqw 3.6cqw;border:1px solid var(--l);border-radius:99px;font:500 4.2cqw/1 ${MONO};letter-spacing:.06em;text-transform:uppercase}
.${p}-b{position:absolute;left:8cqw;right:8cqw;bottom:22cqw;height:.8cqw;background:var(--l);overflow:hidden}
.${p}-b i{position:absolute;inset:0;background:var(--ac);transform-origin:0 50%;transform:scaleX(0);animation:${p}-bar 8s infinite;animation-delay:${i * 2}s}
@keyframes ${p}-lit{0%,22%{color:var(--ac);-webkit-text-stroke-color:var(--ac)}26%,100%{color:transparent;-webkit-text-stroke-color:${INK}}}
@keyframes ${p}-bar{0%{transform:scaleX(0)}22%{transform:scaleX(1)}26%,100%{transform:scaleX(0)}}
@media (prefers-reduced-motion:reduce){.${p}-b i{transform:scaleX(1)}}
</style>
<div class="${p}-k"><span>phase</span><span>${num} / 04</span></div>
<div class="${p}-n" aria-hidden="true">${num}</div>
<h3 class="${p}-t">${name}</h3>
<p class="${p}-d">${desc}</p>
<div class="${p}-b" aria-hidden="true"><i></i></div>
<div class="${p}-g">${tags.map((t) => `<span>${t}</span>`).join('')}</div>
</div>`));

// ---------- socials soon (2x3) ----------
out('soon', `<!-- Block: editorial "links soon" · 2×3. Replace the three rows with <a href> links when you have them -->
<div class="sk" role="group" aria-label="Links coming soon">
<style>
${base('sk', '5/8')}
.sk-k{position:absolute;left:8cqw;top:8cqw;font:500 5cqw/1 ${MONO};letter-spacing:.12em;text-transform:uppercase;color:var(--m);display:flex;gap:3cqw;align-items:center}
.sk-k b{padding:1.6cqw 3cqw;border-radius:99px;background:var(--ac);color:var(--p);font-weight:500;animation:sk-p 2.4s infinite}
.sk-t{position:absolute;left:8cqw;right:6cqw;top:24cqw;font:400 17cqw/.96 ${SERIF};letter-spacing:-.035em}
.sk-t em{color:var(--ac);display:block}
.sk-l{position:absolute;left:8cqw;right:8cqw;bottom:8cqw;list-style:none;padding:0}
.sk-l li{position:relative;overflow:hidden;display:flex;justify-content:space-between;padding:4cqw 0;border-top:1px solid var(--l);font:500 5cqw/1 ${MONO};letter-spacing:.06em;text-transform:uppercase;color:var(--m)}
.sk-l li::after{content:"";position:absolute;top:0;bottom:0;width:30%;left:-40%;background:linear-gradient(90deg,transparent,rgba(91,61,245,.14),transparent);animation:sk-s 3.6s ease-in-out infinite;animation-delay:calc(var(--d) * .5s)}
@keyframes sk-s{0%,30%{transform:translateX(0)}80%,100%{transform:translateX(480%)}}
@keyframes sk-p{0%{box-shadow:0 0 0 0 rgba(91,61,245,.5)}70%,100%{box-shadow:0 0 0 3cqw rgba(91,61,245,0)}}
</style>
<div class="sk-k">[ links ] <b>soon</b></div>
<h3 class="sk-t">Find it,<em>soon.</em></h3>
<ul class="sk-l"><li style="--d:0"><span>GitHub</span><span>↗</span></li><li style="--d:1"><span>Web</span><span>↗</span></li><li style="--d:2"><span>Mail</span><span>↗</span></li></ul>
</div>`);

// ---------- ticker strip (3x1) ----------
const words = ['Interview', 'Plan', 'Build', 'Preview', 'Deliver'];
const run = words.map((w) => '<span>' + w + '</span><b></b>').join('');
out('strip', `<!-- Block: editorial ticker strip · 3×1 -->
<div class="tk" role="img" aria-label="Interview, plan, build, preview, deliver">
<style>
${base('tk', '306/78')}
.tk-m{position:absolute;inset:0;display:flex;align-items:center;overflow:hidden;-webkit-mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent);mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)}
.tk-m div{display:flex;flex:none;align-items:center;gap:6cqw;padding-right:6cqw;animation:tk-a 18s linear infinite}
.tk-m span{font:italic 400 15cqw/1 ${SERIF};letter-spacing:-.03em;white-space:nowrap}
.tk-m div span:nth-child(even){font-style:normal;color:var(--ac)}
.tk-m b{flex:none;width:2.4cqw;height:2.4cqw;border-radius:50%;background:var(--i)}
@keyframes tk-a{0%{transform:translateX(0)}100%{transform:translateX(-100%)}}
</style>
<div class="tk-m" aria-hidden="true"><div>${run}${run}</div><div>${run}${run}</div></div>
</div>`);
console.log('ok');
