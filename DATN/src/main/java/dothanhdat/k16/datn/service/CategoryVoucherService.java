package dothanhdat.k16.datn.service;

import dothanhdat.k16.datn.dto.response.CategoryVoucherResponse;
import dothanhdat.k16.datn.entity.Category.CategoryVoucher;

import java.util.List;

public interface CategoryVoucherService {
    CategoryVoucherResponse createVoucher(int categoryId, CategoryVoucher categoryVoucher);
    CategoryVoucherResponse updateVoucher(int id, CategoryVoucher categoryVoucher);
    List<CategoryVoucherResponse> getAllVouchersForUser();
    List<CategoryVoucherResponse> getAllVouchersForAdmin();
    CategoryVoucherResponse getVoucherById(int id);
    String deleteVoucher(int id);
}
