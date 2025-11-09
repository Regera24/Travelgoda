package group4.project.travelgoda.controller.TourAdminController;

import group4.project.travelgoda.dto.tourDTO.TourDTO;
import group4.project.travelgoda.entity.Tour;
import group4.project.travelgoda.service.ADMIN.TourService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/tour")
@RequiredArgsConstructor
public class TourAdminController {

    private final TourService tourService;

    @GetMapping("/list")
    public ResponseEntity<List<TourDTO>> list() {
        return ResponseEntity.ok(tourService.findAll());
    }


    @GetMapping("/{id}")
    public ResponseEntity<TourDTO> getById(@PathVariable Long id) {
        TourDTO dto = tourService.findById(id);
        return (dto == null) ? ResponseEntity.notFound().build() : ResponseEntity.ok(dto);
    }


    @PostMapping("/create")
    public ResponseEntity<TourDTO> create(@RequestBody TourDTO dto) {
        TourDTO created = tourService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }


    @PutMapping("/update/{id}")
    public ResponseEntity<TourDTO> update(@PathVariable Long id, @RequestBody TourDTO dto) {
        if (tourService.findById(id) == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(tourService.update(id, dto));
    }


    @DeleteMapping("/delete")
    public ResponseEntity<TourDTO> delete(@RequestBody TourDTO dto) {
        TourDTO deleted = tourService.delete(dto);
        return ResponseEntity.ok(deleted);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<TourDTO> updateStatus(@PathVariable Long id, @RequestParam("value") String value) {
        TourDTO current = tourService.findById(id);
        if (current == null) return ResponseEntity.notFound().build();
        try {
            current.setStatus(Enum.valueOf(group4.project.travelgoda.entity.Tour.TourStatus.class, value));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(tourService.update(id, current));
    }


    @PatchMapping("/change-status/{id}")
    public ResponseEntity<String> changeStatus(
            @PathVariable Long id,
            @RequestParam("status") String status
    ) {
        try {
            Tour.TourStatus newStatus = Tour.TourStatus.valueOf(status);
            tourService.changeStatus(id, newStatus);
            return ResponseEntity.ok("Cập nhật trạng thái thành công!");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Trạng thái không hợp lệ!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi cập nhật trạng thái tour!");
        }
    }

}
