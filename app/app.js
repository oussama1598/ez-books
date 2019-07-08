import program from 'commander';
import search from './commands/search';
import { version } from '../package.json';

program.version(version).parse(process.argv);

(async function main() {
  await search();

  return null;
})();
