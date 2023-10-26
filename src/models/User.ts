import mongoose, {Schema, Document} from 'mongoose';

export interface IUser{
    _id: Schema.Types.ObjectId;
    firstName:string;
    lastName:string;
    email:string;
    password:string;
    picturePath:string;
    friends: any[];
    location:string;
    occupations:string;
    viewedProfile:number;
    impressions:number;

}  

const UserSchema:Schema<IUser & Document> = new Schema(
    {
        firstName: {
            type:Schema.Types.String,
            required:true,
            min:2,
            max:50,
        },
        lastName: {
            type:Schema.Types.String,
            required:true,
            min:2,
            max:50,
        },
        email: {
            type: Schema.Types.String,
            required:true,
            max:50,
            unique:true,
        },
        password: {
            type: Schema.Types.String,
            required: true,
            min:5,
        },
        picturePath: {
            type: Schema.Types.String,
            default: "",
        },
        friends: {
            type: [],
            default: [],
        },

        location: Schema.Types.String,
        occupations: Schema.Types.String,
        viewedProfile: Schema.Types.Number,
        impressions: Schema.Types.Number,
    }, { timestamps:true }
);

const User = mongoose.model('User', UserSchema)

export default User;