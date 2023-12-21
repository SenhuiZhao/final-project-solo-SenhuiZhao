import React, { useState, useEffect } from 'react';
import "./QuestionPageProfile.css"
import AskQuestionPage from '../AskQuestionPage/AskQuestionPage';
// import AnswersPage from '../AnswersPage/AnswersPage';
import axios from 'axios';



// const QUESTIONS_PER_PAGE = 5;

function QuestionPageProfile({ questions,userId, model, setModel, setQuestions, pageTitle, setActiveLink, userInfo, setUserInfo }) {
    // const [questions, setQuestions] = useState([]);
    // const [tags, setTags] = useState([]);
    // const tags = model.tags
    // console.log(questions);
    const [sortType, setSortType] = useState("newest");
    const [showQuestionPage, setShowQuestionPage] = useState(true);
    const [showAskquestionPage, setshowAskquestionPage] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);

    const [tagInput, setTagInput] = useState("");


    // question handle
    const [titleError, setTitleError] = useState("");
    const [textError, setQuestionTestError] = useState("");
    const [tagsError, setTagsError] = useState("");
    const [summaryError, setSummaryError] = useState("");


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


    // const handleAskQuestionClick = () => {
    //     if (!userInfo) {
    //         window.alert("Please login first.")
    //         return;
    //     }
    //     setShowQuestionPage(false);
    //     setshowAskquestionPage(true);
    // };

    useEffect(() => {
        handleSort(sortType);
    }, [model]);


    // Handler function for sorting questions
    function handleSort(type) {
        if (!model.questions) return
        let sortedQuestions;
        if (type === "newest") {
            sortedQuestions = [...questions].sort((a, b) => {
                const dateA = new Date(a.ask_date_time);
                const dateB = new Date(b.ask_date_time);
                // console.log(dateB - dateA)
                return dateB - dateA;
            });
            // console.log('diff',b.ask_date_time - a.ask_date_time)  NaN
        } else if (type === "active") {
            sortedQuestions = [...questions].sort(
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
            sortedQuestions = [...model.questions].filter((q) => q.answers.length === 0);
        }
        setQuestions(sortedQuestions);
        setSortType(type);
    }
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


    const [editingQuestionId, setEditingQuestionId] = useState(null);

    const [updatedQuestion, setUpdatedQuestion] = useState({});


    const handleTagInputChange = (event) => {
        setTagInput(event.target.value);
    };

    const handleSaveQuestion = async (id) => {
        const tagNames = tagInput.split(' ').map(tag => tag.trim());
    
        let tagIds;
        try {
            const { data: fetchedTagIds } = await axios.post('http://localhost:8000/tags/fetchOrCreate', { 
                tags: tagNames, 
                userId: userId, 
                questionId: id 
            });
            tagIds = fetchedTagIds;
        } catch (err) {
            console.error(err);
            return;
        }
    
        try {
            const updatedData = { ...updatedQuestion, tags: tagIds };
            const { data: editedQuestion } = await axios.put(`http://localhost:8000/questions/${id}`, updatedData);
            setQuestions(questions.map(question => question._id === id ? editedQuestion : question));
            setEditingQuestionId(null);
            setUpdatedQuestion({});
            setTagInput("");
        } catch (err) {
            console.error(err);
        }
    }
    

    // const handleSaveQuestion = async (id) => {
    //     const tagNames = tagInput.split(' ').map(tag => tag.trim());

    //     let tagIds;
    //     try {
    //         const { data: fetchedTagIds } = await axios.post('http://localhost:8000/tags/fetchOrCreate', { tags: tagNames });
    //         tagIds = fetchedTagIds;
    //     } catch (err) {
    //         console.error(err);
    //         return;
    //     }

    //     try {
    //         const updatedData = { ...updatedQuestion, tags: tagIds };
    //         const { data: editedQuestion } = await axios.put(`http://localhost:8000/questions/${id}`, updatedData);
    //         setQuestions(questions.map(question => question._id === id ? editedQuestion : question));
    //         setEditingQuestionId(null);
    //         setUpdatedQuestion({});
    //         setTagInput("");
    //     } catch (err) {
    //         console.error(err);
    //     }
    // }
    
    const handleEditQuestion = (id) => {
        const uniqueId = questions.find(question => question._id === id);
        if (uniqueId) {
            setEditingQuestionId(id);
            setUpdatedQuestion(uniqueId);
            setTagInput(uniqueId.tags.map(tag => tag.name).join(' ')); 
        } else {
            console.error('Duplicate ids detected. Please ensure each question has a unique id.');
        }
    };
    



    // const handleEditQuestion = (id) => {
    //     const uniqueId = questions.find(question => question._id === id);
    //     if (uniqueId) {
    //         setEditingQuestionId(id);
    //         setUpdatedQuestion(uniqueId);
    //     } else {
    //         console.error('Duplicate ids detected. Please ensure each question has a unique id.');
    //     }
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

    const handleDeleteQuestion = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/questions/${id}`);
            setQuestions(questions.filter(question => question._id !== id));
            // fetchUserData();
        } catch (err) {
            console.error(err);
        }
    };
    console.log("selectedQuestion", selectedQuestion)

    return (
        <>
            {showQuestionPage &&
                <div className="main-body">
                    {/* Right side of the main body */}
                    <div className="questions-container">
                        <h1>{pageTitle}</h1>
                        {/* <div className="questions-header"> */}
                        {/* <button className="ask-question-btn" onClick={handleAskQuestionClick}>Ask Question</button> */}
                        {/* </div> */}
                        <ul className='total-questions-line'>
                            <li className='total-questions'>
                                {questions.length === 0 ? <h1>Not yet asked a question</h1> : <h1>Total questions asked: {questions.length}</h1>}
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
                                <div key={q._id} className="question-item">
                                    <div className="detailLeft">
                                        {/* <p>
                                            {q.answers.length} {q.answers.length === 1 ? "answer" : "answers"}
                                        </p>
                                        <p> {q.views} views </p>
                                        <p>
                                            {q.votes.length === 1 ? `${q.votes} vote` : `${q.votes.length || 0} votes`}
                                        </p> */}
                                    </div>

                                    <div
                                        key={q.id}
                                        className="question-name"
                                        onClick={() => handleEditQuestion(q._id)}
                                    >
                                        {q.title}
                                        <div className="question-summary">
                                            {/* {q.summary} */}
                                        </div>
                                    </div>
                                    <div className="detailRight">
                                        {formatQuestionMetadata(q)}
                                    </div>

                                    <button onClick={() => handleEditQuestion(q._id)}>Edit</button>
                                    <button onClick={() => handleDeleteQuestion(q._id)}>Delete</button>
                                    {editingQuestionId === q._id &&
                                        <form onSubmit={(e) => {
                                            e.preventDefault();
                                            handleSaveQuestion(q._id, updatedQuestion);
                                        }}>
                                            <h2><label htmlFor="title-input">Question Title*</label></h2>
                                            <input
                                                type="text"
                                                required
                                                value={updatedQuestion.title}
                                                placeholder="Enter your question here..."
                                                onChange={(e) => setUpdatedQuestion({ ...updatedQuestion, title: e.target.value })}
                                            />
                                            {titleError && <p className="error-message">{titleError}</p>}
                                            <div className="form-group">
                                                <h2><label htmlFor="summary-input">Summary*</label></h2>
                                                <textarea
                                                    name="summary"
                                                    required
                                                    rows='5'
                                                    cols='50'
                                                    style={{ resize: 'none' }}
                                                    placeholder="Enter question title (max 140 characters)"
                                                    value={updatedQuestion.summary}
                                                    onChange={(e) => setUpdatedQuestion({ ...updatedQuestion, summary: e.target.value })}
                                                />
                                                {summaryError && <p className="error-message">{summaryError}</p>}
                                            </div>
                                            <div className="form-group">
                                                <h2><label htmlFor="question-input">Question Text*</label></h2>
                                                <textarea
                                                    name="text"
                                                    required
                                                    rows='5'
                                                    cols='50'
                                                    style={{ resize: 'none' }}
                                                    placeholder="Enter your text here..."
                                                    value={updatedQuestion.text}
                                                    onChange={(e) => setUpdatedQuestion({ ...updatedQuestion, text: e.target.value })}
                                                />
                                                {textError && <p className="error-message">{textError}</p>}
                                            </div>
                                            <div className="form-group">
                                                <h2><label htmlFor="tags-input">Tags*</label></h2>
                                                {/* <input
                                                    type="text"
                                                    name="tags"
                                                    maxLength={50}
                                                    required
                                                    placeholder="Enter tags (max 5 tags, each tag max 10 characters)"
                                                    value={updatedQuestion.tags.map(tag => tag.name).join(' ')}
                                                    onChange={(e) => setUpdatedQuestion({ ...updatedQuestion, tags: e.target.value.split(',').map(tag => tag.trim()) })}
                                                /> */}
                                                <input
                                                    type="text"
                                                    name="tags"
                                                    maxLength={50}
                                                    required
                                                    placeholder="Enter tags (max 5 tags, each tag max 10 characters)"
                                                    value={tagInput}
                                                    onChange={handleTagInputChange}
                                                />

                                                {tagsError && <p className="error-message">{tagsError}</p>}
                                            </div>

                                            <button type="submit">Save</button>
                                            <button type="button" onClick={() => setEditingQuestionId(null)}>Cancel</button>
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
            {/* {showAskquestionPage && <AskQuestionPage selectedQuestion={selectedQuestion} model={model} setModel={setModel} setQuestions={setQuestions} questions={questions} setActiveLink={setActiveLink} userInfo={userInfo} setUserInfo={setUserInfo} />} */}
            {/* {selectedQuestion && <AnswersPage selectedQuestion={selectedQuestion} model={model} setModel={setModel} questions={questions} setQuestions={setQuestions} setSelectedQuestion={setSelectedQuestion} setActiveLink={setActiveLink} userInfo={userInfo} setUserInfo={setUserInfo} />} */}
        </>
    );
}

export default QuestionPageProfile;