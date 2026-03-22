package org.erp.practice.infrastructure.web.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.erp.practice.application.port.in.JournalUseCase;
import org.erp.practice.infrastructure.web.dto.JournalCreateRequest;
import org.erp.practice.infrastructure.web.dto.JournalResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/journals")
@RequiredArgsConstructor
@Tag(name = "전표", description = "Journal Entry API")
public class JournalController {

    private final JournalUseCase journalUseCase;

    private Long userId(HttpServletRequest req) {
        Long id = (Long) req.getAttribute("userId");
        return id != null ? id : 1L; // 헤더 없을 시 admin fallback
    }

    @PostMapping
    @Operation(summary = "전표 임시저장 (DRAFT)")
    public ResponseEntity<JournalResponse> createDraft(
            @Valid @RequestBody JournalCreateRequest request,
            HttpServletRequest req) {
        return ResponseEntity.ok(journalUseCase.createDraft(request, userId(req)));
    }

    @PostMapping("/{journalId}/post")
    @Operation(summary = "전표 승인 (DRAFT → POSTED)")
    public ResponseEntity<JournalResponse> post(
            @PathVariable Long journalId,
            HttpServletRequest req) {
        return ResponseEntity.ok(journalUseCase.post(journalId, userId(req)));
    }

    @PostMapping("/{journalId}/cancel")
    @Operation(summary = "역전표 발행 (POSTED → CANCELLED)")
    public ResponseEntity<JournalResponse> cancel(
            @PathVariable Long journalId,
            HttpServletRequest req) {
        return ResponseEntity.ok(journalUseCase.cancel(journalId, userId(req)));
    }

    @GetMapping("/{journalId}")
    @Operation(summary = "전표 단건 조회")
    public ResponseEntity<JournalResponse> findById(@PathVariable Long journalId) {
        return ResponseEntity.ok(journalUseCase.findById(journalId));
    }

    @GetMapping
    @Operation(summary = "회계 기간별 전표 목록 조회")
    public ResponseEntity<List<JournalResponse>> findByPeriod(
            @RequestParam int year,
            @RequestParam int month) {
        return ResponseEntity.ok(journalUseCase.findByFiscalPeriod(year, month));
    }
}
