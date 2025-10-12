import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: false })
class IsBase64JsonConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments): boolean {
    try {
      const decoded = Buffer.from(value, 'base64').toString('utf-8');

      JSON.parse(decoded);

      return true;
    } catch (error) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments): string {
    return 'The string is not a valid Base64 encoded JSON';
  }
}

export function IsBase64Json(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsBase64JsonConstraint,
    });
  };
}
