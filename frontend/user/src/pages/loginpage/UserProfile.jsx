import React, { useEffect, useState } from 'react';
import userApi from '../utils/UserApi'; // 방금 만든 api.js 파일을 import
 
function UserProfile() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // 이제 그냥 get 요청만 보내면 인터셉터가 알아서 헤더를 추가해줍니다.
                const response = await userApi.get('/api/user/me');
                console.log(response.data);
                
                setUser(response.data);
            } catch (err) {
                setError('사용자 정보를 불러오는데 실패했습니다.');
                console.error(err);
            }
        };

        fetchUser();
    }, []);

    if (error) return <div>{error}</div>;
    if (!user) return <div>로딩 중...</div>;

    return (
        <div>
            <h1>내 정보</h1>
            <p>PK : {user.id}</p>
            <p>이름: {user.name}</p>
            <p>이메일: {user.email}</p>
            <p>전화번호: {user.phoneNumber}</p>
        </div>
    );
}

export default UserProfile;