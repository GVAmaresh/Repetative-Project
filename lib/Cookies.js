// import jwt from 'jsonwebtoken';
// const JWT_SECRET = 'new-key-code';

// export default function authMiddleware(handler) {
//   return async (req, res) => {
//     const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');

//     if (!token) {
//       return res.status(401).json({ error: 'Unauthorized' });
//     }

//     try {
//       const decodedToken = await verifyToken(token);
//       req.user = decodedToken.user;

//       return handler(req, res);
//     } catch (error) {
//       console.error('Token verification error:', error);
//       return res.status(401).json({ error: 'Unauthorized' });
//     }
//   };
// }


// export default function handler(req, res) {
//   if (req.method === 'POST') {
//     const token = generateToken({ /* user data */ });
//     res.setHeader('Set-Cookie', `token=${token}; Path=/; HttpOnly; SameSite=Strict`);
//     return res.status(200).json({ token });
//   } else {
//     return res.status(405).json({ error: 'Method Not Allowed' });
//   }
// }



// function generateToken(payload) {
//   return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
// }

// async function verifyToken(token) {
//   return jwt.verify(token, JWT_SECRET);
// }
