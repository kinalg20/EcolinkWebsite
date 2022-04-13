import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup-signin',
  templateUrl: './signup-signin.component.html',
  styleUrls: ['./signup-signin.component.scss']
})
export class SignupSigninComponent implements OnInit {
  checkString:boolean=true;
  constructor() { }

  ngOnInit(): void {
  }
  SignUp() {
    
  }
  SignIn() {
    this.checkString=!this.checkString;
  }
  

}
