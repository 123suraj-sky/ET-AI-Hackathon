package com.hackathon.ETimes.auth.service.impl;

import com.hackathon.ETimes.auth.dto.AuthResponse;
import com.hackathon.ETimes.auth.dto.LoginRequest;
import com.hackathon.ETimes.auth.dto.RegisterRequest;
import com.hackathon.ETimes.auth.service.AuthService;
import com.hackathon.ETimes.security.JwtService;
import com.hackathon.ETimes.user.entity.Role;
import com.hackathon.ETimes.user.entity.User;
import com.hackathon.ETimes.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private  final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    @Override
    public AuthResponse register(RegisterRequest request) {

        if(userRepository.existsByEmail(request.getEmail())){
            throw new RuntimeException("Email already exists");
        }


        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();

        userRepository.save(user);
        return new AuthResponse("User registered successfully");
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        System.out.println("Entered Password : " + request.getPassword());
        System.out.println("Stored Password  : " + user.getPassword());

        if(!passwordEncoder.matches(request.getPassword(), user.getPassword()))
            throw new RuntimeException("Invalid credentials");

        String token = jwtService.generateToken(user.getEmail());
        return new AuthResponse(token);
    }
}
