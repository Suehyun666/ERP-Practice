package org.erp.practice.domain.journal;

import org.erp.practice.domain.account.AccountSide;

import javax.money.CurrencyUnit;
import javax.money.Monetary;
import javax.money.MonetaryAmount;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 회계 전표 도메인 객체 (복식부기 트랜잭션)
 * 레퍼런스: accounting 프로젝트의 AccountingTransaction
 *
 * 불변 규칙:
 * 1. 최소 2개 항목 (차변 1 + 대변 1)
 * 2. 통화별 차변합계 == 대변합계 (차대 균형)
 * 3. 승인 후 수정 불가 → status로 관리
 */
public class JournalTransaction {

    private final List<AccountingEntry> entries;
    private final LocalDate             docDate;
    private final LocalDate             postDate;
    private final String                description;

    JournalTransaction(List<AccountingEntry> entries, LocalDate docDate, LocalDate postDate, String description) {
        if (entries == null || entries.size() < 2) {
            throw new IllegalArgumentException("A transaction must have at least 2 entries");
        }
        if (!isBalanced(entries)) {
            throw new UnbalancedTransactionException(buildUnbalancedMessage(entries));
        }
        this.entries     = new ArrayList<>(entries);
        this.docDate     = docDate;
        this.postDate    = postDate;
        this.description = description;

        // 각 entry에 이 transaction을 연결하고 freeze
        this.entries.forEach(e -> e.assignTransaction(this));
    }

    /**
     * 통화별 차변합계 == 대변합계 검증
     */
    private boolean isBalanced(List<AccountingEntry> entries) {
        Map<CurrencyUnit, List<AccountingEntry>> byCurrency = entries.stream()
                .collect(Collectors.groupingBy(e -> e.getAmount().getCurrency()));

        for (Map.Entry<CurrencyUnit, List<AccountingEntry>> currencyGroup : byCurrency.entrySet()) {
            MonetaryAmount debitTotal  = sumBySide(currencyGroup.getValue(), AccountSide.DEBIT,  currencyGroup.getKey());
            MonetaryAmount creditTotal = sumBySide(currencyGroup.getValue(), AccountSide.CREDIT, currencyGroup.getKey());
            if (!debitTotal.isEqualTo(creditTotal)) {
                return false;
            }
        }
        return true;
    }

    private MonetaryAmount sumBySide(List<AccountingEntry> entries, AccountSide side, CurrencyUnit currency) {
        MonetaryAmount zero = Monetary.getDefaultAmountFactory()
                .setCurrency(currency).setNumber(0).create();
        return entries.stream()
                .filter(e -> e.getAccountSide() == side)
                .map(AccountingEntry::getAmount)
                .reduce(zero, MonetaryAmount::add);
    }

    private String buildUnbalancedMessage(List<AccountingEntry> entries) {
        MonetaryAmount debitTotal  = entries.stream().filter(AccountingEntry::isDebit)
                .map(AccountingEntry::getAmount)
                .reduce(entries.get(0).getAmount().subtract(entries.get(0).getAmount()), MonetaryAmount::add);
        MonetaryAmount creditTotal = entries.stream().filter(AccountingEntry::isCredit)
                .map(AccountingEntry::getAmount)
                .reduce(entries.get(0).getAmount().subtract(entries.get(0).getAmount()), MonetaryAmount::add);
        return "Transaction is not balanced. Debit: %s, Credit: %s".formatted(debitTotal, creditTotal);
    }

    public List<AccountingEntry> getEntries()   { return Collections.unmodifiableList(entries); }
    public LocalDate             getDocDate()   { return docDate; }
    public LocalDate             getPostDate()  { return postDate; }
    public String                getDescription() { return description; }
}
