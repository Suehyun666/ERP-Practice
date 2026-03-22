package org.erp.practice.application.port.out;

import org.erp.practice.infrastructure.web.dto.FinancialStatementResponse;
import org.erp.practice.infrastructure.web.dto.TrialBalanceResponse;

public interface ReportRepository {
    TrialBalanceResponse queryTrialBalance(int year, int month);
    FinancialStatementResponse queryBalanceSheet(int year, int month);
    FinancialStatementResponse queryIncomeStatement(int year, int month);
}
