import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { tree } from 'd3';
import { Subscription, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AuthService, RegistrationInfo } from 'src/app/services/auth.service';
import { MyErrorStateMatcher } from '../home/home.component';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  thirdFormGroup!: FormGroup;
  subscription: Subscription;

  matcher = new MyErrorStateMatcher();

  isLinear = true;

  firstname: string = '';
  lastname: string = '';
  username: string = '';
  password: string = '';
  confirmPassword: string = '';

  passwordControll = new FormControl('', Validators.required);
  passwordConfirmationControll = new FormControl('', Validators.required);

  constructor(private authService: AuthService, private router: Router, private formBuilder: FormBuilder) {
    this.subscription = this.passwordConfirmationControll.valueChanges.subscribe((value) => {
      this.passwordMatchValidator(String(value));
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe to avoid memory leaks
    this.subscription.unsubscribe();
  }

  ngOnInit(){
    this.firstFormGroup = this.formBuilder.group({
      firstCtrl: ['', Validators.required],
      lastCtrl: ['', Validators.required],
    });
  
    this.secondFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required],
    });
  
    this.thirdFormGroup = this.formBuilder.group({
      password: this.passwordControll,
      confirmPassword: this.passwordConfirmationControll
    });
  }

  passwordMatchValidator(confirmPassword: string): void{
    if (this.password === confirmPassword) {
      this.passwordConfirmationControll.setErrors(null);
      console.log(this.passwordConfirmationControll.valid);
    }else{
      this.passwordConfirmationControll.setErrors({ mismatch: true });
    }
  }


  Register(): void {
    
      let RegisterModel: RegistrationInfo = {
        login: this.username,
        password: this.password,
        firstname: this.firstname,
        lastname: this.lastname,
      };
      console.log(RegisterModel);
  
      this.authService.register( RegisterModel ) 
        .pipe( 
            catchError(err => { console.log(err); return of(null); }) 
          )
        .subscribe(account => {
          this.authService.login( { login: this.username, password: this.password } ) 
          .pipe(
              tap(d => localStorage.setItem("jwt_token", d.token)), 
              map(d => d.owner),
              catchError(err => { console.log(err); return of(null); }) 
            )
          .subscribe(account => {
            localStorage.setItem('loginDetails', JSON.stringify(account))
            this.router.navigate(["/home/dashboard"]);
      });
    });
    }
    
  }

