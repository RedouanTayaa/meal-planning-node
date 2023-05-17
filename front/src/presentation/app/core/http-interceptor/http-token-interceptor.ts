import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpTokenInterceptor implements HttpInterceptor {

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const accessToken = '';
    if (accessToken) {
      request = request.clone({
        withCredentials: true,
        headers: request.headers
          .set('Authorization', `Bearer ${accessToken}`)
          .set('Access-Control-Allow-Credentials', 'true'),
      });
    } else {
      request = request.clone({
        withCredentials: true,
        headers: request.headers.set(
          'Access-Control-Allow-Credentials',
          'true'
        ),
      });
    }
    return next.handle(request);
  }
}
