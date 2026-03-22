package org.erp.practice.domain.journal;

/**
 * 차변합계 ≠ 대변합계 시 발생
 * 레퍼런스: double-entry-bookkeeping-api의 UnbalancedLegsException
 */
public class UnbalancedTransactionException extends RuntimeException {
    public UnbalancedTransactionException(String message) {
        super(message);
    }
}
