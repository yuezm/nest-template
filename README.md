## Installation

```bash
$ npm install
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

1. src/app 存放于业务模块，文件按业务拆分，**该项目文件未按照角色拆分，而是按照模块拆分，即同模块下，controller、service、module、dto、dto、static 存在一处**

   - \*.controller.ts: 控制器，负责数据校验，数据组装，**不负责重逻辑，重逻辑请放置于 service!!!**
   - \*.service.ts: 主要业务逻辑处理
   - \*.dto.ts: 向前端接收的数据实体
   - \*.do.ts: 向服务端（数据库）接收的数据实体
   - \*.static.ts: 当前模块下的枚举，接口定义

2. src/common 存放公用包

   - decorator: 通用装饰器
     - common.decorator.ts: 通用装饰器文件
     - transform.decorator.ts: 负责数据实体转换、类型校验等的装饰器文件
     - user.decorator.ts: 负责用户信息设置、获取、权限设置等的装饰器文件
   - filter: 通用异常过滤器
   - guards: 通用守卫
     - auth.guards.ts: 登录权限守卫
     - role.guards.ts: 角色权限守卫
   - interceptor: 通用拦截器
     - response.interceptor.ts: 返回值统一格式组装，使用方法: `@ResponseSerialize(*.Dto)`，tips，ResponseSerialize 接收第二个参数，如果为 true，则代表生成 swagger 的`ApiOkResponse()`
   - middware: 通用中间件
     - log.middware.ts: 服务入口通用日志打印
   - module: 通用模块
     - log 模块: 日志打印模块 ==> log.service.ts
     - config 模块: 服务配置 ==> config.service.ts

3. src/config: 系统配置文件。**请注意，该处只放置通用配置，对不同环境配置或敏感信息配置 不要放在此处!!!，请在配置工程目录中配置环境变量!!!**

4. src/helper: 工具函数，**增加工具函数，请增加测试!!!**

5. src/boot.ts: 启动前脚本，为在启动服务前需要执行的脚本

6. main.ts 入口文件

   - 加载启动前脚本
   - 执行引导
   - HTTP 启动时，端口占用处理
   - 全局错误捕获

### 命名

1. 文件夹命名: 文件夹命名统一小写，如果存在多单词，则使用*短横线*连接，例如`user-detail`
2. 文件命名: 文件名统一小写，且按照角色命名，如果存在多单词，则使用*.*连接，例如 `user.controller.ts、user.detail.controller.ts`
3. class 命名: 采用大驼峰结构
4. 方法命名: 采用小驼峰结构
5. 枚举内部: 必须采用**大写字母**，或大写字符加下划线
6. interface 以大写字母"I"开始；type 以大写字母"T"开始；enum 以大写字母"E"开始；常量以小写字母"k"起始

```
文件夹: user、user-detail
文件: user.controller.ts、user.detail.controller.ts
class: Class UserController {}
method: indexUser(){}
常量: const kUserName = '';
枚举: enum EUser { SEX = 0, USER_SEX = 1};
interface: interface IUser {};
type: type TUser {}
```

### 开发规范

1. nest 自带 rxjs，涉及到数据操作，可使用 rxjs API，非必要时，可以不用引数据操作的包

#### controller 开发

1. controller 必须使用 ApiUseTags 注释，注释规则: `@ApiUseTags('user: 用户模块')`
2. controller import 文件放置
   - 顶层放置: 三方包或 Node STL
   - 中间放置: 自身的文件
   - 底层放置: 对 protocol 文件的引用

```
import { Controller, Get, Req } from '@nestjs/common'
import {} from 'fs';

import { UserService } from '@App/user/user.service';

import { user } from '@Protocol/user.d.ts';
```

3. controller 内方法命名

   - GET 方法（列表查询）: 以*index*起始，例如`indexUser(){}`
   - GET 方法（检索查询）: 以*show*起始，例如`showUser(){}`
   - POST 方法 （新增）: 以*create*起始，例如`createUser(){}`
   - PUT 方法（编辑）: 以*update*起始，例如`updateUser(){}`
   - DELETE 方法（删除）: 以*delete*起始，例如`deleteUser(){}`
   - 任意方法（测试方法）: 以*test*起始，例如`testUser(){}`

**其余特殊方法可单独命名**

4. controller method 必须定义 swagger 注释 `@ResponseSerialize(XX,true); @ApiOperation()`
5. controller method 如果返货为 JSON 格式、标准输出数据，则需要以`@ResponseSerialize(XX)`转化，否则会以原有格式返回

#### service 开发

1. service 可使用日志装饰器`@Log()`，_该装饰器会打印 service 进出日志，如果开启 DEBUG，则会打印 service 的完整输出_，**使用该装饰器时，service 必须接受第一个参数为 Request 实体，该实体由 controller 传输**，如下所示。

传输 Request 实体原因:

1. 日志打印必须存在 requestId，而 service 无法获取
2. 日志打印时，会开启 DEBUG 判断，该参数从 query 传递，service 无法主动获取

```
// ---- user.controller.ts ----

@Controller('v1/user')
@ApiUseTags('user: 用户模块')
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Get('/')
  testUser(@Req() req: IRequest): string {
    return this.userService.test(req, true);
  }
}


// ---- user.service.ts ----
@Injectable()
export class UserService {
  @Log()
  test(req: IRequest, query: boolean): string {
    if (query) {
      return 'hello，nest';
    }
    return  'hello，word'
  }
}
```

2. service 命名方式可选择和 controller 保持一致

#### dto 开发

1. dto 属性必须存在 swagger 注释`@ApiModelProperty()`;

### 日志

1. 日志采用 winston 包，按天切割
2. 日志统一使用`LogService打印`，不允许出现`console.log`!!!
3. 线上日志默认关闭 DEBUG，只会打印服务的调用流程，而不会打印完整的信息，可以在 url 参数中加入`?DEBUG=1`开启 DEBUG 模式，tips 时，如果使用`LogService.debug`时，请注意调用参数
