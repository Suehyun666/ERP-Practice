package org.erp.practice.infrastructure.web.dto;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Builder
public class DashboardResponse {

    private MonthKpi        currentMonth;
    private List<MonthTrend> monthlyTrend;
    private List<AccountKpi> topExpenses;

    @Getter
    @Builder
    public static class MonthKpi {
        private int        year;
        private int        month;
        private BigDecimal revenue;
        private BigDecimal expenses;
        private BigDecimal netIncome;
        private BigDecimal cashBalance;
        private BigDecimal arBalance;
        private long       draftCount;
        private long       postedCount;
    }

    @Getter
    @Builder
    public static class MonthTrend {
        private int        month;
        private BigDecimal revenue;
        private BigDecimal expenses;
        private BigDecimal netIncome;
    }

    @Getter
    @Builder
    public static class AccountKpi {
        private String     accountName;
        private BigDecimal amount;
    }
}
