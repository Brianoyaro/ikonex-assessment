package com.studentmanagementsystem.ikonex.auth.service;

import com.studentmanagementsystem.ikonex.auth.dto.AuthResponse;
import com.studentmanagementsystem.ikonex.auth.dto.LoginRequest;
import com.studentmanagementsystem.ikonex.auth.dto.RegisterRequest;
import com.studentmanagementsystem.ikonex.auth.entity.Role;
import com.studentmanagementsystem.ikonex.auth.entity.User;
import com.studentmanagementsystem.ikonex.auth.repository.UserRepository;
import com.studentmanagementsystem.ikonex.auth.security.CustomUserDetails;
import com.studentmanagementsystem.ikonex.auth.security.JwtProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;
    private final PasswordEncoder passwordEncoder;

    public AuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        String token = jwtProvider.generateToken(authentication);
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        return AuthResponse.builder()
                .token(token)
                .id(userDetails.getId())
                .email(userDetails.getUsername())
                .firstName(userDetails.getFirstName())
                .lastName(userDetails.getLastName())
                .role(userDetails.getRole())
                .build();
    }

    public AuthResponse register(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Only ADMIN role can create other admin accounts; default to STUDENT
        Role role = Role.STUDENT;
        if (registerRequest.getRole() != null && registerRequest.getRole().equals("TEACHER")) {
            role = Role.TEACHER;
        }

        User user = User.builder()
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .firstName(registerRequest.getFirstName())
                .lastName(registerRequest.getLastName())
                .role(role)
                .isActive(true)
                .build();

        User savedUser = userRepository.save(user);

        // Generate token for the new user
        String token = jwtProvider.generateTokenFromEmail(savedUser.getEmail());

        return AuthResponse.builder()
                .token(token)
                .id(savedUser.getId())
                .email(savedUser.getEmail())
                .firstName(savedUser.getFirstName())
                .lastName(savedUser.getLastName())
                .role(savedUser.getRole().toString())
                .build();
    }
}
