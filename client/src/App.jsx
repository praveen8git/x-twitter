import axios from "axios";
import { Routes, Route, useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import { useContext, useEffect, useState } from "react";
import { Home, Login, Profile, Register, Search, SingleTweet } from "./pages";
import IsAuthenticatedContext from "./contexts/IsAuthenticatedContext";
import ModalContextProvider from "./contexts/ModalContextProvider";

const { VITE_SERVER } = import.meta.env;

function App() {

  const navigate = useNavigate();

  const { login } = useContext(IsAuthenticatedContext);
  const isLoggedin = async () => {
    try {
      const response = await axios.get(`${VITE_SERVER}/auth/is-logged-in`, {
        withCredentials: true,
      })
      // console.log(response);
      if (response.data.success) {
        
        login(response.data.user);
      }
    } catch (error) {
      console.error(error);
      navigate('/login');
    }
  }

  useEffect(() => {
    isLoggedin();
  }, [])
  return (
    <ModalContextProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Search />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tweet/:tweetId" element={<SingleTweet/>} />
      </Routes>
      
      <Toaster 
        toastOptions={{
          className: 'text-primary bg-primary/5 border border-primary backdrop-blur-md',
          duration: 3000
        }}
      />
    </ModalContextProvider>
  )
}

export default App
