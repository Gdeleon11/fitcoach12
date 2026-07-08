const fs = require('fs');
const tailwindConfigPath = 'tailwind.config.ts';
const globalsCssPath = 'src/app/globals.css';

const colors = {
  "tertiary-fixed-dim": "#ffb4aa",
  "secondary-container": "#c3f400",
  "on-surface-variant": "#b9cacb",
  "on-background": "#e5e2e1",
  "on-error": "#690005",
  "tertiary-fixed": "#ffdad5",
  "on-secondary-fixed-variant": "#3c4d00",
  "error": "#ffb4ab",
  "primary": "#dbfcff",
  "on-error-container": "#ffdad6",
  "background": "#131313",
  "outline": "#849495",
  "tertiary": "#fff3f1",
  "surface-variant": "#353534",
  "surface-container-high": "#2a2a2a",
  "on-tertiary-fixed-variant": "#930005",
  "primary-fixed-dim": "#00dbe9",
  "surface": "#131313",
  "surface-dim": "#131313",
  "surface-container-low": "#1c1b1b",
  "on-tertiary-container": "#c1000a",
  "surface-container-lowest": "#0e0e0e",
  "on-secondary": "#283500",
  "on-primary": "#00363a",
  "inverse-surface": "#e5e2e1",
  "on-primary-fixed-variant": "#004f54",
  "error-container": "#93000a",
  "on-surface": "#e5e2e1",
  "inverse-primary": "#006970",
  "tertiary-container": "#ffcec7",
  "primary-fixed": "#7df4ff",
  "primary-container": "#00f0ff",
  "on-primary-fixed": "#002022",
  "inverse-on-surface": "#313030",
  "secondary-fixed-dim": "#abd600",
  "on-tertiary-fixed": "#410001",
  "on-secondary-container": "#556d00",
  "secondary": "#ffffff",
  "secondary-fixed": "#c3f400",
  "surface-tint": "#00dbe9",
  "on-tertiary": "#690003",
  "surface-container": "#201f1f",
  "surface-container-highest": "#353534",
  "surface-bright": "#393939",
  "on-secondary-fixed": "#161e00",
  "on-primary-container": "#006970",
  "outline-variant": "#3b494b"
};

let tailwindConf = fs.readFileSync(tailwindConfigPath, 'utf-8');
const newColorsBlock = Object.keys(colors).map(k => `        "${k}": "var(--color-${k})",`).join('\n');
tailwindConf = tailwindConf.replace(/colors:\s*\{[^}]+\}/, `colors: {\n${newColorsBlock}\n      }`);
fs.writeFileSync(tailwindConfigPath, tailwindConf);

let globalsCss = fs.readFileSync(globalsCssPath, 'utf-8');
const rootVars = Object.entries(colors).map(([k,v]) => `  --color-${k}: ${v};`).join('\n');

const lightThemeVars = Object.entries(colors).map(([k,v]) => {
  // Very rough heuristic to invert colors for light theme
  if (k.includes('surface') || k === 'background') return `  --color-${k}: #ffffff;`;
  if (k.startsWith('on-')) return `  --color-${k}: #131313;`;
  if (k.includes('primary')) return `  --color-${k}: #006970;`;
  return `  --color-${k}: ${v};`;
}).join('\n');
// We will manually fix the light theme later, just setting it up

const neonThemeVars = Object.entries(colors).map(([k,v]) => {
  if (k.includes('surface') || k === 'background') return `  --color-${k}: #090014;`;
  if (k.includes('primary')) return `  --color-${k}: #ff00ff;`; // Magenta
  if (k.includes('secondary')) return `  --color-${k}: #00ffff;`; // Cyan
  return `  --color-${k}: ${v};`;
}).join('\n');

const themeCss = `
:root {
${rootVars}
}

[data-theme="light"] {
${rootVars.replace(/#131313/g, '#f3f4f6').replace(/#1c1b1b/g, '#ffffff').replace(/#0e0e0e/g, '#ffffff').replace(/#201f1f/g, '#e5e7eb').replace(/#2a2a2a/g, '#d1d5db').replace(/#353534/g, '#9ca3af').replace(/#e5e2e1/g, '#111827')}
}

[data-theme="neon"] {
${rootVars.replace(/#131313/g, '#050014').replace(/#1c1b1b/g, '#110022').replace(/#0e0e0e/g, '#03000a').replace(/#00dbe9/g, '#ff00ff').replace(/#00f0ff/g, '#ff00ff')}
}
`;
globalsCss = globalsCss.replace(/:root\s*\{\s*color-scheme:\s*dark;\s*\}/, `:root {\n  color-scheme: dark;\n}\n${themeCss}`);

// also update background color hardcoded
globalsCss = globalsCss.replace(/background-color:\s*#131313;/g, 'background-color: var(--color-background);');
globalsCss = globalsCss.replace(/color:\s*#e5e2e1;/g, 'color: var(--color-on-background);');
globalsCss = globalsCss.replace(/background:\s*#1c1b1b;/g, 'background: var(--color-surface-container-low);');
globalsCss = globalsCss.replace(/background:\s*rgba\(28,\s*27,\s*27,\s*0\.8\);/g, 'background: color-mix(in srgb, var(--color-surface-container-low) 80%, transparent);');
globalsCss = globalsCss.replace(/border-color:\s*#00dbe9;/g, 'border-color: var(--color-primary-fixed-dim);');
globalsCss = globalsCss.replace(/border:\s*1px solid\s*#3b494b;/g, 'border: 1px solid var(--color-outline-variant);');
globalsCss = globalsCss.replace(/background:\s*#3b494b;/g, 'background: var(--color-outline-variant);');
globalsCss = globalsCss.replace(/background:\s*#00f0ff;/g, 'background: var(--color-primary-container);');

fs.writeFileSync(globalsCssPath, globalsCss);
console.log('Done');
