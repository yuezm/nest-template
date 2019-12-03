/**
 * 启动脚本 启动之前需要加载或者执行的程序
 */
import { addAliases } from 'module-alias';

const cwd = process.cwd();

addAliases({
  '@Src': `${ cwd }/dist`,
  '@App': `${ cwd }/dist/app`,
  '@Helper': `${ cwd }/dist/helper`,
  '@Common': `${ cwd }/dist/common`,
  '@Log': `${ cwd }/dist/common/module/log`,
  '@Config': `${ cwd }/dist/common/module/config`,
  '@Protocol': `${ cwd }/protocol`,
  '@Resource': `${ cwd }/resource`,
  '@Public': `${ cwd }+/public`,
});
