import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CustomerService} from "../../services/customer/customer.service";

@Component({
  selector: 'app-new-customer',
  templateUrl: './new-customer.component.html',
  styleUrls: ['./new-customer.component.css']
})
export class NewCustomerComponent implements OnInit {

  customerFormGroup! : FormGroup

  constructor(private formBuilder : FormBuilder,
              public customerService : CustomerService
  ) { }

  ngOnInit(): void {
    this.customerFormGroup = this.formBuilder.group({
      name : this.formBuilder.control(null, [Validators.required, Validators.minLength(3)]),
      email : this.formBuilder.control(null, [Validators.required,Validators.email]),
    });
  }

  handleAddProduct() {
    let customer = this.customerFormGroup.value;
    this.customerService.addNewCustomer(customer).subscribe({
      next: () => {
        this.customerFormGroup.reset();
        alert("Customer added successfully");
      },
      error : err => {
        console.log(err);
      }
    })
  }

}
