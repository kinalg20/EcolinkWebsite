import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxsModule } from '@ngxs/store';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { BrowserModule } from '@angular/platform-browser';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth.guard';
import { ProductCartComponent } from './product-cart/product-cart.component';
import { ApiServiceService } from './Services/api-service.service';
import { SharedModule } from './shared/shared.module';
import { SharelibraryModule } from './sharelibrary/sharelibrary.module';
import { FetchedHeaderState } from './store/state/header.state';

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
    SharelibraryModule, 
    ToastrModule.forRoot(),
    NgxsModule.forRoot([FetchedHeaderState]),
    NgxsLoggerPluginModule.forRoot(),
    NgxsReduxDevtoolsPluginModule.forRoot()
  ],
  providers: [ApiServiceService,AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
