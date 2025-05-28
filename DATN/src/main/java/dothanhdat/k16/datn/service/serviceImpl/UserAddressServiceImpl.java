package dothanhdat.k16.datn.service.serviceImpl;

import dothanhdat.k16.datn.dto.response.UserAddressResponse;
import dothanhdat.k16.datn.entity.User.User;
import dothanhdat.k16.datn.entity.User.UserAddress;
import dothanhdat.k16.datn.mapper.IUserAddressMapper;
import dothanhdat.k16.datn.repository.UserAddressRepository;
import dothanhdat.k16.datn.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class UserAddressServiceImpl implements dothanhdat.k16.datn.service.UserAddressService {
    UserAddressRepository userAddressRepository;
    IUserAddressMapper userAddressMapper;
    UserRepository userRepository;
    GoogleMapService googleMapService;


    @Override
    public UserAddressResponse createUserAddress(int userId, UserAddress userAddress) throws JSONException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        userAddress.setUser(user);
        userAddress.setCreatedAt(LocalDateTime.now());
        userAddress.setUpdatedAt(LocalDateTime.now());

        String fullAddress = String.join(", ",
                userAddress.getStreet().trim(),
                userAddress.getWard().trim(),
                userAddress.getDistrict().trim(),
                userAddress.getProvince().trim()
        );

//        double[] latlon = googleMapService.getCoordinatesFromAddress(fullAddress);
//        userAddress.setLatitude(latlon[0]);
//        userAddress.setLongitude(latlon[1]);

        userAddress = userAddressRepository.save(userAddress);
        return userAddressMapper.toUserAddressResponse(userAddress);
    }

    @Override
    public UserAddressResponse updateUserAddress(int id, UserAddress userAddress) {
        UserAddress userAddressUpdate = userAddressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("UserAddress not found with id: " + id));

        userAddressUpdate.setProvince(userAddress.getProvince());
        userAddressUpdate.setDistrict(userAddress.getDistrict());
        userAddressUpdate.setWard(userAddress.getWard());
        userAddressUpdate.setStreet(userAddress.getStreet());
        userAddressUpdate.setUpdatedAt(LocalDateTime.now());

        userAddress = userAddressRepository.save(userAddressUpdate);
        userAddressUpdate.setAddress(userAddress.getAddress());

        userAddressRepository.save(userAddressUpdate);
        return userAddressMapper.toUserAddressResponse(userAddressUpdate);
    }

    @Override
    public String deleteUserAddress(int id) {
        UserAddress userAddress = userAddressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("UserAddress not found with id: " + id));
        userAddress.setDeleted(true);
        userAddressRepository.save(userAddress);
        return "Address deleted";
    }

    @Override
    public UserAddressResponse getUserAddressById(int id) {
        return userAddressMapper.toUserAddressResponse(userAddressRepository.findById(id)
                .orElseThrow(()->new RuntimeException("UserAddress not found with id: " + id)));
    }

    @Override
    public List<UserAddressResponse> getUserAddressesByUserId(int userId) {
        List<UserAddress> userAddresses = userAddressRepository.findByUserId(userId);
        return userAddresses.stream()
                .filter(userAddress -> !userAddress.isDeleted())
                .map(userAddressMapper::toUserAddressResponse)
                .collect(Collectors.toList());
    }
}
