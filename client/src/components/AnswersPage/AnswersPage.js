
import { useState, useEffect } from "react";
import axios from "axios";
import AskQuestionPage from "../AskQuestionPage/AskQuestionPage";
import "./AnswersPage.css"
import NewAnswer from "../NewAnswerPage/NewAnswerPage";
import NewComment from "../NewComment/NewComment";

// function Votes({ selectedQuestion, userInfo }) {
    
    
//     const [questionVotes, setQuestionVotes] = useState(selectedQuestion.votes || []);


//     useEffect(() => {
//         const fetchVotes = async () => {
//             const res = await axios.get('http://localhost:8000/question/' + selectedQuestion._id);
//             setQuestionVotes(res.data.votes);
//         };
//         fetchVotes();
//     }, [selectedQuestion._id]);

//     const vote = async (type) => {
//         if (userInfo == null) {
//             window.alert('You must be logged in to vote.');
//             return;
//         }
//         if (userInfo.reputation < 50) {
//             window.alert('You need at least 50 reputation to vote.');
//             return;
//         }
//         let repChange = 0;
//         // const exist = questionVotes ? questionVotes.find(v => v.vote_by === userInfo._id) : null;
//         // if (exist && exist.type === type) {
//         //     window.alert('You have already voted this way on this item.');
//         //     return;
//         // }
//         // if (exist) {
//         //     repChange -= exist.type === 'upvote' ? 5 : -10;
//         //     setQuestionVotes(prevVotes => prevVotes.filter(v => v._id !== exist._id));
//         // }
//         repChange += type === 'upvote' ? 5 : -10;
//         await axios.put('http://localhost:8000/reputation/' + userInfo._id, { reputation: repChange });
//         let res = await axios.post('http://localhost:8000/vote', { type: type, question_id: selectedQuestion._id, vote_by: userInfo._id });
//         let newVotes = questionVotes ? [...questionVotes, res.data] : [res.data];
//         await axios.put('http://localhost:8000/question/' + selectedQuestion._id, { votes: newVotes });
//         let newQuestionVote = await axios.get('http://localhost:8000/question/' + selectedQuestion._id);
//         setQuestionVotes(newQuestionVote.data.votes);
//     };
    
//     return (
//         <div className="votination">
//             <button disabled={!userInfo} className="upVote-btn" type='button'
//                 onClick={() => vote('upvote')}>
//                 {(questionVotes ? questionVotes.filter(v => v.type === 'upvote') : []).length} upvote
//             </button>

//             <button disabled={!userInfo} className="downVote-btn" type='button'
//                 onClick={() => vote('downvote')}>
//                 {(questionVotes ? questionVotes.filter(v => v.type === 'downvote') : []).length} downvote
//             </button>
//         </div>
//     );
// }

function Votes({ item, userInfo, itemType }) {
    const [votes, setVotes] = useState(item.votes || []);

    useEffect(() => {
        const fetchVotes = async () => {
            const res = await axios.get(`http://localhost:8000/${itemType}/` + item._id);
            setVotes(res.data.votes);
        };
        fetchVotes();
    }, [item._id, itemType]);

    const vote = async (type) => {
        if (userInfo == null) {
            window.alert('You must be logged in to vote.');
            return;
        }
        if (userInfo.reputation < 50) {
            window.alert('You need at least 50 reputation to vote.');
            return;
        }
        let repChange = 0;
        repChange += type === 'upvote' ? 5 : -10;
        await axios.put('http://localhost:8000/reputation/' + userInfo._id, { reputation: repChange });
        let res = await axios.post('http://localhost:8000/vote', { type: type, [`${itemType}_id`]: item._id, vote_by: userInfo._id });
        let newVotes = votes ? [...votes, res.data] : [res.data];
        await axios.put(`http://localhost:8000/${itemType}/` + item._id, { votes: newVotes });
        let newItemVote = await axios.get(`http://localhost:8000/${itemType}/` + item._id);
        setVotes(newItemVote.data.votes);
    };

    return (
        <div className="votination">
            <button disabled={!userInfo} className="upVote-btn" type='button'
                onClick={() => vote('upvote')}>
                {(votes ? votes.filter(v => v.type === 'upvote') : []).length} upvote
            </button>
            <button disabled={!userInfo} className="downVote-btn" type='button'
                onClick={() => vote('downvote')}>
                {(votes ? votes.filter(v => v.type === 'downvote') : []).length} downvote
            </button>
        </div>
    );
}



