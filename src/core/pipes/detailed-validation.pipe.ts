import { ValidationError, ValidationPipe } from '@nestjs/common';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';

export class DetailedValidationPipe extends ValidationPipe {
  createExceptionFactory(): (validationErrors?: ValidationError[]) => unknown {
    return (validationErrors: ValidationError[] = []) => {
      if (this.isDetailedOutputDisabled) {
        return new HttpErrorByCode[this.errorHttpStatusCode]();
      }
      const errors = validationErrors.map((item) => ({
        property: item.property,
        errors: item.constraints,
      }));
      return new HttpErrorByCode[this.errorHttpStatusCode](errors);
    };
  }
}
