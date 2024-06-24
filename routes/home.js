//home router=> '/'
const router = require('express').Router();
const User = require('../models/user');
router.get('/',(req,res)=>{ return res.redirect('/login');});
router.get('/login', (req, res) => {
    if(req.cookies.userToken) return res.redirect("/user/dashboard");
    return res.render("login");
});
router.get('/login/admin',(req,res)=>{
    if(req.cookies.adminToken){
        return res.redirect("/admin/register");
    }
    return res.render("login",{role: "admin"});
})
router.get('/downloads/uploads/notices/:id',(req,res)=>{
    const id=req.params.id;
    return res.download(id);
});
router.post('/login', async (req, res) => {
    const { userId, password, role } = req.body;
    console.log(userId);
    try {
        const token = await User.matchPasswordAndCreateToken(userId, password, role);
        // console.log("token"+token);
        if(role==="admin")
            return res.cookie('adminToken', token).redirect('/admin/register');
        return res.cookie('userToken', token).redirect('/user/dashboard');
    } catch (err) {
        return res.render('login',{
            error: "invalid credentials"
        })
    }
});


module.exports = router;