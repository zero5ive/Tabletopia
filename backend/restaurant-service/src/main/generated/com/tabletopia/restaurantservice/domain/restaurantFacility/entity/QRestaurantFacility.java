package com.tabletopia.restaurantservice.domain.restaurantFacility.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QRestaurantFacility is a Querydsl query type for RestaurantFacility
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QRestaurantFacility extends EntityPathBase<RestaurantFacility> {

    private static final long serialVersionUID = 587574447L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QRestaurantFacility restaurantFacility = new QRestaurantFacility("restaurantFacility");

    public final DateTimePath<java.time.LocalDateTime> createdAt = createDateTime("createdAt", java.time.LocalDateTime.class);

    public final com.tabletopia.restaurantservice.domain.facility.entity.QFacility facility;

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final com.tabletopia.restaurantservice.domain.restaurant.entity.QRestaurant restaurant;

    public final DateTimePath<java.time.LocalDateTime> updatedAt = createDateTime("updatedAt", java.time.LocalDateTime.class);

    public QRestaurantFacility(String variable) {
        this(RestaurantFacility.class, forVariable(variable), INITS);
    }

    public QRestaurantFacility(Path<? extends RestaurantFacility> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QRestaurantFacility(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QRestaurantFacility(PathMetadata metadata, PathInits inits) {
        this(RestaurantFacility.class, metadata, inits);
    }

    public QRestaurantFacility(Class<? extends RestaurantFacility> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.facility = inits.isInitialized("facility") ? new com.tabletopia.restaurantservice.domain.facility.entity.QFacility(forProperty("facility")) : null;
        this.restaurant = inits.isInitialized("restaurant") ? new com.tabletopia.restaurantservice.domain.restaurant.entity.QRestaurant(forProperty("restaurant"), inits.get("restaurant")) : null;
    }

}

