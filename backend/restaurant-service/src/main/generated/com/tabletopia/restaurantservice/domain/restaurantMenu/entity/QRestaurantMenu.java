package com.tabletopia.restaurantservice.domain.restaurantMenu.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QRestaurantMenu is a Querydsl query type for RestaurantMenu
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QRestaurantMenu extends EntityPathBase<RestaurantMenu> {

    private static final long serialVersionUID = 1929812647L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QRestaurantMenu restaurantMenu = new QRestaurantMenu("restaurantMenu");

    public final StringPath category = createString("category");

    public final DateTimePath<java.time.LocalDateTime> createdAt = createDateTime("createdAt", java.time.LocalDateTime.class);

    public final StringPath description = createString("description");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final StringPath imageFilename = createString("imageFilename");

    public final BooleanPath isDeleted = createBoolean("isDeleted");

    public final BooleanPath isSoldout = createBoolean("isSoldout");

    public final StringPath name = createString("name");

    public final NumberPath<Integer> price = createNumber("price", Integer.class);

    public final com.tabletopia.restaurantservice.domain.restaurant.entity.QRestaurant restaurant;

    public final DateTimePath<java.time.LocalDateTime> updatedAt = createDateTime("updatedAt", java.time.LocalDateTime.class);

    public QRestaurantMenu(String variable) {
        this(RestaurantMenu.class, forVariable(variable), INITS);
    }

    public QRestaurantMenu(Path<? extends RestaurantMenu> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QRestaurantMenu(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QRestaurantMenu(PathMetadata metadata, PathInits inits) {
        this(RestaurantMenu.class, metadata, inits);
    }

    public QRestaurantMenu(Class<? extends RestaurantMenu> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.restaurant = inits.isInitialized("restaurant") ? new com.tabletopia.restaurantservice.domain.restaurant.entity.QRestaurant(forProperty("restaurant"), inits.get("restaurant")) : null;
    }

}

