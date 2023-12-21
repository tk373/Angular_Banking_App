import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { TransactionConfirmation, TransactionService } from './transaction.service'; // Import the model if it's separate
import { AuthService } from './auth.service';
import { ScaleType } from '@swimlane/ngx-charts';
export interface Month {
    monthNumber: number;
    monthName: string;
  }

  export interface ChartData {
    name: string;
    series: Array<{
      name: string;
      value: number;
      extra: {
        code: string;
      };
    }>;
  }

  export interface C1ustomColorScheme{
    name: string,
    selectable: boolean,
    group: ScaleType,
    domain: string[]
  };
  

@Injectable({providedIn: 'root'})
export class Ecockpit {
  constructor(private transactionService: TransactionService, private authservice: AuthService) {}
  
    calculateTotalPages(transactions: any[], entriesPerPage: number): number {
        if (entriesPerPage > 0) {
          return Math.ceil(transactions.length / entriesPerPage);
        }
        return 1;
      }


      getFilteredTransactions(selectedMonth: number, selectedYear: number, transactions: TransactionConfirmation[]): TransactionConfirmation[] {
        if (selectedMonth === 0 && selectedYear === 0) {
          return transactions;
        }
      
        return transactions.filter(transaction => {
          const transactionDate = new Date(transaction.date);
          const transactionMonth = transactionDate.getMonth() + 1; 
          const transactionYear = transactionDate.getFullYear();
      
          // Check if the year matches the selected year
          if (selectedYear !== 0 && transactionYear !== selectedYear) {
            return false; // Skip if the year doesn't match
          }
      
          // If selectedMonth is 0, return all transactions of the selected year
          if (selectedMonth === 0) {
            return true;
          }
      
          // Check if the month matches the selected month
          return transactionMonth === selectedMonth;
        });
      }
      
  /**
   * Fetch the latest transactions.
   * This method should contain the logic previously in your component for fetching transactions.
   * 
   * @returns Observable of TransactionConfirmation[]
   */
  fetchLatestTransactions(/* parameters if any */): Observable<TransactionConfirmation[]> {
    return this.transactionService.getTransactions(String(this.authservice.getJwtToken()))
        .pipe(
            map(d => <TransactionConfirmation[]>d.result),
            catchError(error => {
                // Log the error or handle it as needed
                console.error(error);
                return of([]); // Return an empty array wrapped in an Observable
            })
        );
}

  // Any additional methods or logic related to transactions
}