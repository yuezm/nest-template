// -------------------------------------- 通用 --------------------------------------

// 空校验
export function isEmpty(value: unknown): boolean {
  return value === '' || value === undefined || value === null;
}

// 非空校验
export function isNotEmpty(value: unknown): boolean {
  return !isEmpty(value);
}

export * from './formate';
export * from './gRpc';
