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
@RequestMapping("/api/audit-logs")
@RequiredArgsConstructor
@Tag(name = "감사로그", description = "Audit Log API")
public class AuditLogController {

    private final DSLContext dsl;

    @GetMapping
    @Operation(summary = "감사 로그 목록")
    public ResponseEntity<List<Map<String, Object>>> list(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "50") int size,
            @RequestParam(required = false)    String tableName) {

        var base = dsl.select(
                        field("al.log_id"),
                        field("al.table_name"),
                        field("al.target_id"),
                        field("al.action"),
                        field("al.old_values"),
                        field("al.new_values"),
                        field("al.ip_address"),
                        field("al.created_at"),
                        field("u.display_name").as("user_name"))
                .from(table("audit_logs").as("al"))
                .leftJoin(table("users").as("u")).on(field("al.user_id").eq(field("u.user_id")))
                .where(tableName != null && !tableName.isBlank()
                        ? field("al.table_name").eq(tableName)
                        : noCondition());

        List<Map<String, Object>> rows = base
                .orderBy(field("al.log_id").desc())
                .limit(size).offset((long) page * size)
                .fetchMaps();

        return ResponseEntity.ok(rows);
    }
}
