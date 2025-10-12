export class DTOMapper {
  static mapNullableProperties<Source extends NonNullable<unknown>>(
    source: Source,
    target: unknown,
    keys: (keyof Source)[],
  ): void {
    for (const key of keys) {
      const value = source[key];
      if (source[key] !== null && source[key] !== undefined) {
        target[key] = value;
      }
    }
  }

  static mapSameCaseProperties<Source extends NonNullable<unknown>>(
    source: Source,
    target: unknown,
    keys: (keyof Source)[],
  ): void {
    for (const key of keys) {
      const value = source[key];
      target[key] = value;
    }
  }
}
