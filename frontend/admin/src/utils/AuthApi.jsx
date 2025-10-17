import AdminApi from "./AdminApi";

const logoutAdmin = async () => {
  try {
    // Axios POST 요청 (data 없이, config만 전달)
    const response = await AdminApi.post('/api/admin/auth/logout');

    // Axios는 상태 코드 2xx이면 then으로 넘어옵니다.
    console.log('Logout successful:', response.data);

    // 클라이언트 측 세션 정리
    // localStorage.removeItem('adminToken'); // 필요시
    // sessionStorage.removeItem('adminToken');

    // 로그아웃 후 리다이렉트
    window.location.href = '/';
  } catch (error) {
    // 401/403 등 서버 응답 오류
    if (error.response) {
      console.error('Logout failed:', error.response.status, error.response.data);
      alert('로그아웃 실패: ' + error.response.status);
    } else {
      console.error('Network error during logout:', error);
      alert('로그아웃 중 네트워크 오류 발생: ' + error.message);
    }
  }
};

export { logoutAdmin };
