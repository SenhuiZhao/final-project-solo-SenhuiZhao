const express = require('express');
const router = express.Router();
const User = require('./models/users');
const Comment = require('./models/comments');
const Tag = require('./models/tags');
const Question = require('./models/questions');
const Answer = require('./models/answers');
const Vote = require('./models/votes')
const bcrypt = require('bcrypt');

router.post('/register', async (req, res) => {  // new version
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' });
    }
    // Validate email format, credit by stack overflow
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email address' });
    }
    if (password.includes(username) || password.includes(email)) {
        return res.status(400).json({ error: 'Password cannot contain username or email' });
    }
    try {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.sendStatus(201);
    } catch (error) {
        res.status(500).json({ error: 'Unable to create account. Check for network errors' });
    }
});


router.post('/login', async (req, res) => { //done
    const user = await User.findOne({ email: req.body.email });
    if (user == null) {
        // console.log('Cannot find user')
        // return res.status(400).json({ 'msg': 'Cannot find user' });
        return res.status(400).json({ error: 'User not found, unregistered email' });
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            req.session.user = user;
            console.log(req.session.user)
            res.json(user);
        } else {
            return res.status(400).json({ error: 'Invalid password' });
        }
    } catch {
        res.status(500).send({ 'msg': 'Internal server error' });
    }
});


router.get('/signout', (req, res) => {
    req.session.destroy()
    res.sendStatus(200);
});


router.get('/model', async (req, res) => {
    u = await User.find()
    q = await Question.find()
    a = await Answer.find()
    t = await Tag.find()
    c = await Comment.find()
    v = await Vote.find()
    res.send({ "user": u, "questions": q, "answers": a, "tags": t, "comments": c, "vote": v })
})

// router.get('/questions', async (req, res) => {  //effect other
//     try {
//         const questions = await Question.find()
//             .populate([
//                 { path: 'votes' },
//                 { path: 'asked_by', select: 'username' }
//             ]);
//         res.json(questions);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

//-- profile page
// router.get('/questions', async (req, res) => {
//     try {
//         let questions;
//         if (req.query.user_id) {
//             console.log(1)
//             console.log(req.query.user_id)
//             questions = await Question.find({ asked_by: req.query.user_id }).populate('tags answers');
//             if (!questions) {
//                 return res.status(404).json({ error: 'No questions found for this user' });
//             }
//         } else {
//             console.log(2)
//             questions = await Question.find({}).populate('tags answers');
//         }
//         res.json(questions);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// // Get tags by user
// router.get('/tags', async (req, res) => {
//     console.log("Get tags by user")
//     const { user_id } = req.query; 
//     const tags = await Tag.find({ created_by: user_id });
//     if (!tags) {
//         return res.status(404).json({ error: 'No tags found for this user' });
//     }
//     res.json(tags);
// });

// // Get answers by user
// router.get('/answers', async (req, res) => {
//     console.log("Get answers by user")
//     const { user_id } = req.query; 
//     const answers = await Answer.find({ ans_by: user_id }).populate('questions comments votes');
//     if (!answers) {
//         return res.status(404).json({ error: 'No answers found for this user' });
//     }
//     res.json(answers);
// });

// // Get comments by user
// router.get('/comments', async (req, res) => {
//     console.log("Get comments by user")
//     const { user_id } = req.query;
//     const comments = await Comment.find({ com_by: user_id });
//     if (!comments) {
//         return res.status(404).json({ error: 'No comments found for this user' });
//     }
//     res.json(comments);
// });


