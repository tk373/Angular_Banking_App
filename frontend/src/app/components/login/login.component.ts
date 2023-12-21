import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { LoginInfo } from 'src/app/services/auth.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(form: NgForm ): void {
    if (form.valid) {
      const loginModel: LoginInfo = {
        login: this.username,
        password: this.password
      };
  
      this.authService.login( loginModel ) 
        .pipe(
            tap(d => localStorage.setItem("jwt_token", d.token)),
            catchError(err => { console.log(err); return of(null); })
          )
        .subscribe(account => {
          this.router.navigate(["/home/dashboard"]);
    });
    }
    
  }
}