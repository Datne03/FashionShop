package dothanhdat.k16.datn.service;


import dothanhdat.k16.datn.entity.Order.TempOrder;

public interface ITempOrderService {

    void save(TempOrder tempOrder);

    TempOrder findByTxnRef(String vnpTxnRef);
}
