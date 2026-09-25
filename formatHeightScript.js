const fs = require('fs');
const helpersPath = 'src/Utilities/Helpers.ts';

let helpersContent = fs.readFileSync(helpersPath, 'utf8');

if (!helpersContent.includes('formatHeightDisplay')) {
  helpersContent += `\nexport const formatHeightDisplay = (h: string | number | undefined | null) => {
  if (!h) return '';
  const num = typeof h === 'string' ? parseFloat(h) : h;
  if (!isNaN(num)) {
    return num < 10 ? \`\${h} ft\` : \`\${h} cm\`;
  }
  return String(h);
};\n`;
  fs.writeFileSync(helpersPath, helpersContent);
}
