import { Request, Response, NextFunction } from 'express';
import { sendErrorResponse, setAuthCookies } from '../utils/responseHandler';
import jwt, { Secret } from 'jsonwebtoken';
import { generateTokenPair, TokenPayload } from '../utils/jwtUtils';
import { PrismaClient } from '../../generated/prisma';

const prismaClient = new PrismaClient();

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const { accessToken, refreshToken } = req.cookies;

  if (!accessToken && !refreshToken) {
    sendErrorResponse(res, 401, 'Unauthorized', 'No token provided');
    return;
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as Secret) as TokenPayload;
    if (!decoded) {
      sendErrorResponse(res, 401, 'Unauthorized', 'Invalid token');
      return;
    }
    const user = await prismaClient.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!user) {
      sendErrorResponse(res, 401, 'Unauthorized', 'User not found');
      return;
    }

    res.locals.user = user;
    next();
    return;
  } catch (error) {
    if (refreshToken) {
      try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as Secret) as TokenPayload;

        if (!decoded) {
          sendErrorResponse(res, 401, 'Unauthorized', 'Invalid token');
          return;
        }

        const user = await prismaClient.user.findUnique({
          where: { id: decoded.id },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        });

        if (!user) {
          sendErrorResponse(res, 401, 'Unauthorized', 'User not found');
          return;
        }

        const tokenPair = generateTokenPair({ id: user.id, email: user.email });

        setAuthCookies(res, tokenPair);

        res.locals.user = user;
        next();
        return;
      } catch (refreshError) {
        sendErrorResponse(res, 401, 'Unauthorized', 'Invalid refresh token');
        return;
      }
    }
  }

  sendErrorResponse(res, 401, 'Unauthorized', 'Invalid or expired tokens');
};

export default authMiddleware;
