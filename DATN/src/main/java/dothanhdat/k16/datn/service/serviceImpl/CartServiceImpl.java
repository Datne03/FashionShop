package dothanhdat.k16.datn.service.serviceImpl;

import dothanhdat.k16.datn.dto.response.CartItemResponse;
import dothanhdat.k16.datn.dto.response.CartResponse;
import dothanhdat.k16.datn.entity.Cart.Cart;
import dothanhdat.k16.datn.entity.Cart.CartItem;
import dothanhdat.k16.datn.entity.Cart.Wish_Product;
import dothanhdat.k16.datn.entity.Product.Product;
import dothanhdat.k16.datn.entity.Product.ProductVariant;
import dothanhdat.k16.datn.entity.User.User;
import dothanhdat.k16.datn.mapper.ICartItemMapper;
import dothanhdat.k16.datn.mapper.ICartMapper;
import dothanhdat.k16.datn.repository.*;
import dothanhdat.k16.datn.service.CartService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class CartServiceImpl implements CartService {
    CartRepository cartRepository;
    CartItemRepository cartItemRepository;
    UserRepository userRepository;
    ProductRepository productRepository;
    ICartMapper cartMapper;
    ICartItemMapper cartItemMapper;
    ProductVariantRepository productVariantRepository;
    Wish_ProductRepository wishProductRepository;
    WishServiceImpl wishService;


    public Optional<CartResponse> getCartByUserId(int userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found for user ID: " + userId));
        return Optional.ofNullable(cartMapper.toCartResponse(cart));
    }


    @Transactional
    @Override
    public CartResponse addProductToCart(int userId, int productVariantId, int quantity) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findByUser(user)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    newCart.setTotalPrice(0.0);
                    return cartRepository.save(newCart);
                });

        ProductVariant productVariant = productVariantRepository.findById(productVariantId)
                .orElseThrow(() -> new RuntimeException("Product variant not found"));

        if (quantity > productVariant.getStock()) {
            throw new RuntimeException("Not enough stock available");
        }

        CartItem cartItem = cartItemRepository.findByCartIdAndProductVariantId(cart.getId(), productVariantId);
        System.out.println("Existing cart item: " + cartItem);

        if (cartItem == null) {
            cartItem = new CartItem();
            cartItem.setCart(cart);
            cartItem.setProductVariant(productVariant);
            cartItem.setQuantity(quantity);

            cart.getCartItems().add(cartItem);

            cartItemRepository.save(cartItem);
        } else {
            int newQuantity = cartItem.getQuantity() + quantity;
            if (newQuantity > productVariant.getStock()) {
                throw new RuntimeException("Quantity exceeds available stock");
            }
            cartItem.setQuantity(newQuantity);
        }
        cartItemRepository.save(cartItem);

        double totalPrice = cart.getCartItems().stream()
                .mapToDouble(item -> item.getProductVariant().getProduct().getPriceDiscount() * item.getQuantity())
                .sum();
        cart.setTotalPrice(totalPrice);

        cartRepository.save(cart);

//        productVariant.setStock(productVariant.getStock() - quantity);
//        productVariantRepository.save(productVariant);

        return cartMapper.toCartResponse(cart);
    }


    @Override
    public List<CartItemResponse> getAllCartItem(int userId) {
        Optional<Cart> cart = cartRepository.findByUser(userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Not found")));
        List<CartItem> cartItems = cartItemRepository.findCartItemByCart(cart.orElseThrow(() -> new RuntimeException("Not found")));
        return cartItemMapper.toCartItemResponseList(cartItems);
    }

    @Transactional
    @Override
    public CartResponse updateCart(int userId, int variantId, int quantity) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        CartItem cartItem = cart.getCartItems().stream()
                .filter(item -> item.getProductVariant().getId() == variantId)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Product not in cart"));

        ProductVariant productVariant = cartItem.getProductVariant();
        int currentQuantity = cartItem.getQuantity();
        int availableStock = productVariant.getStock() + currentQuantity;

        if (quantity > availableStock) {
            throw new RuntimeException("Not enough stock available");
        }

        if (quantity == 0) {
            cart.getCartItems().remove(cartItem);
            cartItemRepository.deleteById(cartItem.getId());
            productVariant.setStock(productVariant.getStock() + currentQuantity);
        } else {
            int quantityDiff = quantity - currentQuantity;
            cartItem.setQuantity(quantity);
            productVariant.setStock(productVariant.getStock() - quantityDiff);
        }

        double totalPrice = cart.getCartItems().stream()
                .mapToDouble(item -> item.getProductVariant().getProduct().getPriceDiscount() * item.getQuantity())
                .sum();
        cart.setTotalPrice(totalPrice);

        productVariantRepository.save(productVariant);
        cartRepository.save(cart);

        return cartMapper.toCartResponse(cart);
    }

    @Transactional
    public void deleteCart(int userId) {
        User user = this.userRepository.findById(userId).get();
        Cart cartDelete = this.cartRepository.findCartByUser(user);
        this.cartItemRepository.deleteByCart(cartDelete);
        this.cartRepository.deleteByUser(user);

    }


    @Override
    @Transactional
    public String deleteCartItem(int userId, int variantId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        CartItem cartItem = cartItemRepository.findByCartIdAndProductVariantId(cart.getId(), variantId);

        if (cartItem == null) {
            throw new RuntimeException("Product not found in cart");
        }

        ProductVariant productVariant = cartItem.getProductVariant();
        productVariant.setStock(productVariant.getStock() + cartItem.getQuantity());
        productVariantRepository.save(productVariant);

        cart.getCartItems().remove(cartItem);
        cartItemRepository.delete(cartItem);

        if (cart.getCartItems().isEmpty()) {
            cartRepository.deleteById(cart.getId());
            return "Cart deleted successfully";
        }

        double totalPrice = cart.getCartItems().stream()
                .mapToDouble(item -> item.getProductVariant().getProduct().getPriceDiscount() * item.getQuantity())
                .sum();
        cart.setTotalPrice(totalPrice);
        cartRepository.save(cart);

        return "Success";
    }

}
