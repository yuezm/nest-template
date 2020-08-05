import * as $protobuf from 'protobufjs';
import { Observable } from 'rxjs';
import { Metadata } from 'grpc';

export namespace example {
  interface IExampleReq {
    id?: (number | null);
  }

  interface IExampleRes {
    id?: (number | null);
    name?: (string | null);
  }

  class ExampleService extends $protobuf.rpc.Service {
    public searchExample(request: example.IExampleReq, metadata ?: Metadata): Observable<example.IExampleRes>;
  }
}
