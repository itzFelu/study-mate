// user router
const express = require('express');
const multer = require('multer');
const Path = require('path');
const User = require('../models/user');
const UniDetails = require('../models/uniDetails');
const Notice = require('../models/notice');
const MentorNotice = require('../models/mentorNotice');
const MentorAlloc = require('../models/mentorAlloc');
const Subjects = require('../models/subject');
const { validateToken } = require('../services/authentication');
const { uploadFile } = require('../utils/cloudinary');
const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, "./public/uploads/notices");
    },
    filename: async function (req, file, cb) {
        const data = await Notice.find({});
        const sl = data.length + 1;
        const date = new Date().toLocaleDateString('en-GB').replaceAll("/", "-");
        const fileName = sl + '_' + date + '_' + file.originalname;
        console.log(fileName);
        return cb(null, fileName);

        // return cb(null,`${date}_(${Date.now()})_${file.originalname}`);
    }
})
const upload = multer({ storage })

router.post('/newNotice', upload.single("attachment"), async (req, res) => {
    const payload = validateToken(req.cookies.userToken);
    try {
        const { title } = req.body;
        const { path, filename } = req.file;
        const date = new Date();
        const response = await uploadFile(path);
        console.log(response);
        const entry = await Notice.create({
            sl: Number(filename.charAt(0)),
            title,
            path: response.secure_url,
            date,
            createdBy: payload._id,
        })
        console.log(entry);
        // console.log(title+" ");
        // console.log(req.file);

        return res.render("newNotice", {user:payload, message: "notice uploaded successfully" });
    } catch (error) {
        console.log(error);
    }
    return res.render("newNotice", { error: "problem posting notice" });
})
router.post('/mentorQuery', async (req, res) => {
    const payload = validateToken(req.cookies.userToken);
    if (!payload.mentorId) {
        console.log("no mentor assigned");
        return res.redirect('/user/mentor');
    }
    try {
        let response = await User.findOne({ collegeId: payload.mentorId });
        const mentor = {
            name: response.name,
            email: response.email,
            profileImageUrl: response.profileImageUrl,
        }
        const { query } = req.body;
        if (!query) throw new Error("no query input");
        // query=`Dated:${new Date().toLocaleDateString('en-GB').replaceAll("/","-")} ${query}`;
        console.log(query);
        const alloc = await MentorAlloc.findOne({ facultyId: payload.mentorId });
        // alloc.studentIds.push(payload.userId);
        alloc.queries.push({ sentBy: payload.userId, query: query, date: new Date() });
        console.log(alloc);
        const result = await MentorAlloc.findOneAndUpdate({ facultyId: payload.mentorId }, {
            queries: alloc.queries,
        })
        return res.render("mentor", { user: payload, mentor, message: "query sent to mentor successfully" });
    } catch (err) {
        return res.render("mentor", { user: payload, mentor, error: err.message });
    }

})
router.get('/test', (req, res) => {
    console.log(Path);
    return res.end("test");
})
router.get('/logout', (req, res) => {
    console.log('/logout');
    return res.clearCookie('userToken').redirect("/login");
})
router.get('/dashboard', (req, res) => {
    // console.log(req.url);
    const payload = validateToken(req.cookies.userToken);
    return res.render("dashboard", { user: payload });
})
router.get('/uniDetails', async (req, res) => {
    // the can be fetched from a different collection name uniDetails
    // it will be easier to handle two different things
    const payload = validateToken(req.cookies.userToken);
    if (payload.role != "student") return res.end("unauthorised");
    // console.log(payload);
    try {
        let user = await UniDetails.findOne({ collegeId: payload.userId });
        if (!user) throw new Error("Enrollment has not been Done Yet");
        user.name = payload.name;
        console.log(user);
        return res.render("uniDetails", { user });
    } catch (error) {
        console.log(error.message);
        return res.render("uniDetails", { user: payload, error: error.message });
    }

})
router.get('/mentor', async (req, res) => {
    const payload = validateToken(req.cookies.userToken);
    try {
        let response = await User.findOne({ collegeId: payload.mentorId });
        const mentor = {
            name: response.name,
            email: response.email,
            profileImageUrl: response.profileImageUrl,
        }
        return res.render("mentor", { user: payload, mentor });
    } catch (error) { }
    // console.log(mentor,response);
    return res.render("mentor", { user: payload, mentor: { err: "no mentor assigned for the time being" } });
})
router.get('/ebook', (req, res) => {
    const payload = validateToken(req.cookies.userToken);
    return res.render("ebook", { user: payload });
})

