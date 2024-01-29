import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthUser } from "src/auth/interfaces/auth-user.interface";
import { UpdateUserProfileDto } from "./dto/update-user-profile.dto";
import { UsersService } from "./users.service";
import { EnableTwoFactorAuthenticationDto } from "src/users/dto/enable-two-factor-authentication.dto";
import { ChangePasswordDto } from "src/users/dto/change-password.dto";
import { ApimGuard } from "src/auth/guards/apim.guard";
import { GetAuthUser } from "src/auth/decorator/get-auth-user.decorator";
import { JwtService } from "@nestjs/jwt";
import { PubSubService } from "src/pubSub/pubSub.service";
import { UpdateUserDocumentsDto } from "./dto/update-user-documents.dto";

@ApiTags('users')
@Controller('users')
@UseGuards(ApimGuard)
export class UsersController {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private pubSubService: PubSubService,
    ) { }

    @Get('me')
    @ApiOperation({
        summary: 'Send current user details',
        description:
            'Send current user details.'
    })
    async me(
        @Res() res,
        @GetAuthUser() authUser: AuthUser,
    ) {
        const user = await this.usersService.getUserSummary(authUser.userId);

        return res.send(user);
    }

    @Get('pubsub')
    @ApiOperation({
        summary: 'Get PubSub connection URL',
        description:
            'Get PubSub connection URL.'
    })
    async getPubSubConnection(
        @Res() res,
        @GetAuthUser() authUser: AuthUser,
    ) {
        const url = await this.pubSubService.generatePubSubConnectionUrl(authUser);

        return res.send({
            url,
            group: authUser.userId
        });
    }

    @Post('profile')
    @ApiOperation({
        summary: 'Update profile',
        description:
            'Update profile for username, birth date and more .'
    })
    async updateProfile(
        @Req() req,
        @Res() res,
        @GetAuthUser() authUser: AuthUser,
        @Body() updateUserProfileDto: UpdateUserProfileDto,
    ) {
        const user = await this.usersService.updateProfile(
            updateUserProfileDto,
            authUser,
            req
        );

        const userSummary = this.usersService.convertToUserSummary(user);

        const payload: AuthUser = {
            userId: userSummary.userId,
            email: userSummary.kyc.email.address,
            username: userSummary.username,
            roles: userSummary.roles,
            moduleRoles: userSummary.moduleRoles,
        };

        const token = this.jwtService.sign(
            payload,
            {
                expiresIn: '6h',
                secret: process.env.JWT_SECRET
            }
        );

        res.cookie(
            'bearer',
            token,
            {
                httpOnly: true,
                sameSite: 'none',
                secure: true
            }
        );

        return res.send({
            token,
            user: userSummary
        });
    }

    @Get('2fa')
    @ApiOperation({
        summary: 'Generate Time-Based-Two-factor authentication URL',
        description:
            'Generate Time-Based-Two-factor authentication URL.' +
            '<br/>This URL should be displayed as a QR code'
    })
    async generate2fa(
        @Req() req,
        @GetAuthUser() authUser: AuthUser,
        @Res() res
    ) {
        const otpAuthUrl = await this.usersService.generate2faUrl(authUser, authUser, req);

        return res.send(otpAuthUrl);
    }

    @Post('2fa')
    @ApiOperation({
        summary: 'Enable Time-Based-Two-factor authentication',
        description: 'Enable Time-Based-Two-factor authentication using Google Authenticator'
    })
    async enable2fa(
        @Req() req,
        @Res() res,
        @GetAuthUser() authUser: AuthUser,
        @Body() enableTwoFactorAuthenticationDto: EnableTwoFactorAuthenticationDto
    ) {
        await this.usersService.enableTwoFactorAuthentication(
            enableTwoFactorAuthenticationDto.code,
            authUser,
            req
        );

        return res.send();
    }

    @Post('password')
    @ApiOperation({
        summary: 'Set password',
        description:
            'Set password.'
    })
    async changePassword(
        @Req() req,
        @Res() res,
        @Body() changePasswordDto: ChangePasswordDto,
        @GetAuthUser() authUser: AuthUser
    ) {
        const velidAuthUser = await this.usersService.validateUser(
            authUser.email,
            changePasswordDto.oldPassword,
            changePasswordDto.twoFactorAuthenticationCode,
        )

        await this.usersService.changePassword(
            authUser.userId,
            changePasswordDto.newPassword,
            authUser,
            req
        );

        return res.send();
    }

    @Get('refresh-token')
    @ApiOperation({
        summary: 'Refresh user token',
        description:
            'Refresh user token.'
    })
    async refreshToken(
        @Req() req,
        @Res() res,
        @GetAuthUser() authUser: AuthUser
    ) {
        const userSummary = await this.usersService.getUserSummary(authUser.userId);

        const payload: AuthUser = {
            userId: userSummary.userId,
            email: userSummary.kyc.email.address,
            username: userSummary.username,
            roles: userSummary.roles,
            moduleRoles: userSummary.moduleRoles
        };

        const token = this.jwtService.sign(
            payload,
            {
                expiresIn: '6h',
                secret: process.env.JWT_SECRET
            }
        );

        res.cookie(
            'bearer',
            token,
            {
                httpOnly: true,
                sameSite: 'none',
                secure: true
            }
        );

        return res.send({
            token,
            user: userSummary,
            config: {
                baseImageUrl: process.env.BASE_IMAGE_URL
            }
        });
    }

    @Post('document')
    @ApiOperation({
        summary: 'Set user documents',
        description:
            'Set user documents.'
    })
    async updateDocuments(
        @Req() req,
        @Res() res,
        @Body() updateUserDocumentsDto: UpdateUserDocumentsDto,
        @GetAuthUser() authUser: AuthUser
    ) {
        const userSummary = await this.usersService.updateDocuments(
            updateUserDocumentsDto,
            authUser,
            req
        );

        return res.send({ user: userSummary });
    }
}