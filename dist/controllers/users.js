import User from 'models/User.js';
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
            const friendFields = ['_id', 'email', 'firstName', 'lastName', 'location', 'occupations'];
            const friends = _.compact(await Promise.all(user.friends.map((id) => User.findById(id).select(friendFields).lean().exec())));
            res.status(200).json(friends);
        }
        catch (error) {
        }
    };
    addRemoveFriend = async (req, res) => {
        try {
            const { id, friendId } = req.params;
            const friendFields = ['_id', 'email', 'firstName', 'lastName', 'location', 'occupations'];
            const user = await User.findById(id).lean();
            const friend = await User.findById(friendId).lean();
            if (!user || !friend) {
                res.status(404).json({ msg: "User was not found" });
                return;
            }
            if (user.friends.includes(friendId)) {
                user.friends = user.friends.filter(id => friendId);
                friend.friends = friend.friends.filter(identifier => id == identifier);
            }
            else {
                user.friends.push(friendId);
                friend.friends.push(id);
            }
            await (new User(user)).save();
            await (new User(friend)).save();
            const friends = _.compact(await Promise.all(user.friends.map((id) => User.findById(id).select(friendFields).lean().exec())));
            res.status(200).json(friends);
        }
        catch (error) {
            res.status(404).json({ error: error instanceof Error ? error.message : error });
        }
    };
}
