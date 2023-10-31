import mongoose,{Schema, Document} from 'mongoose';

export interface IPost {
    _id: Schema.Types.ObjectId
    userId: string;
    firstName:string;
    lastName:string;
    location:string;
    description:string;
    picturePath:string;
    userPicturePath:string;
    likes:{[key:string]: boolean};
    comments:string[]
}


const PostSchema:Schema<IPost & Document> = new Schema(
    {
        userId: {
            type: String,
            required:true
        },
        firstName: {
            type:Schema.Types.String,
            required:true,
        },
        lastName: {
            type:Schema.Types.String,
            required:true,
        },
        comments: {
            type: [String], 
            required: true,
            default: [],
        },
        location:String,
        description:String,
        picturePath:String,
        userPicturePath:String,
        likes: {
            type:Map,
            of:Boolean,
        }
    }, { timestamps: true }
);

const Post = mongoose.model('Post', PostSchema);

export default Post;