router.get('/notice', async (req, res) => {
    const user = validateToken(req.cookies.userToken);
    const data = await Notice.find({});
    console.log(data);
    console.log(user + " trying to access NOTICE");
    return res.render("notice", {
        user,
        data,
    });
})
router.get('/newNotice', (req, res) => {
    const user = validateToken(req.cookies.userToken);
    if (user.subRole != "HOD") return res.end("unauthorised");
    return res.render("newNotice", { user });
})
router.get('/mentorship', async (req, res) => {
    const user = validateToken(req.cookies.userToken);
    if (user.role != "faculty") return res.end("unauthorised");
    try {
        const { queries: data } = await MentorAlloc.findOne({ facultyId: user.userId });
    let nameArr = [];
    for (let i = 0; i < data.length; i++) {
        const { name } = await User.findOne({ collegeId: data[i].sentBy });
        nameArr.push(name);
    }
    // console.log(nameArr);
    // console.log(data);
    return res.render("mentorshipFaculty", { user, data: data, nameArr });
    } catch (error) {
        return res.render("mentorshipStudentList", {user, error: error.message });
    }
})
router.get('/mentorship/studentlist', async (req, res) => {
    const user = validateToken(req.cookies.userToken);
    if (user.role != "faculty") return res.end("unauthorised");
    try {
        const { studentIds } = await MentorAlloc.findOne({ facultyId: user.userId });
        const result = await User.find({ collegeId: studentIds })
        console.log(result);
        let data = [];
        for (let i = 0; i < result.length; i++) {
            data.push({
                name: result[i].name,
                email: result[i].email,
                collegeId: result[i].collegeId,
            });
        }
        return res.render("mentorshipStudentList", {user, data });
    } catch (error) {
        return res.render("mentorshipStudentList", {user, error: error.message });
    }
})
router.get('/mentor/mentorNoticeStudent', async(req,res)=>{
    const user = validateToken(req.cookies.userToken);
    const {notices: data} = await MentorNotice.findOne({facultyId: user.mentorId});
    console.log(data);
    return res.render("mentorNoticeStudent",{user,data});
})
router.get('/mentorship/putupnotice',(req,res)=>{
    const user = validateToken(req.cookies.userToken);
    return res.render("mentorNotice",{user});
})

const mentorStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, "./public/uploads/mentorNotices");
    },
    filename: async function (req, file, cb) {
        const user = validateToken(req.cookies.userToken);
        const data = await MentorNotice.findOne({facultyId:user.userId});
        const sl = data.notices.length + 1;
        const date = new Date().toLocaleDateString('en-GB').replaceAll("/", "-");
        const fileName = sl + '_' + date + '_' + file.originalname;
        console.log(fileName);
        return cb(null, fileName);
        // return cb(null,`${date}_(${Date.now()})_${file.originalname}`);
    }
})
const mentorUpload = multer({ storage: mentorStorage })
router.post('/mentorship/putupnotice', mentorUpload.single("attachment"),async (req,res)=>{
    const user = validateToken(req.cookies.userToken);
    try {
        const { title } = req.body;
        const { path, filename } = req.file;
        const date = new Date();
        const response = await uploadFile(path);
        console.log(response);
        const {notices} = await MentorNotice.findOne({facultyId:user.userId});
        notices.push({
            sl: Number(filename.charAt(0)),
            title,
            path: response.secure_url,
            date,
            createdBy: user._id,
        })

        const entry = await MentorNotice.findOneAndUpdate({facultyId: user.userId},{notices})
        console.log(entry);
        // console.log(title+" ");
        // console.log(req.file);
        return res.render("mentorNotice", {user, message: "notice uploaded successfully" });
    } catch (error) {
        console.log(error.message);
        return res.render("mentorNotice",{user, error: "problem posting notice"});
    }
})
router.get('/hodActions',(req,res)=>{
    const user = validateToken(req.cookies.userToken);
    return res.render("hodActions",{user});
})
router.get('/hodActions/subjectAssignment',(req,res)=>{
    const user = validateToken(req.cookies.userToken);
    return res.render("subjectAssignment",{user});
})
router.post('/hodActions/subjectAssignment',async(req,res)=>{
    const user = validateToken(req.cookies.userToken);
    const {typeofaction, subCode, subName, subFaculty} = req.body;
    try {
        if(typeofaction=="createNew"){
            const ret= await Subjects.create({subCode, subName, subFaculty});
            console.log(ret);
        }else{
            const ret= await Subjects.findOneAndUpdate({subCode,}, {subName, subFaculty});
            console.log(ret);
        }
        return res.render("subjectAssignment",{user,message:"success"});
    } catch (error) {
        console.log(error.message);
        return res.render("subjectAssignment",{user,error:"failure"});
    }
})
router.get('/hodActions/subjectList',async (req,res)=>{
    const user = validateToken(req.cookies.userToken);
   try {
        const data= await Subjects.find({});
        console.log(data);
        return res.render("subjectList",{user,data});
   } catch (error) {
        console.log(error.message);
        return res.render("subjectList",{user,error:"something went wrong"});
   }
})
router.get('*', (req, res) => {
    console.log(req.url + " unable to reach");
    const payload = validateToken(req.cookies.userToken);
    return res.render('workInProgress', { user: payload });
});
module.exports = router;