import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { TransactionConfirmation, TransactionService } from './transaction.service'; // Import the model if it's separate
import { AuthService } from './auth.service';
import { AccountService } from './account.service';
import { jwtDecode } from 'jwt-decode';


@Injectable({providedIn: 'root'})
export class DashboardService {
  constructor(private transactionService: TransactionService, private authservice: AuthService, private accountservice: AccountService) {}

    getDecodedAccessToken(token: string): any {
        try {
          return jwtDecode(token);
        } catch(Error) {
          return null;
        }
      }

      fetchLatestTransactions(): Observable<TransactionConfirmation[]> {
        return this.transactionService.getTransactions(String(this.authservice.getJwtToken()))
            .pipe(
                map(d => <TransactionConfirmation[]>d.result),
                catchError(error => {
                    return of([]); // Return an empty array wrapped in an Observable
                })
            );}
}