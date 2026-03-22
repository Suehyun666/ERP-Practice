package org.erp.practice.application.port.out;

import java.util.List;
import java.util.Map;

public interface FiscalPeriodRepository {
    boolean isOpen(int year, int month);
    void close(int year, int month, Long userId);
    void reopen(int year, int month);
    List<Map<String, Object>> listByYear(int year);
}
