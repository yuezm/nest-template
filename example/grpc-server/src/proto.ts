import * as grpc from 'grpc';
import { Observable } from 'rxjs';
/** Namespace example. */
export namespace example {

    /** Contains all the RPC service clients. */
    export interface ClientFactory {

        /**
         * Returns the ExampleService service client.
         */
        getExampleService(): example.ExampleService;
    }

    /** Builder for an RPC service server. */
    export interface ServerBuilder {

        /**
         * Adds a ExampleService service implementation.
         * @param impl ExampleService service implementation
         */
        addExampleService(impl: example.ExampleService): example.ServerBuilder;
    }

    /** Properties of an ExampleReq. */
    export interface ExampleReq {

        /** ExampleReq id */
        id?: (number|null);
    }

    /** Properties of an ExampleRes. */
    export interface ExampleRes {

        /** ExampleRes id */
        id?: (number|null);

        /** ExampleRes name */
        name?: (string|null);
    }

    /** Constructs a new ExampleService service. */
    export interface ExampleService {

        /**
         * Calls SearchExample.
         * @param request ExampleReq message or plain object
         * @param metadata Optional metadata
         * @returns Promise
         */
        searchExample(request: example.ExampleReq, metadata?: grpc.Metadata): Observable<example.ExampleRes>;
    }
}
