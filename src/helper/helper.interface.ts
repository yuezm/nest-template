export interface IGRPCClientOption {
  readonly url: string; // gRPC server端地址
  readonly package: string; // proto buffer package名称
  readonly protoPath: string; // proto buffer路径，该路径忽略protocol，从protocol下一层开始计算
}

export interface ITableKeys {
  key: string;
  label: string;
}
