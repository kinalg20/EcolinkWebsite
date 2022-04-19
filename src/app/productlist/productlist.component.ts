import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiServiceService } from '../Services/api-service.service';
import { CookiesService } from '../Services/cookies.service';
interface popularity {
  name: string,
  slug: string
}

@Component({
  selector: 'app-productlist',
  templateUrl: './productlist.component.html',
  styleUrls: ['./productlist.component.scss']
})
export class ProductlistComponent implements OnInit {
  suggestions: boolean = true;
  showFiterModel: boolean = false;
  previousdata: any;
  ItemCount: any = 1;
  CartObj: any = {};
  view_card: boolean = true;
  view_list: boolean = false;
  value1: string = '';
  popularity!: popularity[];
  maximum: number = 100;
  slug: any;
  selectedCategory: string[] = [];
  selectedRatings: string[] = [];
  ProductListData: any = [];
  cart_obj: any = [];
  price_from: any;
  price_to: any;
  selectedLevel: any = 'default';
  rangeValues: number[] = [0, 100];
  @ViewChild('warning') warning: any;
  constructor(private route: ActivatedRoute, private _ApiService: ApiServiceService, private Cookies: CookiesService) {
    this.popularity = [
      { name: "Price low to high", slug: "lowtohigh" },
      { name: "Price high to low", slug: "hightolow" },
      { name: "Name", slug: "name" },
      { name: "Popularity", slug: "popularity" },
    ];
  }

  ngOnInit(): void {
    this.slug = this.route.snapshot.params;
    this.getListingData(this.slug);
    localStorage.setItem("category", JSON.stringify(this.slug.slug));
  }
  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 3
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 2
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
    }
  ];
  Students = [{
    "id": 1,
    "name": "Nathaniel Graham",
    "email": "nathaniel.graham@example.com"
  },
  {
    "id": 2,
    "name": "Avery Adams",
    "email": "avery.adams@example.com"
  },
  {
    "id": 3,
    "name": "Mario Stevens",
    "email": "mario.stevens@example.com"
  },
  {
    "id": 4,
    "name": "Constance Beck",
    "email": "constance.beck@example.com"
  },
  {
    "id": 5,
    "name": "Jimmie Little",
    "email": "jimmie.little@example.com"
  },
  {
    "id": 6,
    "name": "Avery Matthews",
    "email": "avery.matthews@example.com"
  },
  {
    "id": 7,
    "name": "Pat Sutton",
    "email": "pat.sutton@example.com"
  },
  {
    "id": 8,
    "name": "Danny Crawford",
    "email": "danny.crawford@example.com"
  },
  {
    "id": 9,
    "name": "Pearl Mccoy",
    "email": "pearl.mccoy@example.com"
  },
  {
    "id": 10,
    "name": "Flenn Wallace",
    "email": "flenn.wallace@example.com"
  }
  ]

  showlist(string: string) {
    if (string == 'list') {
      this.view_list = true;
      this.view_card = false;
    }
    if (string == "card") {
      this.view_list = false;
      this.view_card = true;
    }
  }

  selected(event: any) {
    console.log(event.target.value);
    this.selectedLevel = event.target.value;
  }

  getselecteddata(selectedValue: any) {
    this.value1 = selectedValue;
    this.suggestions = false;
  }
  getListingData(slug: any) {
    let price_array: any[] = [];
    setTimeout(() => {
      this._ApiService.getDetailByCategory(slug).subscribe(res => {
        if (res.code == 200) {
          this.ProductListData.push(res);
          console.log(this.ProductListData);
          this.ProductListData.map((res: any) => {
            console.log("products", res.data.products)
          })
          this.getPrice();
        }
        if (res.code == 400) {
          this.warning.show("Warning")
        }

      })
    }, 500);
  }

  AddProductToCart(Item: any) {
    if (localStorage.getItem('ecolink_user_credential') == null) {
      this.cart_obj = [];
      this.previousdata = this.Cookies.GetCartData();
      let recently_added_object = {
        "CartProductId": Item.id,
        "ProductQuantity": this.ItemCount,
        "ProductCategory": this.slug.slug
      }
      console.log('previous data', this.previousdata);
      if (this.previousdata != 'empty') {
        this.previousdata.map((res: any) => {
          if (!(res.CartProductId == recently_added_object.CartProductId && res.ProductCategory === recently_added_object.ProductCategory)) {
            this.cart_obj.push(recently_added_object);
          }
          this.cart_obj.push(res);
        })
      }
      else {
        this.cart_obj.push(recently_added_object);
      }
      this.Cookies.SaveCartData(this.cart_obj);
      console.log(this.cart_obj);
    }
    else {
      console.log(Item);
      this._ApiService.addItemToCart(Item.id, this.ItemCount, "add").subscribe((res: any) => {
        console.log(res);
      })
    }
  }

  getFilterModel() {
    this.showFiterModel = true;
    this.showFiterModel = !this.showFiterModel;
  }

  addWishList(product_id: any) {
    console.log(product_id);
    this._ApiService.addItemToWishlist(product_id).subscribe(res => {
      console.log(res);
    })
  }

  getDataForFilter() {
    let filterValue = {
      category: this.selectedCategory,
      price_from: this.rangeValues[0],
      price_to: this.rangeValues[1],
      rating: this.selectedRatings,
      sortby: this.selectedLevel
    }
    console.log(filterValue);
    this._ApiService.filterProduct(filterValue).subscribe(res => {
      console.log("", this.ProductListData[0]);
      console.log(res);
      this.ProductListData[0]=res;
    });
  }

  getPrice() {
    this.ProductListData.filter((res: any) => {
      this.price_from = Math.min(...res.data.products.map((item: any) => item.regular_price));
      this.price_to = Math.max(...res.data.products.map((item: any) => item.regular_price));
      this.maximum = (this.price_to * 35) / 100 + this.price_to;
      this.rangeValues = [this.price_from, this.price_to]
    })

  }
}

