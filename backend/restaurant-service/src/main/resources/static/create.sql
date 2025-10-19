-- ==========================================
-- Tabletopia 프로젝트 모든 테이블 삭제
-- 외래 키 의존성 순서에 따라 삭제
-- ==========================================

-- 외래 키 제약 조건 임시 비활성화 (MySQL)
SET FOREIGN_KEY_CHECKS = 0;

-- ===== 자식 테이블부터 삭제 (외래 키가 있는 테이블들) =====

-- 알림 (waiting_id → waiting 참조)
DROP TABLE IF EXISTS `notification`;

-- 추천 결과 (recommendation_request_id → recommendation_request 참조)
DROP TABLE IF EXISTS `recommendation_result`;

-- 추천 요청 (user_id → user 참조)
DROP TABLE IF EXISTS `recommendation_request`;

-- 북마크 (user_id, restaurant_id 참조)
DROP TABLE IF EXISTS `bookmark`;

-- 리뷰 이미지 (restaurant_review_id → restaurant_review 참조)
DROP TABLE IF EXISTS `review_image`;

-- 리뷰 (user_id, restaurant_id 참조)
DROP TABLE IF EXISTS `restaurant_review`;

-- 테이블 사용 히스토리 (restaurant_table_id 참조)
DROP TABLE IF EXISTS `table_usage_history`;

-- 실시간 테이블 상태 (restaurant_table_id 참조)
DROP TABLE IF EXISTS `table_realtime_state`;

-- 웨이팅 (restaurant_id, user_id 참조)
DROP TABLE IF EXISTS `waiting`;

-- 예약 (user_id, restaurant_id, restaurant_table_id 참조)
DROP TABLE IF EXISTS `reservation`;

-- 수수료 기록 (restaurant_id, commission_policy_id, payment_id 참조)
DROP TABLE IF EXISTS `commission_record`;

-- 레스토랑 키워드 (restaurant_id, keyword_id 참조)
DROP TABLE IF EXISTS `restaurant_keyword`;

-- 레스토랑 시설 (restaurant_id, facility_id 참조)
DROP TABLE IF EXISTS `restaurant_facility`;

-- 레스토랑 이미지 (restaurant_id 참조)
DROP TABLE IF EXISTS `restaurant_image`;

-- 레스토랑 메뉴 (restaurant_id 참조)
DROP TABLE IF EXISTS `restaurant_menu`;

-- 레스토랑 특별 운영시간 (restaurant_id 참조)
DROP TABLE IF EXISTS `restaurant_special_hour`;

-- 레스토랑 운영시간 (restaurant_id 참조)
DROP TABLE IF EXISTS `restaurant_opening_hour`;

-- 레스토랑 테이블 (restaurant_id 참조)
DROP TABLE IF EXISTS `restaurant_table`;

-- 레스토랑 (restaurant_category_id, admin_id 참조)
DROP TABLE IF EXISTS `restaurant`;

-- 사용자 (sns_provider_id 참조)
DROP TABLE IF EXISTS `user`;

-- ===== 독립 테이블들 삭제 =====

-- 키워드
DROP TABLE IF EXISTS `keyword`;

-- 시설
DROP TABLE IF EXISTS `facility`;

-- 광고 플랜
DROP TABLE IF EXISTS `ad_plan`;

-- 수수료 정책
DROP TABLE IF EXISTS `commission_policy`;

-- 결제
DROP TABLE IF EXISTS `payment`;

-- 레스토랑 카테고리
DROP TABLE IF EXISTS `restaurant_category`;

-- 레스토랑 계정
DROP TABLE IF EXISTS `admin`;

-- SNS 제공자
DROP TABLE IF EXISTS `sns_provider`;

-- 외래 키 제약 조건 다시 활성화
SET FOREIGN_KEY_CHECKS = 1;

-- ===== 삭제 확인 =====
SHOW TABLES;

