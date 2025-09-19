import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './components/Sidebar'
import MainContent from './components/MainContent';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {

    return (
        <div className="container-fluid">
            <div className="row">
                <Sidebar/>
                <MainContent/>
            </div>
        </div>
    );
}

export default App