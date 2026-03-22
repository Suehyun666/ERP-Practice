-- ============================================================
-- V6: 샘플 데이터 재정렬 + 회계 기간 현실화
--   - 3월 전표: 날짜 순서대로 삽입, 03-31 미래 날짜 제거
--   - 급여(03-22)는 DRAFT 상태로 (미승인)
--   - 1월, 2월 회계 기간 → CLOSED
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE journal_lines;
TRUNCATE TABLE journal_headers;
TRUNCATE TABLE account_balances;
SET FOREIGN_KEY_CHECKS = 1;

ALTER TABLE journal_headers AUTO_INCREMENT = 1;
ALTER TABLE journal_lines   AUTO_INCREMENT = 1;

-- ============================================================
-- 회계 기간 마감: 지난 달(1월, 2월)은 CLOSED
-- ============================================================
UPDATE fiscal_periods
   SET status = 'CLOSED', closed_at = '2026-02-01 18:00:00', closed_by = 1
 WHERE fiscal_year = 2026 AND fiscal_month = 1;

UPDATE fiscal_periods
   SET status = 'CLOSED', closed_at = '2026-03-01 18:00:00', closed_by = 1
 WHERE fiscal_year = 2026 AND fiscal_month = 2;

-- ============================================================
-- 1월 전표 (5건, 날짜 순)
-- ============================================================

-- [1] 2026-01-02 법인 설립: 주주 현금 출자 50,000,000원
INSERT INTO journal_headers (journal_no, doc_date, post_date, fiscal_year, fiscal_month, status, description, created_by, posted_by, posted_at)
VALUES ('JNL-2026-01-0001', '2026-01-02', '2026-01-02', 2026, 1, 'POSTED', '자본금 납입 - 법인 설립', 1, 1, '2026-01-02 09:00:00');
SET @h1 = LAST_INSERT_ID();
INSERT INTO journal_lines (journal_id, line_no, account_code, account_side, amount, currency, description) VALUES
(@h1, 1, '110101', 'DEBIT',  50000000, 'KRW', '설립 출자금'),
(@h1, 2, '3101',   'CREDIT', 50000000, 'KRW', '자본금');

-- [2] 2026-01-03 은행 단기차입 20,000,000원
INSERT INTO journal_headers (journal_no, doc_date, post_date, fiscal_year, fiscal_month, status, description, created_by, posted_by, posted_at)
VALUES ('JNL-2026-01-0002', '2026-01-03', '2026-01-03', 2026, 1, 'POSTED', '국민은행 단기차입금 수령', 1, 1, '2026-01-03 09:00:00');
SET @h2 = LAST_INSERT_ID();
INSERT INTO journal_lines (journal_id, line_no, account_code, account_side, amount, currency, description) VALUES
(@h2, 1, '110102', 'DEBIT',  20000000, 'KRW', '국민은행 보통예금'),
(@h2, 2, '2106',   'CREDIT', 20000000, 'KRW', '단기차입금');

-- [3] 2026-01-05 사무실 보증금: 현금 10,000,000원
INSERT INTO journal_headers (journal_no, doc_date, post_date, fiscal_year, fiscal_month, status, description, created_by, posted_by, posted_at)
VALUES ('JNL-2026-01-0003', '2026-01-05', '2026-01-05', 2026, 1, 'POSTED', '사무실 임대 보증금 납부', 1, 1, '2026-01-05 09:00:00');
SET @h3 = LAST_INSERT_ID();
INSERT INTO journal_lines (journal_id, line_no, account_code, account_side, amount, currency, description) VALUES
(@h3, 1, '1104',   'DEBIT',  10000000, 'KRW', '사무실 보증금(선급금)'),
(@h3, 2, '110101', 'CREDIT', 10000000, 'KRW', '현금 지급');

-- [4] 2026-01-06 업무용 컴퓨터·집기 구입: 보통예금 5,000,000원
INSERT INTO journal_headers (journal_no, doc_date, post_date, fiscal_year, fiscal_month, status, description, created_by, posted_by, posted_at)
VALUES ('JNL-2026-01-0004', '2026-01-06', '2026-01-06', 2026, 1, 'POSTED', '업무용 컴퓨터 및 집기 구입', 1, 1, '2026-01-06 09:00:00');
SET @h4 = LAST_INSERT_ID();
INSERT INTO journal_lines (journal_id, line_no, account_code, account_side, amount, currency, description) VALUES
(@h4, 1, '120103', 'DEBIT',  5000000, 'KRW', '컴퓨터·집기(기계장치)'),
(@h4, 2, '110102', 'CREDIT', 5000000, 'KRW', '보통예금 지급');

