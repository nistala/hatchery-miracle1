// import { inject } from '@angular/core';
// import {
//   HttpInterceptorFn,
//   HttpRequest,
//   HttpHandlerFn,
//   HttpErrorResponse
// } from '@angular/common/http';
// import { Router } from '@angular/router';
// // import { ValidationsService } from './validations.service';
// import { catchError, throwError } from 'rxjs';

// export const tokenInterceptorInterceptor: HttpInterceptorFn = (req, next: HttpHandlerFn) => {
//   const router = inject(Router);
//   // const validationService = inject(ValidationsService);

//   const token = sessionStorage.getItem('access_token');

//   const authReq = token
//     ? req.clone({
//         setHeaders: {
//           Authorization: `Bearer ${token}`,
//         },
//       })
//     : req;

//   return next(authReq).pipe(
//     catchError((err: HttpErrorResponse) => {
//       if (err.status === 401) {
//         sessionStorage.clear();
//         // validationService.showTailwindToast('Session expired. Please log in again.');
//         router.navigate(['/login']);
//       }

//       const error = err.error?.message || err.statusText;
//       return throwError(() => new Error(error));
//     })
//   );
// };
