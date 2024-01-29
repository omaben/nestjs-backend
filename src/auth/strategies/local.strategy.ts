import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { UserSummary } from 'src/users/interfaces/user-summary.interface';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {

  constructor(
    private userServece: UsersService
  ) {
    super({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    });
  }

  async validate(req: any, email: string, password: string): Promise<UserSummary> {
    const twoFactorAuthenticationCode: string = req?.body?.twoFactorAuthenticationCode;

    const user: UserSummary = await this.userServece.validateUser(email, password, twoFactorAuthenticationCode);

    return user;
  }
}