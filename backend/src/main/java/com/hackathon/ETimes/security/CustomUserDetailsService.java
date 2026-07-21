package com.hackathon.ETimes.security;

import com.hackathon.ETimes.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        if ("suraj@gmail.com".equalsIgnoreCase(email)) {
            return org.springframework.security.core.userdetails.User
                    .withUsername("suraj@gmail.com")
                    .password("$2a$10$tMh4jG7f15R/MhTzP4TzxeW6/BohHhGeq7r74G56sEebLzL.79fIe") // Encoded "suraj"
                    .authorities("USER")
                    .build();
        }

        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .authorities(user.getRole().name())
                .build();
    }

}
