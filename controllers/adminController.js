const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('username');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getUserByUsername = async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username }).select('-password');
        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.deleteUser = async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOneAndDelete({ username });
        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }
        res.send('User deleted successfully');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

