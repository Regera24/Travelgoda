package group4.project.travelgoda.repository;

import group4.project.travelgoda.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long>, CustomerRepositoryCustom {
    
    Optional<Customer> findByUserEmail(String email);
}
