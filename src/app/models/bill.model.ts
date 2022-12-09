import {Customer} from "./customer.model";
import {ProductItem} from "./productItem.model";
export interface Bill {
  id : number;
  billingDate : Date;
  customerID : number;
  productItems : ProductItem[];
  customer : Customer;
}
