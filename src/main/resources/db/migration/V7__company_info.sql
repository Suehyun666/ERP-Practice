-- ============================================================
-- V7: 회사 기본 정보 테이블
-- ============================================================
CREATE TABLE company_info (
    info_id            INT          NOT NULL DEFAULT 1,
    company_name       VARCHAR(200) NOT NULL COMMENT '회사명',
    business_no        VARCHAR(20)  NULL     COMMENT '사업자등록번호 (000-00-00000)',
    corp_no            VARCHAR(20)  NULL     COMMENT '법인등록번호',
    ceo_name           VARCHAR(100) NULL     COMMENT '대표자명',
    address            VARCHAR(500) NULL     COMMENT '사업장 주소',
    phone              VARCHAR(50)  NULL     COMMENT '대표전화',
    email              VARCHAR(255) NULL     COMMENT '대표이메일',
    fiscal_month_start TINYINT      NOT NULL DEFAULT 1 COMMENT '회계연도 시작월 (통상 1)',
    currency           VARCHAR(3)   NOT NULL DEFAULT 'KRW',
    updated_at         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (info_id)
) COMMENT = '회사 기본 정보 (단일 행)';

INSERT INTO company_info
    (info_id, company_name, business_no, corp_no, ceo_name, address, phone, email, fiscal_month_start, currency)
VALUES
    (1, 'ERP연습(주)', '000-00-00000', '000000-0000000', '홍길동',
     '서울특별시 강남구 테헤란로 123', '02-0000-0000', 'info@erp-practice.local', 1, 'KRW');
