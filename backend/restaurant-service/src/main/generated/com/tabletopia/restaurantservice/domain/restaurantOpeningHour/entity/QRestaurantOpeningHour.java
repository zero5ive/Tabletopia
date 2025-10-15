package com.tabletopia.restaurantservice.domain.restaurantOpeningHour.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QRestaurantOpeningHour is a Querydsl query type for RestaurantOpeningHour
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QRestaurantOpeningHour extends EntityPathBase<RestaurantOpeningHour> {

    private static final long serialVersionUID = 1901360437L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QRestaurantOpeningHour restaurantOpeningHour = new QRestaurantOpeningHour("restaurantOpeningHour");

    public final TimePath<java.time.LocalTime> breakEndTime = createTime("breakEndTime", java.time.LocalTime.class);

    public final TimePath<java.time.LocalTime> breakStartTime = createTime("breakStartTime", java.time.LocalTime.class);

    public final TimePath<java.time.LocalTime> closeTime = createTime("closeTime", java.time.LocalTime.class);

    public final DateTimePath<java.time.LocalDateTime> createdAt = createDateTime("createdAt", java.time.LocalDateTime.class);

    public final NumberPath<Integer> dayOfWeek = createNumber("dayOfWeek", Integer.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final BooleanPath isHoliday = createBoolean("isHoliday");

    public final TimePath<java.time.LocalTime> openTime = createTime("openTime", java.time.LocalTime.class);

    public final NumberPath<Integer> reservationInterval = createNumber("reservationInterval", Integer.class);

    public final com.tabletopia.restaurantservice.domain.restaurant.entity.QRestaurant restaurant;

    public final DateTimePath<java.time.LocalDateTime> updatedAt = createDateTime("updatedAt", java.time.LocalDateTime.class);

    public QRestaurantOpeningHour(String variable) {
        this(RestaurantOpeningHour.class, forVariable(variable), INITS);
    }

    public QRestaurantOpeningHour(Path<? extends RestaurantOpeningHour> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QRestaurantOpeningHour(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QRestaurantOpeningHour(PathMetadata metadata, PathInits inits) {
        this(RestaurantOpeningHour.class, metadata, inits);
    }

    public QRestaurantOpeningHour(Class<? extends RestaurantOpeningHour> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.restaurant = inits.isInitialized("restaurant") ? new com.tabletopia.restaurantservice.domain.restaurant.entity.QRestaurant(forProperty("restaurant"), inits.get("restaurant")) : null;
    }

}

