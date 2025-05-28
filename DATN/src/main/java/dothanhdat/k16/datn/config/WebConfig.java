package dothanhdat.k16.datn.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    //file:///C:/Users/dater/Documents/HK7/Ananas/ananas/upload/user/
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/images/avatar/**").addResourceLocations("file:///D:/DATN/DATN/upload/user/")
                .setCachePeriod(3600);

        registry.addResourceHandler("/images/product/**").addResourceLocations("file:///D:/DATN/DATN/upload/products/")
                .setCachePeriod(3600);

        registry.addResourceHandler("/images/review/**").addResourceLocations("file:///D:/DATN/DATN/upload/review/")
                .setCachePeriod(3600);

        registry.addResourceHandler("/images/category/**").addResourceLocations("file:///D:/DATN/DATN/upload/category/")
                .setCachePeriod(3600);
    }
}

