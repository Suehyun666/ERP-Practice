package org.erp.practice.infrastructure.persistence.jooq;

import lombok.RequiredArgsConstructor;
import org.erp.practice.application.port.out.ReportRepository;
import org.erp.practice.infrastructure.web.dto.FinancialStatementResponse;
import org.erp.practice.infrastructure.web.dto.FinancialStatementResponse.Item;
import org.erp.practice.infrastructure.web.dto.FinancialStatementResponse.Section;
import org.erp.practice.infrastructure.web.dto.TrialBalanceResponse;
import org.erp.practice.infrastructure.web.dto.TrialBalanceResponse.Row;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.IntStream;

import static org.jooq.impl.DSL.*;

@Repository
@RequiredArgsConstructor
public class JooqReportRepository implements ReportRepository {

    private final DSLContext dsl;

    @Override
    public TrialBalanceResponse queryTrialBalance(int year, int month) {
        var rows = dsl
                .select(
                        field("coa.account_code").as("account_code"),
                        field("coa.account_name").as("account_name"),
                        field("coa.account_type").as("account_type"),
                        coalesce(field("ab.opening_balance", BigDecimal.class), inline(BigDecimal.ZERO)).as("opening_balance"),
                        coalesce(field("ab.debit_total",     BigDecimal.class), inline(BigDecimal.ZERO)).as("debit_total"),
                        coalesce(field("ab.credit_total",    BigDecimal.class), inline(BigDecimal.ZERO)).as("credit_total"),
                        coalesce(field("ab.closing_balance", BigDecimal.class), inline(BigDecimal.ZERO)).as("closing_balance")
                )
                .from(table("chart_of_accounts").as("coa"))
                .leftJoin(table("account_balances").as("ab"))
                    .on(field("ab.account_code").eq(field("coa.account_code"))
                        .and(field("ab.fiscal_year").eq(inline((short) year)))
                        .and(field("ab.fiscal_month").eq(inline((byte) month))))
                .where(field("coa.is_detail").isTrue())
                .and(field("coa.is_active").isTrue())
                .orderBy(field("coa.account_code"))
                .fetch();

        List<Row> trialRows = rows.stream()
                .map(r -> Row.builder()
                        .accountCode(r.get("account_code",    String.class))
                        .accountName(r.get("account_name",    String.class))
                        .accountType(r.get("account_type",    String.class))
                        .openingBalance(r.get("opening_balance", BigDecimal.class))
                        .debitTotal(r.get("debit_total",      BigDecimal.class))
                        .creditTotal(r.get("credit_total",    BigDecimal.class))
                        .closingBalance(r.get("closing_balance", BigDecimal.class))
                        .build())
                .toList();

        BigDecimal totalDebit  = trialRows.stream().map(Row::getDebitTotal).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalCredit = trialRows.stream().map(Row::getCreditTotal).reduce(BigDecimal.ZERO, BigDecimal::add);

        return TrialBalanceResponse.builder()
                .fiscalYear(year)
                .fiscalMonth(month)
                .generatedAt(LocalDateTime.now())
                .isBalanced(totalDebit.compareTo(totalCredit) == 0)
                .totalDebit(totalDebit)
                .totalCredit(totalCredit)
                .rows(trialRows)
                .build();
    }

