import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree | Observable<boolean | UrlTree> {
    // If we already have a valid access token, allow
    if (this.authService.hasValidAccessToken()) {
      return true;
    }

    // If we have a refresh token, attempt to refresh and then allow
    const refreshToken = this.authService.getRefreshToken();
    if (refreshToken) {
      return this.authService.refreshAccessToken().pipe(
        map((newAccess) => {
          if (newAccess) return true;
          return this.router.createUrlTree(['/login']);
        }),
        catchError(() => of(this.router.createUrlTree(['/login'])))
      );
    }

    // Otherwise redirect to login
    return this.router.createUrlTree(['/login']);
  }
}
