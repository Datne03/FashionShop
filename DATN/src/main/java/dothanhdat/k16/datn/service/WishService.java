package dothanhdat.k16.datn.service;

import dothanhdat.k16.datn.dto.response.WishResponse;
import dothanhdat.k16.datn.dto.response.Wish_ProductResponse;

import java.util.List;

public interface WishService {
    WishResponse addProductToWishList(int userId, int productId);
    List<Wish_ProductResponse> getAllWish(int userId);
    String deleteWish(int userId, int productId);

}