-- ==========================================
-- 삭제 순서 설명
-- ==========================================
/*
🗑️ 테이블 삭제 순서 (외래 키 의존성 기준):

1차: 최하위 자식 테이블들
- notification (waiting 참조)
- recommendation_result (recommendation_request 참조)
- review_image (restaurant_review 참조)
- table_usage_history (restaurant_table 참조)

2차: 중간 단계 테이블들  
- recommendation_request (user 참조)
- bookmark (user, restaurant 참조)
- restaurant_review (user, restaurant 참조)
- table_realtime_state (restaurant_table 참조)
- waiting (restaurant, user 참조)
- reservation (user, restaurant, restaurant_table 참조)

3차: 레스토랑 관련 테이블들
- commission_record (restaurant, commission_policy, payment 참조)
- restaurant_keyword (restaurant, keyword 참조)  
- restaurant_facility (restaurant, facility 참조)
- restaurant_image (restaurant 참조)
- restaurant_menu (restaurant 참조)
- restaurant_special_hour (restaurant 참조)
- restaurant_opening_hour (restaurant 참조)
- restaurant_table (restaurant 참조)

4차: 메인 테이블들
- restaurant (restaurant_category, admin 참조)
- user (sns_provider 참조)

5차: 독립 테이블들 (외래 키 없음)
- keyword, facility, ad_plan, commission_policy, payment
- restaurant_category, admin, sns_provider

⚠️ 주의사항:
- SET FOREIGN_KEY_CHECKS = 0; 사용으로 안전하게 삭제
- 삭제 후 SHOW TABLES;로 확인
- 데이터 백업 필수!
*/

-- ==========================================
-- Tabletopia 프로젝트 데이터베이스 스키마
-- 네이밍 규칙 적용 버전
-- ==========================================

-- 사용자 테이블
CREATE TABLE `user` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(100) NOT NULL UNIQUE COMMENT '아이디 겸용',
    `password` VARCHAR(100),
    `name` VARCHAR(20) NOT NULL,
    `phone_number` VARCHAR(13) NULL,
--     `sns_provider_id` BIGINT NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT FALSE COMMENT '활성화 여부',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (`id`),
    INDEX `idx_user_email` (`email`),
    INDEX `idx_user_is_deleted` (`is_deleted`)
--     FOREIGN KEY (`sns_provider_id`) REFERENCES `sns_provider`(`id`)
);

-- 레스토랑 계정 테이블
CREATE TABLE `admin` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `password` VARCHAR(100) NOT NULL,
    `name` VARCHAR(10) NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
);

-- 레스토랑 카테고리 테이블
CREATE TABLE `restaurant_category` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL UNIQUE COMMENT '한식, 중식, 일식 등',
    `display_order` INT NULL COMMENT '1.한식, 2. 중식... 순서',
    `is_deleted` BOOLEAN NOT NULL DEFAULT FALSE,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (`id`)
);

-- 시설 정보
CREATE TABLE `facility` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL UNIQUE,
    PRIMARY KEY (`id`)
);

-- 키워드
CREATE TABLE `keyword` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `keyword` VARCHAR(50) NOT NULL UNIQUE,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
);

-- 광고 플랜
CREATE TABLE `ad_plan` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL UNIQUE,
    `monthly_price` INT NOT NULL CHECK (`monthly_price` >= 0),
    `is_main_exposure` BOOLEAN NOT NULL DEFAULT FALSE,
    `is_mypage_exposure` BOOLEAN NOT NULL DEFAULT FALSE,
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
);

-- 수수료 정책
CREATE TABLE `commission_policy` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(25) NOT NULL,
    `min_reservation_count` INT NOT NULL,
    `max_reservation_count` INT NOT NULL,
    `commission_amount` BIGINT NOT NULL,
    `effective_start_at` TIMESTAMP NOT NULL,
    `effective_end_at` TIMESTAMP NOT NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT FALSE,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (`id`),
    INDEX `idx_commission_policy_effective` (`effective_start_at`, `effective_end_at`)
);

