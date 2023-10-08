package com.info5059.casestudy.product;

import java.math.BigDecimal;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Entity
@Data
@RequiredArgsConstructor
public class Product {
    @Id
    private String id;
    private int vendorid; // FK
    private String name;
    private BigDecimal costprice;
    private BigDecimal msrp;
    private int rop; // Reorder Point, when stock falls to this # we re-order the item
    private int eoq; // Economic Order Quantity
    private int qoh; // Quantity on Hand, what we have in inventory
    private int qoo; // Quantity on Order, what we have ordered but haven't received yet

    private String qrcode;
    private String qrcodetxt;
}