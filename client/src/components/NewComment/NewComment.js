import { useState, useEffect } from "react";
import axios from "axios";
import './NewComment.css'

function NewComment({ answerId, userId, commentType }) {
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [currentCommentsPage, setCurrentCommentsPage] = useState(1);
    const [error, setError] = useState('');
    const [reputation, setReputation] = useState(0);
    const commentsPerPage = 3;

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (userId == null){
            window.alert('Only login user can make the comments.')
            // setError('Only login user can make the comments.');
            setComment([])
            return;
        }

        if (comment.length > 140) {
            setError('Comment cannot be more than 140 characters.');
            return;
        }

        if (reputation < 50 && commentType == 'question') {
            setError('You need at least 50 reputation to comment.');
            return;
        }

        try {
            await axios.post('http://localhost:8000/comments', {
                target: answerId,
                user: userId,
                comment: comment,
                commentType: commentType
            });
            setComment('');
            fetchComments();
            setError('');
        } catch (error) {
            console.error('Failed to submit comment:', error);
        }
    };

    const fetchComments = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/comments/${answerId}`);
            setComments(res.data);
    
            const userRes = await axios.get(`http://localhost:8000/users/${userId}`);
            setReputation(userRes.data.reputation);
        } catch (err) {
            console.error('Failed to fetch comments:', err);
        }
    };
    

    useEffect(() => {
        fetchComments();
    }, []);

    const handleUpvote = async (commentId) => {
        try {
            await axios.put(`http://localhost:8000/comments/${commentId}/upvote`);
            fetchComments();
        } catch (err) {
            console.error('Failed to upvote comment:', err);
        }
    };

    const totalPages = Math.ceil(comments.length / commentsPerPage);
    return (
        <div>
            {error && <p>{error}</p>}
            <form className="formA" onSubmit={handleSubmit}>
                <textarea className="textA" value={comment} onChange={e => setComment(e.target.value)}
                    placeholder="Make a comment here"
                    required
                    rows='2'
                    cols='50'
                    style={{ resize: 'none' }}
                />
                <button className="submitBtn" type="submit">Add Comment</button>
            </form>
            {comments.slice((currentCommentsPage - 1) * commentsPerPage, currentCommentsPage * commentsPerPage)
                .map((comment, index) => (
                    <div key={index}>
                        <p>Comment: {comment.comment}</p>
                        <p>Username: {comment.com_by ? comment.com_by.username : 'User not found'}</p>
                        <p>Votes: {comment.votes}</p>
                        <button className="submitBtn" onClick={() => handleUpvote(comment._id)}>Upvote</button>
                    </div>
                ))}
            {comments.length > commentsPerPage && (
                <div className="comments-pagination">
                    <button className="submitBtn"
                        onClick={() => setCurrentCommentsPage(prevPage => prevPage > 1 ? prevPage - 1 : prevPage)}
                        disabled={currentCommentsPage === 1}
                    >
                        Prev
                    </button>
                    <button className="submitBtn"
                        onClick={() => setCurrentCommentsPage(prevPage => prevPage < totalPages ? prevPage + 1 : prevPage)}
                        disabled={currentCommentsPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}

export default NewComment;
