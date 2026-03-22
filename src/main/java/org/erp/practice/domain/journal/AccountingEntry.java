package org.erp.practice.domain.journal;

import org.erp.practice.domain.account.AccountSide;

import javax.money.MonetaryAmount;
import java.util.Objects;

/**
 * 단건 분개 항목 (차변 또는 대변 한 줄)
 * 레퍼런스: accounting 프로젝트의 AccountingEntry
 * - amount는 항상 양수 (Moneta JSR 354)
 * - accountSide로 차/대변 구분
 */
public class AccountingEntry {

    private final String        accountCode;
    private final AccountSide   accountSide;
    private final MonetaryAmount amount;
    private final String        description;

    // 전표와 연결되면 freeze (레퍼런스 패턴)
    private JournalTransaction transaction;
    private boolean frozen = false;

    public AccountingEntry(String accountCode, AccountSide accountSide, MonetaryAmount amount, String description) {
        if (accountCode == null || accountCode.isBlank()) {
            throw new IllegalArgumentException("accountCode must not be blank");
        }
        if (amount == null || !amount.isPositive()) {
            throw new IllegalArgumentException("amount must be positive");
        }
        this.accountCode  = accountCode;
        this.accountSide  = Objects.requireNonNull(accountSide, "accountSide must not be null");
        this.amount       = amount;
        this.description  = description;
    }

    void assignTransaction(JournalTransaction transaction) {
        if (this.frozen) {
            throw new IllegalStateException("Entry is already assigned to a transaction");
        }
        this.transaction = transaction;
        this.frozen = true;
    }

    public String        getAccountCode()  { return accountCode; }
    public AccountSide   getAccountSide()  { return accountSide; }
    public MonetaryAmount getAmount()      { return amount; }
    public String        getDescription()  { return description; }
    public boolean       isDebit()         { return accountSide == AccountSide.DEBIT; }
    public boolean       isCredit()        { return accountSide == AccountSide.CREDIT; }
}
