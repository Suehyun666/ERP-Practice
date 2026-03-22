package org.erp.practice.domain.account;

/**
 * 계정 유형 (5대 계정)
 * - ASSET, EXPENSE: 차변(DEBIT) 증가
 * - LIABILITY, EQUITY, REVENUE: 대변(CREDIT) 증가
 */
public enum AccountType {
    ASSET,      // 자산
    LIABILITY,  // 부채
    EQUITY,     // 자본
    REVENUE,    // 수익
    EXPENSE;    // 비용

    public AccountSide normalSide() {
        return switch (this) {
            case ASSET, EXPENSE -> AccountSide.DEBIT;
            case LIABILITY, EQUITY, REVENUE -> AccountSide.CREDIT;
        };
    }
}
