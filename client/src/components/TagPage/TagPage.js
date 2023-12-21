import React, { useState } from "react";
// import axios from "axios";
import AskQuestionPage from "../AskQuestionPage/AskQuestionPage";
import "./TagPage.css"
import DisplayTags from "../DisplayTags/DisplayTags"


function TagPage({ model, setModel, questions, setQuestions, setActiveLink, userInfo, setUserInfo }) {
    // const [activeLink, setActiveLink] = useState("tags");
    const [showTagPage, setShowTagPage] = useState(true);
    const [showAskquestionPage, setshowAskquestionPage] = useState(false);
    const [showDisplayTags, setshowDisplayTags] = useState(false)

    const [displayedQuestionsByTag, setDisplayedQuestionsByTag] = useState([]);
    const [pageTitle, setPageTitle] = useState("");


    const handleAskQuestionClick = () => {
        if (!userInfo){
            window.alert("Please login first.")
            return;
        }
        setShowTagPage(false);
        setshowAskquestionPage(true);
        // setclaseNameN("tags-container hidden");
    };

    const tags = [...new Set(model.questions.flatMap((q) => q.tags))];
    const numTags = tags.length;
    var foundTagName = '';

    const handleTagClick = (tid) => {

        const clickedTag = model.tags.find(tag => tag._id === tid);

        // Filter the questions based on the clicked tag
        const filteredQuestions = model.questions.filter(question => {
            return question.tags.includes(clickedTag._id);
        });

        setPageTitle("Result By Click The Tag Name");
        setDisplayedQuestionsByTag(filteredQuestions);
        setShowTagPage(false);
        setshowDisplayTags(true);
    }

    // let findTagName = (tid) => {
    //     // console.log(tid)
    //     foundTagName = model.tags.filter((t) => t._id === tid)[0].name;
    //     // console.log("tname")
    //     // console.log({findTagName})
    //     return foundTagName;
    // }

    let findTagName = (tid) => {
        // console.log(tid)
        let tag = model.tags.filter((t) => t._id === tid)[0];
        if (tag) {
            foundTagName = tag.name;
            // console.log("tname")
            // console.log({findTagName})
            return foundTagName;
        }
        else {
            console.log("Tag not found for id: " + tid);
            return '';
        }
    }
    



    return (
        <>
            {showTagPage && <div className="tag-page">
                {/* All tags on the right side */}
                <div>
                    <div className="tagsHeader">
                        <li>{numTags} Tags</li>
                        <li>All Tags</li>
                        <li><button className="ask-question-button" onClick={handleAskQuestionClick}>Ask Question</button> </li>
                    </div>

                    <div className="tag-box-container">
                        {tags.map((tag, index) => {
                            const numQuestions = tag ? model.questions.filter((q) => q.tags.includes(tag)).length : "0";

                            return (
                                <div key={index} className="tag-box">
                                    <a href={`#${tag}`} onClick={() => handleTagClick(tag)}>{findTagName(tag)}</a>
                                    <div>{numQuestions} questions</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>}
            {/* {showAskquestionPage && <AskQuestionPage />} */}
            {showAskquestionPage && <AskQuestionPage model={model} setModel={setModel} setQuestions={setQuestions} questions={questions} setActiveLink={setActiveLink} userInfo={userInfo} setUserInfo={setUserInfo}/>}
            {showDisplayTags && <DisplayTags model={model} setModel={setModel} setQuestions={setDisplayedQuestionsByTag} questions={displayedQuestionsByTag} pageTitle={pageTitle} setActiveLink={setActiveLink} userInfo={userInfo} setUserInfo={setUserInfo}/>}
        </>
    );
}

export default TagPage;
