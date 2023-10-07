import { PurchaseOrderLineitem } from './purchaseorderlineitem';
/**
* PurchaseOrder - interface for po
*/
export interface PurchaseOrder {
    id: number;
    vendorid: number;
    amount: number;
    items: PurchaseOrderLineitem[];
}