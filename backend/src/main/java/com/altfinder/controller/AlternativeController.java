package com.altfinder.controller;

import com.altfinder.entity.AlternativeComparison;
import com.altfinder.service.AlternativeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "${cors.allowed-origins}", allowCredentials = "true")
public class AlternativeController {

    @Autowired
    private AlternativeService alternativeService;

    // Public Endpoint: Search and list software comparisons
    @GetMapping("/alternatives")
    public ResponseEntity<List<AlternativeComparison>> getAlternatives(
            @RequestParam(value = "q", required = false) String query,
            @RequestParam(value = "category", required = false) String category) {
        
        List<AlternativeComparison> results = alternativeService.search(query, category);
        return ResponseEntity.ok(results);
    }

    // Public Endpoint: Get a single comparison details by slug
    @GetMapping("/alternatives/{slug}")
    public ResponseEntity<AlternativeComparison> getAlternativeBySlug(@PathVariable("slug") String slug) {
        Optional<AlternativeComparison> comparison = alternativeService.findBySlug(slug);
        return comparison.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Public Endpoint: Get all unique categories for filtering pills
    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        List<String> categories = alternativeService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    // Protected Endpoint: Generate a new alternative comparison using Gemini AI
    @PostMapping("/alternatives/generate")
    public ResponseEntity<?> generateAlternative(@RequestParam("softwareName") String softwareName) {
        if (softwareName == null || softwareName.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "softwareName parameter is required"));
        }
        try {
            AlternativeComparison result = alternativeService.generateAndSave(softwareName);
            return ResponseEntity.ok(result);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(503).body(Map.of("error", "API Key Misconfiguration", "message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "AI Generation Failed", "message", e.getMessage()));
        }
    }
}
