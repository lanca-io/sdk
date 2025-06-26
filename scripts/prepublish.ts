import path from 'node:path';
import { outputFileSync, readJsonSync, writeJsonSync } from 'fs-extra';
import { fileURLToPath } from 'node:url';

type ExportsEntry = {
  import?: string;
  default?: string;
  types?: string;
  [key: string]: any;
}
type PackageJson = {
  authors?: any;
  bugs?: any;
  dependencies?: any;
  description?: string;
  exports?: Record<string, string | ExportsEntry>;
  files?: string[];
  homepage?: string;
  keywords?: string[];
  license?: string;
  main?: string;
  module?: string;
  name?: string;
  peerDependencies?: any;
  peerDependenciesMeta?: any;
  repository?: any;
  sideEffects?: boolean | string[];
  types?: string;
  typesVersions?: any;
  typings?: string;
  version?: string;
  [key: string]: any;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createPackageJson(): void {
  const packageJsonPath = path.join(__dirname, '../package.json');
  const packageJson: PackageJson = readJsonSync(packageJsonPath);

  writeJsonSync(`${packageJsonPath}.tmp`, packageJson, { spaces: 2 });

  const files_ = Array.isArray(packageJson.files) ? [...packageJson.files] : [];

  const exports_ = packageJson.exports || {};
  for (const [key, value] of Object.entries(exports_)) {
    if (typeof value === 'string' || key === '.') continue;

    if (!value.default || !value.import) {
      throw new Error('Required `default` and `import` in export entry.');
    }

    const subPackageJson: Record<string, string> = {};
    for (const [k, v] of Object.entries(value)) {
      let mappedKey: string;
      if (k === 'import') mappedKey = 'module';
      else if (k === 'default') mappedKey = 'main';
      else if (k === 'types') mappedKey = 'types';
      else throw new Error(`Invalid key "${k}" in exports entry.`);
      subPackageJson[mappedKey] = v.replace('./', '../');
    }

    outputFileSync(
      path.join(__dirname, '..', key, 'package.json'),
      JSON.stringify(subPackageJson, null, 2)
    );
    files_.push(key.replace('./', ''));
  }

  writeJsonSync(
    packageJsonPath,
    {
      ...packageJson,
      files: files_,
      exports: exports_,
    },
    { spaces: 2 }
  );
}

createPackageJson();
