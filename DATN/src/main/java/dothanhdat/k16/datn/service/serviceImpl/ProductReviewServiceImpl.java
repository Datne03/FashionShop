package dothanhdat.k16.datn.service.serviceImpl;

import dothanhdat.k16.datn.dto.request.ProductReviewCreateRequest;
import dothanhdat.k16.datn.dto.request.ProductReviewUpdateRequest;
import dothanhdat.k16.datn.dto.response.ProductReviewResponse;
import dothanhdat.k16.datn.entity.Product.Product;
import dothanhdat.k16.datn.entity.Product.ProductReview;
import dothanhdat.k16.datn.entity.User.User;
import dothanhdat.k16.datn.exception.AppException;
import dothanhdat.k16.datn.exception.ErrException;
import dothanhdat.k16.datn.mapper.IProductReviewMapper;
import dothanhdat.k16.datn.repository.ProductRepository;
import dothanhdat.k16.datn.repository.ProductReviewRepository;
import dothanhdat.k16.datn.repository.UserRepository;
import dothanhdat.k16.datn.service.ProductReviewService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class ProductReviewServiceImpl implements ProductReviewService {
    ProductReviewRepository productReviewRepository;
    IProductReviewMapper productReviewMapper;
    ProductRepository productRepository;
    UserRepository userRepository;

    private boolean isPhoto(MultipartFile file) {
        String contentType = file.getContentType();
        return contentType != null && contentType.startsWith("image/");
    }

    private String storeFile(MultipartFile file) {
        if (!isPhoto(file) || file.getOriginalFilename() == null || file.getOriginalFilename().isEmpty()) {
            throw new AppException(ErrException.NOT_FILE);
        }
        String fileName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        String uniqueFilename = UUID.randomUUID().toString()+"_"+fileName;
        java.nio.file.Path uploadDir = java.nio.file.Paths.get("upload/review");
        if (!Files.exists(uploadDir)) {
            try {
                Files.createDirectories(uploadDir);
            } catch (IOException e) {
                throw new AppException(ErrException.DIRECTORY_CREATION_FAILED);
            }
        }
        java.nio.file.Path destination = Paths.get(uploadDir.toString(), uniqueFilename);
        try {
            Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new AppException(ErrException.FILE_STORAGE_FAILED);
        }
        return uniqueFilename;
    }

    @Override
    public ProductReviewResponse createProductReview(int userId, int productId, ProductReviewCreateRequest request) {
        // Kiểm tra User và Product
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Tạo review mới từ request
        ProductReview productReview = productReviewMapper.toProductReview(request);
        productReview.setUser(user);
        productReview.setProduct(product);
        productReview.setReview(request.getReview());
        productReview.setRating(request.getRating());
        productReview.setCreatedAt(LocalDateTime.now());

        productReviewRepository.save(productReview);

        return productReviewMapper.toProductReviewResponse(productReview);
    }

    public ProductReviewResponse uploadReviewImage(int id, MultipartFile file) {
        ProductReview productReview = productReviewRepository.findById(id).orElseThrow(() -> new RuntimeException("Product review not found"));
        String fileName = storeFile(file);
        productReview.setImageUrl(fileName);
        return productReviewMapper.toProductReviewResponse(productReviewRepository.save(productReview));
    }


    @Override
    public ProductReviewResponse updateProductReview(int id, ProductReviewUpdateRequest request) {
        ProductReview productReview = productReviewRepository.findById(id).orElse(null);
        productReviewMapper.updateProductReview(productReview, request);
        productReview.setUpdatedAt(LocalDateTime.now());
        productReviewRepository.save(productReview);
        return productReviewMapper.toProductReviewResponse(productReview);
    }

    @Override
    public String deleteProductReview(int id) {
        ProductReview productReview = productReviewRepository.findById(id).orElse(null);
        productReview.setDeleted(true);
        productReviewRepository.save(productReview);
        return "Deleted";
    }

    @Override
    public List<ProductReviewResponse> getReviewsByProductId(int productId) {
        Product product = productRepository.findById(productId).orElse(null);
        if (product == null) {
            return Collections.emptyList();
        }

        return productReviewRepository.findByProductId(productId).stream()
                .map(productReview -> productReviewMapper.toProductReviewResponse(productReview))
                .filter(productReviewResponse -> !productReviewResponse.isDeleted())
                .sorted(Comparator.comparing(ProductReviewResponse::getCreatedAt).reversed())
                .collect(Collectors.toList());
    }


    @Override
    public List<ProductReviewResponse> getReviewsByUserId(int userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        return productReviewRepository.findByUser(user).stream()
                .map(productReview -> productReviewMapper.toProductReviewResponse(productReview))
                .filter(productReviewResponse -> !productReviewResponse.isDeleted())
                .collect(Collectors.toList());
    }

    @Override
    public Optional<ProductReviewResponse> getReviewById(int id) {
        return productReviewRepository.findById(id).map(productReviewMapper::toProductReviewResponse);
    }

    @Override
    public int getReviewsCountByProductId(int productId) {
        List<ProductReviewResponse> reviews = getReviewsByProductId(productId);
        int count = 0;
        for (int i = 0; i < reviews.size(); i++) {
            count++;
        }
        System.out.println("count" +count);
        return count;
    }

    @Override
    public double getAverageRatingByProductId(int productId) {
        try {
            int count = getReviewsCountByProductId(productId);
            List<ProductReviewResponse> reviews = getReviewsByProductId(productId);
            int sum = 0;
            for (int i = 0; i < reviews.size(); i++) {
                sum += reviews.get(i).getRating();
            }
            System.out.println("count" +count);
            System.out.println("sum" +sum);
            System.out.println("av" +(double)sum/count);

            return (double) sum / count;
        } catch (Exception e) {
            return 0;
        }
    }
}
