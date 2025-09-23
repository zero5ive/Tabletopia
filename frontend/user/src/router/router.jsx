import { createBrowserRouter } from "react-router-dom";

import ChatBotLayout from '../components/ChatBotLayout';

import Login from '../pages/loginpage/Login';
import SignUp from '../pages/signuppage/SignUp';
import SignUpSuccess from '../pages/signuppage/SignUpSuccess';

import Main from '../pages/mainpage/Main';

import SelectTable from '../pages/reservationpage/SelectTable';
import RestaurantDetail from '../pages/restaurant/RestaurantDetail';

import MyPage from '../pages/mypage/MyPage';
import MyWaiting from "../pages/mypage/MyWaiting";


const router = createBrowserRouter([
    {
        path: "/",
        element: <ChatBotLayout />,
        children: [
            {
                index: true,
                element: <Main />
            },
            {
                path: "mypage",
                children: [
                    {
                        index: true,
                        element: <MyPage />
                    },
                    {
                        path: "waiting",
                        element: <MyWaiting />
                    },
                ]
            },
            {
                path: "/restdetail",
                element: <RestaurantDetail />
            },
        ]
    },
    {
        path: "/members",
        children: [
            {
                path: "new",
                element: <SignUp />
            },
            {
                path: "new/success",
                element: <SignUpSuccess />
            },
            {
                path: "login",
                element: <Login />
            }
        ]
    },


    {
        path: "/reservations",
        children: [
            {
                path: "table",
                element: <SelectTable />
            }
        ]
    }
]);

export default router;