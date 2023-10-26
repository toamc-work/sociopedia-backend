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
    likes:Map<string, boolean>;
    comments:[]
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
        location:String,
        description:String,
        picturePath:String,
        userPicturePath:String,
        likes: {
            type:Map,
            of:Boolean,
        },
        comments: {
            types: Array,
            default: [],
        }
    }, { timestamps: true }
);

const Post = mongoose.model('Post', PostSchema);

export default Post;