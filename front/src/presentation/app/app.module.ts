import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from "@angular/core";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {ReactiveFormsModule} from "@angular/forms";
import {IonicModule, IonicRouteStrategy} from "@ionic/angular";
import {BrowserModule} from "@angular/platform-browser";
import {CommonModule} from "@angular/common";
import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from "./app.component";
import {RouteReuseStrategy} from "@angular/router";
import {HttpTokenInterceptor} from "./core/http-interceptor/http-token-interceptor";
import {HttpRetryInterceptor} from "./core/http-interceptor/http-retry-interceptor";
import {HttpErrorInterceptor} from "./core/http-interceptor/http-error-interceptor";

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [AppComponent],
  imports: [
    CommonModule,
    BrowserModule,
    IonicModule.forRoot({ mode: 'ios' }),
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpTokenInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRetryInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(
    /**
     * All the services below are used to communicate with a
     * registered ServiceWorker in a web browser.
     * */
  ) {}

}
