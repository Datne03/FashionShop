package dothanhdat.k16.datn.repository;

import dothanhdat.k16.datn.entity.Cart.Cart;
import dothanhdat.k16.datn.entity.User.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Integer> {
//    Optional<Cart> findByUserId(int userId);
    Optional<Cart> findByUser(User user);

    Optional<Cart> findByUserId(int userId);

    Cart findCartByUser(User user);

    void deleteByUser(User user);
}
