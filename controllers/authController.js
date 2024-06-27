const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');
const sendEmail = require('../utils/sendEmail');

exports.registerUser = async (req, res) => {
    const { email, username, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        user = new User({ email, username, password });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.otp = Math.floor(100000 + Math.random() * 900000).toString();
        await user.save();
        await sendEmail(user.email, 'Verify your email', `Your OTP is ${user.otp}`);
        res.send('User registered. Please check your email for OTP.');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.verifyUser = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        if (user.otp !== otp) {
            return res.status(400).json({ msg: 'Invalid OTP' });
        }
        user.isVerified = true;
        user.otp = null;
        await user.save();
        res.send('User verified successfully');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.registerAdmin = async (req, res) => {
    const { email, username, password } = req.body;
    try {
        let admin = await Admin.findOne({ email });
        if (admin) {
            return res.status(400).json({ msg: 'Admin already exists' });
        }
        admin = new Admin({ email, username, password });
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(password, salt);
        await admin.save();
        res.send('Admin registered successfully');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        const payload = { admin: { id: admin.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

