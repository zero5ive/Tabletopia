package com.tabletopia.restaurantservice.domain.restaurant.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QRestaurant is a Querydsl query type for Restaurant
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QRestaurant extends EntityPathBase<Restaurant> {

    private static final long serialVersionUID = -1910686487L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QRestaurant restaurant = new QRestaurant("restaurant");

    public final StringPath address = createString("address");

    public final DateTimePath<java.time.LocalDateTime> createdAt = createDateTime("createdAt", java.time.LocalDateTime.class);

    public final StringPath description = createString("description");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final BooleanPath isDeleted = createBoolean("isDeleted");

    public final NumberPath<java.math.BigDecimal> latitude = createNumber("latitude", java.math.BigDecimal.class);

    public final NumberPath<java.math.BigDecimal> longitude = createNumber("longitude", java.math.BigDecimal.class);

    public final StringPath name = createString("name");

    public final ListPath<com.tabletopia.restaurantservice.domain.restaurantOpeningHour.entity.RestaurantOpeningHour, com.tabletopia.restaurantservice.domain.restaurantOpeningHour.entity.QRestaurantOpeningHour> openingHours = this.<com.tabletopia.restaurantservice.domain.restaurantOpeningHour.entity.RestaurantOpeningHour, com.tabletopia.restaurantservice.domain.restaurantOpeningHour.entity.QRestaurantOpeningHour>createList("openingHours", com.tabletopia.restaurantservice.domain.restaurantOpeningHour.entity.RestaurantOpeningHour.class, com.tabletopia.restaurantservice.domain.restaurantOpeningHour.entity.QRestaurantOpeningHour.class, PathInits.DIRECT2);

    public final StringPath phoneNumber = createString("phoneNumber");

    public final StringPath regionCode = createString("regionCode");

    public final com.tabletopia.restaurantservice.domain.restaurantCategory.entity.QRestaurantCategory restaurantCategory;

    public final ListPath<com.tabletopia.restaurantservice.domain.restaurantFacility.entity.RestaurantFacility, com.tabletopia.restaurantservice.domain.restaurantFacility.entity.QRestaurantFacility> restaurantFacilities = this.<com.tabletopia.restaurantservice.domain.restaurantFacility.entity.RestaurantFacility, com.tabletopia.restaurantservice.domain.restaurantFacility.entity.QRestaurantFacility>createList("restaurantFacilities", com.tabletopia.restaurantservice.domain.restaurantFacility.entity.RestaurantFacility.class, com.tabletopia.restaurantservice.domain.restaurantFacility.entity.QRestaurantFacility.class, PathInits.DIRECT2);

    public final ListPath<com.tabletopia.restaurantservice.domain.restaurantreview.entity.RestaurantReview, com.tabletopia.restaurantservice.domain.restaurantreview.entity.QRestaurantReview> reviews = this.<com.tabletopia.restaurantservice.domain.restaurantreview.entity.RestaurantReview, com.tabletopia.restaurantservice.domain.restaurantreview.entity.QRestaurantReview>createList("reviews", com.tabletopia.restaurantservice.domain.restaurantreview.entity.RestaurantReview.class, com.tabletopia.restaurantservice.domain.restaurantreview.entity.QRestaurantReview.class, PathInits.DIRECT2);

    public final DateTimePath<java.time.LocalDateTime> updatedAt = createDateTime("updatedAt", java.time.LocalDateTime.class);

    public QRestaurant(String variable) {
        this(Restaurant.class, forVariable(variable), INITS);
    }

    public QRestaurant(Path<? extends Restaurant> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QRestaurant(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QRestaurant(PathMetadata metadata, PathInits inits) {
        this(Restaurant.class, metadata, inits);
    }

    public QRestaurant(Class<? extends Restaurant> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.restaurantCategory = inits.isInitialized("restaurantCategory") ? new com.tabletopia.restaurantservice.domain.restaurantCategory.entity.QRestaurantCategory(forProperty("restaurantCategory")) : null;
    }

}

