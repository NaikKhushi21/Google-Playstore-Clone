package com.playstore.api.app.dto;

import java.util.List;

public record AppSummaryDto(
    Long id,
    String name,
    String developerName,
    String description,
    String iconUrl,
    long installsCount,
    double ratingAvg,
    long ratingCount,
    List<CategoryDto> categories,
    List<String> screenshots
) {}
