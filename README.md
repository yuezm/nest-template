# node.js 项目文档（基于 nest.js 7.x）

## 介绍

适用于 node 接口层文档，包含文件、规范、开发示例等

## 安装

```bash
$ npm install
```

**依赖模块**

- @nestjs/common
- @nestjs/core
- @nestjs/...
- winston
- dayjs
- pm2
- ...

## 开发

```bash
# develop
$ npm run dev
```

## 打包

```bash
# build app
$ npm run build

# build docker image
$ npm run build:docker

# build proto buffer
$ npm run build:protocol
```

## 生产运行

```bash
# production with docker
$ npm run startup:docker

# production with pm2
$ npm run startup
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## 目录

### src

#### src/app

存放于业务模块，文件按业务拆分，<font color="red">该项目文件未按照角色拆分，而是按照业务模块拆分</font>。即同模块下，controller、service、module、dto、dto、static 存放于一个文件夹下

| 文件名           | 路径                        | 功能描述                                                                                       |
| :--------------- | :-------------------------- | :--------------------------------------------------------------------------------------------- |
| \*.controller.ts | src/app/\*/\*.controller.ts | 控制器，负责数据校验，数据组装，**请注意，controller 不负责重逻辑，重逻辑请放置于 service!!!** |
| \*.service.ts    | src/app/\*/\*.service.ts    | 业务处理，例如发起 gRPC 请求                                                                   |
| \*.do.ts         | src/app/\*/\*.do.ts         | 向服务端（数据库）接收、传输的数据实体                                                         |
| \*.dto.ts        | src/app/\*/\*.dto.ts        | 向前端接收、传输的数据实体，_目前未严格区分 do、dto，如何使用请自行决定_                       |
| \*.static.ts     | src/app/\*/\*.static.ts     | 模块的枚举、interface、type、常量等定义                                                        |

提示：如果业务模块过于复杂，可以再进行拆分，一切以好维护为标准，例如可以按照如下进行拆分：

```
- test
  - test1
    - test1.controller.ts
    - test1.service.ts
    ...
  - test2
    - test1.controller.ts
    - test1.service.ts
    ...

  test.module.ts
