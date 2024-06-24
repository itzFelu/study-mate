
// subject Model formation
const mongoose=require('mongoose');

const semesterDetailsSchema= mongoose.Schema({
    batch:{
        type:String,
        required: true,
    },
    currentSemester:{
        type: Number,
        required: true,
    },
    mandatorySubjects:[String], // subjectCodes,
    electiveSubjects: [
        {
            subjectCode: String,
            studentList: [String],  //studentIds who have choosen those subs
        }
    ]

},{timestamps: true});

const SemesterDetails=mongoose.model("semesterdetail",semesterDetailsSchema);
module.exports=SemesterDetails;

/*
    {
    "facultyId": "mckvie/faculty/001",
    
  }    
 */
