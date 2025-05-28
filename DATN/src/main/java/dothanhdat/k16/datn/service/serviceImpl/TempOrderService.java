package dothanhdat.k16.datn.service.serviceImpl;


import dothanhdat.k16.datn.entity.Order.TempOrder;
import dothanhdat.k16.datn.repository.TempOrderRepository;
import dothanhdat.k16.datn.service.ITempOrderService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Service
public class TempOrderService implements ITempOrderService {
    TempOrderRepository tempOrderRepository;
    @Override
    public void save(TempOrder tempOrder) {
        this.tempOrderRepository.save(tempOrder);
    }

    @Override
    public TempOrder findByTxnRef(String vnpTxnRef) {
        return this.tempOrderRepository.findByTxnRef(vnpTxnRef);
    }
}
