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
import { ApiServiceService } from 'src/app/Services/api-service.service';

@Component({
  selector: 'app-ask-chemist',
  templateUrl: './ask-chemist.component.html',
  styleUrls: ['./ask-chemist.component.scss']
})
export class AskChemistComponent implements OnInit {
  @ViewChild('test') test: ElementRef | any;
  userObj: any;
  invalidUserEmail: string = '';
  resSignupMsg: string = '';
  resSignupMsgCheck: string = ' ';  invalidMobile = false;
  invalidEmail: boolean = false;
  constructor(private __apiservice: ApiServiceService,private renderer: Renderer2, private scroller: ViewportScroller, private router: Router) { }

  ngOnInit(): void {
  }
  chemist_array: any = [
    {
      imgurl: "https://chem.washington.edu/sites/chem/files/styles/front_slideshow_alternate/public/images/student-looking-through-microscope-1105x665.jpg?itok=XjWShO_w",
      heading: "Philosophy and Methodology",
      content: "We always seek multi-use over single use chemical solutions "
    },
    {
      imgurl: "https://www.imperial.ac.uk/ImageCropToolT4/imageTool/uploaded-images/141024_imp_chem_026--tojpeg_1455114655644_x2.jpg",
      heading: "Manufacturing Case Studies",
      content: "Ecolink is especially proud of our work with the global mining sector"
    }
  ]

  saveAskChemistDetail(form: NgForm) {
    if (form.valid) {
      console.log(form.value);
      this.userObj = {
        first_name: form.value.firstname,
        last_name: form.value.lastname,
        email: form.value.email,
        type: "askchemist",
        mobile: form.value.phonenumber,
        address_1: form.value.address,
        country: form.value.country,
        state: form.value.state,
        city: form.value.city,
        zip: form.value.zip,
        input_1 : form.value.input_11,
        input_2: form.value.textarea
      };
      this.__apiservice.submitFormDetail(this.userObj).subscribe((res: any) => {
        console.log(res);
        form.reset();
        this.resSignupMsg = 'Contact detail saved successfully!';
        this.resSignupMsgCheck = 'success';
      }
      )
    }
    else {
      this.resSignupMsgCheck = 'danger';
      this.resSignupMsg = 'Please fill the value!';    }
  }
  ngAfterViewInit() { }
  close() {
    this.renderer.setStyle(this.test.nativeElement, 'display', 'none');
    this.resSignupMsg = '';
  }
  goToTop() {
    window.scrollTo(0, 0);
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
