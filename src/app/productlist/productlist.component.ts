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
  ProductbackupData: any = []
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
    let obj_Array: any = [];
    this.value1 = selectedValue;
    this.suggestions = false;
    if (this.value1.length > 0) {
      obj_Array.push(
        this.ProductListData[0].data.products.filter((search: any) => {
          return search.name.toLowerCase().indexOf(selectedValue.toLowerCase()) > -1
        })
      )
    }
    this.ProductListData[0].data.products = obj_Array[0];
  }

  productResponse:any={};
  displayProducts:any=[];
  productList:any=[];
  getListingData(slug: any) {
    this._ApiService.getDetailByCategory(slug).subscribe(res => {
      if (res.code == 200) {
        this.productResponse=res.data;
        this.productList = this.productResponse.products;
        this.displayProducts=this.productList;
        console.log("this.productResponse", this.displayProducts)
        this.ProductListData.push(res);
        this.getPrice();
      }
      if (res.code == 400) {
        this.warning.show("Warning")
      }
    })
    this.ProductbackupData = this.ProductListData;
    console.log("this.ProductListData",this.ProductbackupData);
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
      this.cart_obj.push(recently_added_object);
      if (this.previousdata != 'empty') {
        this.previousdata.map((res: any) => {
          if (res.CartProductId != this.cart_obj[0].CartProductId) {
            this.cart_obj.push(res);
          }
        })
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

  addWishList(product: any) {
    console.log(product.id);
    this._ApiService.addItemToWishlist(product.id).subscribe(res => {
      console.log(res);
    })
  }

  getDataForFilter() {
    let obj_Array: any[] = [];
    console.log(this.ProductListData);
    let filterValue = {
      category: this.selectedCategory,
      price_from: this.rangeValues[0],
      price_to: this.rangeValues[1],
      rating: this.selectedRatings,
      sortby: this.selectedLevel
    }
    this._ApiService.filterProduct(filterValue).subscribe((res: any) => {
      console.log("response", res);
      Object.keys(res.data).map(function (key) {
        obj_Array.push(res.data[key]);
      });
      this.ProductListData[0].data.products = obj_Array;
      this.getPrice();
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

  ClearAll() {
    this.ProductListData[0].data.products  = this.displayProducts; 
  }

  getkeypressdata() {
    console.log(this.value1);
    if (this.value1.length > 0) {
      this.suggestions = true;
    }
    if (this.value1.length == 0) {
      this.ProductListData[0].data.products = this.displayProducts;
    }
  }
}

