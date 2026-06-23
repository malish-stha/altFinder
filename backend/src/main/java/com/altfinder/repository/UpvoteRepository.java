package com.altfinder.repository;

import com.altfinder.entity.Upvote;
import com.altfinder.entity.UpvoteId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UpvoteRepository extends JpaRepository<Upvote, UpvoteId> {
    Optional<Upvote> findByUserIdAndSlug(String userId, String slug);
    boolean existsByUserIdAndSlug(String userId, String slug);
    void deleteByUserIdAndSlug(String userId, String slug);
}
