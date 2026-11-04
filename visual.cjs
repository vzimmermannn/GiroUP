#!/usr/bin/env node
/*
  GiroUP — aplica a reformulação visual nos arquivos app.js, giro-ui.js e index.html.

  Uso (na pasta do projeto, onde ficam index.html e app.js):
    node aplicar-visual.cjs
  Para a cópia dentro de app/src/main/assets (se existir):
    node aplicar-visual.cjs app/src/main/assets

  - Só troca textos de aparência (ícones, cores do gráfico, tema). Nenhuma função,
    cálculo, rota ou chamada de API é alterada.
  - Faz backup de cada arquivo alterado como <arquivo>.bak-visual.
  - Cada mudança é verificada: se o trecho esperado não for encontrado, o script
    avisa e NÃO altera aquele ponto.
  - Pode ser executado mais de uma vez: mudanças já aplicadas são ignoradas.
*/
const fs = require('fs'), path = require('path');

/* Ícones Lucide (lucide.dev, licença ISC), mesmo traço e tamanho para todos. */
const ICONS = {
  home: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  wallet: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
  calc: '<rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/>',
  future: '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
  more: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  back: '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
  up: '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
  down: '<path d="M17 7 7 17"/><path d="M17 17H7V7"/>',
  spark: '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  close: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  eye: '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  box: '<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><polyline points="3.29 7 12 12 20.71 7"/><path d="m7.5 4.27 9 5.15"/>',
  book: '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
  settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
  shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  warn: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  send: '<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>',
  edit: '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>',
  download: '<path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  brief: '<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/>',
  scan: '<path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M7 12h10"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
  moon: '<path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/>',
  monitor: '<rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/>'
};
const NEW_ICONS =
  'const paths={' + Object.entries(ICONS).map(([k, v]) => k + ":'" + v + "'").join(',') + '};\n' +
  "const icon=n=>'<svg class=\"icon\" viewBox=\"0 0 24 24\" aria-hidden=\"true\">'+(paths[n]||paths.brief)+'</svg>';";

/* Gráfico: sem gradiente e usando as cores do tema (var(--accent), var(--line)...). */
const NEW_CHART = String.raw`return '<svg class="chart" viewBox="0 0 520 160" preserveAspectRatio="none" role="img" aria-label="Saldo previsto de '+esc(money(values[0]))+' para '+esc(money(values.at(-1)))+'"><path d="M10 40H510M10 90H510M10 140H510" fill="none" style="stroke:var(--line)"/><line x1="10" y1="'+y(0)+'" x2="510" y2="'+y(0)+'" stroke-dasharray="4 4" style="stroke:var(--muted)"/><polygon points="10,155 '+points+' 510,155" style="fill:var(--accent);fill-opacity:.1"/><polyline points="'+points+'" fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="stroke:var(--accent)"/><circle cx="510" cy="'+y(values.at(-1))+'" r="4" style="fill:var(--accent)"/></svg><div class="chartlabels"><span>Hoje</span><span>Próximos '+horizon+' dias</span><span>'+dateLabel(f.until)+'</span></div>';`;

const report = [];
function once(text, find, repl, label) {
  const n = text.split(find).length - 1;
  if (n === 1) { report.push('  ok   ' + label); return text.replace(find, () => repl); }
  if (n === 0 && text.includes(repl)) { report.push('  --   ' + label + ' (já aplicado)'); return text; }
  report.push('  ERRO ' + label + ' — trecho encontrado ' + n + ' vez(es); nada foi alterado neste ponto');
  return text;
}
function regex(text, re, repl, label, doneMarker) {
  if (doneMarker && text.includes(doneMarker)) { report.push('  --   ' + label + ' (já aplicado)'); return text; }
  if (re.test(text)) { report.push('  ok   ' + label); return text.replace(re, () => repl); }
  report.push('  ERRO ' + label + ' — trecho não encontrado; nada foi alterado neste ponto');
  return text;
}
function edit(dir, name, fn) {
  const file = path.join(dir, name);
  if (!fs.existsSync(file)) { console.log('\n' + file + '\n  (não encontrado, ignorado)'); return; }
  report.length = 0;
  const original = fs.readFileSync(file, 'utf8');
  const next = fn(original);
  console.log('\n' + file);
  console.log(report.join('\n'));
  if (next !== original) {
    const bak = file + '.bak-visual';
    if (!fs.existsSync(bak)) fs.writeFileSync(bak, original);
    fs.writeFileSync(file, next);
    console.log('  salvo (backup: ' + path.basename(bak) + ')');
  }
}

const dirs = process.argv.slice(2);
if (!dirs.length) dirs.push('.');
for (const dir of dirs) {
  edit(dir, 'app.js', t => {
    t = regex(t, /const paths=\{[^\r\n]*\};\s*const icon=n=>[^\r\n]*;/, NEW_ICONS, 'Ícones: biblioteca única (Lucide)', "const paths={home:'<path");
    t = regex(t, /return '<svg class="chart"[^\r\n]*/, NEW_CHART, 'Gráfico: cores do tema, sem gradiente', 'style="stroke:var(--accent)"');
    t = once(t, '<span class="eyebrow" style="color:#cbb4ff">Cada custo conta.</span>', '<span class="eyebrow">Cada custo conta.</span>', 'Cartão de resultado: rótulo');
    t = once(t, 'class="caption" style="color:#c6b5e5;margin-top:14px"', 'class="caption" style="color:#c3cee3;margin-top:14px"', 'Cartão de resultado: nota');
    t = once(t, '<span class="eyebrow" style="font-size:9px">Clareza que vira decisão</span>', '<span class="eyebrow">Clareza que vira decisão</span>', 'Dica da tela inicial: rótulo');
    t = once(t, '<span class="sectionlabel" style="padding-left:16px">', '<span class="sectionlabel" style="padding-left:12px">', 'Menu lateral: alinhamento');
    return t;
  });
  edit(dir, 'giro-ui.js', t => {
    if (/^paths\.scan='[^'\r\n]*';\r?\n/m.test(t)) { t = t.replace(/^paths\.scan='[^'\r\n]*';\r?\n/m, ''); report.push('  ok   Remove ícone antigo de digitalizar (o novo fica em app.js)'); }
    else report.push('  --   Ícone antigo de digitalizar (já removido ou inexistente)');
    t = once(t, "[['light','☀','Tema claro'],['dark','☾','Tema escuro'],['system','◐','Seguir o aparelho']]", "[['light','sun','Tema claro'],['dark','moon','Tema escuro'],['system','monitor','Seguir o aparelho']]", 'Menu de tema: ícones no lugar de símbolos');
    t = once(t, "<span>'+i+'</span>'+l+", "<span>'+icon(i)+'</span>'+l+", 'Menu de tema: usa a função de ícones');
    t = once(t, 'border-radius:14px;margin-top:14px', 'border-radius:8px;margin-top:14px', 'Prévia da foto: canto menos arredondado');
    return t;
  });
  edit(dir, 'index.html', t => {
    t = once(t, '<meta name="theme-color" content="#7343de">', '<meta name="theme-color" content="#1f4fc4">', 'Cor da barra do navegador');
    t = once(t, 'style.css?v=20261103-navigation', 'style.css?v=20261104-visual', 'Atualiza o cache do CSS');
    return t;
  });
}
console.log('\nPronto. Linhas "ERRO" indicam trechos que não bateram; envie-me essas linhas para eu ajustar.');
