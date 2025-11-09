package group4.project.travelgoda.service.ADMIN.impl;

import group4.project.travelgoda.dto.userDTO.UserDTO;
import group4.project.travelgoda.entity.User;
import group4.project.travelgoda.mapper.UserMapper;
import group4.project.travelgoda.repository.UserRepository;
import group4.project.travelgoda.service.ADMIN.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final UserRepository userRepository;
    private final UserMapper mapper;


    @Override
    public List<UserDTO> findAll() {
        return userRepository.findAll().stream().map(mapper::toDTO).collect(Collectors.toList());
    }

    @Override
    public UserDTO findById(Long id) {
        return userRepository.findById(id)
                .map(mapper::toDTO)
                .orElse(null);
    }



    @Override
    public UserDTO update(Long id, UserDTO userDTO) {
        if (id == null || userDTO == null) return null;

        User existing = userRepository.findById(id).orElse(null);
        if (existing == null) return null;
        existing.setUsername(userDTO.getUsername());
        existing.setEmail(userDTO.getEmail());
        existing.setStatus(userDTO.getStatus());
        existing.setUpdatedAt(LocalDateTime.now());
        User saved = userRepository.save(existing);
        return mapper.toDTO(saved);
    }

    @Override
    public UserDTO delete(Long id) {
        if (id == null) return null;

        User existing = userRepository.findById(id).orElse(null);
        if (existing == null) return null;

        // Soft-delete: chuyển trạng thái sang DELETED
        existing.setStatus(User.UserStatus.DELETED);

        User saved = userRepository.save(existing);
        return mapper.toDTO(saved);
    }

}
