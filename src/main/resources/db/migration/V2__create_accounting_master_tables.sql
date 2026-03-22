-- ============================================================
-- V2: 회계 기준 정보 테이블 (Accounting Master)
-- ============================================================

-- 계정과목 마스터 (Chart of Accounts)
-- account_type: ASSET(자산) | LIABILITY(부채) | EQUITY(자본) | REVENUE(수익) | EXPENSE(비용)
-- normal_side:  DEBIT | CREDIT  (이 계정의 잔액이 증가하는 쪽)
--   자산·비용 → DEBIT 증가
--   부채·자본·수익 → CREDIT 증가
CREATE TABLE chart_of_accounts (
    account_code    VARCHAR(10)     NOT NULL COMMENT '계정 코드 (예: 10101)',
    account_name    VARCHAR(100)    NOT NULL COMMENT '계정명 (예: 현금)',
    account_type    VARCHAR(20)     NOT NULL COMMENT 'ASSET | LIABILITY | EQUITY | REVENUE | EXPENSE',
    normal_side     VARCHAR(10)     NOT NULL COMMENT 'DEBIT | CREDIT',
    parent_code     VARCHAR(10)     NULL     COMMENT '상위 계정 코드 (트리구조)',
    is_detail       BOOLEAN         NOT NULL DEFAULT TRUE  COMMENT '전표 입력 가능한 말단 계정 여부',
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    description     VARCHAR(255)    NULL,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (account_code),
    CONSTRAINT fk_coa_parent FOREIGN KEY (parent_code) REFERENCES chart_of_accounts (account_code)
) COMMENT = '계정과목 마스터 (Chart of Accounts)';

-- 회계 기간 (Fiscal Periods)
CREATE TABLE fiscal_periods (
    fiscal_year     SMALLINT        NOT NULL COMMENT '회계 연도 (예: 2026)',
    fiscal_month    TINYINT         NOT NULL COMMENT '월 (1~12)',
    status          VARCHAR(20)     NOT NULL DEFAULT 'OPEN' COMMENT 'OPEN | CLOSED | LOCKED',
    opened_at       DATETIME        NULL,
    closed_at       DATETIME        NULL,
    closed_by       BIGINT          NULL,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (fiscal_year, fiscal_month),
    CONSTRAINT fk_fp_closed_by FOREIGN KEY (closed_by) REFERENCES users (user_id)
) COMMENT = '회계 기간 및 마감 상태';

-- 분개 규칙 엔진 (Posting Rules)
-- 비즈니스 이벤트를 자동으로 차/대변 전표로 변환하는 규칙
CREATE TABLE posting_rules (
    rule_id         BIGINT          NOT NULL AUTO_INCREMENT,
    event_type      VARCHAR(50)     NOT NULL UNIQUE COMMENT '예: INSURANCE_PREMIUM_RECEIPT, SALARY_PAYMENT',
    debit_account   VARCHAR(10)     NOT NULL COMMENT '차변 계정코드',
    credit_account  VARCHAR(10)     NOT NULL COMMENT '대변 계정코드',
    description     VARCHAR(255)    NULL,
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (rule_id),
    CONSTRAINT fk_pr_debit  FOREIGN KEY (debit_account)  REFERENCES chart_of_accounts (account_code),
    CONSTRAINT fk_pr_credit FOREIGN KEY (credit_account) REFERENCES chart_of_accounts (account_code)
) COMMENT = '자동 분개 규칙 (Posting Rule Engine)';

-- ============================================================
-- 기본 한국 계정과목 데이터 (K-GAAP 기준 주요 계정)
-- ============================================================

-- 자산 (ASSET) - DEBIT 증가
INSERT INTO chart_of_accounts (account_code, account_name, account_type, normal_side, parent_code, is_detail) VALUES
    ('1',      '자산',              'ASSET',     'DEBIT', NULL,  FALSE),
    ('11',     '유동자산',          'ASSET',     'DEBIT', '1',   FALSE),
    ('1101',   '현금및현금성자산',  'ASSET',     'DEBIT', '11',  FALSE),
    ('110101', '현금',              'ASSET',     'DEBIT', '1101', TRUE),
    ('110102', '보통예금',          'ASSET',     'DEBIT', '1101', TRUE),
    ('110103', '당좌예금',          'ASSET',     'DEBIT', '1101', TRUE),
    ('1102',   '매출채권',          'ASSET',     'DEBIT', '11',  FALSE),
    ('110201', '외상매출금',        'ASSET',     'DEBIT', '1102', TRUE),
    ('110202', '받을어음',          'ASSET',     'DEBIT', '1102', TRUE),
    ('1103',   '미수금',            'ASSET',     'DEBIT', '11',  TRUE),
    ('1104',   '선급금',            'ASSET',     'DEBIT', '11',  TRUE),
    ('1105',   '재고자산',          'ASSET',     'DEBIT', '11',  TRUE),
    ('12',     '비유동자산',        'ASSET',     'DEBIT', '1',   FALSE),
    ('1201',   '유형자산',          'ASSET',     'DEBIT', '12',  FALSE),
    ('120101', '토지',              'ASSET',     'DEBIT', '1201', TRUE),
    ('120102', '건물',              'ASSET',     'DEBIT', '1201', TRUE),
    ('120103', '기계장치',          'ASSET',     'DEBIT', '1201', TRUE),
    ('120104', '차량운반구',        'ASSET',     'DEBIT', '1201', TRUE),
    ('1202',   '감가상각누계액',    'ASSET',     'CREDIT','12',  TRUE),
    ('1203',   '무형자산',          'ASSET',     'DEBIT', '12',  TRUE);

