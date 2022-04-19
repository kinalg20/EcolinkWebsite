import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiServiceService } from 'src/app/Services/api-service.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  newsletter_email:any;
  constructor(private _ApiService : ApiServiceService) { }

  ngOnInit(): void {
  }
  subscribe(){
    let endpoint = 'newsletter'
    console.log(this.newsletter_email);
    this._ApiService.newLatter(endpoint , this.newsletter_email).subscribe(res=>{
      console.log(res);
    })
  }
}
