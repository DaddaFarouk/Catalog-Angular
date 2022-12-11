import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {AuthenticationService} from "../../services/authentication.service";
import {Router} from "@angular/router";
import {CustomerService} from "../../services/customer/customer.service";
import {Customer} from "../../models/customer.model";

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {

  customers! : Array<Customer>;
  errorMessage! : string;
  searchFormGroup! : FormGroup;
  currentAction : string = "all";

  constructor(private customerService : CustomerService,
              private formBuilder : FormBuilder,
              public authService : AuthenticationService,
              private router : Router
  ) { }

  ngOnInit(): void {
    this.getAllCustomers();
    this.searchFormGroup = this.formBuilder.group({
      keyword : this.formBuilder.control(null)
    });
  }

  getAllCustomers() : void {
    this.customerService.findAll().subscribe((data) => {
      // @ts-ignore
      this.customers = data["_embedded"]["customers"];
    });
  }

  handleDeleteCustomer(c: Customer) {
    let conf = confirm("Are you sure?");
    if(!conf) return;
    this.customerService.deleteCustomer(c).subscribe({
      next : () => {
        this.getAllCustomers();
      },
      error : err => {
        this.errorMessage = err;
      }
    });
  }

  handleSearchCustomers() {
    this.currentAction = "search";
    let keyword = this.searchFormGroup.value.keyword;
    if (keyword=="" || keyword==null){
      this.getAllCustomers();
    } else {
      this.customerService.findAll().subscribe(
        (customers) => {
          // @ts-ignore
          let result : Customer[] = customers["_embedded"]["customers"];
          this.customers = result.filter((customer) => customer.name.toLowerCase().includes(keyword.toLowerCase()));
        }
      )
    }
  }

  handleNewCustomer() {
    this.router.navigateByUrl("/admin/newCustomer").then( () => {
    });
  }

  handleEditCustomer(c: Customer) {
    this.router.navigateByUrl("/admin/editCustomer/" + c.id).then( ()  =>{
    });
  }

}