-- 레스토랑 테이블
CREATE TABLE `restaurant` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `restaurant_category_id` BIGINT NOT NULL,
    `admin_id` BIGINT NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `latitude` DECIMAL(11,8) NOT NULL,
    `longitude` DECIMAL(11,8) NOT NULL,
    `region_code` VARCHAR(20) NOT NULL,
    `phone_number` VARCHAR(20) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `is_waiting_open` BOOLEAN NOT NULL DEFAULT FALSE COMMENT '웨이팅 오픈 여부',
    `is_deleted` BOOLEAN NOT NULL DEFAULT FALSE,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (`id`),
    INDEX `idx_restaurant_region` (`region_code`),
    INDEX `idx_restaurant_category` (`restaurant_category_id`),
    INDEX `idx_restaurant_waiting_open` (`is_waiting_open`),
    FOREIGN KEY (`restaurant_category_id`) REFERENCES `restaurant_category`(`id`),
    FOREIGN KEY (`admin_id`) REFERENCES `admin`(`id`)
);

-- 추천 요청
CREATE TABLE `recommendation_request` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `recommendation_type` ENUM('RESTAURANT', 'TODAY_RESERVATION', 'KEYWORD') NOT NULL COMMENT '추천 종류',
    `request_data` JSON NULL COMMENT '추천 요청 데이터',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (`id`),
    INDEX `idx_recommendation_user` (`user_id`),
    INDEX `idx_recommendation_type` (`recommendation_type`),
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`)
);

-- -- 레스토랑 계정 테이블
-- CREATE TABLE `superadmin` (
--     `id` BIGINT NOT NULL AUTO_INCREMENT,
--     `email` VARCHAR(100) NOT NULL UNIQUE,
--     `password` VARCHAR(100) NOT NULL,
--     `name` VARCHAR(10) NOT NULL,
--     `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--     FOREIGN KEY (`restaurant_id`) REFERENCES `restaurant`(`id`) ON DELETE CASCADE,
--     PRIMARY KEY (`id`)
-- );

-- 레스토랑 테이블 정보
CREATE TABLE `restaurant_table` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `restaurant_id` BIGINT NOT NULL,
    `name` VARCHAR(50) NOT NULL COMMENT '11번/창가석 같은 것',
    `min_capacity` INT NULL COMMENT '테이블 최소 인원',
    `max_capacity` INT NOT NULL CHECK (`max_capacity` > 0) COMMENT '테이블 최대 인원',
    `x_position` INT NOT NULL COMMENT '배치도 X 좌표',
    `y_position` INT NOT NULL COMMENT '배치도 Y 좌표',
    `shape` VARCHAR(20) NOT NULL DEFAULT 'RECTANGLE' COMMENT '테이블 모양',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_restaurant_table_name` (`restaurant_id`, `name`),
    FOREIGN KEY (`restaurant_id`) REFERENCES `restaurant`(`id`) ON DELETE CASCADE
);

-- 레스토랑 운영시간
-- 레스토랑 기본 운영시간 테이블
CREATE TABLE `restaurant_opening_hour` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `restaurant_id` BIGINT NOT NULL,
    `day_of_week` TINYINT NOT NULL CHECK (`day_of_week` BETWEEN 0 AND 6) COMMENT '0=일요일 ~ 6=토요일',
    `open_time` TIME NULL COMMENT '휴무일일 경우 NULL',
    `close_time` TIME NULL COMMENT '휴무일일 경우 NULL',
    `is_holiday` BOOLEAN NOT NULL DEFAULT FALSE COMMENT '휴무 여부',
    `break_start_time` TIME NULL COMMENT '브레이크 시작 시간',
    `break_end_time` TIME NULL COMMENT '브레이크 종료 시간',
    `reservation_interval` INT NULL COMMENT '예약 간격(분), 휴무일에는 NULL 가능',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_restaurant_opening_day` (`restaurant_id`, `day_of_week`),
    FOREIGN KEY (`restaurant_id`) REFERENCES `restaurant`(`id`) ON DELETE CASCADE
);


