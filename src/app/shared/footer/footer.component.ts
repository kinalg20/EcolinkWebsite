import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/Services/api-service.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  newsletter_email: any;
  resSignupMsg: string = '';
  resSignupMsgCheck: string = '';
  invalidUserEmail: string = '';
  invalidEmail: boolean = false;
  constructor(private _ApiService: ApiServiceService, private router: Router,private renderer: Renderer2) { }
  @ViewChild('close') closer!:ElementRef;
  ngOnInit(): void {
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
  subscribe() {
    if (this.newsletter_email == undefined) {
      this.resSignupMsg = 'Please Enter Email !'
      this.resSignupMsgCheck = 'danger'
    }
    else {
      let endpoint = 'newsletter'
      this._ApiService.newLatter(endpoint, this.newsletter_email).subscribe(res => {
        console.log(res);
        this.resSignupMsg = 'Email Subscribed !'
        this.resSignupMsgCheck = 'success';
        this.newsletter_email=undefined
      })
    }
  }
  closeButton() {
    this.renderer.setStyle(this.closer.nativeElement, 'display', 'none');
    this.resSignupMsg = '';
    this.resSignupMsgCheck=''
  }
  routeOnSamePage(slug: any) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/' + slug]);
  }
}
