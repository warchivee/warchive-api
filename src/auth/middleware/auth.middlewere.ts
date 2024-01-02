import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtStrategy } from '../strategies/jwt.starategy';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtstrategy: JwtStrategy) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;

    if (token) {
      try {
        const user = this.jwtstrategy.validate(token);
        req['user'] = user;
        next();
      } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
      }
    } else {
      res.status(401).json({ message: 'Token not provided' });
    }
  }
}
