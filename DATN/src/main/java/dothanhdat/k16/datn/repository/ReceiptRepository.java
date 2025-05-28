package dothanhdat.k16.datn.repository;

import dothanhdat.k16.datn.entity.Receipt.Receipt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReceiptRepository extends JpaRepository<Receipt, Integer> {
}
