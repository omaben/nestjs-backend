import { TModuleRoles } from "src/auth/types/module-roles.type";
import { Role } from "../../auth/enum/role.enum";
import { UserAddress } from "../schemas/user-address.schema";
import { UserDocuments } from "../schemas/user-documents.schema";
import { UserProfile } from "../schemas/user-profile.schema";

export interface UserSummary {
    userId: string;
    username: string;
    roles: Role[];
    moduleRoles: TModuleRoles;
    profile: UserProfile;
    kyc: {
        email: {
            address: string;
            isVerified: boolean;
        };
        mobile: {
            number: string;
            isVerified: boolean;
        };
        telegram: {
            id: string;
            isVerified: boolean;
        };
        address: UserAddress;
        documents: UserDocuments;
    };
    updatedAt: Date;
    createdAt: Date;
    lastActivityAt?: Date;
    is2faEnable?: boolean;
}