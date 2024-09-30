const mongoose = require('mongoose');
const authConfig = require("../configs/auth.config");
var newOTP = require("otp-generators");
const User = require("../model/userModel");
const Meeting = require('../model/meetingModel');




const ticketCode = async () => {
    var digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let OTP = '';
    for (let i = 0; i < 8; i++) {
        OTP += digits[Math.floor(Math.random() * 26)];
    }
    return OTP;
}

const meetingCode = async () => {
    var digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    let OTP = '';
    for (let i = 0; i < 6; i++) {
        OTP += digits[Math.floor(Math.random() * 36)];
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
            user.verified = false;
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
        const { otp, verified } = req.body;

        if (!otp) {
            return res.status(400).send({ status: 400, message: "OTP is required" });
        }
        if (verified) {

        }
        const user = await User.findOne({ otp: otp });

        if (!user) {
            return res.status(404).send({ status: 404, message: "Invalid OTP" });
        }

        // if (user.otpExpiration < Date.now()) {
        //     return res.status(400).send({ status: 400, message: "OTP has expired" });
        // }

        if (verified) {
            user.verified = true;
            await user.save();
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
exports.createMeeting = async (req, res) => {
    try {
        const { title, description, participants, isStreaming, status } = req.body;

        const newMeeting = await Meeting.create({
            title,
            description,
            participants,
            code: await meetingCode(),
            isStreaming,
            status,
        });

        return res.status(201).json({
            status: 201,
            msg: 'Meeting created successfully',
            data: newMeeting,
        });
    } catch (error) {
        console.error('Error creating meeting:', error);
        return res.status(500).json({
            status: 500,
            msg: 'Server error',
            error: error.message,
        });
    }
};
exports.getAllMeetings = async (req, res) => {
    try {
        const meetings = await Meeting.find().sort({ createdAt: -1 });
        return res.status(200).json({
            status: 200,
            msg: 'Meetings fetched successfully',
            data: meetings,
        });
    } catch (error) {
        console.error('Error fetching meetings:', error);
        return res.status(500).json({
            status: 500,
            msg: 'Server error',
            error: error.message,
        });
    }
};
exports.getMeetingsByCode = async (req, res) => {
    try {
        const meetings = await Meeting.find({code:req.params.code}).sort({ createdAt: -1 });
        return res.status(200).json({
            status: 200,
            msg: 'Meetings fetched successfully',
            data: meetings,
        });
    } catch (error) {
        console.error('Error fetching meetings:', error);
        return res.status(500).json({
            status: 500,
            msg: 'Server error',
            error: error.message,
        });
    }
};
exports.getMeetingById = async (req, res) => {
    try {
        const meeting = await Meeting.findById(req.params.id);

        if (!meeting) {
            return res.status(404).json({
                status: 404,
                msg: 'Meeting not found',
            });
        }

        return res.status(200).json({
            status: 200,
            msg: 'Meeting fetched successfully',
            data: meeting,
        });
    } catch (error) {
        console.error('Error fetching meeting:', error);
        return res.status(500).json({
            status: 500,
            msg: 'Server error',
            error: error.message,
        });
    }
};
exports.updateMeeting = async (req, res) => {
    try {
        const updatedMeeting = await Meeting.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        if (!updatedMeeting) {
            return res.status(404).json({
                status: 404,
                msg: 'Meeting not found',
            });
        }

        return res.status(200).json({
            status: 200,
            msg: 'Meeting updated successfully',
            data: updatedMeeting,
        });
    } catch (error) {
        console.error('Error updating meeting:', error);
        return res.status(500).json({
            status: 500,
            msg: 'Server error',
            error: error.message,
        });
    }
};
exports.deleteMeeting = async (req, res) => {
    try {
        const result = await Meeting.deleteMany({});

        return res.status(200).json({
            status: 200,
            msg: 'All meetings deleted successfully',
            deletedCount: result.deletedCount,
        });
    } catch (error) {
        console.error('Error deleting meetings:', error);
        return res.status(500).json({
            status: 500,
            msg: 'Server error',
            error: error.message,
        });
    }
};
exports.joinMeeting = async (req, res) => {
    try {
        const { code, otp } = req.body;

        const meeting = await Meeting.findOne({ code });

        if (!meeting) {
            return res.status(404).json({
                status: 404,
                message: "Meeting not found",
            });
        }

        const isParticipant = meeting.participants.some(participant => participant.otp.toString() === otp);

        if (isParticipant) {
            return res.status(400).json({
                status: 400,
                message: "User is already a participant in this meeting",
            });
        } else {
            meeting.participants.push({ otp });

            if (meeting.participants.length > 1) {
                meeting.isStreaming = true;
            }

            await meeting.save();
        }

        return res.status(200).json({
            status: 200,
            message: "Joined the meeting successfully",
            data: meeting,
        });
    } catch (error) {
        console.error("Error in joinMeeting:", error);
        return res.status(500).json({
            status: 500,
            message: "Server error",
            error: error.message,
        });
    }
};
