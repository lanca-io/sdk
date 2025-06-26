import { promises as fs } from 'node:fs';
import { join } from 'node:path';

async function run() {
  try {
    const packagePath = join(process.cwd(), 'package.json');
    const versionFilePath = join(process.cwd(), 'src', 'version.ts');

    const data = await fs.readFile(packagePath, 'utf8');
    const { version, name } = JSON.parse(data);

    const fileContent = [
      `export const name = '${name}';`,
      `export const version = '${version}';`,
      ''
    ].join('\n');

    await fs.writeFile(versionFilePath, fileContent, 'utf8');
  } catch (error) {
    process.exit(1);
  }
}

run();
