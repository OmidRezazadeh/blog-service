import { type ArgumentsHost, Catch, HttpException, type RpcExceptionFilter } from '@nestjs/common';
import { type Observable, throwError } from 'rxjs';

/**
 * Forwards HTTP exceptions to the caller with their original status code.
 */
@Catch(HttpException)
export class HttpToRpcExceptionFilter implements RpcExceptionFilter<HttpException> {
  /**
   * Publishes the HTTP exception body as the RPC error payload.
   */
  catch(exception: HttpException, _host: ArgumentsHost): Observable<never> {
    return throwError(() => exception.getResponse());
  }
}
