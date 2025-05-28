package dothanhdat.k16.datn.service.serviceImpl;

import dothanhdat.k16.datn.dto.response.SupplierResponse;
import dothanhdat.k16.datn.entity.Product.Supplier;
import dothanhdat.k16.datn.mapper.ISupplierMapper;
import dothanhdat.k16.datn.repository.SupplierRepository;
import dothanhdat.k16.datn.service.SupplierService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class SupplierServiceImpl implements SupplierService {
    ISupplierMapper supplierMapper;
    SupplierRepository supplierRepository;

    @Override
    public SupplierResponse create(Supplier supplier) {
        return supplierMapper.toResponse(supplierRepository.save(supplier));
    }

    @Override
    public SupplierResponse update(int id, Supplier supplier) {
        Supplier updateSupplier = supplierRepository.findById(id).orElseThrow(() -> new RuntimeException("Supplier not found"));
        updateSupplier.setName(supplier.getName());
        updateSupplier.setAddress(supplier.getAddress());
        updateSupplier.setPhone(supplier.getPhone());
        updateSupplier.setEmail(supplier.getEmail());
        supplierRepository.save(updateSupplier);
        return supplierMapper.toResponse(updateSupplier);
    }

    @Override
    public String delete(int id) {
        Supplier supplier = supplierRepository.findById(id).orElseThrow(() -> new RuntimeException("Supplier not found"));
        supplier.setDeleted(true);
        supplierRepository.save(supplier);
        return "Deleted";
    }

    @Override
    public List<SupplierResponse> getAll() {
        return supplierRepository.findAll().stream()
                .map(s -> supplierMapper.toResponse(s))
                .collect(Collectors.toList());
    }

    @Override
    public List<SupplierResponse> getAllForAdmin() {
        return supplierRepository.findAll().stream()
                .map(s -> supplierMapper.toResponse(s))
                .filter(s -> !s.isDeleted())
                .collect(Collectors.toList());
    }

    @Override
    public String active(int id) {
        Supplier supplier = supplierRepository.findById(id).orElseThrow(() -> new RuntimeException("Supplier not found"));
        supplier.setDeleted(false);
        supplierRepository.save(supplier);
        return "Active";
    }
}
