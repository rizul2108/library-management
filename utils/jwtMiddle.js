const jwt = require("jsonwebtoken");

const jwtM = (username)=>(req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    res.redirect("/login")
  }

  try {
    // Verify the JWT token using your secret key
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded payload to the request object for further use
    req.user = decode;

    // Call the next middleware or route handler
    next();
  } catch (err) {
    res.redirect("/signup")
}};

module.exports = jwtM;
