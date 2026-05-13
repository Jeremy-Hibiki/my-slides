import fs from 'node:fs/promises';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import { execa } from 'execa';
import prompts from 'prompts';

async function startPicker(args: string[]) {
  const slides = (await fs.readdir(new URL('../slides', import.meta.url), { withFileTypes: true }))
    .filter((dirent) => {
      return dirent.isFile() && dirent.name.endsWith('.md');
    })
    .map((dirent) => dirent.name)
    .map((slide) => ({
      title: slide,
      value: slide,
    }));

  const result = await prompts({
    type: 'select',
    name: 'slide',
    message: 'Pick a slide',
    choices: slides,
  });

  args = args.filter((arg) => arg !== '-y');

  if (result.slide) {
    void execa('vp', ['exec', 'slidev', fileURLToPath(new URL(`../slides/${result.slide}`, import.meta.url))], {
      stdio: 'inherit',
    });
  }
}

await startPicker(process.argv.slice(2));
