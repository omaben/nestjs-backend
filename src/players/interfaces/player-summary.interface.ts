import { Role } from "../../auth/enum/role.enum";
import { PlayerAddress } from "../schemas/player-address.schema";
import { PlayerDocuments } from "../schemas/player-documents.schema";
import { PlayerProfile } from "../schemas/player-profile.schema";
import { PlayerWallet } from "../schemas/player-wallet.schema";


export interface PlayerSummary {
    userId: string;
    opId: string;
    username: string;
    roles: Role[];
    profile: PlayerProfile;
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
        address: PlayerAddress;
        documents: PlayerDocuments;
    };
    wallet?: PlayerWallet;
    updatedAt: Date;
    createdAt: Date;
    lastActivityAt?: Date;
}