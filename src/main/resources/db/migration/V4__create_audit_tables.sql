-- ============================================================
-- V4: 감사 및 이력 테이블 (Audit & Log)
-- ============================================================

-- 데이터 변경 이력 (Audit Trail) - Append-only, 삭제 불가
CREATE TABLE audit_logs (
    log_id          BIGINT          NOT NULL AUTO_INCREMENT,
    table_name      VARCHAR(100)    NOT NULL COMMENT '변경된 테이블명',
    target_id       VARCHAR(50)     NOT NULL COMMENT '변경된 레코드 PK',
    action          VARCHAR(20)     NOT NULL COMMENT 'INSERT | UPDATE | DELETE | POST | CANCEL',
    old_values      JSON            NULL     COMMENT '변경 전 값 (JSON)',
    new_values      JSON            NULL     COMMENT '변경 후 값 (JSON)',
    user_id         BIGINT          NULL     COMMENT '작업한 사용자',
    ip_address      VARCHAR(45)     NULL     COMMENT 'IPv4/IPv6',
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '변경 일시 (UTC)',
    PRIMARY KEY (log_id)
) COMMENT = '데이터 변경 이력 (K-SOX 감사 대응용)';

-- 시스템 접속 로그 - 개인정보보호법 대응용
CREATE TABLE access_logs (
    access_id       BIGINT          NOT NULL AUTO_INCREMENT,
    user_id         BIGINT          NULL     COMMENT 'NULL = 로그인 실패',
    username        VARCHAR(50)     NULL     COMMENT '시도한 username',
    ip_address      VARCHAR(45)     NOT NULL,
    endpoint        VARCHAR(255)    NOT NULL COMMENT '접근한 API 경로',
    http_method     VARCHAR(10)     NOT NULL,
    http_status     SMALLINT        NULL,
    result          VARCHAR(20)     NOT NULL COMMENT 'SUCCESS | FAILURE | UNAUTHORIZED',
    accessed_at     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '접속 일시 (UTC)',
    PRIMARY KEY (access_id),
    INDEX idx_al_user (user_id),
    INDEX idx_al_time (accessed_at)
) COMMENT = '시스템 접속 로그 (개인정보보호법 1~2년 보관 의무)';

-- 인덱스 (성능 최적화)
CREATE INDEX idx_jh_post_date    ON journal_headers (post_date);
CREATE INDEX idx_jh_status       ON journal_headers (status);
CREATE INDEX idx_jh_created_by   ON journal_headers (created_by);
CREATE INDEX idx_jh_fiscal       ON journal_headers (fiscal_year, fiscal_month);
CREATE INDEX idx_jl_account      ON journal_lines (account_code);
CREATE INDEX idx_jl_journal      ON journal_lines (journal_id);
CREATE INDEX idx_audit_table     ON audit_logs (table_name, target_id);
CREATE INDEX idx_audit_user      ON audit_logs (user_id);
CREATE INDEX idx_audit_time      ON audit_logs (created_at);
