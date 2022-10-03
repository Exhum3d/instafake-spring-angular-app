import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginFormGroup: FormGroup;


  constructor(
    private router: Router,
    private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

}
