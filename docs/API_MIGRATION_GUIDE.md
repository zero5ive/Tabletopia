# API 경로 통일 및 마이그레이션 가이드

## 개요
Spring Security에서 JWT(유저)와 세션(관리자) 인증을 명확히 분리하기 위해 모든 API 경로를 `/api/user/**`와 `/api/admin/**`로 재구성했습니다.

## 변경 날짜
2025-10-17

---

## 백엔드 변경사항

### 1. SecurityConfig 업데이트

#### Filter Chain 구조
```java
// Order 1: Admin Filter Chain (세션 기반)
@Bean
@Order(1)
public SecurityFilterChain adminFilterChain(HttpSecurity http)
- securityMatcher: "/api/admin/**"
- 인증 방식: Session
- permitAll: /api/admin/auth/login, /api/admin/auth/register
- 나머지: authenticated()

// Order 2: User Filter Chain (JWT 기반)
@Bean
@Order(2)
public SecurityFilterChain apiFilterChain(HttpSecurity http)
- securityMatcher: "/api/user/**"
- 인증 방식: JWT (JwtRequestFilter)
- permitAll:
  - /api/user/auth/login
  - /api/user/auth/register
  - /api/user/auth/refresh
  - /api/user/restaurants/**
  - /api/user/categories/**
  - /api/user/facilities/**
- 나머지: authenticated()

// Order 3: Public Filter Chain
@Bean
@Order(3)
public SecurityFilterChain publicFilterChain(HttpSecurity http)
- securityMatcher: "/ws/**", "/uploads/**", "/actuator/**"
- 모두 permitAll (WebSocket, 정적 파일 등)
```

### 2. 컨트롤러 경로 변경

#### 인증 관련
| 기존 경로 | 새 경로 | 용도 |
|----------|---------|------|
| `/api/user/login` | `/api/user/auth/login` | 유저 로그인 |
| `/api/user/register` | `/api/user/auth/register` | 유저 회원가입 |
| `/api/user/refresh` | `/api/user/auth/refresh` | JWT 토큰 갱신 |
| `/api/user/logout` | `/api/user/auth/logout` | 유저 로그아웃 |
| `/api/user/me` | `/api/user/auth/me` | 유저 정보 조회 |
| `/api/user/update` | `/api/user/profile/update` | 유저 프로필 수정 |
| `/admin/api/login` | `/api/admin/auth/login` | 관리자 로그인 |
| `/admin/api/logout` | `/api/admin/auth/logout` | 관리자 로그아웃 |
| `/admin/api/me` | `/api/admin/auth/me` | 관리자 정보 조회 |

#### 레스토랑 관련
| 기존 경로 | 새 경로 (유저) | 새 경로 (관리자) |
|----------|---------------|-----------------|
| `GET /api` | `GET /api/user/restaurants` | `GET /api/admin/restaurants` |
| `GET /api/{id}` | `GET /api/user/restaurants/{id}` | `GET /api/admin/restaurants/{id}` |
| `GET /api/user/search` | `GET /api/user/restaurants/search` | N/A |
| `GET /api/{id}/detail` | `GET /api/user/restaurants/{id}/detail` | N/A |
| `GET /api/{id}/location` | `GET /api/user/restaurants/{id}/location` | N/A |
| `POST /api` | N/A | `POST /api/admin/restaurants` |
| `PUT /api/{id}` | N/A | `PUT /api/admin/restaurants/{id}` |
| `DELETE /api/{id}` | N/A | `DELETE /api/admin/restaurants/{id}` |

#### 메뉴 관련
| 기존 경로 | 새 경로 (유저) | 새 경로 (관리자) |
|----------|---------------|-----------------|
| `GET /api/restaurants/{id}/menus` | `GET /api/user/restaurants/{id}/menus` | `GET /api/admin/restaurants/{id}/menus` |
| `POST /api/restaurants/{id}/menus` | N/A | `POST /api/admin/restaurants/{id}/menus` |
| `PUT /api/restaurants/{id}/menus/{menuId}` | N/A | `PUT /api/admin/restaurants/{id}/menus/{menuId}` |
| `DELETE /api/restaurants/{id}/menus/{menuId}` | N/A | `DELETE /api/admin/restaurants/{id}/menus/{menuId}` |

