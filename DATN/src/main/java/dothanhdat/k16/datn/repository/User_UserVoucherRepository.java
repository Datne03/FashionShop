package dothanhdat.k16.datn.repository;

import dothanhdat.k16.datn.entity.User.User;
import dothanhdat.k16.datn.entity.User.UserVoucher;
import dothanhdat.k16.datn.entity.User.User_UserVoucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface User_UserVoucherRepository extends JpaRepository<User_UserVoucher,Integer> {
    User_UserVoucher findByUserAndUserVoucher(User user, UserVoucher userVoucher);

    List<User_UserVoucher> findAllByUser(User user);

    @Query("select vu from User_UserVoucher vu where vu.user.id = :userId")
    List<User_UserVoucher> findUser_UserVoucherByUserId(@Param("userId") int userId);

    boolean existsByUserIdAndUserVoucherId(int userId, int voucherId);

    //Optional<User_UserVoucher> findByUserAndUserVoucher(User user, UserVoucher userVoucher);


    @Query("SELECT uuv FROM User_UserVoucher uuv WHERE uuv.user.id = :userId AND uuv.used = false")
    List<User_UserVoucher> findUnusedVouchersByUserId(int userId);
}
