import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsJsonConstraint implements ValidatorConstraintInterface {
  validate(text: string) {
    try {
      JSON.parse(text);
      return true;
    } catch (e) {
      return false;
    }
  }

  defaultMessage(validationArguments?: ValidationArguments) {
    const propertyName = validationArguments?.property;
    return `${propertyName}: Text ($value) is not valid JSON!`;
  }
}

export function IsJson(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsJsonConstraint,
    });
  };
}
