package org.erp.practice.infrastructure.web.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.erp.practice.application.port.out.FiscalPeriodRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/fiscal-periods")
@RequiredArgsConstructor
@Tag(name = "회계기간", description = "Fiscal Period Management")
public class FiscalPeriodController {

    private final FiscalPeriodRepository fiscalPeriodRepository;

    @GetMapping
    @Operation(summary = "회계 기간 목록 조회")
    public ResponseEntity<List<Map<String, Object>>> list(@RequestParam(defaultValue = "2026") int year) {
        return ResponseEntity.ok(fiscalPeriodRepository.listByYear(year));
    }

    @PostMapping("/{year}/{month}/close")
    @Operation(summary = "회계 기간 마감")
    public ResponseEntity<Void> close(@PathVariable int year, @PathVariable int month) {
        fiscalPeriodRepository.close(year, month, 1L); // TODO: inject real userId from auth
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{year}/{month}/reopen")
    @Operation(summary = "회계 기간 재개")
    public ResponseEntity<Void> reopen(@PathVariable int year, @PathVariable int month) {
        fiscalPeriodRepository.reopen(year, month);
        return ResponseEntity.ok().build();
    }
}
