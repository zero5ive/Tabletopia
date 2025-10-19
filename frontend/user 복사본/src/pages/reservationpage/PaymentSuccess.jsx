import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { confirmPayment } from '../utils/UserApi';
import styles from './Payment.module.css'; // 스타일은 Payment와 공유

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('결제 정보를 처리 중입니다...');

  useEffect(() => {
    const processConfirmation = async () => {
      // URL에서 토스페이먼츠가 넘겨준 파라미터를 추출합니다.
      const status = searchParams.get('status');
      const orderNo = searchParams.get('orderNo');
      const payMethod = searchParams.get('payMethod');

      console.log("status는 ", status);
      
      // const orderId = searchParams.get('orderId');
      // const amount = searchParams.get('amount');

      // 필수 파라미터가 없는 경우 에러 처리
      // if (paymentKey = null) {
      //   setMessage('잘못된 접근입니다. 결제 정보가 올바르지 않습니다.');
      //   // 필요하다면 3-5초 후 메인 페이지로 리디렉션
      //   // setTimeout(() => navigate('/'), 5000);
      //   return;
      // }

      try {
        // 백엔드에 최종 승인 요청을 보냅니다.
        const paymentConfirm = {
          status : status,
          orderNo : orderNo,
          payMethod : payMethod
        }
        console.log("요청객체는",paymentConfirm);
        

        const response = await confirmPayment({ paymentConfirm });
        console.log("응답객체는", response);
        
        // 백엔드에서 성공적으로 처리되었을 때
        if (response.data && response.data.success) {
          setMessage('결제가 성공적으로 완료되었습니다!TableTopia예약 서비스를 이용해 주셔서 감사합니다.');
          // // 3초 후 마이페이지의 예약 내역으로 이동
          // setTimeout(() => {
          //   navigate('/mypage/reservation');
          // }, 3000);
        } else {
          // 백엔드에서 결제 승인 실패 처리했을 때
          throw new Error(response.data.message || '결제 승인에 실패했습니다.');
        }
      } catch (error) {
        // API 요청 실패 또는 백엔드 에러
        console.error('Payment confirmation error:', error);
        setMessage(error.message || '결제 처리 중 오류가 발생했습니다. 문제가 지속되면 고객센터로 문의해주세요.');
      }
    };

    processConfirmation();
  }, [searchParams, navigate]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>결제 처리</h1>
      <div className={styles.summary}>
        <p style={{ textAlign: 'center' }}>{message}</p>
        <button onClick={() => window.close()} className={styles.button}>
          창닫기
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;