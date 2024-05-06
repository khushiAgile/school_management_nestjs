import { Global, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Global()
@Injectable()
export class JWTTokenService {
  constructor(private readonly jwtService: JwtService) {}

  createToken(payload: any) {
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_TOKEN_KEY,
      expiresIn: '90d',
      // expiresIn: '5m',
    });

    return token;
  }

  verifyToken(token: string) {
    return new Promise((resolve, reject) => {
      try {
        const decode = this.jwtService.verify(token, {
          secret: process.env.JWT_TOKEN_KEY,
        });
        resolve(decode);
      } catch (error) {
        reject(error);
      }
    });
  }
}
