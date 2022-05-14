import { ViewportScroller } from '@angular/common';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ApiServiceService } from 'src/app/Services/api-service.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-home-banner',
  templateUrl: './home-banner.component.html',
  styleUrls: ['./home-banner.component.scss']
})
export class HomeBannerComponent implements OnInit {
  newsletter_email: any;
  showGlobalSearchSuggestion: boolean = false;
  @Output() newItemEvent = new EventEmitter<string>();
  searchItem: string = '';
  slug: any;
  subslug: any;
  suggestionList: any = []
  showMsg: boolean = false;
  msg: any = '';
  assetsurl: any;
  constructor(private _ApiService: ApiServiceService, private scroller: ViewportScroller) { }
  action_array = [
    {
      imgurl: "assets/askchemist.jpg",
      heading: "Ask The Chemist",
      content: "Need a technical question answered?",
      route: "contact/ask-the-chemist"
    },
    {
      imgurl: "assets/2847970.jpeg",
      heading: "Pricing",
      content: "Bulk pricing is available for 12, 24 or more drums",
      route: "productlist"
    },
    {
      imgurl: "/assets/Ecolink.jpg",
      heading: "Ecolink",
      content: "Providing Lean(er) chemical solutions for next gen",
      route: "info"
    },
    {
      imgurl: "/assets/abouus.jpg",
      heading: "About Us",
      content: "Supplying degreasers internationally for over 30 years",
      route: "about-us"
    },
    {
      imgurl: "/assets/manufacturing.jpg",
      heading: "Ecolink Manufacturing",
      content: "Ecolink’s successful work in the manufacturing sector",
      route: "manufacture"
    },
    {
      imgurl: "/assets/ourservices.jpg",
      heading: "Our Services",
      content: "Services and Marketing",
      route: "productlist"
    }
  ]

  ngOnInit(): void {
    this.assetsurl = environment.assetsurl;

    // setTimeout(() => {
    //   console.log(this.getCategory.data);
    // }, 500);
  }

  subscribe(value: any) {
    // this.scroller.scrollToAnchor("targetRed");
    // let endpoint = 'newsletter'
    this.newItemEvent.emit(value);
    // console.log(this.newsletter_email);
    // this._ApiService.newLatter(endpoint, this.newsletter_email).subscribe(res => {
    //   if (res.code == 200) {
    //     console.log(res);
    //     this.showMsg=true;
    //     this.newsletter_email=''
    //   }
    // })
  }
  getSuggestion(data: any) {
    this.showGlobalSearchSuggestion = false;
    this.slug = data.category.slug;
    this.subslug = data.slug;
    this.searchItem = data.name;
  }

  getImageUrl(path: string): string {
    console.log("path");
    return `https://brandtalks.in/ecolinkfrontend${path}`;
  }

}
