package dothanhdat.k16.datn.service.serviceImpl;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import dothanhdat.k16.datn.dto.request.AuthenticationRequest;
import dothanhdat.k16.datn.dto.response.AuthenticationResponse;
import dothanhdat.k16.datn.entity.User.User;
import dothanhdat.k16.datn.exception.AppException;
import dothanhdat.k16.datn.exception.ErrException;
import dothanhdat.k16.datn.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.StringJoiner;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class AuthenticationService {
    UserRepository userRepository;
    PasswordEncoder passwordEncoder;

    protected static final String KEY_SIGN = "lQgnbki8rjdh62RZ2FNXZB9KWYB1IjajiY04z011BXjjagnc7a";

    public String createToken(User user) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS256);
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getUsername())
                .issuer("Do Thanh Dat")
                .issueTime(new Date())
                .expirationTime(Date.from(Instant.now().plus(100, ChronoUnit.HOURS)))
                .claim("scope", buildScopeToRoles(user))
                .build();
        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            jwsObject.sign(new MACSigner(KEY_SIGN.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.error("cant create token", e);
            throw new RuntimeException();
        }
    }

    public AuthenticationResponse authenticationResponse(AuthenticationRequest authenticationRequest) {
        var user = userRepository.findByUsernameOrEmail(
                        authenticationRequest.getIdentifier(), // Tìm cả username và email
                        authenticationRequest.getIdentifier())
                .orElseThrow(() -> new AppException(ErrException.USER_NOT_EXISTED));
        if (user.isActive() == true){
            boolean checked = passwordEncoder.matches(authenticationRequest.getPassword(), user.getPassword());
            if (!checked) {
                throw new AppException(ErrException.USER_NOT_EXISTED);
            }
            var token = createToken(user);
            return AuthenticationResponse.builder()
                    .token(token)
                    .check(true)
                    .userId(user.getId())
                    .username(user.getUsername())
                    .build();
        }
        else {
            throw new AppException(ErrException.USER_NOT_EXISTED);
        }

    }

    private Object buildScopeToRoles(User user) {
        StringJoiner scopeJoiner = new StringJoiner(" ");
        if (!CollectionUtils.isEmpty(user.getRoles())) {
            user.getRoles().forEach(scopeJoiner::add);
        }
        return scopeJoiner.toString();
    }
}
