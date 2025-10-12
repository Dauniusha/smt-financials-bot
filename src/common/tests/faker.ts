import { faker } from '@faker-js/faker';

export class Faker {
  readonly base = faker;

  register<T extends object>(constructor: new () => T): this & T {
    const extendInstance = new constructor();

    const result = {
      ...this,
      ...extendInstance,
    };

    return this.copyMethods(result, this, extendInstance);
  }

  private copyMethods<T extends object>(result: T, ...sources: object[]): T {
    for (const source of sources) {
      const prototype = Object.getPrototypeOf(source);

      for (const key of Object.getOwnPropertyNames(prototype)) {
        result[key] = source[key];
      }
    }

    return result;
  }
}
