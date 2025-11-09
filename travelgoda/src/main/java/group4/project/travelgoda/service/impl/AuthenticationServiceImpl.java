package group4.project.travelgoda.service.impl;

import group4.project.travelgoda.dto.request.AccountCreationRequest;
import group4.project.travelgoda.dto.request.AuthenticationRequest;
import group4.project.travelgoda.dto.request.LogoutRequest;
import group4.project.travelgoda.dto.response.AuthenticationResponse;
import group4.project.travelgoda.entity.User;
import group4.project.travelgoda.exception.AppException;
import group4.project.travelgoda.exception.ErrorCode;
import group4.project.travelgoda.repository.UserRepository;
import group4.project.travelgoda.service.AuthenticationService;
import group4.project.travelgoda.utils.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {
    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;

    @Override
    public AuthenticationResponse authenticate(AuthenticationRequest authenticationRequest) {
        User user = userRepository.findByUsername(authenticationRequest.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        AuthenticationResponse authenticationResponse = new AuthenticationResponse();
        if(user == null || !user.getStatus().toString().equals("ACTIVE") || !user.getPassword().equals(authenticationRequest.getPassword())) {
            authenticationResponse.setSuccess(false);
        }else{
            String token = jwtUtils.generateToken(user);
            authenticationResponse.setToken(token);
            authenticationResponse.setSuccess(true);
        }
        return authenticationResponse;
    }

    @Override
    public void createAccount(AccountCreationRequest request) {
        User user = User.builder()
                .email(request.getEmail())
                .role(User.UserRole.valueOf(request.getRole()))
                .password(request.getPassword())
                .username(request.getUsername())
                .status(User.UserStatus.valueOf("ACTIVE"))
                .build();

        if(userRepository.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.USERNAME_EXISTED);
        }
        if(userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }

        userRepository.save(user);
    }

    @Override
    public void logout(LogoutRequest logoutRequest) {

    }
}
