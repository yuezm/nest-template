## 安装

```bash
$ npm install  # 开发环境
$ npm install --production # 生产环境
```

## Running

```bash
# develop
$ npm run dev

# production with docker
$ npm run startup:docker

# production without docker
$ npm run startup
```

## Build

```bash
# build app
$ npm run build

# build docker image
$ npm run build:docker

# build proto buffer
$ npm run build:protocol
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

## 规范

### 目录

#### src

项目源码

##### src/app

存放于业务模块，文件按业务拆分，**请注意，该项目文件未按照角色拆分，而是按照业务模块拆分，即同模块下，controller、service、module、dto、dto、static 存放于一个文件夹下**

- \*.controller.ts: 控制器，负责数据校验，数据组装，**请注意，controller 不负责重逻辑，重逻辑请放置于 service!!!**
- \*.service.ts: 业务处理，例如发起 gRPC 请求
- \*.dto.ts: 向前端接收的数据实体
- \*.do.ts: 向服务端（数据库）接收的数据实体
- \*.static.ts: 当前模块下的枚举，接口定义

_目前未严格区分 do、dto，如何使用请自行决定_

tips: 如果业务模块过于复杂，可以再进行拆分，一切以好维护为准，如下所示

```
- user // user业务模块
  - password // 密码模块
    - user.password.controller.ts
    - user.password.service.ts
    - user.password.dto.ts
    ...
  - role // 角色模块
    - user.role.controller.ts
    - user.role.service.ts
    - user.dto.service.ts
    ...

  test.module.ts
  test.service.ts
  test.dto.ts
