-- ==========================================
-- Tabletopia 프로젝트 전체 더미 데이터 (완전판)
-- ==========================================

-- 1. user 테이블
INSERT INTO `user` (`email`, `password`, `name`, `phone_number`)
VALUES
    ('user1@example.com', '$2a$10$userpass1', '김철수', '010-1234-5678'),
    ('user2@example.com', '$2a$10$userpass2', '이영희', '010-2345-6789'),
    ('user3@example.com', '$2a$10$userpass3', '박민수', '010-3456-7890'),
    ('user4@example.com', '$2a$10$userpass4', '최지우', '010-4567-8901'),
    ('user5@example.com', '$2a$10$userpass5', '정수진', '010-5678-9012');

-- 2. admin 테이블
INSERT INTO `admin` (`email`, `password`, `name`)
VALUES
    ('restaurant1@example.com', '$2a$10$restaurant1pass', '레스토랑1'),
    ('restaurant2@example.com', '$2a$10$restaurant2pass', '레스토랑2'),
    ('restaurant3@example.com', '$2a$10$restaurant3pass', '레스토랑3'),
    ('restaurant4@example.com', '$2a$10$restaurant4pass', '레스토랑4'),
    ('restaurant5@example.com', '$2a$10$restaurant5pass', '레스토랑5');

INSERT INTO `admin` (`email`, `password`, `name`, `role`)
VALUES ('jm@gmail.com', '$2a$10$8uC./ZIcC..6Ecjw99ZfWeoObI0yPamYEiZ0jgyC0GiYRWqaGXQ0O', '슈퍼관리자', 'SUPERADMIN');

-- 3. restaurant_category 테이블
INSERT INTO `restaurant_category` (`name`, `display_order`)
VALUES
    ('한식', 1),
    ('중식', 2),
    ('일식', 3),
    ('양식', 4),
    ('기타', 5);

-- 4. facility 테이블
INSERT INTO `facility` (`name`)
VALUES
    ('주차 가능'),
    ('Wi-Fi'),
    ('금연'),
    ('반려동물 동반 가능'),
    ('장애인 편의시설'),
    ('키즈존'),
    ('단체석'),
    ('테라스');

INSERT INTO `facility` (`id`, `name`)
VALUES
    (9, '화장실'),
    (10, '포장 가능'),
    (11, '배달 가능'),
    (12, '노키즈존');

-- 5. keyword 테이블
INSERT INTO `keyword` (`keyword`)
VALUES
    ('데이트'),
    ('가족모임'),
    ('회식'),
    ('혼밥'),
    ('분위기 좋은'),
    ('가성비'),
    ('신선한'),
    ('맛집'),
    ('조용한'),
    ('넓은');

-- 6. ad_plan 테이블
INSERT INTO `ad_plan` (`name`, `monthly_price`, `is_main_exposure`, `is_mypage_exposure`)
VALUES
    ('베이직', 100000, FALSE, TRUE),
    ('스탠다드', 300000, TRUE, TRUE),
    ('프리미엄', 500000, TRUE, TRUE);


-- 8. restaurant 테이블
INSERT INTO `restaurant` (`restaurant_category_id`, `admin_id`, `name`, `address`, `latitude`, `longitude`, `region_code`, `phone_number`, `description`)
VALUES
    (1, 1, '맛있는 한식당', '서울특별시 강남구 테헤란로 123', 37.50665000, 127.05318700, '서울', '02-1234-5678', '정통 한식을 맛볼 수 있는 곳입니다.'),
    (2, 2, '중화요리 만리장성', '서울특별시 중구 명동길 456', 37.56394900, 126.98200900, '경기', '02-2345-6789', '정통 중화요리 전문점입니다.'),
    (3, 3, '스시 마스터', '서울특별시 서초구 강남대로 789', 37.49794200, 127.02762400, '강원', '02-3456-7890', '신선한 스시를 제공합니다.'),
    (4, 4, '이탈리안 파스타', '서울특별시 마포구 홍대입구역로 321', 37.55704700, 126.92675300, '충북', '02-4567-8901', '정통 이탈리안 파스타 전문점입니다.'),
    (5, 5, '치킨킹', '서울특별시 송파구 잠실로 654', 37.51334800, 127.10018000, '충남', '02-5678-9012', '바삭한 치킨 전문점입니다.');

