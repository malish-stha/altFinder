package com.altfinder;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class AltFinderApplication {
    public static void main(String[] args) {
        SpringApplication.run(AltFinderApplication.class, args);
    }
}
