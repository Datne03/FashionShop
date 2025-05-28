package dothanhdat.k16.datn.repository;

import dothanhdat.k16.datn.entity.Cart.Wish;
import dothanhdat.k16.datn.entity.Cart.Wish_Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface Wish_ProductRepository extends JpaRepository<Wish_Product, Integer> {
    Optional<Wish_Product> findByWishUserIdAndProductId(int userId, int productId);

    List<Wish_Product> findByWish(Wish wish);
}
