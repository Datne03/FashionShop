package dothanhdat.k16.datn.service;

import dothanhdat.k16.datn.dto.response.SupplierResponse;
import dothanhdat.k16.datn.entity.Product.Supplier;

import java.util.List;

public interface SupplierService {
    SupplierResponse create(Supplier supplier);
    SupplierResponse update(int id, Supplier supplier);
    String delete(int id);
    List<SupplierResponse> getAll();
    List<SupplierResponse> getAllForAdmin();
    String active(int id);
}
