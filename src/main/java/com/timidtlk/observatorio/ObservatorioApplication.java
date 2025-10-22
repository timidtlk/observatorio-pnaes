package com.timidtlk.observatorio;

import java.io.File;
import java.io.FileInputStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.mock.web.MockMultipartFile;

import com.timidtlk.observatorio.service.StudentService;

@SpringBootApplication
public class ObservatorioApplication {
	@Autowired
	StudentService studentService;

	@Bean
	CommandLineRunner commandLineRunner() {
		return (args) -> {
			try {
				if (studentService.getStudents("", "", "", "").isEmpty()) {
					FileInputStream io = new FileInputStream(new File(getClass().getClassLoader().getResource("db/data.csv").toURI()));
					MultipartFile file = new MockMultipartFile("file.csv", io);
					studentService.setDatabase(file);
				}				
			} catch (Exception e) {
				e.printStackTrace();
			}
		};
	}

	public static void main(String[] args) {
		SpringApplication.run(ObservatorioApplication.class, args);
	}
}
