package com.tradeexport.backend.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

// generating token & validation

@Component
public class JwtUtil {
    // generate token

    @Value("${jwt.secret}")
    private String secretKeyString;

    private SecretKey key;
    private final long EXPIRATION_MS = 1000 * 60 * 60 * 24; // 24hours

    private SecretKey getKey() {
        if (key == null) {
            key = Keys.hmacShaKeyFor(secretKeyString.getBytes(StandardCharsets.UTF_8));
        }
        return key;
    }

    public String generateToken(String username, String role) {
        return Jwts.builder()
                .subject(username)
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
                .signWith(getKey())
                .compact();
    }

    public String extractUsername(String token) {
        return Jwts.parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().verifyWith(getKey()).build().parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}