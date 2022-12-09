import {Product} from "./product.model";
import {Bill} from "./bill.model";

export interface ProductItem {
  id : number;
  quantity : number;
  price : number;
  productID : number;
  productName : string;
  bill : Bill;
  product : Product;
}
