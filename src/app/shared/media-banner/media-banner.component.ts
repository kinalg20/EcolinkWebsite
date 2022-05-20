import { Component, Input, OnInit, HostListener } from '@angular/core';

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
  elements:any = [];
  constructor() { }
  @HostListener("window:scroll", [])
  onScroll() {
    if (this.bottomReached()) {
      this.count=0
      this.data_input.map((res:any,index:any)=> {
        if(this.count<3){
          this.helperArray.push(res);
          this.blogArray.push(res);
          this.data_input.splice(index,1);
          this.count++;
        }
      })
      
      // this.elements = [...this.elements, this.count++];
    }
  }
  bottomReached(): boolean {
    return (window.innerHeight + window.scrollY) >= document.body.offsetHeight -300;
  }
  ngOnInit(): void {
    setTimeout(() => {
      console.log(this.data_input);
      this.data_input.map((res:any, index:any)=> {
        if(this.count<3){
          this.blogArray.push(res);
          this.helperArray.push(res);
          this.data_input.splice(index,1);
          this.count++;
        }
      })
      console.log(this.blogArray);
    }, 1000);
    // this.data_input.map((res:any)=> {
    //   this.elements.push(res);
    //   console.log(this.elements)
    // })
    
  }
  loadAllBlog() {
    this.moreCheck=!this.moreCheck;
    this.lessCheck=!this.lessCheck;
    this.blogArray=[]
    if(this.moreCheck==false) {
      console.log('more',this.moreCheck);
      this.data_input.map((res:any)=> {
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
