package group4.project.travelgoda.repository;

import group4.project.travelgoda.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Long> {
    
    List<Staff> findByDepartment(String department);
    
    List<Staff> findByStaffRole(Staff.StaffRole staffRole);
}
