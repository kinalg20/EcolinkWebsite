import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogComponent } from '../home/blog/blog.component';
import { AskChemistComponent } from './ask-chemist/ask-chemist.component';
import { FooterComponent } from './footer/footer.component';
import { GSAProductComponent } from './gsa-product/gsa-product.component';
import { HeaderComponent } from './header/header.component';
import { OrderFailComponent } from './order-fail/order-fail.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProductsRequestComponent } from './products-request/products-request.component';
import { SharedComponent } from './shared.component';
import { ThankYouComponent } from './thank-you/thank-you.component';

const routes: Routes = [
  { path: '', component: SharedComponent },
  { path: 'header', component: HeaderComponent },
  { path: 'footer', component: FooterComponent },
  { path: 'inner-pages/contact/request', component: ProductsRequestComponent },
  { path: 'thanks', component: ThankYouComponent },
  { path: 'failure', component: OrderFailComponent },
  { path: 'inner-pages/contact/ask-the-chemist', component: AskChemistComponent },
  // { path : 'info/:slug', component: BlogComponent},
  { path: '404', component: PageNotFoundComponent },
  { path: 'shops', component: GSAProductComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SharedRoutingModule { }
