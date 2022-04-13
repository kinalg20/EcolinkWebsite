import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-checkout',
  templateUrl: './product-checkout.component.html',
  styleUrls: ['./product-checkout.component.scss']
})
export class ProductCheckoutComponent implements OnInit {
  selectedPaymentMethod:any
  constructor() { }

  ngOnInit(): void {
  }

}
