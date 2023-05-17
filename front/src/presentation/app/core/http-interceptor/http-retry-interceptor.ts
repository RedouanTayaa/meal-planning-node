import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { concatMap, delay, retryWhen } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HttpRetryInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      retryWhen((error) =>
        error.pipe(
          concatMap((error: { status?: number }, count) => {
            if (count <= 2 && error.status == 503) {
              return of(error);
            }
            return throwError(error);
          }),
          delay(2000)
        )
      )
    );
  }
}