```

#### src/common

存放公用包，如 nest 定义的不同角色的模块

##### decorator 装饰器

| 文件名                 | 路径                                        | 功能描述                                 |
| :--------------------- | :------------------------------------------ | :--------------------------------------- |
| transform.decorator.ts | src/common/decorator/transform.decorator.ts | 数据实体转换、类型校验等装饰器文件       |
| user.decorator.ts      | src/common/decorator/user.decorator.ts      | 用户信息设置、获取、权限设置等装饰器文件 |

##### filter 异常过滤器

| 文件名                  | 路径                                      | 功能描述                                 |
| :---------------------- | :---------------------------------------- | :--------------------------------------- |
| all.exception.filter.ts | src/common/filter/all.exception.filter.ts | 所有异常捕获，组装错误码、错误信息并返回 |

##### guards 守卫

| 文件名         | 路径                             | 功能描述                                         |
| :------------- | :------------------------------- | :----------------------------------------------- |
| auth.guards.ts | src/common/guards/auth.guards.ts | auth.guards.ts （免登录使用 AuthIgnore 装饰器）  |
| role.guards.ts | src/common/guards/role.guards.ts | 角色权限守卫（配合 Roles、UseGuards 装饰器使用） |

##### interceptor 通用拦截器

| 文件名                  | 路径                                           | 功能描述             |
| :---------------------- | :--------------------------------------------- | :------------------- |
| response.interceptor.ts | src/common/interceptor/response.interceptor.ts | 返回值统一格式序列化 |

##### middware 中间件

| 文件名          | 路径                                | 功能描述             |
| :-------------- | :---------------------------------- | :------------------- |
| log.middware.ts | src/common/middware/log.middware.ts | 服务入口通用日志打印 |

##### module 自定义通用模块

| 文件名            | 路径                                | 功能描述 |
| :---------------- | :---------------------------------- | :------- |
| log.service.ts    | src/common/module/log.service.ts    | 日志服务 |
| config.service.ts | src/common/module/config.service.ts | 服务配置 |

#### src/config 系统配置

| 文件名   | 路径                | 功能描述 |
| :------- | :------------------ | :------- |
| index.ts | src/config/index.ts | 配置文件 |

<font color="red">src/config.ts 只放置通用配置</font>，对**不同环境配置**或**敏感信息配置**不要放在此处!!!，请在配置工程目录中配置环境变量!!!

#### src/helper 工具函数

| 文件名    | 路径                 | 功能描述             |
| :-------- | :------------------- | :------------------- |
| helper.ts | src/helper/helper.ts | 工具函数             |
| error.ts  | src/helper/error.ts  | 错误码、错误信息映射 |

**增加工具函数，请增加测试，工具函数测试覆盖率必须 100%!!!**

#### src/boot.ts 启动脚本

启动前执行脚本，为在启动服务前需要执行的脚本，例如本项目的 require hack

#### main.ts 入口文件

1. 加载 boot.ts
2. 执行 bootstrap
3. HTTP 启动时，端口占用处理
4. 错误捕获

## 命名

| 命名       | 规则                                                                  | 示例                                          |
| :--------- | :-------------------------------------------------------------------- | :-------------------------------------------- |
| 文件夹命名 | 文件夹命名统一小写，如果存在多单词，则使用*短横线*连接                | user、user-detail                             |
| 文件命名   | 文件名统一小写，且按照角色命名，如果存在多单词，则使用 "." 连接       | user.controller.ts、user.detail.controller.ts |
| class 命名 | 采用大驼峰结构                                                        | `Class UserController {}`                     |
| 方法命名   | 采用小驼峰结构                                                        | `indexUser(){}`                               |
| enum       | 必须以大写字母"E"起始；枚举值必须采用**大写字母**，或大写字符加下划线 | `enum EUser { SEX = 0, USER_SEX = 1};`        |
| interface  | 必须以大写字母"E"起始；枚举值必须采用**大写字母**，或大写字符加下划线 | `enum EUser { SEX = 0, USER_SEX = 1};`        |
| interface  | 以大写字母"I"起始的大驼峰结构                                         | `interface IUser {}`                          |
| type       | 以大写字母"T"起始的大驼峰结构                                         | `type TUser {}`                               |
| 常量       | 以小写字母"k"起始、全大写字母、大写字母加下划线                       | `const kUserName; const USER_NAME;`           |
| 变量       | 变量采用小驼峰结构                                                    | `const userName`                              |

## 开发规范

### controller 开发

1. controller 必须使用 ApiUseTags 注释，注释规则: `@ApiUseTags('user: 用户模块')`
2. controller import 语句放置位置
   - 顶层放置: Node Native Module 或 三方包
   - 中间放置: 自己的文件模块
   - 底层放置: 对 protocol 文件的引用

如下所示

```
import { ... } from 'fs';
import { ... } from '@nestjs/common'

import { UserService } from '@App/user/user.service';

import { user } from '@Protocol/user.d.ts';
```

3. controller 内方法命名

   | 方法        | 规则                    | 示例             |
   | :---------- | :---------------------- | :--------------- |
   | GET /       | 列表查询：以*index*起始 | `indexUser(){}`  |
   | GET /:id    | 检索查询：以*show*起始  | `showUser(){}`   |
   | GET /       | 导出：以*export*起始    | `exportUser(){}` |
   | POST /      | 新增：以*create*起始    | `createUser(){}` |
   | PUT /:id    | 编辑：以*update*起始    | `updateUser(){}` |
   | DELETE /:id | 删除：以*delete*起始    | `deleteUser(){}` |
   | -           | 测试：以*test*起始      | `testUser(){}`   |

**其余特殊方法可单独命名**

4. controller method 必须定义 swagger 注释 `@ApiOperation()`
5. controller method 如果返货为 JSON 格式的标准输出数据，则需要以`@ResponseSerialize(XX)`转化，否则会以原有格式返回

### service 开发

1. service 命名方式可选择和 controller 保持一致
2. **service 调用日志**: service 可使用日志装饰器`@Log()`，该装饰器会打印 service 进出日志，如果开启 DEBUG（[如何开启 DEBUG 日志](#DEBUG)），则会打印 service 的完整输出，**使用该装饰器时，service 必须接受第一个参数为 Request 实体，该实体由 controller 传输**，如下所示。

传输 Request 实体原因:

1. 调用日志打印必须存在 requestId，而 service 无法获取 req
2. 日志打印时，会开启 DEBUG 判断，该参数从 query 传递，service 无法获取 query

```
// ---- user.controller.ts ----
...
@Get('/')
testUser(@Req() req: IRequest): string {
  return this.userService.test(req, true);
}
...


