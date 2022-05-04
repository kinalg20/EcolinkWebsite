import {
  Component,
  Renderer2,
  AfterViewInit,
  ViewChild,
  ElementRef, OnInit
} from '@angular/core';
import { ViewportScroller } from "@angular/common";
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/Services/api-service.service';
import { SocialAuthService } from "angularx-social-login";
import { GoogleLoginProvider } from "angularx-social-login";
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-signup-signin',
  templateUrl: './signup-signin.component.html',
  styleUrls: ['./signup-signin.component.scss']
})
export class SignupSigninComponent implements OnInit {
  @ViewChild('test') test: ElementRef | any;
  userObj: any;
  taxCalculate: any
  loginobj: any;
  resSignupMsg: string = '';
  password: string = '';
  confirmPassword: string = '';
  invalidMobile = false;
  invalidEmail: boolean = false;
  invalidUserEmail: string = '';
  checkString: boolean = true;
  resSignupMsgCheck: string = ' ';
  resMsg: string = '';
  errMsg = [];
  constructor(private router: Router, private renderer: Renderer2, private scroller: ViewportScroller, private __apiservice: ApiServiceService, private authService: SocialAuthService) { }

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
  goToTop() {
    window.scrollTo(0, 0);
    this.scroller.scrollToAnchor("backToTop");
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
        name: data.firstname + ' ' + data.lastname,
        email: data.email,
        mobile: data.phonenumber,
        password: data.password,
        address: data.address,
        country: data.country,
        state: data.state,
        city: data.city,
        pincode: data.pincode,
        profile_image: this.file,
        tax_exempt: data.radio2
      };
      this.taxCalculate = data.radio2
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
            this.resSignupMsg = 'Account Created Successfully!';
            this.resSignupMsgCheck = 'success';
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
        (error: HttpErrorResponse) => {
          if (error.error.code == 400) {
            if (error.error.message.email) {
              this.resSignupMsg = error.error.message.email;
            }
            if (error.error.message.password) {
              this.resSignupMsg = error.error.message.password;
            }
            if (error.error.message.mobile) {
              this.resSignupMsg = error.error.message.mobile;
            }
            this.resSignupMsgCheck = 'danger';
          }
          // this.resSignupMsg = 'Username Password Incorrect!';
          // console.log(error.error.code);
          form.reset();
        });
      () => {
        form.reset();
      }
    }
    else {
      this.resSignupMsg = "Please Fill The Value!"
      this.resSignupMsgCheck = "danger"
    }
  }
  signinWithEmail(form: NgForm) {
    if (form.valid) {
      let data = Object.assign({}, form.value);
      this.loginobj = {
        email: data.emailphone,
        password: data.password,
      };
      console.log(this.loginobj);

      this.__apiservice.login(this.loginobj).subscribe(
        (res) => {
          console.log(res.error);
          if (res.code === 200) {
            if (res.data.user_id == 1) {
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
            this.resMsg = res.error;
            console.log(this.resMsg = res.error);
            localStorage.removeItem('ecolink_user_credential');
          }
        },
        (error: HttpErrorResponse) => {
          this.resSignupMsgCheck = 'danger';
          this.resSignupMsg = 'Incorrect Username Password!';
          console.log(error.error.code);
          form.reset();
        }
      );

      () => {
        form.reset();
      }
    }
    else {
      this.resSignupMsg = "Please Fill The Value!"
      this.resSignupMsgCheck = "danger"
    }
  }
  close() {
    this.renderer.setStyle(this.test.nativeElement, 'display', 'none');
    this.resSignupMsg = '';
  }

  file: any;
  fileUrl : any;
  GetFileChange(e: any) {
    this.file = e.target.files;
    console.log(this.file);
    if(this.file){
      let reader = new FileReader();
      console.log(reader);      
      reader.readAsDataURL(this.file[0]);
      reader.onload = (event : any)=>{
        console.log(event);
        this.fileUrl = event.target.result;
      }
    }
  }
  // signInWithGoogle(): void {
  //   this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(
  //     (user: any) => {
  //       console.log("Loged In User", user);
  //       localStorage.setItem('Access_token',user.authToken);
  //       // this._utilityService.setObject(user, 'GoogleOAuth_USER')
  //       // this.dataService.loginedUserSubject.next(user);
  //       window.history.back();
  //     }
  //   );
  // }
}
