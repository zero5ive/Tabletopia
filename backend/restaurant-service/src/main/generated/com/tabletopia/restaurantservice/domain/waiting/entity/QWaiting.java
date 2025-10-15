package com.tabletopia.restaurantservice.domain.waiting.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QWaiting is a Querydsl query type for Waiting
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QWaiting extends EntityPathBase<Waiting> {

    private static final long serialVersionUID = 626450805L;

    public static final QWaiting waiting = new QWaiting("waiting");

    public final NumberPath<Integer> assignedTableCapacity = createNumber("assignedTableCapacity", Integer.class);

    public final StringPath assignedTableName = createString("assignedTableName");

    public final DateTimePath<java.time.LocalDateTime> calledAt = createDateTime("calledAt", java.time.LocalDateTime.class);

    public final DateTimePath<java.time.LocalDateTime> createdAt = createDateTime("createdAt", java.time.LocalDateTime.class);

    public final NumberPath<Integer> delayCount = createNumber("delayCount", Integer.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final NumberPath<Integer> peopleCount = createNumber("peopleCount", Integer.class);

    public final NumberPath<Long> restaurantId = createNumber("restaurantId", Long.class);

    public final StringPath restaurantNameSnapshot = createString("restaurantNameSnapshot");

    public final DateTimePath<java.time.LocalDateTime> updatedAt = createDateTime("updatedAt", java.time.LocalDateTime.class);

    public final NumberPath<Long> userId = createNumber("userId", Long.class);

    public final NumberPath<Integer> waitingNumber = createNumber("waitingNumber", Integer.class);

    public final EnumPath<com.tabletopia.restaurantservice.domain.waiting.enums.WaitingState> waitingState = createEnum("waitingState", com.tabletopia.restaurantservice.domain.waiting.enums.WaitingState.class);

    public QWaiting(String variable) {
        super(Waiting.class, forVariable(variable));
    }

    public QWaiting(Path<? extends Waiting> path) {
        super(path.getType(), path.getMetadata());
    }

    public QWaiting(PathMetadata metadata) {
        super(Waiting.class, metadata);
    }

}

