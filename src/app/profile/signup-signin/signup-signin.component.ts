import { JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/Services/api-service.service';

@Component({
  selector: 'app-signup-signin',
  templateUrl: './signup-signin.component.html',
  styleUrls: ['./signup-signin.component.scss']
})
export class SignupSigninComponent implements OnInit {
  userObj: any;
  loginobj:any;
  resSignupMsg: string = '';
  password: string = '';
  confirmPassword: string = '';
  invalidMobile = false;
  invalidEmail: boolean = false;
  invalidUserEmail: string = '';
  checkString: boolean = true;
  resMsg: string = '';
  constructor(private router: Router, private __apiservice: ApiServiceService) { }

  ngOnInit(): void {
  }
  SignIn() {
    this.checkString = !this.checkString;
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
  inputMobile(event: any) {
    if (
      event.key.length === 1 &&
      !/^[0-9]$/.test(event.key)
    ) {
      event.preventDefault();
    }
  }
  validateMobile(event: any) {
    const value = event.target.value;

    if (
      value &&
      /^[0-9]+$/.test(value) &&
      value.length < 10
    ) {
      this.invalidMobile = true;
    }

    else {
      this.invalidMobile = false;
    }
  }
  signUp(form: NgForm) {
    if (form.valid) {
      let data = Object.assign({}, form.value);
      this.userObj = {
        name: data.firstname+ ' ' + data.lastname,
        email: data.email,
        mobile: data.phonenumber,
        password: data.password,
        address: data.address,
        country: data.country,
        state: data.state,
        city: data.city,
        pincode: data.pincode,
        profile_image: "https://chirpybazaar.com/wp-content/uploads/2019/05/dummy-man-570x570.png"
      };
      console.log(this.userObj);
      // this.__apiservice.registerClient(this.userObj).subscribe(
      //   (res) => {
      //     console.log(res.message);
      //   }
      // );
      this.__apiservice.post(this.userObj).subscribe(
        (res) => {
          console.log(res);
          if (res.code == 200) {
            localStorage.setItem(
              'ecolink_user_credential',
              JSON.stringify(res.data)
            );
            this.router.navigateByUrl('/');
          }
          
          else {
            this.resSignupMsg = res.message;
            localStorage.removeItem('ecolink_user_credential');
          }
        },
        () => {
          form.reset();
        }
      );
    }
    else {
      this.resSignupMsg = 'Please fill the value';
    }


  }
  signinWithEmail(form: NgForm) {
    let data = Object.assign({}, form.value);
    this.loginobj = {
      email: data.emailphone,
      password: data.password,
    };
    console.log(this.loginobj);

    this.__apiservice.login(this.loginobj).subscribe(
      (res) => {
        console.log(res);
        if (res.code === 200) 
        {
            if(res.data.user_id==1){
              window.location.href = 'https://brandtalks.in/ecolink/login';
              }
              else {
                localStorage.setItem(
                  'ecolink_user_credential',
                  JSON.stringify(res.data)
                );
                this.router.navigateByUrl('/');
              }
        }
        
        else {
          this.resMsg=res.error;
          console.log(this.resMsg=res.error);
          localStorage.removeItem('ecolink_user_credential');
        }
      },
      () => {
        form.reset();
      }
    );
  }
}
