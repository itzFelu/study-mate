const { error } = require('console');
const {createHmac, randomBytes}=require('crypto');
const {creteUserToken}=require('../services/authentication');
const mongoose=require('mongoose');

const userSchema=mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    gender:{
        type: String,
        enum:['male','female','others'],
    },
    dob:{
        type: Date,
        required: true,
    },
    email:{
        type: String,
        unique: true,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    collegeId:{
        type: String,
        required: true,
    },
    role:{
        type: String,
        enum: ['student','faculty','admin'],
        required: true,
    },
    subRole:{
        type:String,
        enum: ['HOD','TIC','NA']
    },
    salt:{
        type:String
    },
    profileImageUrl: {
        type: String,
        default: "../images/default_avatar.png"
    },
    about:{
        type: String
    }
},{timestamps: true}) 

userSchema.pre('save', function(next) {
    const user=this;
    if(!user.isModified("password")) return;

    const salt=randomBytes(16).toString();
    const hashedPassword= createHmac('sha256',salt)
        .update(user.password)
        .digest("hex");
    this.salt=salt;
    this.password=hashedPassword;
    next();
})
userSchema.static("matchPasswordAndCreateToken", async function(userId, password, role){
    const user= await this.findOne({collegeId: userId, role});
    // console.log(user);
    if(!user) throw new Error("invalid credentials") ;
    const salt= user.salt;
    const hashedPassword=user.password;
    const userProvidedPassword=createHmac("sha256",salt).update(password).digest("hex");
    // console.log(hashedPassword+" "+userProvidedPassword);
    if(hashedPassword!=userProvidedPassword)
        throw new Error("invalid password");

    const token=creteUserToken(user);
    return token;
})

const User=mongoose.model('user',userSchema);

module.exports= User;