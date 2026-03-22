package org.erp.practice.application.port.out;

import org.erp.practice.domain.account.Account;

import java.util.List;
import java.util.Optional;

public interface AccountRepository {
    List<Account> findAll();
    List<Account> findActive();
    Optional<Account> findByCode(String accountCode);
    List<Account> findByParentCode(String parentCode);
}
