import fs from 'fs';
import path from 'path';

type Mod = {
  file: string;
  search: string | RegExp;
  replace: string;
};

const mods: Mod[] = [
  // ignore invalid method interface method extensions
  ...['SoloValue', 'RangedValue', 'IntegerValue', 'StringArrayValue'].map(
    (interfaceName) => ({
      file: `com/bitwig/extension/controller/api/${interfaceName}.d.ts`,
      search: new RegExp(`^([ ]*)(interface ${interfaceName})`, 'm'),
      replace: '$1// @ts-ignore\n$1$2',
    })
  ),
  {
    file: 'com/bitwig/extension/controller/api/ControllerHost.d.ts',
    search:
      'scheduleTask(callback: () => void, args: object, delay: number): void;',
    replace:
      'scheduleTask<T extends any[]>(callback: (...args: T) => void, args: T, delay: number): void;',
  },
  {
    file: 'com/bitwig/extension/controller/api/NoteInput.d.ts',
    search: /table: object\[\]/gm,
    replace: 'table: number[]',
  },
  {
    file: 'com/bitwig/extension/controller/api/Application.d.ts',
    search: /PANEL_LAYOUT_(.+): string;/gm,
    replace: "PANEL_$1_ARRANGE: '$1';",
  },
];

export const applyMods = () => {
  mods.forEach(({ file: relPath, search, replace }) => {
    const absPath = path.join(__dirname, '..', 'types', relPath);
    const file = fs.readFileSync(absPath, 'utf-8');
    const result = file.replace(search, replace);
    fs.writeFileSync(absPath, result);
  });
};
