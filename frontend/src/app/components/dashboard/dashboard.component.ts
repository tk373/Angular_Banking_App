import { Component, OnInit} from '@angular/core';
import { Transaction, TransactionConfirmation, TransactionService } from 'src/app/services/transaction.service';
import { Account, AccountService, AccountInfo } from 'src/app/services/account.service';
import { catchError, map, of} from 'rxjs';
import { Location } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MyErrorStateMatcher } from '../home/home.component';
import { AuthService } from 'src/app/services/auth.service';
import { DashboardService } from 'src/app/services/dashboard.service';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{
  userName: string | null;
  accountBalance: number;
  paymentFrom: string | null;
  paymentTo: string | null;
  paymentAmount: number | null = null;
  latestTransactions: TransactionConfirmation[] = [];
  sclicedTransactions: TransactionConfirmation[] = [];
  useracc: Account | null = null;
  selectedAccountName: string = '';
  subscription: Subscription;
  accountInfo: AccountInfo | null = null;
  paymentFormGroup!: FormGroup;
  showAll: boolean = false;
  categories = ['living', 'food', 'furniture', 'mobility', 'beauty_health', 'media', 'electronics'];
  selectedCategory!: string;

  ToFormControl = new FormControl('', [Validators.required, Validators.pattern(/^\d{7}$/)]);
  AmmountControll = new FormControl('', [Validators.required, Validators.min(0.05), Validators.pattern(/^\d+$/)]);
  CategoryFormControl = new FormControl('', [Validators.required]);

  matcher = new MyErrorStateMatcher();


  displayedColumns: string[] = ['from', 'target', 'amount', 'total'];
  dataSource: MatTableDataSource<TransactionConfirmation> = new MatTableDataSource<TransactionConfirmation>([]);

  

  updateAccountName(enteredAccountNumber: string): void {
    this.accountservice.getAccountInfo(String(this.authservice.getJwtToken()), enteredAccountNumber)
    .pipe(
      catchError(error => of(0))
    )
    .subscribe(accountInfo => {
      if (accountInfo) {
        this.accountInfo = <AccountInfo>accountInfo;
        if (this.accountInfo.owner.firstname === this.useracc?.firstname && this.accountInfo.owner.lastname === this.useracc?.lastname) {
          this.ToFormControl.setErrors({ SameUser: true });
        } else {
          this.selectedAccountName = this.accountInfo.owner.firstname + ' ' + this.accountInfo.owner.lastname;
          this.ToFormControl.setErrors(null); // Valid case
        }
      } else {
        // If accountInfo is null or undefined
        this.selectedAccountName = 'No User found';
        this.ToFormControl.setErrors({ invalidAccount: true });
      }
    });
  }

  reloadPage(): void {
    window.location.reload();
  }
   
  getBalanceAndDisplay(): void {
    this.accountservice.getCurrentBalance( String(this.authservice.getJwtToken()) )
      .pipe(
        map(d => d.amount),
        catchError(error => of(0))
      ).subscribe(amount => {
        this.accountBalance = Number(amount);
        this.paymentFrom = `${String(this.useracc?.accountNr)} [${this.accountBalance.toFixed(2)} CHF]`;
    });
  }
  
  constructor(private transactionservice: TransactionService, private accountservice: AccountService, private location: Location, private frombuilder: FormBuilder, private authservice: AuthService, private dashboardservice: DashboardService) {
    this.userName = '';
    this.useracc = this.dashboardservice.getDecodedAccessToken(String(this.authservice.getJwtToken()));
    this.paymentTo = '';
    this.accountBalance = 0;
    this.paymentFrom = '';
    this.getBalanceAndDisplay();
    this.subscription = this.ToFormControl.valueChanges.subscribe((value) => {
      this.updateAccountName(String(value));
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe to avoid memory leaks
    this.subscription.unsubscribe();
  }
  
  ngOnInit(): void {
    this.fetchLatestTransactions();
    this.paymentFormGroup = this.frombuilder.group({
      target: this.ToFormControl,
      amount: this.AmmountControll,
      category: this.CategoryFormControl
    });
  }

  fetchLatestTransactions(): void {
    this.dashboardservice.fetchLatestTransactions().subscribe({
      next: (data) => {
        this.latestTransactions = data; // Handle the data
        this.dataSource = new MatTableDataSource<TransactionConfirmation>(this.latestTransactions.slice(0, 5));
      },
      error: (error) => {
          console.error('Error fetching transactions', error);
          this.latestTransactions = []; // Handle the error
      }});
  }

  toggleDisplay() {
    this.showAll = !this.showAll;
    this.dataSource.data = this.showAll ? this.latestTransactions : this.latestTransactions.slice(0, 5);
  }

  makePayment(): void {
    const transactionModel: Transaction = {
      target: String(this.paymentTo),
      amount: Number(this.paymentAmount),
      category: this.selectedCategory
    };
    this.transactionservice.transfer( String(this.authservice.getJwtToken()), transactionModel ) 
        .pipe(
            catchError(err => { console.log(err); return of(null); }) 
          )
        .subscribe(amount => {
        this.getBalanceAndDisplay();
        this.fetchLatestTransactions();
        this.reloadPage();
        alert('You paid: ' + amount?.amount + ' to ' + amount?.target);
    });
      this.paymentTo = '';
      this.paymentAmount = null;
  }
}
