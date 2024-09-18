const jwt = require('jsonwebtoken');
const ErrorResponse = require('@utils/errorResponse');

const { JWT_SECRET } = process.env;

exports.protect = (req, res, next) => {
  // Primero intentamos obtener el token desde el encabezado Authorization
  const authHeader = req.header('Authorization');
  const tokenFromHeader = authHeader && authHeader.split(' ')[1];

  // Luego intentamos obtener el token desde las cookies
  const tokenFromCookie = req.cookies.accessToken;

  // Seleccionamos el token correcto si está presente
  const token = tokenFromHeader || tokenFromCookie;

  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', null, 401));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch {
    return next(new ErrorResponse('Not authorized to access this route', null, 401));
  }
};
