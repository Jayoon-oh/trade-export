package com.tradeexport.backend.auth;

public record LoginResponseDto(String token, String name, String role) {}