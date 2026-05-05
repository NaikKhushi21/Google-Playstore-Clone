package com.playstore.api.app.repo;

import com.playstore.api.app.domain.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByApp_IdOrderByCreatedAtDesc(Long appId);
    Optional<Review> findByApp_IdAndUserId(Long appId, Long userId);
    long countByApp_Id(Long appId);

    @Query("select avg(r.rating) from Review r where r.app.id = :appId")
    Double averageRating(@Param("appId") Long appId);
}
