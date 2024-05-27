import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isNotUrl', async: false })
export class IsNotUrl implements ValidatorConstraintInterface {
  validate(value: any) {
    const urlRegex =
      /[(http(s)?)://(www.)?a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/gi;

    return !urlRegex.test(value);
  }

  defaultMessage() {
    return 'This field must not be a URL';
  }
}
