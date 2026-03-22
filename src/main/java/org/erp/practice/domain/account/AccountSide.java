package org.erp.practice.domain.account;

/**
 * 차변/대변 구분 (레퍼런스: accounting 프로젝트의 AccountSide)
 */
public enum AccountSide {
    DEBIT,   // 차변
    CREDIT;  // 대변

    public AccountSide opposite() {
        return this == DEBIT ? CREDIT : DEBIT;
    }
}
