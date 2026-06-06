package com.studentmanagementsystem.ikonex.auth.controller;

import com.studentmanagementsystem.ikonex.auth.dto.AuthResponse;
import com.studentmanagementsystem.ikonex.auth.dto.LoginRequest;
import com.studentmanagementsystem.ikonex.auth.dto.RegisterRequest;
import com.studentmanagementsystem.ikonex.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            AuthResponse response = authService.login(loginRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Login failed: {}", e.getMessage());
            throw new RuntimeException("Invalid email or password");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            AuthResponse response = authService.register(registerRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            log.error("Registration failed: {}", e.getMessage());
            throw new RuntimeException("Registration failed: " + e.getMessage());
        }
    }
}
