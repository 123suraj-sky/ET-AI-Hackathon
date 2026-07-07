package com.hackathon.ETimes.auth.controller;

import com.hackathon.ETimes.auth.dto.AuthResponse;
import com.hackathon.ETimes.auth.dto.LoginRequest;
import com.hackathon.ETimes.auth.dto.RegisterRequest;
import com.hackathon.ETimes.auth.service.AuthService;

import com.hackathon.ETimes.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}
