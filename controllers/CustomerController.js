const bcrypt = require("bcrypt");
const { customer } = require("../models");
const { sign } = require("jsonwebtoken");

// signup
exports.signup = async (req, res) => {
    const profile = req.body;
    const user = await customer.findOne({ where: { email: profile.email }});
    if (user) {
        // check if user already exists
        res.status(400).json("Email already taken!");
    } else {
        // create account, hashing password
        bcrypt.hash(profile.password, 10).then(async (hash) => {
            await customer.create({
                firstName: profile.firstName,
                lastName: profile.lastName,
                email: profile.email,
                password: hash, // hash password
                dob: profile.dob,
                phone: profile.phone,
                preferences: profile.preferences,
            });
            res.status(200).json("Customer created succesfully!");
        });
    }
};

// login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    
    // check if user even exists
    const user = await customer.findOne({ where : { email: email }});
    if (!user) { 
        res.status(400).json({ error: "Incorrect email or password." });
    } else {
        // check if email and password match
        bcrypt.compare(password, user.password).then(async (match) => {
            if (!match) {
                res.status(400).json({ error: "Incorrect email or password." });
            } else {
                // generate token for login if successful
                const accessToken = sign(
                    { email: user.email, id: user.id }, 
                    "secretString",
                );
                user.rememberToken = accessToken;
                await user.save();
                res.status(200).json(accessToken);
            }
        });
    }
};

// change password
exports.changePassword = async (req, res) => {
    const { accessToken } = req.header;
    const { oldPassword, newPassword } = req.body;
    const user = await customer.findOne({ where: { rememberToken: accessToken }});
    bcrypt.compare(oldPassword, user.password).then(async (match) => {
        if (!match) res.json({ error: "Incorrect password!"})
        bcrypt.hash(newPassword, 10).then(async (hash) => {
            await customer.update({password: hash}, {where: { rememberToken: accessToken }});
        });
    });
};

// points
exports.points = async (req, res) => {
    const { accessToken } = req.header;
    const user = await customer.findOne({ where: { rememberToken: accessToken }});
    res.status(200).json(user.points);
};

// deleteAccount
exports.deleteAccount = async (req, res) => {
    const { accessToken } = req.header;
    const { password } = req.body;
    const user = await customer.findOne({ where: { rememberToken: accessToken }});
    bcrypt.compare(oldPassword, user.password).then(async (match) => {
        if (!match) {
            res.status(400).json({ error: "Incorrect password!"});
        } else {
            await user.destroy();
            res.status(200).json("Account successfully removed.");
        }
    });
};