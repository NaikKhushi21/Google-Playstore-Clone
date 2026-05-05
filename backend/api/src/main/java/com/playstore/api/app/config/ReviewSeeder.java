package com.playstore.api.app.config;

import com.playstore.api.app.repo.AppRepository;
import com.playstore.api.app.repo.ReviewRepository;
import com.playstore.api.app.service.ReviewService;
import com.playstore.api.user.repo.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

import java.util.List;

@Configuration
public class ReviewSeeder {

    private static final List<String> COMMENTS = List.of(
        "Smooth experience and clean UI.",
        "Solid app, does what it promises.",
        "Fun to play, could use more levels.",
        "Great concept and responsive controls.",
        "Surprisingly addictive and polished."
    );

    @Bean
    @Order(3)
    CommandLineRunner seedReviews(
        AppRepository appRepository,
        ReviewRepository reviewRepository,
        ReviewService reviewService,
        UserRepository userRepository
    ) {
        return args -> {
            if (reviewRepository.count() > 0) return;
            var demoUser = userRepository.findByEmail("demo@local.test");
            if (demoUser.isEmpty()) return;

            var apps = appRepository.findAll();
            for (int i = 0; i < apps.size(); i++) {
                var app = apps.get(i);
                int rating = 3 + (i % 3);
                String comment = COMMENTS.get(i % COMMENTS.size());
                reviewService.upsertReview(app.getId(), demoUser.get().getEmail(), rating, comment);
            }
        };
    }
}
