import {Request, Response} from 'express-serve-static-core';
import User, { IUser } from '../models/User.js';
import _ from 'lodash'
import { Document } from 'mongoose';

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
            
            type IFriend = Pick<IUser, '_id'| 'email'| 'firstName'| 'lastName'| 'location'| 'occupations' | 'picturePath'>;
            type IFriendFields = (keyof IFriend)[];

            const friendFields: IFriendFields = ['_id', 'email', 'firstName', 'lastName', 'location', 'occupations', 'picturePath'];


            const friends: IFriend[] = _.compact(
                await Promise.all(
                    user.friends.map((friendId): Promise<IFriend | null> =>
                        User.findById(friendId).select(friendFields).lean().exec()
                    )
                ));

            console.log(friends)

            res.status(200).json(friends);
        }
        catch(error)
        {
            res.status(500).json({error: error instanceof Error ? error.message : error});
        }
    };

    addRemoveFriend = async (req: Request, res:Response): Promise<void> => {
        try
        {
            const {id, friendId} = req.params;

            type IFriend = Pick<IUser, '_id'| 'email'| 'firstName'| 'lastName'| 'location'| 'occupations' | 'picturePath'>;
            type IFriendFields = (keyof IFriend)[];

            const friendFields: IFriendFields = ['_id', 'email', 'firstName', 'lastName', 'location', 'occupations', 'picturePath'];

            const userDoc:Document<IUser> | null = await User.findById(id);
            const friendDoc:Document<IUser> | null = await User.findById(friendId);

            if(!userDoc || !friendDoc)
            {
                res.status(404).json({msg: "User was not found"});
                return;
            }

            const user:IUser = userDoc.toObject();
            const friend:IUser = friendDoc.toObject();

            const isFriend = user.friends.some(identifier => identifier === friendId);
            console.log({isFriend});
            if(isFriend)
            {
                // Remove Friend From the list!
                user.friends = user.friends.filter(identifier => identifier != friendId);
                friend.friends = friend.friends.filter(identifier => identifier != id);
                userDoc.overwrite({...user, friends: user.friends});
                friendDoc.overwrite({...friend, friends: friend.friends})
            }
            else
            {
                // Add Friend to the list!
                user.friends.push(String(friend._id));
                friend.friends.push(String(user._id));

                userDoc.overwrite({...user, friends: user.friends});
                friendDoc.overwrite({...friend, friends: friend.friends})
            }

            // Save the new updated Data in this docs
            await userDoc.save();
            await friendDoc.save();
            
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