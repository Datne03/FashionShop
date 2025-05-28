package dothanhdat.k16.datn.service.serviceImpl;

import dothanhdat.k16.datn.dto.response.WishResponse;
import dothanhdat.k16.datn.dto.response.Wish_ProductResponse;
import dothanhdat.k16.datn.entity.Cart.Wish_Product;
import dothanhdat.k16.datn.entity.Product.Product;
import dothanhdat.k16.datn.entity.User.User;
import dothanhdat.k16.datn.entity.Cart.Wish;
import dothanhdat.k16.datn.mapper.IWishMapper;
import dothanhdat.k16.datn.mapper.Wish_ProductMapper;
import dothanhdat.k16.datn.repository.*;
import dothanhdat.k16.datn.service.WishService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class WishServiceImpl implements WishService {
    WishRepository wishRepository;
    IWishMapper wishMapper;
    ProductRepository productRepository;
    UserRepository userRepository;
    Wish_ProductRepository wishProductRepository;
    Wish_ProductMapper wishProductMapper;

//    @Transactional
//    public WishResponse getWishListByUserId(int userId) {
//        Optional<Wish> wish = wishRepository.findByUserId(userId);
//        return wishMapper.toWishResponse(wish.get());
//    }

    @Override
    public WishResponse addProductToWishList(int userId, int productId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Wish wish = wishRepository.findByUser(user)
                .orElseGet(() -> {
                    Wish newWish = new Wish();
                    newWish.setUser(user);
                    newWish.setWishList(new ArrayList<>());
                    return wishRepository.save(newWish);
                });

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        boolean exists = wish.getWishList().stream()
                .anyMatch(item -> item.getProduct().getId() == product.getId());

        if (!exists) {
            Wish_Product wishProduct = new Wish_Product();
            wishProduct.setWish(wish);
            wishProduct.setProduct(product);
            wishProductRepository.save(wishProduct);
            wish.getWishList().add(wishProduct);

            wishRepository.save(wish);
        } else {
            throw new RuntimeException("Product already exists in wishlist");
        }

        return wishMapper.toWishResponse(wish);
    }

    @Override
    public List<Wish_ProductResponse> getAllWish(int userId) {
        Wish wish = wishRepository.findByUserId(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return wishProductRepository.findByWish(wish).stream().map(wishMapper::toWishProductResponse).collect(Collectors.toList());
    }

    @Override
    public String deleteWish(int userId, int productId) {
        Optional<Wish_Product> wish = wishProductRepository.findByWishUserIdAndProductId(userId, productId);
        if (wish.isPresent()) {
            wishProductRepository.delete(wish.get());
            return "Product removed from wishlist successfully";
        }
        return "Product not found in wishlist";
    }
}
