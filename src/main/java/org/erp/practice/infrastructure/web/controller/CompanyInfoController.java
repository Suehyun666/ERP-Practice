package org.erp.practice.infrastructure.web.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

import static org.jooq.impl.DSL.*;

@RestController
@RequestMapping("/api/company")
@RequiredArgsConstructor
@Tag(name = "회사정보", description = "Company Info")
public class CompanyInfoController {

    private final DSLContext dsl;

    @GetMapping
    @Operation(summary = "회사 정보 조회")
    public ResponseEntity<Map<String, Object>> get() {
        var row = dsl.select(
                        field("company_name").as("companyName"),
                        field("business_no").as("businessNo"),
                        field("corp_no").as("corpNo"),
                        field("ceo_name").as("ceoName"),
                        field("address").as("address"),
                        field("phone").as("phone"),
                        field("email").as("email"),
                        field("fiscal_month_start").as("fiscalMonthStart"),
                        field("currency").as("currency"),
                        field("updated_at").as("updatedAt"))
                .from(table("company_info"))
                .where(field("info_id").eq(1))
                .fetchOneMap();

        return row != null ? ResponseEntity.ok(row) : ResponseEntity.notFound().build();
    }

    @PutMapping
    @Operation(summary = "회사 정보 수정")
    public ResponseEntity<Void> update(@RequestBody Map<String, Object> body) {
        dsl.update(table("company_info"))
                .set(field("company_name"),        body.get("companyName"))
                .set(field("business_no"),          body.get("businessNo"))
                .set(field("corp_no"),              body.get("corpNo"))
                .set(field("ceo_name"),             body.get("ceoName"))
                .set(field("address"),              body.get("address"))
                .set(field("phone"),                body.get("phone"))
                .set(field("email"),                body.get("email"))
                .set(field("fiscal_month_start"),   body.get("fiscalMonthStart"))
                .where(field("info_id").eq(1))
                .execute();
        return ResponseEntity.ok().build();
    }
}
