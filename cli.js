#! /usr/bin/env node

'use strict';

const program = require('commander');
const makeup = require('./index');

program
  .version('1.0.0')
  .option('-i, --input [dir]', 'message input dir or file path')
  .option('-o, --output [dir]', 'message output dir, default ./')
  .option('-t, --template [type]', 'templates path, default java.js')
  .parse(process.argv);

let config = {
  input: program.input,
  output: program.output,
  template: program.template
};
makeup(config);