#### 이미지 관련
| 기존 경로 | 새 경로 (유저) | 새 경로 (관리자) |
|----------|---------------|-----------------|
| `GET /api/images/{id}` | `GET /api/user/restaurants/{id}/images` | `GET /api/admin/restaurants/{id}/images` |
| `POST /api/images/{id}` | N/A | `POST /api/admin/restaurants/{id}/images` |
| `PUT /api/images/main/{imageId}` | N/A | `PUT /api/admin/restaurants/{id}/images/{imageId}/main` |
| `DELETE /api/images/{imageId}` | N/A | `DELETE /api/admin/restaurants/{id}/images/{imageId}` |

#### 카테고리 & 편의시설
| 기존 경로 | 새 경로 |
|----------|---------|
| `GET /api/restaurantcategories` | `GET /api/user/categories` |
| `GET /api/restaurantcategories/{id}` | `GET /api/user/categories/{id}/restaurants` |
| `GET /api/facilities` | `GET /api/user/facilities` |
| `GET /api/facilities/{id}` | `GET /api/user/restaurants/{id}/facilities` (유저)<br>`GET /api/admin/restaurants/{id}/facilities` (관리자) |
| `POST /api/facilities/{id}` | N/A<br>`POST /api/admin/restaurants/{id}/facilities` (관리자) |
| `DELETE /api/facilities/{id}/{facilityId}` | N/A<br>`DELETE /api/admin/restaurants/{id}/facilities/{facilityId}` (관리자) |

#### 리뷰
| 기존 경로 | 새 경로 |
|----------|---------|
| `GET /api/restaurants/{id}/reviews` | `GET /api/user/restaurants/{id}/reviews` |

#### 운영시간
| 기존 경로 | 새 경로 (유저) | 새 경로 (관리자) |
|----------|---------------|-----------------|
| `GET /api/hours/opening/{id}` | `GET /api/user/restaurants/{id}/hours/opening` | `GET /api/admin/restaurants/{id}/hours/opening` |
| `POST /api/hours/opening/{id}` | N/A | `POST /api/admin/restaurants/{id}/hours/opening` |
| `GET /api/hours/opening/effective/{id}` | `GET /api/user/restaurants/{id}/hours/effective` | `GET /api/admin/restaurants/{id}/hours/effective` |
| `GET /api/hours/special/{id}` | `GET /api/user/restaurants/{id}/hours/special` | `GET /api/admin/restaurants/{id}/hours/special` |
| `POST /api/hours/special/{id}` | N/A | `POST /api/admin/restaurants/{id}/hours/special` |

#### 테이블
| 기존 경로 | 새 경로 (유저) | 새 경로 (관리자) |
|----------|---------------|-----------------|
| `GET /api/tables/{id}` | `GET /api/user/restaurants/{id}/tables` | `GET /api/admin/restaurants/{id}/tables` |

#### 예약
| 기존 경로 | 새 경로 (유저) | 새 경로 (관리자) |
|----------|---------------|-----------------|
| `GET /api/realtime/reservations` | N/A | `GET /api/admin/reservations` |
| `GET /api/realtime/reservations/restaurants/{id}` | N/A | `GET /api/admin/restaurants/{id}/reservations` |
| `GET /api/realtime/my-reservations` | `GET /api/user/reservations/my` | N/A |
| `GET /api/realtime/restaurants/{id}/available-timeslots` | `GET /api/user/restaurants/{id}/timeslots` | N/A |
| `POST /api/realtime/reservation` | `POST /api/user/reservations` | N/A |

#### 북마크
| 기존 경로 | 새 경로 |
|----------|---------|
| `GET /api/bookmarks/users/{userId}` | `GET /api/user/bookmarks` |

