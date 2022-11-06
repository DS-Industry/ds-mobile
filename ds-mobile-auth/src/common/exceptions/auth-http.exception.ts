import { HttpException, HttpStatus, ValidationError } from "@nestjs/common";
export const AUTHENTIFICATION_EXCEPTION_TYPE = 'authentification';

export class AuthHttpException extends HttpException {
  constructor(message: string[] = null) {
    super(
      {
        error: 'Authentification request error',
        type: AUTHENTIFICATION_EXCEPTION_TYPE,
        message: message,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
