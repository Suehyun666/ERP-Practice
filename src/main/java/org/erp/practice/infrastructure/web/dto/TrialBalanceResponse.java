package org.erp.practice.infrastructure.web.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class TrialBalanceResponse {

    private int            fiscalYear;
    private int            fiscalMonth;
    private LocalDateTime  generatedAt;
    @JsonProperty("isBalanced")
    private boolean        isBalanced;       // 차변합계 == 대변합계
    private BigDecimal     totalDebit;
    private BigDecimal     totalCredit;
    private List<Row>      rows;

    @Getter
    @Builder
    public static class Row {
        private String     accountCode;
        private String     accountName;
        private String     accountType;
        private BigDecimal openingBalance;
        private BigDecimal debitTotal;
        private BigDecimal creditTotal;
        private BigDecimal closingBalance;
    }
}
