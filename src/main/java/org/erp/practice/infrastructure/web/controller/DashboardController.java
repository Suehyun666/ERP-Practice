package org.erp.practice.infrastructure.web.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.erp.practice.infrastructure.web.dto.DashboardResponse;
import org.erp.practice.infrastructure.web.dto.DashboardResponse.*;
import org.jooq.DSLContext;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static org.jooq.impl.DSL.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Tag(name = "대시보드", description = "Dashboard API")
public class DashboardController {

    private final DSLContext dsl;

    @GetMapping
    @Operation(summary = "대시보드 집계 데이터")
    public ResponseEntity<DashboardResponse> getDashboard(
            @RequestParam int year,
            @RequestParam int month) {

        // ── 월별 수익/비용 트렌드 (해당 연도 전체) ──────────────────────
        var trendRows = dsl.select(
                        field("ab.fiscal_month"),
                        sum(field("CASE WHEN coa.account_type = 'REVENUE' THEN ab.credit_total ELSE 0 END", BigDecimal.class)).as("revenue"),
                        sum(field("CASE WHEN coa.account_type = 'EXPENSE' THEN ab.debit_total  ELSE 0 END", BigDecimal.class)).as("expenses"))
                .from(table("account_balances").as("ab"))
                .join(table("chart_of_accounts").as("coa"))
                    .on(field("ab.account_code").eq(field("coa.account_code")))
                .where(field("ab.fiscal_year").eq(year))
                .and(field("coa.account_type").in("REVENUE", "EXPENSE"))
                .groupBy(field("ab.fiscal_month"))
                .orderBy(field("ab.fiscal_month"))
                .fetch();

        Map<Integer, MonthTrend> trendMap = trendRows.stream()
                .collect(Collectors.toMap(
                        r -> r.get(field("ab.fiscal_month"), Integer.class),
                        r -> {
                            BigDecimal rev = nvl(r.get("revenue",  BigDecimal.class), BigDecimal.ZERO);
                            BigDecimal exp = nvl(r.get("expenses", BigDecimal.class), BigDecimal.ZERO);
                            return MonthTrend.builder()
                                    .month(r.get(field("ab.fiscal_month"), Integer.class))
                                    .revenue(rev).expenses(exp).netIncome(rev.subtract(exp))
                                    .build();
                        }));

        List<MonthTrend> monthlyTrend = new ArrayList<>();
        for (int m = 1; m <= 12; m++) {
            monthlyTrend.add(trendMap.getOrDefault(m,
                    MonthTrend.builder().month(m)
                            .revenue(BigDecimal.ZERO).expenses(BigDecimal.ZERO).netIncome(BigDecimal.ZERO)
                            .build()));
        }

        // ── 이번 달 KPI ────────────────────────────────────────────────
        MonthTrend cur = trendMap.getOrDefault(month,
                MonthTrend.builder().month(month)
                        .revenue(BigDecimal.ZERO).expenses(BigDecimal.ZERO).netIncome(BigDecimal.ZERO).build());

        // 현금 및 외상매출금 잔액 (누적 — 1 query)
        var balanceRows = dsl.select(
                        field("ab.account_code"),
                        sum(field("ab.closing_balance", BigDecimal.class)).as("balance"))
                .from(table("account_balances").as("ab"))
                .where(field("ab.account_code").in("110101", "110102", "110103", "110201", "110202"))
                .and(field("ab.fiscal_year").le(year))
                .and(field("ab.fiscal_year").lt(year)
                        .or(field("ab.fiscal_month").le(month)))
                .groupBy(field("ab.account_code"))
                .fetch();

        Map<String, BigDecimal> balanceMap = balanceRows.stream()
                .collect(Collectors.toMap(
                        r -> r.get(field("ab.account_code"), String.class),
                        r -> nvl(r.get("balance", BigDecimal.class), BigDecimal.ZERO)
                ));
        BigDecimal cashBalance = List.of("110101", "110102", "110103").stream()
                .map(c -> balanceMap.getOrDefault(c, BigDecimal.ZERO))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal arBalance = List.of("110201", "110202").stream()
                .map(c -> balanceMap.getOrDefault(c, BigDecimal.ZERO))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 전표 건수 (DRAFT / POSTED) 한번에 조회 (1 query)
        var countRows = dsl.select(field("status"), count().as("cnt"))
                .from(table("journal_headers"))
                .where(field("fiscal_year").eq((short) year))
                .and(field("fiscal_month").eq((byte) month))
                .and(field("status").in("DRAFT", "POSTED"))
                .groupBy(field("status"))
                .fetch();

        Map<String, Long> countMap = countRows.stream()
                .collect(Collectors.toMap(
                        r -> r.get(field("status"), String.class),
                        r -> r.get(field("cnt"), Long.class)
                ));
        long draftCount  = countMap.getOrDefault("DRAFT",  0L);
        long postedCount = countMap.getOrDefault("POSTED", 0L);

        // ── 비용 상위 항목 ─────────────────────────────────────────────
        var expRows = dsl.select(field("coa.account_name"), sum(field("ab.debit_total", BigDecimal.class)).as("total"))
                .from(table("account_balances").as("ab"))
                .join(table("chart_of_accounts").as("coa")).on(field("ab.account_code").eq(field("coa.account_code")))
                .where(field("coa.account_type").eq("EXPENSE"))
                .and(field("ab.fiscal_year").eq(year))
                .and(field("ab.fiscal_month").eq(month))
                .groupBy(field("coa.account_name"))
                .orderBy(field("total").desc())
                .limit(5)
                .fetch();

        List<AccountKpi> topExpenses = expRows.stream()
                .map(r -> AccountKpi.builder()
                        .accountName(r.get(field("coa.account_name"), String.class))
                        .amount(nvl(r.get("total", BigDecimal.class), BigDecimal.ZERO))
                        .build())
                .toList();

        return ResponseEntity.ok(DashboardResponse.builder()
                .currentMonth(MonthKpi.builder()
                        .year(year).month(month)
                        .revenue(cur.getRevenue()).expenses(cur.getExpenses()).netIncome(cur.getNetIncome())
                        .cashBalance(cashBalance).arBalance(arBalance)
                        .draftCount(draftCount).postedCount(postedCount)
                        .build())
                .monthlyTrend(monthlyTrend)
                .topExpenses(topExpenses)
                .build());
    }

    private static <T> T nvl(T value, T defaultValue) {
        return value != null ? value : defaultValue;
    }
}
