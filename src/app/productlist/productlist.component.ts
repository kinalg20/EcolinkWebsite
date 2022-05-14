import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY } from 'rxjs';
import { ApiServiceService } from '../Services/api-service.service';
import { CommonservicesService } from '../Services/commonservices.service';
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
  productCheck: boolean = false;
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
  ProductbackupData: any = [];
  price_from: any;
  price_to: any;
  selectedLevel: any = 'default';
  rangeValues: number[] = [0, 100];
  resetvalues: number[] = [0, 100];
  shimmerLoad: boolean = true;
  @ViewChild('warning') warning: any;
  constructor(private route: ActivatedRoute, private _ApiService: ApiServiceService, private Cookies: CookiesService, private router: Router, private commonService: CommonservicesService) {
    this.popularity = [
      { name: "Price low to high", slug: "lowtohigh" },
      { name: "Price high to low", slug: "hightolow" },
      { name: "Name", slug: "name" },
      { name: "Popularity", slug: "popularity" },
    ];
  }

  ngOnInit(): void {
    this.slug = this.route.snapshot.params;
    if (this.slug.sublink) {
      this.getListingData(this.slug.sublink);
    }
    else {
      this.getListingData(this.slug.slug);
    }
    localStorage.setItem("category", JSON.stringify(this.slug.slug));
    this._ApiService.itemCountSession.next("empty");
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

  //show list on grid and list view
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

  //selected dropdown value for fiter
  selected(event: any) {
    this.selectedLevel = event.target.value;
  }

  //fetch data on search
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



  // fetch data by selected slug
  productResponse: any = {};
  displayProducts: any = [];
  productList: any = [];
  getListingData(slug: any) {
    this._ApiService.getDetailByCategory(slug)
      .then((res: any) => {
        if (res.code == 200) {
          this.productResponse = res.data;
          this.productList = this.productResponse.products;
          this.displayProducts = this.productList;
          this.ProductListData.push(res);
          this.getPrice();
          this.shimmerLoad = false;
          console.log(this.productResponse);

        }
      })
      .catch((error) => {
        if (error.error.code == 400) {
          this.warning.show('Danger');
        }
      })
  }

  // add product to cart
  AddProductToCart(Item: any) {
    let ItemCount = 1;
    this.commonService.AddProductToCart(Item, this.slug, ItemCount);
  }

  // toggle filter model
  getFilterModel() {
    this.showFiterModel = true;
    this.showFiterModel = !this.showFiterModel;
  }

  // add data to wishlist
  addWishList(product: any) {
    this.commonService.addWishList(product);
  }

  // get data using filter api
  getDataForFilter() {
    this.productCheck = false;
    let obj_Array: any[] = [];
    let filterValue = {
      category: Array.from(this.selectedCategory, Number),
      price_from: this.rangeValues[0],
      price_to: this.rangeValues[1],
      rating: Array.from(this.selectedRatings, Number),
      sortby: this.selectedLevel
    }
    this._ApiService.filterProduct(filterValue).subscribe((res: any) => {
      Object.keys(res.data).map(function (key) {
        obj_Array.push(res.data[key]);
      });
      this.ProductListData[0].data.products = obj_Array;
      this.getPrice();
    },
      (error: HttpErrorResponse) => {
        if (error.error.code == 400) {
          this.productCheck = true;
        }
      }
    );
  }


  //get price for range filter
  getPrice() {
    this.ProductListData.filter((res: any) => {
      this.price_from = Math.min(...res.data.products.map((item: any) => item.regular_price));
      this.price_to = Math.max(...res.data.products.map((item: any) => item.regular_price));
      this.maximum = (this.price_to * 35) / 100 + this.price_to;
      this.rangeValues = [this.price_from, this.price_to]
      console.log(this.maximum, this.rangeValues[1]);
    })
  }

  //clear filter
  ClearAll() {
    this.ProductListData[0].data.products = this.displayProducts;
    console.log(this.displayProducts);
    this.getPrice();
    this.productCheck = false;
    this.selectedRatings = false;
  }

  //get data on key press
  getkeypressdata() {
    console.log(this.value1);
    if (this.value1.length > 0) {
      this.suggestions = true;
    }
    else if (this.value1.length == 0) {
      this.ProductListData[0].data.products = this.displayProducts;
    }
  }
}

