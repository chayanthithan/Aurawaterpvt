import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, tap, throwError } from 'rxjs';

export interface AuthResponse {
  access_token: string; // JWT access token
  refresh_token: string; // refresh token
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly API_BASE = 'https://api.finspire.lk/api/v1/auth';
  // private readonly API_BASE = 'http://localhost:8081/api/v1/auth';

  // Expose auth state so components/guards can react
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidAccessToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<void> {
    const url = `${this.API_BASE}/authendicate`;
    return this.http.post<any>(url, { email, password }).pipe(
      tap((res) => {
        const access = res?.access_token || res?.accessToken || res?.token || res?.jwt;
        const refresh = res?.refresh_token || res?.refreshToken;
        if (!access || !refresh) {
          throw new Error('Auth response missing tokens');
        }
        this.storeTokens(access, refresh);
      }),
      tap(() => this.isAuthenticatedSubject.next(true)),
      map(() => void 0)
    );
  }

  logout(): void {
    this.clearTokens();
    this.isAuthenticatedSubject.next(false);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  storeTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  updateAccessToken(accessToken: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
  }

  clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  refreshAccessToken(): Observable<string | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return of(null);
    }
    const url = `${this.API_BASE}/refresh-token`;
    return this.http.post<any>(url, { refresh_token: refreshToken }).pipe(
      tap((res) => {
        // Important: do NOT invalidate refresh token here; keep it valid across refreshes.
        const newAccess = res?.access_token || res?.accessToken || res?.token || res?.jwt;
        const newRefresh = res?.refresh_token || res?.refreshToken;
        if (newAccess) {
          this.updateAccessToken(newAccess);
        }
        if (newRefresh) {
          localStorage.setItem(this.REFRESH_TOKEN_KEY, newRefresh);
        }
      }),
      map((res) => (res?.access_token || res?.accessToken || res?.token || res?.jwt) ?? null),
      catchError((err: HttpErrorResponse) => {
        // If refresh fails, force logout
        this.logout();
        return of(null);
      })
    );
  }

  hasValidAccessToken(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;
    const isExpired = this.isTokenExpired(token);
    return !isExpired;
  }

  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1] || ''));
      const exp = payload?.exp;
      if (!exp) return false;
      const nowInSeconds = Math.floor(Date.now() / 1000);
      return exp <= nowInSeconds;
    } catch (e) {
      return true;
    }
  }
}
