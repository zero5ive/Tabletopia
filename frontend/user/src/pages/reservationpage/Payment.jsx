import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { processPayment } from '../utils/UserApi';
import styles from './Payment.module.css';

const Payment = () => {
  const navigate = useNavigate();
  const [reservationRequest, setReservationRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    const data = localStorage.getItem('finalReservationData');
    if (data) {
      // In a real app, you might want to verify this data with the backend
      // to ensure it hasn't been tampered with.
      setReservationRequest(JSON.parse(data));
    } else {
      alert('결제할 예약 정보가 없습니다. 메인 페이지로 돌아갑니다.');
      navigate('/');
    }
  }, [navigate]);

  const handlePayment = async () => {
    if (!reservationRequest) {
      alert('예약 정보가 없습니다.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {

      // payment 컨트롤러에 요청보낼 paymentInfo 생성
      const paymentRequestDTO = {
        // orderNo:'',
        productDesc: reservationRequest.restaurantName,
        amount: reservationRequest.price,
        //우리나라 법률 상 나중에 double로 파싱, 90프로 계산 후 반올림등 사용해서 int로 reparsing해서 넣어주기
        amountTaxFree: reservationRequest.price
      };
      const paymentRequest ={
        ...paymentRequestDTO,
        ...reservationRequest
      }

      const response = await processPayment(paymentRequest);
      // const response = await processPayment();
      console.log("응답객체",response);
      
      // 응답 데이터에 checkoutPage 및 status가 맞는지 확인합니다.
      if (response && response.data.checkoutPage) {
        
        // 토스 결제 페이지로 리디렉션 **내부 처리가 아닌 바로 리디렉션 해주어야 합니다.
        // checkoutPage는 URL 문자열이므로 그대로 사용합니다.
        window.location.href = response.data.checkoutPage;

      } else {
        throw new Error('결제 페이지 진입에 실패했습니다.');
      }
    } catch (err) {
      console.error('Payment processing error:', err);
      setError(err.message || '결제 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
    //성공적으로 리디렉션되면 이 페이지는 알아서 닫히도록 되어있기 떄문에 flag 설정 필요 없음.
  };

  if (!reservationRequest) {
    return <div className={styles.container}>예약 정보를 불러오는 중...</div>;
  }

  return (
    <div className={styles.container}>
      <h1>결제 확인</h1>

      <div className={styles.summary}>
        <h2>예약 정보</h2>
        <p><strong>가게:</strong> {reservationRequest.restaurantName}</p>
        <p><strong>일시:</strong> {reservationRequest.date} {reservationRequest.time}</p>
        <p><strong>인원:</strong> {reservationRequest.peopleCount}명</p>
        <div className={styles.price}>
          <strong>총 결제 금액:</strong>
          <span>{reservationRequest.price.toLocaleString()}원</span>
        </div>
      </div>

      <div className={styles.paymentMethod}>
        <h2>결제 수단</h2>
        <p>Toss Pay</p>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <button
        onClick={handlePayment}
        disabled={isLoading}
        className={styles.button}
      >
        {isLoading ? '결제 진행 중...' : `${reservationRequest.price.toLocaleString()}원 결제하기`}
      </button>
    </div>
  );
};

export default Payment;