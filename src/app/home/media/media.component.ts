import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from 'src/app/Services/api-service.service';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})
export class MediaComponent implements OnInit {
  getAllBlog:any=[];
  constructor(private __apiservice:ApiServiceService) { }

  ngOnInit(): void {
    this.__apiservice.getAllBlogs().subscribe(res=> {
      this.getAllBlog=res;
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

  data_array:any=[
    {
      img:"../../../assets/media.png",
      heading:"Laura Augustine Spotlight",
      card_text:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt exercitationem similique tempora, eaque animi, quasi cupiditate pariatur cumque explicabo maiores vitae ipsum in alias culpa sunt veniam! Tenetur, dolorum repellat"
    },
    {
      img:"../../../assets/media.png",
      heading:"Laura Augustine Spotlight",
      card_text:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt exercitationem similique tempora, eaque animi, quasi cupiditate pariatur cumque explicabo maiores vitae ipsum in alias culpa sunt veniam! Tenetur, dolorum repellat"
    },
    {
      img:"../../../assets/media.png",
      heading:"Laura Augustine Spotlight",
      card_text:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt exercitationem similique tempora, eaque animi, quasi cupiditate pariatur cumque explicabo maiores vitae ipsum in alias culpa sunt veniam! Tenetur, dolorum repellat"
    }
  ];
}
