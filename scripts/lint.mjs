import { readFile, readdir } from "node:fs/promises";
const files=(await readdir("src")).filter(x=>/\.(?:jsx|mjs|css|json)$/.test(x));
for(const file of files){const text=await readFile(`src/${file}`,"utf8"); if(/[ \t]+$/m.test(text)) throw new Error(`${file}: trailing whitespace`); if(!text.endsWith("\n")) throw new Error(`${file}: missing final newline`)}
