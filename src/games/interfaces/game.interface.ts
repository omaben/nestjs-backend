import { GameGeoRestriction } from "../enum/game-geo-restriction.enum";
import { GameProvider } from "../enum/game-provider.enum";
import { GameTag } from "../enum/game-tag.enum";
import { GameType } from "../enum/game-type.enum";

export interface Game {
    gameId: string;
    provider: GameProvider;
    title: string;
    isLive: boolean;
    isNewGame: boolean;
    mainImage?: string;
    rtpMin: number;
    rtpMax: number;
    popularity: number;
    stakeMin: number;
    stakeMax: number;
    types: GameType[];
    order: number;
    active: boolean;
    geoRestrictions?: GameGeoRestriction[];
    providerGameId: string;
    providerGameTitle: string;
    description?: string;
    tags?: GameTag[];
    media?: any;
    meta?: any;
    createdAt?: Date;
    updatedAt?: Date;
}