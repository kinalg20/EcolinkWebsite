import { Component, Input, OnInit } from '@angular/core';
import { ApiServiceService } from 'src/app/Services/api-service.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  getCategory: any = [];
  constructor(public __apiService: ApiServiceService) { }

  ngOnInit(): void {
    this.__apiService.getAllCategories().subscribe(res => {
      this.getCategory = res;
    })
  }

}
