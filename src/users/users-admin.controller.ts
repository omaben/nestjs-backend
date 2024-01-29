import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Roles } from "src/auth/decorator/roles.decorator";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { AuthUser } from "src/auth/interfaces/auth-user.interface";
import { Role } from "../auth/enum/role.enum";
import { UsersService } from "./users.service";
import { ChangePasswordByAdminDto } from "src/users/dto/change-password-by-admin.dto";
import { SetAdminPasswordDto } from "src/users/dto/set-admin-password.dto";
import { ApimGuard } from "src/auth/guards/apim.guard";
import { GetAuthUser } from "src/auth/decorator/get-auth-user.decorator";
import { JwtService } from "@nestjs/jwt";
import { PubSubService } from "src/pubSub/pubSub.service";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { SetUserRolesDto } from "./dto/set-user-roles.dto";
import { UserListDto } from "./dto/user-list.dto";
import { UserDetailsDto } from "./dto/user-details.dto";
import { SetModuleOperatorRolesDto } from "./dto/set-module-operator-roles.dto";

@ApiTags('users (admin)')
@Controller('admin/users')
@UseGuards(ApimGuard, RolesGuard)
@Roles([Role.SUPER_ADMIN])
export class UsersAdminController {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private pubSubService: PubSubService,
    ) { }

    @Post('admin-password')
    @ApiOperation({
        summary: 'Set admin password',
        description:
            'Set admin password.'
    })
    async setAdminPassword(
        @Req() req,
        @Res() res,
        @Body() setAdminPasswordDto: SetAdminPasswordDto,
        @GetAuthUser() authUser: AuthUser
    ) {
        await this.usersService.setAdminPassword(
            setAdminPasswordDto,
            authUser,
            req
        );

        return res.send();
    }

    @Post('password-by-admin')
    @ApiOperation({
        summary: 'Change user password by admin',
        description:
            'Change user password by admin.'
    })
    async changePasswordByAdmin(
        @Req() req,
        @Res() res,
        @Body() changePasswordByAdminDto: ChangePasswordByAdminDto,
        @GetAuthUser() authUser: AuthUser
    ) {
        await this.usersService.changePassword(
            changePasswordByAdminDto.userId,
            changePasswordByAdminDto.newPassword,
            authUser,
            req
        );

        return res.send();
    }

    @Post('')
    @ApiOperation({
        summary: 'Create new user by admin',
        description:
            'Create new user by admin.'
    })
    async createUser(
        @Req() req,
        @Res() res,
        @Body() createUserDto: CreateUserDto,
        @GetAuthUser() authUser: AuthUser
    ) {
        const userSummary = await this.usersService.createUser(
            createUserDto,
            authUser,
            req
        );

        return res.send({ user: userSummary });
    }

    @Post('roles')
    @ApiOperation({
        summary: 'Set user roles by admin',
        description:
            'Set user roles by admin.'
    })
    async setUserRoles(
        @Req() req,
        @Res() res,
        @Body() setUserRolesDto: SetUserRolesDto,
        @GetAuthUser() authUser: AuthUser
    ) {
        const userSummary = await this.usersService.setUserRoles(
            setUserRolesDto,
            authUser,
            req
        );

        return res.send({ user: userSummary });
    }

    @Post('list')
    @ApiOperation({
        summary: 'Get user list by admin',
        description:
            'Get user list by admin.'
    })
    async getUserList(
        @Req() req,
        @Res() res,
        @Body() userListDto: UserListDto,
        @GetAuthUser() authUser: AuthUser
    ) {
        const { count, users } = await this.usersService.list(
            userListDto,
            req
        );

        return res.send({ count, users });
    }

    @Post('details')
    @ApiOperation({
        summary: 'Get user details by admin',
        description:
            'Get user details by admin.'
    })
    async getUserDetails(
        @Req() req,
        @Res() res,
        @Body() userDetailsDto: UserDetailsDto,
        @GetAuthUser() authUser: AuthUser
    ) {
        const user = await this.usersService.findOne({ userId: userDetailsDto.userId });
        const userSummary = this.usersService.convertToUserSummary(user);

        return res.send({ user: userSummary });
    }

    @Post('set-module-operator-roles')
    @ApiOperation({
        summary: 'Set module operator roles',
        description:
            'Set module operator roles by admin.'
    })
    async setModuleOperatorRoles(
        @Req() req,
        @Res() res,
        @Body() setModuleOperatorRolesDto: SetModuleOperatorRolesDto,
        @GetAuthUser() authUser: AuthUser
    ) {
        const user = await this.usersService.setModuleOperatorRoles(
            setModuleOperatorRolesDto,
            authUser,
            req
        );

        const userSummary = this.usersService.convertToUserSummary(user);

        return res.send({ user: userSummary });
    }
}