export type FirstConstructorParameter<T extends new (...args: any) => any> =
  ConstructorParameters<T>[0];
