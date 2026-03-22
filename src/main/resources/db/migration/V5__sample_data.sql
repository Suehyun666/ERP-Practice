-- ============================================================
-- V5: 샘플 데이터 (스타트업 "ERP연습(주)" 2026년 1~3월 시나리오)
-- ============================================================
-- 시나리오:
--   1월: 법인 설립 (자본금 납입, 사무실 보증금, 집기 구입, 단기차입)
--   2월: 본격 영업 시작 (서비스 매출, 급여, 임차료, 통신비)
--   3월: 성장 (매출 증가, 광고비, 이자비용)
-- ============================================================

-- ============================================================
-- 1월 전표
-- ============================================================

-- [1] 법인 설립: 주주가 현금 50,000,000원 출자
INSERT INTO journal_headers (journal_no, doc_date, post_date, fiscal_year, fiscal_month, status, description, created_by, posted_by, posted_at)
VALUES ('JNL-2026-01-000001', '2026-01-02', '2026-01-02', 2026, 1, 'POSTED', '자본금 납입 - 법인 설립', 1, 1, '2026-01-02 09:00:00');

SET @h1 = LAST_INSERT_ID();
INSERT INTO journal_lines (journal_id, line_no, account_code, account_side, amount, currency, description) VALUES
(@h1, 1, '110101', 'DEBIT',  50000000, 'KRW', '설립 출자금'),
(@h1, 2, '3101',   'CREDIT', 50000000, 'KRW', '자본금');

-- [2] 은행 단기차입: 보통예금으로 20,000,000원 차입
INSERT INTO journal_headers (journal_no, doc_date, post_date, fiscal_year, fiscal_month, status, description, created_by, posted_by, posted_at)
VALUES ('JNL-2026-01-000002', '2026-01-03', '2026-01-03', 2026, 1, 'POSTED', '은행 단기차입금 수령', 1, 1, '2026-01-03 09:00:00');

SET @h2 = LAST_INSERT_ID();
INSERT INTO journal_lines (journal_id, line_no, account_code, account_side, amount, currency, description) VALUES
(@h2, 1, '110102', 'DEBIT',  20000000, 'KRW', '국민은행 보통예금'),
(@h2, 2, '2106',   'CREDIT', 20000000, 'KRW', '단기차입금');

-- [3] 사무실 보증금 지급: 현금 10,000,000원
INSERT INTO journal_headers (journal_no, doc_date, post_date, fiscal_year, fiscal_month, status, description, created_by, posted_by, posted_at)
VALUES ('JNL-2026-01-000003', '2026-01-05', '2026-01-05', 2026, 1, 'POSTED', '사무실 임대 보증금', 1, 1, '2026-01-05 09:00:00');

SET @h3 = LAST_INSERT_ID();
INSERT INTO journal_lines (journal_id, line_no, account_code, account_side, amount, currency, description) VALUES
(@h3, 1, '1104',   'DEBIT',  10000000, 'KRW', '사무실 보증금(선급금)'),
(@h3, 2, '110101', 'CREDIT', 10000000, 'KRW', '현금 지급');

-- [4] 컴퓨터·집기 구입: 보통예금 5,000,000원
INSERT INTO journal_headers (journal_no, doc_date, post_date, fiscal_year, fiscal_month, status, description, created_by, posted_by, posted_at)
VALUES ('JNL-2026-01-000004', '2026-01-06', '2026-01-06', 2026, 1, 'POSTED', '업무용 컴퓨터 및 집기 구입', 1, 1, '2026-01-06 09:00:00');

SET @h4 = LAST_INSERT_ID();
INSERT INTO journal_lines (journal_id, line_no, account_code, account_side, amount, currency, description) VALUES
(@h4, 1, '120103', 'DEBIT',  5000000, 'KRW', '컴퓨터·집기(기계장치)'),
(@h4, 2, '110102', 'CREDIT', 5000000, 'KRW', '보통예금 지급');

