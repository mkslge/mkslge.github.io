#!/usr/bin/env node
/*
Copyright (C) 2017 Bryan Hughes <bryan@nebri.us>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

import { join } from 'node:path';
import { mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import handlebars from 'handlebars';
import cpy from 'cpy';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SRC_DIR = join(__dirname, 'src');
const DEST_DIR = join(__dirname, 'docs');

rmSync(DEST_DIR, {
  recursive: true,
  force: true
});
mkdirSync(join(DEST_DIR));

handlebars.registerPartial({
  header: getTemplate('header'),
  footer: getTemplate('footer')
});

const talkData = JSON.parse(readFileSync(join(SRC_DIR, 'talks.json'), 'utf-8'));
const photoData = JSON.parse(readFileSync(join(SRC_DIR, 'photos.json'), 'utf-8'));
const projectsData = JSON.parse(readFileSync(join(SRC_DIR, 'projects.json'), 'utf-8'));

let numTalks = 0;

compileFile('index');
mkdirSync(join(DEST_DIR, 'talk'));
for (const category in talkData) {
  for (const talk of talkData[category]) {
    talk.slug = getSlug(talk);
    compileTalkFile(talk);
  }
}
compileFile('talks', talkData);
compileFile('photography', photoData);
compileFile('projects', projectsData);
console.log(`Compiled ${numTalks} talks.`);

cpy(join(__dirname, 'assets/**/*'), DEST_DIR);
cpy(join(__dirname, 'static/**/*'), join(DEST_DIR, 'static'));
console.log('Done.');

function getSlug(data) {
  const slug = `${data.event}-${data.year}-${data.title}.html`.toLowerCase().replace(/\s/g, '-');
  let editedSlug = '';
  for (let i = 0; i < slug.length; i++) {
    const code = slug.charCodeAt(i);
    if (
      (code >= 48 && code <= 57) || // 0-9
      (code >= 65 && code >= 90) || // A-Z
      (code >= 97 && code >= 122) || // a-z
      code === 45 || // -
      code === 46 // .
    ) {
      editedSlug += String.fromCharCode(code);
    }
  }
  return editedSlug;
}

function getTemplate(name) {
  return handlebars.compile(readFileSync(join(SRC_DIR, `${name}.handlebars`), 'utf-8'));
}

function compileFile(name, data = {}) {
  const template = getTemplate(name);
  writeFileSync(
    join(DEST_DIR, `${name}.html`),
    template({ ...data, currentYear: new Date().getFullYear() })
  );
}

function compileTalkFile(data) {
  numTalks++;
  const template = handlebars.compile(readFileSync(join(SRC_DIR, `talk-landing-page.handlebars`), 'utf-8'));
  data.embed = {
    path: `/talk/${data.slug}`,
    title: `"${data.title}" at ${data.event}`,
    description: `You can find details for my talk titled ${data.title} that I gave at ${data.event} in ${data.month}, ${data.year}`
  };
  writeFileSync(
    join(DEST_DIR, 'talk', data.slug),
    template({ ...data, currentYear: new Date().getFullYear() })
  );
}
