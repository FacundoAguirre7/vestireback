const jwt = require('jsonwebtoken')

// middleware para validar el token (rutas protegidas)
const verifyToken = (req, res, next) => {
  const token = req.header('auth-token')
  if (!token) return res.status(401).json({ error: 'Acceso denegado' })
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET)
    req.user = verified
    next() // continuamos
  } catch (error) {
    res.status(400).json({ error: 'token no es válido' })
  }
};

//middleware para verificar el token JWT y asegurarte de que el usuario
// que realiza la solicitud está autenticado.
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Debe de proporcionar un Token en la solicitud.' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    req.userId = decodedToken.data.id;
    next();// continuamos
  } catch (error) {
    res.status(401).json({ message: 'Token inválido.' });
  }
};

module.exports = {
  verifyToken,
  authMiddleware
}; 