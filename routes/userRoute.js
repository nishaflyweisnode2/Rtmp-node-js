const auth = require("../controller/userController");
const express = require("express");
const router = express()
module.exports = (app) => {
    app.post('/api/v1/user/registration', auth.registration);
    app.get('/api/v1/user/otp/latest', auth.getLatestOtp);
    app.post('/api/v1/user/otp/verify', auth.verifyOtp);
    app.post('/api/v1/user/meetings', auth.createMeeting);
    app.get('/api/v1/user/meetings', auth.getAllMeetings);
    app.get('/api/v1/user/meetings/bycode/:code', auth.getMeetingsByCode);
    app.get('/api/v1/user/meetings/:id', auth.getMeetingById);
    app.put('/api/v1/user/meetings/:id', auth.updateMeeting);
    app.delete('/api/v1/user/meetings/removeall', auth.deleteMeeting);
    app.post('/api/v1/user/meetings/join', auth.joinMeeting);

}