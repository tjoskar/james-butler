#!/usr/bin/env node

if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (str){
    return this.slice(0, str.length) === str;
  };
}

/**
 * Module dependencies.
 */

var fs = require('fs'),
    readline = require('readline'),
    program = require('commander');

var db = {};

program
  .version('0.0.1')
  .option('-f, --file [files]', 'List of files to search [.functions]', '/Users/Tjoskar/.functions')
  .parse(process.argv);

var rd = readline.createInterface({
    input: fs.createReadStream(program.file),
    output: process.stdout,
    terminal: false
});

var STATE = {
  HEADLINE: 0,
  COMMENT: 1,
  NAME: 2
};

var headline = '';
var comment = '';
var name = '';
var currentState = STATE.HEADLINE;

rd.on('line', function(line) {
  if (currentState === STATE.HEADLINE && line.startsWith('#')) {
    headline = line.substring(1);
    currentState = STATE.COMMENT;
  } else if (currentState === STATE.COMMENT && line.startsWith('#')) {
    comment += line.substring(1) + '\n';
  }
  var match = /\s+([a-zA-Z0-9]+)\s*\([^()]*\)\s*{/g.exec(line);
  if (match && match[1] && currentState >= STATE.COMMENT) {
    currentState = STATE.HEADLINE;
    name = match[1];
    console.log('headline: ', headline);
    console.log('comment: ', comment);
    console.log('name: ', name);
    console.log('\n');
    headline = comment = name = '';
  }
});
