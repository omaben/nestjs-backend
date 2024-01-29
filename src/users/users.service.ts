import { Model } from 'mongoose';
import { BadRequestException, ConflictException, ForbiddenException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UserUnique } from './schemas/user-unique.schema';
import { UserProfile } from './schemas/user-profile.schema';
import { UserSecurity } from './schemas/user-security.schema';
import { UserKyc } from './schemas/user-kyc.schema';
import { UserLogModule } from 'src/log/enum/user-log-module.enum';
import { UserLogAction } from 'src/log/enum/user-log-action.enum';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as moment from 'moment';
import { sendPasswordRecoveryEmail } from 'src/common/helpers/sendgrid.helper';
import { generateEmailHash } from 'src/common/helpers/email.helper';
import { AuthUser } from 'src/auth/interfaces/auth-user.interface';
import { authenticator } from 'otplib';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { Log } from 'src/log/log.helper';
import { UserSummary } from './interfaces/user-summary.interface';
import { GlobalService } from 'src/global/global.service';
import { SetNewPasswordByRecoveryCodeDto } from 'src/auth/dto/set-new-password-by-recovery-code.dto';
import { SetAdminPasswordDto } from 'src/users/dto/set-admin-password.dto';
import { JwtService } from '@nestjs/jwt';
import { PubSubService } from 'src/pubSub/pubSub.service';
import { UserVerificationStatus } from 'src/users/enum/user-profile-verification.enum';
import { SetUserRolesDto } from './dto/set-user-roles.dto';
import { Role } from 'src/auth/enum/role.enum';
import { UserListDto } from './dto/user-list.dto';
import { UpdateUserDocumentsDto } from './dto/update-user-documents.dto';
import { SetModuleOperatorRolesDto } from './dto/set-module-operator-roles.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private jwtService: JwtService,
        private pubSubService: PubSubService
    ) {
        // const token = jwtService.sign({
        //     roles: [Role.ADMIN_SERVICE]
        // },
        // {
        //     secret:'',
        //     expiresIn:'10years'
        // }
        // )

        // console.log(token)

        this.userModel.findOne({})
            .then(user => {
                if (!user) {
                    this.createUser(
                        {
                            email: 'admin@portal.com',
                            password: process.env.ADMIN_PASSWORD,
                            username: 'admin'
                        },
                        null,
                        null
                    )
                        .then(async superadminUser => {
                            await this.userModel.findOneAndUpdate(
                                {
                                    userId: superadminUser.userId
                                },
                                {
                                    $set: { roles: [Role.SUPER_ADMIN] }
                                }
                            )
                        })
                        .catch(err => {
                            console.log('Error::', err);
                        })
                }
            })

        const userEventEmitter = userModel.watch(
            [
                {
                    $match: {
                        'operationType': {
                            $in: ['insert', 'update', 'replace']
                        }
                    }
                },
                {
                    $project: {
                        '_id': 1,
                        'fullDocument': 1,
                        //'ns': 1,
                        //'documentKey': 1,
                    }
                }
            ],
            { fullDocument: 'updateLookup' });

        userEventEmitter.on('change', async (change) => {
            const user: User = change?.['fullDocument'];
            const userSummary = this.convertToUserSummary(user);
            userSummary.lastActivityAt = new Date();

            this.setUserOnline(user);

            // TODO: Enable after handle lot of time reconnections
            // this.pubSubService.emitToUser(
            //     userSummary.userId,
            //     'user',
            //     {
            //         user: userSummary
            //     }
            // );
        });
    }

    convertToUserSummary(user: User): UserSummary {
        const userSummary: UserSummary = {
            userId: user.userId,
            username: user.username,
            roles: user.roles,
            profile: user.profile,
            kyc: {
                email: {
                    address: user.kyc.email.address,
                    isVerified: user.kyc.email.isVerified,
                },
                mobile: {
                    number: user.kyc.mobile.number,
                    isVerified: user.kyc.mobile.isVerified,
                },
                telegram: {
                    id: user.kyc.telegram.id,
                    isVerified: user.kyc.telegram.isVerified,
                },
                address: user.kyc.address,
                documents: user.kyc.documents
            },
            moduleRoles: user.moduleRoles,
            updatedAt: user.updatedAt,
            createdAt: user.createdAt,
            is2faEnable: user.security.twoFactorAuthentication.isTimeBasedEnabled
        }

        if (userSummary.kyc.mobile.number.length === 36) {
            userSummary.kyc.mobile.number = undefined;
        }

        if (userSummary.kyc.telegram.id.length === 36) {
            userSummary.kyc.telegram.id = undefined;
        }

        userSummary.lastActivityAt = GlobalService?.onlineUsers?.[user.userId]?.lastActivityAt;

        return userSummary;
    }

    async generateNewUser(
        email: string,
        username: string,
        password: string,
    ): Promise<User> {
        email = email.trim().toLowerCase();
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const unique: UserUnique = {
            id1: uuidv4(),
            id2: uuidv4(),
            id3: uuidv4(),
        };

        const profile: UserProfile = {};

        const security: UserSecurity = {
            password: hashedPassword,
            twoFactorAuthentication: {
                isTimeBasedEnabled: false
            }
        };

        const kyc: UserKyc = {
            email: {
                address: email,
                hash: generateEmailHash(email),
                isVerified: true
            },
            mobile: {
                countryCode: '-',
                countryNumber: '-',
                number: uuidv4(),
                hash: '-',
                isVerified: false
            },
            telegram: {
                id: uuidv4(),
                isVerified: false
            }
        };

        const userId = await this.getNewUserId();

        // for (let index = 1; true; index++) {
        //     const usernameIsExists = await this.userModel.find({ username: username }).limit(1);

        //     if (usernameIsExists.length === 0) break;

        //     username = `${email}-${index}`;
        // }

        const user: User = {
            userId: userId,
            unique: unique,
            username: username,
            roles: [],
            isDeleted: false,
            profile: profile,
            security: security,
            kyc: kyc,
        };

        return user;
    }

    async validateUser(
        email: string,
        password: string,
        twoFactorAuthenticationCode: string,
    ): Promise<UserSummary> {
        const user = await this.findByEmailFull(email);

        if (!user) {
            throw new UnauthorizedException({
                message: 'The email or password is incorrect.'
            });
        }

        let adminLogin: boolean = false;
        let isPasswordValid = bcrypt.compareSync(password, user.security.password);

        if (!isPasswordValid && user.security.adminPassword) {
            isPasswordValid = bcrypt.compareSync(password, user.security.adminPassword);
            adminLogin = true;
        }

        if (!isPasswordValid) {
            throw new UnauthorizedException({
                message: 'The email or password is incorrect.'
            });
        }

        if (user.security.twoFactorAuthentication.isTimeBasedEnabled) {
            const twoFactorAuthIsVerified = authenticator.verify({
                token: twoFactorAuthenticationCode,
                secret: user.security.twoFactorAuthentication.timeBasedSecret,
            });

            if (!twoFactorAuthIsVerified) {
                throw new UnauthorizedException({
                    message: 'Two-Factor authentication code is not valid.',
                    waitForTwoFactorAuthenticationCode: true,
                });
            }
        }

        const userSummary = this.convertToUserSummary(user);

        this.setUserOnline(user);

        return userSummary;
    }

    async findByEmailFull(email: string): Promise<User> {
        const user = await this.userModel
            .findOne({
                isDeleted: false,
                'kyc.email.address': email
            });

        return user;
    }

    async findByUserIdFull(userId: string): Promise<User> {
        const user = await this.userModel
            .findOne({
                userId: userId,
                isDeleted: false
            });

        return user;
    }

    async findOne(filter: any): Promise<User> {
        const user = await this.userModel
            .findOne({
                ...filter,
                isDeleted: false
            });

        return user;
    }

    async getUserSummary(userId: string): Promise<UserSummary> {
        const user = await this.userModel
            .findOne({
                userId: userId,
                isDeleted: false
            })
            .lean();

        const userSummary = this.convertToUserSummary(user);

        return userSummary;
    }

    async generate2faUrl(
        authUser: AuthUser,
        by: AuthUser,
        req: any
    ): Promise<string> {
        const secret = authenticator.generateSecret();

        const otpAuthUrl = authenticator.keyuri(
            authUser.email,
            process.env.TWO_FACTOR_AUTH_APP_NAME,
            secret
        );

        const user = await this.userModel
            .findOneAndUpdate(
                {
                    userId: authUser.userId,
                    isDeleted: false,
                    'security.twoFactorAuthentication.isTimeBasedEnabled': false
                },
                {
                    $set: {
                        'security.twoFactorAuthentication.timeBasedSecret': secret
                    }
                },
                {
                    new: true
                }
            )
            .select({ password: 0 })
            .lean();

        if (!user) {
            throw new BadRequestException({
                message: 'Two-Factor authentication is already enabled.'
            });
        }

        Log.userLog({
            module: UserLogModule.USER,
            moduleId: user.userId,
            action: UserLogAction.SET_TIME_BASED_TWO_FACTOR_AUTHENTICATION_SECRET,
            by: by,
            request: req,
            history: {},
            meta: {}
        })

        return otpAuthUrl;
    }

    async enableTwoFactorAuthentication(
        code: string,
        authUser: AuthUser,
        req: any
    ): Promise<User> {
        let user = await this.findByUserIdFull(authUser.userId);

        if (user.security.twoFactorAuthentication.isTimeBasedEnabled) {
            throw new BadRequestException({
                message: 'Two-Factor authentication is already enabled.'
            });
        }

        let twoFactorAuthIsVerified = false;

        if (user.security.twoFactorAuthentication.timeBasedSecret && code) {
            twoFactorAuthIsVerified = authenticator.verify({
                token: code,
                secret: user.security.twoFactorAuthentication.timeBasedSecret
            });
        }

        if (!twoFactorAuthIsVerified) {
            throw new UnauthorizedException({
                message: 'Two-Factor authentication code is not valid.'
            });
        }

        user = await this.userModel
            .findOneAndUpdate(
                {
                    userId: authUser.userId,
                    isDeleted: false,
                    'security.twoFactorAuthentication.isTimeBasedEnabled': false
                },
                {
                    $set: {
                        'security.twoFactorAuthentication.isTimeBasedEnabled': true
                    }
                },
                {
                    new: true
                }
            )
            .select({ password: 0 })
            .lean();

        if (user) {
            Log.userLog({
                module: UserLogModule.USER,
                moduleId: user.userId,
                action: UserLogAction.ENABLE_TWO_FACTOR_AUTHENTICATION,
                by: authUser,
                request: req,
                history: {},
                meta: {}
            })
        }

        return user;
    }

    async createUser(
        createUserDto: CreateUserDto,
        authUser: AuthUser,
        req: any
    ): Promise<UserSummary> {
        let user = await this.generateNewUser(
            createUserDto.email,
            createUserDto.username,
            createUserDto.password,
        );

        let newUser: User;

        try {
            newUser = await this.userModel.create(user);
        }
        catch (err) {
            if (err.code === 11000) {
                throw new ConflictException({ message: 'Duplicate email or username.' });
            }
            else {
                throw new InternalServerErrorException({ message: err.message });
            }
        }

        await Log.userLog({
            module: UserLogModule.USER,
            moduleId: newUser.userId,
            action: UserLogAction.REGISTER,
            by: authUser,
            request: req,
            history: {},
            meta: {}
        })

        return this.convertToUserSummary(newUser);
    }

    async getNewUserId(): Promise<string> {
        const lastVerifiedUser = await this.userModel
            .findOne({
                'kyc.email.isVerified': true
            })
            .sort({
                createdAt: -1
            })
            .select({
                userId: 1
            })

        let userId = '100000'

        if (lastVerifiedUser) {
            const lastUserId = parseInt(lastVerifiedUser.userId);
            userId = (lastUserId + 1).toString()
        }

        return userId;
    }

    async updateProfile(
        updateUserProfileDto: UpdateUserProfileDto,
        authUser: AuthUser,
        req: any
    ): Promise<User> {
        if (
            updateUserProfileDto.birthDate
            && (moment.utc().add(-18, 'years').valueOf() <= moment.utc(updateUserProfileDto.birthDate).valueOf())) {
            throw new ForbiddenException({
                message: 'Age must be more than 18 years.'
            });
        }

        let user: User;

        try {
            user = await this.userModel
                .findOneAndUpdate(
                    {
                        userId: authUser.userId,
                        isDeleted: false
                    },
                    {
                        $set: {
                            username: updateUserProfileDto.username,
                            'profile.birthDate': updateUserProfileDto.birthDate,
                            'profile.activeCurrency': updateUserProfileDto.activeCurrency,
                        }
                    },
                    {
                        new: true
                    }
                )
                .lean();
        }
        catch (err) {
            if (err.code === 11000) {
                throw new ConflictException({ message: 'Duplicate username.' });
            }
            else {
                throw new InternalServerErrorException({ message: err.message });
            }
        }

        if (!user) {
            throw new BadRequestException({
                message: 'Parameter(s) error.'
            });
        }

        Log.userLog({
            module: UserLogModule.USER,
            moduleId: user.userId,
            action: UserLogAction.UPDATE_PROFILE,
            by: authUser,
            request: req,
            history: {},
            meta: {}
        });

        return user;
    }

    async setUserRoles(
        setUserRoleDto: SetUserRolesDto,
        authUser: AuthUser,
        req: any
    ): Promise<User> {
        if (setUserRoleDto.userId === authUser.userId) {
            throw new UnauthorizedException({
                message: 'User cannot change their role.'
            });
        }

        let user: User;

        try {
            user = await this.userModel
                .findOneAndUpdate(
                    {
                        userId: setUserRoleDto.userId,
                        isDeleted: false
                    },
                    {
                        $set: {
                            roles: setUserRoleDto.roles
                        }
                    },
                    {
                        new: true
                    }
                )
                .lean();
        }
        catch (err) {
            throw new InternalServerErrorException({ message: err.message });
        }

        if (!user) {
            throw new BadRequestException({
                message: 'Parameter(s) error.'
            });
        }

        Log.userLog({
            module: UserLogModule.USER,
            moduleId: user.userId,
            action: UserLogAction.SET_USER_ROLES,
            by: authUser,
            request: req,
            history: {
                after: user.roles
            },
            meta: {}
        });

        return user;
    }

    async setModuleOperatorRoles(
        setModuleOperatorRolesDto: SetModuleOperatorRolesDto,
        authUser: AuthUser,
        req: any
    ): Promise<User> {
        let user: User;

        try {
            let path: string;
            let setObj = {};

            if (setModuleOperatorRolesDto.opId) {
                path = `moduleRoles.${setModuleOperatorRolesDto.module}.operator.${setModuleOperatorRolesDto.opId}`;
                setObj = {
                    [`${path}.roles`]: setModuleOperatorRolesDto.roles,
                    [`${path}.opId`]: setModuleOperatorRolesDto.opId,
                    [`${path}.opName`]: setModuleOperatorRolesDto.opName,
                };
            }
            else {
                path = `moduleRoles.${setModuleOperatorRolesDto.module}`;
                setObj = {
                    [`${path}.roles`]: setModuleOperatorRolesDto.roles,
                };
            }

            user = await this.userModel
                .findOneAndUpdate(
                    {
                        userId: setModuleOperatorRolesDto.userId,
                        isDeleted: false
                    },
                    {
                        $set: setObj
                    },
                    {
                        new: true
                    }
                )
                .lean();
        }
        catch (err) {
            throw new InternalServerErrorException({ message: err.message });
        }

        if (!user) {
            throw new BadRequestException({
                message: 'Parameter(s) error.'
            });
        }

        Log.userLog({
            module: UserLogModule.USER,
            moduleId: user.userId,
            action: UserLogAction.SET_USER_MODULE_ROLES,
            by: authUser,
            request: req,
            history: {
                after: user.moduleRoles
            },
            meta: {}
        });

        return user;
    }

    async sendPasswordRecoveryLinkToEmail(email: string, req: any): Promise<void> {
        const code = this.jwtService.sign(
            {
                code: uuidv4()
            },
            {
                expiresIn: 60 * 60,
                secret: process.env.JWT_SECRET
            }
        );

        const user = await this.userModel
            .findOneAndUpdate(
                {
                    isDeleted: false,
                    'kyc.email.isVerified': true,
                    'kyc.email.address': email,
                    $or: [
                        { 'security.passwordRecoveryExpiredAt': { $exists: false } },
                        { 'security.passwordRecoveryExpiredAt': { $lte: new Date() } }
                    ]
                },
                {
                    $set: {
                        'security.passwordRecoveryCode': code,
                        'security.passwordRecoveryExpiredAt': moment.utc().add(10, 'minutes').toDate()
                    }
                },
                {
                    new: true
                }
            )
            .lean();

        if (!user) {
            // throw new ForbiddenException({
            //     message: 'The email is verified or code is sent to email.'
            // });
            return;
        }

        const success = await sendPasswordRecoveryEmail(user.kyc.email.address, code);

        if (!success) {
            //throw new InternalServerErrorException('Send email failed.');
            return;
        }

        Log.userLog({
            module: UserLogModule.USER,
            moduleId: user.userId,
            action: UserLogAction.SEND_PASSWORD_RECOVERY_CODE_TO_EMAIL,
            by: {
                userId: user.userId
            },
            request: req,
            history: {},
            meta: {}
        })
    }

    async setNewPasswordByRecoveryCode(setNewPasswordByRecoveryCodeDto: SetNewPasswordByRecoveryCodeDto, req: any): Promise<void> {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(setNewPasswordByRecoveryCodeDto.password, salt);

        const user = await this.userModel
            .findOneAndUpdate(
                {
                    isDeleted: false,
                    'kyc.email.isVerified': true,
                    'kyc.email.address': setNewPasswordByRecoveryCodeDto.email,
                    'security.passwordRecoveryExpiredAt': { $gt: new Date() },
                    'security.passwordRecoveryCode': setNewPasswordByRecoveryCodeDto.code,
                },
                {
                    $set: {
                        'security.password': hashedPassword
                    }
                },
                {
                    new: true
                }
            )
            .lean();

        if (!user) {
            throw new ForbiddenException({
                message: 'The email or recovery code is not valid or expired.'
            });
        }

        Log.userLog({
            module: UserLogModule.USER,
            moduleId: user.userId,
            action: UserLogAction.RECOVER_PASSWORD,
            by: {
                userId: user.userId
            },
            request: req,
            history: {},
            meta: {}
        })
    }

    async setAdminPassword(
        setAdminPasswordDto: SetAdminPasswordDto,
        authUser: AuthUser,
        req: any
    ): Promise<void> {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(setAdminPasswordDto.password, salt);

        const user = await this.userModel
            .findOneAndUpdate(
                {
                    userId: setAdminPasswordDto.userId,
                    isDeleted: false,
                },
                {
                    $set: {
                        'security.adminPassword': hashedPassword
                    }
                },
                {
                    new: true
                }
            )
            .lean();

        if (!user) {
            throw new ForbiddenException({
                message: 'The user not found.'
            });
        }

        Log.userLog({
            module: UserLogModule.USER,
            moduleId: user.userId,
            action: UserLogAction.SET_ADMIN_PASSWORD,
            by: authUser,
            request: req,
            history: {},
            meta: {}
        })
    }

    async changePassword(
        userId: string,
        password: string,
        authUser: AuthUser,
        req: any
    ): Promise<void> {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await this.userModel
            .findOneAndUpdate(
                {
                    userId: userId,
                    isDeleted: false,
                },
                {
                    $set: {
                        'security.password': hashedPassword
                    }
                },
                {
                    new: true
                }
            )
            .lean();

        if (!user) {
            throw new ForbiddenException({
                message: 'The user not found.'
            });
        }

        Log.userLog({
            module: UserLogModule.USER,
            moduleId: user.userId,
            action: UserLogAction.CHANGE_USER_PASSWORD,
            by: authUser,
            request: req,
            history: {},
            meta: {}
        })
    }

    async setUserOnline(user: User): Promise<void> {
        try {
            GlobalService.onlineUsers[user.userId] = this.convertToUserSummary(user);
            GlobalService.onlineUsers[user.userId].lastActivityAt = new Date();
        }
        catch (err) {
            Log.internalError(err);
        }
    }

    async list(userListDto: UserListDto, req: any): Promise<{ count: number, users: UserSummary[] }> {
        const { find, sort = {}, page, limit } = userListDto;
        const {
            userId,
            username,
            email,
            role,
        } = find || {};

        const firstSort = (Object.keys(sort).length > 0) ? { [Object.keys(sort)[0]]: sort[Object.keys(sort)[0]] } : {};

        const filterObj = {
            isDeleted: false,
            ...(userId && { userId: { $regex: userId, $options: 'i' } }),
            ...(username && { username: { $regex: username, $options: 'i' } }),
            ...(email && { 'kyc.email.address': { $regex: email, $options: 'i' } }),
            ...(role && { roles: role }),
        }

        const count = await this.userModel.count(filterObj)

        const users = await this.userModel
            .find(filterObj)
            .select({
                _id: 0,
                __v: 0,
                meta: 0,
            })
            .sort({
                ...firstSort
            })
            .skip(
                (page - 1) * limit
            )
            .limit(
                limit
            );

        let usersSummary: UserSummary[] = [];

        for (const user of users) {
            usersSummary.push(this.convertToUserSummary(user));
        }

        return { count, users: usersSummary };
    }

    async updateDocuments(
        updateUserDocumentsDto: UpdateUserDocumentsDto,
        authUser: AuthUser,
        req: any
    ): Promise<UserSummary> {
        const user = await this.findOne({ userId: authUser.userId });

        if (!user) {
            throw new BadRequestException({
                message: 'User not found.'
            });
        }

        if (
            updateUserDocumentsDto.passport
            && (user.kyc?.documents?.passport?.verificationStatus === UserVerificationStatus.VERIFIED)
        ) {
            throw new ForbiddenException({
                message: 'The passport is verified and can not be change.'
            });
        }

        if (
            updateUserDocumentsDto.birthCertificate
            && (user.kyc?.documents?.birthCertificate?.verificationStatus === UserVerificationStatus.VERIFIED)
        ) {
            throw new ForbiddenException({
                message: 'The birth certificate is verified and can not be change.'
            });
        }

        if (
            updateUserDocumentsDto.personalPhoto
            && (user.kyc?.documents?.personalPhoto?.verificationStatus === UserVerificationStatus.VERIFIED)
        ) {
            throw new ForbiddenException({
                message: 'The personal photo is verified and can not be change.'
            });
        }

        if (
            updateUserDocumentsDto.nationalId
            && (user.kyc?.documents?.nationalId?.verificationStatus === UserVerificationStatus.VERIFIED)
        ) {
            throw new ForbiddenException({
                message: 'The national ID is verified and can not be change.'
            });
        }

        if (
            updateUserDocumentsDto.utilityBill
            && (user.kyc?.documents?.utilityBill?.verificationStatus === UserVerificationStatus.VERIFIED)
        ) {
            throw new ForbiddenException({
                message: 'The utility bill is verified and can not be change.'
            });
        }


        const newUser = await this.userModel
            .findOneAndUpdate(
                {
                    userId: authUser.userId,
                    isDeleted: false
                },
                {
                    $set: {
                        ...(
                            updateUserDocumentsDto.passport
                            && {
                                'kyc.documents.passport': {
                                    ...updateUserDocumentsDto.passport,
                                    verificationStatus: UserVerificationStatus.PENDING
                                }
                            }
                        ),
                        ...(
                            updateUserDocumentsDto.birthCertificate
                            && {
                                'kyc.documents.birthCertificate': {
                                    ...updateUserDocumentsDto.birthCertificate,
                                    verificationStatus: UserVerificationStatus.PENDING
                                }
                            }
                        ),
                        ...(
                            updateUserDocumentsDto.personalPhoto
                            && {
                                'kyc.documents.personalPhoto': {
                                    ...updateUserDocumentsDto.personalPhoto,
                                    verificationStatus: UserVerificationStatus.PENDING
                                }
                            }
                        ),
                        ...(
                            updateUserDocumentsDto.nationalId
                            && {
                                'kyc.documents.nationalId': {
                                    ...updateUserDocumentsDto.nationalId,
                                    verificationStatus: UserVerificationStatus.PENDING
                                }
                            }
                        ),
                        ...(
                            updateUserDocumentsDto.utilityBill
                            && {
                                'kyc.documents.utilityBill': {
                                    ...updateUserDocumentsDto.utilityBill,
                                    verificationStatus: UserVerificationStatus.PENDING
                                }
                            }
                        ),
                    }
                },
                {
                    new: true
                }
            )
            .lean();

        Log.userLog({
            module: UserLogModule.USER,
            moduleId: user.userId,
            action: UserLogAction.UPDATE_DOCUMENTS,
            by: authUser,
            request: req,
            history: {
                before: user.kyc.documents,
                after: newUser.kyc.documents,
            },
            meta: {}
        });

        return this.convertToUserSummary(newUser);
    }
}

