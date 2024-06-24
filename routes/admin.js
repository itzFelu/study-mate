// admin
const User = require('../models/user');
const uniDetails = require('../models/uniDetails');
const MentorAlloc = require('../models/mentorAlloc');
const BatchDetails = require('../models/batchDetails');
const{validateToken}=require('../services/authentication');
const MentorNotice = require('../models/mentorNotice');
const router=require('express').Router();

router.get('/',(req,res)=>{
    return res.end("admin home");
});
router.get('/logout',(req,res)=>{
    return res.clearCookie("adminToken").redirect('/login/admin');
})
router.get('/register', (req, res) => {
    const payload=validateToken(req.cookies.adminToken);
    return res.render("admin",{user: payload});
})
router.get('/UpdateUniDetails', (req, res) => {
    const payload=validateToken(req.cookies.adminToken);
    return res.render("updateUniDetails",{user: payload});
})
router.post('/UpdateUniDetails',async (req,res)=>{
    const payload=validateToken(req.cookies.adminToken);
    const {collegeId, gender, uniRoll, 
        uniReg, yearOfReg, batch ,currSemester,mentorId
    }=req.body;
    
    console.log(collegeId+" "+currSemester+" "+yearOfReg);
    //  updating batchDetails collection with newly enrolled student
    try {
        let val= await User.findOne({collegeId:mentorId});
        if(!val) return res.render("updateUniDetails",{user: payload,error:"failure: Invalid Mentor Teacher Id"});
        let temp= await BatchDetails.findOne({batch});
        if(!temp){
            await BatchDetails.create({batch,studentList:[collegeId]});
        }else{
            temp=temp.studentList;
            temp.push(collegeId);
            await BatchDetails.findOneAndUpdate({batch},{studentList: temp});
        }
    } catch (error) {
        console.log(err);
        return res.render("updateUniDetails",{user: payload,error:"failure: "+err.message});
    }
    // uniDetails created: updating part is pending
    try {
        const response= await uniDetails.create({
            collegeId, gender, uniRoll, 
            uniReg, yearOfReg, currSemester, mentorId, batch
        });
        console.log(response);

        // mentorAllocs upadate
        console.log(mentorId);
        const alloc= await MentorAlloc.findOne({facultyId: mentorId});
        console.log("alloc->"+alloc);
        let temp1=alloc.studentIds;
        if(!temp1) temp1=[collegeId];
        else temp1.push(collegeId);
        console.log(temp1+"boo"+collegeId);
        const result= await MentorAlloc.findOneAndUpdate({facultyId:mentorId},{
            studentIds: temp1,
        })
        console.log(result);
        return res.render("updateUniDetails",{user: payload,message:"successfully updated the data"});
    } catch (err) {
        console.log(err);
        return res.render("updateUniDetails",{user: payload,error:"failure: "+err.message});
    }
})
router.get('/allUsers',async(req,res)=>{
    const payload=validateToken(req.cookies.adminToken);
    let arr= await User.find({role: "student"});
    arr=arr.concat(await User.find({role: "faculty"}));
    arr=arr.concat(await User.find({role: "admin"}));
    console.log(arr);
    return res.render("allUsers",{user:payload, data: arr});
})
router.post('/user', async (req, res) => {
    const payload=validateToken(req.cookies.adminToken);
    try {
        const {
            name, collegeId, email, dob, role, subRole, gender
        } = req.body;
        const arr = dob.split('-');
        const dobPass = arr[2] + arr[1] + arr[0];
        if (name && collegeId && email && dob && role) {
            await User.create({ name, collegeId, email,gender, dob, role, password: dobPass, subRole });
        }
        if(role=='faculty'){
            const returnData=await MentorAlloc.create({
                facultyId: collegeId,
                studentIds: [],
                queries: [],
            })
            console.log(returnData);
            const ret=await MentorNotice.create({
                facultyId: collegeId,
                notices:[],
            })
            console.log("mentorNotice collection created"+ret);
        }
        return res.render("admin",{user: payload, message:"User Created successfully"});
    } catch (error) {return res.render("admin",{user: payload, err:`failed to create:${error.message}`});}
})

module.exports=router;