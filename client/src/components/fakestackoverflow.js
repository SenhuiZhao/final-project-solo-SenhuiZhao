
import { Routes, Route, Navigate, useNavigate } from "react-router-dom"
import WelcomePage from "./WelcomePage/WelcomePage";
import LoginPage from "./LoginPage/LoginPage";
import SignUpPage from "./SignUpPage/SignUpPage";
import HomePage from "./HomePage";
import { useEffect } from "react";
import axios from "axios";
// import AskQuestionPage from "./AskQuestionPage/AskQuestionPage";
// import AnswersPage from "./AnswersPage/AnswersPage";
import Profile from "./ProfilePage/ProfilePage";

export default function FakeStackOverflow() {
  const nav = useNavigate();

  const checkSession = async () =>{
    const res = await axios.get('http://localhost:8000/test')
    console.log(res)
    if (res.data){
      nav('/welcome/HomePage')
    } 
  }
  useEffect(()=>{
    axios.defaults.withCredentials = true;
    checkSession()
  },[])
  return (
    // <h1> Replace with relevant content </h1>
    
      <Routes>
        <Route path="*" element={<Navigate replace to={"/welcome"} />} />
        <Route path="/" element={<Navigate replace to={"/welcome"} />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/welcome/SignUpPage" element={<SignUpPage />} />
        <Route path="/welcome/LoginPage" element={<LoginPage />} />
        <Route path="/welcome/HomePage" element={<HomePage />} />
        <Route path="/welcome/HomePage/ProfilePage/:id" element={<Profile/>} />
        {/* <Route path="/welcome/HomePage/ProfilePage/AskQuestionPage/:id" element={<AskQuestionPage />} /> */}
      </Routes>
  
  );
}
