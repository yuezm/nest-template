import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Metadata } from 'grpc';

import { example } from '../proto';
import ExampleReq = example.ExampleReq;
import ExampleRes = example.ExampleRes;

@Controller()
export class AppController {
  @GrpcMethod('ExampleService', 'SearchExample')
  index(data: ExampleReq, metadata: Metadata): ExampleRes {
    console.log('get metadata：', metadata);
    return {
      id: data.id,
      name: 'example',
    };
  }
}
