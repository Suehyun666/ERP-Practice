package org.erp.practice.infrastructure.web.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import static org.jooq.impl.DSL.*;

@RestController
@RequestMapping("/api/posting-rules")
@RequiredArgsConstructor
@Tag(name = "분개규칙", description = "Posting Rule Engine")
public class PostingRuleController {

    private final DSLContext dsl;

    @GetMapping
    @Operation(summary = "분개 규칙 목록")
    public ResponseEntity<List<Map<String, Object>>> list() {
        return ResponseEntity.ok(
                dsl.select(
                                field("pr.rule_id"),
                                field("pr.event_type"),
                                field("pr.description"),
                                field("pr.is_active"),
                                field("pr.debit_account"),
                                field("da.account_name").as("debit_account_name"),
                                field("pr.credit_account"),
                                field("ca.account_name").as("credit_account_name"))
                        .from(table("posting_rules").as("pr"))
                        .join(table("chart_of_accounts").as("da")).on(field("pr.debit_account").eq(field("da.account_code")))
                        .join(table("chart_of_accounts").as("ca")).on(field("pr.credit_account").eq(field("ca.account_code")))
                        .orderBy(field("pr.rule_id"))
                        .fetchMaps());
    }

    @PostMapping
    @Operation(summary = "분개 규칙 생성")
    public ResponseEntity<Map<String, Object>> create(@RequestBody Map<String, Object> body) {
        dsl.insertInto(table("posting_rules"))
                .set(field("event_type"),    body.get("eventType"))
                .set(field("debit_account"),  body.get("debitAccount"))
                .set(field("credit_account"), body.get("creditAccount"))
                .set(field("description"),    body.get("description"))
                .execute();
        return ResponseEntity.ok(Map.of("ok", true));
    }

    @PatchMapping("/{ruleId}/toggle")
    @Operation(summary = "분개 규칙 활성/비활성 토글")
    public ResponseEntity<Void> toggle(@PathVariable long ruleId) {
        dsl.execute("UPDATE posting_rules SET is_active = NOT is_active WHERE rule_id = ?", ruleId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{ruleId}")
    @Operation(summary = "분개 규칙 삭제")
    public ResponseEntity<Void> delete(@PathVariable long ruleId) {
        dsl.deleteFrom(table("posting_rules"))
                .where(field("rule_id").eq(ruleId))
                .execute();
        return ResponseEntity.noContent().build();
    }
}
