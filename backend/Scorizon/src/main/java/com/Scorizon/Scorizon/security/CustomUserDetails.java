package com.Scorizon.Scorizon.security;

import java.util.Collection;
import java.util.Collections;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.Scorizon.Scorizon.entity.User;

public class CustomUserDetails implements UserDetails {

    private final Long id;
    private final String username;
    private final String password;
    private final String email;

    public CustomUserDetails(User user) {
        this.id = user.getUserId();
        this.username = user.getUsername();
        this.password = user.getPassword_hash();
        this.email = user.getEmail();
    }


    @Override
    public String getPassword() {

        return this.password;
    }

    @Override
    public String getUsername() {
        return this.username;
    }

    public Long getId(){

        return this.id;
    }

    public String getEmail(){
        return this.email;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.emptyList();
    }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return true; }



}
