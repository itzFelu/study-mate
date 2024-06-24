
const { query } = require('express');
const mongoose=require('mongoose');

const mentorAllocSchema=mongoose.Schema({
    facultyId:{
        type: String,
        ref:"users",
    },
    studentIds:[String],
    queries:[
        {
            sentBy:{
                type:String,
                ref: "users",
            },
            query:{
                type:String,
            },
            date:{
              type: Date
            }
        }
    ],

},{timestamps: true});

const MentorAlloc=mongoose.model("mentorAlloc",mentorAllocSchema);
// console.log(MentorAlloc);
module.exports=MentorAlloc;

/*
    {
    "facultyId": "mckvie/faculty/001",
    "students": [
      "btech/cse/2020/031",
      "btech/cse/2020/012",
      "btech/cse/2020/005",
      "btech/cse/2020/022",
      "btech/cse/2021/001"
    ],
    "queries": [
      {
        "sentBy": "btech/cse/2020/031",
        "message": "I have problem with my college life"
      },
      {
        "sentBy": "btech/cse/2020/012",
        "message": "Assignments ka bohot pressure chal raha, do something please"
      }
    ]
  }    
 */
