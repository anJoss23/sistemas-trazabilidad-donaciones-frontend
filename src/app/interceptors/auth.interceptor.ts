import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // En los interceptores funcionales, usamos inject() para traer herramientas como el Router
  const router = inject(Router);

  // 1. Buscamos el token que guardamos al iniciar sesión
  const token = localStorage.getItem('token');
  let peticionClonada = req;

  // 2. Si el token existe, clonamos la petición y se lo pegamos en la cabecera
  if (token) {
    peticionClonada = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // 3. Enviamos la petición y estamos atentos por si el servidor rechaza el token (Error 403 o 401)
  return next(peticionClonada).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si el token caducó o no es válido, el backend nos dará 401 o 403
      if (error.status === 401 || error.status === 403) {
        console.warn('Sesión expirada. Redirigiendo al login...');
        localStorage.removeItem('token'); // Borramos el token inservible
        router.navigate(['/login']); // Lo pateamos a la pantalla de login
      }
      // Dejamos que el error siga su camino por si otro componente lo necesita
      return throwError(() => error);
    })
  );
};
