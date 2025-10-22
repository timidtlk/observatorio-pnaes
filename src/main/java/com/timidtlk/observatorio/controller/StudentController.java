package com.timidtlk.observatorio.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.timidtlk.observatorio.domain.student.Student;
import com.timidtlk.observatorio.service.StudentService;

@RestController
@RequestMapping("/students")
public class StudentController {
    @Autowired
    StudentService studentService;

    @GetMapping("/count")
    public ResponseEntity<Integer> getCount() {
        return ResponseEntity.ok().body(studentService.getStudents("","","","").size());
    }

    @PostMapping
    public ResponseEntity<Boolean> setDatabase(@RequestParam("csv") MultipartFile csv) {
        boolean status = studentService.setDatabase(csv);

        return (status) ? ResponseEntity.ok(status) : ResponseEntity.internalServerError().build();
    }

    @GetMapping
    public ResponseEntity<List<Student>> filterStudents(
        @RequestParam(value = "curso", required = false) String curso, 
        @RequestParam(value = "campus", required = false) String campus,
        @RequestParam(value = "forma_ingresso", required = false) String formaIngresso,
        @RequestParam(value = "cotas", required = false) String cotas
    ) {
        return ResponseEntity.ok()
            .body(studentService.getStudents(campus, curso, formaIngresso, cotas));
    }

    @GetMapping("/campus")
    public ResponseEntity<List<String>> getAllCampus() {
        return ResponseEntity.ok().body(studentService.getAllCampus());
    }

    @GetMapping("/cursos")
    public ResponseEntity<List<String>> getAllCursos() {
        return ResponseEntity.ok().body(studentService.getAllCursos());
    }

    @GetMapping("/ingresso")
    public ResponseEntity<List<String>> getAllFormasIngresso() {
        return ResponseEntity.ok().body(studentService.getAllFormasIngresso());
    }
}
