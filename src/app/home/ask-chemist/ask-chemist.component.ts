import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-ask-chemist',
  templateUrl: './ask-chemist.component.html',
  styleUrls: ['./ask-chemist.component.scss']
})
export class AskChemistComponent implements OnInit {
  invalidUserEmail: string = '';
  resSignupMsg: string = '';
  invalidMobile = false;
  invalidEmail: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }
  chemist_array:any=[
    {
      imgurl:"https://chem.washington.edu/sites/chem/files/styles/front_slideshow_alternate/public/images/student-looking-through-microscope-1105x665.jpg?itok=XjWShO_w",
      heading:"Philosophy and Methodology",
      content:"We always seek multi-use over single use chemical solutions "
    },
    {
      imgurl:"https://www.imperial.ac.uk/ImageCropToolT4/imageTool/uploaded-images/141024_imp_chem_026--tojpeg_1455114655644_x2.jpg",
      heading:"Manufacturing Case Studies",
      content:"Ecolink is especially proud of our work with the global mining sector"
    }
  ]

  saveAskChemistDetail(data:NgForm){
    if(data.valid) {
      console.log(data.value);
    }
    else {
      this.resSignupMsg='Please fill the value';
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
