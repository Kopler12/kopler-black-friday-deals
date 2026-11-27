// DealHound hand-in program (Node 22, standard library only).
//
// It stages this repository's app/ folder and screenshots/ folder into the
// grader's output directory and writes the dossier there with the vendored
// make.fun frontend library. Outside the grader, MAKEFUN_OUTPUT_DIR stands
// in for /output, so locally: MAKEFUN_OUTPUT_DIR=out node main.ts
//
// The site itself is plain static files: index.html plus its own modules
// and stylesheet under app/. Nothing it runs, styles or shows is fetched
// from the network; the only outside links are the store links on the deal
// cards, which are ordinary <a href> links, not loads.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

if (!existsSync(join(repoRoot, 'app'))) {
  throw new Error('DealHound main.ts: app/ is missing from the repository');
}

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outputDir, 'app'), { recursive: true });
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'), { recursive: true });
}

const dossierCaps = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
};

writeFileSync(join(outputDir, 'dossier.json'), buildDossier(outputDir, dossierCaps));
