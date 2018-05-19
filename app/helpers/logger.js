import colors from 'colors/safe';

export function log(message) {
  console.log(colors.blue(`   ${message}`));
}

export function error(message) {
  console.log(colors.red(`   ${message}`));
}
