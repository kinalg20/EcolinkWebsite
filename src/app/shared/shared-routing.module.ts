import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { InnerPagesComponent } from './inner-pages/inner-pages.component';
import { ProductsRequestComponent } from './products-request/products-request.component';
import { SharedComponent } from './shared.component';
import { ThankYouComponent } from './thank-you/thank-you.component';

const routes: Routes = [
  { path: '', component: SharedComponent },
  { path: 'header', component: HeaderComponent },
  { path: 'footer', component: FooterComponent },
  { path: 'products-request', component: ProductsRequestComponent },
  { path: 'inner-pages/:slug', component: InnerPagesComponent},
  { path: 'inner-pages/:slug/:sublink', component: InnerPagesComponent},
  { path: 'inner-pages/:slug/:sublink/:subsublink', component: InnerPagesComponent},
  { path: 'thanks' , component: ThankYouComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SharedRoutingModule { }
