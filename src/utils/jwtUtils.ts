import jwt from 'jsonwebtoken';

const generateToken = (payload: any): string => {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  const ttl = process.env.ACCESS_TOKEN_TTL ? parseInt(process.env.ACCESS_TOKEN_TTL) : 86400;

  if (!secret) {
    throw new Error('ACCESS_TOKEN_SECRET environment variable is not set');
  }

  return jwt.sign(payload, secret, {
    expiresIn: ttl,
  });
};

export { generateToken };
