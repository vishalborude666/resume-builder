import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Layout from "./pages/Layout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ResumeBuilder from "./pages/Resumebuilder.jsx";
import Preview from "./pages/Preview.jsx";
import Login from "./pages/Login.jsx";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import api from "./configs/api.js";
import { setLoading, login } from "./app/features/authSlice.js";
import {Toaster} from 'react-hot-toast'

const App = () => {
 const dispatch = useDispatch ()
 const getUserData = async ()=>{
  const token = localStorage.getItem('token')
  try {
    if(token){
      const {data} = await api.get('/api/users/data')
      if(data.user){
        dispatch(login({token,user:data.user}))
      }
      dispatch(setLoading(false))
    }else{
      dispatch(setLoading(false))
    }
  }catch (error){
         dispatch(setLoading(false))
         console.log(error.message)
  }
 }
 useEffect(()=>{
  getUserData()
 },[])
  return (
    <>
    <Toaster />
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Layout + Nested Routes */}
        <Route path="app" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="builder/:resumeId" element={<ResumeBuilder />} />
        </Route>

        {/* Outside Layout */}
        <Route path="view/:resumeId" element={<Preview />} />

      </Routes>
    </>
  );
};

export default App;
