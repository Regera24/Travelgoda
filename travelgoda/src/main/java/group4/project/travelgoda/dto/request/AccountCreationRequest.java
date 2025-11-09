package group4.project.travelgoda.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@Getter
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AccountCreationRequest {
    @NotNull
    String username;

    @NotNull
    String password;

    @Email
    String email;

    @NotNull
    String role;
}
