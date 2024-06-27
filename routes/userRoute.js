const auth = require("../controller/userController");
const express = require("express");
const router = express()
module.exports = (app) => {
    app.post('/api/v1/user/registration', auth.registration);
    app.get('/api/v1/user/otp/latest', auth.getLatestOtp);
    app.post('/api/v1/user/otp/verify', auth.verifyOtp);

}