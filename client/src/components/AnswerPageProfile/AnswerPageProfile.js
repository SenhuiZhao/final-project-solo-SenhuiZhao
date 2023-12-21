import React, { useState, useEffect } from 'react';
import "./AnswerPageProfile.css"
import AskQuestionPage from '../AskQuestionPage/AskQuestionPage';
import AnswersPage from '../AnswersPage/AnswersPage';
import axios from 'axios';



// const QUESTIONS_PER_PAGE = 5;

function AnswerPageProfile({ answers, model, setModel, setAnswers, setQuestions, pageTitle, setActiveLink, userInfo, setUserInfo }) {
    // const [questions, setQuestions] = useState([]);
    // const [tags, setTags] = useState([]);
    // const tags = model.tags
    // console.log(questions);
    const [sortType, setSortType] = useState("newest");
    const [showQuestionPage, setShowQuestionPage] = useState(true);
    const [showAskquestionPage, setshowAskquestionPage] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);

    // question handle
    // const [titleError, setTitleError] = useState("");
    // const [textError, setQuestionTestError] = useState("");
    // const [tagsError, setTagsError] = useState("");
    // const [summaryError, setSummaryError] = useState("");


    const ANSWERS_PER_PAGE = 5;
    const [currentPage, setCurrentPage] = useState(1);
    const totalAnswers = answers.length;
    const totalPages = Math.ceil(totalAnswers / ANSWERS_PER_PAGE);

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

    const startAnsIndex = (currentPage - 1) * ANSWERS_PER_PAGE;
    const endQuestionIndex = startAnsIndex + ANSWERS_PER_PAGE;
    const currentAnswers = answers.slice(startAnsIndex, endQuestionIndex);


    const handleAskQuestionClick = () => {
        if (!userInfo) {
            window.alert("Please login first.")
            return;
        }
        setShowQuestionPage(false);
        setshowAskquestionPage(true);
    };

    useEffect(() => {
        handleSort(sortType);
    }, [model]);


    // Handler function for sorting questions
    function handleSort(type) {
        if (!model.answer) return
        let sortedQuestions;
        if (type === "newest") {
            sortedQuestions = [...answers].sort((a, b) => {
                const dateA = new Date(a.ans_date_time);
                const dateB = new Date(b.ans_date_time);
                // console.log(dateB - dateA)
                return dateB - dateA;
            });
            // console.log('diff',b.ask_date_time - a.ask_date_time)  NaN
        } else if (type === "active") {
            sortedQuestions = [...answers].sort(
                (q1, q2) => {
                    const a1 = q1.answers.map(ans => model.answers.find(a => a._id === ans)?.ans_date_time).sort((a, b) => b - a)[0];
                    const a2 = q2.answers.map(ans => model.answers.find(a => a._id === ans)?.ans_date_time).sort((a, b) => b - a)[0];
                    // console.log('a1', a1)
                    // console.log('a2', a2)
                    const dateA = new Date(a1);
                    const dateB = new Date(a2);
                    return dateB - dateA;
                }
            );
        } else if (type === "unanswered") {
            sortedQuestions = [...answers].filter((q) => q.answers.length === 0);
        }
        setQuestions(sortedQuestions);
        setSortType(type);
    }
    // console.log("questions",questions)
    function formatAnswerQuestionMetadata(q) {
        const now = new Date();
        const ansDate = new Date(q.ans_date_time);
        const timeDiff = now - ansDate;


        const getUsername = (userId) => {
            const user = model.user.find(user => user._id === userId);
            return user
                ? user.username : 'Unknown user';
        }
        const answer_by = getUsername(q.ans_by)

        console.log("q", q)
        console.log("answer_by", answer_by)
        console.log("ans_by", q.ans_by)

        if (timeDiff < 60 * 1000) {
            return (
                <div>
                    <span className="greenColor">{answer_by} </span><br></br>
                    <span className="grayColor">answered {Math.floor(timeDiff / 1000)} seconds ago</span>
                </div>
            );
        } else if (timeDiff < 60 * 60 * 1000) {
            return (
                <div>
                    <span className="greenColor">{answer_by} </span><br></br>
                    <span className="grayColor">answered {Math.floor(timeDiff / (60 * 1000))} minutes ago</span>
                </div>
            );
        } else if (timeDiff < 24 * 60 * 60 * 1000) {
            return (
                <div>
                    <span className="greenColor">{answer_by} </span><br></br>
                    <span className="grayColor">answered {Math.floor(timeDiff / (60 * 60 * 1000))} hours ago</span>
                </div>
            );
        } else if (now.getFullYear() === ansDate.getFullYear()) {
            return (
                <div>
                    <span className="greenColor">{answer_by} </span><br></br>
                    <span className="grayColor">answered {ansDate.toLocaleDateString('default', { month: 'short', day: 'numeric' })} at {ansDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            );
        } else {
            return (
                <div>
                    <span className="greenColor">{answer_by} </span><br></br>
                    <span className="grayColor">answered {ansDate.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })} at {ansDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            );
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


    // const [editingQuestionId, setEditingQuestionId] = useState(null);

    // const [updatedQuestion, setUpdatedQuestion] = useState({});

    // const handleEditQuestion = (id) => {
    //     const uniqueId = questions.find(question => question._id === id);
    //     if (uniqueId) {
    //         setEditingQuestionId(id);
    //         setUpdatedQuestion(uniqueId);
    //     } else {
    //         console.error('Duplicate ids detected. Please ensure each question has a unique id.');
    //     }
    //     // setSelectedQuestion(uniqueId)
    //     // setShowQuestionPage(false)
    //     // setshowAskquestionPage(true)
    // };

    // const handleSaveQuestion = async (id, updatedQuestion) => {
    //     try {
    //         const { data: editedQuestion } = await axios.put(`http://localhost:8000/questions/${id}`, updatedQuestion);
    //         setQuestions(questions.map(question => question._id === id ? editedQuestion : question));
    //         setEditingQuestionId(null);
    //         setUpdatedQuestion({});
    //     } catch (err) {
    //         console.error(err);
    //     }
    // };

    // const handleDeleteQuestion = async (id) => {
    //     try {
    //         await axios.delete(`http://localhost:8000/questions/${id}`);
    //         setQuestions(questions.filter(question => question._id !== id));
    //         // fetchUserData();
    //     } catch (err) {
    //         console.error(err);
    //     }
    // };
    console.log("selectedQuestion", selectedQuestion)

    // const [answers, setAnswers] = useState([]);
    const [updatedAnswer, setUpdatedAnswer] = useState({});
    const [editingAnswerId, setEditingAnswerId] = useState(null);
    const [answerTextError, setAnswerTextError] = useState("");


    const handleCancelEdit = (setEditingId, setUpdated) => {
        setEditingId(null);
        setUpdated({});
    };

    const handleEditAnswer = (id) => {
        const uniqueId = answers.find(answer => answer._id === id);
        if (uniqueId) {
            setEditingAnswerId(id);
            setUpdatedAnswer(uniqueId);
        } else {
            console.error('Duplicate ids detected. Please ensure each answer has a unique id.');
        }
    };

    const handleDeleteAnswer = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/answers/${id}`);
            setAnswers(answers.filter(answer => answer._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const handleSaveAnswer = async (id, updatedAnswer) => {
        try {
            // Assuming you have an endpoint to update an answer with a PUT request
            const { data: editedAnswer } = await axios.put(`http://localhost:8000/answers/${id}`, updatedAnswer);
            // Update the answer in your local state
            setAnswers(answers.map(answer => answer._id === id ? editedAnswer : answer));
            setEditingAnswerId(null);
            setUpdatedAnswer({});
        } catch (err) {
            console.error(err);
        }
    };









    return (
        <>
            {showQuestionPage &&
                <div className="main-body">
                    {/* Right side of the main body */}
                    <div className="questions-container">
                        <div className="questions-header">
                            {answers.length === 0 ? <h1>Not yet answered a question</h1> : <h1>Total questions answered: {answers.length}</h1>}
                            <h1>Answers Profile</h1>
                        </div>
                        <div className="questions-list">
                            {currentAnswers.map((q) => (
                                <div key={q._id} className="question-item">

                                    <div
                                        key={q.id}
                                        className="question-name"
                                        onClick={() => handleEditAnswer(q._id)}
                                    >
                                        {q.text}

                                    </div>
                                    {/* <a href={`/answers/${q._id}`}>{q.text}</a> */}
                                    {formatAnswerQuestionMetadata(q)}
                                    <div className="detailLeft">
                                        <button onClick={() => handleEditAnswer(q._id)}>Edit</button>
                                        <button onClick={() => handleDeleteAnswer(q._id)}>Delete</button>
                                    </div>
                                    {editingAnswerId === q._id &&  // changed from editingQuestionId to editingAnswerId
                                        <form onSubmit={(e) => {
                                            e.preventDefault();
                                            handleSaveAnswer(q._id, updatedAnswer);
                                        }}>
                                            <div className="newQuestion-body">
                                                <div className="ans-form-group">
                                                    <label htmlFor="answer-input">Answer Text*</label><br></br>
                                                    <textarea
                                                        id="answer-input"
                                                        value={updatedAnswer.text}
                                                        onChange={(e) => setUpdatedAnswer({ ...updatedAnswer, text: e.target.value })}
                                                        placeholder="For the most [recent release] (https://reactjs.org/versions/), the recommended navigation method is by directly pushing onto the history singleton"
                                                        required
                                                        rows='10'
                                                        cols='30'
                                                        style={{ resize: 'none' }}
                                                    />
                                                    {answerTextError && <p className="error-message">{answerTextError}</p>}
                                                </div>
                                                {/* <span className="warning">*indicates mandatory fields</span> */}
                                                <button type="submit">Save</button>
                                                <button type="button" onClick={() => handleCancelEdit(setEditingAnswerId, setUpdatedAnswer)}>Cancel</button>
                                            </div>
                                        </form>}
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
        </>
    );
}

export default AnswerPageProfile;