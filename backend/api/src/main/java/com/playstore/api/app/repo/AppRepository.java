package com.playstore.api.app.repo;

import com.playstore.api.app.domain.AppEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;

import java.util.Optional;

public interface AppRepository extends JpaRepository<AppEntity, Long> {

    @Override
    @EntityGraph(attributePaths = "categories")
    Page<AppEntity> findAll(Pageable pageable);

    @EntityGraph(attributePaths = "categories")
    Page<AppEntity> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String name, String description, Pageable pageable);

    @EntityGraph(attributePaths = "categories")
    Page<AppEntity> findByCategories_SlugIgnoreCase(String slug, Pageable pageable);

    @EntityGraph(attributePaths = "categories")
    Page<AppEntity> findByCategories_SlugIgnoreCaseAndNameContainingIgnoreCaseOrCategories_SlugIgnoreCaseAndDescriptionContainingIgnoreCase(
        String slug1, String name, String slug2, String description, Pageable pageable
    );

    @EntityGraph(attributePaths = "categories")
    Optional<AppEntity> findById(Long id);
}
