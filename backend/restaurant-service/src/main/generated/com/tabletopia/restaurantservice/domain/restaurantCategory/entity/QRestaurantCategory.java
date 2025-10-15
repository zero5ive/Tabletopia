package com.tabletopia.restaurantservice.domain.restaurantCategory.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QRestaurantCategory is a Querydsl query type for RestaurantCategory
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QRestaurantCategory extends EntityPathBase<RestaurantCategory> {

    private static final long serialVersionUID = 456768933L;

    public static final QRestaurantCategory restaurantCategory = new QRestaurantCategory("restaurantCategory");

    public final DateTimePath<java.time.LocalDateTime> createdAt = createDateTime("createdAt", java.time.LocalDateTime.class);

    public final NumberPath<Integer> displayOrder = createNumber("displayOrder", Integer.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final BooleanPath isDeleted = createBoolean("isDeleted");

    public final StringPath name = createString("name");

    public final ListPath<com.tabletopia.restaurantservice.domain.restaurant.entity.Restaurant, com.tabletopia.restaurantservice.domain.restaurant.entity.QRestaurant> restaurants = this.<com.tabletopia.restaurantservice.domain.restaurant.entity.Restaurant, com.tabletopia.restaurantservice.domain.restaurant.entity.QRestaurant>createList("restaurants", com.tabletopia.restaurantservice.domain.restaurant.entity.Restaurant.class, com.tabletopia.restaurantservice.domain.restaurant.entity.QRestaurant.class, PathInits.DIRECT2);

    public final DateTimePath<java.time.LocalDateTime> updatedAt = createDateTime("updatedAt", java.time.LocalDateTime.class);

    public QRestaurantCategory(String variable) {
        super(RestaurantCategory.class, forVariable(variable));
    }

    public QRestaurantCategory(Path<? extends RestaurantCategory> path) {
        super(path.getType(), path.getMetadata());
    }

    public QRestaurantCategory(PathMetadata metadata) {
        super(RestaurantCategory.class, metadata);
    }

}

