import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ProductService} from "../services/product.service";
import {Product} from "../models/product.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {

  productId : string;
  product! : Product;
  productFormGroup! : FormGroup;

  constructor(private activatedRoute : ActivatedRoute,
              public productService : ProductService,
              private formBuilder : FormBuilder
              ) {
    this.productId = this.activatedRoute.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.productService.getProduct(this.productId).subscribe({
      next : (value) => {
        this.product = value;
        this.productFormGroup = this.formBuilder.group({
          name : this.formBuilder.control(this.product.name, [Validators.required, Validators.minLength(4)]),
          price : this.formBuilder.control(this.product.price, [Validators.required,Validators.min(200)]),
          promotion : this.formBuilder.control(this.product.promotion, [Validators.required]),
        });
      },
      error : (err) => {
        console.log(err)
      }
    })
  }

  handleUpdateProduct(){
    let retrievedProduct = this.productFormGroup.value;
    retrievedProduct.id = this.product.id;
    this.productService.updateProduct(retrievedProduct).subscribe({
      next : () => {
        alert("Product updated successfully")
      },
      error : err => {
        console.log(err)
      }
    })
  }
}
