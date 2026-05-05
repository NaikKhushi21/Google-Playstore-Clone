package com.playstore.api.app.service;

import com.playstore.api.app.domain.AppEntity;
import com.playstore.api.app.domain.Review;
import com.playstore.api.app.repo.AppRepository;
import com.playstore.api.app.repo.ReviewRepository;
import com.playstore.api.user.repo.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final AppRepository appRepository;
    private final UserRepository userRepository;

    public ReviewService(ReviewRepository reviewRepository, AppRepository appRepository, UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.appRepository = appRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Review upsertReview(Long appId, String userEmail, int rating, String comment) {
        var user = userRepository.findByEmail(userEmail).orElseThrow();
        AppEntity app = appRepository.findById(appId).orElseThrow();

        Review review = reviewRepository.findByApp_IdAndUserId(appId, user.getId())
            .orElseGet(Review::new);

        review.setApp(app);
        review.setUserId(user.getId());
        review.setRating(rating);
        review.setComment(comment);
        review.setCreatedAt(OffsetDateTime.now());
        reviewRepository.save(review);

        recalcRatings(app);
        return review;
    }

    @Transactional
    public void recalcRatings(AppEntity app) {
        Long appId = app.getId();
        long count = reviewRepository.countByApp_Id(appId);
        Double avg = reviewRepository.averageRating(appId);
        app.setRatingCount(count);
        app.setRatingAvg(avg == null ? 0.0 : avg);
        appRepository.save(app);
    }
}
