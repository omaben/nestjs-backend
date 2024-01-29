import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  NotFoundException,
  RequestTimeoutException,
  ConflictException,
  BadRequestException,
  HttpException
} from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { Log } from './log.helper';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const apiId = uuidv4();
    let request: any;
    let originalUrl;
    let method;
    let body;
    let params;
    let headers;
    let authUser;

    if (context.getType() === 'http') {
      const httpContext = context.switchToHttp();
      request = httpContext.getRequest();

      body = request.body ? JSON.parse(JSON.stringify(request.body)) : undefined;
      params = request.params ? JSON.parse(JSON.stringify(request.params)) : undefined;
      originalUrl = request.originalUrl;
      headers = request.headers ? JSON.parse(JSON.stringify(request.headers)) : undefined;
      method = request.method;
      authUser = request.authUser;

      // TOTO Encrype and save in log
      if (headers?.authorization) headers.authorization = '-';
      if (headers?.bearer) headers.bearer = '-';
      if (headers?.cookie) headers.cookie = '-';
      if (headers?.['apim-token']) headers['apim-token'] = '-';
      if (body?.password) body.password = '-';

      Log.debug({
        type: context.getType(),
        title: 'callAPI',
        message: `REQ::${method}:${originalUrl}`,
        tag: `req,request,${originalUrl},${apiId},${method}`,
        meta: {
          originalUrl,
          body,
          params,
          headers,
          method,
          authUser
        }
      });
    }

    const now = Date.now();
    return next
      .handle()
      .pipe(
        catchError(err => {
          console.log('Interceptor ERROR::', err);

          Log.error({
            type: context.getType(),
            title: 'callAPI',
            message: `RES::${method}:${originalUrl}`,
            tag: `res,response,${originalUrl},${apiId},${method}`,
            meta: {
              latency: `${Date.now() - now}ms`,
              error: err,
              errorMessage: err?.message,
              errorCode: err?.code,
              errorStatusCode: err?.statusCode,
              stack: err?.stake,
              originalUrl,
              body,
              params,
              headers,
              method,
              authUser
            }
          });

          if (err instanceof TimeoutError) {
            return throwError(() => new RequestTimeoutException());
          }
          else if (err instanceof LoggingInterceptor) {
            return throwError(() => new NotFoundException(err));
          }
          else if (err.code == 11000) {
            return throwError(() => new ConflictException({ ...err, code: 409, message: 'Duplicated' }));
          }
          else {
            const code = err?.code || err?.statusCode || err?.status || 400;

            return throwError(() => new HttpException(
              {
                message: err?.response?.message || err?.message,
                code: code
              },
              code
            ));
          }
        }),
        tap(() => {
          const response = context.switchToHttp().getResponse();

          Log.debug({
            type: context.getType(),
            title: 'callAPI',
            message: `RES::${method}:${originalUrl}`,
            tag: `res,response,${originalUrl},${apiId},${method}`,
            meta: {
              latency: `${Date.now() - now}ms`,
              statusCode: response.statusCode,
              originalUrl,
              body,
              params,
              headers,
              method,
              authUser
            }
          });
        }),
      );
  }
}