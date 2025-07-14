import { useRef } from 'react'
import { HashRouter as Router, Routes, Navigate, Route } from "react-router-dom";
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Inquiries from './components/inquiries';
import { useStore } from './Context/Store';
import Login from './components/login';



const App = () => {




  const {
    setActiveFilter,
  } = useStore();

  const getClickedArea = (e) => {

    if (!e.target.closest('.dropdown') && !e.target.classList.contains('dropdown')) {
      setActiveFilter();
    }


  }




  return (
    <div className='App' onClick={(e) => getClickedArea(e)}>
      <Routes>
        <Route exact path='/login' element={<Login />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
        <Route path="/" element={<Header />}>
          <Route exact path="/dashboard" element={<Dashboard />} />
          <Route exact path="/inquiries" element={<Inquiries />} />
        </Route>

      </Routes>
    </div>
  )



}

export default App
