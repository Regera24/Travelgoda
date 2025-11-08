package group4.project.travelgoda.repository.impl;

import group4.project.travelgoda.entity.User;
import group4.project.travelgoda.repository.UserRepositoryCustom;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
@Transactional
public class UserRepositoryImpl implements UserRepositoryCustom {
    
    @PersistenceContext
    private EntityManager entityManager;
    
    @Override
    public List<User> findUsersByRole(User.UserRole role) {
        String jpql = "SELECT u FROM User u WHERE u.role = :role";
        TypedQuery<User> query = entityManager.createQuery(jpql, User.class);
        query.setParameter("role", role);
        return query.getResultList();
    }
    
    @Override
    public List<User> findActiveUsersByRole(User.UserRole role) {
        String jpql = "SELECT u FROM User u WHERE u.role = :role AND u.status = :status";
        TypedQuery<User> query = entityManager.createQuery(jpql, User.class);
        query.setParameter("role", role);
        query.setParameter("status", User.UserStatus.ACTIVE);
        return query.getResultList();
    }
    
    @Override
    public void updateUserStatus(Long userId, User.UserStatus status) {
        String jpql = "UPDATE User u SET u.status = :status WHERE u.id = :userId";
        entityManager.createQuery(jpql)
                .setParameter("status", status)
                .setParameter("userId", userId)
                .executeUpdate();
    }
}
