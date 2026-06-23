package com.altfinder.interceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitingInterceptor implements HandlerInterceptor {

    private final ConcurrentHashMap<String, TokenBucket> publicBuckets = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, TokenBucket> generationBuckets = new ConcurrentHashMap<>();

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String uri = request.getRequestURI();
        String method = request.getMethod();

        // 1. AI Generation endpoint rate limit: 3 requests per hour
        if (uri.startsWith("/api/alternatives/generate") && "POST".equalsIgnoreCase(method)) {
            String clientKey = getClerkUserId();
            if (clientKey == null) {
                clientKey = getClientIp(request);
            }
            
            TokenBucket bucket = generationBuckets.computeIfAbsent(clientKey, k -> new TokenBucket(3, 3600000L)); // Capacity 3, Refill 1 hr
            
            response.setHeader("X-Rate-Limit-Limit", "3");
            long remaining = bucket.getRemainingTokens();
            response.setHeader("X-Rate-Limit-Remaining", String.valueOf(remaining));

            if (!bucket.tryConsume()) {
                sendErrorResponse(response, "Too many AI generation requests. You are limited to 3 requests per hour.");
                return false;
            }
        } else if (uri.startsWith("/api/")) {
            // General API (Search, Category lists, etc.): 60 requests per minute
            String clientKey = getClientIp(request);
            TokenBucket bucket = publicBuckets.computeIfAbsent(clientKey, k -> new TokenBucket(60, 60000L)); // Capacity 60, Refill 1 min
            
            response.setHeader("X-Rate-Limit-Limit", "60");
            long remaining = bucket.getRemainingTokens();
            response.setHeader("X-Rate-Limit-Remaining", String.valueOf(remaining));

            if (!bucket.tryConsume()) {
                sendErrorResponse(response, "Too many requests. You are limited to 60 requests per minute.");
                return false;
            }
        }

        return true;
    }

    private String getClerkUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof Jwt) {
            Jwt jwt = (Jwt) auth.getPrincipal();
            return jwt.getSubject();
        }
        return null;
    }

    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }

    private void sendErrorResponse(HttpServletResponse response, String message) throws Exception {
        response.setStatus(429);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write("{\"error\": \"Too Many Requests\", \"message\": \"" + message + "\"}");
    }

    private static class TokenBucket {
        private final long capacity;
        private final double refillRatePerMs;
        private double tokens;
        private long lastRefillTimestamp;

        public TokenBucket(long capacity, long refillPeriodMs) {
            this.capacity = capacity;
            this.refillRatePerMs = (double) capacity / refillPeriodMs;
            this.tokens = capacity;
            this.lastRefillTimestamp = System.currentTimeMillis();
        }

        public synchronized boolean tryConsume() {
            refill();
            if (tokens >= 1.0) {
                tokens -= 1.0;
                return true;
            }
            return false;
        }

        private void refill() {
            long now = System.currentTimeMillis();
            long elapsedMs = now - lastRefillTimestamp;
            if (elapsedMs > 0) {
                tokens = Math.min(capacity, tokens + (elapsedMs * refillRatePerMs));
                lastRefillTimestamp = now;
            }
        }

        public synchronized long getRemainingTokens() {
            refill();
            return (long) Math.floor(tokens);
        }
    }
}
