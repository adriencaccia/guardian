#!/usr/bin/env node
import { program } from 'commander';
import { execute } from './index';

void program
  .version('0.0.1')
  .option('-p, --peppers', 'Add peppers')
  .option('-P, --pineapple', 'Add pineapple')
  .option('-b, --bbq-sauce', 'Add bbq sauce')
  .option(
    '-c, --cheese [type]',
    'Add the specified type of cheese [marble]',
    'marble',
  )
  .action(execute)
  .parseAsync(process.argv);
