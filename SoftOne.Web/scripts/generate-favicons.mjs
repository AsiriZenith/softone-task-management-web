import { readFileSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';
import toIco from 'to-ico';

const svgPath = 'src/assets/icons/favicon.svg';
const svg = readFileSync(svgPath);

const png16 = await sharp(svg).resize(16, 16).png().toBuffer();
const png32 = await sharp(svg).resize(32, 32).png().toBuffer();
const png180 = await sharp(svg).resize(180, 180).png().toBuffer();

writeFileSync('src/favicon.ico', await toIco([png16, png32]));
writeFileSync('src/assets/icons/favicon-16.png', png16);
writeFileSync('src/assets/icons/favicon-32.png', png32);
writeFileSync('src/assets/icons/apple-touch-icon.png', png180);

console.log('Generated src/favicon.ico (%d bytes)', readFileSync('src/favicon.ico').length);
