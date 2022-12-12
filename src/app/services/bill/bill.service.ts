import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, of, throwError} from "rxjs";
import {ValidationErrors} from "@angular/forms";
import {Bill} from "../../models/bill.model";
import {ProductService} from "../product/product.service";
import {Customer} from "../../models/customer.model";
import {CustomerService} from "../customer/customer.service";
import {ProductItem} from "../../models/productItem.model";

@Injectable({
  providedIn: 'root'
})
export class BillService {

  private readonly billsGetUrl: string;
  private readonly billsServiceUrl: string;
  private readonly productItemsServiceUrl: string;
  private readonly addProductItemsServiceUrl: string;

  constructor(private http: HttpClient,
              private productService : ProductService,
              private customerService : CustomerService,
  ) {
    this.billsGetUrl = 'http://localhost:8888/BILLING-SERVICE/fullBills';
    this.billsServiceUrl = 'http://localhost:8083/fullBill';
    this.productItemsServiceUrl = 'http://localhost:8083/productItems';
    this.addProductItemsServiceUrl = 'http://localhost:8083/addBill';
  }

  public findAll(): Observable<Bill[]> {
    return this.http.get<Bill[]>(this.billsGetUrl);
  }

  public getCustomer(id: number) : Observable<Customer> {
    return this.customerService.getCustomer(id);
  }

  public deleteBill(bill: Bill) : Observable<boolean>{
    return this.http.delete<boolean>(this.billsServiceUrl + "/" + bill.id);
  }

  public searchBill(keyword:string):Observable<Array<Bill>>{
    let result = new Array<Bill>();
    this.findAll().subscribe({
      next : (bills) => {
        bills.forEach((bill) => {
          bill.productItems.forEach((productItem) => {
            if(productItem.productName.toLowerCase().includes(keyword.toLowerCase())){
              result.push(bill);
              return;
            }
          })
        })
      }
    })
    return of(result)
  }

  public addNewBill(bill : Bill) : Observable<Bill>{
    return this.http.post<Bill>(this.billsServiceUrl,bill);
  }

  public getBill(id : number) : Observable<Bill> {
    let bill = this.http.get<Bill>(this.billsServiceUrl + "/" + id)
    if(bill == undefined) return throwError(()=> new Error("Product not found"));
    return bill;
  }

  public getErrorMessage(fieldName: string, errors: ValidationErrors) {
    if(errors['required']) {
      return fieldName + " is Required";
    }
    else return "";
  }

  public updateBill(bill : Bill) : Observable<Bill> {
    return this.http.put<Bill>(this.billsServiceUrl + "/" + bill.id, bill);
  }

  public deleteProductItem(p: ProductItem) : Observable<boolean> {
    return this.http.delete<boolean>(this.productItemsServiceUrl + "/" + p.id);
  }

  public addNewProductItem(productItem: ProductItem) : Observable<ProductItem>{
    return this.http.post<ProductItem>(this.addProductItemsServiceUrl,productItem);
  }
}
