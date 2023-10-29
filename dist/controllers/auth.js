import bcrypt from 'bcrypt';
import _ from 'lodash';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
export class AuthController {
    '@path';
    constructor() {
        this['@path'] = '/auth';
    }
    register = async (req, res) => {
        try {
            const { firstName, lastName, email, password, picturePath, friends, location, occupations, } = req.body;
            const salt = await bcrypt.genSalt();
            const passwordHash = await bcrypt.hash(password, salt);
            const newUser = new User({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: passwordHash,
                picturePath: picturePath,
                friends: friends,
                location: location,
                occupations: occupations,
                viewedProfile: Math.floor(Math.random() * 10000),
                impressions: Math.floor(Math.random() * 10000),
            });
            const saveUser = await newUser.save();
            res.status(201).json(_.omit(saveUser, 'password'));
        }
        catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : error });
        }
        ;
    };
    login = async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email: email }).lean();
            if (user === null) {
                res.status(400).json({ msg: "User does not exists" });
                return;
            }
            ;
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                res.status(400).json({ msg: "Invalid credentials" });
                return;
            }
            ;
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET ?? '');
            res.status(200).json({ user: _.omit(user, 'password'), token: token });
        }
        catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : error });
        }
        ;
    };
}
