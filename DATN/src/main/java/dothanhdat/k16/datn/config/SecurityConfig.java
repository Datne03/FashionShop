package dothanhdat.k16.datn.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.client.RestTemplate;

import javax.crypto.spec.SecretKeySpec;

@Configuration
public class SecurityConfig {
    protected static final String KEY_SIGN = "lQgnbki8rjdh62RZ2FNXZB9KWYB1IjajiY04z011BXjjagnc7a";

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }
//                        .requestMatchers("/admin/**").hasRole("Admin")
//                        .requestMatchers("/user/**").permitAll()
//                        .requestMatchers("/voucher/**").permitAll()
//                        .requestMatchers("/voucher/admin/**").hasRole("Admin")
//                        .requestMatchers("/order/**").permitAll()
//                        .requestMatchers("/order/admin/**").hasRole("Admin")
//                        .requestMatchers("/product/**").permitAll()
//                        .requestMatchers("/category/**").permitAll()
//                        .requestMatchers("/message/**").permitAll()
//                        .requestMatchers("/cart").permitAll()
//                        .requestMatchers("/auth/**").permitAll()
//                        .requestMatchers(("/review/**")).permitAll()

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(request ->
                request
                        .requestMatchers("/**").permitAll()
                        .anyRequest().permitAll()
                )
                .oauth2Login(oauth2 -> oauth2
                        .defaultSuccessUrl("/oauth2/success", true)
                );
       // http.oauth2ResourceServer(AbstractHttpConfigurer::disable);
        http.oauth2ResourceServer(request -> request.jwt(jwtConfigurer -> jwtConfigurer.decoder(jwtDecoder())));
        http.csrf(AbstractHttpConfigurer::disable);

//        http.cors(AbstractHttpConfigurer::disable);
//        http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
//        http.securityContext(securityContext -> securityContext.requireExplicitSave(false));
//        http.requestCache(AbstractHttpConfigurer::disable);

        return http.build();
    }

    @Bean
    JwtDecoder jwtDecoder() {
        SecretKeySpec secretKeySpec = new SecretKeySpec(KEY_SIGN.getBytes(), "HmacSHA256");
        return NimbusJwtDecoder.withSecretKey(secretKeySpec)
                .macAlgorithm(MacAlgorithm.HS256)
                .build();
    }
    @Bean
        // chuyen SCOPE -> ROLE
    JwtAuthenticationConverter jwtAuthenticationConverter(){
        JwtGrantedAuthoritiesConverter grantedConverter = new JwtGrantedAuthoritiesConverter();
        grantedConverter.setAuthorityPrefix("ROLE_");
        JwtAuthenticationConverter authenConverter = new JwtAuthenticationConverter();
        authenConverter.setJwtGrantedAuthoritiesConverter(grantedConverter);
        return authenConverter;
    }
}
