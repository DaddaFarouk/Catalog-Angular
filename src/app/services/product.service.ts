import {Injectable} from '@angular/core';
import {Observable, of, throwError} from "rxjs";
import {Product} from "../models/product.model";
import {ValidationErrors} from "@angular/forms";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly productsGatewayUrl: string;
  private readonly productsServiceUrl: string;
  private products! : Array<Product>;

  constructor(private http: HttpClient) {
    this.productsGatewayUrl = 'http://localhost:8888/PRODUCT-SERVICE/products';
    this.productsServiceUrl = 'http://localhost:8082/products';
   /* this.products = [
      {id : UUID.UUID(), name : "Computer", price : 12000,quantity: 12, promotion : true},
      {id : UUID.UUID(), name : "Printer", price : 1200,quantity: 129, promotion : false},
      {id : UUID.UUID(), name : "Smartphone", price : 8700,quantity: 112, promotion : true}
    ];
    for (let i = 0; i < 10; i++) {
      this.products.push({id : UUID.UUID(), name : "Computer",quantity: 12, price : 12000, promotion : true});
      this.products.push({id : UUID.UUID(), name : "Printer",quantity: 129, price : 1200, promotion : false});
      this.products.push({id : UUID.UUID(), name : "Smartphone",quantity: 112, price : 8700, promotion : true});
    }*/
  }

  public findAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsGatewayUrl);
  }

  public getAllProducts() : Observable<Product[]>{
    return of([...this.products]);
  }

  public deleteProduct(product: Product) : Observable<boolean>{
    return this.http.delete<boolean>(this.productsServiceUrl + "/" + product.id);
  }

  public searchProduct(keyword:string,products:Array<Product>):Observable<Array<Product>>{
    let result = products.filter(p=>p.name.includes(keyword));
    return of(result)
  }

  public addNewProduct(product : Product) : Observable<Product>{
    return this.http.post<Product>(this.productsServiceUrl,product);
  }

  public getProduct(id : string) : Observable<Product> {
    let product = this.http.get<Product>(this.productsServiceUrl + "/" + id)
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
    }
    else return "";
  }

  public updateProduct(product : Product) : Observable<Product> {
    return this.http.put<Product>(this.productsServiceUrl + "/" + product.id, product);
  }
}

