import jwt from 'jsonwebtoken';

const generateToken = (payload: any, secret: string, ttl: number): string => {
  return jwt.sign(payload, secret, {
    expiresIn: ttl,
  });
};

interface TokenPayload {
  id: number;
  email: string;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
  accessTokenTTL: number;
  refreshTokenTTL: number;
}

const validateTokenSecrets = () => {
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

  if (!accessTokenSecret) {
    throw new Error('ACCESS_TOKEN_SECRET environment variable is not set');
  }

  if (!refreshTokenSecret) {
    throw new Error('REFRESH_TOKEN_SECRET environment variable is not set');
  }

  return { accessTokenSecret, refreshTokenSecret };
};

const generateTokenPair = (payload: TokenPayload): TokenPair => {
  const { accessTokenSecret, refreshTokenSecret } = validateTokenSecrets();

  const accessTokenTTL = process.env.ACCESS_TOKEN_TTL ? parseInt(process.env.ACCESS_TOKEN_TTL) : 86400; // 1 day
  const refreshTokenTTL = process.env.REFRESH_TOKEN_TTL ? parseInt(process.env.REFRESH_TOKEN_TTL) : 604800; // 7 days

  const accessToken = generateToken(payload, accessTokenSecret, accessTokenTTL);
  const refreshToken = generateToken(payload, refreshTokenSecret, refreshTokenTTL);

  return {
    accessToken,
    refreshToken,
    accessTokenTTL,
    refreshTokenTTL,
  };
};

export { generateTokenPair, TokenPayload, TokenPair };
