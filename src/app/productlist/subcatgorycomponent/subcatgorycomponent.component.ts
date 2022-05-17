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
  subslug: any;
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
    this.subslug = JSON.parse(this.catgory);
    this.getListingData(this.subslug);
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

  //selected product in dropdown
  selected(event: any) {
    console.log(event.target.value);
    this.selectedLevel = event.target.value;
  }

  //selected from search bar
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
    else if (this.value1.length == 0) {
      this.subCatgoryProduct[0].products = this.displayProducts;
    }

  }


  //get data by slug from api 
  productResponse: any = {};
  displayProducts: any = [];
  productList: any = [];
  async getListingData(slug: any) {
    await this._ApiService.getDetailByCategory(slug).then((res: any) => {
      if (res.code == 200) {
        this.productResponse = res.data.subcategory;
        for (let data = 0; data < this.productResponse.length; data++) {
          if (this.slug.sublink == this.productResponse[data].slug) {
            this.subCatgoryProduct.push(this.productResponse[data]);
            this.productList = this.productResponse[data];
            this.displayProducts = this.productList.products;
          }
        }
        this.getPrice();
        console.log("this.productList", this.productResponse);
        this.shimmerLoad = false;
      }
    })
      .catch((error) => {
        this.warning.show("Danger")
      })
  }

  //Add products to cart
  async AddProductToCart(Item: any) {
    if (localStorage.getItem('ecolink_user_credential') == null) {
      this.cart_obj = [];
      this.previousdata = this.Cookies.GetCartData();
      let recently_added_object = {
        "CartProductId": Item.id,
        "ProductQuantity": 1,
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
      this._ApiService.addItemToCart(Item.id, 1, "add");
    }
  }

  // toggle filter model for mobile screen
  getFilterModel() {
    this.showFiterModel = true;
    this.showFiterModel = !this.showFiterModel;
  }


  //add data to wishlist
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

  //get data from filter api
  getDataForFilter() {
    console.log(this.productList);
    let obj_Array: any[] = [];
    let filterValue = {
      category: Array.from(this.selectedCategory, Number),
      price_from: this.rangeValues[0],
      price_to: this.rangeValues[1],
      rating: Array.from(this.selectedRatings, Number),
      sortby: this.selectedLevel
    }
    this._ApiService.filterProduct(filterValue).then((res: any) => {
      console.log("response", res);
      Object.keys(res.data).map(function (key) {
        obj_Array.push(res.data[key]);
      });
      this.subCatgoryProduct[0].products = obj_Array;
    })
     .catch(error => {
        if (error.status == 400) {
          this.subCatgoryProduct[0].products = [];
        }
      }
    );

  }

  //get range for filter
  getPrice() {
    this.subCatgoryProduct.filter((res: any) => {
      this.price_from = Math.min(...res.products.map((item: any) => item.regular_price));
      this.price_to = Math.max(...res.products.map((item: any) => item.regular_price));
      this.maximum = (this.price_to * 35) / 100 + this.price_to;
      this.rangeValues = [this.price_from, this.price_to]
      console.log(this.maximum, this.rangeValues[1]);
    })
  }

  // clear filter
  ClearAll() {
    console.log(this.productList, this.subCatgoryProduct);
    this.subCatgoryProduct[0].products = this.displayProducts;
    this.getPrice();
    console.log(this.displayProducts, this.subCatgoryProduct);
  }

  // get suggestion on key press
  getkeypressdata() {
    console.log(this.value1);
    if (this.value1.length > 0) {
      this.suggestions = true;
    }
    else if (this.value1.length == 0) {
      this.suggestions = false;
      this.subCatgoryProduct[0].products = this.displayProducts;
    }
    console.log(this.displayProducts);

  }

  getImageurl(image:any){
    return `https://brandtalks.in/ecolink/storage/products/`+ image;
  }

}
