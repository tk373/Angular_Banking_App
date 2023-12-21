import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';

import { Observable} from 'rxjs';

import { getHeaders, getServerUrl } from './http-environment';

export interface AccountInfo {
  accountNr: string,
  owner: {
    firstname: string,
    lastname: string
  }
}
export interface Account {
  login: string,
  firstname: string,
  lastname: string,
  accountNr: string
}
export interface AccountBalance {
  ownerId: string,
  accountNr: string,
  amount: number,
  owner: Account
}

/**
 * Mit dem Account Service können Information zum aktuellen
 * Account sowie zu fremden Accounts abgefragt werden.
 */
@Injectable({providedIn: 'root'})
export class AccountService {
  constructor(private http: HttpClient) {
  }

  /**
   * Ruft erweiterte Informationen (z.B. aktuelles Saldo) über den aktuellen User vom
   * Server ab. Der User wird durch das Bearer Token identifiziert.
   * 
   * @param jwtToken Diese Methode benötigt das JWT Token des aktuell eingeloggten Benutzers (siehe Authentication Service).
   * @example Gibt das Resultat im folgenden Format zurück:
   * ```json
   * {
   *    "ownerId": "DLQUd5u5vHsdTaqN",
   *    "accountNr": "1000001",
   *    "amount": 1000,
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
  public getCurrentBalance(jwtToken: string): Observable<AccountBalance> {
    return this.http.get<AccountBalance>(
      getServerUrl('/accounts'),
      getHeaders(jwtToken, false) );
  }

  /**
   * Ruft die Account Informationen über einen beliebigen Account vom System ab.
   * 
   * @param jwtToken Diese Methode benötigt das JWT Token des aktuell eingeloggten Benutzers (siehe Authentication Service).
   * @param accountNumber Nummer des accounts, wessen Informationen abgefragt werden sollen.
   * @example Gibt das Resultat im folgenden Format zurück:
   * ```json
   * {
   *    "accountNr": "1000002",
   *    "owner": 
   *    {
   *       "firstname": "Lisa",
   *       "lastname": "Meier"
   *    }
   * }
   * ```
   */
  public getAccountInfo(jwtToken: string, accountNumber: string): Observable<AccountInfo> {
    return this.http.get<AccountInfo>(
      getServerUrl(`/accounts/${accountNumber}`),
      getHeaders(jwtToken, false));
  }
}
