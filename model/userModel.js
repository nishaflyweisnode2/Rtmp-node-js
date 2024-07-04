const mongoose = require("mongoose");
const schema = mongoose.Schema;
var userSchema = new schema(
    {
        fullName: {
            type: String,
        },
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        },
        image: {
            type: String,
        },
        gender: {
            type: String,
        },
        dob: {
            type: String,
        },
        phone: {
            type: String,
        },
        alternatePhone: {
            type: String,
        },
        email: {
            type: String,
            minLength: 10,
        },
        password: {
            type: String,
        },
        address1: {
            type: String,
        },
        documentVerification: {
            type: Boolean,
        },
        otp: {
            type: String,
        },
        otpExpiration: {
            type: String,
        },
        key: {
            type: String,
        },
        userType: {
            type: String,
            enum: ["USER", "PARTNER", "ADMIN"],
        },
        status: {
            type: String,
            enum: ["Approved", "Reject", "Pending"],
        },
        verified: {
            type: Boolean,
            default: false
        },

    },
    { timestamps: true }
);
module.exports = mongoose.model("user", userSchema);
