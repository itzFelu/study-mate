const {creteUserToken}=require('../services/authentication');
const mongoose=require('mongoose');

const noticeSchema=mongoose.Schema({
    sl:{
        type: Number,
    },
    title:{
        type: String,
        required: true,
    },
    path:{
        type: String,
        required: true,
        unique: true,
    },
    date:{
        type: Date,
    },
    createdBy:{
        type: mongoose.Schema.ObjectId,
        ref: "users"
    },
},{timestamps: true});

const mentorNoticeSchema= mongoose.Schema({
    facultyId:{
        type: String,
        required: true,
        ref: "users",
    },
    notices:[
         noticeSchema,
    ]
},{timestamps: true});

const MentorNotice=mongoose.model("mentornotice",mentorNoticeSchema);

module.exports=MentorNotice;