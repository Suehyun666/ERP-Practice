package org.erp.practice.domain.journal;

import org.erp.practice.domain.account.AccountSide;
import org.javamoney.moneta.Money;

import javax.money.MonetaryAmount;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * 전표 빌더 (레퍼런스: accounting 프로젝트의 AccountingTransactionBuilder)
 *
 * 사용 예:
 * JournalTransaction tx = JournalTransactionBuilder.create()
 *     .docDate(LocalDate.now())
 *     .postDate(LocalDate.now())
 *     .description("현금 매출")
 *     .debit("110101", new BigDecimal("100000"), "KRW", "현금 입금")
 *     .credit("4101",  new BigDecimal("100000"), "KRW", "매출 발생")
 *     .build();
 */
public class JournalTransactionBuilder {

    private LocalDate docDate;
    private LocalDate postDate;
    private String    description;
    private final List<AccountingEntry> entries = new ArrayList<>();

    private JournalTransactionBuilder() {}

    public static JournalTransactionBuilder create() {
        return new JournalTransactionBuilder();
    }

    public JournalTransactionBuilder docDate(LocalDate docDate) {
        this.docDate = docDate;
        return this;
    }

    public JournalTransactionBuilder postDate(LocalDate postDate) {
        this.postDate = postDate;
        return this;
    }

    public JournalTransactionBuilder description(String description) {
        this.description = description;
        return this;
    }

    public JournalTransactionBuilder debit(String accountCode, BigDecimal amount, String currencyCode, String description) {
        MonetaryAmount money = Money.of(amount, currencyCode);
        entries.add(new AccountingEntry(accountCode, AccountSide.DEBIT, money, description));
        return this;
    }

    public JournalTransactionBuilder credit(String accountCode, BigDecimal amount, String currencyCode, String description) {
        MonetaryAmount money = Money.of(amount, currencyCode);
        entries.add(new AccountingEntry(accountCode, AccountSide.CREDIT, money, description));
        return this;
    }

    public JournalTransaction build() {
        LocalDate doc  = docDate  != null ? docDate  : LocalDate.now();
        LocalDate post = postDate != null ? postDate : doc;
        return new JournalTransaction(entries, doc, post, description);
    }
}
