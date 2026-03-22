package org.erp.practice.application.port.in;

import org.erp.practice.infrastructure.web.dto.TrialBalanceResponse;
import org.erp.practice.infrastructure.web.dto.FinancialStatementResponse;

public interface ReportUseCase {

    /** 합계잔액시산표 (Trial Balance) */
    TrialBalanceResponse getTrialBalance(int year, int month);

    /** 재무상태표 (Balance Sheet) */
    FinancialStatementResponse getBalanceSheet(int year, int month);

    /** 손익계산서 (Income Statement) */
    FinancialStatementResponse getIncomeStatement(int year, int month);
}
