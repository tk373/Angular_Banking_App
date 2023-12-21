import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { getHeaders, getServerUrl } from './http-environment';
import { ScaleType } from '@swimlane/ngx-charts';

export interface Transaction {
  target: string,
  amount: number,
  category?: string,
}
export interface TransactionConfirmation {
  from: string,
  target: string,
  amount: number,
  category?: string,
  total: number,
  date: string
}
export interface TransactionQuery {
  query: {
    resultcount: number,
    count: number,
    skip: number,
    fromDate: string,
    toDate: string
  },
  result: TransactionConfirmation[]
}

/**
 * Spezifiziert eine Anfrage, welche die Anzahl der zurückzugebenen Transactions limitiert und
 * zusätzlich einen Offset bestimmt.
 * @prop {number} count Anzahl der Objekte in der Antwort.
 * @prop {number} skip Anzahl der übersprungenen Objekte in der Db.
 */
export interface CountQuery {
  count: number,
  skip?: number,
}
/**
 * Spezifiziert eine Anfrage, welche die Anzahl der zurückzugebenen Transactions aufgrund des
 * angegebenen Datums limitiert.
 * @prop {Date} fromDate Start des Zeitraums der gesuchten Transaktionen.
 * @prop {Date} toDate Ende des Zeitraums der gesuchten Transaktionen.
 */
export interface DateQuery {
  fromDate: Date,
  toDate: Date
}


/**
 * Mit dem Transaction Service können Transaktionen durchgeführt werden sowie Abfragen
 * über die getätigten Transaktionen gemacht werden.
 */
@Injectable({providedIn: 'root'})
export class TransactionService {
  constructor(private http: HttpClient) {
  }

  /**
   * Überweist den Betrag des Users, welcher durch das Bearer Token
   * authentifiziert ist, auf das spezifizierte Konto.
   * @param jwtToken Diese Methode benötigt das JWT Token des aktuell eingeloggten Benutzers (siehe Authentication Service).
   * @param model 
   * @example Gibt das Resultat im folgenden Format zurück:
   * ```json
   * {
   *    "from": "1000001",
   *    "target": "1000002",
   *    "amount": -5,
   *    "total": 995,
   *    "date": "2017-02-01T08:48:55.842Z"
   * }
   * ```
   */
  public transfer(jwtToken: string, model: Transaction): Observable<TransactionConfirmation> {
    return this.http.post<TransactionConfirmation>(
      getServerUrl('/accounts/transactions'),
      JSON.stringify(model),
      getHeaders(jwtToken));
  }

  /**
   * Ruft sämtliche Transaktionen des Users, welcher durch das Bearer Token authentifiziert ist, ab und
   * filtert die Transaktionen gemäss der Parametrisierung.
   * Wichtig: Resultate werden nur zurückgeben, falls count oder fromDate und toDate angegeben wurden.
   * @param jwtToken Diese Methode benötigt das JWT Token des aktuell eingeloggten Benutzers (siehe Authentication Service).
   * @param fromDate Startdatum der Transaktionen, welche zurückgegeben werden sollen.
   * @param toDate Enddatum der Transaktionen, welche zurückgegeben werden sollen.
   * @param count Anzahl der zurückzugebenden Transaktionen.
   * @param skip Überspringt diese Anzahl an Transaktionen in der DB, d.h. diese werden nicht zurückgegeben.
   * @returns Gibt die Transaktions-Informationen für den aktuellen Account inklusiver der Query-Informationen zurück.
   * @example Gibt das Resultat im folgenden Format zurück:
   * ```json
   * {
   *    "query":
   *    {
   *       "resultcount": 107, // Anzahl Results (ohne Filter)
   *       "count": 1,  // Anzahl Resulte welche zurückgegeben werden sollten
   *       "skip": 1, // Überspringt die ersten x Resultate
   *       "fromDate": "2016-05-11T02:00:00.000Z",  // Date-Filter
   *       "toDate": "2016-12-11T02:00:00.000Z" // Date-Filter
   *    },
   *    "result":
   *    [
   *       {
   *          "from": "1000001",
   *          "target": "1000002",
   *          "amount": -23,
   *          "total": 977,
   *          "date": "2016-12-10T14:00:00.000Z"
   *       }
   *    ]
   * }
   * ```
   */
  public getTransactions(jwtToken: string, query?: CountQuery | DateQuery): Observable<TransactionQuery> {
    let requestUrl = getServerUrl('/accounts/transactions');

    if ((<DateQuery>query)?.fromDate && (<DateQuery>query)?.toDate) {
      const dateQuery = <DateQuery>query;
      requestUrl += `?fromDate=${encodeURIComponent(dateQuery.fromDate.toString())}&toDate=${encodeURIComponent(dateQuery.toDate.toString())}`;
    } else {
      const countQuery = <CountQuery>query;
      requestUrl += `?count=${countQuery?.count ? countQuery.count : 0}&skip=${countQuery?.skip ? countQuery.skip : 0}`;
    }

    return this.http.get<TransactionQuery>(
      requestUrl,
      getHeaders(jwtToken, false));
  }
}
