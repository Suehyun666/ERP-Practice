package org.erp.practice.application.service;

import lombok.RequiredArgsConstructor;
import org.erp.practice.application.port.in.AccountQueryUseCase;
import org.erp.practice.application.port.out.AccountRepository;
import org.erp.practice.domain.account.Account;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AccountService implements AccountQueryUseCase {

    private final AccountRepository accountRepository;

    @Override
    public List<Account> findAll() {
        return accountRepository.findAll();
    }

    @Override
    public List<Account> findPostableAccounts() {
        return accountRepository.findActive().stream()
                .filter(Account::isPostable)
                .toList();
    }

    @Override
    public Optional<Account> findByCode(String accountCode) {
        return accountRepository.findByCode(accountCode);
    }

    @Override
    public List<Account> findChildren(String parentCode) {
        return accountRepository.findByParentCode(parentCode);
    }
}
