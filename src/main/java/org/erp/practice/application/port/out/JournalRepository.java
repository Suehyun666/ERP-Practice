package org.erp.practice.application.port.out;

import org.erp.practice.infrastructure.web.dto.JournalCreateRequest;
import org.erp.practice.infrastructure.web.dto.JournalResponse;

import java.util.List;
import java.util.Optional;

public interface JournalRepository {
    JournalResponse save(JournalCreateRequest request, Long userId);
    Optional<JournalResponse> findById(Long journalId);
    List<JournalResponse> findByFiscalPeriod(int year, int month);
    void updateStatus(Long journalId, String status, Long userId);
    void applyToAccountBalances(Long journalId);
    String generateJournalNo(int year, int month);
}
