const jwt = require("jsonwebtoken");
const users = [
    {
        id: "F001",
        name: "Ramesh Patel",
        role: "farmer",
        mobile: "9876543210",
        password: "farmer123"
    },
    {
        id: "C001",
        name: "Berasia Centre Operator",
        role: "centre_operator",
        centreId: "BPC-01",
        operatorId: "operator01",
        password: "centre123"
    },
    {
        id: "A001",
        name: "PaddySetu Admin",
        role: "admin",
        adminId: "admin2026",
        password: "admin123"
    }
];

const loginUser = (identifier, password, role) => {
    const user = users.find((user) => {
        const matchesRole = user.role === role;

        const matchesIdentifier =
            user.mobile === identifier ||
            user.operatorId === identifier ||
            user.adminId === identifier;

        return matchesRole && matchesIdentifier;
    });

    if (!user || user.password !== password) {
        return null;
    }

    // Password response me nahi bhejna
    const { password: _, ...safeUser } = user;

    const token = jwt.sign(
    {
        userId: safeUser.id,
        role: safeUser.role
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "7d"
    }
);

return {
    user: safeUser,
    token
};
};

module.exports = {
    loginUser
};