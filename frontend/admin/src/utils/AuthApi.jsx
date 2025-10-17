const logoutAdmin = async () => {
  try {
    const response = await fetch('http://localhost:8002/admin/api/logout', {
      method: 'POST', // Logout is typically a POST request
      headers: {
        'Content-Type': 'application/json',
        // Add any necessary authentication headers, e.g., 'Authorization': `Bearer ${token}`
      },
    });

    if (response.ok) {
      // Optionally clear any client-side authentication tokens or user data
      // localStorage.removeItem('adminToken');
      // sessionStorage.removeItem('adminToken');

      // Redirect to the root or login page after successful logout
      window.location.href = '/'; // Redirect to the root of the application
    } else {
      console.error('Logout failed:', response.statusText);
      // Handle logout failure (e.g., show an error message)
      alert('로그아웃 실패: ' + response.statusText);
    }
  } catch (error) {
    console.error('Error during logout:', error);
    // Handle network errors
    alert('로그아웃 중 오류 발생: ' + error.message);
  }
};

export { logoutAdmin };
