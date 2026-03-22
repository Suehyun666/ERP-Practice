-- ============================================================
-- V1: 조직 및 사용자 테이블 (Organization & Identity)
-- ============================================================

CREATE TABLE departments (
    dept_id      BIGINT          NOT NULL AUTO_INCREMENT,
    dept_code    VARCHAR(20)     NOT NULL UNIQUE COMMENT '부서 코드 (예: DEPT-001)',
    dept_name    VARCHAR(100)    NOT NULL COMMENT '부서명',
    parent_dept_id BIGINT        NULL     COMMENT '상위 부서 ID (트리구조)',
    is_active    BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (dept_id),
    CONSTRAINT fk_dept_parent FOREIGN KEY (parent_dept_id) REFERENCES departments (dept_id)
) COMMENT = '부서 정보 (Cost Center 역할)';

CREATE TABLE users (
    user_id       BIGINT          NOT NULL AUTO_INCREMENT,
    username      VARCHAR(50)     NOT NULL UNIQUE COMMENT '로그인 ID',
    password_hash VARCHAR(255)    NOT NULL,
    display_name  VARCHAR(100)    NOT NULL COMMENT '표시 이름',
    email         VARCHAR(255)    NOT NULL UNIQUE,
    status        VARCHAR(20)     NOT NULL DEFAULT 'ACTIVE' COMMENT 'ACTIVE | INACTIVE | LOCKED',
    created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id)
) COMMENT = '시스템 사용자 계정';

CREATE TABLE employees (
    emp_id      BIGINT          NOT NULL AUTO_INCREMENT,
    user_id     BIGINT          NULL     COMMENT '연결된 시스템 계정 (1:1)',
    emp_name    VARCHAR(100)    NOT NULL,
    dept_id     BIGINT          NOT NULL,
    position    VARCHAR(50)     NULL     COMMENT '직위 (예: 과장, 팀장)',
    hire_date   DATE            NOT NULL,
    is_active   BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (emp_id),
    CONSTRAINT fk_emp_user FOREIGN KEY (user_id) REFERENCES users (user_id),
    CONSTRAINT fk_emp_dept FOREIGN KEY (dept_id) REFERENCES departments (dept_id)
) COMMENT = '직원 정보';

CREATE TABLE roles (
    role_id     BIGINT          NOT NULL AUTO_INCREMENT,
    role_name   VARCHAR(50)     NOT NULL UNIQUE COMMENT '예: JOURNAL_CREATOR, JOURNAL_APPROVER, ADMIN',
    description VARCHAR(255)    NULL,
    PRIMARY KEY (role_id)
) COMMENT = '역할 정의 (직무분리 SoD용)';

CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_ur_user FOREIGN KEY (user_id) REFERENCES users (user_id),
    CONSTRAINT fk_ur_role FOREIGN KEY (role_id) REFERENCES roles (role_id)
) COMMENT = '사용자-역할 매핑';

-- 기본 역할 데이터
INSERT INTO roles (role_name, description) VALUES
    ('ADMIN',            '시스템 관리자'),
    ('JOURNAL_CREATOR',  '전표 입력 담당자'),
    ('JOURNAL_APPROVER', '전표 승인 담당자'),
    ('REPORT_VIEWER',    '보고서 조회 담당자');

-- 기본 관리자 계정 (임시, 인증 미구현 상태에서 FK 충족용)
-- password_hash 컬럼에 평문 저장 (연습용 — 실제 운영 시 BCrypt 필요)
INSERT INTO users (user_id, username, password_hash, display_name, email, status)
VALUES (1, 'admin', 'admin123', '관리자', 'admin@erp.local', 'ACTIVE');

INSERT INTO user_roles (user_id, role_id)
SELECT 1, role_id FROM roles WHERE role_name = 'ADMIN';
