package dothanhdat.k16.datn.config;

import dothanhdat.k16.datn.entity.Product.Product;
import org.springframework.data.jpa.domain.Specification;

public class ProductSpecification {

    public static Specification<Product> searchByName(String keyword) {
        return (root, query, criteriaBuilder) -> {
            if (keyword == null || keyword.trim().isEmpty()) {
                return criteriaBuilder.conjunction();
            }

            return criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("name")),
                    "%" + keyword.trim().toLowerCase() + "%"
            );
        };
    }
}


