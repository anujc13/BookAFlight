const { verify } = require("jsonwebtoken");

const validateToken = (req, res, next) => {
    const accessToken = req.header("accessToken");
    if (!accessToken) return res.status(401).json({ error: "Not logged in!" });
    verify(accessToken, "secretstring", (err, user) => {
        if (err) return res.status(403).json({ error: err });
        req.user = user; // if the refresh token is valid, req.user will be the user
        next();
    });
}

module.exports = { validateToken };