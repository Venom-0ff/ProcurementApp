package com.info5059.casestudy.purchaseorder;

import lombok.Data;
import lombok.RequiredArgsConstructor;
// import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
@Data
@RequiredArgsConstructor
public class PurchaseOrder {
    @Id
    @GeneratedValue
    private Long Id;

    private Long vendorid; // FK
    private BigDecimal amount;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDateTime podate;

    // @OneToMany(mappedBy = "poid", cascade = CascadeType.ALL, orphanRemoval = true)
    @OneToMany(targetEntity = PurchaseOrderLineitem.class, fetch = FetchType.EAGER, orphanRemoval = true)
    @JoinColumn(name = "poid", referencedColumnName = "id")
    private List<PurchaseOrderLineitem> items = new ArrayList<PurchaseOrderLineitem>();
}
