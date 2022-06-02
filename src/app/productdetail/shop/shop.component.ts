import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService } from 'src/app/Services/api-service.service';
import { CommonservicesService } from 'src/app/Services/commonservices.service';
import { CookiesService } from 'src/app/Services/cookies.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  ItemCount: any = 1;
  stock: any
  slug: any;
  minimum_qyt: any = 1;
  previousdata: any;
  test_slug: any;
  recommended_products: any = [];
  detailSlug: any;
  shimmerLoad: boolean = true;
  CartButton: string = "Add to Cart";
  DisabledCartButton: boolean = false;

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
  productDetail: any = [];
  constructor(public _ApiService: ApiServiceService, private route: ActivatedRoute, private Cookies: CookiesService, private router: Router, private commonService: CommonservicesService) { }

  ngOnInit(): void {
    this.slug = this.route.snapshot.params;
    if (this.slug.subsublug) {
      this.detailSlug = this.slug.slug + '/' + this.slug.subslug + '/' + this.slug.subsublug;
    }

    else if (this.slug.subslug) {
      this.detailSlug = this.slug.slug + '/' + this.slug.subslug;
    }

    else {
      this.detailSlug = this.slug.slug
    }
    this.getProductDetail(this.detailSlug);

  }

  //increase and decrease product quantity on detail page
  Count(string: any) {
    // this.CartButton = "Add to Cart";
    // this.DisabledCartButton = false;
    if (string == "increase") {
      this.ItemCount = this.ItemCount + 1;
    }
    if (string == "decrease") {
      this.ItemCount = this.ItemCount - 1;
    }
  }

  //get product detail
  ItemStorage: any;
  ItemCountStorage: any;
  async getProductDetail(sendslug: any) {
    await this._ApiService.getProductDetail(sendslug).then((res: any) => {
      console.log(res.data.product);
      if (res.code == 200) {
        this.productDetail.push(res);
        this.minimum_qyt = res.data.product.minimum_qty;
        this.stock = res.data.product.stock;
        this.recommended_products = res.data.related_products;
        this.shimmerLoad = false;
        this.ItemCount = this.minimum_qyt == null ? 1 : this.minimum_qyt;
        if (localStorage.getItem("ItemCountSession")) {
          this.ItemCountStorage = localStorage.getItem("ItemCountSession");
          let CountStorage = JSON.parse(this.ItemCountStorage);
          this.ItemCount = CountStorage;
          console.log("Copied");

        }

        // this._ApiService.itemCountSession.subscribe(resp => {
        //   console.log(typeof resp);

        //   if (typeof (resp) == 'object') {
        //     this._ApiService.itemCountSession.next(this.ItemCount);
        //   }

        //   else if (typeof (resp) == 'string' && resp == 'empty') {
        //     this._ApiService.itemCountSession.next(this.minimum_qyt);
        //   }

        //   else if (typeof resp == 'number') {
        //     this.ItemCount = resp;
        //   }
        // })

        this.ItemStorage = localStorage.getItem("ItemExist");
        if (this.ItemStorage) {
          let ItemData = JSON.parse(this.ItemStorage);
          console.log(ItemData);
          ItemData.map((resp: any) => {
            if (resp.ItemId == res.data.product.id) {
              this.CartButton = "Go to Cart"
              this.DisabledCartButton = true;
            }
          })
        }

      }
    })
  }


  //add product to cart
  CartItem: any = [];
  AddProductToCart(Item: any) {
    console.log(this.ItemCount);
    this.commonService.AddProductToCart(Item, this.slug, this.ItemCount);
    this._ApiService.itemCountSession.next(this.ItemCount);
    localStorage.setItem("ItemCountSession", JSON.parse(this.ItemCount));
    this._ApiService.CartItems.subscribe(res => {
      res.map((resp: any) => {
        if (resp.ItemId != Item.id) {
          this.CartItem.push(resp);
        }
      })
    })
    this.CartItem.push({
      ItemCount: this.ItemCount,
      ItemId: Item.id
    })
    this._ApiService.CartItems.next(this.CartItem);
    localStorage.setItem("ItemExist", JSON.stringify(this.CartItem));
  }

  // add item to wishlist
  addWishList(product: any) {
    this.commonService.addWishList(product);
  }

  // route on same page where we are
  routeOnSamePage(slug: any) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/shop/' + this.slug.category + '/' + slug]);
  }

}