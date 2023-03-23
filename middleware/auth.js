const { verify } = require("jsonwebtoken");

const validateToken = (req, res, next) => {
    const accessToken = req.header("accessToken");
    if (!accessToken) return res.json({ error: "Not logged in!" });

    try {
        const validToken = verify(accessToken, "secretString");
        if (validToken) {
            return next();
        }
    } catch (err) {
        return res.json(err);
    }
}

module.exports = { validateToken };