const exp = require('constants')
const express = require('express')
const path=require('path')
const app=express()

app.use(express.static('./front-end/'))
app.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname, '/front-end/login.html'))
})
app.get('/dashboard',(req,res)=>{
    res.sendFile(path.join(__dirname, '/front-end/dashboard.html'))
})
app.get('/notice',(req,res)=>{
    res.sendFile(path.join(__dirname, '/front-end/notice.html'))
})
app.get('/uniDetails',(req,res)=>{
    res.sendFile(path.join(__dirname, '/front-end/uniDetails.html'))
})
app.get('/marks',(req,res)=>{
    res.sendFile(path.join(__dirname, '/front-end/marks.html'))
})
app.get('/mentor',(req,res)=>{
    res.sendFile(path.join(__dirname, '/front-end/mentor.html'))
})
app.get('/eBook',(req,res)=>{
    res.sendFile(path.join(__dirname, '/front-end/ebook.html'))
})

app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname, '/front-end/workInProgress.html'))
})
app.listen(4590,()=>{
    console.log('server is listening to port 4590\nopen localhost:4590 in the web browser')
})