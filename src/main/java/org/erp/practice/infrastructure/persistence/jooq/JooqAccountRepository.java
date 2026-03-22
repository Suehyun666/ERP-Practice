package org.erp.practice.infrastructure.persistence.jooq;

import lombok.RequiredArgsConstructor;
import org.erp.practice.application.port.out.AccountRepository;
import org.erp.practice.domain.account.Account;
import org.erp.practice.domain.account.AccountType;
import org.jooq.DSLContext;
import org.jooq.Record;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import static org.jooq.impl.DSL.field;
import static org.jooq.impl.DSL.table;

@Repository
@RequiredArgsConstructor
public class JooqAccountRepository implements AccountRepository {

    private final DSLContext dsl;

    @Override
    public List<Account> findAll() {
        return dsl.select()
                .from(table("chart_of_accounts"))
                .orderBy(field("account_code"))
                .fetch()
                .map(this::toAccount);
    }

    @Override
    public List<Account> findActive() {
        return dsl.select()
                .from(table("chart_of_accounts"))
                .where(field("is_active").isTrue())
                .orderBy(field("account_code"))
                .fetch()
                .map(this::toAccount);
    }

    @Override
    public Optional<Account> findByCode(String accountCode) {
        return dsl.select()
                .from(table("chart_of_accounts"))
                .where(field("account_code").eq(accountCode))
                .fetchOptional()
                .map(this::toAccount);
    }

    @Override
    public List<Account> findByParentCode(String parentCode) {
        return dsl.select()
                .from(table("chart_of_accounts"))
                .where(field("parent_code").eq(parentCode))
                .orderBy(field("account_code"))
                .fetch()
                .map(this::toAccount);
    }

    private Account toAccount(Record r) {
        return Account.builder()
                .accountCode(r.get(field("account_code"), String.class))
                .accountName(r.get(field("account_name"), String.class))
                .accountType(AccountType.valueOf(r.get(field("account_type"), String.class)))
                .parentCode(r.get(field("parent_code"), String.class))
                .isDetail(Boolean.TRUE.equals(r.get(field("is_detail"), Boolean.class)))
                .isActive(Boolean.TRUE.equals(r.get(field("is_active"), Boolean.class)))
                .build();
    }
}
