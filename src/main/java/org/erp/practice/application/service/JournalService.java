package org.erp.practice.application.service;

import lombok.RequiredArgsConstructor;
import org.erp.practice.application.port.in.JournalUseCase;
import org.erp.practice.application.port.out.AccountRepository;
import org.erp.practice.application.port.out.FiscalPeriodRepository;
import org.erp.practice.application.port.out.JournalRepository;
import org.erp.practice.domain.account.Account;
import org.erp.practice.domain.account.AccountSide;
import org.erp.practice.domain.journal.JournalTransaction;
import org.erp.practice.domain.journal.JournalTransactionBuilder;
import org.erp.practice.infrastructure.web.dto.JournalCreateRequest;
import org.erp.practice.infrastructure.web.dto.JournalResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class JournalService implements JournalUseCase {

    private final JournalRepository      journalRepository;
    private final AccountRepository      accountRepository;
    private final FiscalPeriodRepository fiscalPeriodRepository;

    @Override
    @Transactional
    public JournalResponse createDraft(JournalCreateRequest request, Long userId) {
        // 1. 회계 기간 열려있는지 확인
        int year  = request.getPostDate().getYear();
        int month = request.getPostDate().getMonthValue();
        if (!fiscalPeriodRepository.isOpen(year, month)) {
            throw new IllegalStateException("회계 기간 %d년 %d월은 마감되었습니다.".formatted(year, month));
        }

        // 2. 도메인 검증: 차대 균형 체크 (계정과목 유효성 포함)
        validateAndBuildTransaction(request);

        // 3. 저장 (DRAFT 상태)
        return journalRepository.save(request, userId);
    }

    @Override
    @Transactional
    public JournalResponse post(Long journalId, Long approverId) {
        JournalResponse draft = journalRepository.findById(journalId)
                .orElseThrow(() -> new IllegalArgumentException("전표를 찾을 수 없습니다: " + journalId));

        if (!"DRAFT".equals(draft.getStatus())) {
            throw new IllegalStateException("DRAFT 상태의 전표만 승인할 수 있습니다. 현재 상태: " + draft.getStatus());
        }

        journalRepository.updateStatus(journalId, "POSTED", approverId);
        journalRepository.applyToAccountBalances(journalId);
        return journalRepository.findById(journalId).orElseThrow();
    }

    @Override
    @Transactional
    public JournalResponse cancel(Long journalId, Long userId) {
        JournalResponse original = journalRepository.findById(journalId)
                .orElseThrow(() -> new IllegalArgumentException("전표를 찾을 수 없습니다: " + journalId));

        // DRAFT는 역전표 없이 바로 취소
        if ("DRAFT".equals(original.getStatus())) {
            journalRepository.updateStatus(journalId, "CANCELLED", userId);
            return journalRepository.findById(journalId).orElseThrow();
        }

        if (!"POSTED".equals(original.getStatus())) {
            throw new IllegalStateException("DRAFT 또는 POSTED 상태의 전표만 취소할 수 있습니다.");
        }

        // 역전표: 원본의 차/대변을 뒤집어서 새 전표 생성
        JournalCreateRequest reversal = buildReversalRequest(original);
        JournalResponse reversalDraft = journalRepository.save(reversal, userId);

        // 역전표 바로 승인
        journalRepository.updateStatus(reversalDraft.getJournalId(), "POSTED", userId);

        // 원본 전표 CANCELLED 처리
        journalRepository.updateStatus(journalId, "CANCELLED", userId);

        return journalRepository.findById(reversalDraft.getJournalId()).orElseThrow();
    }

    @Override
    @Transactional(readOnly = true)
    public JournalResponse findById(Long journalId) {
        return journalRepository.findById(journalId)
                .orElseThrow(() -> new IllegalArgumentException("전표를 찾을 수 없습니다: " + journalId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<JournalResponse> findByFiscalPeriod(int year, int month) {
        return journalRepository.findByFiscalPeriod(year, month);
    }

    /**
     * 도메인 객체로 차대 균형 및 계정 유효성 검증
     * JournalTransaction 생성 시 UnbalancedTransactionException 자동 발생
     */
    private JournalTransaction validateAndBuildTransaction(JournalCreateRequest request) {
        JournalTransactionBuilder builder = JournalTransactionBuilder.create()
                .docDate(request.getDocDate())
                .postDate(request.getPostDate())
                .description(request.getDescription());

        for (JournalCreateRequest.LineRequest line : request.getLines()) {
            Account account = accountRepository.findByCode(line.getAccountCode())
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 계정과목: " + line.getAccountCode()));

            if (!account.isPostable()) {
                throw new IllegalArgumentException("전표 입력 불가능한 계정과목: " + line.getAccountCode());
            }

            String currency = line.getCurrency() != null ? line.getCurrency() : "KRW";
            if (AccountSide.DEBIT.name().equals(line.getAccountSide())) {
                builder.debit(line.getAccountCode(), line.getAmount(), currency, line.getDescription());
            } else {
                builder.credit(line.getAccountCode(), line.getAmount(), currency, line.getDescription());
            }
        }

        return builder.build(); // 여기서 차대 균형 검증
    }

    private JournalCreateRequest buildReversalRequest(JournalResponse original) {
        JournalCreateRequest reversal = new JournalCreateRequest();
        reversal.setDocDate(original.getDocDate());
        reversal.setPostDate(original.getPostDate());
        reversal.setDescription("[역전표] " + original.getDescription());

        List<JournalCreateRequest.LineRequest> reversedLines = original.getLines().stream()
                .map(line -> {
                    JournalCreateRequest.LineRequest r = new JournalCreateRequest.LineRequest();
                    r.setAccountCode(line.getAccountCode());
                    // 차변 ↔ 대변 반전
                    r.setAccountSide("DEBIT".equals(line.getAccountSide()) ? "CREDIT" : "DEBIT");
                    r.setAmount(line.getAmount());
                    r.setCurrency(line.getCurrency());
                    r.setDescription(line.getDescription());
                    return r;
                })
                .toList();

        reversal.setLines(reversedLines);
        return reversal;
    }
}