-- 9. restaurant_table 테이블
INSERT INTO `restaurant_table` (`restaurant_id`, `name`, `min_capacity`, `max_capacity`, `x_position`, `y_position`, `shape`)
VALUES
    (1, '1번 테이블', 2, 4, 100, 100, 'RECTANGLE'),
    (1, '2번 테이블', 2, 4, 200, 100, 'RECTANGLE'),
    (1, '3번 테이블', 4, 6, 300, 100, 'RECTANGLE'),
    (1, '창가석', 2, 2, 100, 200, 'CIRCLE'),
    (2, 'A1', 2, 4, 150, 150, 'RECTANGLE'),
    (2, 'A2', 4, 8, 250, 150, 'RECTANGLE'),
    (2, '룸1', 6, 10, 350, 150, 'RECTANGLE'),
    (3, '카운터1', 1, 2, 120, 120, 'RECTANGLE'),
    (3, '카운터2', 1, 2, 220, 120, 'RECTANGLE'),
    (3, '테이블1', 2, 4, 120, 220, 'RECTANGLE'),
    (4, '테이블1', 2, 4, 150, 100, 'RECTANGLE'),
    (4, '테이블2', 2, 4, 250, 100, 'RECTANGLE'),
    (4, '커플석', 2, 2, 100, 200, 'CIRCLE'),
    (5, '홀1', 4, 6, 200, 150, 'RECTANGLE'),
    (5, '홀2', 4, 6, 300, 150, 'RECTANGLE'),
    (5, '룸1', 6, 8, 400, 150, 'RECTANGLE');

-- 10. restaurant_opening_hour 테이블
INSERT INTO `restaurant_opening_hour` (`restaurant_id`, `day_of_week`, `open_time`, `close_time`, `break_start_time`, `break_end_time`, `reservation_interval`)
VALUES
    (1, 1, '11:00:00', '22:00:00', '15:00:00', '17:00:00', 30),
    (1, 2, '11:00:00', '22:00:00', '15:00:00', '17:00:00', 30),
    (1, 3, '11:00:00', '22:00:00', '15:00:00', '17:00:00', 30),
    (1, 4, '11:00:00', '22:00:00', '15:00:00', '17:00:00', 30),
    (1, 5, '11:00:00', '22:00:00', '15:00:00', '17:00:00', 30),
    (1, 6, '11:00:00', '23:00:00', NULL, NULL, 30),
    (1, 0, '11:00:00', '21:00:00', NULL, NULL, 30),
    (2, 1, '12:00:00', '21:00:00', '15:00:00', '17:00:00', 30),
    (2, 2, '12:00:00', '21:00:00', '15:00:00', '17:00:00', 30),
    (2, 3, '12:00:00', '21:00:00', '15:00:00', '17:00:00', 30),
    (2, 4, '12:00:00', '21:00:00', '15:00:00', '17:00:00', 30),
    (2, 5, '12:00:00', '21:00:00', '15:00:00', '17:00:00', 30),
    (2, 6, '12:00:00', '22:00:00', NULL, NULL, 30),
    (3, 0, '17:00:00', '23:00:00', NULL, NULL, 30),
    (3, 1, '17:00:00', '23:00:00', NULL, NULL, 30),
    (3, 2, '17:00:00', '23:00:00', NULL, NULL, 30),
    (3, 3, '17:00:00', '23:00:00', NULL, NULL, 30),
    (3, 4, '17:00:00', '23:00:00', NULL, NULL, 30),
    (3, 5, '17:00:00', '23:00:00', NULL, NULL, 30),
    (3, 6, '17:00:00', '00:00:00', NULL, NULL, 30),
    (4, 0, '11:30:00', '22:00:00', '15:00:00', '17:30:00', 20),
    (4, 1, '11:30:00', '22:00:00', '15:00:00', '17:30:00', 20),
    (4, 2, '11:30:00', '22:00:00', '15:00:00', '17:30:00', 20),
    (4, 3, '11:30:00', '22:00:00', '15:00:00', '17:30:00', 20),
    (4, 4, '11:30:00', '22:00:00', '15:00:00', '17:30:00', 20),
    (4, 5, '11:30:00', '23:00:00', NULL, NULL, 20),
    (4, 6, '11:30:00', '23:00:00', NULL, NULL, 20),
    (5, 0, '16:00:00', '02:00:00', NULL, NULL, 40),
    (5, 1, '16:00:00', '02:00:00', NULL, NULL, 40),
    (5, 2, '16:00:00', '02:00:00', NULL, NULL, 40),
    (5, 3, '16:00:00', '02:00:00', NULL, NULL, 40),
    (5, 4, '16:00:00', '02:00:00', NULL, NULL, 40),
    (5, 5, '16:00:00', '03:00:00', NULL, NULL, 40),
    (5, 6, '16:00:00', '03:00:00', NULL, NULL, 40);

