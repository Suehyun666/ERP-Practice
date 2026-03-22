package org.erp.practice.infrastructure.web.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.erp.practice.application.port.in.ReportUseCase;
import org.erp.practice.infrastructure.web.dto.FinancialStatementResponse;
import org.erp.practice.infrastructure.web.dto.TrialBalanceResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@Tag(name = "보고서", description = "재무 보고서 API")
public class ReportController {

    private final ReportUseCase reportUseCase;

    @GetMapping("/trial-balance")
    @Operation(summary = "합계잔액시산표 (Trial Balance)")
    public ResponseEntity<TrialBalanceResponse> trialBalance(
            @RequestParam int year,
            @RequestParam int month) {
        return ResponseEntity.ok(reportUseCase.getTrialBalance(year, month));
    }

    @GetMapping("/balance-sheet")
    @Operation(summary = "재무상태표 (Balance Sheet)")
    public ResponseEntity<FinancialStatementResponse> balanceSheet(
            @RequestParam int year,
            @RequestParam int month) {
        return ResponseEntity.ok(reportUseCase.getBalanceSheet(year, month));
    }

    @GetMapping("/income-statement")
    @Operation(summary = "손익계산서 (Income Statement)")
    public ResponseEntity<FinancialStatementResponse> incomeStatement(
            @RequestParam int year,
            @RequestParam int month) {
        return ResponseEntity.ok(reportUseCase.getIncomeStatement(year, month));
    }
}
