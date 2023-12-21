import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { LoginAndSignupButtons } from '../Banner/Banner';
// import Nav from '../Nav/Nav';
import TagPageProfile from '../TagPageProfile/TagPageProfile';
import QuestionPageProfile from '../QuestionPageProfile/QuestionPageProfile';
import NavProfile from '../NavProfile/NavProfile';
import AnswerPageProfile from '../AnswerPageProfile/AnswerPageProfile';
import './ProfilePage.css'
// import './ProfilePage.css'

const ProfilePage = ({ userInfo }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [tags, setTags] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [allUsers, setAllUsers] = useState(null);

    const [comments, setComments] = useState([]);
    // const [updatedComment, setUpdatedComment] = useState({});
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null);

    const [activeLink, setActiveLink] = useState("questions");
    const [model, setModel] = useState("")

    console.log("userInfo", userInfo) //undefine
    console.log("ididid", id)// 645e67ebe60def33a6e867e5
    // console.log(`http://localhost:8000/users/${id}`)
    useEffect(() => {
        fetchUserData();
    }, []);

    useEffect(() => {
        fetchUserData(id);
        setActiveLink("questions");
    }, [id]);

    // const fetchUserData = async () => {
    //     setIsAdmin(false)
    //     setError(null)
    //     try {
    //         const { data: user } = await axios.get(`http://localhost:8000/users/${id}`);
    //         const { data: questions } = await axios.get(`http://localhost:8000/questions?user_id=${id}`);
    //         const { data: tags } = await axios.get(`http://localhost:8000/tags?user_id=${id}`);
    //         const { data: answers } = await axios.get(`http://localhost:8000/answers?user_id=${id}`);
    //         // const { data: comments } = await axios.get('http://localhost:8000/comments');
    //         const { data: comments } = await axios.get(`http://localhost:8000/comments?user_id=${id}`);

    //         const { data: model } = await axios.get('http://localhost:8000/model')

    //         setModel(model);
    //         setComments(comments);
    //         setUser(user);
    //         setQuestions(questions);
    //         setTags(tags);
    //         setAnswers(answers);
    //         if (user.isAdmin) {
    //             const { data: allUsers } = await axios.get('http://localhost:8000/users');
    //             setIsAdmin(true)
    //             setAllUsers(allUsers);
    //         }

    //         setIsLoading(false)
    //     } catch (err) {
    //         setError(err)
    //         console.error(err);
    //     }
    // };

    const fetchUserData = async () => {
        setIsAdmin(false);
        setError(null);
        try {
            const { data: user } = await axios.get(`http://localhost:8000/users/${id}`);

            let isAdmin = user.isAdmin;

            let questionsUrl = isAdmin ? 'http://localhost:8000/questions' : `http://localhost:8000/questions?user_id=${id}`;
            let tagsUrl = isAdmin ? 'http://localhost:8000/tags' : `http://localhost:8000/tags?user_id=${id}`;
            let answersUrl = isAdmin ? 'http://localhost:8000/answers' : `http://localhost:8000/answers?user_id=${id}`;
            let commentsUrl = isAdmin ? 'http://localhost:8000/comments' : `http://localhost:8000/comments?user_id=${id}`;

            const { data: questions } = await axios.get(questionsUrl);
            const { data: tags } = await axios.get(tagsUrl);
            const { data: answers } = await axios.get(answersUrl);
            const { data: comments } = await axios.get(commentsUrl);

            const { data: model } = await axios.get('http://localhost:8000/model');

            setModel(model);
            setComments(comments);
            setUser(user);
            setQuestions(questions);
            setTags(tags);
            setAnswers(answers);

            if (isAdmin) {
                const { data: allUsers } = await axios.get('http://localhost:8000/users');
                setIsAdmin(true);
                setAllUsers(allUsers);
                setActiveLink("allUsers")
            }

            setIsLoading(false);
        } catch (err) {
            setError(err);
            console.error(err);
        }
    };


    console.log("user", user)
    console.log("allUser", allUsers)
    console.log("isAdmin", isAdmin)
    console.log("questions---", questions)
    console.log("tags", tags)
    console.log("answers", answers)
    console.log("comments", comments)


    // const handleUserClick = (userId) => {
    //     navigate(`/welcome/HomePage/ProfilePage/${userId}`);
    // };


    // const handleDeleteUser = async (id) => {
    //     if (window.confirm('Are you sure you want to delete this user?')) {
    //         try {
    //             await axios.delete(`http://localhost:8000/users/${id}`);
    //             fetchUserData();
    //         } catch (err) {
    //             console.error(err);
    //         }
    //     }
    // };

    const handleConfirmDeleteUser = (id) => {
        if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            handleDeleteUser(id);
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm('Confirm deleting this user?')) {
            try {
                const response = await axios.delete(`http://localhost:8000/users/${id}`);
                console.log(response.data);
                fetchUserData();
            } catch (err) {
                console.error(err);
                if (err.response) {
                    console.error(err.response.data);
                    console.error(err.response.status);
                    console.error(err.response.headers);
                }
            }
        }
    };



    const handleSignOut = () => {
        axios.get('http://localhost:8000/signout')
            .then(() => {
                navigate('/');
            })
            .catch((error) => {
                console.log(error);
            });
    }

    // const handleCancelEdit = (setEditingId, setUpdated) => {
    //     setEditingId(null);
    //     setUpdated({});
    // };
    function computeTimePassed(date) {
        const now = new Date();
        const then = new Date(date);
        const diffInMilliseconds = Math.abs(now - then);
        const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

        if (diffInDays < 30) {
            return `${diffInDays} days ago`;
        } else if (diffInDays < 365) {
            return `${Math.floor(diffInDays / 30)} months ago`;
        } else {
            return `${Math.floor(diffInDays / 365)} years ago`;
        }
    }

    return (
        <>
            {isLoading && <h1>Loading...</h1>}
            {error && <h1>{error}</h1>}
            {user &&
                <div className="profile">
                    <div className="banner">
                        <div className="text-end">
                            {/* <Link to={`/welcome/HomePage/ProfilePage/${id}`}><input type="button" className='btn-outline-light' value={`${user.username}'s Profile Page`} /></Link> */}
                            <Link to={`/welcome/HomePage/`}><input type="button" className='btn-outline-light' value={`${user.username}'s Profile Page`} /></Link>
                            <input type="button" className='btn-warning' value="Sign-out" onClick={handleSignOut} />
                        </div>
                        <h1>Fake Stack Overflow</h1>
                    </div>
                    <div className="user-info">
                        <p className="user-info__item">Member since: {user.created_at && new Date(user.created_at).toLocaleDateString()}</p>
                        <p className="user-info__item">The length of time the user has been a member of fake stack overflow: {user.created_at && computeTimePassed(user.created_at)}</p>
                        <p className="user-info__item user-info__item--highlight">Reputation: {user.reputation}</p>
                    </div>

                    <NavProfile setActiveLink={setActiveLink} activeLink={activeLink} isAdmin={isAdmin} />

                    <div className="mainRight">
                       {activeLink === "allUsers" && isAdmin ? (
    <div className="allUsers">
        <h2>All Users</h2>
        {allUsers.length > 0 ? (
            <ul>
                {allUsers.map((user) => (
                    <li key={user._id}>
                        <Link to={`/welcome/HomePage/ProfilePage/${user._id}`}>{user.username}</Link>
                        <button onClick={() => handleConfirmDeleteUser(user._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        ) : (
            <p>No users in the system.</p>
        )}
    </div>
) : activeLink === "questions" ? (
    <QuestionPageProfile questions={questions} model={model} setQuestions={setQuestions} userId = {id}/>
) : activeLink === "tags" ? (
    <TagPageProfile tags={tags} setTags={setTags} userId = {id} isAdmin={isAdmin}/>
) : activeLink === "answers" ? (
    <AnswerPageProfile answers={answers} model={model} setQuestions={setQuestions} setAnswers={setAnswers} />
) : null}

                    </div>
                </div>
            }
        </>
    );
};

export default ProfilePage;