import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LoginRequest, LoginResponse, User } from '../models';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly USER_ID_KEY = 'userId';
  private readonly USERNAME_KEY = 'username';

  private currentUserSubject = new BehaviorSubject<User | null>(this.getCurrentUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Initialize user state from localStorage (only on browser)
    if (this.isBrowser()) {
      const user = this.getCurrentUser();
      if (user) {
        this.currentUserSubject.next(user);
      }
    }
  }

  /**
   * Check if running in browser
   */
  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  login(username: string, password: string): Observable<LoginResponse> {
    const loginRequest: LoginRequest = { username, password };

    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, loginRequest)
      .pipe(
        tap((response: LoginResponse) => {
          if (this.isBrowser()) {
            // Store user data in localStorage
            localStorage.setItem(this.USER_ID_KEY, response.userId.toString());
            localStorage.setItem(this.USERNAME_KEY, response.username);

            // Update current user subject
            const user: User = {
              userId: response.userId,
              username: response.username
            };
            this.currentUserSubject.next(user);
          }
        }),
        catchError(this.handleError)
      );
  }


   // Logout user and clear localStorage
  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem(this.USER_ID_KEY);
      localStorage.removeItem(this.USERNAME_KEY);
    }
    this.currentUserSubject.next(null);
  }


   // Check if user is authenticated
  isAuthenticated(): boolean {
    if (!this.isBrowser()) {
      return false;
    }
    const userId = localStorage.getItem(this.USER_ID_KEY);
    const username = localStorage.getItem(this.USERNAME_KEY);
    return !!(userId && username);
  }

   //Get current user from localStorage
  getCurrentUser(): User | null {
    if (!this.isBrowser()) {
      return null;
    }

    const userId = localStorage.getItem(this.USER_ID_KEY);
    const username = localStorage.getItem(this.USERNAME_KEY);

    if (userId && username) {
      return {
        userId: parseInt(userId, 10),
        username: username
      };
    }

    return null;
  }

   // Get current user ID
  getUserId(): number | null {
    if (!this.isBrowser()) {
      return null;
    }
    const userId = localStorage.getItem(this.USER_ID_KEY);
    return userId ? parseInt(userId, 10) : null;
  }

  // Get current username
  getUsername(): string | null {
    if (!this.isBrowser()) {
      return null;
    }
    return localStorage.getItem(this.USERNAME_KEY);
  }

  // Handle HTTP errors
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred during login';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 401) {
        errorMessage = 'Invalid username or password';
      } else if (error.status === 0) {
        errorMessage = 'Unable to connect to server. Please check if the API is running.';
      } else {
        errorMessage = `Server error: ${error.status} - ${error.message}`;
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}
