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
  ItemCount: any;
  stock: any
  slug: any;
  minimum_qyt: any = 1;
  previousdata: any;
  test_slug: any;
  recommended_products: any = [];
  detailSlug: any;
  shimmerLoad: boolean = true;

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


  Count(string: any) {
    if (string == "increase" ) {
      this.ItemCount = this.ItemCount + 1;
    }
    if (string == "decrease") {
      this.ItemCount = this.ItemCount - 1;
    }
  }

  //get product detail
  getProductDetail(sendslug: any) {
    let value: any;
    this._ApiService.getProductDetail(sendslug).subscribe((res: any) => {
      if (res.code == 200) {
        this.productDetail.push(res);
        this.minimum_qyt = res.data.product.minimum_qty;
        this.stock = res.data.product.stock;
        this.recommended_products = res.data.related_products;
        this.shimmerLoad = false;
        this.ItemCount = this.minimum_qyt == null ? 1 : this.minimum_qyt;
        this._ApiService.itemCountSession.subscribe(resp => {
          if (typeof (resp) == 'object') {
            this._ApiService.itemCountSession.next(this.ItemCount);
          } 

          else if(typeof (resp) == 'string' && resp == 'empty'){
            this._ApiService.itemCountSession.next(this.minimum_qyt);
          }
           
          else {
            this.ItemCount = resp;
          }
        })
        // console.log("res",res);
        
      }
    })
  }


  //add product to cart
  AddProductToCart(Item: any) {
    console.log(this.ItemCount);
    this.commonService.AddProductToCart(Item, this.slug, this.ItemCount);
    this._ApiService.itemCountSession.next(this.ItemCount);
  }

  // add item to wishlist
  addWishList(product: any) {
    this.commonService.addWishList(product);
  }


  routeOnSamePage(slug: any) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/shop/' + this.slug.category + '/' + slug]);
  }

}
