const { loginUser } = require("../services/authService");

const login = (req, res) => {
    const { identifier, password, role } = req.body;

    if (!identifier || !password || !role) {
        return res.status(400).json({
            success: false,
            message: "Identifier, password and role are required"
        });
    }

    const user = loginUser(identifier, password, role);

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Invalid login credentials"
        });
    }

    const result = loginUser(identifier, password, role);

res.json({
    success: true,
    message: "Login successful",
    user: result.user,
    token: result.token
});
};

module.exports = {
    login
};