package dothanhdat.k16.datn.config;


import dothanhdat.k16.datn.entity.User.Role;
import dothanhdat.k16.datn.entity.User.User;
import dothanhdat.k16.datn.entity.User.UserAddress;
import dothanhdat.k16.datn.repository.UserAddressRepository;
import dothanhdat.k16.datn.repository.UserRepository;
import dothanhdat.k16.datn.service.serviceImpl.GoogleMapService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class CreateAdminConfig {
    PasswordEncoder passwordEncoder;
    @Bean
    ApplicationRunner applicationRunner(UserRepository userRepository, UserAddressRepository userAddressRepository, GoogleMapService googleMapService) {
        return args -> {
            if (userRepository.findByUsername("admin").isEmpty()){
                var role = new HashSet<String>();
                role.add(Role.ADMIN.name());

                User user = User.builder()
                        .username("admin")
                        .password(passwordEncoder.encode("admin"))
                        .email("admin@gmail.com")
                        .roles(role)
                        .active(true)
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build();
                userRepository.save(user);

                UserAddress userAddress = new UserAddress();
                userAddress.setProvince("Hà Nội");
                userAddress.setDistrict("Quận Bắc Từ Liêm");
                userAddress.setWard("Phường Minh Khai");
                userAddress.setStreet("Số 298 Đường Cầu Diễn");
                userAddress.setUser(user);

                userAddressRepository.save(userAddress);
                List<UserAddress> addresses = new ArrayList<>();
                addresses.add(userAddress);
                user.setUserAddresses(addresses);

//                String fullAddress = String.join(", ",
//                        userAddress.getStreet().trim(),
//                        userAddress.getWard().trim(),
//                        userAddress.getDistrict().trim(),
//                        userAddress.getProvince().trim()
//                );
//
//
//                double[] latLng = googleMapService.getLatLngFromAddress(fullAddress);
//                userAddress.setLatitude(latLng[0]);
//                userAddress.setLongitude(latLng[1]);


                userRepository.save(user);
            }
        };
    }
}
