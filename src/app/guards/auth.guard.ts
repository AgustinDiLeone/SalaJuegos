import { inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);
  const resultado = authService.currentUser !== null;

  if (!resultado) {
    router.navigateByUrl('/auth');
    return false;
  }
  return true;
};