-- 레스토랑 특별 운영시간
CREATE TABLE `restaurant_special_hour` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `restaurant_id` BIGINT NOT NULL,
    `special_date` DATE NOT NULL COMMENT '특정 날짜(휴무일)',
    `open_time` TIME NULL COMMENT 'null이면 휴무',
    `close_time` TIME NULL,
    `is_closed` BOOLEAN NOT NULL DEFAULT FALSE COMMENT '완전 휴무 여부',
    `special_info` VARCHAR(100) NULL COMMENT '메모 (예: 설날 휴무, 크리스마스 연장영업)',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_restaurant_special_date` (`restaurant_id`, `special_date`),
    FOREIGN KEY (`restaurant_id`) REFERENCES `restaurant`(`id`) ON DELETE CASCADE
);

-- 레스토랑 메뉴
CREATE TABLE `restaurant_menu` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `restaurant_id` BIGINT NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `price` INT NOT NULL CHECK (`price` >= 0),
    `description` VARCHAR(255) NOT NULL,
    `category` VARCHAR(50) NULL COMMENT '메인, 사이드, 음료',
    `image_filename` VARCHAR(255) NULL,
    `is_soldout` BOOLEAN NOT NULL DEFAULT FALSE,
    `is_deleted` BOOLEAN NOT NULL DEFAULT FALSE,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (`id`),
    FOREIGN KEY (`restaurant_id`) REFERENCES `restaurant`(`id`) ON DELETE CASCADE
);

-- 레스토랑 이미지
CREATE TABLE `restaurant_image` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `restaurant_id` BIGINT NOT NULL,
    `image_url` VARCHAR(255) NOT NULL,
    `is_main` BOOLEAN NOT NULL DEFAULT FALSE COMMENT '대표 이미지 여부',
    `sort_order` INT NOT NULL DEFAULT 0 COMMENT '정렬 순서',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (`id`),
    FOREIGN KEY (`restaurant_id`) REFERENCES `restaurant`(`id`) ON DELETE CASCADE
);

-- 레스토랑 시설 (중간 테이블)
CREATE TABLE `restaurant_facility` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `restaurant_id` BIGINT NOT NULL,
    `facility_id` BIGINT NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_restaurant_facility` (`restaurant_id`, `facility_id`),
    FOREIGN KEY (`restaurant_id`) REFERENCES `restaurant`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`facility_id`) REFERENCES `facility`(`id`)
);

-- 레스토랑 키워드 (중간 테이블)
CREATE TABLE `restaurant_keyword` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `restaurant_id` BIGINT NOT NULL,
    `keyword_id` BIGINT NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_restaurant_keyword` (`restaurant_id`, `keyword_id`),
    FOREIGN KEY (`restaurant_id`) REFERENCES `restaurant`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`keyword_id`) REFERENCES `keyword`(`id`)
);

-- 웨이팅
CREATE TABLE `waiting` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `restaurant_id` BIGINT NOT NULL,
    `user_id` BIGINT NOT NULL,
    `people_count` INT NOT NULL CHECK (`people_count` > 0),
    `waiting_number` INT NOT NULL,
    `delay_count` INT NOT NULL DEFAULT 0,
    `waiting_state` ENUM('WAITING', 'CANCELLED', 'CALLED', 'EXPIRED', 'SEATED') NOT NULL,
    
    -- 스냅샷 정보
    `restaurant_name_snapshot` VARCHAR(100) NOT NULL,
    `assigned_table_name` VARCHAR(50) NULL,
    `assigned_table_capacity` INT NULL,
    
    `called_at` TIMESTAMP NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_waiting_restaurant_number` (`restaurant_id`, `waiting_number`, `created_at`),
    INDEX `idx_waiting_user` (`user_id`),
    INDEX `idx_waiting_restaurant_state` (`restaurant_id`, `waiting_state`),
    INDEX `idx_waiting_number` (`restaurant_id`, `waiting_number`),
    FOREIGN KEY (`restaurant_id`) REFERENCES `restaurant`(`id`),
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`)
);

-- 리뷰
CREATE TABLE `restaurant_review` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `restaurant_id` BIGINT NOT NULL,
    `rating` INT NOT NULL CHECK(`rating` BETWEEN 1 AND 5) COMMENT '별점 1~5',
    `comment` TEXT NOT NULL,
    `source_type` ENUM('RESERVATION', 'WAITING') NOT NULL COMMENT '방문 경로',
    `source_id` BIGINT NOT NULL COMMENT '예약 또는 웨이팅 ID',
    `is_deleted` BOOLEAN NOT NULL DEFAULT FALSE,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_restaurant_review` (`user_id`, `restaurant_id`),
    INDEX `idx_restaurant_review_restaurant` (`restaurant_id`),
    INDEX `idx_restaurant_review_rating` (`rating`),
    INDEX `idx_restaurant_review_is_deleted` (`is_deleted`),
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`),
    FOREIGN KEY (`restaurant_id`) REFERENCES `restaurant`(`id`) ON DELETE CASCADE
);

-- 북마크
CREATE TABLE `bookmark` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `restaurant_id` BIGINT NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_restaurant_bookmark` (`user_id`, `restaurant_id`),
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`restaurant_id`) REFERENCES `restaurant`(`id`) ON DELETE CASCADE
);

