import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/Services/api-service.service';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})
export class MediaComponent implements OnInit {
  getAllBlog: any = [];
  backupBlog: any = [];
  searchValue: string = '';
  showSuggestedList : boolean =false;
  constructor(private __apiservice: ApiServiceService, private router: Router) { }

  ngOnInit(): void {
    this.__apiservice.getAllBlogs().subscribe(res => {
      this.getAllBlog = res.data;
      this.backupBlog = res;
      setTimeout(() => {
        console.log(this.getAllBlog);
      }, 500);
    })
  }

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

  routeOnSamePage(slug: any) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/' + slug]);
  }
  getInputValue() {
    // window.scroll(1200, 1200)
    // this.getAllBlog = [];
    if(this.searchValue) {
      this.backupBlog.data.map((res: any) => {
        if (res.title.includes(this.searchValue)) {
          console.log(this.searchValue)
          console.log(res.slug);
          this.router.navigateByUrl('/info/'+res.slug);
        }
      })
    }
  }
  getInputSelectedValue(value:any) {
    this.searchValue=value;
    this.showSuggestedList=false
  }
  getSearchedBlog(){
    if(this.searchValue.length>0){
      this.showSuggestedList = true;
    }
    else{
      this.showSuggestedList = false;
    }
  }
}
