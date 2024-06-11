import mongoose, { mongo } from "mongoose";

const ArticleSchema = new mongoose.Schema({
    image: {
        type: String,
        required: [true, "An image is required"],
    },
    title: {
        type: String,
        required: [true, "A title is required"],
    },
    subtitle: {
        type: String,
        required: [true, "A subtitle is required"],
    },
    tags: {
        type: [
            {
                type: String,
                minlength: 2,
                maxlength: 20,
                trim: true
            }
        ],
        required: [true, "At least one tag is required"],
    },
    main: {
        type: String,
        required: [true, "The main part of the article is required"],
        minlength: 300,
        maxlength: 10000,
    },
    likes: {
        type: Number,
        default: 0,
    },
    date: {
        type: Date,
        default: Date.now, // Sets the default value to the current date and time
    },
    author: {
        type: String, // author _id
        required: [true, "An author is required"],
    }
})

const Article = mongoose.model('Article', ArticleSchema);

export default Article;