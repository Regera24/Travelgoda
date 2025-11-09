package group4.project.travelgoda.service.ADMIN;


import group4.project.travelgoda.dto.userDTO.UserDTO;

import java.util.List;

public interface CustomerAdminService {

    List<UserDTO> findAll();
    UserDTO findById(Long id);
    UserDTO update(Long id,UserDTO userDTO);
    UserDTO delete(Long id);



}
