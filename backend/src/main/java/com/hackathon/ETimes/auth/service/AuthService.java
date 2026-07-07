package com.hackathon.ETimes.auth.service;

import com.hackathon.ETimes.auth.dto.AuthResponse;
import com.hackathon.ETimes.auth.dto.LoginRequest;
import com.hackathon.ETimes.auth.dto.RegisterRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);

}
