package com.info5059.casestudy.purchaseorder;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.info5059.casestudy.product.Product;
import com.info5059.casestudy.product.ProductRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

@Component
public class PurchaseOrderDAO {
    @PersistenceContext
    private EntityManager entityManager;
    
    @Autowired
    private ProductRepository productRepository;

    @Transactional
    public PurchaseOrder create(PurchaseOrder clientrep) {
        PurchaseOrder realPurchaseOrder = new PurchaseOrder();
        realPurchaseOrder.setVendorid(clientrep.getVendorid());
        realPurchaseOrder.setAmount(clientrep.getAmount());
        realPurchaseOrder.setPodate(LocalDateTime.now());
        entityManager.persist(realPurchaseOrder);

        for (PurchaseOrderLineitem item : clientrep.getItems()) {
            PurchaseOrderLineitem realItem = new PurchaseOrderLineitem();
            realItem.setPoid(realPurchaseOrder.getId());
            realItem.setProductid(item.getProductid());
            realItem.setQty(item.getQty());
            realItem.setPrice(item.getPrice());
            // we also need to update the QOO on the product table
            Product product = productRepository.getReferenceById(item.getProductid());
            product.setQoo(item.getQty());
            productRepository.saveAndFlush(product);
            entityManager.persist(realItem);
        }

        entityManager.flush();
        entityManager.refresh(realPurchaseOrder);
        return realPurchaseOrder;
    }
}
