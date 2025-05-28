package dothanhdat.k16.datn.service.serviceImpl;

import dothanhdat.k16.datn.dto.request.UserVoucherCreateRequest;
import dothanhdat.k16.datn.dto.request.UserVoucherUpdateRequest;
import dothanhdat.k16.datn.dto.response.UserVoucherResponse;
import dothanhdat.k16.datn.dto.response.User_UserVoucherResponse;
import dothanhdat.k16.datn.entity.Order.Order;
import dothanhdat.k16.datn.entity.User.User;
import dothanhdat.k16.datn.entity.User.UserVoucher;
import dothanhdat.k16.datn.entity.User.User_UserVoucher;
import dothanhdat.k16.datn.mapper.IUserVoucherMapper;
import dothanhdat.k16.datn.mapper.IUser_UserVoucherMapper;
import dothanhdat.k16.datn.repository.OrderRepository;
import dothanhdat.k16.datn.repository.UserRepository;
import dothanhdat.k16.datn.repository.UserVoucherRepository;
import dothanhdat.k16.datn.repository.User_UserVoucherRepository;
import dothanhdat.k16.datn.service.UserVoucherService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class UserVoucherServiceImpl implements UserVoucherService {
    private final IUser_UserVoucherMapper iUser_UserVoucherMapper;
    UserVoucherRepository userVoucherRepository;
    IUserVoucherMapper userVoucherMapper;
    UserRepository userRepository;
    OrderRepository orderRepository;
    User_UserVoucherRepository userUserVoucherRepository;
    IUser_UserVoucherMapper userUserVoucherMapper;

    @Override
    public UserVoucherResponse createVoucher(UserVoucherCreateRequest request) {
        UserVoucher userVoucher = userVoucherMapper.toUserVoucher(request);
        userVoucher.setCreatedAt(LocalDateTime.now());
        userVoucher = userVoucherRepository.save(userVoucher);

        return userVoucherMapper.toUserVoucherResponse(userVoucher);
    }

    @Override
    public User_UserVoucherResponse receiveVoucher(int userId, int voucherId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserVoucher userVoucher = userVoucherRepository.findById(voucherId)
                .orElseThrow(() -> new RuntimeException("UserVoucher not found"));

        boolean isVoucherReceived = userUserVoucherRepository.existsByUserIdAndUserVoucherId(userId, voucherId);
        if (isVoucherReceived) {
            throw new RuntimeException("Voucher đã được nhận rồi.");
        }

        User_UserVoucher userUserVoucher = new User_UserVoucher();
        userUserVoucher.setUserVoucher(userVoucher);
        userUserVoucher.setUser(user);

        userUserVoucherRepository.save(userUserVoucher);

        return userUserVoucherMapper.toUserVoucherResponse(userUserVoucher);
    }


    @Override
    public UserVoucherResponse updateVoucher(int id, UserVoucherUpdateRequest request) {
        UserVoucher userVoucher = userVoucherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("UserVoucher not found with id: " + id));
        userVoucherMapper.updateVoucher(userVoucher, request);
        userVoucher.setUpdatedAt(LocalDateTime.now());
        userVoucher = userVoucherRepository.save(userVoucher);

        return userVoucherMapper.toUserVoucherResponse(userVoucher);
    }

    @Override
    public List<UserVoucherResponse> getAllVouchersForUser(int userId) {
        return userVoucherRepository.findAll().stream()
//                .filter(voucher -> !voucher.isDeleted())
//                .filter(voucher -> voucher.getUseAmount() > 0)
//                .filter(voucher -> voucher.getUserUserVouchers().stream()
//                        .noneMatch(userUserVoucher ->
//                                userUserVoucher.getUser().getId() == userId && userUserVoucher.isUsed()))
                .map(userVoucherMapper::toUserVoucherResponse)
                .collect(Collectors.toList());
    }


    @Override
    public List<UserVoucherResponse> getAllVouchersForAdmin() {
        return userVoucherRepository.findAll().stream()
                .filter(voucher -> !voucher.isDeleted())
                .map(userVoucherMapper::toUserVoucherResponse)
                .collect(Collectors.toList());
    }

    @Override
    public UserVoucherResponse getUserVoucherById(int id) {
        return userVoucherMapper.toUserVoucherResponse(userVoucherRepository.findById(id)
                .orElseThrow(()->new RuntimeException("UserVoucher not found with id: " + id)));
    }

    public List<User_UserVoucherResponse> getVouchersNotUsedForUser(int userId) {
        return userUserVoucherMapper.toList(userUserVoucherRepository.findUnusedVouchersByUserId(userId));
    }

    @Override
    public String deleteVoucher(int id) {
        UserVoucher userVoucher = userVoucherRepository.findById(id)
                .orElseThrow(()->new RuntimeException("UserVoucher not found with id: " + id));
        userVoucher.setDeleted(true);
        userVoucherRepository.save(userVoucher);
        return "Voucher deleted";
    }

    @Override
    public List<User_UserVoucherResponse> getUserVouchersByUserId(int userId) {
        User user = userRepository.findById(userId).orElseThrow(()->new RuntimeException("User not found"));
        return userUserVoucherRepository.findAllByUser(user).stream().map(iUser_UserVoucherMapper::toUserVoucherResponse)
                .collect(Collectors.toList());
    }
}
