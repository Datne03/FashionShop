package dothanhdat.k16.datn.repository;

import dothanhdat.k16.datn.entity.Order.TempOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface TempOrderRepository extends JpaRepository<TempOrder,Integer>, JpaSpecificationExecutor<TempOrder> {
    TempOrder findByTxnRef(String txnref);
}
