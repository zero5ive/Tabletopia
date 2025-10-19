# 결제 및 예약 시스템 개선 내역

## 📅 작업 날짜
2025-10-19

## 🎯 주요 개선 사항 요약

### 1. 순환 참조 문제 해결
- **문제**: `TableSelectionService` ↔ `ReservationService` 간 순환 참조로 인한 빌드 실패
- **해결**: `ReservationFacadeService` 추가하여 순환 참조 제거

### 2. 결제 흐름 개선
- **기존 문제**: 결제 전에 예약 등록 시도 → `payment_id` NULL 에러
- **개선**: 결제 완료 후 예약 등록하도록 흐름 수정

### 3. UI/UX 개선
- **불필요한 모달 제거**: 결제하기 버튼 → 바로 토스 팝업
- **결제 완료 시**: 팝업 자동 닫기 + 예약 정보 표시

### 4. 중복 결제 방지
- **프론트엔드**: useRef로 중복 실행 방지
- **백엔드**: 원자적 연산으로 중복 저장 방지

---

## 📁 변경된 파일 목록

### 백엔드 (Java/Spring Boot)

#### 1. **결제 관련**
- `PaymentController.java` - 결제 페이지 요청 및 결제 확인 로직
- `PaymentService.java` - checkoutPage URL 추출 기능 추가

#### 2. **예약 관련**
- `ReservationFacadeService.java` - **[NEW]** 순환 참조 해결용 파사드 서비스
- `ReservationService.java` - Payment 포함 예약 등록 메서드 추가
- `TableSelectionService.java` - ReservationService 의존성 제거
- `Reservation.java` - `setPayment()` 메서드 추가

#### 3. **컨트롤러**
- `TableSelectionController.java` - ReservationFacadeService 사용

### 프론트엔드 (React)

#### 1. **결제/예약 페이지**
- `ConfirmInfo.jsx` - 결제 모달 제거, 팝업 통신, 예약 완료 화면 추가
- `ConfirmInfo.module.css` - 예약 완료 화면 스타일 추가
- `PaymentSuccess.jsx` - 중복 방지, 부모 창 통신, 자동 닫기

#### 2. **불필요 파일**
- `Payment.jsx` - 더 이상 사용 안 함 (모달로 대체되었다가 제거됨)

---

## 🔧 주요 변경 내용 상세

### A. 순환 참조 해결

#### 파일: `ReservationFacadeService.java` (신규 생성)
```java
@Service
@RequiredArgsConstructor
public class ReservationFacadeService {
    private final ReservationService reservationService;

    // 일반 예약 등록
    public Map<String, Object> registerReservation(...)

    // 결제 완료 후 예약 등록
    public Map<String, Object> registerReservationWithPayment(...)
}
```

**목적**: `TableSelectionService`와 `ReservationService` 간 순환 참조 제거

#### 파일: `TableSelectionService.java`
**변경 전**:
```java
private final ReservationService reservationService; // ❌ 순환 참조
```

**변경 후**:
```java
// ReservationService 의존성 제거 ✅
```

---

### B. 결제 흐름 개선

#### 파일: `PaymentController.java`

**핵심 변경 1: 임시 저장소 추가**
```java
// 예약 정보를 orderNo로 임시 저장 (결제 완료 전)
private static final Map<String, ReservationPaymentRequestDTO> pendingPayments = new ConcurrentHashMap<>();
```

**핵심 변경 2: POST /api/user/payment (결제 페이지 요청)**
```java
@PostMapping
public ResponseEntity<Map<String, Object>> pay(...) {
    // 1. orderNo 생성
    // 2. 예약 정보 임시 저장 (pendingPayments)
    // 3. 토스에 결제 페이지 요청
    // 4. checkoutPage URL만 반환 (예약 등록 안 함!)
}
```

**핵심 변경 3: POST /api/user/payment/confirm (결제 완료 확인)**
```java
@Transactional
@PostMapping("/confirm")
public ResponseEntity<Map<String, Object>> paymentConfirm(...) {
    // 1. 결제 상태 확인 (PAY_COMPLETE)
    // 2. 임시 저장소에서 예약 정보 조회 및 제거 (원자적 연산 - 중복 방지)
    // 3. Payment 저장
    // 4. Reservation 저장 (payment_id 포함)
    // 5. 성공 응답
}
```

#### 파일: `ReservationService.java`

**핵심 변경: createReservationWithPayment() 메서드 추가**
```java
@Transactional
public Long createReservationWithPayment(
    ReservationRequest request,
    Payment payment,  // ✅ Payment 객체 받음
    String authenticatedEmail
) {
    // 1. 선점 정보 검증
    // 2. Reservation 엔티티 생성
    // 3. reservation.setPayment(payment) 설정
    // 4. DB 저장
    // 5. Redis 상태 업데이트
    // 6. 웹소켓 브로드캐스트
}
```

