const otpModel = require("../model/Otp");
const userModel = require("../model/user");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendOTPEmail } = require("../utils/email");


const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

async function registerUser(req, res) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }

        let user = await userModel.findOne({ email });
        if (user?.isVerified) {
            return res.status(400).json({ message: 'User already exists' });
        }

        if (!user) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            user = await userModel.create({
                name,
                email,
                password: hashedPassword,
                role: 'user',
                isVerified: false
            });
        }

        const otp = generateOTP();
        await otpModel.deleteMany({ email, action: 'account_verification' });
        await otpModel.create({ email, otp, action: 'account_verification' });
        try {
            await sendOTPEmail(email, otp, 'account_verification');
        } catch {
            return res.status(503).json({
                message: 'Unable to send verification email. Please try again later.'
            });
        }

        res.status(201).json({
            message: 'OTP sent to email. Please verify.',
            email: user.email
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

async function loginUser (req, res){
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        if (!user.isVerified && user.role !== 'admin') {
            const otp = generateOTP();
            await otpModel.findOneAndDelete({ email: user.email, action: 'account_verification' });
            await otpModel.create({ email: user.email, otp, action: 'account_verification' });
            try {
                await sendOTPEmail(user.email, otp, 'account_verification');
            } catch {
                return res.status(503).json({
                    message: 'Unable to send verification email. Please try again later.'
                });
            }
            return res.status(403).json({ message: 'Account not verified', needsVerification: true, email: user.email });
        }

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user.id, user.role)
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

async function verifyOTP (req, res) {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }

        const validOTP = await otpModel.findOne({ email, otp, action: 'account_verification' });

        if (!validOTP) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        const user = await userModel.findOneAndUpdate({ email }, { isVerified: true }, { new: true });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await otpModel.deleteOne({ _id: validOTP._id });

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user.id, user.role)
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {registerUser, loginUser, verifyOTP}