-- [5] 1월 임차료: 보통예금 1,500,000원
INSERT INTO journal_headers (journal_no, doc_date, post_date, fiscal_year, fiscal_month, status, description, created_by, posted_by, posted_at)
VALUES ('JNL-2026-01-000005', '2026-01-31', '2026-01-31', 2026, 1, 'POSTED', '1월 사무실 임차료', 1, 1, '2026-01-31 09:00:00');

SET @h5 = LAST_INSERT_ID();
INSERT INTO journal_lines (journal_id, line_no, account_code, account_side, amount, currency, description) VALUES
(@h5, 1, '5206',   'DEBIT',  1500000, 'KRW', '임차료'),
(@h5, 2, '110102', 'CREDIT', 1500000, 'KRW', '보통예금');

-- ============================================================
-- 2월 전표
-- ============================================================

-- [6] 서비스 매출 (외상): 8,000,000원
INSERT INTO journal_headers (journal_no, doc_date, post_date, fiscal_year, fiscal_month, status, description, created_by, posted_by, posted_at)
VALUES ('JNL-2026-02-000001', '2026-02-10', '2026-02-10', 2026, 2, 'POSTED', '2월 서비스 용역 제공 (A사)', 1, 1, '2026-02-10 09:00:00');

SET @h6 = LAST_INSERT_ID();
INSERT INTO journal_lines (journal_id, line_no, account_code, account_side, amount, currency, description) VALUES
(@h6, 1, '110201', 'DEBIT',  8000000, 'KRW', '외상매출금 - A사'),
(@h6, 2, '4102',   'CREDIT', 8000000, 'KRW', '서비스수익');

-- [7] 서비스 매출 대금 현금 회수
INSERT INTO journal_headers (journal_no, doc_date, post_date, fiscal_year, fiscal_month, status, description, created_by, posted_by, posted_at)
VALUES ('JNL-2026-02-000002', '2026-02-20', '2026-02-20', 2026, 2, 'POSTED', 'A사 외상 대금 회수', 1, 1, '2026-02-20 09:00:00');

SET @h7 = LAST_INSERT_ID();
INSERT INTO journal_lines (journal_id, line_no, account_code, account_side, amount, currency, description) VALUES
(@h7, 1, '110102', 'DEBIT',  8000000, 'KRW', '보통예금 입금'),
(@h7, 2, '110201', 'CREDIT', 8000000, 'KRW', '외상매출금 회수');

-- [8] 2월 급여 지급: 4,500,000원
INSERT INTO journal_headers (journal_no, doc_date, post_date, fiscal_year, fiscal_month, status, description, created_by, posted_by, posted_at)
VALUES ('JNL-2026-02-000003', '2026-02-28', '2026-02-28', 2026, 2, 'POSTED', '2월 급여', 1, 1, '2026-02-28 09:00:00');

SET @h8 = LAST_INSERT_ID();
INSERT INTO journal_lines (journal_id, line_no, account_code, account_side, amount, currency, description) VALUES
(@h8, 1, '5201',   'DEBIT',  4500000, 'KRW', '급여'),
(@h8, 2, '110102', 'CREDIT', 4500000, 'KRW', '보통예금');

-- [9] 2월 임차료: 1,500,000원
INSERT INTO journal_headers (journal_no, doc_date, post_date, fiscal_year, fiscal_month, status, description, created_by, posted_by, posted_at)
VALUES ('JNL-2026-02-000004', '2026-02-28', '2026-02-28', 2026, 2, 'POSTED', '2월 사무실 임차료', 1, 1, '2026-02-28 09:00:00');

SET @h9 = LAST_INSERT_ID();
INSERT INTO journal_lines (journal_id, line_no, account_code, account_side, amount, currency, description) VALUES
(@h9, 1, '5206',   'DEBIT',  1500000, 'KRW', '임차료'),
(@h9, 2, '110102', 'CREDIT', 1500000, 'KRW', '보통예금');

-- [10] 2월 통신비: 150,000원
INSERT INTO journal_headers (journal_no, doc_date, post_date, fiscal_year, fiscal_month, status, description, created_by, posted_by, posted_at)
VALUES ('JNL-2026-02-000005', '2026-02-28', '2026-02-28', 2026, 2, 'POSTED', '2월 통신비', 1, 1, '2026-02-28 09:00:00');

