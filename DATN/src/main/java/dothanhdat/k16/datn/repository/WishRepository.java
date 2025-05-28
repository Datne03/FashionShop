package dothanhdat.k16.datn.repository;

import dothanhdat.k16.datn.entity.User.User;
import dothanhdat.k16.datn.entity.Cart.Wish;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WishRepository extends JpaRepository<Wish, Integer> {
    Optional<Wish> findByUserId(int userId);

    Optional<Wish> findByUser(User user);

//    Wish findByUser(User user);
//
//    void deleteByUser(User user);
//
//    Optional<Wish> findByUserId(int userId);

}
