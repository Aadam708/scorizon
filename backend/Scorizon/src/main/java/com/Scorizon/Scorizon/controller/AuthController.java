package com.Scorizon.Scorizon.controller;

import com.Scorizon.Scorizon.dto.UserDto;
import com.Scorizon.Scorizon.entity.User;
import com.Scorizon.Scorizon.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000") //next js frontend link

public class AuthController {
    @Autowired
    private UserService userService;


    //register endpoint
    @PostMapping("/register")
    public UserDto register(@RequestBody User user){

        return userService.register(user);
    }


    //login endpoint
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user){

        UserDto foundUser = userService.login(user.getEmail(),user.getPassword());

        if(foundUser != null){
            return ResponseEntity.ok(foundUser);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid login credentials");
    }


}
