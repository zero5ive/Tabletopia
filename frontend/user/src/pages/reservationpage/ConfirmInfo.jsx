import React, { useState, useEffect, useRef } from 'react'; // ✅ useRef import
import { useNavigate } from 'react-router-dom';
import { updateUser, getCurrentUser, createReservation, processPayment } from '../utils/UserApi';
import styles from './ConfirmInfo.module.css';

const ReservationConfirm = () => {
  const navigate = useNavigate();
  const isNavigatingRef = useRef(false);
  const hasCleanedUpRef = useRef(false);

  const [reservationData, setReservationData] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phoneNumber: '',
    email: ''
  });

  const [agreements, setAgreements] = useState({
    personalInfo: false,
    thirdParty: false,
    cancellationPolicy: false
  });

  // 결제 처리 상태
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [reservationResult, setReservationResult] = useState(null);

  // 선점 만료 타이머 상태
  const [remainingTime, setRemainingTime] = useState(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    // 결제 완료 메시지 리스너
    const handlePaymentMessage = (event) => {
      // 보안: origin 확인
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.data.type === 'PAYMENT_SUCCESS') {
        console.log('결제 완료 메시지 수신:', event.data);
        setPaymentCompleted(true);
        setReservationResult(event.data.data);

        // 예약 선점 정보 제거
        sessionStorage.removeItem('activeTableSelection');
        hasCleanedUpRef.current = true;
      }
    };

    window.addEventListener('message', handlePaymentMessage);

    return () => {
      window.removeEventListener('message', handlePaymentMessage);
    };
  }, []);

  useEffect(() => {
    // 앞선 예약 정보 불러오기
    const data = localStorage.getItem('finalReservationData');
    console.log('불러온 예약 정보:', data);

    if (!data) {
      alert('예약 정보가 없습니다. 이전 단계로 돌아갑니다.');
      navigate('/reservations/table');
      return;
    }

    // ✅ 예약 데이터 설정
    const parsedData = JSON.parse(data);
    setReservationData(parsedData);
    console.log('예약 데이터 설정 완료:', parsedData);

    // 선점 만료 시간 확인
    const activeSelection = sessionStorage.getItem('activeTableSelection');
    if (activeSelection) {
      try {
        const selection = JSON.parse(activeSelection);
        if (selection.expiryTime) {
          const expiryTime = new Date(selection.expiryTime).getTime();
          const now = Date.now();
          const timeLeft = Math.max(0, expiryTime - now);

          if (timeLeft > 0) {
            setRemainingTime(Math.floor(timeLeft / 1000)); // 초 단위
          } else {
            setIsExpired(true);
          }
        }
      } catch (error) {
        console.error('선점 정보 파싱 오류:', error);
      }
    }

    // 사용자 정보 불러오기
    const fetchUserInfo = async () => {
      try {
        const response = await getCurrentUser();
        const userData = response.data;
        setCustomerInfo({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          phoneNumber: userData.phoneNumber
        });
      } catch (error) {
        console.error('유저 정보 조회 실패:', error);
        alert('유저 정보를 불러오지 못했습니다.');
      }
    };
    fetchUserInfo();
  }, []);

  // 타이머 카운트다운
  useEffect(() => {
    if (remainingTime === null || remainingTime <= 0 || paymentCompleted) {
      return;
    }

    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          setIsExpired(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingTime, paymentCompleted]);

  // 만료 시 처리
  useEffect(() => {
    if (isExpired && !paymentCompleted) {
      alert('선점 시간이 만료되었습니다. 테이블을 다시 선택해주세요.');
      sessionStorage.removeItem('activeTableSelection');
      window.close();
    }
  }, [isExpired, paymentCompleted]);

  /**
   * 페이지 이탈/종료 시 선점 해제
   * @author 김예진
   * @since 2025-10-08
   */
  useEffect(() => {
    const sendCancelRequest = () => {
      if (hasCleanedUpRef.current) return;

      const selection = sessionStorage.getItem('activeTableSelection');
      if (!selection) return;

      try {
        const data = JSON.parse(selection);

        if (!data.isConfirmed) {
          sessionStorage.removeItem('activeTableSelection');
          console.log('로컬 선택만 있어서 취소 요청 생략');
          return;
        }

        const success = navigator.sendBeacon(
          'http://localhost:10022/api/realtime/table/cancel',
          new Blob([JSON.stringify({
            restaurantId: data.restaurantId,
            tableId: data.tableId,
            date: data.date,
            time: data.time
          })], { type: 'application/json' })
        );

        if (success) {
          console.log('테이블 선점 취소 요청 전송 성공 (ConfirmInfo)');
          sessionStorage.removeItem('activeTableSelection');
          hasCleanedUpRef.current = true;
        }
      } catch (error) {
        console.error('테이블 선점 취소 요청 실패:', error);
      }
    };

    const handleBeforeUnload = (e) => {
      if (!isNavigatingRef.current) {
        sendCancelRequest();
      }
    };

    const handlePageHide = (e) => {
      if (!isNavigatingRef.current && !e.persisted) {
        sendCancelRequest();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handlePageHide);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handlePageHide);

      if (!isNavigatingRef.current) {
        sendCancelRequest();
      }
    };
  }, []); // ✅ useEffect를 컴포넌트 최상위로 이동

  /**
   * 고객 정보 입력 핸들러
   */
  const handleCustomerInfoChange = (field, value) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * 약관 동의 체크박스 핸들러
   */
  const handleAgreementChange = (agreementType) => {
    setAgreements(prev => ({
      ...prev,
      [agreementType]: !prev[agreementType]
    }));
  };

  /**
   * 이전 단계로 돌아가기
   */
  const handleGoBack = () => {
    isNavigatingRef.current = true; // ✅ 정상 이동
    navigate('/reservations/table');
  };

  /**
   * 결제 진행 (유효성 검사 후 바로 토스 팝업 열기)
   * @author 김예진
   * @since 2025-10-19
   */
  const handlePayment = async () => {
    // 필수 정보 입력 확인
    if (!customerInfo.name.trim()) {
      alert('이름을 입력해주세요.');
      return;
    }

    if (!customerInfo.phoneNumber || !customerInfo.phoneNumber.trim()) {
      alert('휴대폰 번호를 입력해주세요.');
      return;
    }

    // 휴대폰 번호 유효성 검사
    const phoneRegex = /^01[016789]-?\d{3,4}-?\d{4}$/;
    if (!phoneRegex.test(customerInfo.phoneNumber.replace(/-/g, ''))) {
      alert('올바른 휴대폰 번호를 입력해주세요. (예: 010-1234-5678)');
      return;
    }

    // 모든 약관 동의 확인
    if (!agreements.personalInfo) {
      alert('개인정보 수집 및 이용에 동의해주세요.');
      return;
    }

    if (!agreements.thirdParty) {
      alert('개인정보 제3자 제공에 동의해주세요.');
      return;
    }

    if (!agreements.cancellationPolicy) {
      alert('취소 기한 및 취소 수수료에 동의해주세요.');
      return;
    }

    // 최종 예약 데이터에 고객 정보 추가
    const finalData = {
      ...reservationData,
      customerInfo: customerInfo,
      agreements: agreements
    };

    // localStorage에 저장 (결제 처리에 사용)
    localStorage.setItem('finalReservationData', JSON.stringify(finalData));

    // 결제 처리 시작
    setIsPaymentLoading(true);

    try {
      // payment 컨트롤러에 요청보낼 paymentInfo 생성
      const paymentRequestDTO = {
        productDesc: finalData.restaurantName,
        amount: finalData.price,
        amountTaxFree: finalData.price
      };

      const paymentRequest = {
        paymentRequestDTO: paymentRequestDTO,
        reservationRequest: finalData
      };

      const response = await processPayment(paymentRequest);
      console.log("결제 응답:", response);

      // 응답 데이터에 checkoutPage가 있는지 확인
      if (response && response.data.checkoutPage) {
        const checkoutUrl = response.data.checkoutPage;

        // 팝업 창 설정 (중앙에 위치, 적절한 크기)
        const popupWidth = 500;
        const popupHeight = 700;
        const left = (window.screen.width - popupWidth) / 2;
        const top = (window.screen.height - popupHeight) / 2;

        const popupFeatures = `width=${popupWidth},height=${popupHeight},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`;

        // 토스 결제 페이지를 새 팝업 창으로 열기
        const paymentPopup = window.open(checkoutUrl, 'TossPayment', popupFeatures);

        if (!paymentPopup) {
          throw new Error('팝업 차단이 감지되었습니다. 팝업 차단을 해제해주세요.');
        }

        // 팝업 창 모니터링 (결제 완료/취소 감지)
        const popupInterval = setInterval(() => {
          if (paymentPopup.closed) {
            clearInterval(popupInterval);
            console.log('결제 팝업이 닫혔습니다.');

            // 결제 완료 여부 확인 (향후 구현)
            // TODO: 결제 결과 확인 로직 추가
          }
        }, 500);

        console.log('결제 팝업 창 열림:', checkoutUrl);
      } else {
        throw new Error('결제 페이지 진입에 실패했습니다.');
      }
    } catch (err) {
      console.error('결제 처리 오류:', err);
      alert(err.message || '결제 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsPaymentLoading(false);
    }
  };

  if (!reservationData) {
    return <div>예약 정보를 불러오는 중...</div>;
  }

  const price = reservationData.price || 0;

  // 결제 완료 화면
  if (paymentCompleted) {
    return (
      <div className={styles.container}>
        <div className={styles.successContainer}>
          <div className={styles.successIcon}>✓</div>
          <h1 className={styles.successTitle}>예약이 완료되었습니다!</h1>
          <p className={styles.successMessage}>
            TableTopia 예약 서비스를 이용해 주셔서 감사합니다.
          </p>

          <div className={styles.reservationSummary}>
            <h2 className={styles.summaryTitle}>예약 정보</h2>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>레스토랑</span>
              <span className={styles.summaryValue}>{reservationData.restaurantName}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>주소</span>
              <span className={styles.summaryValue}>{reservationData.restaurantAddress}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>예약 일시</span>
              <span className={styles.summaryValue}>
                {reservationData.date} {reservationData.time}
              </span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>인원</span>
              <span className={styles.summaryValue}>{reservationData.peopleCount}명</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>테이블</span>
              <span className={styles.summaryValue}>{reservationData.restaurantTableNameSnapshot}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>예약자</span>
              <span className={styles.summaryValue}>{customerInfo.name}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>연락처</span>
              <span className={styles.summaryValue}>{customerInfo.phoneNumber}</span>
            </div>
            {reservationResult && (
              <>
                <div className={styles.summaryDivider}></div>
                {/* <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>예약 번호</span>
                  <span className={styles.summaryValue}>#{reservationResult.reservationId}</span>
                </div> */}
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>결제 금액</span>
                  <span className={styles.summaryValueHighlight}>{price.toLocaleString()}원</span>
                </div>
              </>
            )}
          </div>

          {/* <div className={styles.successActions}> */}
            {/* <button
              className={`${styles.actionBtn} ${styles.primaryBtn}`}
              onClick={() => navigate('/mypage/reservation')}
            >
              예약 내역 보기
            </button>
            <button
              className={`${styles.actionBtn} ${styles.secondaryBtn}`}
              onClick={() => navigate('/')}
            >
              메인으로 돌아가기
            </button>
          </div> */}
        </div>
      </div>
    );
  }

  // 시간 포맷 함수 (분:초)
  const formatTime = (seconds) => {
    if (seconds === null) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.container}>
      {/* 선점 만료 타이머 */}
      {remainingTime !== null && remainingTime > 0 && !paymentCompleted && (
        <div className={`${styles.countdownTimer} ${
          remainingTime <= 30 ? styles.timerCritical :
          remainingTime <= 60 ? styles.timerWarning :
          styles.timerNormal
        }`}>
          <span className={styles.timerIcon}>⏱️</span>
          <div className={styles.timerContent}>
            <div className={styles.timerLabel}>선점 만료까지</div>
            <div className={styles.timerValue}>{formatTime(remainingTime)}</div>
          </div>
        </div>
      )}

      {/* 진행 단계 바 */}
      <div className={styles.progressBar}>
        <div className={styles.progressStep}>
          <div className={`${styles.stepNumber} ${styles.stepNumberActive}`}>1</div>
          <div className={`${styles.stepText} ${styles.stepTextActive}`}>날짜/시간선택</div>
        </div>

        <div className={styles.progressStep}>
          <div className={`${styles.stepNumber} ${styles.stepNumberActive}`}>2</div>
          <div className={`${styles.stepText} ${styles.stepTextActive}`}>테이블선택</div>
        </div>

        <div className={styles.progressStep}>
          <div className={`${styles.stepNumber} ${styles.stepNumberCurrent}`}>3</div>
          <div className={`${styles.stepText} ${styles.stepTextCurrent}`}>예약정보확인</div>
        </div>

        <div className={styles.progressStep}>
          <div className={`${styles.stepNumber} ${styles.stepNumberUpcoming}`}>4</div>
          <div className={`${styles.stepText} ${styles.stepTextUpcoming}`}>결제</div>
        </div>
      </div>

      <div className={styles.containerContent}>
        <div className={styles.mainContent}>
          <div>
            {/* 예약자 정보 */}
            <div className={styles.customerInfoSection}>
              <div className={styles.sectionTitle}>예약자 정보</div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  이름 <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.inputField}
                  value={customerInfo.name}
                  onChange={(e) => handleCustomerInfoChange('name', e.target.value)}
                  placeholder="이름을 입력해주세요"
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  휴대폰 번호 <span className={styles.required}>*</span>
                </label>
                <input
                  type="tel"
                  className={styles.inputField}
                  value={customerInfo.phoneNumber || ''}
                  onChange={(e) => handleCustomerInfoChange('phoneNumber', e.target.value)}
                  placeholder="010-1234-5678"
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>이메일</label>
                <input
                  type="email"
                  className={styles.inputField}
                  value={customerInfo.email}
                  onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
                  placeholder="example@email.com"
                />
              </div>
            </div>

            {/* 약관 동의 */}
            <div className={styles.agreementSection}>
              <div className={styles.sectionTitle}>약관 동의</div>

              <div className={styles.agreementItem}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={agreements.personalInfo}
                    onChange={() => handleAgreementChange('personalInfo')}
                  />
                  <span className={styles.checkboxText}>
                    예약자 확인 및 예약 처리를 위해 휴대폰번호, 이메일을 수집하며, 이용목적 달성 이후 파기합니다. <span className={styles.required}>*</span>
                  </span>
                </label>
              </div>

              <div className={styles.agreementItem}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={agreements.thirdParty}
                    onChange={() => handleAgreementChange('thirdParty')}
                  />
                  <span className={styles.checkboxText}>
                    개인정보 제3자 제공에 동의합니다. (고객응대 및 예약 정보 안내 등을 위함)
                    <span className={styles.required}>*</span>
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* 예약 요약 사이드바 */}
          <div className={styles.bookingSummary}>
            <div className={styles.restaurantName}>{reservationData.restaurantName}</div>
            <div className={styles.bookingInfo}>
              {reservationData.restaurantAddress}<br />
              {reservationData.date} {reservationData.time} • {reservationData.peopleCount}명
            </div>

            <div className={styles.summaryTitle}>예약 정보</div>
            <div className={styles.summaryItem}>
              <span>날짜</span>
              <span>{reservationData.date}</span>
            </div>
            <div className={styles.summaryItem}>
              <span>시간</span>
              <span>{reservationData.time}</span>
            </div>
            <div className={styles.summaryItem}>
              <span>인원</span>
              <span>{reservationData.peopleCount}명</span>
            </div>
            <div className={styles.summaryItem}>
              <span>테이블</span>
              <span>{reservationData.restaurantTableNameSnapshot}</span>
            </div>
            <div className={`${styles.summaryItem} ${styles.summaryItemTotal}`}>
              <span>예약금</span>
              <span>{price.toLocaleString()}원</span>
            </div>

            {/* 취소 정책 */}
            <div className={styles.cancellationPolicy}>
              <div className={styles.policyTitle}>취소 정책</div>
              <div className={styles.policyItem}>
                변경 가능: 예약 시간 2시간 전까지
              </div>
              <div className={styles.policyItem}>
                예약금 취소 수수료:
              </div>
              <div className={styles.policyDetail}>
                • 당일: 100%  • 1일전: 50% • 2일전: 무료
              </div>

              <div className={styles.agreementItem}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={agreements.cancellationPolicy}
                    onChange={() => handleAgreementChange('cancellationPolicy')}
                  />
                  <span className={styles.checkboxText}>
                    취소 정책에 동의합니다. <span className={styles.required}>*</span>
                  </span>
                </label>
              </div>
            </div>

            {/* 버튼 그룹 */}
            <div className={styles.buttonGroup}>
              <button
                className={`${styles.actionBtn} ${styles.backBtn}`}
                onClick={handleGoBack}
              >
                이전단계
              </button>
              <button
                className={`${styles.actionBtn} ${styles.paymentBtn}`}
                onClick={handlePayment}
                disabled={isPaymentLoading}
              >
                {isPaymentLoading ? '결제 진행 중...' : '결제하기'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationConfirm;