package group4.project.travelgoda.dto.userDTO;


import group4.project.travelgoda.entity.User;
import lombok.*;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@Data
@Getter
@Setter
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private User.UserStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
