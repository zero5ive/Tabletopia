package com.tabletopia.restaurantservice.domain.restaurantTable.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QRestaurantTable is a Querydsl query type for RestaurantTable
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QRestaurantTable extends EntityPathBase<RestaurantTable> {

    private static final long serialVersionUID = -1923646731L;

    public static final QRestaurantTable restaurantTable = new QRestaurantTable("restaurantTable");

    public final DateTimePath<java.time.LocalDateTime> createdAt = createDateTime("createdAt", java.time.LocalDateTime.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final NumberPath<Integer> maxCapacity = createNumber("maxCapacity", Integer.class);

    public final NumberPath<Integer> minCapacity = createNumber("minCapacity", Integer.class);

    public final StringPath name = createString("name");

    public final NumberPath<Long> restaurantId = createNumber("restaurantId", Long.class);

    public final StringPath shape = createString("shape");

    public final DateTimePath<java.time.LocalDateTime> updatedAt = createDateTime("updatedAt", java.time.LocalDateTime.class);

    public final NumberPath<Integer> xPosition = createNumber("xPosition", Integer.class);

    public final NumberPath<Integer> yPosition = createNumber("yPosition", Integer.class);

    public QRestaurantTable(String variable) {
        super(RestaurantTable.class, forVariable(variable));
    }

    public QRestaurantTable(Path<? extends RestaurantTable> path) {
        super(path.getType(), path.getMetadata());
    }

    public QRestaurantTable(PathMetadata metadata) {
        super(RestaurantTable.class, metadata);
    }

}