-- [5] 2026-01-31 1월 임차료: 보통예금 1,500,000원
INSERT INTO journal_headers (journal_no, doc_date, post_date, fiscal_year, fiscal_month, status, description, created_by, posted_by, posted_at)
VALUES ('JNL-2026-01-0005', '2026-01-31', '2026-01-31', 2026, 1, 'POSTED', '1월 사무실 임차료', 1, 1, '2026-01-31 09:00:00');
SET @h5 = LAST_INSERT_ID();
INSERT INTO journal_lines (journal_id, line_no, account_code, account_side, amount, currency, description) VALUES
(@h5, 1, '5206',   'DEBIT',  1500000, 'KRW', '임차료'),
(@h5, 2, '110102', 'CREDIT', 1500000, 'KRW', '보통예금');

-- ============================================================
-- 2월 전표 (5건, 날짜 순)
-- ============================================================

-- [6] 2026-02-10 서비스 매출 (A사, 외상): 8,000,000원
INSERT INTO journal_headers (journal_no, doc_date, post_date, fiscal_year, fiscal_month, status, description, created_by, posted_by, posted_at)
VALUES ('JNL-2026-02-0001', '2026-02-10', '2026-02-10', 2026, 2, 'POSTED', '2월 서비스 용역 제공 (A사)', 1, 1, '2026-02-10 09:00:00');
SET @h6 = LAST_INSERT_ID();
INSERT INTO journal_lines (journal_id, line_no, account_code, account_side, amount, currency, description) VALUES
(@h6, 1, '110201', 'DEBIT',  8000000, 'KRW', '외상매출금 - A사'),
(@h6, 2, '4102',   'CREDIT', 8000000, 'KRW', '서비스수익');

-- [7] 2026-02-20 A사 외상 대금 회수
INSERT INTO journal_headers (journal_no, doc_date, post_date, fiscal_year, fiscal_month, status, description, created_by, posted_by, posted_at)
VALUES ('JNL-2026-02-0002', '2026-02-20', '2026-02-20', 2026, 2, 'POSTED', 'A사 외상 대금 전액 회수', 1, 1, '2026-02-20 09:00:00');
SET @h7 = LAST_INSERT_ID();
INSERT INTO journal_lines (journal_id, line_no, account_code, account_side, amount, currency, description) VALUES
(@h7, 1, '110102', 'DEBIT',  8000000, 'KRW', '보통예금 입금'),
(@h7, 2, '110201', 'CREDIT', 8000000, 'KRW', '외상매출금 회수');

-- [8] 2026-02-25 통신비: 150,000원
INSERT INTO journal_headers (journal_no, doc_date, post_date, fiscal_year, fiscal_month, status, description, created_by, posted_by, posted_at)
VALUES ('JNL-2026-02-0003', '2026-02-25', '2026-02-25', 2026, 2, 'POSTED', '2월 통신비', 1, 1, '2026-02-25 09:00:00');
SET @h8 = LAST_INSERT_ID();
INSERT INTO journal_lines (journal_id, line_no, account_code, account_side, amount, currency, description) VALUES
(@h8, 1, '5204',   'DEBIT',  150000, 'KRW', '통신비'),
(@h8, 2, '110102', 'CREDIT', 150000, 'KRW', '보통예금');

-- [9] 2026-02-28 2월 임차료: 1,500,000원
INSERT INTO journal_headers (journal_no, doc_date, post_date, fiscal_year, fiscal_month, status, description, created_by, posted_by, posted_at)
VALUES ('JNL-2026-02-0004', '2026-02-28', '2026-02-28', 2026, 2, 'POSTED', '2월 사무실 임차료', 1, 1, '2026-02-28 09:00:00');
SET @h9 = LAST_INSERT_ID();
INSERT INTO journal_lines (journal_id, line_no, account_code, account_side, amount, currency, description) VALUES
(@h9, 1, '5206',   'DEBIT',  1500000, 'KRW', '임차료'),
(@h9, 2, '110102', 'CREDIT', 1500000, 'KRW', '보통예금');