    @Override
    public FinancialStatementResponse queryBalanceSheet(int year, int month) {
        var rows = dsl
                .select(
                        field("coa.account_code").as("account_code"),
                        field("coa.account_name").as("account_name"),
                        field("coa.account_type").as("account_type"),
                        coalesce(sum(field("ab.closing_balance", BigDecimal.class)), inline(BigDecimal.ZERO)).as("balance")
                )
                .from(table("chart_of_accounts").as("coa"))
                .leftJoin(table("account_balances").as("ab"))
                    .on(field("ab.account_code").eq(field("coa.account_code"))
                        .and(field("ab.fiscal_year").lessOrEqual(inline((short) year)))
                        .and(field("ab.fiscal_year").lessThan(inline((short) year))
                            .or(field("ab.fiscal_month").lessOrEqual(inline((byte) month)))))
                .where(field("coa.account_type").in("ASSET", "LIABILITY", "EQUITY"))
                .and(field("coa.is_detail").isTrue())
                .and(field("coa.is_active").isTrue())
                .groupBy(field("coa.account_code"), field("coa.account_name"), field("coa.account_type"))
                .orderBy(field("coa.account_code"))
                .fetch();

        // Negate liability/equity so all balance sheet amounts display as positive
        List<AccountRow> accountRows = rows.stream()
                .map(r -> {
                    String type    = r.get("account_type", String.class);
                    BigDecimal bal = r.get("balance", BigDecimal.class);
                    BigDecimal displayed = "ASSET".equals(type) ? bal : bal.negate();
                    return new AccountRow(r.get("account_code", String.class),
                                         r.get("account_name", String.class),
                                         type, displayed);
                })
                .toList();

        // Compute YTD net income from REVENUE/EXPENSE closing_balance
        BigDecimal closingSum = dsl
                .select(coalesce(sum(field("ab.closing_balance", BigDecimal.class)), inline(BigDecimal.ZERO)))
                .from(table("chart_of_accounts").as("coa"))
                .leftJoin(table("account_balances").as("ab"))
                    .on(field("ab.account_code").eq(field("coa.account_code"))
                        .and(field("ab.fiscal_year").lessOrEqual(inline((short) year)))
                        .and(field("ab.fiscal_year").lessThan(inline((short) year))
                            .or(field("ab.fiscal_month").lessOrEqual(inline((byte) month)))))
                .where(field("coa.account_type").in("REVENUE", "EXPENSE"))
                .and(field("coa.is_detail").isTrue())
                .and(field("coa.is_active").isTrue())
                .fetchOne(0, BigDecimal.class);
        // revenue closing is negative, expense closing is positive
        // → negate the sum to get net income (positive = profit)
        BigDecimal ytdNetIncome = closingSum != null ? closingSum.negate() : BigDecimal.ZERO;

        List<Section> sections = new ArrayList<>(buildSections(accountRows));

        // Inject 당기순이익 into 자본 section (positive, matching our negated convention)
        if (ytdNetIncome.compareTo(BigDecimal.ZERO) != 0) {
            Item netIncomeItem = Item.builder()
                    .accountCode("X-NET")
                    .accountName("당기순이익")
                    .amount(ytdNetIncome)
                    .build();
            int equityIdx = IntStream.range(0, sections.size())
                    .filter(i -> "자본".equals(sections.get(i).getSectionName()))
                    .findFirst().orElse(-1);
            if (equityIdx >= 0) {
                Section old = sections.get(equityIdx);
                List<Item> items = new ArrayList<>(old.getItems());
                items.add(netIncomeItem);
                BigDecimal newSub = items.stream().map(Item::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
                sections.set(equityIdx, Section.builder()
                        .sectionName("자본").items(items).subtotal(newSub).build());
            } else {
                sections.add(Section.builder()
                        .sectionName("자본")
                        .items(List.of(netIncomeItem))
                        .subtotal(ytdNetIncome)
                        .build());
            }
        }

        return FinancialStatementResponse.builder()
                .statementType("BALANCE_SHEET")
                .fiscalYear(year)
                .fiscalMonth(month)
                .generatedAt(LocalDateTime.now())
                .sections(sections)
                .build();
    }

    @Override
    public FinancialStatementResponse queryIncomeStatement(int year, int month) {
        var rows = dsl
                .select(
                        field("coa.account_code").as("account_code"),
                        field("coa.account_name").as("account_name"),
                        field("coa.account_type").as("account_type"),
                        coalesce(field("ab.debit_total",  BigDecimal.class), inline(BigDecimal.ZERO)).as("debit_total"),
                        coalesce(field("ab.credit_total", BigDecimal.class), inline(BigDecimal.ZERO)).as("credit_total")
                )
                .from(table("chart_of_accounts").as("coa"))
                .leftJoin(table("account_balances").as("ab"))
                    .on(field("ab.account_code").eq(field("coa.account_code"))
                        .and(field("ab.fiscal_year").eq(inline((short) year)))
                        .and(field("ab.fiscal_month").eq(inline((byte) month))))
                .where(field("coa.account_type").in("REVENUE", "EXPENSE"))
                .and(field("coa.is_detail").isTrue())
                .and(field("coa.is_active").isTrue())
                .orderBy(field("coa.account_code"))
                .fetch();

        List<Section> sections = buildSections(
                rows.stream()
                        .map(r -> {
                            BigDecimal debit  = r.get("debit_total",  BigDecimal.class);
                            BigDecimal credit = r.get("credit_total", BigDecimal.class);
                            String type = r.get("account_type", String.class);
                            // REVENUE: credit - debit, EXPENSE: debit - credit
                            BigDecimal balance = "EXPENSE".equals(type)
                                    ? debit.subtract(credit)
                                    : credit.subtract(debit);
                            return new AccountRow(
                                    r.get("account_code", String.class),
                                    r.get("account_name", String.class),
                                    type,
                                    balance);
                        })
                        .toList()
        );

        return FinancialStatementResponse.builder()
                .statementType("INCOME_STATEMENT")
                .fiscalYear(year)
                .fiscalMonth(month)
                .generatedAt(LocalDateTime.now())
                .sections(sections)
                .build();
    }

    private List<Section> buildSections(List<AccountRow> accountRows) {
        Map<String, List<Item>> grouped = new LinkedHashMap<>();

        for (AccountRow row : accountRows) {
            grouped.computeIfAbsent(accountTypeLabel(row.type()), k -> new ArrayList<>())
                    .add(Item.builder()
                            .accountCode(row.code())
                            .accountName(row.name())
                            .amount(row.balance() != null ? row.balance() : BigDecimal.ZERO)
                            .build());
        }

        return grouped.entrySet().stream()
                .map(e -> {
                    BigDecimal subtotal = e.getValue().stream()
                            .map(Item::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
                    return Section.builder()
                            .sectionName(e.getKey())
                            .items(e.getValue())
                            .subtotal(subtotal)
                            .build();
                })
                .toList();
    }

    private String accountTypeLabel(String type) {
        return switch (type) {
            case "ASSET"     -> "자산";
            case "LIABILITY" -> "부채";
            case "EQUITY"    -> "자본";
            case "REVENUE"   -> "수익";
            case "EXPENSE"   -> "비용";
            default          -> type;
        };
    }

    private record AccountRow(String code, String name, String type, BigDecimal balance) {}
}
