import {APP_INITIALIZER, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductsComponent } from './product/products/products.component';
import { CustomersComponent } from './customer/customers/customers.component';
import {ReactiveFormsModule} from "@angular/forms";
import { LoginComponent } from './auth/login/login.component';
import { AdminTemplateComponent } from './auth/admin-template/admin-template.component';
import { NewProductComponent } from './product/new-product/new-product.component';
import { EditProductComponent } from './product/edit-product/edit-product.component';
import {ProductService} from "./services/product/product.service";
import {HttpClientModule} from "@angular/common/http";
import { NewCustomerComponent } from './customer/new-customer/new-customer.component';
import { EditCustomerComponent } from './customer/edit-customer/edit-customer.component';
import {CustomerService} from "./services/customer/customer.service";
import { BillsComponent } from './bill/bills/bills.component';
import {BillService} from "./services/bill/bill.service";
import { EditBillComponent } from './bill/edit-bill/edit-bill.component';
import {KeycloakAngularModule, KeycloakService} from "keycloak-angular";

export function kcFactory(kcService : KeycloakService){
  return () => {
    kcService.init({
      config : {
        realm : "catalogue-realm",
        clientId : "catalogue-client",
        url : "http://localhost:8080"
      },
      initOptions : {
        onLoad : "check-sso",
        checkLoginIframe : true
      },
    })
  }
}
@NgModule({
  declarations: [
    AppComponent,
    ProductsComponent,
    CustomersComponent,
    LoginComponent,
    AdminTemplateComponent,
    NewProductComponent,
    EditProductComponent,
    NewCustomerComponent,
    EditCustomerComponent,
    BillsComponent,
    EditBillComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    KeycloakAngularModule
  ],
  providers: [
    {provide : APP_INITIALIZER, deps : [KeycloakService], useFactory : kcFactory, multi : true},
    ProductService,
    CustomerService,
    BillService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
