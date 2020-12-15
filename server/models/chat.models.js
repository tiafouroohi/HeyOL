const mongoose = require ('mongoose');

const ChatSchema = new mongoose.Schema({
    name: {
        type: String,

    }

}, {timestamps: true});

const Chat = mongoose.model("Chat", ChatSchema)

module.exports = {
    Chat
}