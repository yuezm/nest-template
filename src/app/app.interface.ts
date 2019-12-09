import { Request } from 'express';

// 返回值接口
export interface IResponseInterceptor {
  errcode: number;
  errmsg?: string;
  data?: any;
}

// 用户信息接口
export interface IUserInfo {
  userId: number;
  role?: number;
  name?: string;
}

// 请求对象接口扩展
export class IRequest extends Request {
  userInfo?: IUserInfo;
  cookies?: object; // cookie-parser 的cookie赋值，但是貌似cookie-parser内未声明
}

// 枚举注释接口
export interface IComment {
  description: string;
  enum: any[];
}