-- 11. restaurant_special_hour 테이블
INSERT INTO `restaurant_special_hour` (`restaurant_id`, `special_date`, `open_time`, `close_time`, `is_closed`, `special_info`)
VALUES
    (1, '2025-01-01', NULL, NULL, TRUE, '설날 휴무'),
    (1, '2025-12-25', '11:00:00', '20:00:00', FALSE, '크리스마스 단축 영업'),
    (2, '2025-01-01', NULL, NULL, TRUE, '신정 휴무'),
    (3, '2025-02-14', '17:00:00', '02:00:00', FALSE, '발렌타인데이 연장 영업'),
    (4, '2025-12-25', '11:30:00', '01:00:00', FALSE, '크리스마스 특별 영업');

-- 12. restaurant_menu 테이블
INSERT INTO `restaurant_menu` (`restaurant_id`, `name`, `price`, `description`, `category`)
VALUES
    (1, '김치찌개', 8000, '깊은 맛의 김치찌개', '메인'),
    (1, '된장찌개', 7000, '구수한 된장찌개', '메인'),
    (1, '불고기', 15000, '양념이 잘 밴 불고기', '메인'),
    (1, '계란말이', 5000, '부드러운 계란말이', '사이드'),
    (1, '콜라', 2000, '시원한 콜라', '음료'),
    (2, '짜장면', 6000, '정통 짜장면', '메인'),
    (2, '짬뽕', 7000, '매콤한 짬뽕', '메인'),
    (2, '탕수육', 18000, '바삭한 탕수육', '메인'),
    (2, '군만두', 8000, '속이 꽉 찬 군만두', '사이드'),
    (2, '우롱차', 3000, '따뜻한 우롱차', '음료'),
    (3, '연어초밥', 12000, '신선한 연어초밥', '메인'),
    (3, '참치초밥', 15000, '참치초밥', '메인'),
    (3, '스시세트', 25000, '다양한 스시 세트', '메인'),
    (3, '미소된장국', 4000, '일본식 된장국', '사이드'),
    (3, '녹차', 3000, '따뜻한 녹차', '음료'),
    (4, '까르보나라', 14000, '크림 파스타', '메인'),
    (4, '알리오올리오', 12000, '올리브오일 파스타', '메인'),
    (4, '마르게리타 피자', 16000, '토마토와 모짜렐라 피자', '메인'),
    (4, '시저샐러드', 8000, '신선한 시저샐러드', '사이드'),
    (4, '와인', 25000, '하우스 와인', '음료'),
    (5, '후라이드 치킨', 18000, '바삭한 후라이드 치킨', '메인'),
    (5, '양념치킨', 20000, '달콤매콤한 양념치킨', '메인'),
    (5, '간장치킨', 19000, '짭조름한 간장치킨', '메인'),
    (5, '치킨무', 2000, '아삭한 치킨무', '사이드'),
    (5, '맥주', 4000, '시원한 맥주', '음료');

