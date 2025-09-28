import mongoose from "mongoose";
import { type } from "os";

const postSchema = new mongoose.Schema({
    title: { type: String, minlength: 5, maxlength: 30, required: true},
    content: {type: String, minlength:10, required: true},
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    hashtags: String,
    imageUrl: String,
    createdAt: {type: Date, default: Date.now},
    updatedAt: Date,
});

export default mongoose.model("Post", postSchema);
