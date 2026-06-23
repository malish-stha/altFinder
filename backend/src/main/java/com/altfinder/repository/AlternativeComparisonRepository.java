package com.altfinder.repository;

import com.altfinder.entity.AlternativeComparison;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AlternativeComparisonRepository extends JpaRepository<AlternativeComparison, String> {

    Optional<AlternativeComparison> findBySlug(String slug);

    List<AlternativeComparison> findByCategoryIgnoreCase(String category);

    @Query("SELECT DISTINCT a.category FROM AlternativeComparison a ORDER BY a.category ASC")
    List<String> findDistinctCategories();

    @Query("SELECT a FROM AlternativeComparison a WHERE " +
           "LOWER(a.commercialName) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(a.alternativeName) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(a.category) LIKE LOWER(CONCAT('%', :q, '%')) ORDER BY a.upvoteCount DESC")
    List<AlternativeComparison> searchSoftware(@Param("q") String query);

    @Query("SELECT a FROM AlternativeComparison a WHERE " +
           "(LOWER(a.commercialName) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(a.alternativeName) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(a.category) LIKE LOWER(CONCAT('%', :q, '%'))) AND " +
           "LOWER(a.category) = LOWER(:category) ORDER BY a.upvoteCount DESC")
    List<AlternativeComparison> searchSoftwareByCategory(@Param("q") String query, @Param("category") String category);
}
