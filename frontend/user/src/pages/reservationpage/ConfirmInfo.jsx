import React, { useState, useEffect, useRef } from 'react'; // ✅ useRef import
import styles from './ConfirmInfo.module.css';
import axios from 'axios';

const ReservationConfirm = () => {
  const isNavigatingRef = useRef(false);
  const hasCleanedUpRef = useRef(false);

  const [reservationData, setReservationData] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: '추후추가',
    phone: '010-1111-1111',
    email: '1@example.com'
  });

  const [agreements, setAgreements] = useState({
    personalInfo: false,
    thirdParty: false,
    cancellationPolicy: false
  });

  useEffect(() => {
    const data = localStorage.getItem('finalReservationData');
    console.log(data);
    if (!data) {
      alert('예약 정보가 없습니다. 이전 단계로 돌아갑니다.');
      window.location.href = '/reservations/table';
      return;
    }
    setReservationData(JSON.parse(data));
  }, []);

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
    window.location.href = '/reservations/table';
  };

  /**
   * 결제 진행
   * @author 김예진
   * @since 2025-09-23
   */
  const handlePayment = async () => {
    // 필수 정보 입력 확인
    if (!customerInfo.name.trim()) {
      alert('이름을 입력해주세요.');
      return;
    }

    if (!customerInfo.phone.trim()) {
      alert('휴대폰 번호를 입력해주세요.');
      return;
    }

    // 휴대폰 번호 유효성 검사
    const phoneRegex = /^01[016789]-?\d{3,4}-?\d{4}$/;
    if (!phoneRegex.test(customerInfo.phone.replace(/-/g, ''))) {
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

    try {
      // 예약정보 등록
      const response = await axios.post(
        'http://localhost:10022/api/realtime/reservation',
        finalData
      );

      console.log('예약 등록 성공:', response.data);

      // ✅ 정상 이동 플래그 설정
      // isNavigatingRef.current = true;

      // 결제 페이지로 이동
      window.location.href = '/reservations/payment';
    } catch (error) {
      console.error('예약 등록 실패:', error);
      alert('예약 등록 중 오류가 발생했습니다.');
    }
  };

  if (!reservationData) {
    return <div>예약 정보를 불러오는 중...</div>;
  }

  const price = reservationData.price || 0;

  return (
    <div className={styles.container}>
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
                  value={customerInfo.phone}
                  onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
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
            <div className={styles.restaurantName}>정미스시</div>
            <div className={styles.bookingInfo}>
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
              >
                결제하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationConfirm;