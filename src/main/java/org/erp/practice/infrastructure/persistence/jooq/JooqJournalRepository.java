package org.erp.practice.infrastructure.persistence.jooq;

import lombok.RequiredArgsConstructor;
import org.erp.practice.application.port.out.JournalRepository;
import org.erp.practice.infrastructure.web.dto.JournalCreateRequest;
import org.erp.practice.infrastructure.web.dto.JournalResponse;
import org.jooq.DSLContext;
import org.jooq.Record;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;

import static org.jooq.impl.DSL.field;
import static org.jooq.impl.DSL.table;

@Repository
@RequiredArgsConstructor
public class JooqJournalRepository implements JournalRepository {

    private final DSLContext dsl;

    @Override
    public JournalResponse save(JournalCreateRequest request, Long userId) {
        int year  = request.getPostDate().getYear();
        int month = request.getPostDate().getMonthValue();
        String journalNo = generateJournalNo(year, month);

        // 전표 헤더 INSERT (MySQL은 RETURNING 미지원 → execute() 후 lastID())
        dsl.insertInto(table("journal_headers"))
                .set(field("journal_no"),   journalNo)
                .set(field("doc_date"),     request.getDocDate())
                .set(field("post_date"),    request.getPostDate())
                .set(field("fiscal_year"),  (short) year)
                .set(field("fiscal_month"), (byte) month)
                .set(field("status"),       "DRAFT")
                .set(field("description"),  request.getDescription())
                .set(field("dept_id"),      request.getDeptId())
                .set(field("created_by"),   userId)
                .execute();
        Long journalId = dsl.lastID().longValue();

        // 전표 라인 INSERT
        AtomicInteger lineNo = new AtomicInteger(1);
        for (JournalCreateRequest.LineRequest line : request.getLines()) {
            String currency = line.getCurrency() != null ? line.getCurrency() : "KRW";
            dsl.insertInto(table("journal_lines"))
                    .set(field("journal_id"),   journalId)
                    .set(field("line_no"),      (short) lineNo.getAndIncrement())
                    .set(field("account_code"), line.getAccountCode())
                    .set(field("account_side"), line.getAccountSide())
                    .set(field("amount"),       line.getAmount())
                    .set(field("currency"),     currency)
                    .set(field("description"),  line.getDescription())
                    .execute();
        }

        return findById(journalId).orElseThrow();
    }

    @Override
    public Optional<JournalResponse> findById(Long journalId) {
        Record headerRecord = dsl.select()
                .from(table("journal_headers"))
                .where(field("journal_id").eq(journalId))
                .fetchOne();

        if (headerRecord == null) return Optional.empty();

        List<JournalResponse.LineResponse> lines = dsl
                .select(
                        field("jl.line_id"),
                        field("jl.line_no"),
                        field("jl.account_code"),
                        field("coa.account_name"),
                        field("jl.account_side"),
                        field("jl.amount"),
                        field("jl.currency"),
                        field("jl.description")
                )
                .from(table("journal_lines").as("jl"))
                .join(table("chart_of_accounts").as("coa"))
                    .on(field("jl.account_code").eq(field("coa.account_code")))
                .where(field("jl.journal_id").eq(journalId))
                .orderBy(field("jl.line_no"))
                .fetch()
                .map(r -> JournalResponse.LineResponse.builder()
                        .lineId(r.get(field("jl.line_id"), Long.class))
                        .lineNo(r.get(field("jl.line_no"), Integer.class))
                        .accountCode(r.get(field("jl.account_code"), String.class))
                        .accountName(r.get(field("coa.account_name"), String.class))
                        .accountSide(r.get(field("jl.account_side"), String.class))
                        .amount(r.get(field("jl.amount"), java.math.BigDecimal.class))
                        .currency(r.get(field("jl.currency"), String.class))
                        .description(r.get(field("jl.description"), String.class))
                        .build());

        return Optional.of(JournalResponse.builder()
                .journalId(headerRecord.get(field("journal_id"), Long.class))
                .journalNo(headerRecord.get(field("journal_no"), String.class))
                .docDate(headerRecord.get(field("doc_date"), java.time.LocalDate.class))
                .postDate(headerRecord.get(field("post_date"), java.time.LocalDate.class))
                .status(headerRecord.get(field("status"), String.class))
                .description(headerRecord.get(field("description"), String.class))
                .createdBy(headerRecord.get(field("created_by"), Long.class))
                .createdAt(headerRecord.get(field("created_at"), LocalDateTime.class))
                .lines(lines)
                .build());
    }

    @Override
    public List<JournalResponse> findByFiscalPeriod(int year, int month) {
        return dsl.select(field("journal_id"))
                .from(table("journal_headers"))
                .where(field("fiscal_year").eq((short) year))
                .and(field("fiscal_month").eq((byte) month))
                .orderBy(field("journal_no"))
                .fetch(field("journal_id"), Long.class)
                .stream()
                .map(id -> findById(id).orElseThrow())
                .toList();
    }

    @Override
    public void updateStatus(Long journalId, String status, Long userId) {
        var update = dsl.update(table("journal_headers"))
                .set(field("status"), status);

        if ("POSTED".equals(status)) {
            update = update.set(field("posted_by"), userId)
                           .set(field("posted_at"), LocalDateTime.now());
            update.where(field("journal_id").eq(journalId)).execute();
            applyToAccountBalances(journalId); // 승인 시 잔액 스냅샷 반영
        } else if ("CANCELLED".equals(status)) {
            update = update.set(field("cancelled_by"), userId)
                           .set(field("cancelled_at"), LocalDateTime.now());
            update.where(field("journal_id").eq(journalId)).execute();
            // 취소 시엔 역전표가 별도로 POSTED되므로 잔액 조작 불필요
        } else {
            update.where(field("journal_id").eq(journalId)).execute();
        }
    }

    /**
     * 전표 승인 시 account_balances 스냅샷 갱신
     * journal_lines는 건드리지 않고 집계 테이블만 업데이트
     */
    private void applyToAccountBalances(Long journalId) {
        Record header = dsl.select(field("fiscal_year"), field("fiscal_month"))
                .from(table("journal_headers"))
                .where(field("journal_id").eq(journalId))
                .fetchOne();
        if (header == null) return;

        short year  = header.get(field("fiscal_year"),  Short.class);
        byte  month = header.get(field("fiscal_month"), Byte.class);

        dsl.select(field("account_code"), field("account_side"), field("amount"))
                .from(table("journal_lines"))
                .where(field("journal_id").eq(journalId))
                .fetch()
                .forEach(line -> {
                    String     code   = line.get(field("account_code"), String.class);
                    boolean    isDebit = "DEBIT".equals(line.get(field("account_side"), String.class));
                    java.math.BigDecimal amount = line.get(field("amount"), java.math.BigDecimal.class);

                    dsl.query("""
                        INSERT INTO account_balances
                            (account_code, fiscal_year, fiscal_month, currency, debit_total, credit_total, closing_balance)
                        VALUES (?, ?, ?, 'KRW', ?, ?, ?)
                        ON DUPLICATE KEY UPDATE
                            debit_total     = debit_total  + VALUES(debit_total),
                            credit_total    = credit_total + VALUES(credit_total),
                            closing_balance = closing_balance + VALUES(closing_balance)
                        """,
                        code, year, month,
                        isDebit  ? amount : java.math.BigDecimal.ZERO,
                        !isDebit ? amount : java.math.BigDecimal.ZERO,
                        isDebit  ? amount : amount.negate()
                    ).execute();
                });
    }

    @Override
    public String generateJournalNo(int year, int month) {
        // JNL-2026-03-000001 형식
        Long count = dsl.selectCount()
                .from(table("journal_headers"))
                .where(field("fiscal_year").eq((short) year))
                .and(field("fiscal_month").eq((byte) month))
                .fetchOneInto(Long.class);
        return "JNL-%d-%02d-%06d".formatted(year, month, (count == null ? 0 : count) + 1);
    }
}
