import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../Services/api-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  getCategory:any=[];
  constructor(public __apiService : ApiServiceService) { }

  ngOnInit(): void {
    this.__apiService.getAllCategories().subscribe(res=>{
      this.getCategory=res;
    })
  }
}
