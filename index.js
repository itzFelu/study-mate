const express=require('express');
const mongoose=require('mongoose');
const cookieParser=require('cookie-parser');
const User = require('./models/user');

const {checkForAuthenticationCookie, printUrl}=require('./middlewares/authentication');
const userRouter=require('./routes/user');
const adminRouter=require('./routes/admin');
const homeRouter=require('./routes/home');
const connectionString=`confidential`
mongoose.connect(connectionString)
    .then((err)=>{
        console.log("mongoDb connected");
    })
const PORT=8004;
const app=express();
// app.get('/faculty',(req,res)=>{return res.render("faculty"); });

app.set('view engine','ejs');
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(express.static('./public'));
app.use(cookieParser());

app.use('/',printUrl(),homeRouter);
// app.use(checkForAuthenticationCookie("token"));
app.use('/user',printUrl(),checkForAuthenticationCookie("userToken"),userRouter);
app.use('/admin',printUrl(),checkForAuthenticationCookie("adminToken"),adminRouter);

app.get('*',printUrl(), (req, res) => {
    return res.render('workInProgress');
});
app.listen(PORT,()=>{
    console.log("app is listening to http://localhost:"+PORT);
})


/* Admin Creation purpose*/
// app.get('/api/adminCreate',async (req, res) => {
//     // const {
//     //     name, collegeId, email, dob, role
//     // } = req.body;
//     const name="Study Admin";
//     const collegeId="mckvie/admin/001";
//     const email="admin@mail.com";
//     const dob='2002-01-01';
//     const role="admin";
//     console.log(name+collegeId+email+dob);
//     const arr = dob.split('-');
//     const dobPass = arr[2] + arr[1] + arr[0];
//     try {
//         if (name && collegeId && email && dob && role) {
//             await User.create({ name, collegeId, email, dob, role, password: dobPass });
//             return res.json({status: "success"});
//         }else{
//             throw new Error("insufficient credentials");
//         }
//     } catch (err) {
//         console.log(err);
//     }
//     return res.json({status: "failure"});
// });