package org.victor.server.shared;

public class Constants {
    public static final String OPTIONS_HTTP_METHOD = "options";
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String AUTHORITIES = "authorities";
    public static final long JWT_EXPIRATION_2WEEKS = 14 * 86400000L;
    public static final long JWT_EXPIRATION_1DAY = 86400000L;
    public static final String TOKEN_UNVERIFIABLE = "Token cannot be verified.";
    public static final String[] PUBLIC_URLS = {
            "/api/v1/signup",
            "/api/v1/login",
            "/api/v1/verify-email/**",
            "/api/v1/forgot-password",
            "/api/v1/reset-password/**",
            "/images/**",
            "/uploads/**"
    };

    public static final String ACCESS_DENIED = "Access Denied!";
    public static final String FORBIDDEN = "Access is Forbidden!";
}
