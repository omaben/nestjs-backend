import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { AuthUser } from './interfaces/auth-user.interface';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async getToken(authUser: AuthUser): Promise<string> {
        return this.jwtService.sign(
            authUser,
            {
                expiresIn: '6h',
                secret: process.env.JWT_SECRET
            }
        );
    }
}
