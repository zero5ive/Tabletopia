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
                         `name` VARCHAR(50) NOT NULL,
                         `role` ENUM('ADMIN', 'SUPERADMIN') NOT NULL DEFAULT 'ADMIN',
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
