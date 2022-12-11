import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {AuthenticationService} from "../../services/authentication.service";
import {Router} from "@angular/router";
import {Bill} from "../../models/bill.model";
import {BillService} from "../../services/bill/bill.service";

@Component({
  selector: 'app-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.css']
})
export class BillsComponent implements OnInit {

  bills! : Array<Bill>;
  errorMessage! : string;
  searchFormGroup! : FormGroup;
  currentAction : string = "all";

  constructor(private billService : BillService,
              private formBuilder : FormBuilder,
              public authService : AuthenticationService,
              private router : Router
  ) { }

  ngOnInit(): void {
    this.getAllBills();
    this.searchFormGroup = this.formBuilder.group({
      keyword : this.formBuilder.control(null)
    });
  }

  getAllBills(){
    this.billService.findAll().subscribe({
      next : (value) => {
         this.bills = value;
         this.bills.forEach((bill)=>{
           this.billService.getCustomer(bill.customerID).subscribe({
             next : (value) => {
               bill.customer = value;
             }
           })
         })
      }
    });
  }

  handleDeleteBill(c: Bill) {
    let conf = confirm("Are you sure?");
    if(!conf) return;
    this.billService.deleteBill(c).subscribe({
      next : () => {
        this.getAllBills();
      },
      error : err => {
        this.errorMessage = err;
      }
    });
  }

  handleSearchBills() {
    this.currentAction = "search";
    let keyword = this.searchFormGroup.value.keyword;
    if (keyword=="" || keyword==null){
      this.getAllBills();
    } else {
      this.billService.searchBill(keyword).subscribe({
        next:(data)=>{
          this.bills = data;
        }
      });
    }
  }

  handleNewBill() {
    this.router.navigateByUrl("/admin/newCustomer").then( () => {
    });
  }

  handleEditBill(c: Bill) {
    this.router.navigateByUrl("/admin/editCustomer/" + c.id).then(() => {
    });
  }

}
