import {
  Component,
  Renderer2,
  AfterViewInit,
  ViewChild,
  ElementRef, OnInit
} from '@angular/core'; 
import { ViewportScroller } from "@angular/common";
import { Router } from "@angular/router";
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiServiceService } from 'src/app/Services/api-service.service';

@Component({
  selector: 'app-products-request',
  templateUrl: './products-request.component.html',
  styleUrls: ['./products-request.component.scss']
})
export class ProductsRequestComponent implements OnInit {
  @ViewChild('test') test: ElementRef | any;
  slug: any;
  data: any = []
  userObj: any;
  invalidUserEmail: string = '';
  resSignupMsg: string = '';
  resSignupMsgCheck: string = ' ';
  invalidMobile = false;
  invalidEmail: boolean = false;
  checkBoxChcek: boolean = false;
  constructor(private route: ActivatedRoute, private _apiService: ApiServiceService, private renderer: Renderer2, private scroller: ViewportScroller, private router: Router) { }

  ngOnInit(): void {
    this.slug = this.route.snapshot.params;
    if (this.slug.sublink) {
      this._apiService.getPageBySlug(this.slug.sublink).subscribe((res: any) => {
        this.data = res.data;
        console.log(res);
      })
    }
    else {
      this._apiService.getPageBySlug(this.slug).subscribe((res: any) => {
        this.data = res.data;
        console.log(res);
      })
    }
  }

  saveProductRequestDetail(form: NgForm) {
    if (form.valid) {
      console.log(form.value);
      this.userObj = {
        first_name: form.value.firstname,
        last_name: form.value.lastname,
        email: form.value.email,
        type: "productrequest",
        mobile: form.value.phone,
        address_1: form.value.address,
        country: form.value.country,
        state: form.value.state,
        city: form.value.city,
        zip: form.value.pincode,
        input_1: form.value.input1,
        input_2: form.value.input2,
        input_3: form.value.input3,
        input_4: form.value.input4
      };
      this._apiService.submitFormDetail(this.userObj).subscribe((res: any) => {
        console.log(res);
        form.reset();
        this.checkBoxChcek = false
        this.resSignupMsg = 'Contact detail saved successfully!';
        this.resSignupMsgCheck = 'success';
      }
      )
    }
    else {
      this.resSignupMsgCheck = 'danger';
      this.resSignupMsg = 'Please fill the value!';
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
