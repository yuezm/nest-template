#!/usr/bin/env node

/**
 * 递归protocol文件夹，转换protocol buffer，传参 clear 可以清除已声明的文件
 * command node protocol.js 或者 npm run build:protocol
 * command node protocol.js clear
 * command node protocol.js [path] 相对于 ./protocol的路径
 *
 */
'use strict';

const path = require('path');
const fs = require('fs');
const cliJs = require('protobufjs/cli/pbjs');
const cliTs = require('protobufjs/cli/pbts');
const ora = require('ora');

const PROTOCOL_PATH = './protocol'; // protocol根路径
const filesStack = []; // 文件栈
const spinner = ora();
let taskCount = 0;

boot();


function boot() {
  spinner.start('Task running...');

  if (process.argv[ 2 ] === 'clear') {
    clearDefinition(PROTOCOL_PATH);
    spinner.succeed('Task succeed...');
  } else {
    if (process.argv[ 2 ] && fs.existsSync(process.argv[ 2 ])) {
      transformDefinition(process.argv[ 2 ]);
    } else {
      transformDefinition(PROTOCOL_PATH);
    }
  }
}

function transformDefinition(rootPath) {
  if (fs.statSync(rootPath).isDirectory()) {
    filesStack.push(rootPath);
    recursiveDir(rootPath);
  } else {
    const pathInfo = path.parse(rootPath);
    createDefinition(rootPath, pathInfo.name, pathInfo.dir).then(() => {
      spinner.succeed('Task succeed');
    }).catch((err) => {
      console.log(`${rootPath}出现错误`);
      console.log(err);
      spinner.warn('Task Error');

      process.exit(1);
    });
  }
}

function clearDefinition(rootPath) {
  fs.readdirSync(rootPath).forEach(file => {
    const p = path.join(rootPath, file);
    if (fs.statSync(p).isDirectory()) {
      clearDefinition(p);
      return;
    }

    if (rootPath === PROTOCOL_PATH) {
      return;
    }

    const extname = path.extname(file);
    if (extname === '.ts' || extname === '.js') {
      fs.unlinkSync(p);
    }
  });
}

/**
 * 递归文件夹
 * 获取文件夹下所有的 *.proto，再转化为 `${dirname}.d.ts`，如果文件夹下还存在文件夹，则递归；总的来说是以文件夹来划分 *d.ts文件
 * @param {string} parentPath 父级文件夹路径
 */
function recursiveDir(parentPath) {
  fs.readdirSync(parentPath).forEach(file => {
    const p = path.join(parentPath, file);

    if (path.extname(p) === '.proto') {
      filesStack.push(p);
    }

    if (fs.statSync(p).isDirectory()) {
      filesStack.push(p);
      recursiveDir(p);
    }
  });

  taskCount++;

  // 由于这货是异步的，所以最终任务结束使用 任务计数为0 判断
  const targetFileBaseName = path.basename(parentPath).replace(/[-_]/g, '\.');
  createDefinition(getFileNamesFromStack(parentPath), targetFileBaseName, parentPath).then(() => {
    taskCount--;
    if (taskCount === 0) {
      spinner.succeed('Task succeed');
    }
  }).catch(({ path, err }) => {
    console.log(`${path}目录下出现错误`);
    console.log(err);
    spinner.warn('Task Error');

    process.exit(1);
  });

}

/**
 * 获取文件栈内文件
 * @param {string} parentDirPath 父级文件夹路径
 * @returns {string} 文件下全部 *.proto文件路径字符串，例 x.proto y.proto ...
 */
function getFileNamesFromStack(parentDirPath) {
  let f = filesStack.pop();
  let pathStr = '';

  while (f !== parentDirPath && filesStack.length > 0) {
    pathStr += ` ${f}`;
    f = filesStack.pop();
  }
  return pathStr;
}

/**
 * 转换函数
 * @param filenames 所需要转换*.proto的文件名字符串集合，例如 "./xx/x.proto ./xx/y.proto"
 * @param fileBaseName 所转换后生成的文件名，例如 xx
 * @param parentPath 所转换后生成的文件所在文件夹，例如 ./xx
 * @returns {Promise<void>}
 */
async function createDefinition(filenames, fileBaseName, parentPath) {
  console.log(parentPath);
  if (!filenames || parentPath === PROTOCOL_PATH) {
    return;
  }
  await createJsDefinition(filenames, fileBaseName, parentPath);
  await createTsDefinition(fileBaseName, parentPath);
}

/**
 * js转换函数
 * @param filenames 所需要转换*.proto的文件名字符串集合，例如 "./xx/x.proto ./xx/y.proto"
 * @param fileBaseName 所转换后生成的文件名，例如 xx
 * @param parentPath 所转换后生成的文件所在文件夹，例如 ./xx
 * @returns {Promise<void>}
 */
function createJsDefinition(filenames, fileBaseName, parentPath) {
  return new Promise(((resolve, reject) => {
    cliJs.main([ '-t', 'static-module', '-p', 'protocol', '-w', 'commonjs' ].concat(filenames.trim().split(' ')),
      function(err, output) {
        if (err) {
          reject({
            path: parentPath,
            err,
          });
        }

        fs.writeFile(path.join(parentPath, `${fileBaseName}.js`), output, function(err) {
          if (err) {
            reject({
              path: parentPath,
              err,
            });
          }
          resolve();
        });
      });
  }));
}


/**
 * ts转换函数
 * @param fileBaseName 所转换后生成的文件名，例如 xx
 * @param parentPath 所转换后生成的文件所在文件夹，例如 ./xx
 * @returns {Promise<void>}
 */
function createTsDefinition(fileBaseName, parentPath) {
  return new Promise(((resolve, reject) => {
    cliTs.main([ '-p', 'protocol', path.join(parentPath, `${fileBaseName}.js`) ], function(err, output) {
      if (err) {
        reject({
          path: parentPath,
          err,
        });
      }


      output = output.replace(/Promise/g, 'Observable');
      output = 'import { Observable } from \'rxjs\';\n' + output;

      fs.writeFile(path.join(parentPath, `${fileBaseName}.d.ts`), output, function(err) {
        if (err) {
          reject({
            path: parentPath,
            err,
          });
        }
        resolve();
      });
    });
  }));
}
