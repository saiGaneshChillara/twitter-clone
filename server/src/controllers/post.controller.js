import expressAsyncHandler from 'express-async-handler';
import Post from '../models/post.model.js'
import User from '../models/user.model.js';
import cloudinary from '../config/cloudinary.js';
import Notification from '../models/notification.model.js';
import Comment from '../models/comment.model.js';

import { getAuth } from '@clerk/express';

export const getPosts = expressAsyncHandler(async (req, res) => {
    const posts = await Post.find()
        .sort({ createdAt: -1 })
        .populate("user", "username firstName lastName profilePicture")
        .populate({
            path: "comments",
            populate: {
                path: "user",
                select: "username firstName lastName profilePicture",
            },
        });

    res.status(200).json({ posts });
});

export const getPost = expressAsyncHandler(async (req, res) => {
    const { postId } = req.params;

    const post = await Post.findById(postId)
        .populate("user", "username firstName lastName profilePicture")
        .populate({
            path: "comments",
            populate: {
                path: 'user',
                select: "username firstName lastName profilePicture",
            },
        });
    
    if (!post) return res.status(404).json({ error: "Post not found" });

    return res.status(200).json({ post });
});

export const getUserPosts = expressAsyncHandler(async (req, res) => {
    const { username } = req.params;

    const user = await User.findOne({ username });

    const posts = await Post.find({ user: user._id })
        .sort({ createdAt: -1})
        .populate("user", "username firstName lastName profilePicture")
        .populate({
            path: "comments",
            populate: {
                path: "user",
                select: "username firstName lastName profilePicture",
            },
        });
    
    res.status(200).json({ posts });
});

export const createPost = expressAsyncHandler(async (req, res) => {
    const { userId } = getAuth(req);
    const { content } = req.body;
    const imageFile = req.file;

    if (!content && !imageFile) return res.status(400).json({ error: "Post must containe either image or text" });

    const user = await User.findOne({ clerkId: userId });
    if (!user) return res.status(404).json({ error: "User not found" });

    let imageUrl = "";

    if (imageFile) {
        try {
            const base64Image = `data:${imageFile.mimetype};base64,${imageFile.buffer.toString("base64")}`;

            const uploadResponse = await cloudinary.uploader.upload(base64Image, {
                folder: 'twitter_clone_posts',
                resource_type: 'image',
                transformation: [
                    { width: 800, height: 600, crop: "limit" },
                    { quality: "auto" },
                    { format: "auto" },
                ],
            });

            imageUrl = uploadResponse.secure_url;
        } catch (error) {
            console.error("Cloudianry upload error:", error);
            return res.status(400).json({ error: "Failed to upload image" });
        }
    }

    const post = await Post.create({
        user: user._id,
        content: content || "",
        image: imageUrl,
    });

    return res.status(201).json({ post });
});

export const likePost = expressAsyncHandler(async (req, res) => {
    const { userId } = getAuth(req);
    const { postId } = req.params;

    const user = await User.findOne({ clerkId: userId });
    const post = await Post.findById(postId);

    if (!user || !post) return res.status(404).json({ error: "Post or User not found" });

    const isLiked = post.likes.includes(user._id);

    if (isLiked) { //Unlike if it's already liked
        await Post.findByIdAndUpdate(postId, {
            $pull: { likes: user._id },
        });
    } else { //like post
        await Post.findByIdAndUpdate(postId, {
            $push: { likes: user._id },
        });

        // send notification to the post owner if he's not the owner
        if (post.user.toString() !== user._id.toString()) {
            await Notification.create({
                from: user._id,
                to: post.user,
                post: post._id,
                type:"like",
            });
        }
    }

    return res.status(200).json({
        message: `Post ${isLiked ? "unliked" : "liked"} sucessfully`,
    });
});

export const deletePost = expressAsyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { userId } = getAuth(req);

    const user = await User.findOne({ clerkId: userId });
    const post = await Post.findById(postId);

    if (!user || !post) return res.status(404).json({ error: "User or post not found" });

    if (post.user.toString() !== user._id.toString()) return res.status(403).json({ error: "You can't delete other's posts" });

    // delete the comments on the post
    await Comment.deleteMany({ post: postId });

    // delete the post
    await Post.findByIdAndDelete(postId);

    return res.status(200).json({ message: "Post deleted sucessfully" });
});