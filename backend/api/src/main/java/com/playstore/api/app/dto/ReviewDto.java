package com.playstore.api.app.dto;

import java.time.OffsetDateTime;

public record ReviewDto(
    Long id,
    int rating,
    String comment,
    String authorEmail,
    OffsetDateTime createdAt
) {}
