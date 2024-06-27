const User = require('../models/User');

exports.addUserInfo = async (req, res) => {
    const { location, age, work, dob, description } = req.body;
    try {
        let user = await User.findById(req.user.id);
        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }
        user.location = location;
        user.age = age;
        user.work = work;
        user.dob = dob;
        user.description = description;
        await user.save();
        res.send('User information updated successfully');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.updateUserInfo = async (req, res) => {
    const { location, age, work, dob, description } = req.body;
    try {
        let user = await User.findById(req.user.id);
        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }
        if (location) user.location = location;
        if (age) user.age = age;
        if (work) user.work = work;
        if (dob) user.dob = dob;
        if (description) user.description = description;
        await user.save();
        res.send('User information updated successfully');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

