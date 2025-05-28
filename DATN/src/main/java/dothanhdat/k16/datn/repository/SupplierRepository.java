package dothanhdat.k16.datn.repository;

import dothanhdat.k16.datn.entity.Product.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Integer> {
}
