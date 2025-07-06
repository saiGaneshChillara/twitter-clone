import expressAsyncHandler from 'express-async-handler';
import Comment from '../models/comment.model.js';
import User from '../models/user.model.js';
import Post from '../models/post.model.js';
import { getAuth } from '@clerk/express';
import Notification from '../models/notification.model.js';

export const getAllComments = expressAsyncHandler(async (req, res) => { 
    const { postId } = req.params;

    const comments = await Comment.find({ post: postId })
        .sort({ createdAt: -1 })
        .populate("user", "username firstName lastName profilePicture");
    
    res.status(200).json({ comments });
});

export const createComment = expressAsyncHandler(async (req, res) => { 
    const { postId } = req.params;
    const { content } = req.body;
    const { userId } = getAuth(req);

    const user = await User.findOne({ clerkId: userId });
    const post = await Post.findById(postId);

    if (!user || !post) return res.status(404).json({ error: "User or post not found" });

    if (!content || content.trim() === "") return res.status(400).json({ error: "Content can't be empty" });

    const comment = await Comment.create({
        user: user._id,
        post: post._id,
        content,
    });

    // add comment to the post
    await Post.findByIdAndUpdate(postId, {
        $push: { comments: comment._id },
    });

    // Send notification to the owner if he's not the commentor
    if (user._id.toString() !== post.user.toString()) {
        await Notification.create({
            from: user._id,
            to: post.user,
            post: post._id,
            type: "comment",
            comment: comment._id,
        }); 
    }

    return res.status(201).json({ comment });
});

export const deleteComment = expressAsyncHandler(async (req, res) => { 
    const { commentId } = req.params;
    const { userId } = getAuth(req);

    const user = await User.findOne({ clerkId: userId });
    const comment = await Comment.findById(commentId);

    if (!user || !comment) return res.status(404).json({ error: "User or comment not found" });

    if (user._id.toString() !== comment.user.toString()) return res.status(403).json({ error: "You can only delete your comments" });

    // delete comment form post
    await Post.findByIdAndUpdate(comment.post, {
        $pull: { comments: comment._id },
    });

    // delete the comment
    await Comment.findByIdAndDelete(commentId);

    return res.status(200).json({ message: "Comment deleted successfully" });
});