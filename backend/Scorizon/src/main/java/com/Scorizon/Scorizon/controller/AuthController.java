package com.Scorizon.Scorizon.controller;

import com.Scorizon.Scorizon.dto.UserDto;
import com.Scorizon.Scorizon.entity.User;
import com.Scorizon.Scorizon.security.JwtUtil;
import com.Scorizon.Scorizon.service.UserService;

import jakarta.servlet.http.HttpServletResponse;

import jakarta.servlet.http.Cookie;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000") //next js frontend link

public class AuthController {
    private UserService userService;
    private JwtUtil jwtUtil;


    public AuthController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }


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
            //generating a jwt token when a user logs in
            String jwt = jwtUtil.generateToken(user.getEmail());

            //building a jwt cookie from the token generated
            ResponseCookie jwtCookie = ResponseCookie.from("jwt",jwt)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(60*60)
                .sameSite("Lax")
                .build();


            //returning a status code ok 200 response
            //including the jwt cookie and also the user object returned

            return ResponseEntity.ok()
                .header("Set-Cookie", jwtCookie.toString())
                .body(foundUser);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid login credentials");
    }

    //allowing the user to successfully logout

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        //making a new cookie to set all its values to clear the jwt cookie
        Cookie cookie = new Cookie("jwt", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(true); // set to true in production
        cookie.setPath("/");
        cookie.setMaxAge(0); // Expire immediately
        response.addCookie(cookie);
        return ResponseEntity.ok().body("Logged out");
    }


    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@CookieValue(name="jwt", required=false) String token){

        if(token == null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("NO JWT TOKEN");
        }

        String email = jwtUtil.extractEmail(token);
        UserDto currentUser = userService.findByEmail(email);
        return ResponseEntity.ok(currentUser);
    }


}
