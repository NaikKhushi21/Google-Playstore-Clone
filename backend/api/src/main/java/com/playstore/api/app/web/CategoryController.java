package com.playstore.api.app.web;

import com.playstore.api.app.dto.CategoryDto;
import com.playstore.api.app.repo.CategoryRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    private final CategoryRepository categoryRepository;

    public CategoryController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @GetMapping
    public List<CategoryDto> list() {
        return categoryRepository.findAllByOrderByNameAsc().stream()
            .map(c -> new CategoryDto(c.getId(), c.getName(), c.getSlug()))
            .toList();
    }
}

