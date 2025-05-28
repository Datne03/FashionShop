package dothanhdat.k16.datn.repository;

import dothanhdat.k16.datn.entity.User.UserAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserAddressRepository extends JpaRepository<UserAddress, Integer> {
    List<UserAddress> findByUserId(int userId);
}
