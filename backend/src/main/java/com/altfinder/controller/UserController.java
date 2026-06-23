package com.altfinder.controller;

import com.altfinder.entity.AlternativeComparison;
import com.altfinder.entity.Bookmark;
import com.altfinder.entity.Upvote;
import com.altfinder.repository.AlternativeComparisonRepository;
import com.altfinder.repository.BookmarkRepository;
import com.altfinder.repository.UpvoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserController {

    @Autowired
    private AlternativeComparisonRepository comparisonRepository;

    @Autowired
    private UpvoteRepository upvoteRepository;

    @Autowired
    private BookmarkRepository bookmarkRepository;

    // Helper: Extract Clerk User ID from token
    private String getClerkUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof Jwt) {
            Jwt jwt = (Jwt) auth.getPrincipal();
            return jwt.getSubject();
        }
        return null;
    }

    // Protected Endpoint: Toggle Upvote for software comparison
    @PostMapping("/alternatives/{slug}/upvote")
    @CacheEvict(value = {"alternativesList", "alternativeDetails"}, allEntries = true)
    public ResponseEntity<?> toggleUpvote(@PathVariable("slug") String slug) {
        String userId = getClerkUserId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized access"));
        }

        Optional<AlternativeComparison> comparisonOpt = comparisonRepository.findBySlug(slug);
        if (comparisonOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        AlternativeComparison comparison = comparisonOpt.get();
        boolean exists = upvoteRepository.existsByUserIdAndSlug(userId, slug);
        Map<String, Object> response = new HashMap<>();

        if (exists) {
            // Remove upvote
            upvoteRepository.deleteByUserIdAndSlug(userId, slug);
            comparison.setUpvoteCount(Math.max(0, comparison.getUpvoteCount() - 1));
            response.put("action", "removed");
        } else {
            // Add upvote
            upvoteRepository.save(new Upvote(userId, slug));
            comparison.setUpvoteCount(comparison.getUpvoteCount() + 1);
            response.put("action", "added");
        }

        comparisonRepository.save(comparison);
        response.put("upvoteCount", comparison.getUpvoteCount());
        return ResponseEntity.ok(response);
    }

    // Protected Endpoint: Toggle Bookmark for software comparison
    @PostMapping("/alternatives/{slug}/bookmark")
    public ResponseEntity<?> toggleBookmark(@PathVariable("slug") String slug) {
        String userId = getClerkUserId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized access"));
        }

        Optional<AlternativeComparison> comparisonOpt = comparisonRepository.findBySlug(slug);
        if (comparisonOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        boolean exists = bookmarkRepository.existsByUserIdAndSlug(userId, slug);
        Map<String, Object> response = new HashMap<>();

        if (exists) {
            bookmarkRepository.deleteByUserIdAndSlug(userId, slug);
            response.put("action", "removed");
        } else {
            bookmarkRepository.save(new Bookmark(userId, slug));
            response.put("action", "added");
        }

        return ResponseEntity.ok(response);
    }

    // Protected Endpoint: Get all comparisons bookmarked by active user
    @GetMapping("/users/me/bookmarks")
    public ResponseEntity<?> getMyBookmarks() {
        String userId = getClerkUserId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized access"));
        }

        List<Bookmark> bookmarks = bookmarkRepository.findByUserId(userId);
        List<String> slugs = bookmarks.stream().map(Bookmark::getSlug).collect(Collectors.toList());

        List<AlternativeComparison> comparisons = comparisonRepository.findAllById(slugs);
        return ResponseEntity.ok(comparisons);
    }
}