export default function AnswersPage({ model, selectedQuestion, setModel, setQuestions, setSelectedQuestion, questions, setActiveLink, userInfo, setUserInfo }) {
    const [showAnswersPage, setshowAnswersPage] = useState(true);
    const [showAskQuestionPage, setShowAskQuestionPage] = useState(false);
    const [showNewAnswerPage, setShowNewAnswerPage] = useState(false)

    const [views, setViews] = useState(selectedQuestion.views);
    const [answers, setAnswers] = useState(selectedQuestion.answers);

    const [error, setError] = useState(null);
    const tags = model.tags;

    useEffect(() => {
        setViews(views + 1);
        const fetchData = async () => {
            try {
                const updatedData = {
                    ...selectedQuestion,
                    views: views + 1,
                };
                axios.put(`http://localhost:8000/incrementView/${selectedQuestion._id}`, updatedData)
                    .then(res => {
                        console.log("update")
                    });

                axios.get('http://localhost:8000/model')
                    .then(response => {
                        setModel(response.data);
                        setQuestions(response.data.questions)
                    })
                    .catch(error => {
                        console.error('Failed to fetch questions:', error);
                    });
            } catch (error) {
                setError('Failed to fetch data');
            }
        };
        fetchData();
    }, [selectedQuestion])


    // function handleSort() {
    //     let sortedQuestions;
    //     sortedQuestions = [...selectedQuestion.answers].sort((a, b) => {
    //         const dateA = new Date(a.ans_date_time);
    //         const dateB = new Date(b.ans_date_time);
    //         return dateB - dateA;
    //     });
    //     setAnswers(sortedQuestions)
    // }





    const handleAnswerQuestionClick = () => {
        if (!userInfo) {
            window.alert("Please login first.")
            return;
        }
        setShowAskQuestionPage(false)
        setshowAnswersPage(false)
        setShowNewAnswerPage(true)
    };

    function formatQuestionMetadata(q) {
        const now = new Date();
        const askDate = new Date(q.ask_date_time);
        const timeDiff = now - askDate;

        const getUsername = (userId) => {
            const user = model.user.find(user => user._id === userId);
            return user
                ? user.username : 'Unknown user';
        }

        const question_asked_by = getUsername(q.asked_by)

        if (timeDiff < 60 * 1000) { // less than 1 minute
            return (<div>
                <span className="redColor">{question_asked_by} </span><br></br>
                <span className="grayColor">asked {Math.floor(timeDiff / 1000)} seconds ago </span>
            </div>);
        } else if (timeDiff < 60 * 60 * 1000) {
            return (<div>
                <span className="redColor">{question_asked_by} </span><br></br>
                <span className="grayColor">asked {Math.floor(timeDiff / (60 * 1000))} minutes ago</span>
            </div>);
        } else if (timeDiff < 24 * 60 * 60 * 1000) {
            return (<div>
                <span className="redColor">{question_asked_by} </span><br></br>
                <span className="grayColor">asked {Math.floor(timeDiff / (60 * 60 * 1000))} hours ago</span>
            </div>);
        } else if (now.getFullYear() === askDate.getFullYear()) {
            return (<div>
                <span className="redColor">{question_asked_by} </span><br></br>
                <span className="grayColor">asked {askDate.toLocaleDateString('default', { month: 'short', day: 'numeric' })} at {askDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>);
        } else {
            return (<div>
                <span className="redColor">{question_asked_by} </span><br></br>
                <span className="grayColor">asked {askDate.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })} at {askDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>);
        }
    }

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

    const handleAskQuestionClick = () => {
        if (!userInfo) {
            window.alert("Please login first.")
            return;
        }
        setShowAskQuestionPage(true);
        setshowAnswersPage(false);
    };

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

    const startQuestionIndex = (currentPage - 1) * ANSWERS_PER_PAGE;
    const endQuestionIndex = startQuestionIndex + ANSWERS_PER_PAGE;
    const answersToDisplay = answers.slice(startQuestionIndex, endQuestionIndex);

    //debug
    console.log("answersToDisplay", answersToDisplay)
    answersToDisplay.map(answer => {
        const ans = model.answers.find(a => a._id === answer);
        ans.comments.map(commentId => {
            const comment = model.comments.find(c => c._id === commentId);
            console.log('Single Comment:', comment);
        })
    })
    console.log('comments', model.comments)


    return (
        <>{error && <p>{error}</p>}
            {showAnswersPage &&
                <div className="main-body">
                    <div className="answer-header-session">
                        <div className="question-header-name">
                            <li className="answer_page_answer_number">{answers.length} {answers.length === 1 ? "answer" : "answers"}</li>
                            <li className="answer_page_title">{selectedQuestion.title}</li>
                            <li className="answer_page_ask">
                                <button className="answer_page_ask_question_btn" onClick={handleAskQuestionClick}>
                                    Ask Question
                                </button>
                            </li>
                        </div>
                    </div>
                    <div className="question-metadata">
                        <div className="answer_page_view">{views} views</div>
                        <div className="answer_page_answer">
                            {selectedQuestion.text.split(/\s+/).map((word, index) => {
                                if (word.match(/^(https?|ftp):\/\/\S+$/)) {
                                    return (
                                        <a key={index} href={word} target="_blank" rel="noopener noreferrer">
                                            {word}
                                        </a>
                                    );
                                } else if (word.includes("(") && word.includes(")")) {
                                    const start = word.indexOf("[") + 1;
                                    const end = word.indexOf("]");
                                    const linkText = word.slice(start, end);
                                    const url = word.slice(word.indexOf("(") + 1, word.indexOf(")"));
                                    if (url.match(/^(https?|ftp):\/\/\S+$/)) {
                                        return (
                                            <a key={index} href={url} target="_blank" rel="noopener noreferrer">
                                                {linkText}
                                            </a>
                                        );
                                    } else {
                                        return <span key={index}>{word} </span>;
                                    }
                                } else {
                                    return <span key={index}>{word} </span>;
                                }
                            })}
                        </div>
                        <div className="answer_page_author">
                            {formatQuestionMetadata(selectedQuestion)}
                        </div>
                        <p className="tagsInAns">
                            {selectedQuestion.tags.map((tagId, index) => (
                                <span key={tagId} className="tagsBg">
                                    {tags.map((tag) => (tag._id) === tagId ? tag.name : "")}
                                </span>
                            ))}
                        </p>
                        {/* <Votes selectedQuestion={selectedQuestion} userInfo={userInfo} /> */}
                        <Votes item={selectedQuestion} userInfo={userInfo} itemType="question" />

                        <div className="answer-item">
                            <NewComment answerId={selectedQuestion._id} userId={userInfo._id} commentType="question" />
                        </div>
                    </div>
                    <div className="answers-list">
                        {answers.length > 0 ? (
                            answers
                                .sort((a, b) => new Date(b.ans_date_time) - new Date(a.ans_date_time))
                                .map(answer => {
                                    const ans = model.answers.find(a => a._id === answer);
                                    return ans ? (
                                        <div key={ans._id} className="answer-item">

                                            <div className="answer_text">
                                                {ans.text.split(/\s+/).map((word, index) => {
                                                    if (word.match(/^(https?|ftp):\/\/\S+$/)) {
                                                        return (
                                                            <a key={index} href={word} target="_blank" rel="noopener noreferrer">
                                                                {word}
                                                            </a>
                                                        );
                                                    } else if (word.includes("(") && word.includes(")")) {
                                                        const start = word.indexOf("[") + 1;
                                                        const end = word.indexOf("]");
                                                        const linkText = word.slice(start, end);
                                                        const url = word.slice(word.indexOf("(") + 1, word.indexOf(")"));
                                                        if (url.match(/^(https?|ftp):\/\/\S+$/)) {
                                                            return (
                                                                <a key={index} href={url} target="_blank" rel="noopener noreferrer">
                                                                    {linkText}
                                                                </a>
                                                            );
                                                        } else {
                                                            return <span key={index}>{word} </span>;
                                                        }
                                                    } else {
                                                        return <span key={index}>{word} </span>;
                                                    }
                                                })}
                                            </div>
                                            <div className="metadata">
                                                {formatAnswerQuestionMetadata(ans)}
                                            </div>
                                            {/* <Votes selectedQuestion={selectedQuestion} userInfo={userInfo} /> */}
                                            <Votes item={ans} userInfo={userInfo} itemType="answer" />

                                            <div className="comments">
                                                {/* <Comments comments={ans.comments.map(commentId => model.comments.find(c => c._id === commentId)).filter(Boolean)} /> */}
                                                {/* <Comments answerId={ans._id} comments={model.comments} /> */}
                                                <NewComment answerId={ans._id} userId={userInfo._id} commentType="answer" />
                                            </div>
                                        </div>
                                    ) : null;
                                })
                        ) : (
                            <p>No answers yet. Be the first one to answer!</p>
                        )}
                        {totalPages > 1 && (
                            <div className="pagination fixed-button-wrapperrr">
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
                    <div className="fixed-button-wrapper">
                        <button className="answer-question-btn" onClick={handleAnswerQuestionClick}>Answer Question</button>
                    </div>
                </div>}
            {showNewAnswerPage && <NewAnswer model={model} selectedQuestion={selectedQuestion} setModel={setModel} setQuestions={setQuestions} setSelectedQuestion={setSelectedQuestion} questions={questions} userInfo={userInfo} setUserInfo={setUserInfo} />}
            {showAskQuestionPage && <AskQuestionPage model={model} setModel={setModel} setQuestions={setQuestions} questions={questions} setActiveLink={setActiveLink} userInfo={userInfo} setUserInfo={setUserInfo} />}
        </>
    );
}



