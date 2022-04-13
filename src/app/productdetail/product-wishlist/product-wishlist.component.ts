import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-wishlist',
  templateUrl: './product-wishlist.component.html',
  styleUrls: ['./product-wishlist.component.scss']
})
export class ProductWishlistComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  products = [
    {
      id: 1,
      name: "Electric Planer Brandix KL370090G 300 Watts",
      price: 30,
      category: "Aerosol",
      quantity: 2,
      status:"In stock"

    },
    {
      id: 2,
      name: "Electric Planer Brandix KL370090G 300 Watts",
      price: 30,
      category: "Aerosol",
      quantity: 1,
      status:"In stock"
    },
    {
      id: 3,
      name: "Electric Planer Brandix KL370090G 300 Watts",
      price: 30,
      category: "Aerosol",
      quantity: 2,
      status:"In stock"
    },
    {
      id: 4,
      name: "Electric Planer Brandix KL370090G 300 Watts",
      price: 30,
      category: "Aerosol",
      quantity: 2,
      status:"In stock"
    },
    {
      id: 5,
      name: "Electric Planer Brandix KL370090G 300 Watts",
      price: 30,
      category: "Aerosol",
      quantity: 2,
      status:"In stock"
    },
    {
      id: 6,
      name: "Electric Planer Brandix KL370090G 300 Watts",
      price: 30,
      category: "Aerosol",
      quantity: 2,
      status:"In stock"
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