-- [10] 2026-02-28 2월 급여: 4,500,000원
INSERT INTO journal_headers (journal_no, doc_date, post_date, fiscal_year, fiscal_month, status, description, created_by, posted_by, posted_at)
VALUES ('JNL-2026-02-0005', '2026-02-28', '2026-02-28', 2026, 2, 'POSTED', '2월 급여', 1, 1, '2026-02-28 17:00:00');
SET @h10 = LAST_INSERT_ID();
INSERT INTO journal_lines (journal_id, line_no, account_code, account_side, amount, currency, description) VALUES
(@h10, 1, '5201',   'DEBIT',  4500000, 'KRW', '급여'),
(@h10, 2, '110102', 'CREDIT', 4500000, 'KRW', '보통예금');

-- ============================================================
-- 3월 전표 (6건, 날짜 순, 마지막은 DRAFT)
-- ============================================================

-- [11] 2026-03-05 서비스 매출 (B사, 외상): 12,000,000원
INSERT INTO journal_headers (journal_no, doc_date, post_date, fiscal_year, fiscal_month, status, description, created_by, posted_by, posted_at)
VALUES ('JNL-2026-03-0001', '2026-03-05', '2026-03-05', 2026, 3, 'POSTED', '3월 서비스 용역 제공 (B사)', 1, 1, '2026-03-05 09:00:00');
SET @h11 = LAST_INSERT_ID();
INSERT INTO journal_lines (journal_id, line_no, account_code, account_side, amount, currency, description) VALUES
(@h11, 1, '110201', 'DEBIT',  12000000, 'KRW', '외상매출금 - B사'),
(@h11, 2, '4102',   'CREDIT', 12000000, 'KRW', '서비스수익');

-- [12] 2026-03-12 B사 외상 일부 회수: 6,000,000원
INSERT INTO journal_headers (journal_no, doc_date, post_date, fiscal_year, fiscal_month, status, description, created_by, posted_by, posted_at)
VALUES ('JNL-2026-03-0002', '2026-03-12', '2026-03-12', 2026, 3, 'POSTED', 'B사 외상 일부 회수 (1차)', 1, 1, '2026-03-12 14:00:00');
SET @h12 = LAST_INSERT_ID();
INSERT INTO journal_lines (journal_id, line_no, account_code, account_side, amount, currency, description) VALUES
(@h12, 1, '110102', 'DEBIT',  6000000, 'KRW', '보통예금 입금'),
(@h12, 2, '110201', 'CREDIT', 6000000, 'KRW', '외상매출금 일부 회수');

-- [13] 2026-03-15 온라인 광고비: 500,000원
INSERT INTO journal_headers (journal_no, doc_date, post_date, fiscal_year, fiscal_month, status, description, created_by, posted_by, posted_at)
VALUES ('JNL-2026-03-0003', '2026-03-15', '2026-03-15', 2026, 3, 'POSTED', '3월 온라인 광고비', 1, 1, '2026-03-15 11:00:00');
SET @h13 = LAST_INSERT_ID();
INSERT INTO journal_lines (journal_id, line_no, account_code, account_side, amount, currency, description) VALUES
(@h13, 1, '5210',   'DEBIT',  500000, 'KRW', '광고선전비'),
(@h13, 2, '110102', 'CREDIT', 500000, 'KRW', '보통예금');

-- [14] 2026-03-18 차입금 이자비용: 200,000원 (미지급)
INSERT INTO journal_headers (journal_no, doc_date, post_date, fiscal_year, fiscal_month, status, description, created_by, posted_by, posted_at)
VALUES ('JNL-2026-03-0004', '2026-03-18', '2026-03-18', 2026, 3, 'POSTED', '3월 차입금 이자 발생', 1, 1, '2026-03-18 10:00:00');
SET @h14 = LAST_INSERT_ID();
INSERT INTO journal_lines (journal_id, line_no, account_code, account_side, amount, currency, description) VALUES
(@h14, 1, '5208',   'DEBIT',  200000, 'KRW', '이자비용'),
(@h14, 2, '2103',   'CREDIT', 200000, 'KRW', '미지급비용(이자)');

-- [15] 2026-03-20 3월 임차료: 1,500,000원
INSERT INTO journal_headers (journal_no, doc_date, post_date, fiscal_year, fiscal_month, status, description, created_by, posted_by, posted_at)
VALUES ('JNL-2026-03-0005', '2026-03-20', '2026-03-20', 2026, 3, 'POSTED', '3월 사무실 임차료', 1, 1, '2026-03-20 09:00:00');
SET @h15 = LAST_INSERT_ID();
INSERT INTO journal_lines (journal_id, line_no, account_code, account_side, amount, currency, description) VALUES
(@h15, 1, '5206',   'DEBIT',  1500000, 'KRW', '임차료'),
(@h15, 2, '110102', 'CREDIT', 1500000, 'KRW', '보통예금');

