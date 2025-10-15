package com.tabletopia.restaurantservice.domain.reservation.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QReservation is a Querydsl query type for Reservation
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QReservation extends EntityPathBase<Reservation> {

    private static final long serialVersionUID = -693555691L;

    public static final QReservation reservation = new QReservation("reservation");

    public final DateTimePath<java.time.LocalDateTime> completedAt = createDateTime("completedAt", java.time.LocalDateTime.class);

    public final DateTimePath<java.time.LocalDateTime> createdAt = createDateTime("createdAt", java.time.LocalDateTime.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final NumberPath<Integer> peopleCount = createNumber("peopleCount", Integer.class);

    public final DateTimePath<java.time.LocalDateTime> processedAt = createDateTime("processedAt", java.time.LocalDateTime.class);

    public final StringPath rejectedReason = createString("rejectedReason");

    public final DateTimePath<java.time.LocalDateTime> reservationAt = createDateTime("reservationAt", java.time.LocalDateTime.class);

    public final EnumPath<com.tabletopia.restaurantservice.domain.reservation.enums.ReservationStatus> reservationState = createEnum("reservationState", com.tabletopia.restaurantservice.domain.reservation.enums.ReservationStatus.class);

    public final StringPath restaurantAddressSnapshot = createString("restaurantAddressSnapshot");

    public final NumberPath<Long> restaurantId = createNumber("restaurantId", Long.class);

    public final StringPath restaurantNameSnapshot = createString("restaurantNameSnapshot");

    public final StringPath restaurantPhoneSnapshot = createString("restaurantPhoneSnapshot");

    public final NumberPath<Integer> restaurantTableCapacitySnapshot = createNumber("restaurantTableCapacitySnapshot", Integer.class);

    public final NumberPath<Long> restaurantTableId = createNumber("restaurantTableId", Long.class);

    public final StringPath restaurantTableNameSnapshot = createString("restaurantTableNameSnapshot");

    public final DateTimePath<java.time.LocalDateTime> updatedAt = createDateTime("updatedAt", java.time.LocalDateTime.class);

    public final NumberPath<Long> userId = createNumber("userId", Long.class);

    public QReservation(String variable) {
        super(Reservation.class, forVariable(variable));
    }

    public QReservation(Path<? extends Reservation> path) {
        super(path.getType(), path.getMetadata());
    }

    public QReservation(PathMetadata metadata) {
        super(Reservation.class, metadata);
    }

}

