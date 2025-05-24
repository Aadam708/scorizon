package com.Scorizon.Scorizon.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.Scorizon.Scorizon.entity.User;;


public interface UserRepository extends JpaRepository<User,Long>{
    User findByEmail(String email);

}
