const userService = require("../services/user.service.js")
const jwtProvider = require("../config/jwtProvider.js")
const bcrypt = require("bcrypt")
const cartService = require("../services/cart.service.js")
const emailService = require('../services/email.service.js')
const { sendOtpEmail } = require('../utils/emailUtility.js')
const moment = require('moment')


const register = async (req, res) => {

    try {
        const user = await userService.createUser(req.body);
        const jwt = jwtProvider.generateToken(user._id);

        await cartService.createCart(user);

        return res.status(200).send({ jwt, message: "register success" })

    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}
const login = async (req, res) => {
    const { password, email } = req.body
    try {
        const user = await userService.getUserByEmail(email);

        if (!user) {
            return res.status(404).json({ message: 'User not found With Email ', email });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const jwt = jwtProvider.generateToken(user._id);

        return res.status(200).send({ jwt, message: "login success" });

    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}
const getOtp = async (req, res) => {
    try {
        const { email } = req.body
        const user = await userService.getUserByEmail(email);
        let otp_time;
        const otp_number = Math.floor(Math.random() * 899999 + 100000);
        const emailTemplate = await emailService.fetchEmailTemplate('Authentication OTP');
        const Emailreplacedobject = {
            '{{otp}}': otp_number,
            '{{userName}}': user.firstName
        };

        otp_time = moment()
        const otp = {
            otp: otp_number,
            time: otp_time
        };
        const updateOtp = await userService.updateOtp(otp, email)
        await sendOtpEmail(
            email,
            emailTemplate,
            Emailreplacedobject
        )
        return res.status(200).send({
            msg: 'OTP mail has been sent to your email.',
            time: otp_time
        })

    } catch (error) {
        console.log('error', error)
    }

}
const otpValidaton = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const getotp = await userService.getUserByEmail(email);
        if (getotp?.active) {
            const otp_date = JSON.parse(getotp?.active);
            const date_validation = moment();
            const otp_parse = parseInt(otp, 10);
            const db_date = otp_date?.time;
            const seconds_difference = date_validation.diff(db_date, 'seconds');
            if (seconds_difference > 60 && otp_parse === otp_date?.otp) {
                return res.status(200).send({
                    msg: 'OTP Expired'
                });
            } else if (otp_parse === otp_date?.otp && seconds_difference <= 60) {
                // const encrypt_data = result[0][0];
                // const encryptedMetaValue = CryptoJS.AES.encrypt(JSON.stringify(encrypt_data)
                //   ,process.env.ACCESS_TOKEN);
                const jwt = jwtProvider.generateToken(getotp._id);
                return res.status(200).send({
                    msg: 'You are Logged In',
                    jwt,
                    role: getotp.role
                    //   token,
                    //   roles: roleName,
                    //   user: encryptedMetaValue.toString(),
                });
            } else {
                return res.status(200).send({
                    msg: 'Incorrect OTP'
                });
            }
        }
        else {
            return res.status(200).send({
                status: "No Existing OTP Field",
                data: []
            })
        }

    } catch (error) {
        console.log('error', error)
        return res.status(500).send({
            msg: error,
        });
    }
}
module.exports = { register, login, getOtp, otpValidaton }