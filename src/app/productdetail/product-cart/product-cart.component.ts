import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-cart',
  templateUrl: './product-cart.component.html',
  styleUrls: ['./product-cart.component.scss']
})
export class ProductCartComponent implements OnInit {
  // productCount: any = 1;
  constructor() { }

  ngOnInit(): void {

  }
  products = [
    {
      id: 1,
      name: "ECC (A) 13oz Aerosol – Case of 12 – Discontinued",
      price: 30,
      category: "Aerosol",
      quantity: 2

    },
    {
      id: 2,
      name: "ECC (A) 13oz Aerosol – Case of 12 – Discontinued",
      price: 30,
      category: "Aerosol",
      quantity: 1

    },
    {
      id: 3,
      name: "ECC (A) 13oz Aerosol – Case of 12 – Discontinued",
      price: 30,
      category: "Aerosol",
      quantity: 2

    },
    {
      id: 4,
      name: "ECC (A) 13oz Aerosol – Case of 12 – Discontinued",
      price: 30,
      category: "Aerosol",
      quantity: 2

    },
    {
      id: 5,
      name: "ECC (A) 13oz Aerosol – Case of 12 – Discontinued",
      price: 30,
      category: "Aerosol",
      quantity: 2

    },
    {
      id: 6,
      name: "ECC (A) 13oz Aerosol – Case of 12 – Discontinued",
      price: 30,
      category: "Aerosol",
      quantity: 2

    }
  ]

  Count(string: any, id: any) {
    if (string == "increase" && this.products[id].quantity < 10) {
      this.products[id].quantity = this.products[id].quantity + 1;
    }
    if (string == "decrease" && this.products[id].quantity > 1) {
      this.products[id].quantity = this.products[id].quantity - 1;
    }
  }
}
