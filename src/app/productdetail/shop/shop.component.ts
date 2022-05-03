import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService } from 'src/app/Services/api-service.service';
import { CookiesService } from 'src/app/Services/cookies.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  ItemCount: any;
  stock:any
  slug: any;
  minimum_qyt:any=1
  cart_obj: any = []
  previousdata: any;
  recommended_products: any = [];
  detailSlug: any;
  shimmerLoad:boolean= true;

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
  constructor(public _ApiService: ApiServiceService, private route: ActivatedRoute, private Cookies: CookiesService, private router:Router) { }

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


  Count(string: any) {
    if (string == "increase" && this.ItemCount < this.stock) {
      this.ItemCount = this.ItemCount + 1;
    }
    if (string == "decrease" && this.ItemCount > this.minimum_qyt) {
      this.ItemCount = this.ItemCount - 1;
    }
  }

  getProductDetail(sendslug: any) {
    this._ApiService.getProductDetail(sendslug).subscribe((res: any) => {
      if (res.code == 200) {
        this.productDetail.push(res);
        this.minimum_qyt=res.data.product.minimum_qty;
        this.stock=res.data.product.stock;
        console.log(res);
        this.recommended_products = res.data.related_products;
        this.shimmerLoad = false;
        this.ItemCount = this.minimum_qyt;
      }
    })
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
          else {
            this.cart_obj[0].ProductQuantity = this.cart_obj[0].ProductQuantity + res.ProductQuantity;
            console.log(this.cart_obj);
          }
        })
      }
      this.Cookies.SaveCartData(this.cart_obj);
      console.log(this.cart_obj);
    }

    else {
      this._ApiService.addItemToCart(Item.id, this.ItemCount, "add").subscribe((res: any) => {
        console.log(res);
      })
    }
  }

  addWishList(product: any) {
    if(localStorage.getItem('ecolink_user_credential')!=null){
      console.log("product_id", product.id);
    this._ApiService.addItemToWishlist(product.id).subscribe(res => {
      console.log(res);
    })
      this.router.navigate(['/shop/wishlist'])
    }

    else{
      this.router.navigate(['/profile/auth'])
    }
    
  }
}