-- 추천 결과
CREATE TABLE `recommendation_result` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `recommendation_request_id` BIGINT NOT NULL,
    `restaurant_id` BIGINT NOT NULL,
    `rank_order` INT NOT NULL,
    `score` DECIMAL(5,2) NULL COMMENT '추천 점수',
    `reason` VARCHAR(255) NULL COMMENT '추천 이유',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (`id`),
    INDEX `idx_recommendation_result_request` (`recommendation_request_id`),
    INDEX `idx_recommendation_result_rank` (`recommendation_request_id`, `rank_order`),
    FOREIGN KEY (`recommendation_request_id`) REFERENCES `recommendation_request`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`restaurant_id`) REFERENCES `restaurant`(`id`)
);

-- 실시간 테이블 상태 관리
CREATE TABLE `table_realtime_state` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `restaurant_table_id` BIGINT NOT NULL, 
    `table_state` ENUM('AVAILABLE', 'OCCUPIED', 'RESERVED', 'CLEANING', 'OUT_OF_ORDER') NOT NULL DEFAULT 'AVAILABLE',
    `start_at` TIMESTAMP NULL COMMENT '점유 시작 시간',
    `end_at` TIMESTAMP NULL COMMENT '예상 해제 시간',
    `current_people_count` INT NULL COMMENT '현재 착석 인원',
    `source_type` ENUM('RESERVATION', 'WALK_IN', 'WAITING') NULL,
    `source_id` BIGINT NULL COMMENT '예약/웨이팅 ID',
    `customer_info` JSON NULL COMMENT '고객 정보',
    `manager_notes` VARCHAR(255) NULL COMMENT '관리자 메모',
    `updated_by` BIGINT NULL COMMENT '마지막 수정한 관리자 ID',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_table_realtime_state` (`restaurant_table_id`),  -- 테이블당 상태 1개
    INDEX `idx_table_state_state` (`table_state`),
    FOREIGN KEY (`restaurant_table_id`) REFERENCES `restaurant_table`(`id`) ON DELETE CASCADE
);

-- 테이블 사용 히스토리
CREATE TABLE `table_usage_history` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `restaurant_table_id` BIGINT NULL,  -- FK 유지하되 NULL 허용
    
    -- 스냅샷 정보 추가
    `restaurant_id_snapshot` BIGINT NOT NULL,
    `restaurant_name_snapshot` VARCHAR(100) NOT NULL,
    `table_name_snapshot` VARCHAR(50) NOT NULL,
    `table_capacity_snapshot` INT NOT NULL,
    
    `source_type` ENUM('RESERVATION', 'WALK_IN', 'WAITING') NOT NULL,
    `source_id` BIGINT NULL,
    `people_count` INT NOT NULL,
    `start_at` TIMESTAMP NOT NULL,
    `end_at` TIMESTAMP NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (`id`),
    INDEX `idx_table_history_restaurant_snapshot` (`restaurant_id_snapshot`),
    INDEX `idx_table_history_table_snapshot` (`restaurant_table_id`),
    FOREIGN KEY (`restaurant_table_id`) REFERENCES `restaurant_table`(`id`) 
        ON DELETE SET NULL  -- 삭제 시 NULL로 설정
);

-- 알림
CREATE TABLE `notification` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `waiting_id` BIGINT NOT NULL,
    `user_id` BIGINT NOT NULL,
    `message` TEXT NULL,
    `notification_type` ENUM('REGISTERED', 'APPROACHING', 'CALLED') NOT NULL,
    `sent_at` TIMESTAMP NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (`id`),
    INDEX `idx_notification_user` (`user_id`),
    INDEX `idx_notification_waiting` (`waiting_id`),
    INDEX `idx_notification_type` (`notification_type`),
    FOREIGN KEY (`waiting_id`) REFERENCES `waiting`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`)
);