// //new version 5/16     profile page 
// Get all questions or by user
router.get('/questions', async (req, res) => {
    try {
        let questions;
        if (req.query.user_id) {
            questions = await Question.find({ asked_by: req.query.user_id }).populate('tags answers');
        } else {
            questions = await Question.find({}).populate('tags answers');
        }
        if (!questions) {
            return res.status(404).json({ error: 'No questions found' });
        }
        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all tags or by user
// router.get('/tags', async (req, res) => {
//     try {
//         let tags;
//         if (req.query.user_id) {
//             tags = await Tag.find({ created_by: req.query.user_id });
//         } else {
//             tags = await Tag.find({});
//         }
//         if (!tags) {
//             return res.status(404).json({ error: 'No tags found' });
//         }
//         res.json(tags);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

//update again  tagsssss success

router.get('/tags', async (req, res) => {
    try {
        if (req.query.user_id) {
            const questions = await Question.find({ asked_by: req.query.user_id });
            const tagIds = new Set(); // to ensure uniqueness of tags
            for (let question of questions) {
                for (let tagId of question.tags) {
                    tagIds.add(tagId.toString()); // converting to string because they are ObjectIds
                }
            }
            const tags = await Tag.find({ _id: { $in: Array.from(tagIds) } });
            if (!tags) {
                return res.status(404).json({ error: 'No tags found' });
            }
            res.json(tags);
        } else {
            const tags = await Tag.find({});
            if (!tags) {
                return res.status(404).json({ error: 'No tags found' });
            }
            res.json(tags);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Get all answers or by user
router.get('/answers', async (req, res) => {
    try {
        let answers;
        if (req.query.user_id) {
            answers = await Answer.find({ ans_by: req.query.user_id }).populate('questions comments votes');
        } else {
            answers = await Answer.find({}).populate('questions comments votes');
        }
        if (!answers) {
            return res.status(404).json({ error: 'No answers found' });
        }
        res.json(answers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all comments or by user
router.get('/comments', async (req, res) => {
    try {
        let comments;
        if (req.query.user_id) {
            comments = await Comment.find({ com_by: req.query.user_id });
        } else {
            comments = await Comment.find({});
        }
        if (!comments) {
            return res.status(404).json({ error: 'No comments found' });
        }
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



router.get('/comments/:answerId', async (req, res) => {
    try {
        const comments = await Comment.find({ target: req.params.answerId }).populate('com_by').sort({ com_date_time: -1 });
        res.status(200).json(comments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/test', (req, res) => {
    res.send(req.session.user)
})


// router.post('/newquestion', async (req, res) => { //works
//     try {
//         const newQuestion = new Question({
//             title: req.body.title,
//             summary: req.body.summary,
//             text: req.body.text,
//             tags: req.body.tags,
//             asked_by: req.body.asked_by
//         });
//         const savedQuestion = await newQuestion.save();

//         // Find the user and update their questions array
//         const user = await User.findById(req.body.asked_by);
//         user.questions.push(savedQuestion._id);
//         await user.save();
//         res.send(savedQuestion);
//     } catch (error) {
//         res.json({ error: error.message });
//     }
// });
router.post('/newquestion', async (req, res) => {
    try {
        const newQuestion = new Question({
            title: req.body.title,
            summary: req.body.summary,
            text: req.body.text,
            tags: req.body.tags,
            asked_by: req.body.asked_by
        });

        const savedQuestion = await newQuestion.save();

        const user = await User.findById(req.body.asked_by);
        user.questions.push(savedQuestion._id);
        await user.save();

        const tagPromises = req.body.tags.map(async tagId => {
            const tag = await Tag.findById(tagId);
            tag.questions.push(savedQuestion._id);
            return tag.save();
        });

        await Promise.all(tagPromises);

        res.send(savedQuestion);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});




// router.post('/addTags', async (req, res) => {
//     const tagNames = req.body.name;
//     const userInfo = req.body.userInfo;
//     const existingTags = [];
//     const newTags = [];

//     for (const tagName of tagNames) {
//         const tag = await Tag.findOne({ name: tagName });
//         if (tag) {
//             existingTags.push(tag);
//         } else {
//             if (userInfo.reputation < 50) {
//                 res.status(403).json({ error: "You need at least 50 reputation points to create a new tag" });
//                 return;
//             }

//             try {
//                 const newTag = new Tag({
//                     name: tagName,
//                     created_by: userInfo._id
//                 });
//                 await newTag.save();
//                 newTags.push(newTag);
//             } catch (error) {
//                 res.json({ error: error.message });
//                 return;
//             }
//         }
//     }

//     const allTags = [...existingTags, ...newTags];
//     res.send(allTags);
// });

// new addTags
router.post('/addTags', async (req, res) => {
    const tagNames = req.body.name;
    const userInfo = req.body.userInfo;
    const existingTags = [];
    const newTags = [];

    if (!userInfo) {
        res.status(401).json({ error: "Please login first" });
        return;
    }

    for (const tagName of tagNames) {
        let tag = await Tag.findOne({ name: tagName });
        if (tag) {
            existingTags.push(tag);
            // If the tag exists, assign it to the current user
            await User.updateOne({ _id: userInfo._id }, { $addToSet: { tags: tag._id } });
        } else {
            if (userInfo.reputation < 50) {
                res.status(403).json({ error: "You need at least 50 reputation points to create a new tag" });
                return;
            }

            try {
                const newTag = new Tag({
                    name: tagName,
                    created_by: userInfo._id
                });
                await newTag.save();
                newTags.push(newTag);

                await User.updateOne({ _id: userInfo._id }, { $push: { tags: newTag._id } });

            } catch (error) {
                res.json({ error: error.message });
                return;
            }
        }
    }

    const allTags = [...existingTags, ...newTags];
    res.send(allTags);
});




// router.post("/addanswer", async (req, res) => {
//     let newAnswer = req.body;
//     let answer = new Answer({
//         text: newAnswer.text,
//         ans_by: newAnswer.ans_by,
//         ans_date_time: newAnswer.ans_date_time,
//     });
//     await answer.save();
//     res.send(answer);
// });

//correct one 
router.post("/addanswer", async (req, res) => {
    let newAnswer = req.body;
    let answer = new Answer({
        text: newAnswer.text,
        ans_by: newAnswer.ans_by,
        ans_date_time: newAnswer.ans_date_time,
        questions: newAnswer.questions,
    });

    try {
        await answer.save();

        //update
        await Question.updateOne({ _id: newAnswer.questions }, { $push: { answers: answer._id } });
        await User.updateOne({ _id: newAnswer.ans_by }, { $push: { answers: answer._id } });

        res.send(answer);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});




router.put("/addAnswerToQuestion/:id", async (req, res) => {

    try {
        const question = await Question.findById(req.params.id);
        if (!question) {
            return res.status(404).json({ error: "Question not found" });
        }

        // update question
        question.title = req.body.title;
        question.text = req.body.text;
        question.tags = req.body.tags;
        question.answers = req.body.answers;
        question.views = req.body.views;
        await question.save();
        // res.status(200).json(question);
        res.send(question)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

});

router.put('/incrementView/:id', async (req, res, next) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) {
            return res.status(404).json({ error: "Question not found" });
        }

        // update the fields of the question
        question.title = req.body.title;
        question.text = req.body.text;
        question.tags = req.body.tags;
        question.answers = req.body.answers;
        question.views = req.body.views;
        await question.save();
        res.status(200).json(question);
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// router.put('/reputation/:id', async (req, res) => {
//     await User.findByIdAndUpdate(req.params.id, {
//         $inc: { rep: req.body.reputation }
//     });
//     res.sendStatus(200);
// });

//edit question
router.put('/questions/:id', async (req, res) => {
    const { id } = req.params;
    const { title, summary, text, tags } = req.body;
    const updatedQuestion = await Question.findByIdAndUpdate(id, { title, summary, text, tags }, { new: true });
    if (!updatedQuestion) return res.status(404).json({ error: "Question not found" });
    res.json(updatedQuestion);
});

//delete
// router.delete('/questions/:id', async (req, res) => {
//     const { id } = req.params;
//     const deletedQuestion = await Question.findByIdAndDelete(id);
//     if (!deletedQuestion) return res.status(404).json({ error: "Question not found" });
//     res.json({ message: "Question deleted successfully" });
// });

// delete update
router.delete('/questions/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const question = await Question.findById(id);
        if (!question) return res.status(404).json({ error: "Question not found" });

        const answers = await Answer.find({ questions: id });

        const answerIds = answers.map(answer => answer._id);
        await Comment.deleteMany({ 
            $or: [
                { target: id }, 
                { target: { $in: answerIds } }
            ] 
        });

        await Answer.deleteMany({ questions: id });
        await User.updateMany({}, { $pull: { questions: id } });
        // await Tag.updateMany({}, { $pull: { questions: id } });
        
        const deletedQuestion = await Question.findByIdAndDelete(id);
        res.json({ message: "Question, its associated answers, and all their comments deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// edit tag
// router.put('/tags/:id', async (req, res) => {
//     const { id } = req.params;
//     const { name } = req.body;
//     const updatedTag = await Tag.findByIdAndUpdate(id, { name }, { new: true });
//     if (!updatedTag) return res.status(404).json({ error: "Tag not found" });
//     res.json(updatedTag);
// });

// GET route to find a tag by name
router.get('/findtagbyname', async (req, res) => {
    const { name } = req.query;
    try {
        const tag = await Tag.findOne({ name });
        if (!tag) {
            return res.status(404).json({ error: 'Tag not found' });
        }
        res.json(tag);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// // POST route to create a new tag
// router.post('/tags', async (req, res) => {
//     const { name, created_by } = req.body;
//     try {
//         const tag = new Tag({ name, created_by });
//         await tag.save();
//         res.json(tag);
//     } catch (error) {
//         if (error.code === 11000) {
//             return res.status(400).json({ error: 'Duplicate tag name' });
//         }
//         res.status(500).json({ message: error.message });
//     }
// });

// new delete tags
router.delete('/tags/:id', async (req, res) => {
    const { id } = req.params;
    const { user_id } = req.query; 
    const tag = await Tag.findById(id);

    if (!tag) return res.status(404).json({ error: "Tag not found" });

    const user = await User.findById(user_id);
    if(!user) return res.status(404).json({ error: "User not found" });

    // Check if tag is used by other users
    const otherUsersUseTag = await User.findOne({ tags: id, _id: { $ne: user_id } });

    // if (otherUsersUseTag && !user.isAdmin) {
    if (otherUsersUseTag) {
        return res.status(403).json({ error: "Tag is used by other users, cannot be deleted" });
    }

    await Tag.findByIdAndDelete(id);

    await Question.updateMany(
        { tags: id }, 
        { $pull: { tags: id } }
    );
    await User.updateMany(
        { tags: id }, 
        { $pull: { tags: id } }
    );

    res.json({ message: "Tag deleted successfully" });
});






// router.delete('/tags/:id', async (req, res) => {
//     const { id } = req.params;
//     const deletedTag = await Tag.findByIdAndDelete(id);
//     if (!deletedTag) return res.status(404).json({ error: "Tag not found" });

//     await Question.updateMany(
//         { tags: id }, 
//         { $pull: { tags: id } }
//     );
//     await User.updateMany(
//         { tags: id }, 
//         { $pull: { tags: id } }
//     );

//     res.json({ message: "Tag deleted successfully" });
// });


//Edit Answer
router.put('/answers/:id', async (req, res) => {
    const { id } = req.params;
    const { text } = req.body;
    const updatedAnswer = await Answer.findByIdAndUpdate(id, { text }, { new: true });
    if (!updatedAnswer) return res.status(404).json({ error: "Answer not found" });
    res.json(updatedAnswer);
});
//delete
// router.delete('/answers/:id', async (req, res) => {
//     const { id } = req.params;
//     const deletedAnswer = await Answer.findByIdAndDelete(id);
//     if (!deletedAnswer) return res.status(404).json({ error: "Answer not found" });
//     res.json({ message: "Answer deleted successfully" });
// });
// update delete
router.delete('/answers/:id', async (req, res) => {
    const { id } = req.params;
    const deletedAnswer = await Answer.findByIdAndDelete(id);
    if (!deletedAnswer) return res.status(404).json({ error: "Answer not found" });
    await User.updateMany(
        { answers: id }, 
        { $pull: { answers: id } }
    );
    await Question.updateMany(
        { answers: id }, 
        { $pull: { answers: id } }
    );
    await Vote.updateMany(
        { answer_id: id },
        { $unset: { answer_id: "" } }
    );
    await Comment.deleteMany({ target: id });

    res.json({ message: "Answer deleted successfully" });
});




// Edit Comment
router.put('/comments/:id', async (req, res) => {
    const { id } = req.params;
    const { comment } = req.body;
    const updatedComment = await Comment.findByIdAndUpdate(id, { comment }, { new: true });
    if (!updatedComment) return res.status(404).json({ error: "Comment not found" });
    res.json(updatedComment);
});

// Delete Comment
router.delete('/comments/:id', async (req, res) => {
    const { id } = req.params;
    const deletedComment = await Comment.findByIdAndDelete(id);
    if (!deletedComment) return res.status(404).json({ error: "Comment not found" });
    res.json({ message: "Comment deleted successfully" });
});


// router.post('/comments', async (req, res) => {
//     const { comment, user, target, commentType } = req.body;
//     try {
//         const newComment = new Comment({
//             user,
//             target,
//             comment,
//             commentType,
//             com_by: user,  
//             com_date_time: new Date(),
//         });
//         await newComment.save();
//         res.status(201).json(newComment);
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// });
// update for comments

router.post('/comments', async (req, res) => {
    const { comment, user, target, commentType } = req.body;
    try {
        const newComment = new Comment({
            user,
            target,
            comment,
            commentType,
            com_by: user,  
            com_date_time: new Date(),
        });
        await newComment.save();
        //update
        if(commentType === 'question') {
            await Question.updateOne({ _id: target }, { $push: { comments: newComment._id } });
        } else if(commentType === 'answer') {
            await Answer.updateOne({ _id: target }, { $push: { comments: newComment._id } });
        }
        await User.updateOne({ _id: user }, { $push: { comments: newComment._id } });

        res.status(201).json(newComment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});






// upvote a comment
router.put('/comments/:id/upvote', async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });
        comment.votes += 1;
        await comment.save();
        res.status(200).json(comment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.get('/comments', async (req, res) => {
    try {
        const comments = await Comment.find().populate('com_by').sort({ com_date_time: -1 });
        res.status(200).json(comments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//vote stuff
// Get votes for a question
// router.get('/question/:id', async (req, res) => {  //delete by accident does not work now
//     try {
//         const question = await Question.findById(req.params.id).populate('votes');
//         res.json(question.votes);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });
router.get('/question/:questionId', async (req, res) => {
    const questionId = req.params.id;

    try {
        let question = await Question.findById(questionId)
            .populate('tags')
            .populate('votes');
        if (!question) {
            return res.status(404).json({ msg: 'Question not found' });
        }
        res.json(question);
    } catch (err) {
        console.error(err.message);
        if (err.kind == 'ObjectId') {
            return res.status(404).json({ msg: 'Question not found' });
        }
        res.status(500).send('Server error');
    }
});


router.put('/reputation/:userId', async (req, res) => {
    const { reputation } = req.body;
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.reputation += reputation;
        await user.save();

        res.json({ message: 'User reputation updated', user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// router.post('/vote', async (req, res) => {  //works for old one
//     const { type, question_id, vote_by } = req.body;

//     try {
//         const vote = new Vote({ type, question_id, vote_by });
//         await vote.save();

//         // res.json({ message: 'Vote created', vote });
//         res.send(vote)
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Server error' });
//     }
// });

router.post('/vote', async (req, res) => {
    const { type, question_id, answer_id, vote_by } = req.body;

    try {
        let vote;
        if (question_id) {
            vote = new Vote({ type, question_id, vote_by });
        } else if (answer_id) {
            vote = new Vote({ type, answer_id, vote_by });
        } else {
            return res.status(400).json({ message: 'Missing question_id or answer_id' });
        }
        await vote.save();
        res.send(vote);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
    });



router.put('/question/:questionId', async (req, res) => {
    const { votes } = req.body;
    const { questionId } = req.params;

    try {
        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        question.votes = votes;
        await question.save();

        res.json({ message: 'Question votes updated', question });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});



//for votes
router.get('/answer/:answerId', async (req, res) => {
    const { answerId } = req.params;

    try {
        const answer = await Answer.findById(answerId).populate('votes');
        if (!answer) {
            return res.status(404).json({ message: 'Answer not found' });
        }

        res.json(answer);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});




router.put('/answer/:answerId', async (req, res) => {
    const { votes } = req.body;
    const { answerId } = req.params;

    try {
        const answer = await Answer.findById(answerId);
        if (!answer) {
            return res.status(404).json({ message: 'Answer not found' });
        }

        answer.votes = votes;
        await answer.save();

        res.json({ message: 'Answer votes updated', answer });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

//----question edit
// router.post('/tags/fetchOrCreate', async (req, res) => {
//     const tagNames = req.body.tags;

//     let fetchedTags = [];

//     try {
//         for (let tagName of tagNames) {
//             let tag = await Tag.findOne({ name: tagName });

//             if (!tag) {
//                 tag = new Tag({ name: tagName });
//                 await tag.save();
//             }

//             fetchedTags.push(tag);
//         }

//         res.json(fetchedTags.map(tag => tag._id));
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Server error');
//     }
// });

//----question edit update
router.post('/tags/fetchOrCreate', async (req, res) => {
    const tagNames = req.body.tags;
    const userId = req.body.userId;
    const questionId = req.body.questionId; 

    let fetchedTags = [];

    try {
        const user = await User.findById(userId);
        const question = await Question.findById(questionId);

        for (let tagName of tagNames) {
            let tag = await Tag.findOne({ name: tagName });

            if (!tag) {
                tag = new Tag({ name: tagName, created_by: userId });
                await tag.save();
                user.tags.push(tag._id);
                question.tags.push(tag._id);
                tag.questions.push(questionId);
                await tag.save();
            }

            fetchedTags.push(tag);
        }

        await user.save();
        await question.save();

        res.json(fetchedTags.map(tag => tag._id));
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});





//=------ edittags

router.put('/edittags/:id', async (req, res) => {
    const { id } = req.params;
    const { name } = req.body; //  updating the tag's name

    try {
        const tag = await Tag.findById(id);

        if (!tag) {
            return res.status(404).json({ error: 'Tag not found' });
        }

        // if (tag.created_by.toString() !== req.query.user_id) { 
        //     return res.status(403).json({ error: 'User not authorized to update this tag' });
        // }

        tag.name = name;
        const updatedTag = await tag.save();

        res.json(updatedTag);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});



//user
// Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a user by ID
router.get('/users/:id', getUser, (req, res) => {
    res.json(res.user);
});

// Delete a user by ID update 
// router.delete('/users/:id', async (req, res) => {
//     try {
//         const result = await User.deleteOne({ _id: req.params.id });
//         if (result.deletedCount === 0) {
//             return res.status(404).json({ message: 'Cannot find user' });
//         }
//         res.json({ message: 'User deleted' });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });
// Delete a user by ID update 2
router.delete('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const userResult = await User.deleteOne({ _id: userId });
        if (userResult.deletedCount === 0) {
            return res.status(404).json({ message: 'Cannot find user' });
        }
        const questionResult = await Question.deleteMany({ asked_by: userId });
        const answerResult = await Answer.deleteMany({ ans_by: userId });
        const commentResult = await Comment.deleteMany({ com_by: userId });
        const voteResult = await Vote.deleteMany({ vote_by: userId });
        res.json({ message: 'User and all associated data deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }});

// Middleware for getting user by ID
async function getUser(req, res, next) {
    let user;
    try {
        user = await User.findById(req.params.id);
        if (user == null) {
            return res.status(404).json({ message: 'Cannot find user' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.user = user;
    next();
}


async function checkLogin(req, res, next) {
    req.session.user ? next() : res.sendStatus(400);
}


module.exports = router;
