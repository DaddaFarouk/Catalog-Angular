import { Component, OnInit } from '@angular/core';
import {ProductService} from "../services/product.service";
import {Product} from "../models/product.model";
import {FormBuilder, FormGroup} from "@angular/forms";
import {AuthenticationService} from "../services/authentication.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products! : Array<Product>;
  currentPage : number = 0;
  pageSize : number = 5;
  totalPages : number = 0;
  errorMessage! : string;
  searchFormGroup! : FormGroup;
  currentAction : string = "all";

  constructor(private productService : ProductService,
              private formBuilder : FormBuilder,
              public authService : AuthenticationService,
              private router : Router
              ) { }

  ngOnInit(): void {
    this.searchFormGroup = this.formBuilder.group({
      keyword : this.formBuilder.control(null)
    });
    this.handleGetPagedProducts();
  }

  handleGetPagedProducts(){
    this.productService.getPagedProducts(this.currentPage, this.pageSize).subscribe({
      next : (value) => {
        this.products = value.products;
        this.totalPages = value.totalPages;
      },
      error : err => {
        this.errorMessage = err;
      }
    });
  }

  handleGetAllProducts(){
    this.productService.getAllProducts().subscribe({
      next : value => {
        this.products = value;
      },
      error : err => {
        this.errorMessage = err;
      }
    });
  }

  handleDeleteProduct(p: Product) {
    let conf = confirm("Are you sure?");
    if(!conf) return;
    this.productService.deleteProduct(p.id).subscribe({
      next : () => {
        //this.handleGetAllProducts();
        let index = this.products.indexOf(p);
        this.products.splice(index,1);
      }
    });
  }

  handleSetPromotion(p: Product) {
    let promotion = p.promotion;
    this.productService.setPromotion(p.id).subscribe({
      next : () => {
        p.promotion = !promotion;
      },
      error : err => {
        this.errorMessage = err;
      }
    })
  }

  handleSearchProducts() {
    this.currentAction = "search";
    this.currentPage = 0;
    let keyword = this.searchFormGroup.value.keyword;
    this.productService.searchProducts(keyword,this.currentPage, this.pageSize).subscribe({
      next : value => {
        this.products = value.products;
        this.totalPages = value.totalPages;
      }
    });
  }

  goToPage(i: number) {
    this.currentPage = i;
    if (this.currentAction=="all") this.handleGetPagedProducts();
    else this.handleGetPagedProducts();
  }

  handleNewProduct() {
    this.router.navigateByUrl("/admin/newProduct").then(r => {

    });
  }

  handleEditProduct(p: Product) {
    this.router.navigateByUrl("/admin/editProduct/"+p.id);
  }
}