#### 웨이팅
| 기존 경로 | 새 경로 (유저) | 새 경로 (관리자) |
|----------|---------------|-----------------|
| `GET /api/waitings/status` | `GET /api/user/waiting/status` | N/A |
| `GET /api/waitings/{id}` | N/A | `GET /api/admin/restaurants/{id}/waiting` |
| `PUT /api/waitings/{id}/cancel` | `PUT /api/user/waiting/{id}/cancel` | N/A |
| `PUT /api/waitings/{id}/called` | N/A | `PUT /api/admin/waiting/{id}/called` |
| `PUT /api/waitings/{id}/seated` | N/A | `PUT /api/admin/waiting/{id}/seated` |
| `GET /api/waitings/teams-ahead` | `GET /api/user/waiting/teams-ahead` | N/A |
| `GET /api/waitings/user/{userId}` | `GET /api/user/waiting/history` | N/A |

#### WebSocket 엔드포인트 (변경 없음)
- `/app/reservation/{restaurantId}/connect` - 테이블 예약 접속
- `/app/restaurant/{restaurantId}/tables/status` - 테이블 상태 조회
- `/app/restaurant/{restaurantId}/tables/{tableId}/select` - 테이블 선택
- `/app/waiting/open` - 웨이팅 오픈
- `/app/waiting/close` - 웨이팅 종료
- `/app/waiting/regist` - 웨이팅 등록

---

## 프론트엔드 마이그레이션 필요 사항

### 1. 유저 프론트엔드 (`frontend/user/src`)

#### 업데이트 필요 파일:
1. **`pages/utils/UserApi.jsx`**
   - `/api/user/me` → `/api/user/auth/me`
   - `/api/user/update` → `/api/user/profile/update`
   - `/api/user/login` → `/api/user/auth/login`
   - `/api/user/register` → `/api/user/auth/register`

2. **`pages/utils/RestaurantApi.jsx`**
   - `/api/user/{id}` → `/api/user/restaurants`
   - `/api/{id}` → `/api/user/restaurants/{id}`
   - `/api/user/search` → `/api/user/restaurants/search`
   - `/api/{id}/detail` → `/api/user/restaurants/{id}/detail`
   - `/api/{id}/location` → `/api/user/restaurants/{id}/location`

3. **`pages/utils/RestaurantMenuApi.jsx`**
   - `/api/restaurants/{id}/menus` → `/api/user/restaurants/{id}/menus`

4. **`pages/utils/RestaurantReviewApi.jsx`**
   - `/api/restaurants/{id}/reviews` → `/api/user/restaurants/{id}/reviews`

5. **`pages/utils/RestaurantCategory.jsx`**
   - `/api/restaurantcategories` → `/api/user/categories`
   - `/api/restaurantcategories/{id}` → `/api/user/categories/{id}/restaurants`

6. **`pages/utils/FacilitiesApi.jsx`**
   - `/api/facilities/{id}` → `/api/user/restaurants/{id}/facilities`

7. **`pages/utils/OpeningHourApi.jsx`**
   - `/api/hours/opening/{id}` → `/api/user/restaurants/{id}/hours/opening`
   - `/api/hours/opening/effective/{id}` → `/api/user/restaurants/{id}/hours/effective`
   - `/api/realtime/restaurants/{id}/available-timeslots` → `/api/user/restaurants/{id}/timeslots`

8. **`pages/utils/WaitingApi.jsx`**
   - `/api/waitings/status` → `/api/user/waiting/status`
   - `/api/waitings/{id}/cancel` → `/api/user/waiting/{id}/cancel`
   - `/api/waitings/user/{userId}` → `/api/user/waiting/history`

9. **`pages/reservationpage/SelectTable.jsx`**
   - `/api/tables/{id}` → `/api/user/restaurants/{id}/tables`

10. **`pages/reservationpage/ConfirmInfo.jsx`**
    - `/api/realtime/reservation` → `/api/user/reservations`

### 2. 관리자 프론트엔드 (`frontend/admin/src`)

#### 업데이트 필요 파일:
1. **`pages/loginpage/Login.jsx`**
   - `/admin/api/login` → `/api/admin/auth/login`

