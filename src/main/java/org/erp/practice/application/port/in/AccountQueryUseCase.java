package org.erp.practice.application.port.in;

import org.erp.practice.domain.account.Account;

import java.util.List;
import java.util.Optional;

public interface AccountQueryUseCase {
    List<Account> findAll();
    List<Account> findPostableAccounts();
    Optional<Account> findByCode(String accountCode);
    List<Account> findChildren(String parentCode);
}
