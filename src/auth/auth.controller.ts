import {
    Controller,
    Post,
    UseGuards,
    Res,
    Body,
    Get,
    Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
//import { Recaptcha } from '@nestlab/google-recaptcha';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthUser } from './interfaces/auth-user.interface';
import { LoginDto } from './dto/login.dto';
import { UserLogModule } from 'src/log/enum/user-log-module.enum';
import { UserLogAction } from 'src/log/enum/user-log-action.enum';
import { UsersService } from 'src/users/users.service';
import { GoogleGuard } from './guards/google.guard';
import { SetNewPasswordByRecoveryCodeDto } from './dto/set-new-password-by-recovery-code.dto';
import { ApimGuard } from './guards/apim.guard';
import { Log } from 'src/log/log.helper';
import { UserSummary } from 'src/users/interfaces/user-summary.interface';
import { RequestPasswordRecoveryLinkDto } from './dto/request-password-recovery-link.dto';

@Controller('auth')
@ApiTags('auth')
@UseGuards(ApimGuard)
export class AuthController {

    constructor(
        private readonly authService: AuthService,
        private usersService: UsersService,
    ) { }

    @Get('google')
    @UseGuards(GoogleGuard)
    @ApiOperation({
        summary: 'Login by Google account',
        description: 'Login by Google account'
    })
    async googleAuth(
        @Req() req
    ) { }

    @Get('google/redirect')
    @UseGuards(GoogleGuard)
    // @ApiOperation({
    //     summary: 'Login by Google account',
    //     description: 'Login by Google account'
    // })
    async googleAuthRedirect(
        @Req() req
    ) {
        const googleUser = req.user;
    }

    @Post('login')
    //@Recaptcha()
    @UseGuards(LocalAuthGuard)
    @ApiOperation({
        summary: 'User login by email and password',
        description: 'You need to get the email and password from the user and send it in <b>LoginDto</b> format'
    })
    async login(
        @Res() res,
        @Req() req,
        @Body() loginDto: LoginDto
    ) {
        const userSummary: UserSummary = req.user;

        const authUser: AuthUser = {
            userId: userSummary.userId,
            email: userSummary.kyc.email.address,
            username: userSummary.username,
            roles: userSummary.roles,
            moduleRoles: userSummary.moduleRoles
        };

        const token = await this.authService.getToken(authUser);

        res.cookie(
            'bearer',
            token,
            {
                httpOnly: true,
                sameSite: 'none',
                secure: true
            }
        );

        if (authUser.adminLogin) {
            Log.userLog({
                module: UserLogModule.AUTH,
                moduleId: authUser.userId,
                action: UserLogAction.ADMIN_LOGIN,
                by: authUser,
                request: req,
                history: {},
                meta: {}
            });
        }
        else {
            Log.userLog({
                module: UserLogModule.AUTH,
                moduleId: authUser.userId,
                action: UserLogAction.LOGIN,
                by: authUser,
                request: req,
                history: {},
                meta: {}
            });
        }

        return res.send({
            token,
            user: userSummary,
            config: {
                baseImageUrl: process.env.BASE_IMAGE_URL
            }
        });
    }

    @Post('request-password-recovery-link')
    @ApiOperation({
        summary: 'Send password recovery link to email',
        description:
            'Send password recovery link to email.'
    })
    async requestPasswordRecoveryLink(
        @Req() req,
        @Res() res,
        @Body() requestPasswordRecoveryLinkDto: RequestPasswordRecoveryLinkDto,
    ) {
        await this.usersService.sendPasswordRecoveryLinkToEmail(
            requestPasswordRecoveryLinkDto.email,
            req
        );

        return res.send();
    }

    @Post('set-new-password-by-recovery-code')
    @ApiOperation({
        summary: 'Recover password by code',
        description:
            'Recover password by recovery code and set new password.'
    })
    async setNewPasswordByRecoveryCode(
        @Req() req,
        @Res() res,
        @Body() setNewPasswordByRecoveryCodeDto: SetNewPasswordByRecoveryCodeDto,
    ) {
        await this.usersService.setNewPasswordByRecoveryCode(
            setNewPasswordByRecoveryCodeDto,
            req
        );

        return res.send();
    }
}