
// subject Model formation
const mongoose=require('mongoose');

const subjectSchema= mongoose.Schema({
    subCode:{
        type: String,
        unique: true,
    },
    subName:{
        type: String,
    },
    subFaculty:{
        type: String,
        ref:"users",
    },

},{timestamps: true});

const Subjects=mongoose.model("subject",subjectSchema);
module.exports=Subjects;

/*
    {
    "facultyId": "mckvie/faculty/001",
    
  }    
 */
