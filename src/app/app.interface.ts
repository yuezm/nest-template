import { Request } from 'express';

// 返回值接口
export interface IResponseInterceptor {
  errcode: number;
  errmsg?: string;
  data?: any;
}

// 用户信息接口
export interface IUserInfo {
  userId?: number;
  role?: number;
  name?: string;
}

// 请求对象接口扩展
export interface IRequest extends Request {
  requestId: string;
  userInfo?: IUserInfo;
}

// 枚举注释
export interface IComment {
  description: string;
  enum: any[];
}
