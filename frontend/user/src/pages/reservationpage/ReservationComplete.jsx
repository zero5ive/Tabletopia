import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Payment.module.css';

/**
 * 예약 및 결제 완료 페이지
 * ConfirmInfo에서 결제 완료 후 이동하는 페이지
 */
const ReservationComplete = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // sessionStorage 정리
    sessionStorage.removeItem('activeTableSelection');
    localStorage.removeItem('finalReservationData');
  }, []);

  const handleGoToReservations = () => {
    navigate('/mypage/reservation');
  };

  const handleGoToMain = () => {
    navigate('/');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>예약이 완료되었습니다!</h1>
      <div className={styles.summary}>
        <p style={{ textAlign: 'center', marginBottom: '20px' }}>
          TableTopia 예약 서비스를 이용해 주셔서 감사합니다.
        </p>
        <p style={{ textAlign: 'center', marginBottom: '30px' }}>
          예약 내역은 마이페이지에서 확인하실 수 있습니다.
        </p>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button onClick={handleGoToReservations} className={styles.button}>
            예약 내역 확인
          </button>
          <button
            onClick={handleGoToMain}
            className={styles.button}
            style={{ backgroundColor: '#6c757d' }}
          >
            메인으로 이동
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationComplete;
