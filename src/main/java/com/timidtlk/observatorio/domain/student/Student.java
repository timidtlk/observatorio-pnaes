package com.timidtlk.observatorio.domain.student;

import java.util.UUID;

import org.hibernate.annotations.UuidGenerator;

import jakarta.annotation.Generated;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "students")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String campus;
    private String curso;
    private String formaIngresso;
    private char cotas;
    private int qtdPessoas;
    
    public Student(String campus, String curso, String formaIngresso, char cotas, int qtdPessoas) {
        this.campus = campus;
        this.curso = curso;
        this.formaIngresso = formaIngresso;
        this.cotas = cotas;
        this.qtdPessoas = qtdPessoas;
    }
}
