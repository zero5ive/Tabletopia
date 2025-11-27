# Tabletopia 배포 가이드

## 네이버 클라우드 배포 시 Frontend 설정

### 문제 상황
프론트엔드를 네이버 클라우드에 배포했을 때 "Network Error"가 발생하는 경우, Frontend가 Backend API 서버에 연결하지 못하고 있는 것입니다.

### 해결 방법

#### 1. 환경 변수 파일 설정

Frontend 코드가 환경 변수를 통해 API 주소를 설정하도록 수정되었습니다.

**중요:** 이 프로젝트는 **Vite**를 사용하므로 환경 변수는 `VITE_` 접두사를 사용합니다.

##### User Frontend 설정
`frontend/user/.env.production` 파일을 수정하세요:

```bash
# 네이버 클라우드 Backend 서버 주소 (현재 설정됨)
VITE_API_BASE_URL=http://223.130.138.158:8002
VITE_WS_URL=http://223.130.138.158:8002/ws
VITE_OAUTH_URL=http://223.130.138.158:8002
```

##### Admin Frontend 설정
`frontend/admin/.env.production` 파일을 수정하세요:

```bash
# 네이버 클라우드 Backend 서버 주소 (현재 설정됨)
VITE_API_BASE_URL=http://223.130.138.158:8002
VITE_WS_URL=http://223.130.138.158:8002/ws
```

**참고:** 위 설정은 이미 `http://223.130.138.158:8002`로 구성되어 있습니다.

#### 2. 로컬 개발 환경 설정

로컬 개발 시에는 다음 파일들이 자동으로 사용됩니다:
- `frontend/user/.env`
- `frontend/admin/.env`

이 파일들은 이미 `localhost:8002`로 설정되어 있어 별도 수정이 필요 없습니다.

#### 3. 빌드 및 배포

##### User Frontend 빌드
```bash
cd frontend/user
npm run build
```

##### Admin Frontend 빌드
```bash
cd frontend/admin
npm run build
```

빌드된 파일은 각각의 `build/` 디렉토리에 생성됩니다.

#### 4. 환경 변수 확인

배포 전 환경 변수가 올바르게 설정되었는지 확인하세요:

```bash
# .env.production 파일 내용 확인
cat frontend/user/.env.production
cat frontend/admin/.env.production
```

**Vite 환경 변수 참고사항:**
- Vite에서는 `VITE_` 접두사가 있는 환경 변수만 클라이언트 번들에 노출됩니다
- 코드에서 `import.meta.env.VITE_API_BASE_URL` 형식으로 접근합니다
- `process.env`가 아닌 `import.meta.env`를 사용합니다

#### 5. HTTPS 사용 권장

프로덕션 환경에서는 보안을 위해 HTTPS를 사용하는 것을 강력히 권장합니다:
- Backend API 서버: `https://your-backend-url.ncloud.com`
- WebSocket: `wss://your-backend-url.ncloud.com/ws` (자동으로 처리됨)

#### 6. CORS 설정 확인

Backend 서버의 CORS 설정에서 Frontend 도메인을 허용 목록에 추가했는지 확인하세요:

```java
// Backend Spring 설정 예시
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOrigins(
                "https://your-frontend-user-url.ncloud.com",
                "https://your-frontend-admin-url.ncloud.com"
            )
            .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
            .allowCredentials(true);
    }
}
```

### 트러블슈팅

#### Network Error 발생 시
1. 브라우저 개발자 도구(F12) → Network 탭에서 실제 요청 URL 확인
2. Backend 서버가 정상 작동 중인지 확인
3. CORS 설정이 올바른지 확인
4. 환경 변수가 빌드 시 올바르게 적용되었는지 확인

#### 환경 변수가 적용되지 않는 경우
- Vite 앱에서 환경 변수는 **빌드 시**에 적용됩니다
- `.env.production` 파일 수정 후 **반드시 다시 빌드**해야 합니다
- 환경 변수는 `VITE_` 접두사로 시작해야 합니다 (Vite 프로젝트)
- 코드에서 `import.meta.env.VITE_변수명` 형식으로 접근합니다

#### WebSocket 연결 실패
- HTTPS를 사용하는 경우 WebSocket도 WSS(Secure WebSocket)를 사용해야 합니다
- Backend 서버의 WebSocket 설정이 올바른지 확인하세요
- Nginx 등의 리버스 프록시를 사용하는 경우 WebSocket 업그레이드 헤더가 전달되는지 확인하세요

### 주요 변경 사항

다음 파일들이 환경 변수를 사용하도록 수정되었습니다:

#### API 설정 파일
- `frontend/user/src/pages/utils/UserApi.jsx`
- `frontend/user/src/pages/utils/WaitingApi.jsx`
- `frontend/user/src/pages/utils/RestaurantReviewApi.jsx`
- `frontend/user/src/pages/utils/ReservationApi.jsx`
- `frontend/user/src/pages/utils/RestaurantMenuApi.jsx`
- `frontend/user/src/pages/utils/OpeningHourApi.jsx`
- `frontend/user/src/pages/utils/RestaurantCategory.jsx`
- `frontend/user/src/pages/utils/RestaurantApi.jsx`
- `frontend/user/src/pages/utils/FacilitiesApi.jsx`
- `frontend/admin/src/utils/AdminApi.jsx`
- `frontend/admin/src/utils/WaitingApi.jsx`
- `frontend/admin/src/api/RestaurantApi.jsx`
- `frontend/admin/src/utils/ReservationApi.jsx`
- `frontend/admin/src/api/MenuApi.jsx`

#### WebSocket 설정 파일
- `frontend/user/src/hooks/useWebSocket.js`
- `frontend/user/src/contexts/WebSocketContext.jsx`
- `frontend/user/src/pages/restaurant/Waiting.jsx`
- `frontend/user/src/pages/mypage/MyWaiting.jsx`
- `frontend/user/src/components/header/WaitingStatus.jsx`
- `frontend/admin/src/hooks/useWebSocket.js`
- `frontend/admin/src/components/tabs/WaitingTab.jsx`

#### Tab 컴포넌트
- `frontend/admin/src/components/tabs/ImagesTab.jsx`
- `frontend/admin/src/components/tabs/FacilitiesTab.jsx`
- `frontend/admin/src/components/tabs/RegistTableTab.jsx`
- `frontend/admin/src/components/tabs/ReservationTableTab.jsx`

### 요약

1. `.env.production` 파일에서 Backend 서버 주소를 설정
2. `npm run build`로 프로덕션 빌드 생성
3. 생성된 `build/` 폴더를 네이버 클라우드에 배포
4. Backend 서버의 CORS 설정 확인

이제 Frontend가 올바른 Backend API 주소로 요청을 보내게 됩니다.
