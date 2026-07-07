package com.hackathon.ETimes.auth.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
    String fullName;
    String email;
    String password;
}
