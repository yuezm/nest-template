export function Logger(): MethodDecorator {
  return (target, propertyKey, descriptor: TypedPropertyDescriptor<any>): void => {
    Reflect.defineMetadata('HAHA', 'HHH', descriptor.value);
  };
}
