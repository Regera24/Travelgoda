package group4.project.travelgoda.repository;

import group4.project.travelgoda.entity.User;

import java.util.List;

public interface UserRepositoryCustom {
    
    List<User> findUsersByRole(User.UserRole role);
    
    List<User> findActiveUsersByRole(User.UserRole role);
    
    void updateUserStatus(Long userId, User.UserStatus status);
}
