import {Request, Response} from 'express';
import Post, { IPost } from '../models/Post.js';
import User, { IUser } from '../models/User.js';

interface IPostController {
    ['@path']:string;
    createPost:(req:Request, res:Response) => Promise<void>;
    getFeedPosts:(req:Request, res:Response) => Promise<void>;
    getUserPosts:(req:Request, res:Response) => Promise<void>;
    likePost:(req:Request, res:Response) => Promise<void>;
};

export class PostController implements IPostController {
    public '@path':string;
    constructor()
    {
        this["@path"] = '/posts';
    }

    createPost = async (req:Request, res:Response) => {
        try
        {
            const { userId, description, picturePath }:Pick<IPost, 'userId' | 'description' | 'picturePath'> = req.body;
            const user:IUser | null = await User.findById(userId).lean();

            if(user == null)
            {
                res.status(404).json({msg: 'User was not found'});
                return;
            };

            const newPost = new Post({
                userId:userId,
                firstName:user.firstName,
                lastName:user.lastName,
                location:user.location,
                description:description,
                picturePath:picturePath,
                userPicturePath:user.picturePath,
                likes: {},
                comments: []
            });

            await newPost.save();

            const posts = await Post.find();

            res.status(201).json(posts);

        }
        catch(error)
        {
            res.status(409).json({error: error instanceof Error ? error.message: error});
        }

    }

    getFeedPosts = async (req:Request, res:Response) => {
        try
        {
            const posts: IPost[] = await Post.find().lean();
            res.status(200).json(posts);
        }
        catch(error)
        {
            res.status(404).json({error: error instanceof Error ? error.message : error});
        };
    };

    getUserPosts = async (req:Request, res:Response) => {
        try
        {
            const { userId } = req.params;
            const posts:IPost[] = await Post.find({userId:userId}).lean();
            res.status(200).json(posts);
        }
        catch(error)
        {
            res.status(404).json({error: error instanceof Error ? error.message : error});
        };
    };
    
    likePost = async (req:Request, res:Response) => {
        try
        {
            const { id } = req.params;
            const { userId } = req.body;
            const post:IPost | null = await Post.findById(id).lean();

            if(post == null) throw new Error('User was not found');

            console.log(post.likes);
            const isLiked = post.likes[userId];

            if(isLiked) {
                delete post.likes[userId]
            }
            else
            {
                post.likes[userId] = true;
            };

            const updatePost = await Post.findByIdAndUpdate(
                id,
                { likes: post.likes },
                {new: true}
            );

            res.status(200).json(updatePost);

        }
        catch(error)
        {
            res.status(404).json({error: error instanceof Error ? error.message : error});
        }
    };

}