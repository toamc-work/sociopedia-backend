import Post from '../models/Post.js';
import User from '../models/User.js';
;
export class PostController {
    '@path';
    constructor() {
        this["@path"] = '/posts';
    }
    createPost = async (req, res) => {
        try {
            const { userId, description, picturePath } = req.body;
            const user = await User.findById(userId).lean();
            if (user == null) {
                res.status(404).json({ msg: 'User was not found' });
                return;
            }
            ;
            const newPost = new Post({
                userId: userId,
                firstName: user.firstName,
                lastName: user.lastName,
                location: user.location,
                description: description,
                picturePath: picturePath,
                userPicturePath: user.picturePath,
                likes: {},
                comments: []
            });
            await newPost.save();
            const posts = await Post.find();
            res.status(201).json(posts);
        }
        catch (error) {
            res.status(409).json({ error: error instanceof Error ? error.message : error });
        }
    };
    getFeedPosts = async (req, res) => {
        try {
            const posts = await Post.find().lean();
            res.status(200).json(posts);
        }
        catch (error) {
            res.status(404).json({ error: error instanceof Error ? error.message : error });
        }
        ;
    };
    getUserPosts = async (req, res) => {
        try {
            const { userId } = req.params;
            const posts = await Post.find({ userId: userId }).lean();
            res.status(200).json(posts);
        }
        catch (error) {
            res.status(404).json({ error: error instanceof Error ? error.message : error });
        }
        ;
    };
    likePost = async (req, res) => {
        try {
            const { id } = req.params;
            const { userId } = req.body;
            const post = await Post.findById(id).lean();
            if (post == null)
                throw new Error('User was not found');
            console.log(post.likes);
            const isLiked = post.likes[userId];
            if (isLiked) {
                delete post.likes[userId];
            }
            else {
                post.likes[userId] = true;
            }
            ;
            const updatePost = await Post.findByIdAndUpdate(id, { likes: post.likes }, { new: true });
            res.status(200).json(updatePost);
        }
        catch (error) {
            res.status(404).json({ error: error instanceof Error ? error.message : error });
        }
    };
}
