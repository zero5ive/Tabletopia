import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';

import { Routes, Route, Navigate } from "react-router-dom";

import Login from './pages/loginpage/Login';
import SignUp from './pages/signuppage/SignUp';
import SignUpSuccess from './pages/signuppage/SignUpSuccess';

import Main from './pages/mainpage/Main';

import SelectTable from './pages/reservationpage/SelectTable';

import MyPage from './pages/mypage/MyPage';
import ChatBotLayout from './components/ChatBotLayout';
import RestaurantDetail from './pages/restaurant/RestaurantDetail';


function App() {

  return (
    <Routes>
      {/* Routes with ChatBot */}
      <Route element={<ChatBotLayout />}>
        {/* 요청주소(path)에 따라 <Outlet/>에 불러와지는 element가 달라짐
            ex) "/"인 경우 <Outlet/> 자리에 <Main/> <=> "/mypage"인 경우 <MyPage/>
        */}
        <Route path="/" element={<Main />} />
        <Route path="/mypage" element={<MyPage />} />
      </Route>

      {/* Routes without ChatBot */}
      <Route path="/restdetail" element={<RestaurantDetail/>}/>
      <Route path="/members/new" element={<SignUp />} />
      <Route path="/members/new/success" element={<SignUpSuccess />} />

      <Route path="/members/login" element={<Login />} />

      {/* 예약 관련 페이지 */}
      <Route path="/reservations/table" element={<SelectTable />} />
    </Routes>
  )
}

export default App