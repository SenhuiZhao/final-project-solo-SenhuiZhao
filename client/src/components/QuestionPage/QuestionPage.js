import React, { useState, useEffect, useCallback } from 'react';
import "./QuestionPage.css"
import AskQuestionPage from '../AskQuestionPage/AskQuestionPage';
import AnswersPage from '../AnswersPage/AnswersPage';
import axios from 'axios';



// const QUESTIONS_PER_PAGE = 5;

function QuestionPage({ model, setModel, questions, setQuestions, pageTitle, setActiveLink, userInfo, setUserInfo }) {
    // const [questions, setQuestions] = useState([]);
    // const [tags, setTags] = useState([]);
    const tags = model.tags
    // console.log(questions);
    const [sortType, setSortType] = useState("newest");
    const [showQuestionPage, setShowQuestionPage] = useState(true);
    const [showAskquestionPage, setshowAskquestionPage] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);


    const QUESTIONS_PER_PAGE = 5;
    const [currentPage, setCurrentPage] = useState(1);
    const totalQuestions = questions.length;
    const totalPages = Math.ceil(totalQuestions / QUESTIONS_PER_PAGE);

    const handleNextPageClick = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPageClick = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const startQuestionIndex = (currentPage - 1) * QUESTIONS_PER_PAGE;
    const endQuestionIndex = startQuestionIndex + QUESTIONS_PER_PAGE;
    const currentQuestions = questions.slice(startQuestionIndex, endQuestionIndex);


    const handleAskQuestionClick = () => {
        if (!userInfo) {
            window.alert("Please login first.")
            return;
        }
        setShowQuestionPage(false);
        setshowAskquestionPage(true);
    };

    const handleSort = useCallback((type) => {
        if (!model.questions) return;
        let sortedQuestions;
        if (type === "newest") {
            sortedQuestions = [...model.questions].sort((a, b) => {
                const dateA = new Date(a.ask_date_time);
                const dateB = new Date(b.ask_date_time);
                return dateB - dateA;
            });
        } else if (type === "active") {
            sortedQuestions = [...model.questions].sort(
                (q1, q2) => {
                    const a1 = q1.answers.map(ans => model.answers.find(a => a._id === ans)?.ans_date_time).sort((a, b) => b - a)[0];
                    const a2 = q2.answers.map(ans => model.answers.find(a => a._id === ans)?.ans_date_time).sort((a, b) => b - a)[0];
                    const dateA = new Date(a1);
                    const dateB = new Date(a2);
                    return dateB - dateA;
                }
            );
        } else if (type === "unanswered") {
            sortedQuestions = [...model.questions].filter((q) => q.answers.length === 0);
        }
        setQuestions(sortedQuestions);
        setSortType(type);
    }, [model, setQuestions]);

    useEffect(() => {
        handleSort(sortType);
    }, [model, handleSort, sortType]);


    // console.log("questions",questions)
    function formatQuestionMetadata(q) {
        const now = new Date();
        const askDate = new Date(q.ask_date_time);
        const timeDiff = now - askDate;

        const getUsername = (userId) => {
            const user = model.user.find(user => user._id === userId);
            return user ? user.username : 'Unknown user';
        }

        const question_asked_by = getUsername(q.asked_by)

        //q.asked_by.username undefined
        if (timeDiff < 60 * 1000) {
            return (<div>
                <span className='redColor'>{question_asked_by} </span>
                <span className='grayColor'>asked {Math.floor(timeDiff / 1000)} seconds ago </span>
            </div>);
        } else if (timeDiff < 60 * 60 * 1000) {
            return (<div>
                <span className='redColor'>{question_asked_by} </span>
                <span className='grayColor'>asked {Math.floor(timeDiff / (60 * 1000))} minutes ago</span>
            </div>);
        } else if (timeDiff < 24 * 60 * 60 * 1000) {
            return (<div>
                <span className='redColor'>{question_asked_by} </span>
                <span className='grayColor'>asked {Math.floor(timeDiff / (60 * 60 * 1000))} hours ago</span>
            </div>);
        } else if (now.getFullYear() === askDate.getFullYear()) {
            return (<div>
                <span className='redColor'>{question_asked_by} </span>
                <span className='grayColor'>asked {askDate.toLocaleDateString('default', { month: 'short', day: 'numeric' })} at {askDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>);
        } else {
            return (<div>
                <span className='redColor'>{question_asked_by} </span>
                <span className='grayColor'>asked {askDate.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })} at {askDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>);
        }
    }

    function handleSelectedQuestion(event) {
        // console.log('event:', event);
        setShowQuestionPage(false);
        setSelectedQuestion(event);
        // console.log('selectedQuestion:', selectedQuestion);
    }

    // console.log("questions", questions)

    //   useEffect(() => {
    //     console.log('selectedQuestion:', selectedQuestion);
    //   }, [selectedQuestion]);

    return (
        <>
            {showQuestionPage &&
                <div className="main-body">
                    {/* Right side of the main body */}
                    <div className="questions-container">
                        <div className="questions-header">
                            <h1>{pageTitle}</h1>
                            <button className="ask-question-btn" onClick={handleAskQuestionClick}>Ask Question</button>
                        </div>
                        <ul className='total-questions-line'>
                            <li className='total-questions'>
                                <p>Total questions: {questions.length}</p>
                            </li>
                            <li className="sort-buttons-container">
                                <button className={`sort-button ${sortType === "newest" ? "active" : ""}`} onClick={() => handleSort("newest")}>
                                    Newest
                                </button>
                                <button className={`sort-button ${sortType === "active" ? "active" : ""}`} onClick={() => handleSort("active")}>
                                    Active
                                </button>
                                <button className={`sort-button ${sortType === "unanswered" ? "active" : ""}`} onClick={() => handleSort("unanswered")}>
                                    Unanswered
                                </button>
                            </li>
                        </ul>
                        <div className="questions-list">
                            {currentQuestions.map((q) => (
                                <div key={q._id}>
                                    <div className="question-item">
                                        <div className="detailLeft">
                                            <p>
                                                {q.answers.length} {q.answers.length === 1 ? "answer" : "answers"}
                                            </p>
                                            <p> {q.views} views </p>
                                            <p>
                                                {q.votes.length === 1 ? `${q.votes.length} vote` : `${q.votes.length || 0} votes`}
                                            </p>

                                        </div>

                                        <div
                                            className="question-name"
                                            onClick={() => handleSelectedQuestion(q)}
                                        >
                                            {q.title}
                                            <div className="question-summary">
                                                {q.summary}
                                            </div>
                                        </div>
                                        <div className="detailRight">
                                            {formatQuestionMetadata(q)}
                                        </div>
                                    </div>
                                    <p className="tagsInQuestion">
                                        {q.tags.map((tagId, index) => (
                                            <span key={index} className="tagsBg">{tags.map((tag) => (tag._id) === tagId ? tag.name : "")}</span>
                                        ))}
                                    </p>

                                </div>
                            ))}

                        </div>

                        {/* Navigation buttons */}
                        {totalPages > 1 && (
                            <div className="pagination fixed-button-wrapperr">
                                <button
                                    className="prev-btn"
                                    onClick={handlePrevPageClick}
                                    disabled={currentPage === 1}
                                >
                                    Prev
                                </button>
                                <button
                                    className="next-btn"
                                    onClick={handleNextPageClick}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            }
            {showAskquestionPage && <AskQuestionPage model={model} setModel={setModel} setQuestions={setQuestions} questions={questions} setActiveLink={setActiveLink} userInfo={userInfo} setUserInfo={setUserInfo} />}
            {selectedQuestion && <AnswersPage selectedQuestion={selectedQuestion} model={model} setModel={setModel} questions={questions} setQuestions={setQuestions} setSelectedQuestion={setSelectedQuestion} setActiveLink={setActiveLink} userInfo={userInfo} setUserInfo={setUserInfo} />}
        </>
    );
}

export default QuestionPage;