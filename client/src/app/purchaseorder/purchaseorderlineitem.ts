/**
* PurchaseOrderLineitem - container class for po line item
*/
export interface PurchaseOrderLineitem {
    id: number;
    poid: number;
    productid: string;
    qty: number;
    price: number;
    productname: string;
}