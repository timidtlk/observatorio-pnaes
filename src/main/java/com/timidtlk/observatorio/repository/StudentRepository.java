package com.timidtlk.observatorio.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.timidtlk.observatorio.domain.student.QuotaPercent;
import com.timidtlk.observatorio.domain.student.Student;

public interface StudentRepository extends JpaRepository<Student, Long> {
    List<Student> findByCampus(String campus);
    List<Student> findByCurso(String curso);

    @Query(value = "SELECT qtd_pessoas * 100.0 / ( " +
        "   SELECT SUM(qtd_pessoas) FROM students WHERE campus = :campus AND curso = :curso " +
        ") AS percentual FROM students " +
        "WHERE campus = :campus AND curso = :curso AND forma_ingresso = :forma_ingresso",
        nativeQuery = true)
    float getPercentualByCampusAndCurso(
        @Param("campus") String campus, 
        @Param("curso") String curso,
        @Param("forma_ingresso") String formaIngresso
    );

    @Query(value = "SELECT SUM(qtd_pessoas) AS total FROM students WHERE campus = :campus AND curso = :curso", nativeQuery = true)
    int getTotalByCampusAndCurso(
        @Param("campus") String campus, 
        @Param("curso") String curso
    );

    @Query(value = "SELECT SUM(qtd_pessoas) AS total FROM students WHERE campus = :campus", nativeQuery = true)
    int getTotalByCampus(
        @Param("campus") String campus
    );

    @Query(value = "SELECT SUM(qtd_pessoas) AS total FROM students WHERE curso = :curso", nativeQuery = true)
    int getTotalByCurso(
        @Param("curso") String curso
    );

    @Query(value = "SELECT DISTINCT campus FROM students ORDER BY campus ASC", nativeQuery = true)
    List<String> getAllCampus();

    @Query(value = "SELECT DISTINCT curso FROM students ORDER BY curso ASC", nativeQuery = true)
    List<String> getAllCursos();

    @Query(value = "SELECT DISTINCT forma_ingresso FROM students ORDER BY forma_ingresso ASC", nativeQuery = true)
    List<String> getAllFormaIngresso();

    @Query(value = 
        "SELECT COUNT(*) FILTER (WHERE cotas = 'S') * 100.0 / COUNT(*) AS s, " +
        "       COUNT(*) FILTER (WHERE cotas = 'N') * 100.0 / COUNT(*) AS n, " +
        "       COUNT(*) FILTER (WHERE cotas = 'O') * 100.0 / COUNT(*) AS o " +
        "FROM students",
        nativeQuery = true)
    QuotaPercent getQuotaPercent();

    // filtro seguro: se param NULL ou vazio, ignora o filtro
    @Query(value =
        "SELECT * FROM students WHERE " +
        "(:campus IS NULL OR :campus = '' OR campus = :campus) AND " +
        "(:curso IS NULL OR :curso = '' OR curso = :curso) AND " +
        "(:forma_ingresso IS NULL OR :forma_ingresso = '' OR forma_ingresso = :forma_ingresso) AND " +
        "(:cotas IS NULL OR :cotas = '' OR cotas = :cotas) " +
        "ORDER BY campus ASC, curso ASC",
        nativeQuery = true)
    List<Student> findByFilters(
        @Param("campus") String campus, 
        @Param("curso") String curso,
        @Param("forma_ingresso") String formaIngresso,
        @Param("cotas") String cotas
    );
}