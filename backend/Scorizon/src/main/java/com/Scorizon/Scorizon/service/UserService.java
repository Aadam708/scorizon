package com.Scorizon.Scorizon.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.Scorizon.Scorizon.entity.User;
import com.Scorizon.Scorizon.repository.UserRepository;


@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User register(User user){

        //hashing password

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String password_hash = encoder.encode(user.getPassword());

        user.setPassword_hash(password_hash); //storing the hashed password in user

        //saves the user into user repository and checks if it exists
        return userRepository.save(user);

    }

    public User login(String email, String rawPassword){

        User user = userRepository.findByEmail(email);

        if(user != null){

            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

            if(encoder.matches(rawPassword, user.getPassword_hash())){
                return user;
            }
        }

        return null;
    }



}
