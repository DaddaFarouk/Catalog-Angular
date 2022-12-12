import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Bill} from "../../models/bill.model";
import {BillService} from "../../services/bill/bill.service";
import {AuthenticationService} from "../../services/authentication.service";
import {ProductItem} from "../../models/productItem.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Product} from "../../models/product.model";
import {ProductService} from "../../services/product/product.service";

@Component({
  selector: 'app-edit-bill',
  templateUrl: './edit-bill.component.html',
  styleUrls: ['./edit-bill.component.css']
})
export class EditBillComponent implements OnInit {

  billId : number;
  addProductItem : boolean;
  bill! : Bill;
  productItem! : ProductItem;
  products! : Product[];
  productItemFormGroup! : FormGroup

  constructor(private activatedRoute : ActivatedRoute,
              private billService : BillService,
              private productService : ProductService,
              public authService : AuthenticationService,
              private formBuilder : FormBuilder,
              private router : Router
  ) {
    this.billId = this.activatedRoute.snapshot.params['id'];
    this.addProductItem = false;
  }

  ngOnInit(): void {
    this.billService.getBill(this.billId).subscribe({
      next : (value) => {
        this.bill = value;
        this.billService.getCustomer(this.bill.customerID).subscribe({
          next : (value) => {
            this.bill.customer = value;
          }
        });
      },
      error : (err) => {
        console.log(err)
      }
    })
    this.productService.findAll().subscribe((value)=> {
      // @ts-ignore
      this.products = value["_embedded"]["products"];
    })
    this.productItemFormGroup = this.formBuilder.group({
      quantity : this.formBuilder.control(0, [Validators.required]),
      productID : this.formBuilder.control(null, [Validators.required]),
    });
  }

  handleDeleteProductItem(p: ProductItem) {
    let conf = confirm("Are you sure?");
    if(!conf) return;
    if(this.bill.productItems.length==1){
      let conf = confirm("This Bill will be deleted if you remove the last Product Item. Do you want to proceed ?");
      if(!conf) return;
    }
    this.billService.deleteProductItem(p).subscribe({
      next : () => {
        this.bill.productItems.forEach(
          (productItem, index) => {
            if(productItem.id==p.id) {
              this.bill.totalPrice -= productItem.price;
              this.bill.productItems.splice(index, 1);
            }
        })
        this.billService.updateBill(this.bill).subscribe(()=> {
          if(this.bill.productItems.length==0){
            this.router.navigateByUrl("/admin/bills").then( () => {
            });
          }
        })
      },
      error : err => {
        console.log(err);
      }
    });
  }

  handleNewProductItem() {
    let response = this.productItemFormGroup.value;
    let product = this.products.find((product) => product.id == response.productID);
    if(product!=null){
      this.productItem = {
        quantity : response.quantity,
        price : product.price * response.quantity as number,
        productID : product.id,
        bill : this.bill,
        productName : product.name
      } as ProductItem
      this.billService.addNewProductItem(this.productItem).subscribe({
        next: () => {
          this.productItemFormGroup.reset();
          alert("Product added successfully");
          this.ngOnInit();
        },
        error : err => {
          console.log(err);
        }
      })
    }
  }

  handleDisplayMenu() {
    this.addProductItem = true;
  }
}
