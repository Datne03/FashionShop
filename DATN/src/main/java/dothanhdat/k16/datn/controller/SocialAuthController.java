package dothanhdat.k16.datn.controller;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import dothanhdat.k16.datn.dto.request.FacebookTokenRequest;
import dothanhdat.k16.datn.dto.request.GoogleTokenRequest;
import dothanhdat.k16.datn.dto.response.AuthenticationResponse;
import dothanhdat.k16.datn.entity.User.Role;
import dothanhdat.k16.datn.entity.User.User;
import dothanhdat.k16.datn.repository.UserRepository;
import dothanhdat.k16.datn.service.serviceImpl.AuthenticationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import com.google.api.client.json.jackson2.JacksonFactory; // thêm dòng này nếu chưa có


import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import static jakarta.persistence.GenerationType.UUID;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class SocialAuthController {
    UserRepository userRepository;
    AuthenticationService authenticationService;
    PasswordEncoder passwordEncoder;

    @GetMapping("/success")
    public ResponseEntity<AuthenticationResponse> getUserInfo(@AuthenticationPrincipal OAuth2User oauth2User) {
        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");

        // Kiểm tra xem user đã tồn tại chưa
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    // Nếu chưa, tạo user mới
                    User newUser = new User();
                    newUser.setUsername(name);
                    newUser.setEmail(email);
                    //newUser.setPassword(java.util.UUID.randomUUID().toString()); // tránh hardcode "123456"
                    newUser.setPassword(passwordEncoder.encode("123456"));

                    newUser.setActive(true);
                    newUser.setRoles(Set.of(Role.CUSTOMER.name()));
                    return userRepository.save(newUser);
                });

        String token = authenticationService.createToken(user);

        return ResponseEntity.ok(AuthenticationResponse.builder()
                .token(token)
                .userId(user.getId())
                .username(user.getUsername())
                .check(true)
                .build());
    }


    private static final String CLIENT_ID = "52230843542-0pnor0tpml7kslr8evlqufr3ubb033cb.apps.googleusercontent.com";

    @PostMapping("/google")
    public AuthenticationResponse googleLogin(@RequestBody GoogleTokenRequest request) {
        String idToken = request.getId_token();

        if (idToken == null || idToken.trim().isEmpty()) {
            throw new IllegalArgumentException("id_token is missing from request body");
        }

        GoogleIdToken.Payload payload = verifyGoogleToken(idToken);

        if (payload == null) {
            throw new IllegalArgumentException("Invalid Google ID token");
        }

        String email = payload.getEmail();
        String name = (String) payload.get("name");
        String avatar = (String) payload.get("picture");

        // Kiểm tra xem user đã tồn tại chưa
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = User.builder()
                            .email(email)
                            .username(name)
                            .avatar(avatar)
                            .password(java.util.UUID.randomUUID().toString())
                            .roles(Set.of(Role.CUSTOMER.name()))  // Role CUSTOMER
                            .createdAt(LocalDateTime.now())
                            .active(true)
                            .build();
                    return userRepository.save(newUser);
                });

        // Tạo token cho người dùng
        String token = authenticationService.createToken(user);

        return AuthenticationResponse.builder()
                .token(token)
                .check(true)
                .userId(user.getId())
                .username(user.getUsername())
                .build();
    }

    private GoogleIdToken.Payload verifyGoogleToken(String idTokenString) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    GoogleNetHttpTransport.newTrustedTransport(),
                    JacksonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList(CLIENT_ID))
                    .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken != null) {
                return idToken.getPayload();
            } else {
                throw new RuntimeException("Invalid ID token.");
            }

        } catch (Exception e) {
            throw new RuntimeException("Token verification failed", e);
        }
    }


//    @PostMapping("/facebook")
//    public AuthenticationResponse facebookLogin(@RequestBody FacebookTokenRequest request) {
//        String accessToken = request.getAccessToken();
//
//        if (accessToken == null || accessToken.trim().isEmpty()) {
//            throw new IllegalArgumentException("Access token is missing from request body");
//        }
//
//        FacebookUser facebookUser = getFacebookUserInfo(accessToken);
//
//        if (facebookUser == null || facebookUser.getEmail() == null) {
//            throw new RuntimeException("Failed to retrieve user info from Facebook");
//        }
//
//        String email = facebookUser.getEmail();
//        String name = facebookUser.getName();
//        String picture = facebookUser.getPicture();
//
//        User user = userRepository.findByEmail(email)
//                .orElseGet(() -> {
//                    User newUser = User.builder()
//                            .email(email)
//                            .username(email.split("@")[0])
//                            .avatar(picture)
//                            .roles(Set.of("USER"))
//                            .createdAt(LocalDateTime.now())
//                            .active(true)
//                            .build();
//                    return userRepository.save(newUser);
//                });
//
//        String token = authenticationService.createToken(user);
//        return AuthenticationResponse.builder()
//                .token(token)
//                .check(true)
//                .userId(user.getId())
//                .username(user.getUsername())
//                .build();
//    }
//
//    private FacebookUser getFacebookUserInfo(String accessToken) {
//        String url = "https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=" + accessToken;
//
//        try {
//            var restTemplate = new org.springframework.web.client.RestTemplate();
//            return restTemplate.getForObject(url, FacebookUser.class);
//        } catch (Exception e) {
//            throw new RuntimeException("Failed to get user info from Facebook", e);
//        }
//    }


}