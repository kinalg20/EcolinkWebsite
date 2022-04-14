import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { isEmpty } from 'rxjs/operators';
import { ApiServiceService } from '../Services/api-service.service';
import { CookiesService } from '../Services/cookies.service';
interface popularity {
  name: string
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
  val1: any;
  ItemCount: any = 1;
  CartObj: any = {};
  rangeValues: number[] = [20, 80];
  view_card: boolean = true;
  view_list: boolean = false;
  value1: string = '';
  popularity!: popularity[];
  selectedPopularity!: popularity;
  dropdownValue = "Default";
  maximum: number = 100;
  city: string = '';
  slug: any;
  selectedCategory: string[] = [];
  selectedRatings: string[] = [];
  ProductListData: any = [];
  cart_obj: any = []
  @ViewChild('warning') warning: any;
  constructor(private route: ActivatedRoute, private _ApiService: ApiServiceService, private Cookies: CookiesService) {
    this.popularity = [
      { name: "Default" },
      { name: "Price low to high" },
      { name: "Price high to low" },
      { name: "Name" },
      { name: "Date" },
      { name: "Popularity" },
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

  products = [
    {
      id: 1,
      name: "ECC (A) 13oz Aerosol – Case of 12 –",
      price: "$448"
    },
    {
      id: 2,
      name: "ECC (A) 13oz Aerosol – Case of 12 –",
      price: "$448"
    },
    {
      id: 3,
      name: "ECC (A) 13oz Aerosol – Case of 12 –",
      price: "$448"
    },
    {
      id: 4,
      name: "ECC (A) 13oz Aerosol – Case of 12 –",
      price: "$448"
    },
    {
      id: 5,
      name: "ECC (A) 13oz Aerosol – Case of 12 –",
      price: "$448"
    },
    {
      id: 6,
      name: "ECC (A) 13oz Aerosol – Case of 12 –",
      price: "$448"
    },
    {
      id: 7,
      name: "ECC (A) 13oz Aerosol – Case of 12 –",
      price: "$448"
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
  getselecteddata(selectedValue: any) {
    this.value1 = selectedValue;
    this.suggestions = false;
  }
  getListingData(slug: any) {
    setTimeout(() => {
      this._ApiService.getDetailByCategory(slug).subscribe(res => {
        if (res.code == 200) {
          this.ProductListData.push(res);
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
      this._ApiService.addItemToCart(Item.id, this.ItemCount , "add").subscribe((res: any) => {
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
}