// ---- user.service.ts ----
...
@Log()
test(req: IRequest, query: boolean): string {
  if (query) {
    return 'hello，nest';
  }
  return  'hello，word'
}
...
```

### dto 开发

1. dto 属性必须存在 swagger 注释`@ApiProperty()`或`ApiPropertyOptional()`（注意 7.x 和 6.x 的方法名）; 请注意 required 属性，如果前端 \*.d.ts 是根据此 swagger 文档生成，会对前端传参造成影响
2. 是否需要 \*_.do.ts_ 开发者自己决定
3. 如果 dto 太多，则需要拆分文件，按照 [src/app 示例](#src/app) 拆分

---

## Log 日志

1. 日志采用 winston，由 _log.service.ts_ 提供服务
2. 日志按天切割，例如 _2020-3-31.log_、_2020-4-01.log_

单条日志信息格式为:

```
2020-03-32 00:00:00 WARN 调用xx服务错误
2020-03-32 00:00:00 INFO 进入系统
2020-03-32 00:00:00 DEBUG 调用xx服务
```

### 使用

```
import { LogService } from '@Log/log.service';

LogService.info(xxx);
```

### 日志分类

1. 系统日志: 描述系统状态，如磁盘使用、内存使用、CPU 使用等。由运维人员维护
2. 诊断日志:
   - 系统启动日志: 由模板完成，开发人员无需关心
   - 系统配置日志: 由模板完成，开发人员无需关心
   - 操作日志、调用日志: **由开发人员自行打印**
3. 统计日志: 统一用户使用情况、用户操作等。根据业务而定

### 日志等级

1. FATAL: 致命错误，服务已经挂了，需要运维立处理，无需开发人员打印
2. ERROR: 严重错误，服务已经不可访问，需要运维立处理，无需开发人员打印
3. WARN: 警告错误，服务科正常访问，但可能会导致问题，不需要立即处理
4. INFO: 消息日志，记录运行状态
5. DEBUG: 消息日志，记录详细操作步骤

### 已存在日志

1. 系统启动日志: 由 _main.ts_ 负责打印
2. 系统配置日志: 由 _config.service.ts_、_boot.ts_ 等负责打印
3. 进入系统日志: 由 _log.middware.ts_ 负责打印
4. 系统调用日志: 由各个 \*_.service.ts_ 负责打印
5. 离开系统体质: 由 _response.interceptor.ts_ 负责打印
6. 异常日志: 由 _all.exception.filter.ts_ 负责打印

### 注意事项

#### DEBUG

线上日志默认关闭 DEBUG，只会打印服务的调用流程，而不会打印完整的信息，可以在 url 参数中加入**DEBUG=1** 开启 DEBUG 模式。tips: 如果使用 `LogService.debug()` 时，请注意调用参数

#### requestId

requestId 做为用户调用的唯一标识，标识用户在整个系统中调用身份，由 _log.middware.ts_ 维护。打印调用日志时，请**务必打印 requestId，否则将无法知晓用户在系统中的调用过程**

**日志统一使用 _LogService_ 打印，线上代码不允许出现 _console.log_ !!!** 日志

## Config 配置

1. 配置采用 dotenv 包，由 _config.service.ts_ 提供服务
2. 配置先读取 _src/config.ts_，再读取根目录 _.env_，且如果 key 值相同，则使用 _.env_ 覆盖 _src/config.ts_

### 使用

```
import { ConfigService } from '@Config/config.service';

ConfigService.get(xxx);
```

## 示例代码: 开发一个功能模块

### 第一步 创建文件

1. 在 _src/app_ 下创建模块，例如 user 模块，则创建 _user.module.ts、user.controller.ts..._
2. 将 _user.controller.ts_ 和 _user.service.ts_ 加入 _user.module.ts_ 中

### 第二部 加入 appModule

将创建好的*user.module.ts* 加入 *app.module.ts*中，此时即可使用了

## 不足

1. 未做接口防刷
2. 未做 csrf 防御
3. 未做 XSS 防御，由于未涉及数据库，也不涉及单独返回数据（该项目请求微服务，将微服务返回的数据做转发），所以对输入输出都未做任何处理
