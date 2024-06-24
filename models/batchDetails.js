
// subject Model formation
const mongoose=require('mongoose');

const batchDetailsSchema= mongoose.Schema({
    batch:{
        type:String,
        required: true,
        unique: true,
    },
    studentList:[String]

},{timestamps: true});

const BatchDetails=mongoose.model("batchdetail",batchDetailsSchema);
module.exports=BatchDetails;

/*
    {
    "facultyId": "mckvie/faculty/001",
    
  }    
 */
