package com.loople.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;

@SpringBootApplication
@ComponentScan(
		basePackages = {
				"com.loople.backend.v2"
		},
		excludeFilters = {
				@ComponentScan.Filter(
						type = FilterType.REGEX,
						pattern = "com\\.loople\\.backend\\.api\\.v1\\..*"
				)
		}
)
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

}