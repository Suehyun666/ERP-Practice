package org.erp.practice.infrastructure.web.dto;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class JournalResponse {

    private Long          journalId;
    private String        journalNo;
    private LocalDate     docDate;
    private LocalDate     postDate;
    private String        status;
    private String        description;
    private Long          createdBy;
    private LocalDateTime createdAt;
    private List<LineResponse> lines;

    @Getter
    @Builder
    public static class LineResponse {
        private Long       lineId;
        private int        lineNo;
        private String     accountCode;
        private String     accountName;
        private String     accountSide;
        private BigDecimal amount;
        private String     currency;
        private String     description;
    }
}
