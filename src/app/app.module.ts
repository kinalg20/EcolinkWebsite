import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth.guard';
import { ProductCartComponent } from './product-cart/product-cart.component';
import { ApiServiceService } from './Services/api-service.service';
import { SharedModule } from './shared/shared.module';
import { SharelibraryModule } from './sharelibrary/sharelibrary.module';


@NgModule({
  declarations: [
    AppComponent,
    ProductCartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    SharelibraryModule
  ],
  providers: [ApiServiceService,AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
