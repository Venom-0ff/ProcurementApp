package com.info5059.casestudy.product;

<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 77ee9d557885f2ee0b7ccb069c8ef85a7390678c
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;


@RepositoryRestResource(collectionResourceRel = "products", path = "products")
public interface ProductRepository extends JpaRepository<Product, String> {
<<<<<<< HEAD
=======
=======
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.transaction.annotation.Transactional;

@RepositoryRestResource(collectionResourceRel = "products", path = "products")
public interface ProductRepository extends CrudRepository<Product, Long> {
>>>>>>> 6da0c1cb7ab5122330ba3139173dc21992ea87e6
>>>>>>> 77ee9d557885f2ee0b7ccb069c8ef85a7390678c
    // extend so we can return the number of rows deleted
    @Modifying
    @Transactional
    @Query("delete from Product where id = ?1")
    int deleteOne(String productid);
<<<<<<< HEAD

    List<Product> findByVendorid(Long vendorid);
=======
<<<<<<< HEAD

    List<Product> findByVendorid(Long vendorid);
=======
>>>>>>> 6da0c1cb7ab5122330ba3139173dc21992ea87e6
>>>>>>> 77ee9d557885f2ee0b7ccb069c8ef85a7390678c
}