package group4.project.travelgoda.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import javax.crypto.spec.SecretKeySpec;

@Configuration
public class SecurityConfig {
    private static final String[] PUBLIC_APIS = {
            "/admin/tour/list",
            "/admin/**",
            "/users/**",
            "/auth/**",
            "/tours/**",
    };

    private static final String[] ADMIN_APIS = {
    };

    private static final String[] USER_APIS = {,
    };

    @Value("${app.jwtSecret}")
    private String jwtSecret;

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.addAllowedOriginPattern("http://localhost:5173");
        corsConfiguration.addAllowedMethod("*");
        corsConfiguration.addAllowedHeader("*");
        corsConfiguration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration);

        return new CorsFilter(source);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(request -> request.requestMatchers(PUBLIC_APIS)
                .permitAll()
                .requestMatchers(ADMIN_APIS)
                .hasAuthority("ROLE_ADMIN")
                .requestMatchers(USER_APIS)
                .hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")
                .anyRequest()
                .authenticated());

        http.csrf(AbstractHttpConfigurer::disable);
        http.cors(corsConfigurer -> corsConfigurer.configurationSource(corsConfigurationSource()));

        http.oauth2ResourceServer(oath2 -> oath2.jwt(jwtConfigurer ->
                jwtConfigurer.decoder(jwtDecoder()).jwtAuthenticationConverter(jwtAuthenticationConverter())));

        return http.build();
    }

    private UrlBasedCorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOriginPattern("http://localhost:5173");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    JwtDecoder jwtDecoder() {
        SecretKeySpec secretKeySpec = new SecretKeySpec(jwtSecret.getBytes(), "HS512");
        return NimbusJwtDecoder.withSecretKey(secretKeySpec)
                .macAlgorithm(MacAlgorithm.HS512)
                .build();
    }

    @Bean
    JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter converter = new JwtGrantedAuthoritiesConverter();
        converter.setAuthorityPrefix("ROLE_");
        converter.setAuthoritiesClaimName("scope");

        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(converter);
        return jwtAuthenticationConverter;
    }
}