-- 13. restaurant_image 테이블
INSERT INTO `restaurant_image` (`restaurant_id`, `image_url`, `is_main`, `sort_order`)
VALUES
    (1, '/images/restaurant1_main.jpg', TRUE, 1),
    (1, '/images/restaurant1_sub1.jpg', FALSE, 2),
    (1, '/images/restaurant1_sub2.jpg', FALSE, 3),
    (2, '/images/restaurant2_main.jpg', TRUE, 1),
    (2, '/images/restaurant2_sub1.jpg', FALSE, 2),
    (3, '/images/restaurant3_main.jpg', TRUE, 1),
    (3, '/images/restaurant3_sub1.jpg', FALSE, 2),
    (4, '/images/restaurant4_main.jpg', TRUE, 1),
    (4, '/images/restaurant4_sub1.jpg', FALSE, 2),
    (5, '/images/restaurant5_main.jpg', TRUE, 1);

-- 14. restaurant_facility 테이블
INSERT INTO `restaurant_facility` (`restaurant_id`, `facility_id`)
VALUES
    (1, 1),
    (1, 2),
    (1, 3),
    (2, 1),
    (2, 2),
    (2, 7),
    (3, 2),
    (3, 3),
    (4, 1),
    (4, 8),
    (5, 1),
    (5, 6);

-- 15. restaurant_keyword 테이블
INSERT INTO `restaurant_keyword` (`restaurant_id`, `keyword_id`)
VALUES
    (1, 1),
    (1, 2),
    (1, 8),
    (2, 2),
    (2, 3),
    (2, 6),
    (3, 1),
    (3, 5),
    (3, 7),
    (4, 1),
    (4, 5),
    (4, 8),
    (5, 2),
    (5, 6),
    (5, 10);

-- 16. recommendation_request 테이블
INSERT INTO `recommendation_request` (`user_id`, `recommendation_type`, `request_data`)
VALUES
    (1, 'RESTAURANT', '{"location": "강남구", "cuisine": "한식", "people_count": 2}'),
    (2, 'TODAY_RESERVATION', '{"date": "2025-09-17", "time": "19:00", "people_count": 4}'),
    (3, 'KEYWORD', '{"keywords": ["데이트", "분위기좋은"], "region": "서초구"}'),
    (4, 'RESTAURANT', '{"location": "중구", "max_price": 20000, "people_count": 3}'),
    (5, 'KEYWORD', '{"keywords": ["가족모임", "주차가능"], "region": "송파구"}');

-- 17. recommendation_result 테이블
INSERT INTO `recommendation_result` (`recommendation_request_id`, `restaurant_id`, `rank_order`, `score`, `reason`)
VALUES
    (1, 1, 1, 95.5, '위치가 가깝고 한식 전문점이며 평점이 높습니다'),
    (1, 4, 2, 82.3, '분위기가 좋고 데이트 코스로 인기입니다'),
    (2, 2, 1, 88.7, '오늘 예약 가능하고 4인석이 있습니다'),
    (2, 3, 2, 76.4, '시간대가 맞고 신선한 재료를 사용합니다'),
    (3, 3, 1, 91.2, '데이트 코스로 유명하고 분위기가 좋습니다'),
    (3, 4, 2, 87.8, '로맨틱한 분위기와 테라스석이 있습니다');

-- 18. waiting 테이블
INSERT INTO `waiting` (`restaurant_id`, `user_id`, `people_count`, `waiting_number`, `waiting_state`, `restaurant_name_snapshot`)
VALUES
    (1, 2, 3, 1, 'WAITING', '맛있는 한식당'),
    (1, 3, 2, 2, 'WAITING', '맛있는 한식당'),
    (2, 4, 4, 1, 'CALLED', '중화요리 만리장성'),
    (3, 5, 2, 1, 'WAITING', '스시 마스터'),
    (4, 1, 2, 1, 'SEATED', '이탈리안 파스타');

