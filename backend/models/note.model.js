const mongoose = require("mongoose");

const Schema = mongoose.Schema

const noteSchema = new Schema({
    title: { type:String , required: true},
    Content: {type: String , required: true},
    tags: { type: [String], default:[] },
    isPinned: {type: Boolean, default: false },
    userId: {type: String, required: true},
    createdOn: {type: Date, dafault:new Date().getTime()},
});

module.exports = mongoose.model("Note", noteSchema);