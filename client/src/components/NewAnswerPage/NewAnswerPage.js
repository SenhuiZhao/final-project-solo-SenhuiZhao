import React, { useEffect, useState } from "react";
import AnswersPage from "../AnswersPage/AnswersPage";
import "./NewAnswerPage.css"
import axios from "axios";

export default function NewAnswer({ model, selectedQuestion, setModel, questions, setQuestions, setSelectedQuestion, userInfo, setUserInfo }) {
    const [answerText, setAnswerText] = useState("");
    const [answerTextError, setAnswerTextError] = useState("");
    const [showNewAnswerPage, setShowNewAnswerPage] = useState(true);
    const [showAnswersPage, setShowAnswersPage] = useState(false);
    const [serverError, setServerError] = useState("");

    const handleAnswerTextChange = (event) => {
        const value = event.target.value;
        setAnswerText(value);
        if (value === "") {
            setAnswerTextError("Answer text cannot be empty");
        } else {
            setAnswerTextError("");
        }
    };

    const handleSubmitAnswer = async () => {
        if (!answerText) {
            if (!answerText) setAnswerTextError("Answer text cannot be empty");
            return;
        }

        const regex = /\(([^)]*)\)/;
        if (regex.test(answerText)) {
            const matches = answerText.match(regex);
            const link = matches[1];
            if (link.length === 0) {
                setAnswerTextError("Invalid hyperlink URL. The URL cannot be empty");
                return;
            }
            if (!link.startsWith("http://") && !link.startsWith("https://")) {
                setAnswerTextError("Invalid hyperlink URL. The URL should begin with 'http://' or 'https://'");
                return;
            }
        }

        const newAnswer = {
            text: answerText,
            ans_date_time: new Date(),
            ans_by: userInfo._id
        };

        try {
            const res = await axios.post('http://localhost:8000/addanswer', newAnswer)
            const newAnswerId = res.data._id
            const updatedData = {
                ...selectedQuestion,
                answers: [...selectedQuestion.answers, newAnswerId],
            };

            const newQuestionData = await axios.put(`http://localhost:8000/addAnswerToQuestion/${selectedQuestion._id}`, updatedData)

            setSelectedQuestion(newQuestionData.data)
            const updateModel = await axios.get('http://localhost:8000/model')
            setModel(updateModel.data);
            setQuestions(updateModel.data.questions)

            setAnswerText('');
            setAnswerTextError('');
            setShowNewAnswerPage(false);
            setShowAnswersPage(true);
        } catch (error) {
            setServerError('Failed to post the answer. Please try again later.');
        }
    }

    const disableButton = answerTextError !== "";

    return (
        <>
            {serverError && <p className="error-message">{serverError}</p>}
            {showNewAnswerPage && (
                <div className="newQuestion-body">
                    <div className="ans-form-group">
                        <label htmlFor="answer-input">Answer Text*</label><br></br>
                        <textarea
                            id="answer-input"
                            value={answerText}
                            onChange={handleAnswerTextChange}
                            placeholder="For the most [recent release] (https://reactjs.org/versions/), the recommended navigation method is by directly pushing onto the history singleton"
                            required
                            rows='10'
                            cols='30'
                            style={{ resize: 'none' }}
                        />
                        {answerTextError && <p className="error-message">{answerTextError}</p>}
                    </div>
                    <button className="post-question-button" onClick={handleSubmitAnswer} disabled={disableButton}>
                        Post Answer
                    </button>
                    <span className="warning">*indicates mandatory fields</span>
                </div>
            )}
            {showAnswersPage && (
                <AnswersPage
                    model={model}
                    selectedQuestion={selectedQuestion}
                    setModel={setModel}
                    questions={questions}
                    setQuestions={setQuestions}
                    setSelectedQuestion={setSelectedQuestion}
                    userInfo={userInfo} 
                    setUserInfo={setUserInfo}
                />
            )}
        </>
    );
}
