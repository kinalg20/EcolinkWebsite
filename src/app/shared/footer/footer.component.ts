import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/Services/api-service.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  newsletter_email:any;
  constructor(private _ApiService : ApiServiceService , private router : Router) { }

  ngOnInit(): void {
  }
  subscribe(){
    let endpoint = 'newsletter'
    console.log(this.newsletter_email);
    this._ApiService.newLatter(endpoint , this.newsletter_email).subscribe(res=>{
      console.log(res);
    })
  }

  routeOnSamePage(slug: any) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/' + slug]);
  }
}
