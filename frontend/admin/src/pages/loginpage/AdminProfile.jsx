import React, { useEffect, useState } from 'react';
import AdminApi from '../../utils/AdminApi'; // 방금 만든 api.js 파일을 import

function AdminProfile() {
    const [admin, setAdmin] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                // 이제 그냥 get 요청만 보내면 인터셉터가 알아서 헤더를 추가해줍니다.
                const response = await AdminApi.get('/api/admin/auth/me');
                console.log(response.data.admin);

                if (data?.role) {
                    const role = data.role.replace('ROLE_', '')
                }

                setAdmin(response.data.admin);
            } catch (err) {
                setError('사용자 정보를 불러오는데 실패했습니다.');
                console.error(err);
            }
        };

        fetchAdmin();
    }, []);

    if (error) return <div>{error}</div>;
    if (!admin) return <div>로딩 중...</div>;

    return (
        <div>
            <h1>내 정보</h1>
            <p>PK : {admin.id}</p>
            <p>이름: {admin.name}</p>
            <p>이메일: {admin.email}</p>
        </div>
    );
}

export default AdminProfile;