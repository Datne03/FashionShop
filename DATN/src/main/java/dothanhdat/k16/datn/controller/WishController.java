package dothanhdat.k16.datn.controller;

import dothanhdat.k16.datn.dto.response.ApiResponse;
import dothanhdat.k16.datn.dto.response.WishResponse;
import dothanhdat.k16.datn.dto.response.Wish_ProductResponse;
import dothanhdat.k16.datn.service.serviceImpl.WishServiceImpl;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/wish")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class WishController {
    WishServiceImpl wishService;

    @PostMapping("/{userId}/{productId}")
    public ApiResponse<WishResponse> addProductToWish(@PathVariable int userId, @PathVariable int productId) {
        return ApiResponse.<WishResponse>builder()
                .result(wishService.addProductToWishList(userId, productId))
                .code(200)
                .message("Success")
                .build();
    }

    @GetMapping("/{userId}")
    public ApiResponse<List<Wish_ProductResponse>> getWishListItem(@PathVariable int userId) {
        return ApiResponse.<List<Wish_ProductResponse>>builder()
                .result(wishService.getAllWish(userId))
                .code(200)
                .message("Success")
                .build();
    }

    @DeleteMapping("/{userId}/{productId}")
    public ApiResponse<String> deleteWish(@PathVariable int userId, @PathVariable int productId) {
        return ApiResponse.<String>builder()
                .result(wishService.deleteWish(userId, productId))
                .code(200)
                .message("success")
                .build();
    }
}