-- 19. payment 테이블
INSERT INTO `payment` (`order_no`, `pay_method`, `amount`, `status`, `pg_tid`, `approved_at`)
VALUES
    ('ORD-2025-0001', 'CARD', 10000.00, 'SUCCESS', 'PG_TID_001', '2025-09-16 18:00:00'),
    ('ORD-2025-0002', 'KAKAO_PAY', 15000.00, 'SUCCESS', 'PG_TID_002', '2025-09-16 19:00:00'),
    ('ORD-2025-0003', 'CARD', 12000.00, 'SUCCESS', 'PG_TID_003', '2025-09-16 20:00:00'),
    ('ORD-2025-0004', 'CARD', 8000.00, 'SUCCESS', 'PG_TID_004', '2025-09-15 17:00:00'),
    ('ORD-2025-0005', 'CARD', 14000.00, 'SUCCESS', 'PG_TID_005', '2025-09-15 18:00:00'),
    ('ORD-2025-0006', 'CARD', 14000.00, 'SUCCESS', 'PG_TID_006', '2025-09-15 18:00:00'),
    ('ORD-2025-0007', 'CARD', 14000.00, 'SUCCESS', 'PG_TID_007', '2025-09-15 17:00:00');

-- 20. reservation 테이블
INSERT INTO `reservation` (`user_id`, `restaurant_id`, `restaurant_table_id`, `people_count`, `restaurant_name_snapshot`, `restaurant_address_snapshot`, `restaurant_phone_snapshot`, `restaurant_table_name_snapshot`, `restaurant_table_capacity_snapshot`, `reservation_state`, `reservation_at`, `payment_id`, `name`, `phone_number`)
VALUES
    (1, 1, 1, 2, '맛있는 한식당', '서울특별시 강남구 테헤란로 123', '02-1234-5678', '1번 테이블', 4, 'CONFIRMED', '2025-09-17 19:00:00', 1, '김철수', '010-1234-5678'),
    (2, 2, 5, 4, '중화요리 만리장성', '서울특별시 중구 명동길 456', '02-2345-6789', 'A1', 4, 'PENDING', '2025-09-18 18:30:00', 2, '이영희', '010-2345-6789'),
    (3, 3, 8, 2, '스시 마스터', '서울특별시 서초구 강남대로 789', '02-3456-7890', '카운터1', 2, 'CONFIRMED', '2025-09-17 20:00:00', 3, '박민수', '010-3456-7890'),
    (4, 1, 3, 6, '맛있는 한식당', '서울특별시 강남구 테헤란로 123', '02-1234-5678', '3번 테이블', 6, 'COMPLETED', '2025-09-15 18:00:00', 4, '최지우', '010-4567-8901'),
    (5, 4, 11, 3, '이탈리안 파스타', '서울특별시 마포구 홍대입구역로 321', '02-4567-8901', '테이블1', 4, 'CONFIRMED', '2025-09-16 19:30:00', 5, '정수진', '010-5678-9012'),
    (4, 1, 2, 6, '맛있는 한식당', '서울특별시 강남구 테헤란로 123', '02-1234-5678', '3번 테이블', 6, 'COMPLETED', '2025-09-15 18:00:00', 6, '최지우', '010-4567-8901'),
    (4, 1, 2, 6, '맛있는 한식당', '서울특별시 강남구 테헤란로 123', '02-1234-5678', '3번 테이블', 6, 'COMPLETED', '2025-09-15 17:00:00', 7, '최지우', '010-4567-8901');

