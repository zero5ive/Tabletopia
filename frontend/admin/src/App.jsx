import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import Login from './pages/loginpage/Login';
import SignUp from './pages/signuppage/SignUp';
import MainContent from './components/MainContent';

function App() {
  return (
    <Router>
      <div className="container-fluid">
        <div className="row">
          <Sidebar />
          <div className="col">
            {/* 라우팅 되는 메인 콘텐츠 영역 */}
            <Routes>
              <Route path="/" element={<Login/>} />
              <Route path="/admins/signup" element={<SignUp/>}/>
              <Route path="/main" element={<MainContent/>}/>
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
