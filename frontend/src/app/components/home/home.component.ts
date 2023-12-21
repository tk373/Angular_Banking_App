import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Transaction, TransactionConfirmation, TransactionService } from 'src/app/services/transaction.service';
import { Account, AccountService, AccountBalance, AccountInfo } from 'src/app/services/account.service';
import { Observable, catchError, map, of, switchMap, tap, timeout } from 'rxjs';
import { Location } from '@angular/common';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import {  jwtDecode } from 'jwt-decode';


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent{
  userName: string | null;
  useracc: Account | null = null;
  jwtToken!: string;
  
  
  constructor(private router: Router){
    this.userName = '';
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch(Error) {
      return null;
    }
  }

  ngOnInit(): void {
    this.jwtToken = String(localStorage.getItem('jwt_token'));
    this.useracc = this.getDecodedAccessToken(this.jwtToken);
    this.userName = String(this.useracc?.firstname + " " + this.useracc?.lastname);
    //this.userName = String(this.useracc?.firstname + " " + this.useracc?.lastname);
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
