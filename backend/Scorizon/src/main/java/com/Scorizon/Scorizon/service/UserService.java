package com.Scorizon.Scorizon.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.Scorizon.Scorizon.dto.UserDto;
import com.Scorizon.Scorizon.entity.User;
import com.Scorizon.Scorizon.repository.UserRepository;


@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;


    public UserDto toDto(User user){

        UserDto dto = new UserDto();

        dto.setUser_id(user.getUser_id());
        dto.setFirst_name(user.getFirst_name());
        dto.setLast_name(user.getLast_name());
        dto.setEmail(user.getEmail());
        dto.setUsername(user.getUsername());

        return dto;
    }

    public UserDto register(User user){

        //hashing password

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String password_hash = encoder.encode(user.getPassword());

        user.setPassword_hash(password_hash); //storing the hashed password in user

        //saves the user into user repository and checks if it exists
        User savedUser = userRepository.save(user);
        return toDto(savedUser);

    }

    public UserDto login(String email, String rawPassword){

        User user = userRepository.findByEmail(email);

        if(user != null){

            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

            if(encoder.matches(rawPassword, user.getPassword_hash())){
                return toDto(user);
            }
        }

        return null;
    }



}
