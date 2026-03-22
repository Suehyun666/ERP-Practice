plugins {
    java
    id("org.springframework.boot") version "3.4.3"
    id("io.spring.dependency-management") version "1.1.7"
    id("nu.studer.jooq") version "9.0"
}

group = "org.erp"
version = "0.0.1"

java {
    toolchain { languageVersion = JavaLanguageVersion.of(21) }
}

configurations {
    compileOnly { extendsFrom(configurations.annotationProcessor.get()) }
}

repositories { mavenCentral() }

dependencies {
    // Spring Boot Starters
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.springframework.boot:spring-boot-starter-data-mongodb")

    // MySQL Connector/J
    runtimeOnly("com.mysql:mysql-connector-j")

    // JOOQ
    implementation("org.springframework.boot:spring-boot-starter-jooq")
    jooqGenerator("com.mysql:mysql-connector-j")

    // Moneta (JSR 354)
    implementation("org.javamoney:moneta:1.4.4")

    // OpenAPI
    implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.8.6")

    // Lombok
    compileOnly("org.projectlombok:lombok")
    annotationProcessor("org.projectlombok:lombok")

    // Testing
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

tasks.withType<Test> { useJUnitPlatform() }
