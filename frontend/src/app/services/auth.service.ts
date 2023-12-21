import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, catchError, map, of } from 'rxjs';

import { getHeaders, getServerUrl } from './http-environment';
import { Account, AccountBalance, AccountService } from './account.service';

export interface Credential {
  token: string,
  owner: Account
}
export interface LoginInfo {
  login: string,
  password: string
}
export interface RegistrationInfo extends LoginInfo {
  firstname: string,
  lastname: string
}

/**
 * Mit dem Authentication Service können neue Benutzer angelegt und
 * kann in existierende Accounts eingeloggt werden.
 */
@Injectable({providedIn: 'root'})
export class AuthService {
  constructor(private http: HttpClient , private accountservice: AccountService) {
  }

  /**
   * Registriert einen neuen Benutzer im System und gibt den Benutzer mit der
   * generierten Account Nummer zurück. Ein neuer Benutzer erhält 1000.- CHF
   * Startguthaben vom System. Neue Accounts enthalten noch keine Transaktionen.
   * @param model Spezifiziert den Namen, sowie den Benutzernamen und das Password des neuen Users.
   * @example Gibt das Resultat im folgenden Format zurück:
   * ```json
   * {
   *    "login": "mHans",
   *    "firstname": "Hans",
   *    "lastname": "Muster",
   *    "accountNr": "1000004"
   * }
   * ```
   */
  public register(model: RegistrationInfo): Observable<Account> {
    return this.http.post<Account>(
      getServerUrl('/auth/register'),
      JSON.stringify(model),
      getHeaders());
  }

  /**
   * Sucht nach dem angegebenen Login und überprüft das spezifizierte Passwort.
   * Gibt das JWT Token sowie den gefundenen Account zurück, falls der User gefunden wurde.
   * Ansonsten wird der Request mit einem Status-Code 404 beantwortet.
   * @param model Spezifiziert den Benutzernamen und das Password des Users.
   * @example Gibt das Resultat im folgenden Format zurück:
   * ```json
   * {
   *    "token": "eyJhbGci...",
   *    "owner":
   *    {
   *       "login": "user1",
   *       "firstname": "Bob",
   *       "lastname": "Müller",
   *       "accountNr": "1000001"
   *    }
   * }
   * ```
   */
  public login(model: LoginInfo): Observable<Credential> {
    return this.http.post<Credential>(
      getServerUrl('/auth/login'),
      JSON.stringify(model),
      getHeaders());
  }

  public getJwtToken(): String{
    return (String(localStorage.getItem('jwt_token')));
  }

  //public isAuthenticated(): Observable<boolean> {
  //  return this.accountservice.getCurrentBalance(String(localStorage.getItem('jwt_token')))
  //    .pipe(
  //      map(balance => true), // If successful, consider the user as authenticated
  //      catchError(error => of(false)) // Return false in case of an error
  //    );
  //}



  //isLoggedIn(): boolean {
  //  
  //  this.accountservice.getCurrentBalance(String(localStorage.getItem('jwt_token'))).subscribe({
  //    next: x => {
  //      return true;
  //    },
  //    error: err => {
  //      
  //    },  
  //    complete: () => {
  //      
  //    } 
  //  })
  //  return false;
  //}
  
}
