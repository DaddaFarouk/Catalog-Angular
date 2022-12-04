import { Injectable } from '@angular/core';
import {Observable, of, throwError} from "rxjs";
import {PageProduct, Product} from "../models/product.model";
import {UUID} from "angular2-uuid";
import {ValidationErrors} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products! : Array<Product>;

  constructor() {
    this.products = [
      {id : UUID.UUID(), name : "Computer", price : 12000, promotion : true},
      {id : UUID.UUID(), name : "Printer", price : 1200, promotion : false},
      {id : UUID.UUID(), name : "Smartphone", price : 8700, promotion : true}
    ];
    for (let i = 0; i < 10; i++) {
      this.products.push({id : UUID.UUID(), name : "Computer", price : 12000, promotion : true});
      this.products.push({id : UUID.UUID(), name : "Printer", price : 1200, promotion : false});
      this.products.push({id : UUID.UUID(), name : "Smartphone", price : 8700, promotion : true});
    }
  }

  public getAllProducts() : Observable<Product[]>{
    return of([...this.products]);
  }

  public getPagedProducts(page : number, size : number) : Observable<PageProduct>{
    let index = page * size;
    let totalPages = ~~(this.products.length / size);
    if (this.products.length % size != 0) totalPages++;
    let slice = this.products.slice(index, index+size);
    return of({products : slice, page : page, size : size, totalPages : totalPages});
  }

  public deleteProduct(id: string) : Observable<boolean>{
    this.products = this.products.filter( p => p.id != id );
    return of(true);
  }

  public setPromotion(id: string) : Observable<boolean>{
    let product = this.products.find(p => p.id == id);
    if (product != undefined){
      product.promotion = !product.promotion;
      return of(true);
    } else return throwError(()=> new Error("Product not found"));
  }

  public searchProducts(keyword : string, page : number, size : number) : Observable<PageProduct>{
    let result = this.products.filter(p => p.name.includes(keyword));
    let index = page * size;
    let totalPages = ~~(result.length / size);
    if (this.products.length % size != 0) totalPages++;
    let slice = result.slice(index, index+size);
    return of({products : slice, page : page, size : size, totalPages : totalPages});
  }

  public addNewProduct(product : Product) : Observable<Product>{
    product.id = UUID.UUID();
    this.products.push(product);
    return of(product);
  }

  public getProduct(id : string) : Observable<Product> {
    let product = this.products.find((value) => value.id = id ) ;
    if(product == undefined) return throwError(()=> new Error("Product not found"));
    return of(product);
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
    this.products = this.products.map(p => (p.id == product.id)?product:p);
    return of(product);
  }
}

