package org.erp.practice.infrastructure.web.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class JournalCreateRequest {

    @NotNull
    private LocalDate docDate;

    @NotNull
    private LocalDate postDate;

    private String description;
    private Long   deptId;

    @NotEmpty
    @Valid
    private List<LineRequest> lines;

    @Getter
    @Setter
    public static class LineRequest {

        @NotBlank
        private String accountCode;

        @NotBlank
        private String accountSide; // "DEBIT" | "CREDIT"

        @NotNull
        @Positive
        private BigDecimal amount;

        private String currency = "KRW";
        private String description;
    }
}
