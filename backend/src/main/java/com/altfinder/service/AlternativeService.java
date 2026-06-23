package com.altfinder.service;

import com.altfinder.entity.AlternativeComparison;
import com.altfinder.repository.AlternativeComparisonRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AlternativeService {

    @Autowired
    private AlternativeComparisonRepository comparisonRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private GeminiClient geminiClient;


    @Cacheable(value = "alternativesList")
    public List<AlternativeComparison> search(String query, String category) {
        System.out.println("Fetching comparisons from database (Cache Miss). Query: '" + query + "', Category: '" + category + "'");
        
        boolean hasQuery = (query != null && !query.trim().isEmpty());
        boolean hasCategory = (category != null && !category.trim().isEmpty() && !"all".equalsIgnoreCase(category));

        if (hasQuery && hasCategory) {
            return comparisonRepository.searchSoftwareByCategory(query.trim(), category.trim());
        } else if (hasQuery) {
            return comparisonRepository.searchSoftware(query.trim());
        } else if (hasCategory) {
            return comparisonRepository.findByCategoryIgnoreCase(category.trim());
        }
        
        return comparisonRepository.findAll();
    }

    @Cacheable(value = "alternativeDetails", key = "#slug")
    public Optional<AlternativeComparison> findBySlug(String slug) {
        System.out.println("Fetching comparison details from database (Cache Miss) for slug: " + slug);
        return comparisonRepository.findBySlug(slug);
    }

    public List<String> getAllCategories() {
        return comparisonRepository.findDistinctCategories();
    }

    @CacheEvict(value = {"alternativesList", "alternativeDetails"}, allEntries = true)
    public AlternativeComparison save(AlternativeComparison comparison) {
        System.out.println("Saving comparison and invalidating caches: " + comparison.getSlug());
        return comparisonRepository.save(comparison);
    }

    @CacheEvict(value = {"alternativesList", "alternativeDetails"}, allEntries = true)
    public AlternativeComparison generateAndSave(String softwareName) throws Exception {
        String jsonResponse = geminiClient.generateAlternativeComparison(softwareName);
        AlternativeComparison comparison = objectMapper.readValue(jsonResponse, AlternativeComparison.class);
        
        // Ensure valid slug format
        if (comparison.getSlug() == null || comparison.getSlug().trim().isEmpty()) {
            String cleanSlug = (comparison.getCommercialName() + "-vs-" + comparison.getAlternativeName())
                    .toLowerCase()
                    .replaceAll("[^a-z0-9\\-]+", "-")
                    .replaceAll("-+", "-");
            comparison.setSlug(cleanSlug);
        }
        
        System.out.println("Generated new comparison via Gemini: " + comparison.getSlug());
        return comparisonRepository.save(comparison);
    }
}
