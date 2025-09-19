import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';

<<<<<<< HEAD
import { Routes, Route, Navigate } from "react-router-dom";
=======
import { Routes, Route } from 'react-router-dom';
>>>>>>> 797e545bbe66ad3d38132f3eacfc1b78b63688e6

import Login from './pages/loginpage/Login';
import SignUp from './pages/signuppage/SignUp';
import SignUpSuccess from './pages/signuppage/SignUpSuccess';

import Main from './pages/mainpage/Main';

import MyPage from './pages/mypage/MyPage';
import ChatBotLayout from './components/ChatBotLayout';

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
      <Route path="/members/new" element={<SignUp />} />
      <Route path="/members/new/success" element={<SignUpSuccess />} />

<<<<<<< HEAD
      <Route path="/members/login" element={<Login />} />W
=======
      <Route path="/members/login" element={<Login />} />
>>>>>>> 797e545bbe66ad3d38132f3eacfc1b78b63688e6
    </Routes>
  )
}

export default App