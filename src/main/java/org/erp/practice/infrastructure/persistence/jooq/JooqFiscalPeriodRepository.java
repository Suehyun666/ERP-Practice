package org.erp.practice.infrastructure.persistence.jooq;

import lombok.RequiredArgsConstructor;
import org.erp.practice.application.port.out.FiscalPeriodRepository;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import static org.jooq.impl.DSL.field;
import static org.jooq.impl.DSL.table;

@Repository
@RequiredArgsConstructor
public class JooqFiscalPeriodRepository implements FiscalPeriodRepository {

    private final DSLContext dsl;

    @Override
    public boolean isOpen(int year, int month) {
        String status = dsl.select(field("status"))
                .from(table("fiscal_periods"))
                .where(field("fiscal_year").eq((short) year))
                .and(field("fiscal_month").eq((byte) month))
                .fetchOneInto(String.class);
        return "OPEN".equals(status);
    }

    @Override
    public void close(int year, int month, Long userId) {
        dsl.update(table("fiscal_periods"))
                .set(field("status"), "CLOSED")
                .set(field("closed_at"), LocalDateTime.now())
                .set(field("closed_by"), userId)
                .where(field("fiscal_year").eq((short) year))
                .and(field("fiscal_month").eq((byte) month))
                .execute();
    }

    @Override
    public void reopen(int year, int month) {
        dsl.update(table("fiscal_periods"))
                .set(field("status"), "OPEN")
                .setNull(field("closed_at"))
                .setNull(field("closed_by"))
                .where(field("fiscal_year").eq((short) year))
                .and(field("fiscal_month").eq((byte) month))
                .execute();
    }

    @Override
    public List<Map<String, Object>> listByYear(int year) {
        return dsl.select(
                        field("fiscal_year"),
                        field("fiscal_month"),
                        field("status"),
                        field("closed_at"),
                        field("closed_by"))
                .from(table("fiscal_periods"))
                .where(field("fiscal_year").eq((short) year))
                .orderBy(field("fiscal_month"))
                .fetchMaps();
    }
}
