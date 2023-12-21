import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AccountService } from './services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor() {

  }
  ngOnInit() {
  }
}