-- 21. table_realtime_state 테이블
INSERT INTO `table_realtime_state` (`restaurant_table_id`, `table_state`, `start_at`, `end_at`, `current_people_count`, `source_type`, `source_id`)
VALUES
    (1, 'RESERVED', '2025-09-17 19:00:00', '2025-09-17 21:00:00', NULL, 'RESERVATION', 1),
    (2, 'AVAILABLE', NULL, NULL, NULL, NULL, NULL),
    (3, 'OCCUPIED', '2025-09-16 18:30:00', '2025-09-16 20:30:00', 4, 'WALK_IN', NULL),
    (4, 'CLEANING', '2025-09-16 20:45:00', '2025-09-16 21:00:00', NULL, NULL, NULL),
    (5, 'RESERVED', '2025-09-18 18:30:00', '2025-09-18 20:30:00', NULL, 'RESERVATION', 2),
    (6, 'OCCUPIED', '2025-09-16 19:00:00', '2025-09-16 21:00:00', 6, 'RESERVATION', NULL),
    (7, 'AVAILABLE', NULL, NULL, NULL, NULL, NULL),
    (8, 'RESERVED', '2025-09-17 20:00:00', '2025-09-17 22:00:00', NULL, 'RESERVATION', 3),
    (9, 'AVAILABLE', NULL, NULL, NULL, NULL, NULL),
    (10, 'CLEANING', '2025-09-16 21:30:00', '2025-09-16 22:00:00', NULL, NULL, NULL),
    (11, 'RESERVED', '2025-09-16 19:30:00', '2025-09-16 21:30:00', NULL, 'RESERVATION', 5),
    (12, 'OCCUPIED', '2025-09-16 18:00:00', '2025-09-16 20:00:00', 2, 'WAITING', 5),
    (13, 'AVAILABLE', NULL, NULL, NULL, NULL, NULL),
    (14, 'OCCUPIED', '2025-09-16 19:30:00', '2025-09-16 21:30:00', 4, 'WALK_IN', NULL),
    (15, 'AVAILABLE', NULL, NULL, NULL, NULL, NULL),
    (16, 'AVAILABLE', NULL, NULL, NULL, NULL, NULL);

-- 22. table_usage_history 테이블
INSERT INTO `table_usage_history` (`restaurant_table_id`, `restaurant_id_snapshot`, `restaurant_name_snapshot`, `table_name_snapshot`, `table_capacity_snapshot`, `source_type`, `source_id`, `people_count`, `start_at`, `end_at`)
VALUES
    (1, 1, '맛있는 한식당', '1번 테이블', 4, 'RESERVATION', 1, 2, '2025-09-17 19:00:00', '2025-09-17 21:00:00'),
    (5, 2, '중화요리 만리장성', 'A1', 4, 'RESERVATION', 2, 4, '2025-09-18 18:30:00', '2025-09-18 20:30:00'),
    (8, 3, '스시 마스터', '카운터1', 2, 'RESERVATION', 3, 2, '2025-09-17 20:00:00', '2025-09-17 22:00:00'),
    (3, 1, '맛있는 한식당', '3번 테이블', 6, 'WALK_IN', NULL, 4, '2025-09-16 18:30:00', '2025-09-16 20:30:00'),
    (14, 5, '치킨킹', '홀1', 6, 'WALK_IN', NULL, 4, '2025-09-16 19:30:00', '2025-09-16 21:30:00');

-- 23. restaurant_review 테이블
INSERT INTO `restaurant_review` (`user_id`, `restaurant_id`, `rating`, `comment`, `source_type`, `source_id`)
VALUES
    (4, 1, 5, '정말 맛있었어요! 김치찌개가 최고입니다.', 'RESERVATION', 4),
    (1, 3, 4, '신선한 스시와 좋은 분위기. 다시 방문하고 싶어요.', 'RESERVATION', 3),
    (5, 4, 5, '파스타가 정말 맛있고 분위기도 로맨틱해요.', 'WAITING', 5),
    (2, 2, 3, '맛은 괜찮은데 서비스가 조금 아쉬워요.', 'WAITING', 3),
    (3, 1, 5, '가족과 함께 갔는데 모두 만족했어요', 'RESERVATION', 2);


