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

-- 결제 테이블
CREATE TABLE `payment` (
                           `id` BIGINT NOT NULL AUTO_INCREMENT,
                           `payment_type` ENUM('COMMISSION', 'AD_FEE', 'SUBSCRIPTION') NOT NULL,
                           `amount` BIGINT NOT NULL,
                           `payment_method` ENUM('CARD', 'BANK_TRANSFER', 'VIRTUAL_ACCOUNT') NOT NULL,
                           `payment_status` ENUM('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED') NOT NULL,
                           `paid_at` TIMESTAMP NULL,
                           `payment_gateway_id` VARCHAR(100) NULL COMMENT '결제 게이트웨이 거래 ID',
                           `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                           `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

                           PRIMARY KEY (`id`),
                           INDEX `idx_payment_status` (`payment_status`),
                           INDEX `idx_payment_type` (`payment_type`)
);

-- SNS 제공자 테이블
CREATE TABLE `sns_provider` (
                                `id` BIGINT NOT NULL AUTO_INCREMENT,
                                `name` VARCHAR(100) NOT NULL UNIQUE,
                                `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                PRIMARY KEY (`id`)
);

-- 사용자 테이블
CREATE TABLE `user` (
                        `id` BIGINT NOT NULL AUTO_INCREMENT,
                        `email` VARCHAR(100) NOT NULL UNIQUE COMMENT '아이디 겸용',
                        `password` VARCHAR(100),
                        `name` VARCHAR(20) NOT NULL,
                        `phone_number` VARCHAR(13) NULL,
                        `sns_provider_id` BIGINT NULL,
                        `is_deleted` BOOLEAN NOT NULL DEFAULT FALSE COMMENT '활성화 여부',
                        `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

                        PRIMARY KEY (`id`),
                        INDEX `idx_user_email` (`email`),
                        INDEX `idx_user_is_deleted` (`is_deleted`),
                        FOREIGN KEY (`sns_provider_id`) REFERENCES `sns_provider`(`id`)
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

-- 레스토랑 계정 테이블


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

CREATE TABLE `superadmin` (
                              `id` BIGINT NOT NULL AUTO_INCREMENT,
                              `email` VARCHAR(100) NOT NULL UNIQUE,
                              `password` VARCHAR(100) NOT NULL,
                              `name` VARCHAR(10) NOT NULL,
                              `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                              `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                              FOREIGN KEY (`id`) REFERENCES `restaurant`(`id`) ON DELETE CASCADE,
                              PRIMARY KEY (`id`)
);

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

-- 시설 정보
CREATE TABLE `facility` (
                            `id` BIGINT NOT NULL AUTO_INCREMENT,
                            `name` VARCHAR(50) NOT NULL UNIQUE,
                            PRIMARY KEY (`id`)
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

-- 키워드
CREATE TABLE `keyword` (
                           `id` BIGINT NOT NULL AUTO_INCREMENT,
                           `keyword` VARCHAR(50) NOT NULL UNIQUE,
                           `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                           `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                           PRIMARY KEY (`id`)
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

-- 수수료 기록
CREATE TABLE `commission_record` (
                                     `id` BIGINT NOT NULL AUTO_INCREMENT,
                                     `restaurant_id` BIGINT NOT NULL,
                                     `commission_policy_id` BIGINT NOT NULL,
                                     `applied_date` DATE NOT NULL,
                                     `reservation_count` INT NULL DEFAULT 0,
                                     `total_amount` BIGINT NOT NULL DEFAULT 0,
                                     `payment_id` BIGINT NULL,
                                     `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                     `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

                                     PRIMARY KEY (`id`),
                                     UNIQUE KEY `uk_commission_restaurant_date` (`restaurant_id`, `applied_date`),
                                     INDEX `idx_commission_record_restaurant` (`restaurant_id`),
                                     INDEX `idx_commission_record_date` (`applied_date`),
                                     FOREIGN KEY (`restaurant_id`) REFERENCES `restaurant`(`id`),
                                     FOREIGN KEY (`commission_policy_id`) REFERENCES `commission_policy`(`id`),
                                     FOREIGN KEY (`payment_id`) REFERENCES `payment`(`id`)
);
-- ==========================================
-- Tabletopia 프로젝트 더미 데이터 (외래 키 수정 완료)
-- ==========================================

-- SNS 제공자
INSERT INTO `sns_provider` (`name`)
VALUES
    ('KAKAO'),
    ('NAVER'),
    ('GOOGLE'),
    ('FACEBOOK');

-- 사용자 데이터
INSERT INTO `user` (`email`, `password`, `name`, `phone_number`, `sns_provider_id`)
VALUES
    ('user1@example.com', '$2a$10$abcdefghijk', '김철수', '010-1234-5678', NULL),
    ('user2@example.com', '$2a$10$abcdefghijk', '이영희', '010-2345-6789', 1),
    ('user3@example.com', '$2a$10$abcdefghijk', '박민수', '010-3456-7890', 2),
    ('user4@example.com', '$2a$10$abcdefghijk', '정수진', '010-4567-8901', NULL),
    ('user5@example.com', '$2a$10$abcdefghijk', '최동훈', '010-5678-9012', 3);

-- 레스토랑 계정
INSERT INTO `admin` (`email`, `password`, `name`)
VALUES
    ('restaurant1@example.com', '$2a$10$restaurant1pass', '레스토랑1'),
    ('restaurant2@example.com', '$2a$10$restaurant2pass', '레스토랑2'),
    ('restaurant3@example.com', '$2a$10$restaurant3pass', '레스토랑3'),
    ('restaurant4@example.com', '$2a$10$restaurant4pass', '레스토랑4'),
    ('restaurant5@example.com', '$2a$10$restaurant5pass', '레스토랑5');

-- 레스토랑 카테고리
INSERT INTO `restaurant_category` (`name`, `display_order`)
VALUES
    ('한식', 1),
    ('중식', 2),
    ('일식', 3),
    ('양식', 4),
    ('치킨', 5),
    ('피자', 6),
    ('카페', 7),
    ('분식', 8);

-- 레스토랑 데이터
INSERT INTO `restaurant` (`restaurant_category_id`, `admin_id`, `name`, `address`, `latitude`, `longitude`, `region_code`, `phone_number`, `description`)
VALUES
    (1, 1, '맛있는 한식당', '서울특별시 강남구 테헤란로 123', 37.50665000, 127.05318700, '11680', '02-1234-5678', '정통 한식을 맛볼 수 있는 곳입니다.'),
    (2, 2, '중화요리 만리장성', '서울특별시 중구 명동길 456', 37.56394900, 126.98200900, '11140', '02-2345-6789', '정통 중화요리 전문점입니다.'),
    (3, 3, '스시 마스터', '서울특별시 서초구 강남대로 789', 37.49794200, 127.02762400, '11650', '02-3456-7890', '신선한 스시를 제공합니다.'),
    (4, 4, '이탈리안 파스타', '서울특별시 마포구 홍대입구역로 321', 37.55704700, 126.92675300, '11560', '02-4567-8901', '정통 이탈리안 파스타 전문점입니다.'),
    (5, 5, '치킨킹', '서울특별시 송파구 잠실로 654', 37.51334800, 127.10018000, '11710', '02-5678-9012', '바삭한 치킨 전문점입니다.');

-- 레스토랑 테이블 정보 (수정완료)
INSERT INTO `restaurant_table` (`restaurant_id`, `name`, `min_capacity`, `max_capacity`, `x_position`, `y_position`, `shape`) VALUES
-- 맛있는 한식당 테이블 (restaurant_id = 1) - ID 1~4
(1, '1번 테이블', 2, 4, 100, 100, 'RECTANGLE'),
(1, '2번 테이블', 2, 4, 200, 100, 'RECTANGLE'),
(1, '3번 테이블', 4, 6, 300, 100, 'RECTANGLE'),
(1, '창가석', 2, 2, 100, 200, 'CIRCLE'),
-- 중화요리 만리장성 테이블 (restaurant_id = 2) - ID 5~7
(2, 'A1', 2, 4, 150, 150, 'RECTANGLE'),
(2, 'A2', 4, 8, 250, 150, 'RECTANGLE'),
(2, '룸1', 6, 10, 350, 150, 'RECTANGLE'),
-- 스시 마스터 테이블 (restaurant_id = 3) - ID 8~10
(3, '카운터1', 1, 2, 120, 120, 'RECTANGLE'),
(3, '카운터2', 1, 2, 220, 120, 'RECTANGLE'),
(3, '테이블1', 2, 4, 120, 220, 'RECTANGLE'),
-- 이탈리안 파스타 테이블 (restaurant_id = 4) - ID 11~13 [추가]
(4, '테이블1', 2, 4, 150, 100, 'RECTANGLE'),
(4, '테이블2', 2, 4, 250, 100, 'RECTANGLE'),
(4, '커플석', 2, 2, 100, 200, 'CIRCLE'),
-- 치킨킹 테이블 (restaurant_id = 5) - ID 14~16 [추가]
(5, '홀1', 4, 6, 200, 150, 'RECTANGLE'),
(5, '홀2', 4, 6, 300, 150, 'RECTANGLE'),
(5, '룸1', 6, 8, 400, 150, 'RECTANGLE');

-- 레스토랑 운영시간
INSERT INTO `restaurant_opening_hour` (`restaurant_id`, `day_of_week`, `open_time`, `close_time`, `break_start_time`, `break_end_time`, `reservation_interval`) VALUES
-- 맛있는 한식당 (월~일)(1, 1, '11:00:00', '22:00:00', '15:00:00', '17:00:00', 30),

(1, 2, '11:00:00', '22:00:00', '15:00:00', '17:00:00', 30),
(1, 3, '11:00:00', '22:00:00', '15:00:00', '17:00:00', 30),
(1, 4, '11:00:00', '22:00:00', '15:00:00', '17:00:00', 30),
(1, 5, '11:00:00', '22:00:00', '15:00:00', '17:00:00', 30),
(1, 6, '11:00:00', '23:00:00', NULL, NULL,30),
(1, 0, '11:00:00', '21:00:00', NULL, NULL, 30),
-- 중화요리 만리장성 (월~토, 일요일 휴무)
(2, 1, '12:00:00', '21:00:00', '15:00:00', '17:00:00', 30),
(2, 2, '12:00:00', '21:00:00', '15:00:00', '17:00:00', 30),
(2, 3, '12:00:00', '21:00:00', '15:00:00', '17:00:00', 30),
(2, 4, '12:00:00', '21:00:00', '15:00:00', '17:00:00', 30),
(2, 5, '12:00:00', '21:00:00', '15:00:00', '17:00:00', 30),
(2, 6, '12:00:00', '22:00:00', NULL, NULL, 30),
-- 스시 마스터 (매일 영업)
(3, 0, '17:00:00', '23:00:00', NULL, NULL, 30),
(3, 1, '17:00:00', '23:00:00', NULL, NULL, 30),
(3, 2, '17:00:00', '23:00:00', NULL, NULL, 30),
(3, 3, '17:00:00', '23:00:00', NULL, NULL, 30),
(3, 4, '17:00:00', '23:00:00', NULL, NULL, 30),
(3, 5, '17:00:00', '23:00:00', NULL, NULL, 30),
(3, 6, '17:00:00', '00:00:00', NULL, NULL, 30),
-- 이탈리안 파스타 (월~일)
(4, 0, '11:30:00', '22:00:00', '15:00:00', '17:30:00', 20),
(4, 1, '11:30:00', '22:00:00', '15:00:00', '17:30:00', 20),
(4, 2, '11:30:00', '22:00:00', '15:00:00', '17:30:00', 20),
(4, 3, '11:30:00', '22:00:00', '15:00:00', '17:30:00', 20),
(4, 4, '11:30:00', '22:00:00', '15:00:00', '17:30:00', 20),
(4, 5, '11:30:00', '23:00:00', NULL, NULL, 20),
(4, 6, '11:30:00', '23:00:00', NULL, NULL, 20),
-- 치킨킹 (매일 영업)
(5, 0, '16:00:00', '02:00:00', NULL, NULL, 40),
(5, 1, '16:00:00', '02:00:00', NULL, NULL, 40),
(5, 2, '16:00:00', '02:00:00', NULL, NULL, 40),
(5, 3, '16:00:00', '02:00:00', NULL, NULL, 40),
(5, 4, '16:00:00', '02:00:00', NULL, NULL, 40),
(5, 5, '16:00:00', '03:00:00', NULL, NULL, 40),
(5, 6, '16:00:00', '03:00:00', NULL, NULL, 40);

-- 레스토랑 메뉴
INSERT INTO `restaurant_menu` (`restaurant_id`, `name`, `price`, `description`, `category`) VALUES
-- 맛있는 한식당 메뉴
(1, '김치찌개', 8000, '깊은 맛의 김치찌개', '메인'),
(1, '된장찌개', 7000, '구수한 된장찌개', '메인'),
(1, '불고기', 15000, '양념이 잘 밴 불고기', '메인'),
(1, '계란말이', 5000, '부드러운 계란말이', '사이드'),
(1, '콜라', 2000, '시원한 콜라', '음료'),
-- 중화요리 만리장성 메뉴
(2, '짜장면', 6000, '정통 짜장면', '메인'),
(2, '짬뽕', 7000, '매콤한 짬뽕', '메인'),
(2, '탕수육', 18000, '바삭한 탕수육', '메인'),
(2, '군만두', 8000, '속이 꽉 찬 군만두', '사이드'),
(2, '우롱차', 3000, '따뜻한 우롱차', '음료'),
-- 스시 마스터 메뉴
(3, '연어초밥', 12000, '신선한 연어초밥', '메인'),
(3, '참치초밥', 15000, '참치초밥', '메인'),
(3, '스시세트', 25000, '다양한 스시 세트', '메인'),
(3, '미소된장국', 4000, '일본식 된장국', '사이드'),
(3, '녹차', 3000, '따뜻한 녹차', '음료'),
-- 이탈리안 파스타 메뉴
(4, '까르보나라', 14000, '크림 파스타', '메인'),
(4, '알리오올리오', 12000, '올리브오일 파스타', '메인'),
(4, '마르게리타 피자', 16000, '토마토와 모짜렐라 피자', '메인'),
(4, '시저샐러드', 8000, '신선한 시저샐러드', '사이드'),
(4, '와인', 25000, '하우스 와인', '음료'),
-- 치킨킹 메뉴
(5, '후라이드 치킨', 18000, '바삭한 후라이드 치킨', '메인'),
(5, '양념치킨', 20000, '달콤매콤한 양념치킨', '메인'),
(5, '간장치킨', 19000, '짭조름한 간장치킨', '메인'),
(5, '치킨무', 2000, '아삭한 치킨무', '사이드'),
(5, '맥주', 4000, '시원한 맥주', '음료');

-- 시설 정보
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

INSERT INTO facility (id, name)
VALUES
    (9, '화장실'),
    (10, '포장 가능'),
    (11, '배달 가능'),
    (12, '노키즈존');

-- 레스토랑 시설
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

-- 키워드
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

-- 레스토랑 키워드
INSERT INTO `restaurant_keyword` (`restaurant_id`, `keyword_id`)
VALUES
    (1, 1), (1, 2), (1, 8),  -- 맛있는 한식당: 데이트, 가족모임, 맛집
    (2, 2), (2, 3), (2, 6),  -- 중화요리: 가족모임, 회식, 가성비
    (3, 1), (3, 5), (3, 7),  -- 스시 마스터: 데이트, 분위기 좋은, 신선한
    (4, 1), (4, 5), (4, 8),  -- 이탈리안: 데이트, 분위기 좋은, 맛집
    (5, 2), (5, 6), (5, 10); -- 치킨킹: 가족모임, 가성비, 넓은

-- 예약 데이터 (수정완료)
INSERT INTO `reservation` (`user_id`, `restaurant_id`, `restaurant_table_id`, `people_count`, `restaurant_name_snapshot`, `restaurant_address_snapshot`, `restaurant_phone_snapshot`, `restaurant_table_name_snapshot`, `restaurant_table_capacity_snapshot`, `reservation_state`, `reservation_at`)
VALUES
    (1, 1, 1, 2, '맛있는 한식당', '서울특별시 강남구 테헤란로 123', '02-1234-5678', '1번 테이블', 4, 'CONFIRMED', '2025-09-17 19:00:00'),
    (2, 2, 5, 4, '중화요리 만리장성', '서울특별시 중구 명동길 456', '02-2345-6789', 'A1', 4, 'PENDING', '2025-09-18 18:30:00'),
    (3, 3, 8, 2, '스시 마스터', '서울특별시 서초구 강남대로 789', '02-3456-7890', '카운터1', 2, 'CONFIRMED', '2025-09-17 20:00:00'),
    (4, 1, 3, 6, '맛있는 한식당', '서울특별시 강남구 테헤란로 123', '02-1234-5678', '3번 테이블', 6, 'COMPLETED', '2025-09-15 18:00:00'),
    (5, 4, 11, 3, '이탈리안 파스타', '서울특별시 마포구 홍대입구역로 321', '02-4567-8901', '테이블1', 4, 'CONFIRMED', '2025-09-16 19:30:00'); -- NULL에서 11로 수정

INSERT INTO `reservation` (`user_id`, `restaurant_id`, `restaurant_table_id`, `people_count`, `restaurant_name_snapshot`, `restaurant_address_snapshot`, `restaurant_phone_snapshot`, `restaurant_table_name_snapshot`, `restaurant_table_capacity_snapshot`, `reservation_state`, `reservation_at`)
VALUES
    (4, 1, 2, 6, '맛있는 한식당', '서울특별시 강남구 테헤란로 123', '02-1234-5678', '3번 테이블', 6, 'COMPLETED', '2025-09-15 18:00:00');

INSERT INTO `reservation` (`user_id`, `restaurant_id`, `restaurant_table_id`, `people_count`, `restaurant_name_snapshot`, `restaurant_address_snapshot`, `restaurant_phone_snapshot`, `restaurant_table_name_snapshot`, `restaurant_table_capacity_snapshot`, `reservation_state`, `reservation_at`)
VALUES
    (4, 1, 2, 6, '맛있는 한식당', '서울특별시 강남구 테헤란로 123', '02-1234-5678', '3번 테이블', 6, 'COMPLETED', '2025-09-15 17:00:00');


-- 웨이팅 데이터
INSERT INTO `waiting` (`restaurant_id`, `user_id`, `people_count`, `waiting_number`, `waiting_state`, `restaurant_name_snapshot`)
VALUES
    (1, 2, 3, 1, 'WAITING', '맛있는 한식당'),
    (1, 3, 2, 2, 'WAITING', '맛있는 한식당'),
    (2, 4, 4, 1, 'CALLED', '중화요리 만리장성'),
    (3, 5, 2, 1, 'WAITING', '스시 마스터'),
    (4, 1, 2, 1, 'SEATED', '이탈리안 파스타');

-- 실시간 테이블 상태 (완전 수정)
INSERT INTO `table_realtime_state` (`restaurant_table_id`, `table_state`, `start_at`, `end_at`, `current_people_count`, `source_type`, `source_id`) VALUES
-- 맛있는 한식당 테이블들 (ID 1~4)
(1, 'RESERVED', '2025-09-17 19:00:00', '2025-09-17 21:00:00', NULL, 'RESERVATION', 1),
(2, 'AVAILABLE', NULL, NULL, NULL, NULL, NULL),
(3, 'OCCUPIED', '2025-09-16 18:30:00', '2025-09-16 20:30:00', 4, 'WALK_IN', NULL),
(4, 'CLEANING', '2025-09-16 20:45:00', '2025-09-16 21:00:00', NULL, NULL, NULL),
-- 중화요리 만리장성 테이블들 (ID 5~7)
(5, 'RESERVED', '2025-09-18 18:30:00', '2025-09-18 20:30:00', NULL, 'RESERVATION', 2),
(6, 'OCCUPIED', '2025-09-16 19:00:00', '2025-09-16 21:00:00', 6, 'RESERVATION', NULL),
(7, 'AVAILABLE', NULL, NULL, NULL, NULL, NULL),
-- 스시 마스터 테이블들 (ID 8~10)
(8, 'RESERVED', '2025-09-17 20:00:00', '2025-09-17 22:00:00', NULL, 'RESERVATION', 3),
(9, 'AVAILABLE', NULL, NULL, NULL, NULL, NULL),
(10, 'CLEANING', '2025-09-16 21:30:00', '2025-09-16 22:00:00', NULL, NULL, NULL),
-- 이탈리안 파스타 테이블들 (ID 11~13)
(11, 'RESERVED', '2025-09-16 19:30:00', '2025-09-16 21:30:00', NULL, 'RESERVATION', 5),
(12, 'OCCUPIED', '2025-09-16 18:00:00', '2025-09-16 20:00:00', 2, 'WAITING', 5),
(13, 'AVAILABLE', NULL, NULL, NULL, NULL, NULL),
-- 치킨킹 테이블들 (ID 14~16)
(14, 'OCCUPIED', '2025-09-16 19:30:00', '2025-09-16 21:30:00', 4, 'WALK_IN', NULL),
(15, 'AVAILABLE', NULL, NULL, NULL, NULL, NULL),
(16, 'AVAILABLE', NULL, NULL, NULL, NULL, NULL);

-- 리뷰 데이터
INSERT INTO `restaurant_review` (`user_id`, `restaurant_id`, `rating`, `comment`, `source_type`, `source_id`)
VALUES
    (4, 1, 5, '정말 맛있었어요! 김치찌개가 최고입니다.', 'RESERVATION', 4),
    (1, 3, 4, '신선한 스시와 좋은 분위기. 다시 방문하고 싶어요.', 'RESERVATION', 3),
    (5, 4, 5, '파스타가 정말 맛있고 분위기도 로맨틱해요.', 'WAITING', 5),
    (2, 2, 3, '맛은 괜찮은데 서비스가 조금 아쉬워요.', 'WAITING', 3),
    (3, 1, 5, '가족과 함께 갔는데 모두 만족했습니다.', 'WAITING', 2);

-- 북마크
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

-- 광고 플랜
INSERT INTO `ad_plan` (`name`, `monthly_price`, `is_main_exposure`, `is_mypage_exposure`)
VALUES
    ('베이직', 100000, FALSE, TRUE),
    ('스탠다드', 300000, TRUE, TRUE),
    ('프리미엄', 500000, TRUE, TRUE);

-- 수수료 정책
INSERT INTO `commission_policy` (`name`, `min_reservation_count`, `max_reservation_count`, `commission_amount`, `effective_start_at`, `effective_end_at`)
VALUES
    ('기본 정책', 0, 50, 1000, '2025-01-01 00:00:00', '2025-12-31 23:59:59'),
    ('대형 업체 정책', 51, 200, 800, '2025-01-01 00:00:00', '2025-12-31 23:59:59'),
    ('VIP 정책', 201, 999999, 500, '2025-01-01 00:00:00', '2025-12-31 23:59:59');

-- 결제 데이터
INSERT INTO `payment` (`payment_type`, `amount`, `payment_method`, `payment_status`, `paid_at`, `payment_gateway_id`)
VALUES
    ('COMMISSION', 50000, 'CARD', 'COMPLETED', '2025-09-01 10:00:00', 'PG_12345'),
    ('AD_FEE', 300000, 'BANK_TRANSFER', 'COMPLETED', '2025-09-01 14:30:00', 'PG_12346'),
    ('COMMISSION', 25000, 'VIRTUAL_ACCOUNT', 'PENDING', NULL, 'PG_12347'),
    ('SUBSCRIPTION', 100000, 'CARD', 'COMPLETED', '2025-09-15 09:15:00', 'PG_12348');

-- 수수료 기록
INSERT INTO `commission_record` (`restaurant_id`, `commission_policy_id`, `applied_date`, `reservation_count`, `total_amount`, `payment_id`)
VALUES
    (1, 1, '2025-09-01', 25, 25000, 1),
    (2, 1, '2025-09-01', 30, 30000, NULL),
    (3, 1, '2025-09-01', 20, 20000, 3),
    (4, 2, '2025-09-01', 80, 64000, NULL),
    (5, 1, '2025-09-01', 15, 15000, NULL);

-- 추천 요청
INSERT INTO `recommendation_request` (`user_id`, `recommendation_type`, `request_data`)
VALUES
    (1, 'RESTAURANT', '{"location": "강남구", "cuisine": "한식", "people_count": 2}'),
    (2, 'TODAY_RESERVATION', '{"date": "2025-09-17", "time": "19:00", "people_count": 4}'),
    (3, 'KEYWORD', '{"keywords": ["데이트", "분위기좋은"], "region": "서초구"}'),
    (4, 'RESTAURANT', '{"location": "중구", "max_price": 20000, "people_count": 3}'),
    (5, 'KEYWORD', '{"keywords": ["가족모임", "주차가능"], "region": "송파구"}');

-- 추천 결과
INSERT INTO `recommendation_result` (`recommendation_request_id`, `restaurant_id`, `rank_order`, `score`, `reason`)
VALUES
    (1, 1, 1, 95.5, '위치가 가깝고 한식 전문점이며 평점이 높습니다'),
    (1, 4, 2, 82.3, '분위기가 좋고 데이트 코스로 인기입니다'),
    (2, 2, 1, 88.7, '오늘 예약 가능하고 4인석이 있습니다'),
    (2, 3, 2, 76.4, '시간대가 맞고 신선한 재료를 사용합니다'),
    (3, 3, 1, 91.2, '데이트 코스로 유명하고 분위기가 좋습니다'),
    (3, 4, 2, 87.8, '로맨틱한 분위기와 테라스석이 있습니다');

-- 알림 데이터
INSERT INTO `notification` (`waiting_id`, `user_id`, `message`, `notification_type`, `sent_at`)
VALUES
    (1, 2, '웨이팅이 등록되었습니다. 현재 1번째 대기중입니다.', 'REGISTERED', '2025-09-16 18:00:00'),
    (2, 3, '웨이팅이 등록되었습니다. 현재 2번째 대기중입니다.', 'REGISTERED', '2025-09-16 18:15:00'),
    (3, 4, '곧 차례입니다. 매장 앞에서 대기해 주세요.', 'APPROACHING', '2025-09-16 19:45:00'),
    (3, 4, '입장 가능합니다. 매장으로 오세요.', 'CALLED', '2025-09-16 19:50:00'),
    (4, 5, '웨이팅이 등록되었습니다. 현재 1번째 대기중입니다.', 'REGISTERED', '2025-09-16 20:00:00');

-- ==========================================
-- 검증 쿼리 (데이터 확인용)
-- ==========================================

-- 1. restaurant_table 현황 확인
SELECT 'restaurant_table 현황' as info_type;
SELECT rt.id, r.name as restaurant_name, rt.name as table_name, rt.max_capacity
FROM restaurant_table rt
         JOIN restaurant r ON rt.restaurant_id = r.id
ORDER BY rt.id;

-- 2. 외래 키 제약 조건 위반 체크
SELECT 'reservation 외래키 체크' as check_type;
SELECT r.id, r.restaurant_table_id, rt.id as actual_table_id
FROM reservation r
         LEFT JOIN restaurant_table rt ON r.restaurant_table_id = rt.id
WHERE r.restaurant_table_id IS NOT NULL AND rt.id IS NULL;

SELECT 'table_realtime_state 외래키 체크' as check_type;
SELECT trs.id, trs.restaurant_table_id, rt.id as actual_table_id
FROM table_realtime_state trs
         LEFT JOIN restaurant_table rt ON trs.restaurant_table_id = rt.id
WHERE rt.id IS NULL;

-- 3. 테이블 상태 현황
SELECT 'table_realtime_state 현황' as info_type;
SELECT trs.restaurant_table_id, rt.name as table_name, r.name as restaurant_name, trs.table_state
FROM table_realtime_state trs
         JOIN restaurant_table rt ON trs.restaurant_table_id = rt.id
         JOIN restaurant r ON rt.restaurant_id = r.id
ORDER BY trs.restaurant_table_id;

-- ==========================================
-- 수정 완료 사항 요약
-- ==========================================
/*
🔧 수정된 사항들:

1. restaurant_table 테이블:
   - 이탈리안 파스타 (restaurant_id=4): 테이블1, 테이블2, 커플석 추가 (ID 11~13)
   - 치킨킹 (restaurant_id=5): 홀1, 홀2, 룸1 추가 (ID 14~16)
   - 총 16개 테이블로 확장

2. reservation 테이블:
   - 마지막 레코드의 restaurant_table_id를 NULL에서 11로 변경
   - 모든 외래 키 제약 조건 충족

3. table_realtime_state 테이블:
   - 모든 테이블(1~16)에 대한 실시간 상태 데이터 추가
   - 다양한 상태로 시뮬레이션 (AVAILABLE, OCCUPIED, RESERVED, CLEANING)

4. restaurant_opening_hour 테이블:
   - 누락된 레스토랑들의 운영시간 추가 (스시 마스터, 이탈리안 파스타, 치킨킹)

5. restaurant_menu 테이블:
   - 이탈리안 파스타와 치킨킹 메뉴 추가

✅ 외래 키 제약 조건 모두 해결완료
✅ 검증 쿼리로 데이터 무결성 확인 가능
✅ 총 16개 테이블에 대한 완전한 더미 데이터 제공

🚀 실행 순서:
1. 기존 데이터 삭제 (필요시)
2. 위 스크립트 전체 실행restaurant_tablerestaurant
3. 검증 쿼리로 데이터 확인
*/
