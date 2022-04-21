import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/Services/api-service.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  resSignupMsg: string = '';
  invalidEmail: boolean = false;
  invalidUserEmail: string = ''; 
  password: string = '';
  confirmPassword: string = '';
  userObj:any

  constructor(private __apiservice : ApiServiceService, private route:Router) { }

  ngOnInit(): void {
  }
  ForgotPassword(form:NgForm){
    if(form.valid) {
      let data = Object.assign({}, form.value);
      this.userObj = {
        email: data.email,
        password: data.password,
        password_confirmation:data.confirmPassword,
      }
      this.__apiservice.forgotPassword(this.userObj).subscribe((res:any) => {
        console.log(res);
      })
    }
    else {
      this.resSignupMsg = 'Please fill the value !'
    }
  }
  validateUserEmail(email: any) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(email.target.value) == false) {
      this.invalidUserEmail = 'Invalid Email Address';
      return false;
    }
    this.invalidUserEmail = '';
    return true;
  }
  validateEmail(event: any) {
    const value = event.target.value;

    if (
      value &&
      !/^[0-9]*$/.test(value) &&
      !this.validateUserEmail(event)
    ) {
      this.invalidEmail = true;
    }

    else {
      this.invalidEmail = false;
    }
  }
}
