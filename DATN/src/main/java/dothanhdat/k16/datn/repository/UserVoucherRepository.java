package dothanhdat.k16.datn.repository;

import dothanhdat.k16.datn.entity.User.UserVoucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserVoucherRepository extends JpaRepository<UserVoucher, Integer> {
    Optional<UserVoucher> findByCode(String code);

}