-- 부채 (LIABILITY) - CREDIT 증가
INSERT INTO chart_of_accounts (account_code, account_name, account_type, normal_side, parent_code, is_detail) VALUES
    ('2',      '부채',              'LIABILITY', 'CREDIT', NULL,  FALSE),
    ('21',     '유동부채',          'LIABILITY', 'CREDIT', '2',   FALSE),
    ('2101',   '매입채무',          'LIABILITY', 'CREDIT', '21',  FALSE),
    ('210101', '외상매입금',        'LIABILITY', 'CREDIT', '2101', TRUE),
    ('210102', '지급어음',          'LIABILITY', 'CREDIT', '2101', TRUE),
    ('2102',   '미지급금',          'LIABILITY', 'CREDIT', '21',  TRUE),
    ('2103',   '미지급비용',        'LIABILITY', 'CREDIT', '21',  TRUE),
    ('2104',   '선수금',            'LIABILITY', 'CREDIT', '21',  TRUE),
    ('2105',   '예수금',            'LIABILITY', 'CREDIT', '21',  TRUE),
    ('2106',   '단기차입금',        'LIABILITY', 'CREDIT', '21',  TRUE),
    ('22',     '비유동부채',        'LIABILITY', 'CREDIT', '2',   FALSE),
    ('2201',   '장기차입금',        'LIABILITY', 'CREDIT', '22',  TRUE),
    ('2202',   '퇴직급여충당부채',  'LIABILITY', 'CREDIT', '22',  TRUE);

-- 자본 (EQUITY) - CREDIT 증가
INSERT INTO chart_of_accounts (account_code, account_name, account_type, normal_side, parent_code, is_detail) VALUES
    ('3',      '자본',              'EQUITY',    'CREDIT', NULL,  FALSE),
    ('3101',   '자본금',            'EQUITY',    'CREDIT', '3',   TRUE),
    ('3102',   '자본잉여금',        'EQUITY',    'CREDIT', '3',   TRUE),
    ('3103',   '이익잉여금',        'EQUITY',    'CREDIT', '3',   TRUE),
    ('3104',   '당기순이익',        'EQUITY',    'CREDIT', '3',   TRUE);

-- 수익 (REVENUE) - CREDIT 증가
INSERT INTO chart_of_accounts (account_code, account_name, account_type, normal_side, parent_code, is_detail) VALUES
    ('4',      '수익',              'REVENUE',   'CREDIT', NULL,  FALSE),
    ('4101',   '매출액',            'REVENUE',   'CREDIT', '4',   TRUE),
    ('4102',   '서비스수익',        'REVENUE',   'CREDIT', '4',   TRUE),
    ('4103',   '이자수익',          'REVENUE',   'CREDIT', '4',   TRUE),
    ('4104',   '임대수익',          'REVENUE',   'CREDIT', '4',   TRUE),
    ('4105',   '잡수익',            'REVENUE',   'CREDIT', '4',   TRUE);

-- 비용 (EXPENSE) - DEBIT 증가
INSERT INTO chart_of_accounts (account_code, account_name, account_type, normal_side, parent_code, is_detail) VALUES
    ('5',      '비용',              'EXPENSE',   'DEBIT', NULL,  FALSE),
    ('5101',   '매출원가',          'EXPENSE',   'DEBIT', '5',   TRUE),
    ('5201',   '급여',              'EXPENSE',   'DEBIT', '5',   TRUE),
    ('5202',   '복리후생비',        'EXPENSE',   'DEBIT', '5',   TRUE),
    ('5203',   '여비교통비',        'EXPENSE',   'DEBIT', '5',   TRUE),
    ('5204',   '통신비',            'EXPENSE',   'DEBIT', '5',   TRUE),
    ('5205',   '소모품비',          'EXPENSE',   'DEBIT', '5',   TRUE),
    ('5206',   '임차료',            'EXPENSE',   'DEBIT', '5',   TRUE),
    ('5207',   '감가상각비',        'EXPENSE',   'DEBIT', '5',   TRUE),
    ('5208',   '이자비용',          'EXPENSE',   'DEBIT', '5',   TRUE),
    ('5209',   '세금과공과',        'EXPENSE',   'DEBIT', '5',   TRUE),
    ('5210',   '광고선전비',        'EXPENSE',   'DEBIT', '5',   TRUE),
    ('5211',   '잡비',              'EXPENSE',   'DEBIT', '5',   TRUE);

-- 기본 회계 기간 생성 (2026년 1~12월)
INSERT INTO fiscal_periods (fiscal_year, fiscal_month, status) VALUES
    (2026, 1, 'OPEN'), (2026, 2, 'OPEN'), (2026, 3, 'OPEN'),
    (2026, 4, 'OPEN'), (2026, 5, 'OPEN'), (2026, 6, 'OPEN'),
    (2026, 7, 'OPEN'), (2026, 8, 'OPEN'), (2026, 9, 'OPEN'),
    (2026, 10, 'OPEN'), (2026, 11, 'OPEN'), (2026, 12, 'OPEN');
