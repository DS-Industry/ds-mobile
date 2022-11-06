import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { HttpException, HttpStatus } from '@nestjs/common';
import { validateOrReject } from 'class-validator';

export const RequestHeader = createParamDecorator(
  async (value: any, ctx: ExecutionContext) => {
    // extract headers
    const headers = ctx.switchToHttp().getRequest().headers;

    // Convert headers to DTO object
    const dto = plainToClass(value, headers, { excludeExtraneousValues: true });

    // Validate
    const errors: ValidationError[] = await validate(dto);

    // return header dto object
    return validateOrReject(dto).then(
      (res) => {
        return dto;
      },
      (err) => {
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: 'MissingAuthorizationHeader',
            message: 'Faild to validate headers',
          },
          HttpStatus.FORBIDDEN,
        );
      },
    );
  },
);
