import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {AuthService} from "../../service/auth.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserSignup} from "../../model/user-signup.model";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {User} from "../../model/user.model";
import {Constants} from 'src/app/shared/constants';
import {SnackBarComponent} from "../snack-bar/snack-bar.component";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  submittingForm: boolean = false;
  signupFormGroup: FormGroup;

  private subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private matSnackbar: MatSnackBar) {
  }

  ngOnInit(): void {
    if (this.authService.isUserLoggedIn()) {
      this.router.navigateByUrl('/profile');
    }

    this.signupFormGroup = this.formBuilder.group({
      infoGroup: this.formBuilder.group({
        firstName: new FormControl('',
          [Validators.required, Validators.maxLength(64)]
        ),
        lastName: new FormControl('',
          [Validators.required, Validators.maxLength(64)]
        ),
        email: new FormControl('',
          [Validators.required, Validators.email, Validators.maxLength(64)]
        )
      }),
      passwordGroup: this.formBuilder.group({
        password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(32)]),
      })
    });

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  get firstName() {
    return this.signupFormGroup.get('infoGroup.firstName')
  }

  get lastName() {
    return this.signupFormGroup.get('infoGroup.lastName')
  }

  get email() {
    return this.signupFormGroup.get('infoGroup.email')
  }

  get password() {
    return this.signupFormGroup.get('passwordGroup.password')
  }

  get passwordRepeat() {
    return this.signupFormGroup.get('passwordGroup.passwordRepeat')
  }

  handleSignup(): void {
    if (this.signupFormGroup.valid) {
      this.submittingForm = true;
      const userSignup = new UserSignup();
      userSignup.firstName = this.firstName?.value;
      userSignup.lastName = this.lastName?.value;
      userSignup.email = this.email?.value;
      userSignup.password = this.password?.value;

      this.subscriptions.push(
        this.authService.signup(userSignup).subscribe({
          next: (response: HttpResponse<User>) => {
            localStorage.setItem(Constants.messageTypeLabel, Constants.successLabel);
            localStorage.setItem(Constants.messageHeaderLabel, Constants.signupSuccessHeader);
            localStorage.setItem(Constants.messageDetailLabel, Constants.signupSuccessDetail);
            localStorage.setItem(Constants.toLoginLabel, Constants.trueLabel);
            this.submittingForm = false;
            this.router.navigateByUrl('/login');
          },
          error: (errorResponse: HttpErrorResponse) => {
            const validationErrors = errorResponse.error.validationErrors;
            if (validationErrors != null) {
              Object.keys(validationErrors).forEach(key => {
                let formGroup = 'infoGroup';
                if (key === 'password' || key === 'passwordRepeat') formGroup = 'passwordGroup';
                const formControl = this.signupFormGroup.get(`${formGroup}.${key}`);
                if (formControl) {
                  formControl.setErrors({
                    serverError: validationErrors[key]
                  });
                }
              })
            } else {
              this.matSnackbar.openFromComponent(SnackBarComponent, {
                data: Constants.snackbarErrorContent,
                panelClass: ['bg-danger'],
                duration: 5000
              });
            }
            this.submittingForm = false;
          }
        })
      );
    }
  }

}
