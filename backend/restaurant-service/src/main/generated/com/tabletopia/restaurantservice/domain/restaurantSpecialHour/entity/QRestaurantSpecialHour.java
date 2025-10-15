package com.tabletopia.restaurantservice.domain.restaurantSpecialHour.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QRestaurantSpecialHour is a Querydsl query type for RestaurantSpecialHour
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QRestaurantSpecialHour extends EntityPathBase<RestaurantSpecialHour> {

    private static final long serialVersionUID = -1255109419L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QRestaurantSpecialHour restaurantSpecialHour = new QRestaurantSpecialHour("restaurantSpecialHour");

    public final TimePath<java.time.LocalTime> closeTime = createTime("closeTime", java.time.LocalTime.class);

    public final DateTimePath<java.time.LocalDateTime> createdAt = createDateTime("createdAt", java.time.LocalDateTime.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final BooleanPath isClosed = createBoolean("isClosed");

    public final TimePath<java.time.LocalTime> openTime = createTime("openTime", java.time.LocalTime.class);

    public final com.tabletopia.restaurantservice.domain.restaurant.entity.QRestaurant restaurant;

    public final DatePath<java.time.LocalDate> specialDate = createDate("specialDate", java.time.LocalDate.class);

    public final StringPath specialInfo = createString("specialInfo");

    public final DateTimePath<java.time.LocalDateTime> updatedAt = createDateTime("updatedAt", java.time.LocalDateTime.class);

    public QRestaurantSpecialHour(String variable) {
        this(RestaurantSpecialHour.class, forVariable(variable), INITS);
    }

    public QRestaurantSpecialHour(Path<? extends RestaurantSpecialHour> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QRestaurantSpecialHour(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QRestaurantSpecialHour(PathMetadata metadata, PathInits inits) {
        this(RestaurantSpecialHour.class, metadata, inits);
    }

    public QRestaurantSpecialHour(Class<? extends RestaurantSpecialHour> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.restaurant = inits.isInitialized("restaurant") ? new com.tabletopia.restaurantservice.domain.restaurant.entity.QRestaurant(forProperty("restaurant"), inits.get("restaurant")) : null;
    }

}

