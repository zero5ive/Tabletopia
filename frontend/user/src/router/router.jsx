import { createBrowserRouter } from "react-router-dom";

import ChatBotLayout from '../components/ChatBotLayout';

// 로그인/회원가입 관련 페이지
import Login from '../pages/loginpage/Login';
import SignUp from '../pages/signuppage/SignUp';
import SignUpSuccess from '../pages/signuppage/SignUpSuccess';

// 서비스 메인페이지
import Main from '../pages/mainpage/Main';

// 레스토랑 관련 페이지
import RestaurantList from "../pages/restaurant/RestaurantList";
import RestaurantDetail from '../pages/restaurant/RestaurantDetail';

// 예약 관련 페이지
import SelectTable from '../pages/reservationpage/SelectTable';
import ConfirmInfo from '../pages/reservationpage/ConfirmInfo';

// 마이페이지 관련 페이지
import MyPageLayout from '../pages/mypage/MyPageLayout';
import MyPage from '../pages/mypage/MyPage';
import MyWaiting from "../pages/mypage/MyWaiting";
import MyReservation from "../pages/mypage/MyReservation";
import MyReview from "../pages/mypage/MyReview";
import MyBookMark from "../pages/mypage/MyBookmark";
import ReviewWrite from "../pages/mypage/ReviewWrite";
import MyProfile from "../pages/mypage/MyProfileEdit";

const router = createBrowserRouter([
    // 챗봇 하위 자식
    {
        path: "/",
        element: <ChatBotLayout />,
        children: [
            {
                index: true,
                element: <Main />
            },
            // 마이페이지 관련
            {
                path: "mypage",
                element: <MyPageLayout />,
                children: [
                    // 마이페이지 메인 화면
                    {
                        index: true,
                        element: <MyPage />
                    },
                    // 프로필 수정  
                    {
                        path: "profile",
                        element: <MyProfile />
                    },
                    // 북마크 
                    {
                        path: "bookmark",
                        element: <MyBookMark />
                    },
                    // 리뷰 내역
                    {
                        path: "review",
                        element: <MyReview />
                    },
                    // 예약 내역
                    {
                        path: "reservation",
                        element: <MyReservation />
                    },
                    // 웨이팅 내역
                    {
                        path: "waiting",
                        element: <MyWaiting />
                    },
                ]
            },
            {
                // 레스토랑 관련
                path: "/restaurant",
                children: [
                    // 레스토랑 리스트
                    {
                        path: "list",
                        element: <RestaurantList />
                    },
                    // 레스토랑 상세
                    {
                        path: "detail",
                        element: <RestaurantDetail />
                    },
                ]
            },

        ]
    },

    // 예약 관련 페이지
    {
        path: "/reservations",
        children: [
            // 테이블 선택 화면
            {
                path: "table",
                element: <SelectTable />
            },
            // 예약 정보 입력 화면
            {
                path: "confirm-info",
                element: <ConfirmInfo />
            }
        ]
    },
    // 리뷰 쓰기 
    {
        path: "review/write",
        element: <ReviewWrite />

    },
    // 로그인 관련 (가이드 코드로 둔 거였으므로 수정하거나 나중에 지우거나)
    {
        path: "/users",
        children: [
            {
                path: "signup",
                element: <SignUp />
            },
            {
                path: "new/success",
                element: <SignUpSuccess />
            },
            {
                path: "loginform",
                element: <Login />
            }
        ]
    },



]);

export default router;