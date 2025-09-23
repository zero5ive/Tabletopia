import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';

import {  RouterProvider } from "react-router-dom";


import router from './router/router';

function App() {

  return (
    <RouterProvider router={router} />
  )
}

export default App