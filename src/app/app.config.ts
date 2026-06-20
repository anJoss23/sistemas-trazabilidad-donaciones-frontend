import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // <-- Actualizado
import { authInterceptor } from './interceptors/auth.interceptor'; // <-- Importamos tu interceptor

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // Le pasamos el interceptor al HttpClient
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};
