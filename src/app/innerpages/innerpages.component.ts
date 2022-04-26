import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiServiceService } from 'src/app/Services/api-service.service';

@Component({
  selector: 'app-innerpages',
  templateUrl: './innerpages.component.html',
  styleUrls: ['./innerpages.component.scss']
})
export class InnerpagesComponent implements OnInit {

  slug: any;
  data: any = []
  constructor(private route: ActivatedRoute, public _apiService: ApiServiceService) { }

  ngOnInit(): void {
    this.slug = this.route.snapshot.params;
    console.log(this.slug);
    if (this.slug.subsubsubsublink) {
      this._apiService.getPageBySlug(this.slug.subsubsubsublink).subscribe((res: any) => {
        this.data = res.data;
        console.log("inner-page route", res);
      })
    }
    if (this.slug.subsubsublink) {
      this._apiService.getPageBySlug(this.slug.subsubsublink).subscribe((res: any) => {
        this.data = res.data;
        console.log("inner-page route", res);
      })
    }
    else if (this.slug.subsublink) {
      console.log(this.slug.subsublink);
      this._apiService.getPageBySlug(this.slug.subsublink).subscribe((res: any) => {
        this.data = res.data;
        console.log("inner-page route", res);
      })
    }
    else if (this.slug.sublink) {
      this._apiService.getPageBySlug(this.slug.sublink).subscribe((res: any) => {
        this.data = res.data;
        console.log("inner-page route", res);
      })
    }
    else if (this.slug.slug) {
      this._apiService.getPageBySlug(this.slug.slug).subscribe((res: any) => {
        this.data = res.data;
        console.log("inner-page route", res);
      })
    }
    // else{
    //   this._apiService.getPageBySlug(this.slug).subscribe((res:any)=>{
    //     this.data = res.data;
    //     console.log(res);
    //   })
    // }
  }
  chemist_array: any = [
    {
      imgurl: "https://chem.washington.edu/sites/chem/files/styles/front_slideshow_alternate/public/images/student-looking-through-microscope-1105x665.jpg?itok=XjWShO_w",
      heading: "Philosophy and Methodology",
      content: "We always seek multi-use over single use chemical solutions "
    },
    {
      imgurl: "https://www.imperial.ac.uk/ImageCropToolT4/imageTool/uploaded-images/141024_imp_chem_026--tojpeg_1455114655644_x2.jpg",
      heading: "Manufacturing Case Studies",
      content: "Ecolink is especially proud of our work with the global mining sector"
    }
  ]

}
