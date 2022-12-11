import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {CustomerService} from "../../services/customer/customer.service";
import {Bill} from "../../models/bill.model";
import {BillService} from "../../services/bill/bill.service";

@Component({
  selector: 'app-edit-bill',
  templateUrl: './edit-bill.component.html',
  styleUrls: ['./edit-bill.component.css']
})
export class EditBillComponent implements OnInit {

  billId : number;
  bill! : Bill;
  billFormGroup! : FormGroup;

  constructor(private activatedRoute : ActivatedRoute,
              public billService : BillService,
              private formBuilder : FormBuilder,
              private router:Router
  ) {
    this.billId = this.activatedRoute.snapshot.params['id'];
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
        this.billFormGroup = this.formBuilder.group({
          name : this.formBuilder.control(this.bill.billingDate, [Validators.required]),
          email : this.formBuilder.control(this.bill.customerID, [Validators.required]),
          productItems : this.formBuilder.control(this.bill.productItems, [Validators.required]),
        });
      },
      error : (err) => {
        console.log(err)
      }
    })
  }

  handleUpdateBill(){
    let retrievedBill = this.billFormGroup.value;
    retrievedBill.id = this.bill.id;
    this.billService.updateBill(retrievedBill).subscribe({
      next : () => {
        alert("Bill updated successfully")
        this.router.navigateByUrl("/admin/bills").then( () => {})
      },
      error : err => {
        console.log(err)
      }
    })
  }

}
