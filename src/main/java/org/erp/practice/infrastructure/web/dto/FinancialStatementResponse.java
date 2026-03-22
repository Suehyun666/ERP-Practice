package org.erp.practice.infrastructure.web.dto;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class FinancialStatementResponse {

    private String         statementType;  // "BALANCE_SHEET" | "INCOME_STATEMENT"
    private int            fiscalYear;
    private int            fiscalMonth;
    private LocalDateTime  generatedAt;
    private List<Section>  sections;

    @Getter
    @Builder
    public static class Section {
        private String       sectionName;   // 예: "유동자산", "비유동자산"
        private List<Item>   items;
        private BigDecimal   subtotal;
    }

    @Getter
    @Builder
    public static class Item {
        private String     accountCode;
        private String     accountName;
        private BigDecimal amount;
    }
}
