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
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "사용자", description = "User Management")
public class UserController {

    private final DSLContext dsl;

    @GetMapping
    @Operation(summary = "사용자 목록 (역할 포함)")
    public ResponseEntity<List<Map<String, Object>>> list() {
        var rows = dsl.select(
                        field("u.user_id").as("userId"),
                        field("u.username").as("username"),
                        field("u.display_name").as("displayName"),
                        field("u.email").as("email"),
                        field("u.status").as("status"),
                        field("u.created_at").as("createdAt"),
                        field("GROUP_CONCAT(r.role_name ORDER BY r.role_name SEPARATOR ',')", String.class).as("roles"))
                .from(table("users").as("u"))
                .leftJoin(table("user_roles").as("ur")).on(field("u.user_id").eq(field("ur.user_id")))
                .leftJoin(table("roles").as("r")).on(field("ur.role_id").eq(field("r.role_id")))
                .groupBy(field("u.user_id"), field("u.username"), field("u.display_name"),
                         field("u.email"), field("u.status"), field("u.created_at"))
                .orderBy(field("u.user_id"))
                .fetchMaps();
        return ResponseEntity.ok(rows);
    }

    @GetMapping("/roles")
    @Operation(summary = "역할 목록")
    public ResponseEntity<List<Map<String, Object>>> listRoles() {
        return ResponseEntity.ok(
                dsl.select(
                                field("role_id").as("roleId"),
                                field("role_name").as("roleName"),
                                field("description").as("description"))
                        .from(table("roles"))
                        .orderBy(field("role_id"))
                        .fetchMaps());
    }

    @PatchMapping("/{userId}/status")
    @Operation(summary = "사용자 상태 변경 (ACTIVE ↔ INACTIVE)")
    public ResponseEntity<Void> toggleStatus(@PathVariable long userId) {
        dsl.execute(
                "UPDATE users SET status = CASE WHEN status='ACTIVE' THEN 'INACTIVE' ELSE 'ACTIVE' END WHERE user_id = ?",
                userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{userId}/roles/{roleName}")
    @Operation(summary = "역할 부여")
    public ResponseEntity<Void> addRole(@PathVariable long userId, @PathVariable String roleName) {
        Long roleId = dsl.select(field("role_id"))
                .from(table("roles"))
                .where(field("role_name").eq(roleName))
                .fetchOneInto(Long.class);
        if (roleId == null) return ResponseEntity.notFound().build();

        boolean exists = dsl.fetchExists(
                dsl.selectOne().from(table("user_roles"))
                        .where(field("user_id").eq(userId))
                        .and(field("role_id").eq(roleId)));
        if (!exists) {
            dsl.insertInto(table("user_roles"))
                    .set(field("user_id"), userId)
                    .set(field("role_id"), roleId)
                    .execute();
        }
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{userId}/roles/{roleName}")
    @Operation(summary = "역할 제거")
    public ResponseEntity<Void> removeRole(@PathVariable long userId, @PathVariable String roleName) {
        dsl.execute(
                "DELETE ur FROM user_roles ur JOIN roles r ON ur.role_id = r.role_id WHERE ur.user_id = ? AND r.role_name = ?",
                userId, roleName);
        return ResponseEntity.noContent().build();
    }
}
