import { concatStr } from '@/common/utils';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class ReqLogInterceptor implements NestInterceptor {
  private readonly logger: Logger;
  constructor() {
    this.logger = new Logger('REQUEST INTERCEPTOR', { timestamp: true });
  }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    /* *
     * Antes de processar o request, logar os detalhes da requisição
     * */
    this.logger.log(concatStr([req.method, req.originalUrl]));
    return next.handle().pipe(
      tap(() =>
        /* *
         * Após o processamento do request, logar os detalhes da resposta
         * */
        this.logger.log(
          concatStr([req.method, req.originalUrl, res.statusCode]),
        ),
      ),
    );
  }
}
