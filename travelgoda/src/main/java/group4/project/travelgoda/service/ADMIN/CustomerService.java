package group4.project.travelgoda.service.ADMIN;


import group4.project.travelgoda.dto.userDTO.UserDTO;
import group4.project.travelgoda.entity.User;

import java.util.List;

public interface CustomerService {

    List<UserDTO> findAll();
    UserDTO findById(Long id);
    UserDTO update(Long id,UserDTO userDTO);
    UserDTO delete(Long id);



}
