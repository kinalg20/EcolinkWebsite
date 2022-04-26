import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from 'src/app/Services/api-service.service';

@Component({
  selector: 'app-gsa-product',
  templateUrl: './gsa-product.component.html',
  styleUrls: ['./gsa-product.component.scss']
})
export class GSAProductComponent implements OnInit {
  getCategory: any = [];
  constructor(public __apiService: ApiServiceService) { }

  ngOnInit(): void {
    this.__apiService.getAllCategories().subscribe(res => {
      this.getCategory = res;
    })
    setTimeout(() => {
      console.log(this.getCategory)
    }, 1000);
  }

}
