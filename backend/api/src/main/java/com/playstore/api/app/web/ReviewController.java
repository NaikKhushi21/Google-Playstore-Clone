package com.playstore.api.app.web;

import com.playstore.api.app.dto.ReviewDto;
import com.playstore.api.app.dto.ReviewRequest;
import com.playstore.api.app.repo.ReviewRepository;
import com.playstore.api.app.service.ReviewService;
import com.playstore.api.user.repo.UserRepository;
import jakarta.validation.Valid;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/apps/{appId}/reviews")
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final ReviewService reviewService;
    private final UserRepository userRepository;

    public ReviewController(ReviewRepository reviewRepository, ReviewService reviewService, UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.reviewService = reviewService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<ReviewDto> list(@PathVariable Long appId) {
        return reviewRepository.findByApp_IdOrderByCreatedAtDesc(appId).stream()
            .map(review -> new ReviewDto(
                review.getId(),
                review.getRating(),
                review.getComment(),
                userRepository.findById(review.getUserId()).map(u -> u.getEmail()).orElse("Unknown"),
                review.getCreatedAt()
            ))
            .toList();
    }

    @PostMapping
    public ReviewDto upsert(@PathVariable Long appId, @Valid @RequestBody ReviewRequest req) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        var review = reviewService.upsertReview(appId, email, req.rating(), req.comment());
        var authorEmail = userRepository.findById(review.getUserId()).map(u -> u.getEmail()).orElse("Unknown");
        return new ReviewDto(review.getId(), review.getRating(), review.getComment(), authorEmail, review.getCreatedAt());
    }
}
