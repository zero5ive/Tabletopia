import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';

import { Routes, Route } from 'react-router-dom';

import Login from './pages/loginpage/Login';
import SignUp from './pages/signuppage/SignUp';
import SignUpSuccess from './pages/signuppage/SignUpSuccess';

import Main from './pages/mainpage/Main';

import MyPage from './pages/MyPage/MyPage';

function App() {

  return (
    <Routes>
      <Route path="/" element={<Main />} />
    
      <Route path="/members/new" element={<SignUp />} />
      <Route path="/members/new/success" element={<SignUpSuccess />} />

      <Route path="/members/login" element={<Login />} />

      <Route path="/mypage" element={<MyPage />} />
    </Routes>
  )
}

export default App