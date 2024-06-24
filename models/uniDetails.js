const mongoose=require('mongoose');

const uniDetailsSchema=mongoose.Schema({
    collegeId:{
        type: String,
        required: true,
        unique:true,
        ref:'users'
    },
    gender:{
        type: String,
        enum:['male','female','others'],
        required: true,
    },
    uniRoll:{
        type: Number,
        unique: true,
        required: true,
    },
    uniReg:{
        type: Number,
        unique: true,
        required: true,
    },
    yearOfReg:{
        type: String,
        required: true,
    },
    batch:{
        type: String,
        required: true,
    },
    currSemester:{
        type: Number,
        // enum:['first','second','third','fourth','fifth','sixth','seventh','eight'],
        required: true,
    },
    mentorId:{
        type: String,
        ref: "users",
    }
    // currListOfSubjects:{
    //     type: [String]
    // }
})

const uniDetails = mongoose.model('uniDetails',uniDetailsSchema);

module.exports=uniDetails;