import { Component, OnInit } from '@angular/core';
import { CookiesService } from 'src/app/Services/cookies.service';

@Component({
  selector: 'app-product-checkout',
  templateUrl: './product-checkout.component.html',
  styleUrls: ['./product-checkout.component.scss']
})
export class ProductCheckoutComponent implements OnInit {
  selectedPaymentMethod: any;
  ProductItem: any;
  constructor() { }

  ngOnInit(): void {
    this.ProductItem = localStorage.getItem("CheckoutData");
    console.log(this.ProductItem);
  }

}
