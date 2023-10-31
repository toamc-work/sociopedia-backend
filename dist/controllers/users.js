import User from '../models/User.js';
import _ from 'lodash';
export class UserController {
    '@path';
    constructor() {
        this["@path"] = '/users';
    }
    getUser = async (req, res) => {
        try {
            const { id } = req.params;
            const user = await User.findById(id).lean();
            res.status(200).json(user);
        }
        catch (error) {
            res.status(404).json({ error: error instanceof Error ? error.message : error });
        }
        ;
    };
    getUserFriends = async (req, res) => {
        try {
            const { id } = req.params;
            const user = await User.findById(id);
            if (!user) {
                res.status(400).json({ msg: "User was not found" });
                return;
            }
            const friendFields = ['_id', 'email', 'firstName', 'lastName', 'location', 'occupations', 'picturePath'];
            const friends = _.compact(await Promise.all(user.friends.map((friendId) => User.findById(friendId).select(friendFields).lean().exec())));
            console.log(friends);
            res.status(200).json(friends);
        }
        catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : error });
        }
    };
    addRemoveFriend = async (req, res) => {
        try {
            const { id, friendId } = req.params;
            const friendFields = ['_id', 'email', 'firstName', 'lastName', 'location', 'occupations', 'picturePath'];
            const userDoc = await User.findById(id);
            const friendDoc = await User.findById(friendId);
            if (!userDoc || !friendDoc) {
                res.status(404).json({ msg: "User was not found" });
                return;
            }
            const user = userDoc.toObject();
            const friend = friendDoc.toObject();
            const isFriend = user.friends.some(identifier => identifier === friendId);
            console.log({ isFriend });
            if (isFriend) {
                // Remove Friend From the list!
                user.friends = user.friends.filter(identifier => identifier != friendId);
                friend.friends = friend.friends.filter(identifier => identifier != id);
                userDoc.overwrite({ ...user, friends: user.friends });
                friendDoc.overwrite({ ...friend, friends: friend.friends });
            }
            else {
                // Add Friend to the list!
                user.friends.push(String(friend._id));
                friend.friends.push(String(user._id));
                userDoc.overwrite({ ...user, friends: user.friends });
                friendDoc.overwrite({ ...friend, friends: friend.friends });
            }
            // Save the new updated Data in this docs
            await userDoc.save();
            await friendDoc.save();
            const friends = _.compact(await Promise.all(user.friends.map((id) => User.findById(id).select(friendFields).lean().exec())));
            res.status(200).json(friends);
        }
        catch (error) {
            res.status(404).json({ error: error instanceof Error ? error.message : error });
        }
    };
}
