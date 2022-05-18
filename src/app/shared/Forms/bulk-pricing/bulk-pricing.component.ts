import {
  Component,
  Renderer2,
  AfterViewInit,
  ViewChild,
  ElementRef, OnInit
} from '@angular/core';
import { ViewportScroller } from "@angular/common";
import { Router } from "@angular/router";
import { NgForm, FormGroup, FormControl } from '@angular/forms';
import { ApiServiceService } from 'src/app/Services/api-service.service';

@Component({
  selector: 'app-bulk-pricing',
  templateUrl: './bulk-pricing.component.html',
  styleUrls: ['./bulk-pricing.component.scss']
})
export class BulkPricingComponent implements OnInit {
  @ViewChild('test') test: ElementRef | any;
  userObj: any;
  invalidUserEmail: string = '';
  resSignupMsg: string = '';
  resSignupMsgCheck: string = ' '; 
  invalidMobile = false;
  invalidPincode = false;
  invalidEmail: boolean = false;
  constructor(private __apiservice: ApiServiceService, private renderer: Renderer2, private scroller: ViewportScroller, private router: Router) { }

  ngOnInit(): void {
  }
  pricingForm = new FormGroup({
    firstname: new FormControl(''),
    lastname: new FormControl(''),
    email: new FormControl(''),
    phone: new FormControl(''),
    input_11: new FormControl(''),
    address: new FormControl(''),
    address2: new FormControl(''),
    country: new FormControl(''),
    state: new FormControl(''),
    city: new FormControl(''),
    pincode: new FormControl(''),
    help: new FormControl(''),
  });
  saveBulkFormDetail() {
    if (this.pricingForm.valid) {
      let data = this.pricingForm.value
      console.log(data);
      this.userObj = {
        first_name: data.firstname,
        last_name: data.lastname,
        email: data.email,
        type: "bulkpricing",
        phone: data.phone,
        address_1: data.address,
        country: data.country,
        state: data.state,
        city: data.city,
        zip: data.pincode,
        input_1: data.input_11,
        input_2: data.help
      };
      this.__apiservice.submitFormDetail(this.userObj).subscribe((res: any) => {
        console.log(res);
        this.pricingForm.reset();
        this.resSignupMsg = 'Form Submitted Successfully!';
        this.resSignupMsgCheck = 'success';
        setTimeout(() => {
          this.resSignupMsg = '';
          }, 3000);
      }
      )
    }
    else {
      this.resSignupMsgCheck = 'danger';
      this.resSignupMsg = 'Please Fill the Fields Below!';
      setTimeout(() => {
        this.resSignupMsg = '';
        }, 2000);
    }
  }
  ngAfterViewInit() { }
  close() {
    this.renderer.setStyle(this.test.nativeElement, 'display', 'none');
    this.resSignupMsg = '';
  }
  goToTop() {
    this.scroller.scrollToAnchor("backToTop");
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
  inputPincode(event: any) {
    if (
      event.key.length === 1 &&
      !/^[0-9]$/.test(event.key)
    ) {
      event.preventDefault();
    }
  }
  validatePincode(event: any) {
    const value = event.target.value;

    if (
      value &&
      /^[0-9]+$/.test(value) &&
      value.length < 6
    ) {
      this.invalidPincode = true;
    }

    else {
      this.invalidPincode = false;
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
}
