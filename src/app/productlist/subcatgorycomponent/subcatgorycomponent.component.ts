import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService } from '../../Services/api-service.service';
import { CookiesService } from '../../Services/cookies.service';
interface popularity {
  name: string,
  slug: string
}

@Component({
  selector: 'app-subcatgorycomponent',
  templateUrl: './subcatgorycomponent.component.html',
  styleUrls: ['./subcatgorycomponent.component.scss']
})
export class SubcatgorycomponentComponent implements OnInit {
  suggestions: boolean = true;
  showFiterModel: boolean = false;
  previousdata: any;
  productCheck: boolean = false;
  ItemCount: any = 1;
  CartObj: any = {};
  view_card: boolean = true;
  view_list: boolean = false;
  value1: string = '';
  popularity!: popularity[];
  maximum: number = 100;
  max: number = 100;
  slug: any;
  selectedCategory: any = [];
  selectedRatings: any = [];
  ProductListData: any = [];
  ProductbackupData: any = []
  cart_obj: any = [];
  catgory: any;
  price_from: any;
  price_to: any;
  selectedLevel: any = 'default';
  rangeValues: number[] = [0, 100];
  resetvalues: number[] = [0, 100];
  shimmerLoad: boolean = true;
  subCatgoryProduct: any = [];
  @ViewChild('warning') warning: any;
  constructor(private route: ActivatedRoute, private _ApiService: ApiServiceService, private Cookies: CookiesService, private router: Router) {
    this.popularity = [
      { name: "Price low to high", slug: "lowtohigh" },
      { name: "Price high to low", slug: "hightolow" },
      { name: "Name", slug: "name" },
      { name: "Popularity", slug: "popularity" },
    ];
  }

  ngOnInit(): void {
    this.catgory = localStorage.getItem('category');
    let subslug = JSON.parse(this.catgory);
    this.getListingData(subslug);
    this.slug = this.route.snapshot.params;
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

  selected(event: any) {
    console.log(event.target.value);
    this.selectedLevel = event.target.value;
  }

  getselecteddata(selectedValue: any) {
    let obj_Array: any = [];
    this.value1 = selectedValue;
    console.log(this.value1);
    this.suggestions = false;
    if (this.value1.length > 0) {
      this.subCatgoryProduct.map((response: any) => {
        response.products.filter((search: any) => {
          if (search.name.toLowerCase().includes(selectedValue.toLowerCase())) {
            obj_Array.push(search)
          }
        })
      })
      console.log(obj_Array);
      this.subCatgoryProduct.map((resp: any) => {
        resp.products = obj_Array;
      })
    }
    else if(this.value1.length == 0){
      
    }

  }

  productResponse: any = {};
  displayProducts: any = [];
  productList: any = [];
  async getListingData(slug: any) {
    await this._ApiService.getDetailByCategory(slug).then(res => {
      if (res.code == 200) {
        this.productResponse = res.data.subcategory;
        this.ProductListData.push(res);
        for (let data = 0; data < this.productResponse.length; data++) {
          if (this.slug.sublink == this.productResponse[data].slug) {
            this.productList = this.productResponse[data];
            this.subCatgoryProduct.push(this.productResponse[data]);
          }
        }
        this.getPrice();
        console.log("this.productList", this.productList);
        this.shimmerLoad = false;
      }
    })
      .catch((error) => {
        this.warning.show("Danger")
      })
  }

  async AddProductToCart(Item: any) {
    if (localStorage.getItem('ecolink_user_credential') == null) {
      this.cart_obj = [];
      this.previousdata = this.Cookies.GetCartData();
      let recently_added_object = {
        "CartProductId": Item.id,
        "ProductQuantity": this.ItemCount,
        "ProductCategory": this.slug.slug
      }
      this.cart_obj.push(recently_added_object);
      if (this.previousdata != 'empty') {
        this.previousdata.map((res: any) => {
          if (res.CartProductId != this.cart_obj[0].CartProductId) {
            this.cart_obj.push(res);
          }
          else {
            // res.ProductQuantity = res.ProductQuantity + this.cart_obj.ProductQuantity;
            this.cart_obj[0].ProductQuantity = this.cart_obj[0].ProductQuantity + res.ProductQuantity;
            console.log(this.cart_obj);
          }
        })
      }
      this.Cookies.SaveCartData(this.cart_obj);
      console.log(this.cart_obj);
    }
    else {
      console.log(Item);
      this._ApiService.addItemToCart(Item.id, this.ItemCount, "add")
      // this._ApiService.addItemToCart(Item.id, this.ItemCount, "add").subscribe((res: any) => {
      //   console.log(res);
      // })
    }
  }

  getFilterModel() {
    this.showFiterModel = true;
    this.showFiterModel = !this.showFiterModel;
  }

  addWishList(product: any) {
    if (localStorage.getItem('ecolink_user_credential') != null) {
      console.log(product.id);
      this._ApiService.addItemToWishlist(product.id).subscribe(res => {
        console.log(res);
      })
      this.router.navigate(['/shop/wishlist'])
    }

    else {
      this.router.navigate(['/profile/auth'])
    }
  }

  getDataForFilter() {
    console.log(this.productList);
    this.productCheck = false;
    let obj_Array: any[] = [];
    let filterValue = {
      category: Array.from(this.selectedCategory, Number),
      price_from: this.rangeValues[0],
      price_to: this.rangeValues[1],
      rating: Array.from(this.selectedRatings, Number),
      sortby: this.selectedLevel
    }
    console.log(filterValue);
    this._ApiService.filterProduct(filterValue).subscribe((res: any) => {
      console.log("response", res);
      Object.keys(res.data).map(function (key) {
        obj_Array.push(res.data[key]);
      });
      this.subCatgoryProduct[0].products = obj_Array;
      console.log(this.subCatgoryProduct);
      this.getPrice();
    },
      (error: HttpErrorResponse) => {
        if (error.error.code == 400) {
          this.productCheck = true;
        }
      }
    );

    console.log(this.productList);
  }

  getPrice() {
    this.subCatgoryProduct.filter((res: any) => {
      this.price_from = Math.min(...res.products.map((item: any) => item.regular_price));
      this.price_to = Math.max(...res.products.map((item: any) => item.regular_price));
      this.maximum = (this.price_to * 35) / 100 + this.price_to;
      this.rangeValues = [this.price_from, this.price_to]
      console.log(this.maximum, this.rangeValues[1]);
    })
  }

  ClearAll() {
    console.log(this.productList, this.subCatgoryProduct);
    this.subCatgoryProduct = this.productList;
    // this.getPrice();
    // this.productCheck = false;
    // this.selectedRatings = false
  }

  getkeypressdata() {
    console.log(this.value1);
    if (this.value1.length > 0) {
      this.suggestions = true;
    }
    else if (this.value1.length == 0) {
      this.suggestions = false;
      // this.subCatgoryProduct = this.productList;
    }

    console.log(this.subCatgoryProduct);

  }

}
