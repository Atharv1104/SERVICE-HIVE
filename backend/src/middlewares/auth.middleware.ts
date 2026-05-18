import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser, UserRole } from '../models/User';
import { CustomError } from '../utils/CustomError';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      throw new CustomError('Not authorized, no token provided', 401);
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      throw new CustomError('User not found', 404);
    }
    
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new CustomError('Not authorized', 401));
    }
    
    if (!roles.includes(req.user.role)) {
      return next(new CustomError(`Role (${req.user.role}) is not authorized to access this route`, 403));
    }
    
    next();
  };
};
