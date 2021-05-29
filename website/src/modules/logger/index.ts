import chalk from 'chalk'

export async function log(scope, ...args) {
  const prefix = chalk.keyword('purple')(`[${scope}]`);
  const message = args.join(' ');

  return console.log(prefix, message);  
}