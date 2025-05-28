package dothanhdat.k16.datn.service.serviceImpl;

import dothanhdat.k16.datn.dto.request.*;
import dothanhdat.k16.datn.dto.response.UserResponse;
import dothanhdat.k16.datn.entity.User.Role;
import dothanhdat.k16.datn.entity.User.User;
import dothanhdat.k16.datn.exception.AppException;
import dothanhdat.k16.datn.exception.ErrException;
import dothanhdat.k16.datn.mapper.IUserMapper;
import dothanhdat.k16.datn.repository.UserRepository;
import dothanhdat.k16.datn.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserServiceImpl implements UserService {
    UserRepository userRepository;
    PasswordEncoder passwordEncoder;
    IUserMapper userMapper;
    EmailService emailService;
    AuthenticationService authenticationService;

//    @Override
//    public UserResponse getAdminUser() {
//        return userMapper.toUserResponse(userRepository.findByRolesContaining(String.valueOf(Role.ADMIN))
//                .orElseThrow(() -> new RuntimeException("Admin not found")));
//    }

    @Override
    public UserResponse createUser(UserCreateRequest userCreateRequest) {
        if (userRepository.existsByUsername(userCreateRequest.getUsername()) || userRepository.existsByEmail(userCreateRequest.getEmail())) {
            throw new RuntimeException("Username or email address already in use");
        }
        User user = userMapper.toUser(userCreateRequest);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        HashSet<String> roles = new HashSet<>();
        roles.add(Role.CUSTOMER.name());
        user.setRoles(roles);
        user.setCreatedAt(LocalDateTime.now());
        user.setActive(true);
        if (userCreateRequest.getEmail() != null && !userCreateRequest.getEmail().isEmpty()) {
            String subject = "Welcome to our service";
            String text = "\nDear "+userCreateRequest.getUsername()+","+userCreateRequest.getEmail()+","+userCreateRequest.getPassword();
            emailService.sendMessage(userCreateRequest.getEmail(), subject, text);
        }
        return userMapper.toUserResponse(userRepository.save(user));
    }

    @Override
    public UserResponse updateUser(int id, UserUpdateRequest userUpdateRequest) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrException.USER_NOT_EXISTED));

        userMapper.updateUser(user, userUpdateRequest);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setUpdatedAt(LocalDateTime.now());
        return userMapper.toUserResponse(userRepository.save(user));
    }

    @Override
    public String deleteUser(int id) {
        User userDelete = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrException.USER_NOT_EXISTED));
        userDelete.setActive(false);
        userRepository.save(userDelete);
        return "xoa thanh cong";
    }

    public String activeUser(int id) {
        User user = userRepository.findById(id).orElseThrow(() -> new AppException(ErrException.USER_NOT_EXISTED));
        user.setActive(true);
        userRepository.save(user);
        return "Kich hoat thanh cong";
    }

    @Override
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .filter(user -> user.getRoles() == null || !user.getRoles().contains("ADMIN"))
                .map(userMapper::toUserResponse)
                .collect(Collectors.toList());
    }

    @Override
    public UserResponse getUserById(int id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrException.USER_NOT_EXISTED));
        return userMapper.toUserResponse(user);
    }

    @Override
    public BigDecimal getNumberUsers(String date) {
        return userRepository.getNumberOfUsersCreatedOn(date);
    }

    @Override
    public String forgotPassword(String email) {
        User user = userRepository.findUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        System.out.println("user: "+user.getEmail());

        String subject = "Dear, "+user.getUsername()+", your account has been reset password successfully.";
        String resetPassword = resetPassword(6);
        emailService.sendMessage(email, subject , "\nYour new password: "+resetPassword);
        user.setPassword(passwordEncoder.encode(resetPassword));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        return "Your new password has been send to your email";
    }

    @Override
    public String resetPassword(int length) {
        String allowedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        Random random = new Random();
        StringBuilder password = new StringBuilder();

        for (int i = 0; i < length; i++) {
            int index = random.nextInt(allowedChars.length());
            password.append(allowedChars.charAt(index));
        }

        return password.toString();
    }

    @Override
    public boolean changePassword(int id, ChangePasswordRequest changePasswordRequest) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (user != null && passwordEncoder.matches(changePasswordRequest.getOldPassword(), user.getPassword())) {
            user.setPassword(passwordEncoder.encode(changePasswordRequest.getNewPassword()));
            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);
            return true;
        }
        return false;
    }


    private boolean isPhoto(MultipartFile file) {
        String contentType = file.getContentType();
        return contentType != null && contentType.startsWith("image/");
    }

    private String storeFile(MultipartFile file) {
        if (!isPhoto(file) || file.getOriginalFilename() == null || file.getOriginalFilename().isEmpty()) {
            throw new AppException(ErrException.NOT_FILE);
        }
        String fileName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        String uniqueFilename = UUID.randomUUID().toString()+"_"+fileName;
        java.nio.file.Path uploadDir = java.nio.file.Paths.get("upload/user");
        if (!Files.exists(uploadDir)) {
            try {
                Files.createDirectories(uploadDir);
            } catch (IOException e) {
                throw new AppException(ErrException.DIRECTORY_CREATION_FAILED);
            }
        }
        java.nio.file.Path destination = Paths.get(uploadDir.toString(), uniqueFilename);
        try {
            Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new AppException(ErrException.FILE_STORAGE_FAILED);
        }
        return uniqueFilename;
    }

    @Override
    public UserResponse uploadAvatar(int id, MultipartFile file) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrException.USER_NOT_EXISTED));
        String fileName = storeFile(file);
        user.setAvatar(fileName);
        return userMapper.toUserResponse(userRepository.save(user));
    }
}
