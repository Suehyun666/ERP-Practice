package org.erp.practice.infrastructure.web.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.erp.practice.application.port.in.AccountQueryUseCase;
import org.erp.practice.domain.account.Account;
import org.jooq.DSLContext;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

import static org.jooq.impl.DSL.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
@Tag(name = "계정과목", description = "Chart of Accounts API")
public class AccountController {

    private final AccountQueryUseCase accountQueryUseCase;
    private final DSLContext dsl;

    @GetMapping
    @Operation(summary = "전체 계정과목 조회")
    public ResponseEntity<List<Account>> findAll() {
        return ResponseEntity.ok(accountQueryUseCase.findAll());
    }

    @GetMapping("/postable")
    @Operation(summary = "전표 입력 가능한 계정과목 조회 (말단 계정만)")
    public ResponseEntity<List<Account>> findPostable() {
        return ResponseEntity.ok(accountQueryUseCase.findPostableAccounts());
    }

    @GetMapping("/{accountCode}")
    @Operation(summary = "계정과목 단건 조회")
    public ResponseEntity<Account> findByCode(@PathVariable String accountCode) {
        return accountQueryUseCase.findByCode(accountCode)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{parentCode}/children")
    @Operation(summary = "하위 계정과목 조회")
    public ResponseEntity<List<Account>> findChildren(@PathVariable String parentCode) {
        return ResponseEntity.ok(accountQueryUseCase.findChildren(parentCode));
    }

    @PostMapping
    @Operation(summary = "계정과목 추가")
    public ResponseEntity<Void> create(@RequestBody Map<String, Object> body) {
        String code       = (String) body.get("accountCode");
        String name       = (String) body.get("accountName");
        String type       = (String) body.get("accountType");
        String parentCode = (String) body.get("parentCode");
        // normalSide: ASSET/EXPENSE → DEBIT, others → CREDIT
        String normalSide = (type.equals("ASSET") || type.equals("EXPENSE")) ? "DEBIT" : "CREDIT";
        boolean isDetail  = body.get("isDetail") == null || Boolean.TRUE.equals(body.get("isDetail"));

        dsl.insertInto(table("chart_of_accounts"))
                .set(field("account_code"),  code)
                .set(field("account_name"),  name)
                .set(field("account_type"),  type)
                .set(field("normal_side"),   normalSide)
                .set(field("parent_code"),   parentCode)
                .set(field("is_detail"),     isDetail)
                .execute();
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{accountCode}/toggle")
    @Operation(summary = "계정과목 활성/비활성 토글")
    public ResponseEntity<Void> toggle(@PathVariable String accountCode) {
        dsl.execute(
                "UPDATE chart_of_accounts SET is_active = NOT is_active WHERE account_code = ?",
                accountCode);
        return ResponseEntity.ok().build();
    }
}
