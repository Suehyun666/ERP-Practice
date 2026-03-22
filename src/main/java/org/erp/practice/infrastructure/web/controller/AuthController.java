package org.erp.practice.infrastructure.web.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.erp.practice.infrastructure.web.dto.LoginRequest;
import org.erp.practice.infrastructure.web.dto.LoginResponse;
import org.erp.practice.infrastructure.web.dto.SignupRequest;
import org.jooq.DSLContext;
import org.jooq.Record;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.jooq.impl.DSL.field;
import static org.jooq.impl.DSL.table;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "인증", description = "Auth API")
public class AuthController {

    private final DSLContext dsl;

    /**
     * 단순 로그인: username + password_hash 평문 비교 (연습용)
     * 실제 운영에서는 BCryptPasswordEncoder 사용 필요
     */
    @PostMapping("/login")
    @Operation(summary = "로그인")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        Record user = dsl.select(
                        field("user_id"),
                        field("username"),
                        field("display_name"),
                        field("password_hash"),
                        field("status"))
                .from(table("users"))
                .where(field("username").eq(request.getUsername()))
                .fetchOne();

        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        if (!"ACTIVE".equals(user.get(field("status"), String.class))) {
            return ResponseEntity.status(403).build();
        }

        String storedPassword = user.get(field("password_hash"), String.class);
        if (!storedPassword.equals(request.getPassword())) {
            return ResponseEntity.status(401).build();
        }

        return ResponseEntity.ok(LoginResponse.builder()
                .userId(user.get(field("user_id"), Long.class))
                .username(user.get(field("username"), String.class))
                .displayName(user.get(field("display_name"), String.class))
                .build());
    }

    /**
     * 회원가입: username/email 중복 체크 후 INSERT
     * password는 평문 저장 (연습용 — 운영 시 BCrypt 필요)
     */
    @PostMapping("/signup")
    @Operation(summary = "회원가입")
    public ResponseEntity<LoginResponse> signup(@Valid @RequestBody SignupRequest request) {
        boolean usernameTaken = dsl.fetchExists(
                dsl.selectOne().from(table("users"))
                        .where(field("username").eq(request.getUsername())));
        if (usernameTaken) {
            throw new IllegalArgumentException("이미 사용 중인 아이디입니다: " + request.getUsername());
        }

        boolean emailTaken = dsl.fetchExists(
                dsl.selectOne().from(table("users"))
                        .where(field("email").eq(request.getEmail())));
        if (emailTaken) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다: " + request.getEmail());
        }

        // MySQL은 RETURNING 미지원 → execute() 후 lastID() 사용
        dsl.insertInto(table("users"))
                .set(field("username"),      request.getUsername())
                .set(field("password_hash"), request.getPassword())   // TODO: BCrypt
                .set(field("display_name"),  request.getDisplayName())
                .set(field("email"),         request.getEmail())
                .set(field("status"),        "ACTIVE")
                .execute();
        Long newUserId = dsl.lastID().longValue();

        // 기본 역할 부여 (JOURNAL_CREATOR)
        dsl.insertInto(table("user_roles"))
                .set(field("user_id"), newUserId)
                .set(field("role_id"),
                        dsl.select(field("role_id")).from(table("roles"))
                                .where(field("role_name").eq("JOURNAL_CREATOR"))
                                .fetchOne(field("role_id"), Long.class))
                .execute();

        return ResponseEntity.status(201).body(LoginResponse.builder()
                .userId(newUserId)
                .username(request.getUsername())
                .displayName(request.getDisplayName())
                .build());
    }
}
