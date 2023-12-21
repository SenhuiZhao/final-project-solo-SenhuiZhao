import React, { useEffect, useState } from "react";
import QuestionPage from "../QuestionPage/QuestionPage";
import "./AskQuestionPage.css"
import axios from "axios";

function AskQuestionPage({ model, setModel, questions, setQuestions, setActiveLink, userInfo, setUserInfo }) {
    const [showAskquestionPage, setshowAskquestionPage] = useState(true);
    const [showQuestionPage, setShowQuestionPage] = useState(false);

    const [newQuestion, setNewQuestions] = useState([]);
    const [pageTitle, setPageTitle] = useState("All Questions");

    const [title, setTitle] = useState("");
    const [text, setQuestionTest] = useState("");
    const [tags, setTags] = useState("");
    const [summary, setSummary] = useState("");

    const [titleError, setTitleError] = useState("");
    const [textError, setQuestionTestError] = useState("");
    const [tagsError, setTagsError] = useState("");
    const [summaryError, setSummaryError] = useState("");

    useEffect(() => {
        axios.get('http://localhost:8000/test').then(res => {
            setUserInfo(res.data)
            console.log(res)
        })
    }, [model])


    const handleTitleChange = (event) => {
        const value = event.target.value;
        setTitle(value);

    };

    const handletextChange = (event) => {
        const value = event.target.value;
        setQuestionTest(value);
    };

    const handleTagsChange = (event) => {
        const value = event.target.value;
        setTags(value);
    };

    const handleUserSummaryChange = (event) => {
        const value = event.target.value;
        setSummary(value);
    };



    const handlePostQuestionClick = (event) => {
        event.preventDefault();
        let error = false
        if (title || text || tags || summary) {
            setTitleError("");
            setQuestionTestError("");
            setTagsError("");
            setSummaryError("");
        }

        if (title.length > 50) {
            setTitleError("Title cannot be more than 50 characters");
            error = true;
        }

        if (summary.length > 140) {
            setSummaryError("Summary cannot be more than 140 characters");
            error = true;
        }

        if (!title || !text || !tags || !summary) {
            if (!title) setTitleError("Question title cannot be empty");
            if (!text) setQuestionTestError("Question text cannot be empty");
            if (!tags) setTagsError("Tags cannot be empty");
            if (!summary) setSummaryError("summary cannot be empty");
            error = true;
        }

        const regex = /\(([^)]*)\)/;
        if (regex.test(text)) {
            const matches = text.match(regex);
            const link = matches[1];
            if (link.length === 0) {
                setQuestionTestError("Invalid hyperlink URL. The URL cannot be empty");
                error = true;
            }
            else if (!link.startsWith("http://") && !link.startsWith("https://")) {
                setQuestionTestError("Invalid hyperlink URL. The URL should begin with 'http://' or 'https://'");
                error = true;
            }
        }


        // if (tags.length > 0) {
        //     const tagsList = tags.split(" ");
        //     if (tagsList.length > 5) {
        //         setTagsError("Cannot have more than 5 tags");
        //         error = true;
        //     } else {
        //         // let hasError = false;
        //         for (let i = 0; i < tagsList.length; i++) {
        //             const tag = tagsList[i];
        //             if (tag.length > 10) {
        //                 setTagsError("Tag length cannot be more than 10 characters");
        //                 // hasError = true;
        //                 error = true;
        //             }
        //         }
        //     }
        // }

        if (tags.length > 0) {
            const tagsList = tags.split(" ");
            if (tagsList.length > 5) {
                setTagsError("Cannot have more than 5 tags");
                error = true;
            } else {
                for (let i = 0; i < tagsList.length; i++) {
                    const tag = tagsList[i];
                    if (tag.length > 10) {
                        setTagsError("Tag length cannot be more than 10 characters");
                        error = true;
                    }
                    const existingTag = model.tags.find(t => t.name === tag);
                    if (!existingTag && userInfo.reputation < 50) {
                        setTagsError("You need at least 50 reputation points to create a new tag");
                        error = true;
                    }
                }
            }
        }


        if (error) return;
        console.log("title", title)
        console.log("text", text)
        // console.log("asked_by",asked_by)
        setActiveLink('questions');
        const tagsArray = tags.split(" ").map(tag => tag.toLowerCase());
        const newTags = { name: tagsArray }
        async function fetchData() {
            var tagsId;
            console.log("tags", newTags)
            await axios.post('http://localhost:8000/addTags', { name: tagsArray, userInfo })
                .then(res => {
                    console.log("tagsres: ", res)
                    tagsId = res.data.map(t => t._id)
                    console.log('tagsId', tagsId)
                }).catch(err => {
                    if (err.response.status === 403) {
                        setTagsError(err.response.data.error);
                        return;
                    }
                    console.log(err);
                });


            await axios.post('http://localhost:8000/newquestion',
                {
                    title: title,
                    summary: summary,
                    text: text,
                    tags: tagsId,
                    asked_by: userInfo._id
                })
                .then(res => {
                    setNewQuestions(res.data);
                    console.log("new", newQuestion)
                    console.log("New Question added")
                })
                .catch(err => {
                    console.log(err);
                });

            await axios.get('http://localhost:8000/model')
                .then(response => {
                    setModel(response.data);
                    setQuestions(response.data.questions)
                })
                .catch(error => {
                    console.error('Failed to fetch questions:', error);
                });

        }
        fetchData().then(() => {
            setTitle('');
            setQuestionTest('');
            setTags('');
            setSummary('');
            setshowAskquestionPage(false);
            setShowQuestionPage(true);
            // setActiveLink('questions');
        });
    };

    return (
        <>
            {showAskquestionPage &&
                <div className="main-body">
                    <form className="new-question-form">
                        <h2><label htmlFor="title-input">Question Title*</label></h2>
                        <p><i>Limit title to 50 characters or less</i></p>
                        <input
                            type="text"
                            id="title-input"
                            name="title"
                            // maxLength={100}
                            required
                            placeholder="Enter question title (max 50 characters)"
                            value={title}
                            onChange={handleTitleChange}
                        />
                        {titleError && <p className="error-message">{titleError}</p>}

                        <div className="form-group">
                            <h2><label htmlFor="summary-input">Summary*</label></h2>
                            <p><i>Add Summary</i></p>
                            <textarea
                                id="summary-input"
                                name="summary"
                                required
                                rows='5'
                                cols='30'
                                style={{ resize: 'none' }}
                                placeholder="Enter question title (max 140 characters)"
                                value={summary}
                                onChange={handleUserSummaryChange}
                            />
                            {summaryError && (
                                <p className="error-message">{summaryError}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <h2><label htmlFor="question-input">Question Text*</label></h2>
                            <p><i>Add detials</i></p>
                            <textarea
                                id="question-input"
                                name="text"
                                required
                                rows='8'
                                cols='30'
                                style={{ resize: 'none' }}
                                placeholder="Enter your text here..."
                                value={text}
                                onChange={handletextChange}
                            />
                            {textError && (
                                <p className="error-message">{textError}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <h2><label htmlFor="tags-input">Tags*</label></h2>
                            <p><i>Add keywords sepreated by whitespace</i></p>
                            <input
                                type="text"
                                id="tags-input"
                                name="tags"
                                maxLength={50}
                                required
                                placeholder="Enter tags (max 5 tags, each tag max 10 characters)"
                                value={tags}
                                onChange={handleTagsChange}
                            />
                            {tagsError && <p className="error-message">{tagsError}</p>}
                        </div>

                        <button type="submit"
                            className="post-question-button"
                            // onClick={handlePostQuestionClick} disabled={disableButton}>
                            onClick={handlePostQuestionClick}>
                            Post Question
                        </button>
                        <span className="warning">* indicates mandatory fields</span>

                    </form>
                </div>
            }
            {/* {showQuestionPage && <QuestionPage model={model} questions={questions} setQuestions={setQuestions} pageTitle={pageTitle} />} */}
            {showQuestionPage && <QuestionPage model={model} setModel={setModel} setQuestions={setQuestions} questions={questions} pageTitle={pageTitle} setActiveLink={setActiveLink} userInfo={userInfo} setUserInfo={setUserInfo}/>}
        </>
    );
}
export default AskQuestionPage;
