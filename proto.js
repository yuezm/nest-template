#!/usr/bin/env node

'use strict';

const ora = require('ora');
const { execSync, spawnSync } = require('child_process');
const { existsSync } = require('fs');

let PROTOCOL_PATH = './proto'; // proto根路径
const spinner = ora();

bootStrap();

function bootStrap() {
  spinner.start('Task running...');

  if (process.argv[ 2 ] && existsSync(process.argv[ 2 ])) {
    PROTOCOL_PATH = process.argv[ 2 ];
  }

  try {
    spawnSync('pbjs', [ '-t',
      'static-module',
      '--no-create',
      '--no-encode',
      '--no-decode',
      '--no-verify',
      '--no-convert',
      '--no-delimited',
      `${PROTOCOL_PATH}/**/*.proto`,
      '-o',
      'proto/proto.js' ]);
    // execSync(`pbjs -t static-module --no-create --no-encode --no-decode --no-verify --no-convert --no-delimited proto/**/*.proto -o proto/proto.js`);
    execSync('pbts -o proto/proto.d.ts proto/proto.js');
    spinner.succeed();
  } catch (e) {
    spinner.warn(e.message);
  }
}
