package com.playstore.api.app.dto;

import java.time.OffsetDateTime;
import java.util.List;

public record AppDetailsDto(
    Long id,
    String name,
    String developerName,
    String description,
    String iconUrl,
    long installsCount,
    double ratingAvg,
    long ratingCount,
    OffsetDateTime createdAt,
    List<CategoryDto> categories,
    List<String> screenshots
) {}
