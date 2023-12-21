import React, { useState } from "react";
// import axios from "axios";
// import AskQuestionPage from "../AskQuestionPage/AskQuestionPage";
import "./TagPageProfile.css"
// import DisplayTags from "../DisplayTags/DisplayTags"
import axios from 'axios';

function TagPageProfile({ tags, setTags, userId, isAdmin }) {

    const numTags = tags.length;

    const [editingTagId, setEditingTagId] = useState(null);
    // const [tags, setTags] = useState([]);
    const [updatedTag, setUpdatedTag] = useState({});

    const handleEditTag = (id) => {
        const uniqueId = tags.find(tag => tag._id === id);
        if (uniqueId) {
            setEditingTagId(id);
            setUpdatedTag(uniqueId);
        } else {
            console.error('Duplicate ids detected. Please ensure each tag has a unique id.');
        }
    };


    const handleUpdateTag = async (id, updatedTag) => {
        try {
            const response = await axios.put(`http://localhost:8000/edittags/${id}`, updatedTag, {
                params: {
                    user_id: userId
                }
            });
    
            const updatedTags = tags.map((tag) => {
                if (tag._id === id) {
                    return response.data; 
                }
                return tag;
            });
            setTags(updatedTags);
            setEditingTagId(null);
        } catch (err) {
            if (err.response && err.response.data.error) {
                alert(err.response.data.error);
            } else {
                console.error(err);
            }
        }
    };
    

    const handleDeleteTag = async (id) => {

        try {
            await axios.delete(`http://localhost:8000/tags/${id}`, {
                params: {
                    user_id: userId
                }
            });
            setTags(tags.filter(tag => tag._id !== id));
        } catch (err) {
            if (err.response && err.response.data.error) {
                alert(err.response.data.error);
            } else {
                console.error(err);
            }
        }
    };

    const handleCancelEdit = (setEditingId, setUpdated) => {
        setEditingId(null);
        setUpdated({});
    };



    return (
        <>
            {<div className="tag-page">
                <div>
                    <div className="tagsHeader">
                        <li>{numTags === 0 ? 'Not yet created' : `${numTags} Tags`}</li>
                        <li>Tags Profile</li>
                    </div>

                    <div className="tag-box-container">
                        {tags.map((tag, index) => {
                            return (
                                <>
                                    <div key={index} className="tag-box">
                                        <a href={`#${tag}`} >{tag.name}</a>
                                        <button onClick={() => handleEditTag(tag._id)}>Edit</button>
                                        <button onClick={() => handleDeleteTag(tag._id)}>Delete</button>
                                        {editingTagId === tag._id &&
                                            <form onSubmit={(e) => {
                                                e.preventDefault();
                                                handleUpdateTag(tag._id, updatedTag);
                                                setUpdatedTag({});
                                            }}>

                                                <input type="text" value={updatedTag.name} onChange={(e) => setUpdatedTag({ ...updatedTag, name: e.target.value })} />
                                                <button type="submit">Save</button>
                                                <button type="button" onClick={() => handleCancelEdit(setEditingTagId, setUpdatedTag)}>Cancel</button>

                                            </form>}
                                    </div>
                                </>
                            );
                        })}
                    </div>
                </div>
            </div>}
        </>
    );
}

export default TagPageProfile;
