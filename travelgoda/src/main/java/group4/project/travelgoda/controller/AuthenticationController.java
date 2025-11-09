package group4.project.travelgoda.controller;

import group4.project.travelgoda.dto.request.AccountCreationRequest;
import group4.project.travelgoda.dto.request.AuthenticationRequest;
import group4.project.travelgoda.dto.request.LogoutRequest;
import group4.project.travelgoda.dto.response.ApiResponse;
import group4.project.travelgoda.dto.response.AuthenticationResponse;
import group4.project.travelgoda.service.AuthenticationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthenticationController {
    private final AuthenticationService authenticationService;

    @PostMapping(value = "/login")
    public ApiResponse<AuthenticationResponse> login(@RequestBody @Valid AuthenticationRequest authenticationRequest) {
        AuthenticationResponse authenticationResponse = authenticationService.authenticate(authenticationRequest);
        return ApiResponse.<AuthenticationResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Login successfully")
                .data(authenticationResponse)
                .build();
    }

    @PostMapping(value = "/register")
    public ApiResponse<Void> register(@RequestBody @Valid AccountCreationRequest request) {
        authenticationService.createAccount(request);
        return ApiResponse.<Void>builder()
                .message("Created account successfully")
                .code(HttpStatus.CREATED.value())
                .build();
    }

    @PostMapping(value = "/logout")
    public ApiResponse<Void> logout(@RequestBody @Valid LogoutRequest logoutRequest) {
        authenticationService.logout(logoutRequest);
        return ApiResponse.<Void>builder()
                .message("Logout successfully")
                .code(HttpStatus.OK.value())
                .build();
    }
}
