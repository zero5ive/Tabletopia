package com.tabletopia.restaurantservice.domain.restaurantreview.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QRestaurantReview is a Querydsl query type for RestaurantReview
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QRestaurantReview extends EntityPathBase<RestaurantReview> {

    private static final long serialVersionUID = 591963577L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QRestaurantReview restaurantReview = new QRestaurantReview("restaurantReview");

    public final StringPath comment = createString("comment");

    public final DateTimePath<java.time.LocalDateTime> createdAt = createDateTime("createdAt", java.time.LocalDateTime.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final BooleanPath isDeleted = createBoolean("isDeleted");

    public final NumberPath<Integer> rating = createNumber("rating", Integer.class);

    public final com.tabletopia.restaurantservice.domain.restaurant.entity.QRestaurant restaurant;

    public final NumberPath<Long> sourceId = createNumber("sourceId", Long.class);

    public final EnumPath<RestaurantReview.SourceType> sourceType = createEnum("sourceType", RestaurantReview.SourceType.class);

    public final DateTimePath<java.time.LocalDateTime> updatedAt = createDateTime("updatedAt", java.time.LocalDateTime.class);

    public final NumberPath<Long> userId = createNumber("userId", Long.class);

    public QRestaurantReview(String variable) {
        this(RestaurantReview.class, forVariable(variable), INITS);
    }

    public QRestaurantReview(Path<? extends RestaurantReview> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QRestaurantReview(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QRestaurantReview(PathMetadata metadata, PathInits inits) {
        this(RestaurantReview.class, metadata, inits);
    }

    public QRestaurantReview(Class<? extends RestaurantReview> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.restaurant = inits.isInitialized("restaurant") ? new com.tabletopia.restaurantservice.domain.restaurant.entity.QRestaurant(forProperty("restaurant"), inits.get("restaurant")) : null;
    }

}

