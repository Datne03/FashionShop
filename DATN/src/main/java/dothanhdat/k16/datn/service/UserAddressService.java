package dothanhdat.k16.datn.service;

import dothanhdat.k16.datn.dto.response.UserAddressResponse;
import dothanhdat.k16.datn.entity.User.UserAddress;
import org.json.JSONException;

import java.util.List;

public interface UserAddressService {
    UserAddressResponse createUserAddress(int userId, UserAddress userAddress) throws JSONException;
    UserAddressResponse updateUserAddress(int id, UserAddress userAddress);
    String deleteUserAddress(int id);
    UserAddressResponse getUserAddressById(int id);
    List<UserAddressResponse> getUserAddressesByUserId(int userId);
}
