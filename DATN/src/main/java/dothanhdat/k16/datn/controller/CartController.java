package dothanhdat.k16.datn.controller;

import dothanhdat.k16.datn.dto.response.ApiResponse;
import dothanhdat.k16.datn.dto.response.CartItemResponse;
import dothanhdat.k16.datn.dto.response.CartResponse;
import dothanhdat.k16.datn.service.serviceImpl.CartServiceImpl;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class CartController {
    CartServiceImpl cartService;

    @GetMapping("/{userId}")
    public ApiResponse<Optional<CartResponse>> getCartByUserId(@PathVariable("userId") int userId) {
        return ApiResponse.<Optional<CartResponse>>builder()
                .result(cartService.getCartByUserId(userId))
                .code(200)
                .message("success")
                .build();
    }

    @PostMapping("/{userId}/{variantId}")
    public ApiResponse<CartResponse> addCart(@PathVariable("userId") int userId, @PathVariable("variantId") int productVariantId, @RequestParam int quantity) {
        return ApiResponse.<CartResponse>builder()
                .result(cartService.addProductToCart(userId, productVariantId, quantity))
                .code(200)
                .message("success")
                .build();
    }

    @GetMapping("/cartItem/{userId}")
    public ApiResponse<List<CartItemResponse>> getCartItemsByUserId(@PathVariable("userId") int userId) {
        return ApiResponse.<List<CartItemResponse>>builder()
                .result(cartService.getAllCartItem(userId))
                .code(200)
                .message("success")
                .build();
    }

    @PutMapping("/{userId}/{variantId}")
    public ApiResponse<CartResponse> updateCart(@PathVariable int userId, @PathVariable int variantId, @RequestParam int quantity) {
        return ApiResponse.<CartResponse>builder()
                .result(cartService.updateCart(userId, variantId, quantity))
                .code(200)
                .message("success")
                .build();
    }

    @DeleteMapping("/{userId}/{variantId}")
    public ApiResponse<String> deleteCart(@PathVariable int userId, @PathVariable int variantId) {
        return ApiResponse.<String>builder()
                .result(cartService.deleteCartItem(userId, variantId))
                .code(200)
                .message("success")
                .build();
    }
}