SET @h10 = LAST_INSERT_ID();
INSERT INTO journal_lines (journal_id, line_no, account_code, account_side, amount, currency, description) VALUES
(@h10, 1, '5204',   'DEBIT',  150000, 'KRW', '통신비'),
(@h10, 2, '110102', 'CREDIT', 150000, 'KRW', '보통예금');

-- ============================================================
-- 3월 전표
-- ============================================================

-- [11] 3월 서비스 매출 (B사, 외상): 12,000,000원
INSERT INTO journal_headers (journal_no, doc_date, post_date, fiscal_year, fiscal_month, status, description, created_by, posted_by, posted_at)
VALUES ('JNL-2026-03-000001', '2026-03-05', '2026-03-05', 2026, 3, 'POSTED', '3월 서비스 용역 제공 (B사)', 1, 1, '2026-03-05 09:00:00');

SET @h11 = LAST_INSERT_ID();
INSERT INTO journal_lines (journal_id, line_no, account_code, account_side, amount, currency, description) VALUES
(@h11, 1, '110201', 'DEBIT',  12000000, 'KRW', '외상매출금 - B사'),
(@h11, 2, '4102',   'CREDIT', 12000000, 'KRW', '서비스수익');

-- [12] 3월 급여: 4,500,000원
INSERT INTO journal_headers (journal_no, doc_date, post_date, fiscal_year, fiscal_month, status, description, created_by, posted_by, posted_at)
VALUES ('JNL-2026-03-000002', '2026-03-31', '2026-03-31', 2026, 3, 'POSTED', '3월 급여', 1, 1, '2026-03-31 09:00:00');

SET @h12 = LAST_INSERT_ID();
INSERT INTO journal_lines (journal_id, line_no, account_code, account_side, amount, currency, description) VALUES
(@h12, 1, '5201',   'DEBIT',  4500000, 'KRW', '급여'),
(@h12, 2, '110102', 'CREDIT', 4500000, 'KRW', '보통예금');

-- [13] 3월 임차료: 1,500,000원
INSERT INTO journal_headers (journal_no, doc_date, post_date, fiscal_year, fiscal_month, status, description, created_by, posted_by, posted_at)
VALUES ('JNL-2026-03-000003', '2026-03-31', '2026-03-31', 2026, 3, 'POSTED', '3월 사무실 임차료', 1, 1, '2026-03-31 09:00:00');

SET @h13 = LAST_INSERT_ID();
INSERT INTO journal_lines (journal_id, line_no, account_code, account_side, amount, currency, description) VALUES
(@h13, 1, '5206',   'DEBIT',  1500000, 'KRW', '임차료'),
(@h13, 2, '110102', 'CREDIT', 1500000, 'KRW', '보통예금');

-- [14] 광고선전비: 500,000원
INSERT INTO journal_headers (journal_no, doc_date, post_date, fiscal_year, fiscal_month, status, description, created_by, posted_by, posted_at)
VALUES ('JNL-2026-03-000004', '2026-03-15', '2026-03-15', 2026, 3, 'POSTED', '온라인 광고비', 1, 1, '2026-03-15 09:00:00');

SET @h14 = LAST_INSERT_ID();
INSERT INTO journal_lines (journal_id, line_no, account_code, account_side, amount, currency, description) VALUES
(@h14, 1, '5210',   'DEBIT',  500000, 'KRW', '광고선전비'),
(@h14, 2, '110102', 'CREDIT', 500000, 'KRW', '보통예금');

-- [15] 단기차입금 이자비용: 200,000원
INSERT INTO journal_headers (journal_no, doc_date, post_date, fiscal_year, fiscal_month, status, description, created_by, posted_by, posted_at)
VALUES ('JNL-2026-03-000005', '2026-03-31', '2026-03-31', 2026, 3, 'POSTED', '3월 차입금 이자', 1, 1, '2026-03-31 09:00:00');