```

##### src/common

存放公用包，如 nest 定义的不同角色的模块

- decorator: 通用装饰器

  - common.decorator.ts: 通用装饰器文件
  - transform.decorator.ts: 负责数据实体转换、类型校验等的装饰器文件
  - user.decorator.ts: 负责用户信息设置、获取、权限设置等的装饰器文件

- filter: 通用异常过滤器

  - all.exception.filter.ts: 通用所有异常捕获

- guards: 通用守卫

  - auth.guards.ts: 登录权限守卫
  - role.guards.ts: 角色权限守卫

- interceptor: 通用拦截器

  - response.interceptor.ts: 返回值统一格式序列化，使用方法，如下所示

  ```
  class TestController{

    @Get('/')
    @ResponseSerialize(*.Dto, true);
    index(){
      //
    }
  }
  ```

  tips: ResponseSerialize 接收第二个参数，如果为 true，则代表生成 swagger 的`ApiOkResponse()`，详细可查看 _transform.decorator.ts_

* middware: 通用中间件

  - log.middware.ts: 服务入口通用日志打印

* module: 通用模块
  - log 模块: 日志打印模块 ==> log.service.ts
  - config 模块: 服务配置 ==> config.service.ts

##### src/config

系统配置文件

##### src/helper

工具函数，**请注意，增加工具函数，请增加测试!!!**

##### src/boot.ts

启动前脚本，为在启动服务前需要执行的脚本，例如本项目的 require hack

##### main.ts

入口文件

- 加载启动前脚本
- 执行引导
- HTTP 启动时，端口占用处理
- 错误捕获

### 命名

1. 文件夹命名: 文件夹命名统一小写，如果存在多单词，则使用*短横线*连接
2. 文件命名: 文件名统一小写，且按照角色命名，如果存在多单词，则使用 "." 连接
3. class 命名: 采用大驼峰结构，例如
4. 方法命名: 采用小驼峰结构
5. 枚举: 必须以大写字母"E"起始；内部必须采用**大写字母**，或大写字符加下划线
6. interface: 以大写字母"I"起始；
7. type 以大写字母"T"开始；
8. 常量以小写字母"k"起始、全大写字母、大写字母加下划线
9. 变量采用小驼峰结构，私有变量可以使用*\_\_*起始

```
文件夹: user、user-detail
文件: user.controller.ts、user.detail.controller.ts
class: Class UserController {}
method: indexUser(){}
枚举: enum EUser { SEX = 0, USER_SEX = 1};
interface: interface IUser {};
type: type TUser {}
常量: const kUserName; const USER_NAME;
变量: const userName; const __userName;
```

### 开发规范

tips: nest 自带 rxjs，涉及到数据操作，可使用 rxjs API，非必要时，可以不用引数据操作的包

#### controller 开发

1. controller 必须使用 ApiUseTags 注释，注释规则 _路由路径: 模块中文名_，例如 `@ApiUseTags('user: 用户模块')`
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

   - GET 方法（列表查询）: 以*index*起始，例如 `indexUser(){}`
   - GET 方法（检索查询）: 以*show*起始，例如 `showUser(){}`
   - GET 方法（导出）：以*export*起始，例如 `exportUser(){}`
   - POST 方法 （新增）: 以*create*起始，例如 `createUser(){}`
   - PUT 方法（编辑）: 以*update*起始，例如 `updateUser(){}`
   - DELETE 方法（删除）: 以*delete*起始，例如 `deleteUser(){}`
   - 测试方法: 以*test*起始，例如 `testUser(){}`

**其余特殊方法可自行命名**

4. controller method 必须定义 swagger 注释 `@ApiOperation()`
5. controller method 如果返货为 JSON 格式的标准输出数据，则需要以`@ResponseSerialize(XX)`转化，否则会以原有格式返回。_请注意，除了导出文件，一般都需要转换_

#### service 开发

1. service 内部方法命名方式可选择和 controller 保持一致，也可选择和 protobuffer 方法名保持一致，**请注意，尽量选择一种规范**
2. **service 调用日志**: service 可使用日志装饰器`@Log()`，该装饰器会打印 service 进出日志，如果开启 DEBUG（[如何开启 DEBUG 日志](#DEBUG)），则会打印 service 的完整输出，**使用该装饰器时，service 必须接受第一个参数为 Request 实体，该实体由 controller 传输**，如下所示。

传输 Request 实体原因:

1. 调用日志打印必须存在 traceId，traceId 存在于 Request 对象，而 service 无法获取 Request 对象
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

#### dto 开发

1. dto 属性必须存在 swagger 注释`@ApiProperty()`或`ApiPropertyOptional()`; 请注意 required 属性，如果前端 \*.d.ts 是根据此 swagger 文档生成，会对前端传参造成影响
2. 是否需要 \*_.do.ts_ 开发者自己决定
3. 如果 dto 太多，则需要拆分文件，按照 [src/app 示例](#src/app) 拆分

### Git 规范

---

## Log

日志

1. 日志采用 winston，由 _log.service.ts_ 提供服务
2. 日志按天切割，例如 _2020-3-31.log_、_2020-4-01.log_
3. 日志文件路径配置存在于 _src/config/index.ts_ 文件下 `LOG_PATH`

日志信息示例：

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

线上日志默认关闭 DEBUG，只会打印服务的调用流程，而不会打印完整的信息，可以在 url 参数中加入**DEBUG=1** 开启 DEBUG 模式。_请注意，如果使用 `LogService.debug()` 时，请注意调用参数_

#### traceId

traceId 做为用户调用的唯一标识，标识用户在整个系统中调用身份，由 _log.middware.ts_ 维护。打印调用日志时，请**务必打印 traceId，否则将无法知晓用户在系统中的调用过程**

**日志统一使用 _LogService_ 打印，线上代码不允许出现 _console.log_ !!!**

## Config

配置

1. 配置采用 dotenv 包，由 _config.service.ts_ 提供服务
2. 配置先读取 _src/config.ts_，再读取根目录 _.env_，且如果 key 值相同，则使用 _.env_ 覆盖 _src/config.ts_

tips: 请注意，**src/config.ts 只放置通用配置**，对**不同环境配置**或**敏感信息配置**不要放在此处!!!，请在配置工程目录中配置环境变量!!!

### 使用

```
import { ConfigService } from '@Config/config.service';

ConfigService.get(xxx);
```

## 开发示例

## 不足

1. 未做接口防刷（预计是在网关处理）
2. 未做 csrf 防御
3. 由于未涉及数据库，也不涉及单独返回数据（该项目请求微服务，将微服务返回的数据做转发），所以对输入输出都未做任何处理
