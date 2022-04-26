import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-media-banner',
  templateUrl: './media-banner.component.html',
  styleUrls: ['./media-banner.component.scss']
})
export class MediaBannerComponent implements OnInit {
  @Input() data_input:any;
  moreCheck:boolean=true;
  lessCheck:boolean=false
  blogArray:any=[];
  helperArray:any=[]
  count:any=0;
  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      console.log(this.data_input.data);
      this.data_input.data.map((res:any)=> {
        if(this.count<3){
          this.blogArray.push(res);
          this.helperArray.push(res);
          this.count++;
        }
      })
      console.log(this.blogArray);
    }, 1000);
  }
  loadAllBlog() {
    this.moreCheck=!this.moreCheck;
    this.lessCheck=!this.lessCheck;
    this.blogArray=[]
    if(this.moreCheck==false) {
      console.log('more',this.moreCheck);
      this.data_input.data.map((res:any)=> {
        this.blogArray.push(res);
        console.log(this.blogArray)
      })
    }
    else {
      console.log('less',this.lessCheck);
      console.log(this.helperArray);
      this.helperArray.map((res:any)=> {
        this.blogArray.push(res);
        console.log(this.blogArray);
      })
    }
  }
}
