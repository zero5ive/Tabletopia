import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';

import { Routes, Route, Navigate } from "react-router-dom";

/* 로그인 관련 페이지 */
import Login from './pages/loginpage/Login';
import SignUp from './pages/signuppage/SignUp';
import SignUpSuccess from './pages/signuppage/SignUpSuccess';

/* 메인 페이지 */
import Main from './pages/mainpage/Main';
/* 챗봇 레이아웃 */
import ChatBotLayout from './components/ChatBotLayout';

/* 레스토랑 관련 페이지 */
import RestaurantList from './pages/restaurant/RestaurantList';
import RestaurantDetail from './pages/restaurant/RestaurantDetail';

/* 예약 관련 페이지 */
import SelectTable from './pages/reservationpage/SelectTable';
import ConfirmInfo from './pages/reservationpage/ConfirmInfo';

/* 사용자 마이페이지 */
import MyPage from './pages/mypage/MyPage';


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
        <Route path='/restaurants' element={<RestaurantList/>}/>
      </Route>

      {/* Routes without ChatBot */}
      <Route path="/restaurant" element={<RestaurantDetail/>}/>
      <Route path="/members/new" element={<SignUp />} />
      <Route path="/members/new/success" element={<SignUpSuccess />} />

      <Route path="/members/login" element={<Login />} />

      {/* 예약 관련 페이지 */}
      <Route path="/reservations/table" element={<SelectTable />} />
      <Route path="/reservations/confirm" element={<ConfirmInfo />} />
    </Routes>
  )
}

export default App