/**
 * 提供gRPC客户端、服务端proto配置
 * @param {string} url ,请求/监听地址，如果不赋值，nest 默认为 localhost:5000
 * @param {string} packageName，*.proto文件的package
 * @param {string} protoPath，*.proto文件的路径，路径以"protocol/"开始计算
 */
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

import { IGRPCClientOptions } from '@Helper/helper.interface';

export function composeGRPCClientOption({ url, package: _package, protoPath }: IGRPCClientOptions): GrpcOptions {
  return {
    transport: Transport.GRPC,
    options: {
      url,
      package: _package,
      protoPath,
      loader: {
        includeDirs: [ join(process.cwd(), 'proto') ],
        json: true,
      },
    },
  };
}
