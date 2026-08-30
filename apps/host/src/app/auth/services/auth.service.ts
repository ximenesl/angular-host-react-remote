import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { AuthCredentials, AuthResponse, User } from '@mfe/shared-types';

const TOKEN_KEY = 'mfe_auth_token';
const USER_KEY = 'mfe_auth_user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly userState = signal<User | null>(this.getStoredUser());
  private readonly tokenState = signal<string | null>(this.getStoredToken());

  public readonly currentUser = computed(() => this.userState());
  public readonly isAuthenticated = computed(() => !!this.tokenState() && !!this.userState());

  public login(credentials: AuthCredentials): Observable<AuthResponse> {
    if (!credentials.email || !credentials.passwordHash) {
      return throwError(() => new Error('Credenciais de acesso inválidas.'));
    }

    // Simulação de autenticação via API com payload estritamente tipado
    const mockUser: User = {
      id: 'usr_89213',
      name: 'Lucas Ximenes',
      email: credentials.email,
      role: 'ADMIN',
    };

    const mockResponse: AuthResponse = {
      user: mockUser,
      accessToken: `mock_jwt_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      expiresAt: Date.now() + 3600 * 1000,
    };

    return of(mockResponse).pipe(
      delay(800),
      tap((response) => this.persistSession(response))
    );
  }

  public logout(): void {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    this.tokenState.set(null);
    this.userState.set(null);
    this.router.navigate(['/auth/login']);
  }

  public getRawToken(): string | null {
    return this.tokenState();
  }

  private persistSession(authData: AuthResponse): void {
    sessionStorage.setItem(TOKEN_KEY, authData.accessToken);
    sessionStorage.setItem(USER_KEY, JSON.stringify(authData.user));
    this.tokenState.set(authData.accessToken);
    this.userState.set(authData.user);
  }

  private getStoredToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  private getStoredUser(): User | null {
    const data = sessionStorage.getItem(USER_KEY);
    if (!data) return null;
    try {
      return JSON.parse(data) as User;
    } catch {
      sessionStorage.removeItem(USER_KEY);
      return null;
    }
  }
}
