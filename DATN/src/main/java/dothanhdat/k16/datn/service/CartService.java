package dothanhdat.k16.datn.service;

import dothanhdat.k16.datn.dto.response.CartItemResponse;
import dothanhdat.k16.datn.dto.response.CartResponse;
import dothanhdat.k16.datn.entity.Cart.CartItem;

import java.util.List;
import java.util.Optional;

public interface CartService {
    CartResponse addProductToCart(int userId, int productVariantId, int quantity);
    List<CartItemResponse> getAllCartItem(int cartId);
    CartResponse updateCart(int cartId, int productVariantId, int quantity);
    String deleteCartItem(int userId, int variantId);
    Optional<CartResponse> getCartByUserId(int userId);
    void deleteCart(int userId);
}
