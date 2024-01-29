import { Game } from "./game.interface";

export interface GameGroup {
    groupId: string;
    opId: string;
    title: string;
    icon: string;
    order: number;
    description?: string;
    games: Game[];
    createdAt?: Date;
    updatedAt?: Date;
}