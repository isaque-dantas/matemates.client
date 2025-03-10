import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {authInterceptor} from "./interceptors/auth.interceptor";
import {toastLoggerInterceptor} from "./interceptors/toast-logger.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor, toastLoggerInterceptor])), provideAnimationsAsync()
  ]
};

export const backendApiIp = "10.81.50.55"
