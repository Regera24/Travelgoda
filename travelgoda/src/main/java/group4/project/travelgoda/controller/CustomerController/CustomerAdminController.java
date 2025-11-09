package group4.project.travelgoda.controller.CustomerController;

import group4.project.travelgoda.dto.userDTO.UserDTO;
import group4.project.travelgoda.service.ADMIN.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
public class CustomerAdminController {

    private final CustomerService customerService;

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAll() {
        return ResponseEntity.ok(customerService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getById(@PathVariable Long id) {
        UserDTO dto = customerService.findById(id);
        return (dto == null) ? ResponseEntity.notFound().build() : ResponseEntity.ok(dto);
    }


    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> update(
            @PathVariable Long id,
            @RequestBody UserDTO userDTO
    ) {
        UserDTO updated = customerService.update(id, userDTO);
        return (updated == null) ? ResponseEntity.notFound().build() : ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<UserDTO> delete(@PathVariable Long id) {
        UserDTO deleted = customerService.delete(id);
        return (deleted == null) ? ResponseEntity.notFound().build() : ResponseEntity.ok(deleted);
    }
}
