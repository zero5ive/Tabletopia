import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import Login from './pages/loginpage/Login';
import SignUp from './pages/signuppage/SignUp';
import MainContent from './components/MainContent';
import SignUpSuccess from './pages/signuppage/SignUpSuccess';
import AdminInfo from './pages/loginpage/AdminProfile';
import { RestaurantSeatEditor } from './components/tabs/RegistTableTab';

function AppContent() {
  const location = useLocation();
  const hideLayout = location.pathname === '/admin/regist-table';

  return (
    <div className="container-fluid p-0" style={{height: '100vh', overflow: 'hidden'}}>
      <div className="row g-0" style={{height: '100%'}}>
        {!hideLayout && <Sidebar />}
        <div className={hideLayout ? '' : 'col-md-9 col-lg-10'} style={{height: '100%', overflow: 'auto'}}>
          {/* 라우팅 되는 메인 콘텐츠 영역 */}
          <Routes>
            <Route path="/" element={<Login/>} />
            <Route path="/admins/signup" element={<SignUp/>}/>
            <Route path="/admins/signup/success" element={<SignUpSuccess/>}/>
            <Route path="/admins/admininfo" element={<AdminInfo/>}/>
            <Route path="/main" element={<MainContent/>}/>
            <Route path="/admin/regist-table" element={<RestaurantSeatEditor/>}/>
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
