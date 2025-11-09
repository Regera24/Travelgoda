package group4.project.travelgoda.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AuthenticationRequest {
    @NotNull
    private String username;
    @NotNull
    private String password;
}
