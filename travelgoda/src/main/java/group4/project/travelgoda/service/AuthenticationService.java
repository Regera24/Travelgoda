package group4.project.travelgoda.service;

import group4.project.travelgoda.dto.request.AccountCreationRequest;
import group4.project.travelgoda.dto.request.AuthenticationRequest;
import group4.project.travelgoda.dto.request.LogoutRequest;
import group4.project.travelgoda.dto.response.AuthenticationResponse;
import org.springframework.stereotype.Service;

import java.text.ParseException;

@Service
public interface AuthenticationService {
    public AuthenticationResponse authenticate(AuthenticationRequest authenticationRequest);
    public void createAccount(AccountCreationRequest request);
    public void logout(LogoutRequest logoutRequest);
}
