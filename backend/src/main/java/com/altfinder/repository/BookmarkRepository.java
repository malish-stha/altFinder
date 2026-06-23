package com.altfinder.repository;

import com.altfinder.entity.Bookmark;
import com.altfinder.entity.BookmarkId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, BookmarkId> {
    Optional<Bookmark> findByUserIdAndSlug(String userId, String slug);
    boolean existsByUserIdAndSlug(String userId, String slug);
    void deleteByUserIdAndSlug(String userId, String slug);
    List<Bookmark> findByUserId(String userId);
}