#### 파일: `Reservation.java`

**핵심 변경: setPayment() 메서드 추가**
```java
/**
 * Payment 설정
 * @param payment 결제 정보
 */
public void setPayment(Payment payment) {
    this.payment = payment;
}
```

---

### C. UI/UX 개선

#### 파일: `ConfirmInfo.jsx`

**변경 1: 결제 모달 제거**
```javascript
// ❌ 삭제된 state
const [showPaymentModal, setShowPaymentModal] = useState(false);
const [paymentError, setPaymentError] = useState(null);

// ✅ 남은 state
const [isPaymentLoading, setIsPaymentLoading] = useState(false);
```

**변경 2: handlePayment 함수 통합**
```javascript
// 기존: handlePayment (모달 열기) + handleProcessPayment (결제)
// 변경: handlePayment 하나로 통합

const handlePayment = async () => {
    // 1. 유효성 검사
    // 2. 결제 API 호출
    // 3. 토스 팝업 바로 열기 (모달 없음!)
}
```

**변경 3: 결제 완료 메시지 수신**
```javascript
useEffect(() => {
    const handlePaymentMessage = (event) => {
        if (event.data.type === 'PAYMENT_SUCCESS') {
            setPaymentCompleted(true);
            setReservationResult(event.data.data);
            // 예약 선점 정보 제거
            sessionStorage.removeItem('activeTableSelection');
        }
    };

    window.addEventListener('message', handlePaymentMessage);
    return () => window.removeEventListener('message', handlePaymentMessage);
}, []);
```

**변경 4: 예약 완료 화면 추가**
```javascript
if (paymentCompleted) {
    return (
        <div className={styles.successContainer}>
            <div className={styles.successIcon}>✓</div>
            <h1>예약이 완료되었습니다!</h1>
            {/* 예약 정보 표시 */}
        </div>
    );
}
```

#### 파일: `PaymentSuccess.jsx`

**변경 1: 중복 실행 방지**
```javascript
const hasProcessed = useRef(false);

useEffect(() => {
    const processConfirmation = async () => {
        // 중복 실행 방지
        if (hasProcessed.current) return;
        hasProcessed.current = true;

        // 결제 확인 API 호출
        const response = await confirmPayment({ paymentConfirm });

        if (response.data.success) {
            // 부모 창에 메시지 전송
            window.opener.postMessage({
                type: 'PAYMENT_SUCCESS',
                data: {
                    reservationId: response.data.reservationId,
                    paymentId: response.data.paymentId
                }
            }, window.location.origin);

            // 1초 후 팝업 자동 닫기
            setTimeout(() => window.close(), 1000);
        }
    };

    processConfirmation();
}, []); // 빈 배열 - 한 번만 실행
```

---

### D. 중복 결제 방지

#### 프론트엔드: `PaymentSuccess.jsx`
```javascript
const hasProcessed = useRef(false);

// 1차 실행: hasProcessed = false → 처리 진행 → hasProcessed = true
// 2차 실행: hasProcessed = true → 즉시 리턴 (중복 방지)
```

#### 백엔드: `PaymentController.java`
```java
// 원자적 연산으로 중복 방지
ReservationPaymentRequestDTO paymentRequest = pendingPayments.remove(orderNo);

if (paymentRequest == null) {
    // 이미 처리됨
    return ResponseEntity.ok(Map.of("success", true, "message", "이미 처리된 결제입니다."));
}

// 1차 요청: remove() → 데이터 반환 → DB 저장
// 2차 요청: remove() → null 반환 → "이미 처리됨" 응답
```

---

## 🔄 전체 결제 흐름

### 최종 흐름도

```
[1단계: 결제 페이지 요청]
사용자: "결제하기" 버튼 클릭
    ↓
ConfirmInfo.jsx: 유효성 검사
    ↓
POST /api/user/payment
    ↓
PaymentController:
  - orderNo 생성
  - 예약 정보를 pendingPayments에 임시 저장
  - 토스에 결제 페이지 요청
  - checkoutPage URL 반환
    ↓
ConfirmInfo.jsx: 토스 팝업 열기 (window.open)

---

[2단계: 결제 진행]
사용자: 토스 팝업에서 결제 진행
    ↓
토스: 결제 완료
    ↓
토스: retUrl로 리다이렉트
    → http://localhost:3000/reservations/payment/success?status=PAY_COMPLETE&orderNo=xxx

---

[3단계: 결제 확인 및 예약 등록]
PaymentSuccess.jsx: 로드됨
    ↓
useEffect 실행 (한 번만)
    ↓
POST /api/user/payment/confirm
    ↓
PaymentController:
  - 결제 상태 확인 (PAY_COMPLETE)
  - pendingPayments.remove(orderNo) → 예약 정보 조회 및 제거
  - Payment 저장
  - Reservation 저장 (payment_id 포함)
  - 성공 응답 (reservationId, paymentId 포함)
    ↓
PaymentSuccess.jsx:
  - 부모 창(ConfirmInfo)에 postMessage 전송
  - 1초 후 팝업 자동 닫기

---

[4단계: 예약 완료 화면]
ConfirmInfo.jsx: postMessage 수신
    ↓
paymentCompleted = true
    ↓
예약 완료 화면 렌더링:
  - ✓ 아이콘
  - "예약이 완료되었습니다!"
  - 예약 정보 요약
  - 결제 금액
```

