import jwt from 'jsonwebtoken';

const generateToken = (payload: any, secret: string, ttl: number): string => {
  return jwt.sign(payload, secret, {
    expiresIn: ttl,
  });
};

export { generateToken };
