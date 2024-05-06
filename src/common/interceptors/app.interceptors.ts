import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, map } from 'rxjs';
import { ResponseMassageKey } from '../decorator/response.decorater';

@Injectable()
export class AppIntercepter implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const responseMassage = this.reflector.get<string>(
      ResponseMassageKey,
      context.getHandler(),
    );

    return next.handle().pipe(
      map((data) => ({
        data: data,
        massage: responseMassage,
        statusCode: context.switchToHttp().getResponse().statusCode,
      })),
    );
  }
}
