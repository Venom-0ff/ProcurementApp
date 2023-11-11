import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatComponentsModule } from '@app/mat-components/mat-components.module';
import { PurchaseOrder } from '@app/purchaseorder/purchaseorder';
import { PurchaseOrderLineitem } from '@app/purchaseorder/purchaseorderlineitem';
import { PurchaseOrderService } from '@app/purchaseorder/purchaseorder.service';
import { Vendor } from '@app/vendor/vendor';
import { NewVendorService } from '@app/vendor/newvendor.service';
import { Product } from '@app/product/product';
import { ProductService } from '@app/product/product.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { PDFURL } from '@app/constants';

@Component({
  selector: 'app-generator',
  standalone: true,
  imports: [CommonModule, MatComponentsModule, ReactiveFormsModule],
  templateUrl: './generator.component.html',
})

export class GeneratorComponent implements OnInit, OnDestroy {
  // form
  generatorForm: FormGroup;
  vendorid: FormControl;
  productid: FormControl;
  selectqty: FormControl;

  // data
  formSubscription?: Subscription;
  products: Product[] = []; // everybody's products
  vendors: Vendor[] = []; // all vendors
  vendorproducts: Product[] = []; // all products for a particular vendor
  items: PurchaseOrderLineitem[] = []; // product items that will be in purchaseorder
  // selectedproducts: Product[] = []; // products that being displayed currently in app
  selectedProduct: Product; // the current selected product
  selectedVendor: Vendor; // the current selected vendor
  qty: number;

  // misc
  pickedProduct: boolean;
  pickedVendor: boolean;
  generated: boolean;
  hasProducts: boolean;
  msg: string;
  sub: number;
  tax: number;
  total: number;
  purchaseorderno: number = 0;
  qtyRange: number[] = [];

  constructor(
    private builder: FormBuilder,
    private vendorService: NewVendorService,
    private productService: ProductService,
    private purchaseorderService: PurchaseOrderService
  ) {
    this.pickedVendor = false;
    this.pickedProduct = false;
    this.generated = false;
    this.msg = '';
    this.vendorid = new FormControl('');
    this.productid = new FormControl('');
    this.selectqty = new FormControl('');

    this.generatorForm = this.builder.group({
      productid: this.productid,
      vendorid: this.vendorid,
      selectqty: this.selectqty
    });

    this.selectedProduct = {
      id: '',
      vendorid: 0,
      name: '',
      costprice: 0,
      msrp: 0,
      rop: 0,
      eoq: 0,
      qoh: 0,
      qoo: 0,
      qrcode: [],
      qrcodetxt: '',
    };

    this.selectedVendor = {
      id: 0,
      name: '',
      address1: '',
      city: '',
      province: '',
      postalcode: '',
      phone: '',
      type: '',
      email: '',
    };

    this.hasProducts = false;
    this.qty = 0;
    this.sub = 0.0;
    this.tax = 0.0;
    this.total = 0.0;
    for (let i = 0; i <= 1000; i += 100)
      this.qtyRange.push(i);
  } // constructor

  ngOnInit(): void {
    this.onPickVendor(); // sets up subscription for dropdown click
    this.onPickProduct(); // sets up subscription for dropdown click
    this.onPickQty();
    this.msg = 'loading vendors from server...';
    this.getAllVendors();
  } // ngOnInit

  ngOnDestroy(): void {
    if (this.formSubscription !== undefined) {
      this.formSubscription.unsubscribe();
    }
  } // ngOnDestroy

  /**
  * getAllVendors - retrieve everything
  */
  getAllVendors(passedMsg: string = ''): void {
    this.vendorService.getAll().subscribe({
      // Create observer object
      next: (vendors: Vendor[]) => {
        this.vendors = vendors;
      },
      error: (err: Error) =>
        (this.msg = `Couldn't get vendors - ${err.message}`),
      complete: () =>
        passedMsg ? (this.msg = passedMsg) : (this.msg = `Vendors loaded!`),
    });
  } // getAllVendors

  /**
  * loadVendorProducts - retrieve a particular vendor's products
  */
  loadVendorProducts(): void {
    this.vendorproducts = [];
    this.productService.getSome(this.selectedVendor.id).subscribe({
      // observer object
      next: (products: Product[]) => {
        this.vendorproducts = products;
      },
      error: (err: Error) =>
        (this.msg = `product fetch failed! - ${err.message}`),
      complete: () => { },
    });
  } // loadVendorProducts

