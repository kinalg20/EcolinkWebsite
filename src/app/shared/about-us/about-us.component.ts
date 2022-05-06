import { style } from '@angular/animations';
import { AfterViewInit, Component, OnInit, QueryList, ViewChild } from '@angular/core';
import { CallToActionComponent } from 'src/app/shared/call-to-action/call-to-action.component';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit,AfterViewInit {
  
  @ViewChild(CallToActionComponent) child: QueryList<CallToActionComponent>|any;
  viewheight:any=250;
  constructor() { }
  action_array=[
    {
      imgurl:"https://ecolink.com/wp-content/uploads/2022/02/What-Chemical-Is-Used-for-Millipore-845x321.jpg",
      heading:"Who is Ecolink",
      content:"Providing chemical solutions for the next generation."
    },
    {
      imgurl:"https://wallpaperaccess.com/full/2847970.jpg",
      heading:"We work with whom",
      content:"How much we sell our impact"
    },
    {
      imgurl:"https://ecolink.com/wp-content/uploads/2020/05/Dollarphotoclub_58451099-1-750x321.jpg",
      heading:"Scholarship",
      content:"Chemical Solution for next generation"
    },
    {
      imgurl:"https://blog.ipleaders.in/wp-content/uploads/2017/08/BV-Acharya-104.jpg",
      heading:"\"Behind the Brand\"",
      content:"chemicals where we start."
    },
    {
      imgurl:"https://static.fibre2fashion.com/articleresources/images/87/8623/chemical-big_Big.jpg",
      heading:"Cherities we support",
      content:"Women in chemicals"
    }
  ]

  ngOnInit(): void {
  }
  ngAfterViewInit() {
      console.log(this.child.height.nativeElement.offsetHeight);
  }

}
