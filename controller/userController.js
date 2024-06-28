const mongoose = require('mongoose');
const authConfig = require("../configs/auth.config");
var newOTP = require("otp-generators");
const User = require("../model/userModel");




const ticketCode = async () => {
    var digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let OTP = '';
    for (let i = 0; i < 8; i++) {
        OTP += digits[Math.floor(Math.random() * 26)];
    }
    return OTP;
}

function generateNumericOTP(length) {
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += Math.floor(Math.random() * 10);
    }
    return otp;
}

exports.registration = async (req, res) => {
    try {
        const otp = generateNumericOTP(4);

        let user = await User.findOne();

        if (!user) {
            user = new User({
                otp: otp,
                key: await ticketCode()
            });
            await user.save();
            return res.status(201).send({ status: 201, message: "User created and OTP generated successfully", data: user });
        } else {
            user.otp = otp;
            user.key = await ticketCode();
            await user.save();
            return res.status(200).send({ status: 200, message: "OTP generated and saved successfully", data: user });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.verifyOtp = async (req, res) => {
    try {
        const { otp } = req.body;

        if (!otp) {
            return res.status(400).send({ status: 400, message: "OTP is required" });
        }

        const user = await User.findOne({ otp: otp });

        if (!user) {
            return res.status(404).send({ status: 404, message: "Invalid OTP" });
        }

        if (user.otpExpiration < Date.now()) {
            return res.status(400).send({ status: 400, message: "OTP has expired" });
        }

        return res.status(200).send({ status: 200, message: "OTP verified successfully", data: user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.getLatestOtp = async (req, res) => {
    try {
        const latestOtp = await User.findOne({ otp: { $exists: true } }).sort({ updatedAt: -1 });

        if (latestOtp) {
            return res.status(200).send({ status: 200, message: "Latest OTP retrieved successfully", data: latestOtp });
        } else {
            return res.status(404).send({ status: 404, message: "No OTP found" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

