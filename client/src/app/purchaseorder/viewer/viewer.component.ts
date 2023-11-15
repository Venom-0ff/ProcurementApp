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
  selector: 'app-viewer',
  standalone: true,
  imports: [CommonModule, MatComponentsModule, ReactiveFormsModule],
  templateUrl: './viewer.component.html',
})
export class ViewerComponent implements OnInit, OnDestroy {
  // form
  viewerForm: FormGroup;
  vendorid: FormControl;
  poid: FormControl;
  selectqty: FormControl;

  // data
  formSubscription?: Subscription;
  products: Product[] = []; // everybody's products
  vendors: Vendor[] = []; // all vendors
  vendorProducts: Product[] = []; // all products for a particular vendor
  items: PurchaseOrderLineitem[] = []; // product items that will be in purchaseorder
  selectedProduct: Product; // the current selected product
  selectedVendor: Vendor; // the current selected vendor
  selectedPO: PurchaseOrder;
  poProducts: Product[] = [];
  vendorPOs: PurchaseOrder[] = [];
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
    this.poid = new FormControl('');
    this.selectqty = new FormControl('');

    this.viewerForm = this.builder.group({
      poid: this.poid,
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

    this.selectedPO = {
      id: 0,
      vendorid: 0,
      amount: 0.0,
      items: [],
      podate: '',
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
    this.onPickPO(); // sets up subscription for dropdown click
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
  * loadvendorProducts - retrieve a particular vendor's products
  */
  loadVendorProducts(): void {
    this.vendorProducts = [];
    this.productService.getSome(this.selectedVendor.id).subscribe({
      // observer object
      next: (products: Product[]) => {
        this.vendorProducts = products;
      },
      error: (err: Error) =>
        (this.msg = `product fetch failed! - ${err.message}`),
      complete: () => { },
    });
  } // loadvendorProducts

  /**
  * loadvendorProducts - retrieve a particular vendor's products
  */
  loadVendorPOs(): void {
    this.vendorPOs = [];
    this.purchaseorderService
      .getSome(this.selectedVendor.id)
      .subscribe((pos) => this.vendorPOs = pos);
  } // loadvendorProducts

  /**
  * onPickVendor - Another way to use Observables, subscribe to the select change event
  * then load specific vendor products for subsequent selection
  */
  onPickVendor(): void {
    this.formSubscription = this.viewerForm
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
        this.loadVendorPOs();
        this.pickedProduct = false;
        this.hasProducts = false;
        this.msg = 'Choose PO for vendor';
        this.pickedVendor = true;
        this.generated = false;
        this.items = []; // array for the purchaseorder
      });
  } // onPickVendor

  /**
  * onPickPO - subscribe to the select change event then
  * update array containing items.
  */
  onPickPO(): void {
    const purchaseorderSubscription = this.viewerForm
      .get('poid')
      ?.valueChanges.subscribe((val) => {
        this.selectedPO = val;

        if (this.vendorProducts !== undefined) {
          this.poProducts = this.vendorProducts.filter((prod) =>
            this.selectedPO?.items.some((item) => item.productid === prod.id)
          );
        }

        if (this.poProducts.length > 0) {
          this.hasProducts = true
        }

        this.sub = 0.0;
        this.poProducts.forEach((prod) => (this.sub += prod.costprice * prod.qoo));
        this.tax = this.sub * 0.13;
        this.total = this.sub + this.tax;

        this.purchaseorderno = this.selectedPO.id;
        this.generated = true;
        this.msg = `PO ${this.selectedPO.id} selected`;
      });
    this.formSubscription?.add(purchaseorderSubscription); // add it as a child, so all can be destroyed together
  } // onPickPO

  /**
  * viewPdf - view po in pdf format
  */
  viewPdf(): void {
    window.open(`${PDFURL}${this.purchaseorderno}`, '');
  } // viewPdf
} // ViewerComponent