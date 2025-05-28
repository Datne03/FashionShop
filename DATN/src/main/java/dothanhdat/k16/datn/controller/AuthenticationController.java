package dothanhdat.k16.datn.controller;

import dothanhdat.k16.datn.dto.request.AuthenticationRequest;
import dothanhdat.k16.datn.dto.response.ApiResponse;
import dothanhdat.k16.datn.dto.response.AuthenticationResponse;
import dothanhdat.k16.datn.service.serviceImpl.AuthenticationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class AuthenticationController {
    AuthenticationService authenticationService;
    @PostMapping("/login")
    public ApiResponse<AuthenticationResponse> login(@RequestBody AuthenticationRequest authenticationRequest) {
        return ApiResponse.<AuthenticationResponse>builder()
                .code(200)
                .message("Login Successful")
                .result(authenticationService.authenticationResponse(authenticationRequest))
                .build();
    }
}
