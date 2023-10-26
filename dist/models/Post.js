import mongoose, { Schema } from 'mongoose';
const PostSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    firstName: {
        type: Schema.Types.String,
        required: true,
    },
    lastName: {
        type: Schema.Types.String,
        required: true,
    },
    location: String,
    description: String,
    picturePath: String,
    userPicturePath: String,
    likes: {
        type: Map,
        of: Boolean,
    },
    comments: {
        types: Array,
        default: [],
    }
}, { timestamps: true });
const Post = mongoose.model('Post', PostSchema);
export default Post;
