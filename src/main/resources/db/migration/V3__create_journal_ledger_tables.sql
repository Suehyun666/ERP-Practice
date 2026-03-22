-- ============================================================
-- V3: 전표 및 원장 테이블 (Journal & Ledger)
-- ============================================================

-- 전표 헤더 (SAP BKPF 스타일)
-- status: DRAFT(임시저장) | POSTED(승인완료) | CANCELLED(역전표처리됨)
CREATE TABLE journal_headers (
    journal_id      BIGINT          NOT NULL AUTO_INCREMENT,
    journal_no      VARCHAR(20)     NOT NULL UNIQUE COMMENT '전표번호 (예: JNL-2026-000001)',
    doc_date        DATE            NOT NULL COMMENT '증빙일자 (영수증 날짜)',
    post_date       DATE            NOT NULL COMMENT '전기일자 (장부 반영 날짜)',
    fiscal_year     SMALLINT        NOT NULL,
    fiscal_month    TINYINT         NOT NULL,
    status          VARCHAR(20)     NOT NULL DEFAULT 'DRAFT' COMMENT 'DRAFT | POSTED | CANCELLED',
    description     VARCHAR(500)    NULL     COMMENT '전표 적요',
    dept_id         BIGINT          NULL     COMMENT '발생 부서',
    created_by      BIGINT          NOT NULL COMMENT '작성자',
    posted_by       BIGINT          NULL     COMMENT '승인자',
    posted_at       DATETIME        NULL     COMMENT '승인 일시',
    cancelled_by    BIGINT          NULL,
    cancelled_at    DATETIME        NULL,
    cancel_journal_id BIGINT        NULL     COMMENT '역전표 시 원본 전표 ID',
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (journal_id),
    CONSTRAINT fk_jh_period   FOREIGN KEY (fiscal_year, fiscal_month) REFERENCES fiscal_periods (fiscal_year, fiscal_month),
    CONSTRAINT fk_jh_dept     FOREIGN KEY (dept_id)     REFERENCES departments (dept_id),
    CONSTRAINT fk_jh_created  FOREIGN KEY (created_by)  REFERENCES users (user_id),
    CONSTRAINT fk_jh_posted   FOREIGN KEY (posted_by)   REFERENCES users (user_id),
    CONSTRAINT fk_jh_cancel   FOREIGN KEY (cancelled_by) REFERENCES users (user_id)
) COMMENT = '전표 헤더 (Journal Header)';

-- 전표 상세 라인 (SAP BSEG 스타일)
-- account_side: DEBIT(차변) | CREDIT(대변)
-- amount: 항상 양수, account_side로 차/대변 구분
CREATE TABLE journal_lines (
    line_id         BIGINT          NOT NULL AUTO_INCREMENT,
    journal_id      BIGINT          NOT NULL,
    line_no         SMALLINT        NOT NULL COMMENT '라인 순번 (전표 내 1,2,3...)',
    account_code    VARCHAR(10)     NOT NULL COMMENT '계정과목 코드',
    account_side    VARCHAR(10)     NOT NULL COMMENT 'DEBIT | CREDIT',
    amount          DECIMAL(18, 2)  NOT NULL COMMENT '금액 (항상 양수)',
    currency        VARCHAR(3)      NOT NULL DEFAULT 'KRW' COMMENT '통화 코드 (ISO 4217)',
    description     VARCHAR(255)    NULL     COMMENT '라인 적요',
    dept_id         BIGINT          NULL     COMMENT '비용 귀속 부서',
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (line_id),
    CONSTRAINT fk_jl_journal  FOREIGN KEY (journal_id)   REFERENCES journal_headers (journal_id),
    CONSTRAINT fk_jl_account  FOREIGN KEY (account_code) REFERENCES chart_of_accounts (account_code),
    CONSTRAINT fk_jl_dept     FOREIGN KEY (dept_id)      REFERENCES departments (dept_id),
    CONSTRAINT chk_jl_amount  CHECK (amount > 0),
    CONSTRAINT chk_jl_side    CHECK (account_side IN ('DEBIT', 'CREDIT')),
    UNIQUE KEY uk_journal_line (journal_id, line_no)
) COMMENT = '전표 상세 라인 (Journal Line)';

-- 계정별 월별 잔액 스냅샷 (Account Balances)
-- 전표 승인 시 업데이트 → 보고서 고속 조회용
CREATE TABLE account_balances (
    account_code    VARCHAR(10)     NOT NULL,
    fiscal_year     SMALLINT        NOT NULL,
    fiscal_month    TINYINT         NOT NULL,
    currency        VARCHAR(3)      NOT NULL DEFAULT 'KRW',
    opening_balance DECIMAL(18, 2)  NOT NULL DEFAULT 0.00 COMMENT '기초 잔액',
    debit_total     DECIMAL(18, 2)  NOT NULL DEFAULT 0.00 COMMENT '당월 차변 합계',
    credit_total    DECIMAL(18, 2)  NOT NULL DEFAULT 0.00 COMMENT '당월 대변 합계',
    closing_balance DECIMAL(18, 2)  NOT NULL DEFAULT 0.00 COMMENT '기말 잔액 (= 기초 + 차변 - 대변, 정규화 계정 기준)',
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (account_code, fiscal_year, fiscal_month, currency),
    CONSTRAINT fk_ab_account FOREIGN KEY (account_code) REFERENCES chart_of_accounts (account_code),
    CONSTRAINT fk_ab_period  FOREIGN KEY (fiscal_year, fiscal_month) REFERENCES fiscal_periods (fiscal_year, fiscal_month)
) COMMENT = '계정별 월별 잔액 스냅샷 (성능 최적화용)';