-- 24. review_image 테이블
INSERT INTO `review_image` (`restaurant_review_id`, `image_filename`, `image_url`, `sort_order`)
VALUES
    (1, 'review1_img1.jpg', '/images/reviews/review1_img1.jpg', 1),
    (1, 'review1_img2.jpg', '/images/reviews/review1_img2.jpg', 2),
    (2, 'review2_img1.jpg', '/images/reviews/review2_img1.jpg', 1),
    (3, 'review3_img1.jpg', '/images/reviews/review3_img1.jpg', 1),
    (5, 'review5_img1.jpg', '/images/reviews/review5_img1.jpg', 1);

-- 25. bookmark 테이블
INSERT INTO `bookmark` (`user_id`, `restaurant_id`)
VALUES
    (1, 1),
    (1, 3),
    (2, 1),
    (2, 2),
    (3, 3),
    (4, 4),
    (5, 1),
    (5, 5);

-- 26. notification 테이블
INSERT INTO `notification` (`waiting_id`, `user_id`, `message`, `notification_type`, `sent_at`)
VALUES
    (1, 2, '웨이팅이 등록되었습니다. 현재 1번째 대기중입니다.', 'REGISTERED', '2025-09-16 18:00:00'),
    (2, 3, '웨이팅이 등록되었습니다. 현재 2번째 대기중입니다.', 'REGISTERED', '2025-09-16 18:15:00'),
    (3, 4, '곧 차례입니다. 매장 앞에서 대기해 주세요.', 'APPROACHING', '2025-09-16 19:45:00'),
    (3, 4, '입장 가능합니다. 매장으로 오세요.', 'CALLED', '2025-09-16 19:50:00'),
    (4, 5, '웨이팅이 등록되었습니다. 현재 1번째 대기중입니다.', 'REGISTERED', '2025-09-16 20:00:00');



-- ==========================================
-- 데이터 확인 쿼리
-- ==========================================

-- 전체 테이블 데이터 개수 확인
SELECT 'user' as table_name, COUNT(*) as count FROM user
UNION ALL SELECT 'admin', COUNT(*) FROM admin
          UNION ALL SELECT 'restaurant_category', COUNT(*) FROM restaurant_category
          UNION ALL SELECT 'facility', COUNT(*) FROM facility
          UNION ALL SELECT 'keyword', COUNT(*) FROM keyword
          UNION ALL SELECT 'ad_plan', COUNT(*) FROM ad_plan
          UNION ALL SELECT 'commission_policy', COUNT(*) FROM commission_policy
          UNION ALL SELECT 'restaurant', COUNT(*) FROM restaurant
          UNION ALL SELECT 'restaurant_table', COUNT(*) FROM restaurant_table
          UNION ALL SELECT 'restaurant_opening_hour', COUNT(*) FROM restaurant_opening_hour
          UNION ALL SELECT 'restaurant_special_hour', COUNT(*) FROM restaurant_special_hour
          UNION ALL SELECT 'restaurant_menu', COUNT(*) FROM restaurant_menu
          UNION ALL SELECT 'restaurant_image', COUNT(*) FROM restaurant_image
          UNION ALL SELECT 'restaurant_facility', COUNT(*) FROM restaurant_facility
          UNION ALL SELECT 'restaurant_keyword', COUNT(*) FROM restaurant_keyword
          UNION ALL SELECT 'recommendation_request', COUNT(*) FROM recommendation_request
          UNION ALL SELECT 'recommendation_result', COUNT(*) FROM recommendation_result
          UNION ALL SELECT 'waiting', COUNT(*) FROM waiting
          UNION ALL SELECT 'payment', COUNT(*) FROM payment
          UNION ALL SELECT 'reservation', COUNT(*) FROM reservation
          UNION ALL SELECT 'table_realtime_state', COUNT(*) FROM table_realtime_state
          UNION ALL SELECT 'table_usage_history', COUNT(*) FROM table_usage_history
          UNION ALL SELECT 'restaurant_review', COUNT(*) FROM restaurant_review
          UNION ALL SELECT 'review_image', COUNT(*) FROM review_image
          UNION ALL SELECT 'bookmark', COUNT(*) FROM bookmark
          UNION ALL SELECT 'notification', COUNT(*) FROM notification;