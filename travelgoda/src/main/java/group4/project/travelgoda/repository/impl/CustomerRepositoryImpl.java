package group4.project.travelgoda.repository.impl;

import group4.project.travelgoda.entity.Customer;
import group4.project.travelgoda.repository.CustomerRepositoryCustom;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
@Transactional
public class CustomerRepositoryImpl implements CustomerRepositoryCustom {
    
    @PersistenceContext
    private EntityManager entityManager;
    
    @Override
    public void updateLoyaltyPoints(Long customerId, Integer points) {
        String jpql = "UPDATE Customer c SET c.loyaltyPoints = c.loyaltyPoints + :points WHERE c.userId = :customerId";
        entityManager.createQuery(jpql)
                .setParameter("points", points)
                .setParameter("customerId", customerId)
                .executeUpdate();
    }
    
    @Override
    public List<Customer> findTopCustomersByLoyaltyPoints(int limit) {
        String jpql = "SELECT c FROM Customer c ORDER BY c.loyaltyPoints DESC";
        TypedQuery<Customer> query = entityManager.createQuery(jpql, Customer.class);
        query.setMaxResults(limit);
        return query.getResultList();
    }
}