SET @h15 = LAST_INSERT_ID();
INSERT INTO journal_lines (journal_id, line_no, account_code, account_side, amount, currency, description) VALUES
(@h15, 1, '5208',   'DEBIT',  200000, 'KRW', '이자비용'),
(@h15, 2, '2103',   'CREDIT', 200000, 'KRW', '미지급비용(이자)');

-- ============================================================
-- account_balances 스냅샷 갱신
-- 전표가 POSTED 상태이므로 잔액 테이블에 직접 반영
-- ============================================================

-- 1월 잔액
INSERT INTO account_balances (account_code, fiscal_year, fiscal_month, currency, debit_total, credit_total, closing_balance)
VALUES
  ('110101', 2026, 1, 'KRW', 50000000,  10000000,  40000000),  -- 현금: +5000만 -보증금1000만
  ('110102', 2026, 1, 'KRW', 20000000,   6500000,  13500000),  -- 보통예금: +2000만 -집기500만-임차150만
  ('1104',   2026, 1, 'KRW', 10000000,          0,  10000000), -- 선급금(보증금)
  ('120103', 2026, 1, 'KRW',  5000000,          0,   5000000), -- 기계장치
  ('2106',   2026, 1, 'KRW',         0,  20000000, -20000000), -- 단기차입금
  ('3101',   2026, 1, 'KRW',         0,  50000000, -50000000), -- 자본금
  ('5206',   2026, 1, 'KRW',  1500000,          0,   1500000)  -- 임차료
ON DUPLICATE KEY UPDATE
  debit_total     = VALUES(debit_total),
  credit_total    = VALUES(credit_total),
  closing_balance = VALUES(closing_balance);

-- 2월 잔액 (해당 월 발생액만)
INSERT INTO account_balances (account_code, fiscal_year, fiscal_month, currency, debit_total, credit_total, closing_balance)
VALUES
  ('110201', 2026, 2, 'KRW',  8000000,  8000000,        0),  -- 외상매출금: 발생 후 회수
  ('110102', 2026, 2, 'KRW',  8000000,  6150000,  1850000),  -- 보통예금: +회수8M -급여4.5M-임차1.5M-통신0.15M
  ('4102',   2026, 2, 'KRW',        0,  8000000,  -8000000), -- 서비스수익
  ('5201',   2026, 2, 'KRW',  4500000,        0,   4500000), -- 급여
  ('5204',   2026, 2, 'KRW',   150000,        0,    150000), -- 통신비
  ('5206',   2026, 2, 'KRW',  1500000,        0,   1500000)  -- 임차료
ON DUPLICATE KEY UPDATE
  debit_total     = VALUES(debit_total),
  credit_total    = VALUES(credit_total),
  closing_balance = VALUES(closing_balance);

-- 3월 잔액 (해당 월 발생액만)
INSERT INTO account_balances (account_code, fiscal_year, fiscal_month, currency, debit_total, credit_total, closing_balance)
VALUES
  ('110201', 2026, 3, 'KRW', 12000000,        0,  12000000), -- 외상매출금(미회수)
  ('110102', 2026, 3, 'KRW',        0,  6500000,  -6500000), -- 보통예금: -급여4.5M-임차1.5M-광고0.5M
  ('2103',   2026, 3, 'KRW',        0,   200000,   -200000), -- 미지급비용
  ('4102',   2026, 3, 'KRW',        0, 12000000, -12000000), -- 서비스수익
  ('5201',   2026, 3, 'KRW',  4500000,        0,   4500000), -- 급여
  ('5206',   2026, 3, 'KRW',  1500000,        0,   1500000), -- 임차료
  ('5208',   2026, 3, 'KRW',   200000,        0,    200000), -- 이자비용
  ('5210',   2026, 3, 'KRW',   500000,        0,    500000)  -- 광고선전비
ON DUPLICATE KEY UPDATE
  debit_total     = VALUES(debit_total),
  credit_total    = VALUES(credit_total),
  closing_balance = VALUES(closing_balance);
