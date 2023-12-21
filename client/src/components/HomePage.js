import React, { useState, useEffect } from 'react';
import axios from "axios";
import Banner from './Banner/Banner';
import Nav from './Nav/Nav';
import QuestionPage from './QuestionPage/QuestionPage';
import TagPage from './TagPage/TagPage';
import { Link } from 'react-router-dom';



export default function HomePage() {

  const [model, setModel] = useState(null);
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [displayedQuestions, setDisplayedQuestions] = useState([]);
  const [pageTitle, setPageTitle] = useState("All Questions");
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/model')
      .then(response => {
        setModel(response.data);
        setIsLoading(false)
        // setDisplayedQuestions(response.data.questions)
        setError(null)
      })
      .catch(error => {
        setError(error.message)
        setIsLoading(false)
        console.error('Failed to fetch data:', error);
      });

    axios.get('http://localhost:8000/questions')
      .then(response => {
        setDisplayedQuestions(response.data)
      })
      .catch(error => {
        setError(error.message)
        setIsLoading(false)
        console.error('Failed to fetch data:', error);
      });

    axios.get('http://localhost:8000/test').then(res => {
      setUserInfo(res.data)
      setIsLoading(false)
      console.log(res)
    })


    // const getUsername = (userId) => {
    //   const user = model.user.find(user => user._id === userId);
    //   return user ? user.username : 'Unknown user';
    // }
    // displayedQuestions.map((question) => {
    //   const username = getUsername(question.asked_by);
    //   console.log("Username for question is:", username);
    // });
  }, []);

  const [activeLink, setActiveLink] = useState("questions");


console.log("userInfo",userInfo)


//debug stuff
  // displayedQuestions.map((question) => {
  //   console.log("question.asked_by", question.asked_by);
  // });

  // displayedQuestions.map((question) => {
  //   if (question.asked_by) {
  //     console.log('fer',question.asked_by.username); 
  //   } else {
  //     console.log('asked_by is undefined for question with id:', question._id);
  //     console.log('asked_by is undefined for question with username:', question._id.username);
  //   }
  // });

  // displayedQuestions.map((question) => {
  //   // console.log('test',question.asked_by.username); // logs the username of the user who asked the question
  //   console.log('test2',question.votes.length); // logs the number of votes the question has
  // });

  return (
    <>
      <Banner model={model} setDisplayedQuestions={setDisplayedQuestions} setPageTitle={setPageTitle} userInfo={userInfo} />
      <Nav setActiveLink={setActiveLink} activeLink={activeLink} />
      {error && <div className="error-message">
        <h1>{error}</h1>
        {/* <button onClick={() => window.location.reload()}>Go back to the welcome page</button> */}
        <Link to="/"><input type="button" className='btn-warning' value="Go back to the welcome page" /></Link>
      </div>}
      {isLoading && <h1>Loading...</h1>}
      {model && <div className="mainRight">
        {activeLink === "questions" ? (
          <QuestionPage model={model} setModel={setModel} setQuestions={setDisplayedQuestions} questions={displayedQuestions} pageTitle={pageTitle} setActiveLink={setActiveLink} userInfo={userInfo} setUserInfo={setUserInfo} />
        ) : (
          <TagPage model={model} setModel={setModel} setQuestions={setDisplayedQuestions} questions={displayedQuestions} pageTitle={pageTitle} setPageTitle={setPageTitle} setActiveLink={setActiveLink} userInfo={userInfo} setUserInfo={setUserInfo} />
        )}
      </div>
      }
    </>
  )

}