-- 리뷰 이미지
CREATE TABLE `review_image` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `restaurant_review_id` BIGINT NOT NULL,
    `image_filename` VARCHAR(255) NULL,
    `image_url` VARCHAR(255) NOT NULL,
    `sort_order` INT NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (`id`),
    INDEX `idx_review_image_review` (`restaurant_review_id`),
    FOREIGN KEY (`restaurant_review_id`) REFERENCES `restaurant_review`(`id`) ON DELETE CASCADE
);

-- 예약
CREATE TABLE `reservation` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `restaurant_id` BIGINT NOT NULL,
    `restaurant_table_id` BIGINT NOT NULL,
    `people_count` INT NOT NULL CHECK (`people_count` > 0),

    -- 스냅샷 정보 (예약 당시 상태 보존)
    `restaurant_name_snapshot` VARCHAR(100) NOT NULL,
    `restaurant_address_snapshot` VARCHAR(255) NOT NULL,
    `restaurant_phone_snapshot` VARCHAR(20) NOT NULL,
    `restaurant_table_name_snapshot` VARCHAR(50) NOT NULL,
    `restaurant_table_capacity_snapshot` INT NOT NULL,

    -- 예약 상태 및 시간
    `reservation_state` ENUM('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW') NOT NULL,
    `reservation_at` TIMESTAMP NOT NULL,
    `processed_at` TIMESTAMP NULL,
    `completed_at` TIMESTAMP NULL,
    `rejected_reason` VARCHAR(500) NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`),
    INDEX `idx_reservation_user` (`user_id`),
    INDEX `idx_reservation_restaurant` (`restaurant_id`),
    INDEX `idx_reservation_datetime` (`reservation_at`),
    INDEX `idx_reservation_state` (`reservation_state`),
    FOREIGN KEY (`restaurant_id`) REFERENCES `restaurant`(`id`),
    FOREIGN KEY (`restaurant_table_id`) REFERENCES `restaurant_table`(`id`)
);

-- 결제내역(간소화)
CREATE TABLE `payment` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `order_no` VARCHAR(100) NOT NULL,        -- 주문번호 (PG/내부 공통 식별자)
    `reservation_id` BIGINT NOT NULL,        -- 예약과 연결
    `pay_method` VARCHAR(50) NOT NULL,       -- 결제수단 (CARD, KAKAO_PAY 등)
    `amount` DECIMAL(10,2) NOT NULL,         -- 결제금액
    `status` ENUM('READY', 'SUCCESS', 'FAIL', 'CANCEL') DEFAULT 'READY', -- 결제 상태
    `pg_tid` VARCHAR(100) DEFAULT NULL,      -- PG 거래 고유번호 (optional)
    `approved_at` DATETIME DEFAULT NULL,     -- 결제 승인일시
    `canceled_at` DATETIME DEFAULT NULL,     -- 결제 취소일시
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX `idx_payment_order_no` (`order_no`),
    INDEX `idx_payment_status` (`status`),
    FOREIGN KEY (`reservation_id`) REFERENCES `reservation`(`id`)
);

-- 수수료 기록
CREATE TABLE `commission_record` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `restaurant_id` BIGINT NOT NULL,
    `commission_policy_id` BIGINT NOT NULL,
    `applied_date` DATE NOT NULL,
    `reservation_count` INT NULL DEFAULT 0,
    `total_amount` BIGINT NOT NULL DEFAULT 0,
--     `payment_id` BIGINT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_commission_restaurant_date` (`restaurant_id`, `applied_date`),
    INDEX `idx_commission_record_restaurant` (`restaurant_id`),
    INDEX `idx_commission_record_date` (`applied_date`),
    FOREIGN KEY (`restaurant_id`) REFERENCES `restaurant`(`id`),
    FOREIGN KEY (`commission_policy_id`) REFERENCES `commission_policy`(`id`)
--     FOREIGN KEY (`payment_id`) REFERENCES `payment`(`id`)
);
ALTER TABLE reservation ADD COLUMN name VARCHAR(100);
ALTER TABLE reservation ADD COLUMN phone_number VARCHAR(20);
