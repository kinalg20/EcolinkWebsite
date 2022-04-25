import { Component, Input, OnInit } from '@angular/core';
import { ApiServiceService } from 'src/app/Services/api-service.service';

@Component({
  selector: 'app-home-banner',
  templateUrl: './home-banner.component.html',
  styleUrls: ['./home-banner.component.scss']
})
export class HomeBannerComponent implements OnInit {
  newsletter_email: any;
  showGlobalSearchSuggestion: boolean = false;
  searchItem: string = '';
  slug: any;
  subslug: any;
  suggestionList: any = []
  showMsg: boolean = false;
  msg: any = '';

  constructor(private _ApiService: ApiServiceService) { }
  action_array = [
    {
      imgurl: "https://t4.ftcdn.net/jpg/02/27/41/31/360_F_227413125_c5CgAhRF9FVpEYKzckx8le5cSMpYx9YP.jpg",
      heading: "Ask The Chemist",
      content: "Get answer of your query to ask the chemist",
      route: "inner-pages/contact/ask-the-chemist"
    },
    {
      imgurl: "https://wallpaperaccess.com/full/2847970.jpg",
      heading: "Pricing",
      content: "Get quality product at reasonable price",
      route: "productlist"
    },
    {
      imgurl: "https://ecolink.com/wp-content/uploads/2020/05/Dollarphotoclub_58451099-1-750x321.jpg",
      heading: "Ecolink",
      content: "Chemical solution for next generation",
      route: "blog"
    },
    {
      imgurl: "https://blog.ipleaders.in/wp-content/uploads/2017/08/BV-Acharya-104.jpg",
      heading: "About Us",
      content: "Know about company & Meet our team",
      route: "about-us"
    },
    {
      imgurl: "https://static.fibre2fashion.com/articleresources/images/87/8623/chemical-big_Big.jpg",
      heading: "Ecolink Manufacturing",
      content: "Ecolink’s successful work in the manufacturing sector",
      route: "manufacture"
    },
    {
      imgurl: "http://www.safemax.co.id/wp-content/uploads/2016/02/banner-services.jpg",
      heading: "Our Services",
      content: "Services and Marketing",
      route: "productlist"
    }
  ]

  ngOnInit(): void {

    // setTimeout(() => {
    //   console.log(this.getCategory.data);
    // }, 500);
  }

  subscribe() {
    let endpoint = 'newsletter'
    console.log(this.newsletter_email);
    this._ApiService.newLatter(endpoint, this.newsletter_email).subscribe(res => {
      if (res.code == 200) {
        console.log(res);
        this.showMsg=true;
        this.newsletter_email=''
      }
    })
  }

  globalSearch() {
    console.log(this.searchItem);
    if (this.searchItem.length > 0) {
      this.showGlobalSearchSuggestion = true;
      this._ApiService.globalSearchData(this.searchItem).subscribe(res => {
        this.suggestionList = res;
      })
    }
    else {
      this.showGlobalSearchSuggestion = false;
    }
  }

  getSuggestion(data: any) {
    this.showGlobalSearchSuggestion = false;
    this.slug = data.category.slug;
    this.subslug = data.slug;
    this.searchItem = data.name;
  }

}
