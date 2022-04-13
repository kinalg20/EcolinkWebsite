import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from "primeng/dropdown";
import { SliderModule } from 'primeng/slider';
import { CheckboxModule } from 'primeng/checkbox';
import { RippleModule } from 'primeng/ripple';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import {RadioButtonModule} from 'primeng/radiobutton';

const exportsharedata: any = [
  CarouselModule,
  InputTextModule,
  ButtonModule,
  DropdownModule,
  CheckboxModule,
  SliderModule,
  RippleModule,
  TabViewModule,
  TableModule,
  RadioButtonModule
]
@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    ...exportsharedata
  ],
  exports: [
    ...exportsharedata
  ]
})
export class SharelibraryModule { }
