import jwt from 'jsonwebtoken';

//It will run before the actual controller in protected routes.
//If the token is valid, it calls next() and allows the request to continue.

const authenticate = (req, res, next) => {
  const JWT_SECRET = process.env.JWT_SECRET; //matches the one used when signing
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided or malformed header' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Contains userId and role
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};
 console.log('JWT_SECRET:', process.env.JWT_SECRET);

export default authenticate;
