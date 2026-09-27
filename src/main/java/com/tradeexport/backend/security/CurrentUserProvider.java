package com.tradeexport.backend.security;

import com.tradeexport.backend.user.User;
import com.tradeexport.backend.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

// adapt User object -> order & quotation service

@Component
@RequiredArgsConstructor
public class CurrentUserProvider {

    private final UserRepository userRepository;

    public User getCurrentUser () {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(()-> new IllegalArgumentException("로그인 정보가 유효하지 않습니다."));
    }
}
