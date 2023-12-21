import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { AccountService } from './services/account.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private accountservice: AccountService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
    return this.isAuthenticated().pipe(
      tap((authenticated) => {
        if (!authenticated) {
          this.router.navigate(['/login']);
        }
      })
    );
  }

  private isAuthenticated(): Observable<boolean> {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      return of(false); 
    }
    return this.accountservice.getCurrentBalance(String(token)).pipe(
      map((balance) => true), 
      catchError((error) => {
        // Handle the error (e.g., token is invalid, expired)
        return of(false);
      })
    );
  }
}