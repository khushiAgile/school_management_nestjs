import { HttpException, HttpStatus } from '@nestjs/common';

export const AuthExceptions = {
  TokenExpired(): any {
    return new HttpException(
      {
        message: 'Token Expired use RefreshToken',
        error: 'TokenExpiredError',
        statusCode: HttpStatus.FORBIDDEN,
      },
      HttpStatus.FORBIDDEN,
    );
  },

  InvalidToken(): any {
    return new HttpException(
      {
        message: 'Invalid Token',
        error: 'InvalidToken',
        statusCode: HttpStatus.FORBIDDEN,
      },
      HttpStatus.FORBIDDEN,
    );
  },

  ForbiddenException(): any {
    return new HttpException(
      {
        message: 'This resource is forbidden from this user',
        error: 'UnAuthorizedResourceError',
        statusCode: HttpStatus.FORBIDDEN,
      },
      HttpStatus.FORBIDDEN,
    );
  },

  InvalidPassword(): any {
    return new HttpException(
      {
        message: 'Invalid password',
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  },

  InavalidCredantial(): any {
    return new HttpException(
      {
        message: 'Invalid email or password',
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  },
};
