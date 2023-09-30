import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { MatComponentsModule } from '@app/mat-components/mat-components.module';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Product } from '@app/product/product';
import { Vendor } from '@app/vendor/vendor';
import { CommonModule } from '@angular/common';
import { ProductHomeComponent } from '../product-home/product-home.component';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatComponentsModule],
  templateUrl: './product-detail.component.html',
  styles: [],
})

export class ProductDetailComponent implements OnInit {
  // setter
  @Input() selectedProduct: Product = {
    id: '',
    vendorid: 0,
    name: '',
    costprice: 0,
    msrp: 0,
    rop: 0,
    eoq: 0,
    qoh: 0,
    qoo: 0,
  };

  @Input() vendors: Vendor[] | null = null;
  @Output() cancelled = new EventEmitter();
  @Output() saved = new EventEmitter();
  @Output() deleted = new EventEmitter();

  products: Product[] = [];

  productForm: FormGroup;
  id: FormControl;
  vendorid: FormControl;
  name: FormControl;
  costprice: FormControl;
  msrp: FormControl;
  rop: FormControl;
  eoq: FormControl;
  qoh: FormControl;
  qoo: FormControl;

  constructor(private builder: FormBuilder, public productService: ProductService) {
    this.id = new FormControl(
      '',
      Validators.compose([this.uniqueCodeValidator.bind(this), Validators.required])
      );
    this.vendorid = new FormControl(
      '',
      Validators.compose([Validators.required])
    );
    this.name = new FormControl(
      '',
      Validators.compose([Validators.required])
    );
    this.costprice = new FormControl(
      '',
      Validators.compose([Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)])
    );
    this.msrp = new FormControl(
      '',
      Validators.compose([Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)])
    );
    this.rop = new FormControl(
      '',
      Validators.compose([Validators.required, Validators.pattern(/^\d+$/)])
    );
    this.eoq = new FormControl(
      '',
      Validators.compose([Validators.required, Validators.pattern(/^\d+$/)])
    );
    this.qoh = new FormControl(
      '',
      Validators.compose([Validators.required, Validators.pattern(/^\d+$/)])
    );
    this.qoo = new FormControl(
      '',
      Validators.compose([Validators.required, Validators.pattern(/^\d+$/)])
    );

    this.productForm = this.builder.group({
      id: this.id,
      vendorid: this.vendorid,
      name: this.name,
      costprice: this.costprice,
      msrp: this.msrp,
      rop: this.rop,
      eoq: this.eoq,
      qoh: this.qoh,
      qoo: this.qoo,
    });
  } // constructor

  ngOnInit(): void {
    this.getAllProducts();
    // patchValue doesn't care if all values are present
    this.productForm.patchValue({
      id: this.selectedProduct.id,
      vendorid: this.selectedProduct.vendorid,
      name: this.selectedProduct.name,
      costprice: this.selectedProduct.costprice,
      msrp: this.selectedProduct.msrp,
      rop: this.selectedProduct.rop,
      eoq: this.selectedProduct.eoq,
      qoh: this.selectedProduct.qoh,
      qoo: this.selectedProduct.qoo,
    });
  } // ngOnInit

  /**
  * getAllProducts - retrieve everything
  */
  getAllProducts(passedMsg: string = ''): void {
    this.productService.getAll().subscribe({
      // Create observer object
      next: (products: Product[]) => {
        this.products = products;
        // this.dataSource.data = this.products;
      },
      // error: (err: Error) =>
      //   (this.msg = `Couldn't get products - ${err.message}`),
      // complete: () =>
      //   passedMsg ? (this.msg = passedMsg) : (this.msg = `Products loaded!`),
    });
  } // getAllProducts

  updateSelectedProduct(): void {
    this.selectedProduct.id = this.productForm.value.id;
    this.selectedProduct.vendorid = this.productForm.value.vendorid;
    this.selectedProduct.name = this.productForm.value.name;
    this.selectedProduct.costprice = this.productForm.value.costprice;
    this.selectedProduct.msrp = this.productForm.value.msrp;
    this.selectedProduct.rop = this.productForm.value.rop;
    this.selectedProduct.eoq = this.productForm.value.eoq;
    this.selectedProduct.qoh = this.productForm.value.qoh;
    this.selectedProduct.qoo = this.productForm.value.qoo;
    this.saved.emit(this.selectedProduct);
  } // updateSelectedProduct

  /**
  * uniqueCodeValidator - needed access to products property so not
  * with the rest of the validators
  */
  uniqueCodeValidator(control: AbstractControl): { idExists: boolean } | null {
    if (this.products && this.products?.length > 0) {
      if (
        this.products.find(
          (p) => p.id === control.value && !this.selectedProduct.id
        ) !== undefined
      ) {
        return { idExists: true };
      }
    }
    return null; // if we make it here there are no product codes
  } // uniqueCodeValidator
} // ProductDetailComponent
