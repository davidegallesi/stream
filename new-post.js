#!/usr/bin/env node
// Uso: node new-post.js note | link | quote | image
//   o: npm run note / link / quote / image

const fs = require("fs");
const path = require("path");

const type = process.argv[2] || "note";
const validTypes = ["note", "link", "quote", "image"];

if (!validTypes.includes(type)) {
  console.error(`Tipo non valido. Usa: ${validTypes.join(", ")}`);
  process.exit(1);
}

const now = new Date();
const fileStamp = now.toISOString().replace(/:/g, "-").replace(/\..+/, "");
const fileName = `${fileStamp}-${type}.md`;
const dateISO = now.toISOString().replace(/\..+/, "");

const frontmatters = {
  note: `---
date: ${dateISO}
type: note
---
`,
  link: `---
date: ${dateISO}
type: link
url: https://
linkTitle: Titolo del link
---
Commento opzionale.
`,
  quote: `---
date: ${dateISO}
type: quote
author: Autore
---
Testo della citazione.
`,
  image: `---
date: ${dateISO}
type: image
image: /img/nome-file.jpg
imageAlt: Descrizione dell'immagine
---
Didascalia opzionale.
`,
};

const outPath = path.join(__dirname, "src", "stream", fileName);
fs.writeFileSync(outPath, frontmatters[type]);

console.log(`✅ Creato: src/stream/${fileName}`);
