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
 eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjMxZDUwYWM5YjcxYjA3NGZjM2VjMTAiLCJ1c2VySWQiOiJidGVjaC9jc2UvMjAyMC8wMzEiLCJlbWFpbCI6InBoZWx1c3VrYW50YTExQGdtYWlsLmNvbSIsInByb2ZpbGVJbWFnZVVybCI6Ii4uL2ltYWdlcy9kZWZhdWx0X2F2YXRhci5wbmciLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTcxNDU2NTg3N30.0YwW-M1IUepwaeT0FqNG0BZKcx4Sk1fWu-Eyc91eYbY
 */