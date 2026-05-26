package com.doanptweb.backend.controller;

import com.doanptweb.backend.entity.*;
import com.doanptweb.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    @Autowired private ProductRepository productRepository;
    @Autowired private ProductImageRepository imageRepository;
    @Autowired private ProductSpecRepository specRepository;

    @GetMapping
    public List<Product> getAll() {
        return productRepository.findByActiveTrue();
    }

    @GetMapping("/{id}")
    public Product getById(@PathVariable Long id) {
        return productRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Product create(@RequestBody Product product) {
        if (product.getImages() != null)
            product.getImages().forEach(img -> img.setProduct(product));
        if (product.getSpecs() != null)
            product.getSpecs().forEach(spec -> spec.setProduct(product));
        return productRepository.save(product);
    }

    @PutMapping("/{id}")
    public Product update(@PathVariable Long id, @RequestBody Product product) {
        product.setId(id);
        if (product.getImages() != null)
            product.getImages().forEach(img -> img.setProduct(product));
        if (product.getSpecs() != null)
            product.getSpecs().forEach(spec -> spec.setProduct(product));
        return productRepository.save(product);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        productRepository.deleteById(id);
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) throws IOException {
        String uploadDir = "uploads/";
        new File(uploadDir).mkdirs();
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path path = Paths.get(uploadDir + fileName);
        Files.write(path, file.getBytes());
        String url = "http://localhost:8080/uploads/" + fileName;
        return ResponseEntity.ok(Map.of("url", url));
    }
}