/**
 * 타임슬롯 생성 함수
 * 
 * @param {string} openTime - 오픈 시간 "09:00:00" 또는 "09:00"
 * @param {string} closeTime - 마감 시간 "21:00:00" 또는 "21:00"
 * @param {number} interval - 예약 간격 (분)
 * @returns {string[]} 타임슬롯 배열
 */
export const generateTimeSlots = (openTime, closeTime, interval) => {
    if (!openTime || !closeTime || !interval) {
        return [];
    }
    
    const slots = [];
    
    // "09:00:00" 또는 "09:00" 형식 모두 처리
    const [openHour, openMin] = openTime.split(':').map(Number);
    const [closeHour, closeMin] = closeTime.split(':').map(Number);
    
    const openMinutes = openHour * 60 + openMin;
    const closeMinutes = closeHour * 60 + closeMin;
    
    // 마감 시간 전까지 반복
    for (let time = openMinutes; time < closeMinutes; time += interval) {
        const hour = Math.floor(time / 60);
        const min = time % 60;
        const timeString = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
        slots.push(timeString);
    }
    
    return slots;
};

/**
 * 시간 포맷팅 (한글 표시용)
 * 
 * @param {string} time - "09:00" 형식
 * @returns {string} "오전 9시" 형식
 */
export const formatTimeKorean = (time) => {
    const [hour, min] = time.split(':').map(Number);
    const period = hour < 12 ? '오전' : '오후';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    
    if (min === 0) {
        return `${period} ${displayHour}시`;
    }
    return `${period} ${displayHour}시 ${min}분`;
};