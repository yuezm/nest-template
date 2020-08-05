import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Metadata } from 'grpc';

import { example } from '../proto';
import IExampleReq = example.IExampleReq;
import IExampleRes = example.IExampleRes;

@Controller()
export class AppController {
  @GrpcMethod('ExampleService', 'SearchExample')
  index(data: IExampleReq, metadata: Metadata): IExampleRes {
    console.log('get metadata：', metadata);
    return {
      id: data.id,
      name: 'example',
    };
  }
}
