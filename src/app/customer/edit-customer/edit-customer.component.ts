import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {Customer} from "../../models/customer.model";
import {CustomerService} from "../../services/customer/customer.service";

@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.css']
})
export class EditCustomerComponent implements OnInit {

  customerId : string;
  customer! : Customer;
  customerFormGroup! : FormGroup;

  constructor(private activatedRoute : ActivatedRoute,
              public customerService : CustomerService,
              private formBuilder : FormBuilder,
              private router:Router
  ) {
    this.customerId = this.activatedRoute.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.customerService.getCustomer(this.customerId).subscribe({
      next : (value) => {
        this.customer = value;
        this.customerFormGroup = this.formBuilder.group({
          name : this.formBuilder.control(this.customer.name, [Validators.required, Validators.minLength(3)]),
          email : this.formBuilder.control(this.customer.email, [Validators.required, Validators.email]),
        });
      },
      error : (err) => {
        console.log(err)
      }
    })
  }

  handleUpdateCustomer(){
    let retrievedCustomer = this.customerFormGroup.value;
    retrievedCustomer.id = this.customer.id;
    this.customerService.updateCustomer(retrievedCustomer).subscribe({
      next : () => {
        alert("Customer updated successfully")
        this.router.navigateByUrl("/admin/customers").then( () => {})
      },
      error : err => {
        console.log(err)
      }
    })
  }

}
