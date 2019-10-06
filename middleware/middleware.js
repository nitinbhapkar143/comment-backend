const jwt = require(`jsonwebtoken`);

module.exports = {
    authentication: () => {
        return (req, res, next) => {
            const token = req.headers.authorization;
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = decoded;
                next();
            } catch (err) {
                return res.status(401).json({
                    status: false,
                    message: `Unauthorized`
                })
            }
        }
    },
}