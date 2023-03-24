const bcrypt = require("bcrypt");
const { customer } = require("../models");
const { sign } = require("jsonwebtoken");

// signup
exports.signup = async (req, res) => {
    const profile = req.body;
    const user = await customer.findOne({ where: { email: profile.email }});
    // check if user exists
    if (user) return res.status(400).json({ error: "Email already taken!" });
    
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
        return res.status(200).json("Customer created succesfully!");
    });
};

// login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    
    // check if user exists
    const user = await customer.findOne({ where : { email: email }});
    if (!user) return res.status(400).json({ error: "Incorrect email or password." });

    // check if email and password match
    bcrypt.compare(password, user.password).then(async (match) => {
        if (!match) return res.status(400).json({ error: "Incorrect email or password." });
        
        // generate token for login if successful
        const accessToken = sign(
            { email: user.email, id: user.id }, 
            "secretstring",
        );
        // user.rememberToken = accessToken;
        // await user.save();
        await customer.update({ rememberToken: accessToken }, { where: { id: user.id } });
        return res.status(200).json(accessToken);
        
    });
    
};

// change password - must be logged in
exports.changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user = await customer.findOne({ where: { id: req.user.id }});
    bcrypt.compare(oldPassword, user.password).then(async (match) => {
        if (!match) return res.json({ error: "Incorrect password!"})
        bcrypt.hash(newPassword, 10).then(async (hash) => {
            await user.update({password: hash}, {where: { rememberToken: accessToken }});
        });
    });
};

// view points - must be logged in
exports.viewPoints = async (req, res) => {
    const user = await customer.findOne({ where: { id: req.user.id }});
    res.status(200).json(user.points);
};

// delete account - must be logged in
exports.deleteAccount = async (req, res) => {
    const { password } = req.body;
    const user = await customer.findOne({ where: { id: req.user.id }});
    bcrypt.compare(password, user.password).then(async match => {
        if (!match) {
            res.status(400).json({ error: "Incorrect password!"});
        } else {
            await user.destroy();
            res.status(200).json("Account successfully removed.");
        }
    });
};