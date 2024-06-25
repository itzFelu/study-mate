const{validateToken}=require('../services/authentication');
function checkForAuthenticationCookie(cookieName) {
    return (req,res,next)=>{
        const token=req.cookies[cookieName];
        // console.log(token);
        if(!token) return res.render('login');
        try {
            const payload=validateToken(token);
            req.user=payload;
            return next();
        } catch (error) {
            return res.render('login');
        }
        // console.log(JSON.stringify(user));
        
    };
}
function printUrl(){
    return(req,res,next)=>{
        console.log(req.url);
        return next();
    }
}
function checkUserRole(role) {
    return (req,res,next)=>{
        try {
            const user=validateToken(req.cookies.userToken);
            if(user.role===role) return next();
        } catch (error) {}
        return res.redirect(req.url);
    }
}
// function checkAuth(cookieName) {
//     return(req,res,next)=>{
//         const token=req.cookies[cookieName];
//         if(!token) return res.render("login");
//         try {
//             const payload=validateToken(token);
//             // console.log(payload);
//             req.user=payload;
//             return next();
//         } catch (error) {
//             return next();
//         }
//     }
// }

module.exports={
    printUrl,
    checkForAuthenticationCookie,
    checkUserRole,
    // checkAuth,
};

/**
 
 */