package com.playstore.api.app.web;

import com.playstore.api.app.domain.AppEntity;
import com.playstore.api.app.dto.AppDetailsDto;
import com.playstore.api.app.dto.AppSummaryDto;
import com.playstore.api.app.dto.CategoryDto;
import com.playstore.api.app.repo.AppRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/apps")
public class AppController {

    private final AppRepository appRepository;

    public AppController(AppRepository appRepository) {
        this.appRepository = appRepository;
    }

    @GetMapping
    public Page<AppSummaryDto> list(
            @RequestParam(value = "q", required = false) String q,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "sort", defaultValue = "createdAt,desc") String sort
    ) {
        String[] sortParts = sort.split(",");
        Sort s = sortParts.length == 2 ? Sort.by(Sort.Direction.fromString(sortParts[1]), sortParts[0]) : Sort.by(sort);
        Pageable pageable = PageRequest.of(page, size, s);

        boolean hasQuery = StringUtils.hasText(q);
        boolean hasCategory = StringUtils.hasText(category);

        if (!hasQuery && !hasCategory) {
            return appRepository.findAll(pageable).map(this::toSummaryDto);
        }
        if (hasCategory && !hasQuery) {
            return appRepository.findByCategories_SlugIgnoreCase(category, pageable).map(this::toSummaryDto);
        }
        if (hasCategory) {
            return appRepository.findByCategories_SlugIgnoreCaseAndNameContainingIgnoreCaseOrCategories_SlugIgnoreCaseAndDescriptionContainingIgnoreCase(
                category, q, category, q, pageable
            ).map(this::toSummaryDto);
        }
        return appRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(q, q, pageable)
            .map(this::toSummaryDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppDetailsDto> get(@PathVariable Long id) {
        Optional<AppEntity> app = appRepository.findById(id);
        return app.map(value -> ResponseEntity.ok(toDetailsDto(value)))
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/install")
    public ResponseEntity<Void> install(@PathVariable Long id) {
        Optional<AppEntity> appOpt = appRepository.findById(id);
        if (appOpt.isEmpty()) return ResponseEntity.notFound().build();
        AppEntity app = appOpt.get();
        app.setInstallsCount(app.getInstallsCount() + 1);
        appRepository.save(app);
        return ResponseEntity.noContent().build();
    }

    private AppSummaryDto toSummaryDto(AppEntity app) {
        return new AppSummaryDto(
            app.getId(),
            app.getName(),
            app.getDeveloperName(),
            app.getDescription(),
            app.getIconUrl(),
            app.getInstallsCount(),
            app.getRatingAvg(),
            app.getRatingCount(),
            toCategoryDtos(app),
            mockScreenshots(app.getId())
        );
    }

    private AppDetailsDto toDetailsDto(AppEntity app) {
        return new AppDetailsDto(
            app.getId(),
            app.getName(),
            app.getDeveloperName(),
            app.getDescription(),
            app.getIconUrl(),
            app.getInstallsCount(),
            app.getRatingAvg(),
            app.getRatingCount(),
            app.getCreatedAt(),
            toCategoryDtos(app),
            mockScreenshots(app.getId())
        );
    }

    private List<CategoryDto> toCategoryDtos(AppEntity app) {
        return app.getCategories().stream()
            .map(c -> new CategoryDto(c.getId(), c.getName(), c.getSlug()))
            .toList();
    }

    private List<String> mockScreenshots(Long appId) {
        long seed = appId == null ? 1 : appId;
        return List.of(
            "https://picsum.photos/seed/app-" + seed + "-1/900/506",
            "https://picsum.photos/seed/app-" + seed + "-2/900/506",
            "https://picsum.photos/seed/app-" + seed + "-3/900/506"
        );
    }
}

