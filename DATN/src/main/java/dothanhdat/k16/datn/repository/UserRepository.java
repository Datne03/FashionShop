package dothanhdat.k16.datn.repository;

import dothanhdat.k16.datn.entity.User.Role;
import dothanhdat.k16.datn.entity.User.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.Set;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUsername(String name);

    Optional<User> findByUsernameOrEmail(String username, String email);

    boolean existsByUsername(String username);
    boolean existsByEmail(String email);

    @Query(value = "SELECT * FROM datn.users u WHERE u.email = :email", nativeQuery = true)
    Optional<User> findUserByEmail(@Param("email") String email);

    @Query("SELECT u FROM User u WHERE :role MEMBER OF u.roles")
    Optional<User> findByRole(@Param("role") String role);


    @Query(value = "SELECT COUNT(*) AS total_users " +
            "FROM datn.users u " +
            "WHERE DATE(u.created_at) = :date",
            nativeQuery = true)
    BigDecimal getNumberOfUsersCreatedOn(@Param("date") String date);

    Optional<User> findByEmail(String email);

    //  Optional<User> findByRolesContaining(String role);

}
