// 返回值接口
export interface IResponse {
  traceId?: string;
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


