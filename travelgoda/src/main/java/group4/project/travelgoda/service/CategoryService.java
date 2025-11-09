package group4.project.travelgoda.service;

import group4.project.travelgoda.dto.response.CategoryResponse;
import java.util.List;

public interface CategoryService {
    List<CategoryResponse> getAllCategories();
}