-- [16] 2026-03-22 3월 급여 (DRAFT - 결재 대기)
INSERT INTO journal_headers (journal_no, doc_date, post_date, fiscal_year, fiscal_month, status, description, created_by)
VALUES ('JNL-2026-03-0006', '2026-03-22', '2026-03-22', 2026, 3, 'DRAFT', '3월 급여 (결재 대기)', 1);
SET @h16 = LAST_INSERT_ID();
INSERT INTO journal_lines (journal_id, line_no, account_code, account_side, amount, currency, description) VALUES
(@h16, 1, '5201',   'DEBIT',  4500000, 'KRW', '급여'),
(@h16, 2, '110102', 'CREDIT', 4500000, 'KRW', '보통예금');

-- ============================================================
-- account_balances 스냅샷 (POSTED 전표 기준)
-- ============================================================

-- 1월 잔액
-- 현금: +5000만(출자) -1000만(보증금) = 4000만
-- 보통예금: +2000만(차입) -500만(집기) -150만(임차) = 1350만
INSERT INTO account_balances (account_code, fiscal_year, fiscal_month, currency, debit_total, credit_total, closing_balance)
VALUES
  ('110101', 2026, 1, 'KRW', 50000000, 10000000,  40000000),
  ('110102', 2026, 1, 'KRW', 20000000,  6500000,  13500000),
  ('1104',   2026, 1, 'KRW', 10000000,        0,  10000000),
  ('120103', 2026, 1, 'KRW',  5000000,        0,   5000000),
  ('2106',   2026, 1, 'KRW',        0, 20000000, -20000000),
  ('3101',   2026, 1, 'KRW',        0, 50000000, -50000000),
  ('5206',   2026, 1, 'KRW',  1500000,        0,   1500000)
ON DUPLICATE KEY UPDATE
  debit_total = VALUES(debit_total), credit_total = VALUES(credit_total), closing_balance = VALUES(closing_balance);

-- 2월 잔액 (해당 월 발생액)
-- 보통예금: +800만(회수) -15만(통신) -150만(임차) -450만(급여) = 185만
INSERT INTO account_balances (account_code, fiscal_year, fiscal_month, currency, debit_total, credit_total, closing_balance)
VALUES
  ('110201', 2026, 2, 'KRW', 8000000, 8000000,       0),
  ('110102', 2026, 2, 'KRW', 8000000, 6150000, 1850000),
  ('4102',   2026, 2, 'KRW',       0, 8000000, -8000000),
  ('5201',   2026, 2, 'KRW', 4500000,       0,  4500000),
  ('5204',   2026, 2, 'KRW',  150000,       0,   150000),
  ('5206',   2026, 2, 'KRW', 1500000,       0,  1500000)
ON DUPLICATE KEY UPDATE
  debit_total = VALUES(debit_total), credit_total = VALUES(credit_total), closing_balance = VALUES(closing_balance);

-- 3월 잔액 (POSTED 전표만 반영 - 급여 DRAFT 제외)
-- 보통예금: +600만(회수) -50만(광고) -150만(임차) = 400만
-- 외상매출금: +1200만 -600만 = 600만 (잔액)
INSERT INTO account_balances (account_code, fiscal_year, fiscal_month, currency, debit_total, credit_total, closing_balance)
VALUES
  ('110201', 2026, 3, 'KRW', 12000000, 6000000,  6000000),
  ('110102', 2026, 3, 'KRW',  6000000, 2000000,  4000000),
  ('2103',   2026, 3, 'KRW',        0,  200000,  -200000),
  ('4102',   2026, 3, 'KRW',        0, 12000000, -12000000),
  ('5208',   2026, 3, 'KRW',   200000,        0,   200000),
  ('5206',   2026, 3, 'KRW',  1500000,        0,  1500000),
  ('5210',   2026, 3, 'KRW',   500000,        0,   500000)
ON DUPLICATE KEY UPDATE
  debit_total = VALUES(debit_total), credit_total = VALUES(credit_total), closing_balance = VALUES(closing_balance);
