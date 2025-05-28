package dothanhdat.k16.datn.service.serviceImpl;

import dothanhdat.k16.datn.dto.response.ProductImageResponse;
import dothanhdat.k16.datn.entity.Product.Product;
import dothanhdat.k16.datn.entity.Product.ProductImage;
import dothanhdat.k16.datn.exception.AppException;
import dothanhdat.k16.datn.exception.ErrException;
import dothanhdat.k16.datn.repository.ProductImageRepository;
import dothanhdat.k16.datn.repository.ProductRepository;
import dothanhdat.k16.datn.service.ProductImageService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

import static org.apache.commons.io.file.PathUtils.deleteFile;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class ProductImageServiceImpl implements ProductImageService {
    ProductRepository productRepository;
    ProductImageRepository productImageRepository;
    private static final String UPLOAD_DIR = "upload/products";

    private boolean isPhoto(MultipartFile file) {
        String contentType = file.getContentType();
        return contentType != null &&
                (contentType.equals("image/jpeg") ||
                        contentType.equals("image/png") ||
                        contentType.equals("image/jfif"));
    }


    public String storeFile(MultipartFile file) {
        if (!isPhoto(file) || file.getOriginalFilename() == null || file.getOriginalFilename().isEmpty()) {
            throw new AppException(ErrException.NOT_FILE);
        }

        String fileName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        String uniqueFilename = UUID.randomUUID().toString() + "_" + fileName;

        Path uploadDir = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadDir)) {
            try {
                Files.createDirectories(uploadDir);
            } catch (IOException e) {
                throw new AppException(ErrException.DIRECTORY_CREATION_FAILED);
            }
        }

        Path destination = Paths.get(uploadDir.toString(), uniqueFilename);
        try {
            Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new AppException(ErrException.FILE_STORAGE_FAILED);
        }
        return uniqueFilename;
    }

    @Override
    public List<ProductImageResponse> createProductImage(int productId, MultipartFile[] files) throws IOException {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        List<ProductImage> oldImages = productImageRepository.findByProduct(product);
        for (ProductImage oldImage : oldImages) {
            deleteFile(Paths.get(oldImage.getImageUrl())); // Xoá file vật lý (nếu có)
            productImageRepository.delete(oldImage); // Xoá trong DB
        }

        List<ProductImageResponse> responses = new ArrayList<>();

        for (MultipartFile file : files) {
            String fileName = storeFile(file); // Hàm xử lý lưu file, return tên file
            ProductImage productImage = productImageRepository.save(
                    ProductImage.builder()
                            .imageUrl(fileName)
                            .product(product)
                            .build()
            );

            responses.add(new ProductImageResponse(productImage.getId(), productImage.getImageUrl(), product));
        }

        return responses;
    }


    @Override
    public List<String> getImagesByProductId(int productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        return productImageRepository.findByProduct(product)
                .stream()
                .map(ProductImage::getImageUrl)
                .collect(Collectors.toList());
    }
}
