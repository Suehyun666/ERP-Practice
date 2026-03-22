package org.erp.practice.application.port.in;

import org.erp.practice.infrastructure.web.dto.JournalCreateRequest;
import org.erp.practice.infrastructure.web.dto.JournalResponse;

import java.util.List;

public interface JournalUseCase {

    /** 전표 임시저장 (DRAFT) */
    JournalResponse createDraft(JournalCreateRequest request, Long userId);

    /** 전표 승인 (DRAFT → POSTED) */
    JournalResponse post(Long journalId, Long approverId);

    /** 역전표 발행 (POSTED → CANCELLED, 새 역전표 POSTED) */
    JournalResponse cancel(Long journalId, Long userId);

    JournalResponse findById(Long journalId);
    List<JournalResponse> findByFiscalPeriod(int year, int month);
}
