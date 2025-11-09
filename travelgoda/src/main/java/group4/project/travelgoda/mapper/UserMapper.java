package group4.project.travelgoda.mapper;

import group4.project.travelgoda.dto.userDTO.UserDTO;
import group4.project.travelgoda.entity.User;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserMapper {
    private final ModelMapper mapper;

    public UserDTO toDTO(User user) {
        if (user == null) return null;

        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setStatus(user.getStatus());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        return dto;
    }

    // ✅ DTO → Entity (dùng khi tạo mới user)
    public User toEntity(UserDTO dto) {
        if (dto == null) return null;

        User user = new User();
        user.setId(dto.getId()); // có thể bỏ qua nếu tạo mới
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setStatus(dto.getStatus());
        return user;
    }
}
