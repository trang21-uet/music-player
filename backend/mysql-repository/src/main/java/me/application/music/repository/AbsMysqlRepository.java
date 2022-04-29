package me.application.music.repository;

import lombok.SneakyThrows;
import org.jooq.*;
import org.jooq.impl.TableImpl;
import org.jooq.impl.TableRecordImpl;
import org.springframework.beans.factory.annotation.Autowired;

import javax.annotation.PostConstruct;
import java.lang.reflect.ParameterizedType;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

public abstract class AbsMysqlRepository<P, R extends TableRecordImpl<R>> {

    protected R record;
    protected Class<P> pClass;

    @Autowired protected DSLContext dslContext;

    public abstract TableImpl<R> getTable();

    @SneakyThrows
    @PostConstruct
    public void init() {
        pClass = (Class<P>) ((ParameterizedType) getClass()
                .getGenericSuperclass())
                .getActualTypeArguments()[0];
        this.record = ((Class<R>) ((ParameterizedType) getClass()
                .getGenericSuperclass())
                .getActualTypeArguments()[1])
                .getDeclaredConstructor()
                .newInstance();
    }

    public P findById(String id) {
        TableField<R, String> tableField = (TableField<R, String>) this.getTable().field("id");
        return dslContext.select()
                .from(this.getTable())
                .where(tableField.eq(id))
                .fetchOneInto(pClass);
    }

    public List<P> findByIds(List<String> idList) {
        TableField<R, String> tableField = (TableField<R, String>) this.getTable().field("id");
        return dslContext.select()
                .from(this.getTable())
                .where(tableField.in(idList))
                .fetchInto(pClass);
    }

    public List<P> findAll() {
        return dslContext.select()
                .from(this.getTable())
                .fetchInto(pClass);
    }

    public int createOne(P p) {
        record.from(p);
        return dslContext.insertInto(this.getTable())
                .set(record)
                .execute();
    }

    public int createMany(List<P> pList) {
        List<Record> rList = pList.stream().map(p -> {
            return dslContext.newRecord(this.getTable(), p);
        }).collect(Collectors.toList());
        dslContext.batchInsert((TableRecord<?>) rList)
                .execute();
        return 1;
    }

    public int update(P p) {
        Record record = dslContext.newRecord(this.getTable(), p);
        Map<Field<?>, Object> fieldMap = fieldRecordMap(record);
        return dslContext.update(this.getTable())
                .set(fieldMap)
                .execute();
    }

    private Map<Field<?>, Object> fieldRecordMap(Record record) {
        List<Field<?>> fieldList = List.of(record.fields());
        return fieldList.stream()
                .filter(Objects::nonNull)
                .collect(Collectors.toMap(field -> field, field -> field.getValue(record)));
    }

    public int updateMany(List<P> pList) {
        List<InsertOnDuplicateSetMoreStep<R>> queryList = pList.stream()
                .map(p -> dslContext.newRecord(this.getTable(), p))
                .map(this::fieldRecordMap)
                .map(fieldObjectMap -> dslContext
                        .insertInto(this.getTable())
                        .set(fieldObjectMap)
                        .onDuplicateKeyUpdate()
                        .set(fieldObjectMap))
                .collect(Collectors.toList());
        return dslContext.batch(queryList)
                .execute().length;
    }

    public int delete(String id) {
        return dslContext.delete(this.getTable())
                .where(((TableField<R, String>) this.getTable().field("id")).eq(id))
                .execute();
    }

    public int deleteMany(List<String> idList) {
        return dslContext.delete(this.getTable())
                .where(this.getTable().field("id").in(idList))
                .execute();
    }
}
