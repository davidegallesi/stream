#!/usr/bin/env node
// watch.js — monitora src/stream/ e rebuilda il sito ad ogni modifica

const chokidar = require("chokidar");
const { execSync } = require("child_process");
const path = require("path");

const WATCH_DIR = path.join(__dirname, "src/stream");
let building = false;

function build() {
  if (building) return;
  building = true;
  console.log(`[${new Date().toISOString()}] 🔨 Modifica rilevata, build in corso...`);
  try {
    execSync("npm run build", { stdio: "inherit", cwd: __dirname });
    console.log(`[${new Date().toISOString()}] ✅ Build completata.`);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] ❌ Errore nella build:`, err.message);
  } finally {
    building = false;
  }
}

const watcher = chokidar.watch(WATCH_DIR, {
  persistent: true,
  ignoreInitial: true,   // non triggera al primo avvio
  awaitWriteFinish: {
    stabilityThreshold: 500,  // aspetta 500ms dopo l'ultima scrittura
    pollInterval: 100,
  },
});

watcher
  .on("add",    (f) => { console.log(`📄 Nuovo file: ${path.basename(f)}`);    build(); })
  .on("change", (f) => { console.log(`✏️  Modificato: ${path.basename(f)}`);   build(); })
  .on("unlink", (f) => { console.log(`🗑️  Eliminato: ${path.basename(f)}`);    build(); });

console.log(`👀 In ascolto su ${WATCH_DIR}`);
