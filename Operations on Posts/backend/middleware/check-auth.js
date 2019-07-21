//checks wether user is authenticated or not
//                OR
// web token is valid or not
const jwt = require("jsonwebtoken");

// runs when we get an incoming requests
module.exports = (req, res, next) => { //
    try {
        const token = req.headers.authorization.split(" ")[1]; // get the token from the incoming request
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        req.userData = {email: decodedToken.email, userId: decodedToken.userId};
        next();
    }
    catch(error) {
        res.status(401).json({message: "You are not authenticated"});
    }
};