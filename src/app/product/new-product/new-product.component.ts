import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProductService} from "../../services/product/product.service";

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css']
})
export class NewProductComponent implements OnInit {

  productFormGroup! : FormGroup

  constructor(private formBuilder : FormBuilder,
              public productService : ProductService
              ) { }

  ngOnInit(): void {
    this.productFormGroup = this.formBuilder.group({
      name : this.formBuilder.control(null, [Validators.required, Validators.minLength(4)]),
      price : this.formBuilder.control(null, [Validators.required,Validators.min(200)]),
      quantity : this.formBuilder.control(null, [Validators.required]),
      promotion : this.formBuilder.control(false, [Validators.required]),
    });
  }

  handleAddProduct() {
    let product = this.productFormGroup.value;
    this.productService.addNewProduct(product).subscribe({
      next: () => {
        this.productFormGroup.reset();
        alert("Product added successfully");
      },
      error : err => {
        console.log(err);
      }
    })
  }
}
