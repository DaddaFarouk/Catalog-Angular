import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, of, throwError} from "rxjs";
import {ValidationErrors} from "@angular/forms";
import {Customer} from "../../models/customer.model";

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private readonly customersGatewayUrl: string;
  private readonly customersServiceUrl: string;

  constructor(private http: HttpClient) {
    this.customersGatewayUrl = 'http://localhost:8888/CUSTOMER-SERVICE/customers';
    this.customersServiceUrl = 'http://localhost:8081/customers';
  }

  public findAll(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.customersGatewayUrl);
  }
  public deleteCustomer(customer: Customer) : Observable<boolean>{
    return this.http.delete<boolean>(this.customersServiceUrl + "/" + customer.id);
  }

  public searchCustomer(keyword:string,customers:Array<Customer>):Observable<Array<Customer>>{
    let result = customers.filter(p=>p.name.toLowerCase().includes(keyword.toLowerCase()));
    return of(result)
  }

  public addNewCustomer(customer : Customer) : Observable<Customer>{
    return this.http.post<Customer>(this.customersServiceUrl,customer);
  }

  public getCustomer(id : number) : Observable<Customer> {
    let product = this.http.get<Customer>(this.customersServiceUrl + "/" + id)
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

  public updateCustomer(customer : Customer) : Observable<Customer> {
    return this.http.put<Customer>(this.customersServiceUrl + "/" + customer.id, customer);
  }

}
