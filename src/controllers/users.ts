import {Request, Response} from 'express-serve-static-core';
import User, { IUser } from 'models/User.js';
import { Document } from 'mongoose';
import _ from 'lodash'

interface IUserController {
    ['@path']:string;
    getUser:(req:Request, res:Response) => Promise<void>
    getUserFriends:(req:Request, res:Response) => Promise<void>
    addRemoveFriend:(req:Request, res:Response) => Promise<void>
}

export class UserController implements IUserController {
    public '@path':string;
    constructor()
    {
        this["@path"] = '/users';
    }

    getUser = async (req:Request, res:Response):Promise<void> => {
        try
        {
            const { id } = req.params;
            const user: IUser | null = await User.findById(id).lean();
            res.status(200).json(user);
        }
        catch(error)
        {
            res.status(404).json({error: error instanceof Error ? error.message : error});
        };
    };

    getUserFriends = async (req: Request, res:Response):Promise<void> => {
        try
        {
            const { id } = req.params;
            const user:IUser | null = await User.findById(id);
            
            if(!user) {
                res.status(400).json({msg: "User was not found"});
                return;
            }
            
            type IFriend = Pick<IUser, '_id'| 'email'| 'firstName'| 'lastName'| 'location'| 'occupations'>;
            type IFriendFields = (keyof IFriend)[];

            const friendFields: IFriendFields = ['_id', 'email', 'firstName', 'lastName', 'location', 'occupations'];




            const friends: IFriend[] = _.compact(
                await Promise.all(
                    user.friends.map((id): Promise<IFriend | null> =>
                        User.findById(id).select(friendFields).lean().exec()
                    )
                ));


            res.status(200).json(friends);
        }
        catch(error)
        {

        }
    };

    addRemoveFriend = async (req: Request, res:Response): Promise<void> => {
        try
        {
            const {id, friendId} = req.params;

            type IFriend = Pick<IUser, '_id'| 'email'| 'firstName'| 'lastName'| 'location'| 'occupations'>;
            type IFriendFields = (keyof IFriend)[];

            const friendFields: IFriendFields = ['_id', 'email', 'firstName', 'lastName', 'location', 'occupations'];

            const user:IUser | null = await User.findById(id).lean();
            const friend:IUser | null = await User.findById(friendId).lean();

            if(!user || !friend)
            {
                res.status(404).json({msg: "User was not found"});
                return;
            }

            if(user.friends.includes(friendId)) {
                user.friends = user.friends.filter(id => friendId);
                friend.friends = friend.friends.filter(identifier => id == identifier);
            }
            else
            {
                user.friends.push(friendId);
                friend.friends.push(id);
            }

            await (new User(user)).save();
            await (new User(friend)).save();
            
            const friends: IFriend[] = _.compact(
                await Promise.all(
                    user.friends.map((id): Promise<IFriend | null> =>
                        User.findById(id).select(friendFields).lean().exec()
                    )
                ));

            res.status(200).json(friends);
            
        }
        catch(error)
        {
            res.status(404).json({error: error instanceof Error ? error.message : error});
        }
    }
    
}