---

## 🗂️ 주요 수정 파일 경로

### 백엔드
```
backend/restaurant-service/src/main/java/com/tabletopia/restaurantservice/
├── domain/
│   ├── payment/
│   │   ├── controller/PaymentController.java          ✏️ 수정
│   │   └── service/PaymentService.java                ✏️ 수정
│   └── reservation/
│       ├── controller/TableSelectionController.java   ✏️ 수정
│       ├── entity/Reservation.java                    ✏️ 수정
│       ├── service/
│       │   ├── ReservationFacadeService.java          ✨ 신규
│       │   ├── ReservationService.java                ✏️ 수정
│       │   └── TableSelectionService.java             ✏️ 수정
```

### 프론트엔드
```
frontend/user/src/pages/reservationpage/
├── ConfirmInfo.jsx           ✏️ 대폭 수정 (모달 제거, 팝업 통신, 예약 완료 화면)
├── ConfirmInfo.module.css    ✏️ 수정 (예약 완료 화면 스타일 추가)
├── PaymentSuccess.jsx         ✏️ 수정 (중복 방지, 부모 통신, 자동 닫기)
└── Payment.jsx                ⚠️ 사용 안 함
```

---

## 🐛 해결된 주요 버그

### 1. 순환 참조 에러
```
The dependencies of some of the beans form a cycle:
tableSelectionService → reservationService → tableSelectionService
```
**해결**: `ReservationFacadeService` 추가

### 2. payment_id NULL 에러
```
Column 'payment_id' cannot be null
```
**해결**: 결제 완료 후 예약 등록하도록 흐름 변경

### 3. 결제 상태 검증 에러
```
IllegalStateException: 결제가 완료되지 않았습니다. 상태: PAY_COMPLETE
```
**해결**: `"pay_done"` → `"PAY_COMPLETE"` 수정

### 4. 중복 결제 문제
**해결**:
- 프론트: useRef + 빈 dependency array
- 백엔드: `pendingPayments.remove()` 원자적 연산

---

## 📊 개선 효과

### Before (개선 전)
```
1. 결제하기 → 모달 열림 → 모달에서 결제하기 → 토스 팝업
   (중복된 결제 정보 표시, 불필요한 클릭)

2. 결제 완료 → 팝업에 "성공" 메시지만 표시
   (사용자가 수동으로 팝업 닫아야 함, 예약 정보 확인 불가)

3. 순환 참조로 인한 빌드 실패

4. payment_id NULL 에러로 예약 저장 실패

5. 중복 결제 발생
```

### After (개선 후)
```
1. 결제하기 → 바로 토스 팝업
   (간결한 UX, 불필요한 단계 제거)

2. 결제 완료 → 팝업 자동 닫기 → 예약 완료 화면 표시
   (자동화, 예약 정보 상세 표시)

3. 빌드 성공 (순환 참조 해결)

4. 결제 완료 후 예약 정상 저장 (payment_id 포함)

5. 중복 결제 방지 (프론트+백엔드 양측 방어)
```

---

## 💡 향후 개선 사항 (TODO)

### 1. Redis 도입
현재 `ConcurrentHashMap`으로 예약 정보 임시 저장 중
→ Redis로 변경하여 서버 재시작 시에도 데이터 유지

```java
// 현재
private static final Map<String, ReservationPaymentRequestDTO> pendingPayments = new ConcurrentHashMap<>();

// TODO: Redis로 변경
@Autowired
private RedisTemplate<String, ReservationPaymentRequestDTO> redisTemplate;
```

### 2. 결제 검증 강화
토스 페이먼츠 결제 검증 API 호출 추가

### 3. 에러 처리 개선
- 결제 실패 시 사용자 피드백 개선
- 타임아웃 처리 추가

### 4. 로깅 강화
- 결제 전 과정 상세 로깅
- 트랜잭션 추적 ID 추가

---

## 📞 문의사항

이 문서에 대한 질문이나 추가 개선사항이 있으면 개발팀에 문의하세요.

**작성자**: Claude Code (AI Assistant)
**최종 수정일**: 2025-10-19
