package dothanhdat.k16.datn.repository;

import dothanhdat.k16.datn.entity.Cart.Cart;
import dothanhdat.k16.datn.entity.Cart.CartItem;
import dothanhdat.k16.datn.entity.Product.ProductVariant;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
     CartItem findByCartAndProductVariant(Cart cart, ProductVariant productVariant);
     List<CartItem> findCartItemByCart(Cart cart);
     void deleteByCart(Cart cartDelete);
     void deleteByProductVariant(ProductVariant productVariant);
     void deleteByCartAndProductVariant(Cart cart, ProductVariant productVariant);

     @Modifying
     @Transactional
     @Query("DELETE FROM CartItem c WHERE c.cart.user.id = :userId AND c.productVariant.id = :variantId")
     void deleteByUserIdAndProductVariantId(int userId, int variantId);

     CartItem findByCartIdAndProductVariantId(int id, int productVariantId);
}
