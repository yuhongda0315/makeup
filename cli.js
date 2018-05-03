#! /usr/bin/env node

'use strict';

const program = require('commander');
const makeup = require('./index');

program
  .version('1.0.6')
  .option('-i, --input [dir]', 'message input dir or file path')
  .option('-o, --output [dir]', 'message output dir, default ./')
  .option('-t, --template [type]', 'templates path, default java.js')
  .option('-d, --docs', 'generate the document from the input json')
  .parse(process.argv);

let config = {
  input: program.input,
  output: program.output,
  template: program.template,
  docs: program.docs
};
makeup(config);