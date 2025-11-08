package group4.project.travelgoda.repository;

import group4.project.travelgoda.entity.Customer;

import java.util.List;

public interface CustomerRepositoryCustom {
    
    void updateLoyaltyPoints(Long customerId, Integer points);
    
    List<Customer> findTopCustomersByLoyaltyPoints(int limit);
}
