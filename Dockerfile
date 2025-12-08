FROM maven:3.9.11 as maven-builder
COPY src /app/src
COPY pom.xml /app

RUN mvn -f /app/pom.xml clean package -DskipTests
FROM alpine/java:21-jdk

COPY --from=maven-builder app/target/*.jar /app-service/observatorio.jar
WORKDIR /app-service

EXPOSE 8080
ENTRYPOINT ["java","-jar","observatorio.jar"]