package org.erp.practice.application.service;

import lombok.RequiredArgsConstructor;
import org.erp.practice.application.port.in.ReportUseCase;
import org.erp.practice.application.port.out.ReportRepository;
import org.erp.practice.infrastructure.web.dto.FinancialStatementResponse;
import org.erp.practice.infrastructure.web.dto.TrialBalanceResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReportService implements ReportUseCase {

    private final ReportRepository reportRepository;

    @Override
    public TrialBalanceResponse getTrialBalance(int year, int month) {
        validatePeriod(year, month);
        return reportRepository.queryTrialBalance(year, month);
    }

    @Override
    public FinancialStatementResponse getBalanceSheet(int year, int month) {
        validatePeriod(year, month);
        return reportRepository.queryBalanceSheet(year, month);
    }

    @Override
    public FinancialStatementResponse getIncomeStatement(int year, int month) {
        validatePeriod(year, month);
        return reportRepository.queryIncomeStatement(year, month);
    }

    private void validatePeriod(int year, int month) {
        if (month < 1 || month > 12) {
            throw new IllegalArgumentException("월은 1~12 사이여야 합니다: " + month);
        }
        if (year < 2000 || year > 2100) {
            throw new IllegalArgumentException("올바르지 않은 회계 연도: " + year);
        }
    }
}
