const UniDetails = require('../models/uniDetails');
const jwt = require('jsonwebtoken');
const secret = "felu@RSMY#2024";

async function creteUserToken(user) {
    // console.log(user);
    let response = await UniDetails.findOne({ collegeId: user.collegeId });
    // console.log(response);
    const payload = {
        name: user.name,
        _id: user.id,
        userId: user.collegeId,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        role: user.role,
        subRole: user.subRole,
        mentorId: response?.mentorId
    };
    const token = jwt.sign(payload, secret);
    return token;
}
function validateToken(token) {
    const payload = jwt.verify(token, secret);
    return payload;
}

module.exports = {
    creteUserToken,
    validateToken,
}