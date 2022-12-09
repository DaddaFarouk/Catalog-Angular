import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, of, throwError} from "rxjs";
import {ValidationErrors} from "@angular/forms";
import {Bill} from "../../models/bill.model";
import {ProductService} from "../product/product.service";
import {Product} from "../../models/product.model";
import {Customer} from "../../models/customer.model";
import {CustomerService} from "../customer/customer.service";

@Injectable({
  providedIn: 'root'
})
export class BillService {

  private readonly billsGatewayUrl: string;
  private readonly billsServiceUrl: string;

  constructor(private http: HttpClient,
              private productService : ProductService,
              private customerService : CustomerService
  ) {
    this.billsGatewayUrl = 'http://localhost:8888/BILLING-SERVICE/fullBills';
    this.billsServiceUrl = 'http://localhost:8083/bills';
  }

  public findAll(): Observable<Bill[]> {
    return this.http.get<Bill[]>(this.billsGatewayUrl);
  }

  public getProduct(id: number) : Observable<Product> {
    return this.productService.getProduct(id);
  }

  public getProductItems(link: string) : Observable<any> {
    return this.http.get<any>(link);
  }

  public getCustomer(id: number) : Observable<Customer> {
    return this.customerService.getCustomer(id);
  }

  public deleteBill(bill: Bill) : Observable<boolean>{
    return this.http.delete<boolean>(this.billsServiceUrl + "/" + bill.id);
  }

  public searchBill(keyword:string,bills:Array<Bill>):Observable<Array<Bill>>{
    let result = bills.filter(b=>b.productItems.find((productItem) => {productItem.productName.toLowerCase().includes(keyword.toLowerCase())}));
    return of(result)
  }

  public addNewBill(bill : Bill) : Observable<Bill>{
    return this.http.post<Bill>(this.billsServiceUrl,bill);
  }

  public getBill(id : string) : Observable<Bill> {
    let product = this.http.get<Bill>(this.billsServiceUrl + "/" + id)
    if(product == undefined) return throwError(()=> new Error("Product not found"));
    return product;
  }

  public getErrorMessage(fieldName: string, errors: ValidationErrors) {
    if(errors['required']) {
      return fieldName + " is Required";
    } else if (errors['min']){
      return fieldName + " should have at least a value of "+ errors['min']['min'];
    } else if (errors['minlength']){
      return fieldName + " should have at least "+ errors['minlength']['requiredLength']+" Characters";
    } else if (errors['email']){
      return "Please enter a valid "+ fieldName;
    }
    else return "";
  }

  public updateBill(bill : Bill) : Observable<Bill> {
    return this.http.put<Bill>(this.billsServiceUrl + "/" + bill.id, bill);
  }
}
