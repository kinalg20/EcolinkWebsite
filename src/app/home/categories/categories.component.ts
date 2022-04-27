import { Component, Input, OnInit } from '@angular/core';
import { ApiServiceService } from 'src/app/Services/api-service.service';
import { FetchedCategoriesState } from 'src/app/store/state/category.state';
import { GetcategoriesAction } from 'src/app/store/actions/category.action';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  getCategory: any = [];
  categoriesData: any;
  @Select(FetchedCategoriesState.getFetchedCategory) categories$!: Observable<any>;
  @Select(FetchedCategoriesState.getFetchedCategoryLoad) categoriesLoaded$!: Observable<boolean>;
  constructor(public __apiService: ApiServiceService , private store: Store) { }

  ngOnInit(): void {
    // this.__apiService.getAllCategories().subscribe(res => {
    //   this.getCategory = res;
    // })
    // setTimeout(() => {
    //   console.log(this.getCategory)
    // }, 1000);

    this.getAllCategories();
    this.categories$.subscribe(res => {
      this.getCategory = res;
      console.log(res);
    });
  }

  getAllCategories() {
    this.categoriesData = this.categoriesLoaded$.subscribe(res => {
      if (!res) {
        this.store.dispatch(new GetcategoriesAction());
      }
    })
  }

  ngOnDestroy(){
    this.categoriesData.unsubscribe();
  }
}