2. **`api/RestaurantApi.jsx`**
   - `/admin/api/restaurants` → `/api/admin/restaurants`

3. **`api/MenuApi.jsx`**
   - `/api/restaurants/{id}/menus` → `/api/admin/restaurants/{id}/menus`

4. **`utils/WaitingApi.jsx`**
   - `/api/waitings/{id}/cancel` → `/api/admin/waiting/{id}/cancel` (관리자용)
   - `/api/waitings/{id}/called` → `/api/admin/waiting/{id}/called`
   - `/api/waitings/{id}/seated` → `/api/admin/waiting/{id}/seated`
   - `/api/waitings/{id}` → `/api/admin/restaurants/{id}/waiting`

5. **`components/tabs/SpecialHoursTab.jsx`**
   - `/api/hours/special/{id}` → `/api/admin/restaurants/{id}/hours/special`

6. **`components/tabs/ImagesTab.jsx`**
   - `/api/images/{id}` → `/api/admin/restaurants/{id}/images`

7. **`components/tabs/FacilitiesTab.jsx`**
   - `/api/facilities` → `/api/user/facilities` (마스터 데이터는 유저 경로 사용)
   - `/api/facilities/{id}` → `/api/admin/restaurants/{id}/facilities`

8. **`components/tabs/OperatingHoursTab.jsx`**
   - `/api/hours/opening/{id}` → `/api/admin/restaurants/{id}/hours/opening`

---

## 테스트 체크리스트

### 백엔드
- [ ] 유저 로그인/회원가입 (JWT)
- [ ] 관리자 로그인/로그아웃 (세션)
- [ ] 레스토랑 조회 (유저/관리자)
- [ ] 레스토랑 등록/수정/삭제 (관리자)
- [ ] 메뉴 조회 (유저/관리자)
- [ ] 메뉴 등록/수정/삭제 (관리자)
- [ ] 이미지 조회 (유저/관리자)
- [ ] 이미지 업로드/삭제 (관리자)
- [ ] 예약 생성 (유저)
- [ ] 예약 조회 (유저/관리자)
- [ ] 웨이팅 등록 (유저)
- [ ] 웨이팅 관리 (관리자)
- [ ] WebSocket 연결 (유저/관리자)

### 프론트엔드
- [ ] 모든 API 호출 경로 업데이트 확인
- [ ] JWT 토큰 전송 확인 (유저)
- [ ] 세션 쿠키 전송 확인 (관리자)
- [ ] CORS 설정 확인

---

## 주의사항

1. **WebSocket 엔드포인트는 변경하지 않았습니다**
   - `/app/*` 메시지 매핑은 그대로 유지
   - `/ws` 연결 엔드포인트도 그대로 유지

2. **기존 컨트롤러 파일 정리 필요**
   - 다음 파일들은 새로운 User/Admin 컨트롤러로 대체되었으므로 삭제 또는 비활성화 필요:
     - `RestaurantController.java` (원본)
     - `RestaurantMenuController.java` (원본)
     - `RestaurantImageController.java` (원본)
     - `RestaurantFacilityController.java` (원본)
     - `RestaurantOpeningHourController.java` (원본)
     - `RestaurantSpecialHourController.java` (원본)
     - `RestaurantTableController.java` (원본)

3. **SecurityConfig 주의사항**
   - `/api/user/**` 경로는 JWT 필터만 적용됨
   - `/api/admin/**` 경로는 세션 인증만 적용됨
   - 두 경로가 섞이면 인증 실패할 수 있음

4. **마이그레이션 순서**
   1. 백엔드 서버 재시작
   2. 프론트엔드 API 호출 경로 업데이트
   3. 테스트 진행
   4. 문제 발생 시 로그 확인

---

## 롤백 방법

만약 문제가 발생하면:
1. 이 브랜치를 이전 커밋으로 되돌리기
2. 또는 기존 컨트롤러 파일들의 주석을 해제하고 새 컨트롤러들을 주석 처리

---

## 문의
문제가 발생하거나 질문이 있으면 개발팀에 문의하세요.
