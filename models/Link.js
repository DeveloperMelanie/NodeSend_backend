import mongoose from 'mongoose'

const LinkSchema = new mongoose.Schema(
    {
        url: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        originalName: {
            type: String,
            required: true,
        },
        downloads: {
            type: Number,
            default: 1,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        password: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
)

const Link = mongoose.model('Link', LinkSchema)

export default Link
