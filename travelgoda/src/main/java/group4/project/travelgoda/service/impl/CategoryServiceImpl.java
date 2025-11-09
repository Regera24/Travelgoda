package group4.project.travelgoda.service.impl;

import group4.project.travelgoda.dto.response.CategoryResponse;
import group4.project.travelgoda.entity.Category;
import group4.project.travelgoda.mapper.CategoryMapper;
import group4.project.travelgoda.repository.CategoryRepository;
import group4.project.travelgoda.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Override
    public List<CategoryResponse> getAllCategory() {
        List<Category> categories = categoryRepository.findAll();
        return categories.stream().map(category -> CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .build()).collect(Collectors.toList());
    }

    @Override
    public List<CategoryResponse> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        return categoryMapper.toResponseList(categories);
    }
}
