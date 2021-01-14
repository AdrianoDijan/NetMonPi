const jwt = require('jsonwebtoken');
const secret = "wX65FYILUZOFSi9C7UhcL7ke6tRyx9wbMbTQy3p+ZXI0ymAOnyIPkhqIVwaleYnwO2aDn39beLplRsO67Ejl+n7And39vgbZ71gEK/C48Tr2Od5nBHWD6RCtxTGbxoxoeV/JsyHb+qMrgA9EmmDKEeHVbubbp+HVlC3/x5+AHWJU40abE1ykX4jSw7AsLk5035XIsIhfRTDWc3kEmY7XMyCmwGdYYpk3srFQFQ=="

const withAuth = function(request, response, next) {
  const token = request.cookies.token;
  if (!token) {
    response.status(401).send('Unauthorized: No token provided');
  } else {
    jwt.verify(token, secret, function(err, decoded) {
      if (err) {
        response.status(401).send('Unauthorized: Invalid token');
      } else {
        request.username = decoded.username;
        next();
      }
    });
  }
}
module.exports = {withAuth: withAuth};