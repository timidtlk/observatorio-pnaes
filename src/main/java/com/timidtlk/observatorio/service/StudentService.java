package com.timidtlk.observatorio.service;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.opencsv.CSVParser;
import com.opencsv.CSVParserBuilder;
import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import com.opencsv.exceptions.CsvException;
import com.timidtlk.observatorio.domain.student.Student;
import com.timidtlk.observatorio.repository.StudentRepository;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@Transactional(rollbackOn = Exception.class)
public class StudentService {
    @Autowired
    StudentRepository studentRepo;

    public boolean setDatabase(MultipartFile csv) {
        try {
            studentRepo.deleteAll();

            assert (studentRepo.count() == 0): "Dados não foram deletados com sucesso";

            Reader reader = new InputStreamReader(csv.getInputStream());
            CSVParser parser = new CSVParserBuilder()
                                    .withSeparator(';')
                                    .build();
            CSVReader csvReader = new CSVReaderBuilder(reader)
                                    .withSkipLines(1)
                                    .withCSVParser(parser)
                                    .build();

            List<String[]> linhas = csvReader.readAll();

            for (String[] linha : linhas) {
                studentRepo.save(new Student(
                    linha[0], 
                    linha[1], 
                    linha[3], 
                    linha[2].toCharArray()[0], 
                    Integer.parseInt(linha[4]))
                );
            }
            return true;
        } catch (IOException | CsvException e) {
            e.printStackTrace();
            return false;
        }
    }

    public List<Student> getStudents(String campus, String curso, String formaIngresso, String cotas) {
        return studentRepo.findByFilters(
            campus == null ? "" : campus,
            curso == null ? "" : curso,
            formaIngresso == null ? "" : formaIngresso,
            cotas == null ? "" : cotas
        );
    }

    public List<String> getAllCampus() {
        return studentRepo.getAllCampus();
    }

    public List<String> getAllCursos() {
        return studentRepo.getAllCursos();
    }

    public List<String> getAllFormasIngresso() {
        return studentRepo.getAllFormaIngresso();
    }
}
