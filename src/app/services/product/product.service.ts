import {Injectable} from '@angular/core';
import {Observable, of, throwError} from "rxjs";
import {Product} from "../../models/product.model";
import {ValidationErrors} from "@angular/forms";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly productsGatewayUrl: string;
  private readonly productsServiceUrl: string;

  constructor(private http: HttpClient) {
    this.productsGatewayUrl = 'http://localhost:8888/PRODUCT-SERVICE/products';
    this.productsServiceUrl = 'http://localhost:8082/products';
  }

  public findAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsGatewayUrl);
  }

  public deleteProduct(product: Product) : Observable<boolean>{
    return this.http.delete<boolean>(this.productsServiceUrl + "/" + product.id);
  }

  public searchProduct(keyword:string,products:Array<Product>):Observable<Array<Product>>{
    let result = products.filter(p=>p.name.toLowerCase().includes(keyword.toLowerCase()));
    return of(result)
  }

  public addNewProduct(product : Product) : Observable<Product>{
    return this.http.post<Product>(this.productsServiceUrl,product);
  }

  public getProduct(id : number) : Observable<Product> {
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

