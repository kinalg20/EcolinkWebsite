import { Component, OnInit, Input, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { ApiServiceService } from 'src/app/Services/api-service.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.scss']
})
export class AddressesComponent implements OnInit {
  @ViewChild('test') test: ElementRef | any;
  @Input() showdesc: any;
  allUserAddresses: any = [];
  resSignupMsg: string = '';
  resSignupMsgCheck: string = ' ';
  profileAddress: any = [];
  adressModal: boolean= false;

  constructor(private __apiservice: ApiServiceService, private renderer: Renderer2) { }

  ngOnInit(): void {
    this.getAllUserAddress();
    this.__apiservice.profiledashboard.subscribe((res:any)=> {
      this.getAllUserAddress();
    })
    console.log(this.showdesc)
  }
  // <--Get User Address Function-->
  getAllUserAddress() {
    this.__apiservice.getUserAddress().subscribe((res: any) => {
      this.allUserAddresses = [];
      console.log(res);
      res.data.map((response: any) => {
        this.allUserAddresses.push(response);
      })
      setTimeout(() => {
        console.log(this.allUserAddresses);
      }, 1000);
    })
  }
  // <-- Delete User Address --> 
  deleteUserAddress(item_id: any) {
    console.log(item_id);
    this.__apiservice.deleteUserAddress(item_id).subscribe((res: any) => {
      if (res.code == 200) {
        this.resSignupMsg = 'Your Address Deleted Successfully!';
        this.resSignupMsgCheck = 'success';
        this.getAllUserAddress();
      }
    },
      (error: HttpErrorResponse) => {
        if (error.error.code == 400) {
          this.allUserAddresses = []
          this.getAllUserAddress();
        }
        console.log(error.error.code);
      }
    )
  }
  // <-- Close toaster --> 
  close() {
    this.renderer.setStyle(this.test.nativeElement, 'display', 'none');
    this.resSignupMsg = '';
  }
  //<-- User Address -->
  getUserDetail(item: any) {
    if (item == 'add') {
      this.profileAddress = [];
      this.profileAddress.push({ heading: "Add Address" })
    }
    else {
      this.profileAddress = [];
      item.heading = "Edit Address";
      item.firstname = item.name.split(" ")[0];
      item.lastname = item.name.split(" ")[1];
      this.profileAddress.push(item);
    }
  }
  
  
}