  /**
  * onPickVendor - Another way to use Observables, subscribe to the select change event
  * then load specific vendor products for subsequent selection
  */
  onPickVendor(): void {
    this.formSubscription = this.generatorForm
      .get('vendorid')
      ?.valueChanges.subscribe((val) => {
        this.selectedProduct = {
          id: '',
          vendorid: 0,
          name: '',
          costprice: 0,
          msrp: 0,
          rop: 0,
          eoq: 0,
          qoh: 0,
          qoo: 0,
          qrcode: [],
          qrcodetxt: '',
        };
        this.selectedVendor = val;
        this.loadVendorProducts();
        this.pickedProduct = false;
        this.hasProducts = false;
        this.msg = 'choose product for vendor';
        this.pickedVendor = true;
        this.generated = false;
        this.items = []; // array for the purchaseorder
        // this.selectedproducts = []; // array for the details in app html
      });
  } // onPickVendor

  /**
  * onPickProduct - subscribe to the select change event then
  * update array containing items.
  */
  onPickProduct(): void {
    const productSubscription = this.generatorForm
      .get('productid')
      ?.valueChanges.subscribe((val) => {
        this.selectedProduct = val;
        const index = this.items.findIndex((item) => item.productid === this.selectedProduct?.id)
        if (index !== -1) {
          this.selectqty.setValue(this.items[index].qty);
        }
        else {
          this.selectqty.reset();
        }
        this.pickedProduct = true;
      });
    this.formSubscription?.add(productSubscription); // add it as a child, so all can be destroyed together
  } // onPickProduct

  /**
  * onPickQty - subscribe to the select change event then
  * update array containing items.
  */
  onPickQty(): void {
    const qtySubscription = this.generatorForm
      .get('selectqty')
      ?.valueChanges.subscribe((val) => {
        if (val !== null) {
          this.qty = val;
          const item: PurchaseOrderLineitem = {
            id: 0,
            poid: 0,
            qty: this.qty,
            price: this.selectedProduct?.costprice,
            productid: this.selectedProduct?.id,
            productname: this.selectedProduct?.name
          };

          const index = this.items.findIndex((item) => item.productid === this.selectedProduct?.id)
          if (index !== -1) {
            if (item.qty > 0) {
              // update entry
              this.items[index] = item;
            }
            else {
              // remove entry
              this.items = this.items.filter(i => i !== this.items[index]);
            }
          }
          else if (this.qty > 0) {
            // add entry
            this.items.push(item);
          }

          if (this.items.length > 0) {
            this.hasProducts = true;
          }
          else {
            this.hasProducts = false;
          }

          this.sub = 0.0;
          this.items.forEach((item) => (this.sub += item.price * item.qty));
          this.tax = this.sub * 0.13;
          this.total = this.sub + this.tax;
        }
      });
    this.formSubscription?.add(qtySubscription); // add it as a child, so all can be destroyed together
  } // onPickQty

  /**
  * createPurchaseOrder - create the client side purchaseorder
  */
  createPurchaseOrder(): void {
    this.generated = false;
    const purchaseorder: PurchaseOrder = {
      id: 0,
      items: this.items,
      amount: this.total,
      vendorid: this.selectedProduct.vendorid,
    };
    this.purchaseorderService.create(purchaseorder).subscribe({
      // observer object
      next: (purchaseorder: PurchaseOrder) => {
        // server should be returning purchaseorder with new id
        purchaseorder.id > 0
          ? (this.msg = `PurchaseOrder ${purchaseorder.id} added!`)
          : (this.msg = 'PurchaseOrder not added! - server error');
        this.purchaseorderno = purchaseorder.id;
      },
      error: (err: Error) => (this.msg = `PurchaseOrder not added! - ${err.message}`),
      complete: () => {
        this.hasProducts = false;
        this.pickedVendor = false;
        this.pickedProduct = false;
        this.generated = true;
      },
    });
  } // createPurchaseOrder

  /**
  * viewPdf - view po in pdf format
  */
  viewPdf(): void {
    window.open(`${PDFURL}${this.purchaseorderno}`, '');
  } // viewPdf
} // GeneratorComponent