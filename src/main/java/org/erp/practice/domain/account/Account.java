package org.erp.practice.domain.account;

import lombok.Getter;

import java.util.Objects;

/**
 * 계정과목 도메인 객체
 * 레퍼런스: accounting 프로젝트의 AccountDetails + AccountDetailsImpl
 */
@Getter
public class Account {

    private final String accountCode;
    private final String accountName;
    private final AccountType accountType;
    private final AccountSide normalSide; // 잔액 증가 방향
    private final String parentCode;
    private final boolean isDetail;       // 전표 입력 가능한 말단 계정 여부
    private final boolean isActive;

    private Account(Builder builder) {
        this.accountCode = Objects.requireNonNull(builder.accountCode, "accountCode must not be null");
        this.accountName = Objects.requireNonNull(builder.accountName, "accountName must not be null");
        this.accountType = Objects.requireNonNull(builder.accountType, "accountType must not be null");
        this.normalSide  = builder.accountType.normalSide();
        this.parentCode  = builder.parentCode;
        this.isDetail    = builder.isDetail;
        this.isActive    = builder.isActive;
    }

    public boolean isPostable() {
        return isDetail && isActive;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String      accountCode;
        private String      accountName;
        private AccountType accountType;
        private String      parentCode;
        private boolean     isDetail = true;
        private boolean     isActive = true;

        public Builder accountCode(String accountCode) { this.accountCode = accountCode; return this; }
        public Builder accountName(String accountName) { this.accountName = accountName; return this; }
        public Builder accountType(AccountType accountType) { this.accountType = accountType; return this; }
        public Builder parentCode(String parentCode) { this.parentCode = parentCode; return this; }
        public Builder isDetail(boolean isDetail) { this.isDetail = isDetail; return this; }
        public Builder isActive(boolean isActive) { this.isActive = isActive; return this; }
        public Account build() { return new Account(this); }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Account other)) return false;
        return accountCode.equals(other.accountCode);
    }

    @Override
    public int hashCode() {
        return accountCode.hashCode();
    }

    @Override
    public String toString() {
        return "[%s] %s (%s)".formatted(accountCode, accountName, accountType);
    }
}
